# Thaali · थाली

An offline, installable Hindi–English food diary for the Bihari home kitchen. Mobile-first, system fonts, no dependencies, build step, CDN, login, analytics, API or backend. Each family member uses their own phone; data is **only in that browser’s localStorage** (`thaali.v1`). Clearing browser data removes it. JSON export/restore is the transfer/backup method; importing replaces the current diary after a review prompt.

## Use / host

- Open once while online, then install from Chrome’s **Install / Add to home screen** or Safari’s **Share → Add to Home Screen**. Offline cache requires HTTPS or localhost. A normal reload works offline; a forced reload can intentionally bypass a browser’s offline cache.
- GitHub Pages: create a repository, upload these files at its root, then **Settings → Pages → Deploy from a branch → main / root**. No Actions/build needed. Relative URLs support project paths such as `/thaali-app/`. Live: [astrickcodes.github.io/Thaali/](https://astrickcodes.github.io/Thaali/), served from `main`.
- Local preview: `python3 -m http.server 8875 --bind 127.0.0.1`, then visit `http://127.0.0.1:8875/`. Do not rely on `file://` for offline installation. Stop the preview with Ctrl-C.
- The service worker now uses `thaali-static-v2`. Navigations and `index.html` are **network-first**, updating cached HTML when online and falling back to the last copy offline. Other static assets stay **cache-first**. This delivers new dish data to phones on their next online visit/reload after the worker updates, without touching diary storage. After changing static assets, bump `CACHE` again. An already-open tab needs a reload to show new data.

## Food data / method

The **173 dishes** and **91 ingredients** are inline arrays in `index.html`, not external modules. Each home dish contains raw edible ingredient grams **per serving**. Nutrition is the sum of `(grams / 100) × ingredient nutrient values`. Cooked water gain/loss does not add energy; yields and household measures are approximate. A standard cooked sabji/dal katori is 150 g; bhaat uses 53.5 g raw rice to represent about 150 g cooked. Dry chura/makhana use their stated lighter weights. Phulka uses 27 g atta (about 30 g). Unless explicitly stated otherwise, cups are 125 ml and glasses 200 ml; milk mass uses approximately 1.03 g/ml. Oil is stored in grams (1 ml ≈ 0.92 g). **Kam / normal / zyada scales only added cooking oil by 0.6 / 1 / 1.6; ghee and other ingredients do not change.**

Primary source: **74 ingredients** transcribed from [ICMR–NIN IFCT 2017, Table 1](https://www.nin.res.in/ebooks/IFCT2017.pdf), with exact food codes embedded per ingredient. Energy is converted from kJ to kcal by dividing by 4.184. Available carbohydrates and fibre are separate in IFCT. Plant/dairy data is raw; a boiled-egg ingredient explicitly uses the boiled entry. Recipe details show ingredient weights and sources for the selected quantity/oil.

Explicit non-IFCT fallbacks (17 entries):

- [USDA FoodData Central](https://fdc.nal.usda.gov/) generic values: besan, sattu (**chickpea flour proxy**, roasting/husk not measured), mustard oil, ghee/butter oil, sugar, plain whole-milk yogurt, lemon juice, chana saag (**spinach proxy**), noni (**purslane proxy**), jamun/Java plum; brewed unsweetened coffee, brewed green tea and soy sauce (no matching prepared IFCT entries; explicitly estimated).
- Plain makhana and roasted chana: **approximate Indian retail-label values**, not IFCT or USDA.
- Water and salt: non-energy ingredients. This is not a sodium tracker.

USDA carbohydrate definitions include fibre, unlike IFCT available carbohydrate. Mixed-source carb totals are therefore approximate. Where a source does not report fibre, the database uses 0 for the computation; it does **not** assert fibre is absent. Ingredient-specific notes expose this. Recipe proxies: puffed rice for ramdana lai, paneer for rasgulla chhena, ripe mango for achar; local vegetable varieties and recipes vary. Spices/salt are not exhaustively modelled; retained frying oil, sweets, bowl sizes and cooked yield have uncertainty. Custom ingredient recipes let a family record its own batch and servings.

### Added everyday foods

Dosa (plain/masala), idli, sambhar, coconut chutney; home/restaurant dry paneer chilli, matar paneer and Punjabi baingan bharta; raw cucumber/onion/beetroot/tomato/mixed salads; sweet-tempered aamla/tomato chutneys and thick peanut chutney; black coffee variants, lemon tea, green tea, cola and potato chips. Existing sweet/unsweetened chai, milk coffee, paneer bhujia, roasted/fried papad and kheera-tamatar salad were retained/merged rather than duplicated. Milk coffee now counts a more milk-rich 125 ml cup (90 g whole milk); papad uses an 11 g dry-urad recipe, with 5 g retained oil if fried. Previous diary entries keep their saved recipe snapshots.

Raw beetroot, aamla, green capsicum and tamarind pulp use IFCT Table 1 codes F001, E021, D033 and E064. **Source-based exceptions to generic calorie anchors:** the existing IFCT D043 cucumber is **19.6 kcal/100 g**, and IFCT F001 beetroot is **35.6 kcal/100 g**. These actual IFCT values are retained rather than forced to common USDA/generic values. All seven requested salad ingredients are available in the custom recipe builder; beetroot was the missing one.

Salads are 100 g per katori, without oil. Weighed foods now accept **grams** as well as the portion counter (including fractional portions, saved/restored with the diary). Chutneys use **1 tbsp = 15 g**; quantity **2 = 30 g**. Aamla/tomato chutneys explicitly include sugar and tempering oil; the peanut version is dense, not watery. A 300 g paneer-chilli plate is two 150 g katoris. Dosa/idli exclude side chutney and sambhar; log those separately.

Cola uses an approximate Coca-Cola Original label snapshot of **42 kcal/100 ml** (250 ml = 105 kcal, 300 ml = 126 kcal). Plain salted potato chips use a typical, **not currently verified brand label** estimate of **540 kcal/100 g** (25 g small packet = 135 kcal; 10 g = 54 kcal). Check the local pack. These label entries do not change with the oil selector. Brewed coffee/green-tea estimates are exposed in their ingredient sources.

Packaged foods use per-unit label values, not an invented ingredient recipe: [Maggi barcode 8901058000306](https://www.foodnutrifacts.com/products/nestl-maggi-noodles-masala-8901058000306) (442.9 kcal/100 g → 310.0 per 70 g), [Kurkure Masala Munch](https://www.justgotochef.com/products/kurkure-masala-munch-pack-100-grams) (558 kcal/100 g → 195.3 per 35 g), [Haldiram Aloo Bhujia barcode 8904004400779](https://www.foodnutrifacts.com/products/haldiram-s-haldiram-s-aloo-bhujia-8904004400779) (564 kcal/100 g → 169.2 per 30 g). Marie, Parle-G and bread are **typical label snapshots, not verified current packs**; size/brand/market/variant can differ. Check the pack and add a custom dish if necessary. Sources are explicit in each calculation sheet.

## Targets and diary

Mifflin–St Jeor × PAL (1.2 / 1.375 / 1.55 / 1.725), minus 250/500 kcal for the selected loss goal, with 1,200 kcal female / 1,500 male floors. Just-track mode has no calorie target. Protein: 0.83 g/kg/day (ICMR), with 1 g/kg shown as an optional upper suggestion, not a clinical limit. Asian-Indian BMI bands: <18.5, 18.5–22.9, 23–24.9, ≥25. Adults 18+ only. Historical charts compare with the **current** profile target; no historical target snapshots. Weight logs do not silently change the profile’s target weight input.

Entries keep dish snapshots, so deleting a custom dish does not alter earlier diary records. Repeat yesterday copies the previous **selected date’s** meal, preserving existing entries. Chart averages include only days with food logged (including incomplete days); blank bars are missing logs, not fasting. Streak ends today or yesterday. JSON restore validates schema, dates, ingredient IDs, numeric bounds and size before replacement; user text is escaped.

## Verification

`node nutrition-check.cjs` extracts the inline arrays without executing the UI, prints all original/new anchor kcal, 2-tbsp chutney totals, the total dish/ingredient counts, and IFCT source exceptions, and checks ingredients, bilingual names, unique IDs and oil scaling. Verified at 360 px in laptop Chromium: both languages; profile calculation; adding/editing food; quantity/oil/water; aliases; repeat meal; ingredient recipe; JSON validation/round-trip; weight and calorie charts; escaping; service-worker assets; offline normal reload with saved data. Three screenshots: [Me](screens/me.png), [Aaj with entries](screens/aaj.png), [Progress](screens/progress.png). Test-only browser data was removed; local preview was stopped.

November 2026 additions: headless laptop Chromium passed searches for `dosa`, `salad` and `चाय` with no JavaScript errors; a weighed 25 g salad saved/restored as a quarter serving; two-tablespoon chutney quantities and all seven custom salad ingredients worked. Deliberately stale HTML was replaced on online reload, and a subsequent offline reload still searched the new dishes successfully.

Existing-solution preflight: wger is maintained but server-backed and not a single-file, local-only Bihari PWA. Aahar was viewed once for screen inspiration only; no code copied.

**Estimates, not medical advice.** Not a clinical diet, micronutrient or sodium tool. Pregnancy, breastfeeding, illness and children need individual advice. Household oil absorption and recipes vary. Installation was checked for manifest/service-worker readiness in desktop Chromium’s mobile viewport, not physically on Android/iPhone.
