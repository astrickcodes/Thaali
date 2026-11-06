// No dependencies: extracts the inline database without executing the app.
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const raw=JSON.parse(html.match(/const RAW_INGREDIENTS = (\[.*\]);/)[1]);
const dishes=JSON.parse(html.match(/const DISHES = (\[.*\]);/)[1]);
const ingredients=Object.fromEntries(raw.map(i=>[i.id,i]));
function nutrients(d,oil=1){const n={kcal:0,protein:0,carbs:0,fat:0,fibre:0};if(d.label)return {...d.label};for(const r of d.recipe){assert(ingredients[r.id],r.id);for(const k in n)n[k]+=ingredients[r.id][k]*r.g/100*(r.id==='oil'?oil:1)}return n}
console.log(`Dishes: ${dishes.length} | Raw ingredients: ${raw.length}`);
console.log('Dish                         kcal / serving');
const anchors=[['phulka',70,90],['ghee-roti',110,130],['bhaat',180,200],['arhar-dal',120,160],['bhindi-bhujia',130,160],['potato-bhujia',170,200],['nenua-sabji',70,100],['laalSaag-saag',60,90],['kaddu-sabji',80,110],['ghee-litti',230,280],['thekua',130,170],['maggi',300,320],['chai-sugar',70,90],['chai-nosugar',40,50],['coffee',90,110],['black-coffee',0,5],['black-coffee-sugar',15,22],['lemon-tea',35,45],['green-tea',1,3],['cola-250',105,110],['cola-300',126,132],['potato-chips-25',130,140],['potato-chips-10',52,56],['papad-roast',35,40],['papad-fry',70,90],['paneer-bhujia',220,280],['paneer-chilli',280,350],['paneer-chilli-restaurant',280,350],['matar-paneer',220,280],['baingan-bharta',110,150],['cucumber-salad',19,20],['onion-salad',45,50],['beetroot-salad',35,37],['tomato-salad',19,21],['mixed-salad',30,40],['amla-chutney',15,30],['tomato-chutney',15,30],['peanut-chutney',70,90],['plain-dosa',120,150],['masala-dosa',250,320],['idli',55,65],['sambhar',110,150],['coconut-chutney',45,65]];
assert(dishes.length>=173);assert(raw.length>=91);
assert.equal(new Set(dishes.map(d=>d.id)).size,dishes.length);
for(const [id,min,max] of anchors){const d=dishes.find(d=>d.id===id);assert(d,id);const k=nutrients(d).kcal;console.log(d.name_en.padEnd(29)+' '+k.toFixed(1));assert(k>=min&&k<=max,`${id}: ${k} outside ${min}–${max}`)}
for(const d of dishes){assert(d.name_en&&d.name_hi&&d.aliases!==undefined);for(const k of Object.values(nutrients(d)))assert(Number.isFinite(k)&&k>=0,d.id)}
for(const id of ['cucumber','onion','tomato','beetroot','carrot','radish','lemon'])assert(ingredients[id],id);
for(const id of ['amla-chutney','tomato-chutney','peanut-chutney','coconut-chutney']){const d=dishes.find(x=>x.id===id);assert.equal(d.unit,'tbsp');assert.equal(d.grams,15);console.log((d.name_en+' (2 tbsp)').padEnd(29)+' '+(nutrients(d).kcal*2).toFixed(1))}
console.log('IFCT source exceptions: cucumber D043 = 19.6 kcal/100 g; beetroot F001 = 35.6 kcal/100 g (not generic-table anchors).');
const bhindi=dishes.find(d=>d.id==='bhindi-bhujia');
assert(Math.abs(nutrients(bhindi,1.6).kcal-nutrients(bhindi,.6).kcal-88.4)<.01);
console.log('PASS: anchors, recipe references, bilingual names, unique IDs, non-negative nutrients, oil scaling.');
