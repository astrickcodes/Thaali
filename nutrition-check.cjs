// No dependencies: extracts the inline database without executing the app.
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const raw=JSON.parse(html.match(/const RAW_INGREDIENTS = (\[.*\]);/)[1]);
const dishes=JSON.parse(html.match(/const DISHES = (\[.*\]);/)[1]);
const ingredients=Object.fromEntries(raw.map(i=>[i.id,i]));
function nutrients(d,oil=1){const n={kcal:0,protein:0,carbs:0,fat:0,fibre:0};if(d.label)return {...d.label};for(const r of d.recipe){assert(ingredients[r.id],r.id);for(const k in n)n[k]+=ingredients[r.id][k]*r.g/100*(r.id==='oil'?oil:1)}return n}
console.log(`Dishes: ${dishes.length} | Raw ingredients: ${raw.length}`);
console.log('Dish                         kcal / serving');
const anchors=[['phulka',70,90],['ghee-roti',110,130],['bhaat',180,200],['arhar-dal',120,160],['bhindi-bhujia',130,160],['potato-bhujia',170,200],['nenua-sabji',70,100],['laalSaag-saag',60,90],['kaddu-sabji',80,110],['ghee-litti',230,280],['thekua',130,170],['maggi',300,320],['chai-sugar',70,90]];
assert(dishes.length>=145);assert(raw.length>=60&&raw.length<=90);
assert.equal(new Set(dishes.map(d=>d.id)).size,dishes.length);
for(const [id,min,max] of anchors){const d=dishes.find(d=>d.id===id);assert(d,id);const k=nutrients(d).kcal;console.log(d.name_en.padEnd(29)+' '+k.toFixed(1));assert(k>=min&&k<=max,`${id}: ${k} outside ${min}–${max}`)}
for(const d of dishes){assert(d.name_en&&d.name_hi&&d.aliases!==undefined);for(const k of Object.values(nutrients(d)))assert(Number.isFinite(k)&&k>=0,d.id)}
const bhindi=dishes.find(d=>d.id==='bhindi-bhujia');
assert(Math.abs(nutrients(bhindi,1.6).kcal-nutrients(bhindi,.6).kcal-88.4)<.01);
console.log('PASS: anchors, recipe references, bilingual names, unique IDs, non-negative nutrients, oil scaling.');
