(function () {
    "use strict";

    const VERSION = "1.0.0";
    const RULES = {
        "курица": { role:"protein", substitutes:["индейка","говядина"], pairs:["картофель","рис","гречка","паста","лук","морковь","чеснок","помидоры","перец","брокколи"] },
        "индейка": { role:"protein", substitutes:["курица"], pairs:["картофель","рис","гречка","паста","лук","морковь","чеснок","помидоры","перец","брокколи"] },
        "говядина": { role:"protein", substitutes:["свинина","индейка"], pairs:["картофель","гречка","лук","морковь","чеснок","помидоры","перец"] },
        "свинина": { role:"protein", substitutes:["курица","говядина"], pairs:["картофель","гречка","лук","морковь","чеснок","капуста"] },
        "яйца": { role:"protein", substitutes:[], pairs:["помидоры","перец","лук","сыр","молоко","картофель","брокколи"] },
        "лосось": { role:"protein", substitutes:["тунец"], pairs:["картофель","рис","брокколи","огурец","помидоры"] },
        "тунец": { role:"protein", substitutes:["лосось","курица"], pairs:["рис","паста","огурец","помидоры","капуста"] },
        "креветки": { role:"protein", substitutes:["курица"], pairs:["рис","паста","чеснок","помидоры","брокколи"] },
        "картофель": { role:"carb", substitutes:["рис","гречка"], pairs:["курица","индейка","говядина","свинина","яйца","лук","морковь","чеснок","сыр"] },
        "рис": { role:"carb", substitutes:["гречка","картофель"], pairs:["курица","индейка","тунец","креветки","морковь","перец","брокколи"] },
        "гречка": { role:"carb", substitutes:["рис","картофель"], pairs:["курица","индейка","говядина","лук","морковь"] },
        "паста": { role:"carb", substitutes:["рис"], pairs:["курица","индейка","тунец","креветки","помидоры","сыр","чеснок","лук"] },
        "овсянка": { role:"carb", substitutes:["гречка"], pairs:["банан","яблоко","молоко","йогурт","мед"] },
        "чечевица": { role:"carb", substitutes:["фасоль"], pairs:["морковь","лук","чеснок","помидоры"] },
        "фасоль": { role:"carb", substitutes:["чечевица"], pairs:["помидоры","лук","морковь","чеснок"] },
        "лук": { role:"aromatic", substitutes:[], pairs:["курица","говядина","картофель","рис","гречка","паста","яйца"] },
        "морковь": { role:"vegetable", substitutes:[], pairs:["курица","картофель","рис","гречка","чечевица","лук"] },
        "помидоры": { role:"vegetable", substitutes:[], pairs:["яйца","курица","паста","тунец","сыр","перец"] },
        "огурец": { role:"vegetable", substitutes:[], pairs:["курица","тунец","сыр","йогурт","капуста"] },
        "перец": { role:"vegetable", substitutes:[], pairs:["курица","яйца","рис","помидоры","брокколи"] },
        "брокколи": { role:"vegetable", substitutes:[], pairs:["курица","лосось","креветки","яйца","рис"] },
        "капуста": { role:"vegetable", substitutes:[], pairs:["курица","свинина","морковь","огурец"] },
        "кабачок": { role:"vegetable", substitutes:[], pairs:["курица","яйца","сыр","помидоры"] },
        "чеснок": { role:"aromatic", substitutes:[], pairs:["курица","паста","креветки","картофель","помидоры"] },
        "сыр": { role:"dairy", substitutes:["моцарелла","творог"], pairs:["яйца","паста","картофель","помидоры","кабачок"] },
        "моцарелла": { role:"dairy", substitutes:["сыр"], pairs:["помидоры","паста","яйца","курица"] },
        "творог": { role:"dairy", substitutes:["сыр"], pairs:["яйца","банан","яблоко","йогурт"] },
        "йогурт": { role:"dairy", substitutes:["сметана"], pairs:["банан","овсянка","огурец","творог"] },
        "сметана": { role:"dairy", substitutes:["йогурт"], pairs:["картофель","курица","творог","огурец"] },
        "молоко": { role:"dairy", substitutes:["йогурт"], pairs:["овсянка","яйца","творог"] },
        "банан": { role:"fruit", substitutes:["яблоко"], pairs:["овсянка","творог","йогурт","мед"] },
        "яблоко": { role:"fruit", substitutes:["банан"], pairs:["овсянка","творог","йогурт","мед"] },
        "апельсин": { role:"fruit", substitutes:["яблоко"], pairs:["йогурт","творог"] },
        "масло": { role:"fat", substitutes:["сливочное-масло"], pairs:["курица","картофель","яйца","паста","гречка","рис"] },
        "сливочное-масло": { role:"fat", substitutes:["масло"], pairs:["картофель","паста","гречка","овсянка","яйца"] },
        "мед": { role:"sweet", substitutes:["сахар"], pairs:["овсянка","творог","йогурт","банан","яблоко"] },
        "сахар": { role:"sweet", substitutes:["мед"], pairs:["овсянка","творог"] }
    };

    function normalize(id) { return String(id || "").toLowerCase().trim(); }
    function rule(id) { return RULES[normalize(id)] || null; }
    function role(id) { return rule(id)?.role || window.recipeProIntelligence?.classify?.(normalize(id)) || "other"; }

    function compatibility(a,b) {
        a=normalize(a); b=normalize(b);
        if (!a || !b) return {score:0,level:"unknown",reason:"Недостаточно данных."};
        if (a===b) return {score:100,level:"same",reason:"Один и тот же продукт."};
        const ra=rule(a), rb=rule(b);
        if (ra?.pairs?.includes(b) || rb?.pairs?.includes(a)) return {score:90,level:"excellent",reason:"Продукты хорошо сочетаются."};
        if (ra?.substitutes?.includes(b) || rb?.substitutes?.includes(a)) return {score:70,level:"substitute",reason:"Продукты близки по роли и могут заменять друг друга."};
        const roles=[role(a),role(b)];
        if (roles.includes("protein") && (roles.includes("carb") || roles.includes("vegetable"))) return {score:72,level:"good",reason:"Сочетание подходит для полноценного блюда."};
        if (roles.includes("dairy") && roles.includes("fruit")) return {score:78,level:"good",reason:"Хорошее сочетание для лёгкого блюда или завтрака."};
        return {score:45,level:"neutral",reason:"Прямого правила сочетания нет, но продукты не считаются несовместимыми."};
    }

    function analyze(ids) {
        const unique=[...new Set((ids||[]).map(normalize).filter(Boolean))];
        const pairs=[]; let total=0,count=0;
        for(let i=0;i<unique.length;i++) for(let j=i+1;j<unique.length;j++){
            const result=compatibility(unique[i],unique[j]);
            pairs.push({a:unique[i],b:unique[j],...result}); total+=result.score; count++;
        }
        return {
            products:unique,
            pairs,
            averageCompatibility:count?Math.round(total/count):0,
            roles:unique.reduce((out,id)=>{const r=role(id);(out[r] ||= []).push(id);return out;},{})
        };
    }

    function suggestions(ids,limit=6) {
        const existing=new Set((ids||[]).map(normalize)); const scores=new Map();
        existing.forEach(id=>
            (rule(id)?.pairs||[]).forEach(candidate=>{
                if(!existing.has(candidate)) scores.set(candidate,(scores.get(candidate)||0)+20);
            })
        );
        return [...scores.entries()].sort((a,b)=>b[1]-a[1]).slice(0,limit).map(([id,score])=>({
            id,name:window.products?.[id]?.name||id,score
        }));
    }

    function substitutions(id,limit=5) {
        return (rule(id)?.substitutes||[]).slice(0,limit).map(candidate=>({
            id:candidate,name:window.products?.[candidate]?.name||candidate,reason:"Похожий продукт с близкой ролью."
        }));
    }

    window.recipeProIngredientIntelligence={version:VERSION,rules:RULES,role,compatibility,analyze,suggestions,substitutions};
})();