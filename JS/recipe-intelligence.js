(function () {
    "use strict";

    const VERSION = "3.0.0";

    const SEMANTICS = {
        protein: new Set(["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр","моцарелла"]),
        carb: new Set(["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"]),
        vegetable: new Set(["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"]),
        fruit: new Set(["банан","яблоко","апельсин"]),
        fat: new Set(["масло","сливочное-масло","сметана","мед","сахар"]),
        dairy: new Set(["творог","сыр","моцарелла","йогурт","сметана","молоко"])
    };

    const DISHES = [
        {id:"chicken-potato",type:"roast",title:"Курица с картофелем",emoji:"🍗",time:45,requires:["курица","картофель"],supports:["лук","морковь","чеснок","масло"],replaceable:{курица:["индейка"],картофель:["рис","гречка"]}},
        {id:"chicken-stew",type:"stew",title:"Тушёная курица с овощами",emoji:"🍲",time:35,requires:["курица"],anyOf:["vegetable"],supports:["картофель","морковь","лук","чеснок"],replaceable:{курица:["индейка"],}},
        {id:"chicken-soup",type:"stew",title:"Куриный суп",emoji:"🍲",time:45,requires:["курица","картофель"],supports:["морковь","лук","чеснок"],replaceable:{курица:["индейка"],картофель:["рис","гречка"]}},
        {id:"chicken-bowl",type:"bowl",title:"Боул с курицей",emoji:"🥗",time:20,requires:["курица"],anyOf:["carb","vegetable"],supports:["рис","гречка","картофель","огурец","помидоры","морковь"],replaceable:{курица:["индейка","тунец"],рис:["гречка","картофель"]}},
        {id:"pasta-chicken",type:"pasta",title:"Паста с курицей",emoji:"🍝",time:25,requires:["паста","курица"],supports:["лук","помидоры","чеснок","сыр"],replaceable:{курица:["индейка","тунец"],паста:["гречка","рис"]}},
        {id:"buckwheat-chicken",type:"bowl",title:"Гречка с курицей",emoji:"🍗",time:30,requires:["гречка","курица"],supports:["лук","морковь"],replaceable:{курица:["индейка"],гречка:["рис"]}},
        {id:"omelet-vegetables",type:"omelet",title:"Омлет с овощами",emoji:"🍳",time:15,requires:["яйца"],anyOf:["vegetable"],supports:["сыр","молоко","масло"],replaceable:{сыр:["моцарелла","творог"]}},
        {id:"shakshuka",type:"omelet",title:"Шакшука",emoji:"🍳",time:20,requires:["яйца","помидоры"],supports:["лук","перец","чеснок"],replaceable:{помидоры:["перец"]}},
        {id:"chicken-salad",type:"salad",title:"Салат с курицей",emoji:"🥗",time:15,requires:["курица"],anyOf:["vegetable"],supports:["огурец","помидоры","перец","капуста"],replaceable:{курица:["индейка","тунец"]}},
        {id:"potato-casserole",type:"roast",title:"Картофельная запеканка",emoji:"🥔",time:40,requires:["картофель"],anyOf:["protein","dairy"],supports:["лук","сыр","сметана"],replaceable:{картофель:["рис","гречка"],сыр:["моцарелла","творог"]}},
        {id:"cottage-cheese-pancakes",type:"omelet",title:"Сырники",emoji:"🥞",time:25,requires:["творог"],supports:["яйца"],replaceable:{творог:["сыр"],яйца:[]}},
        {id:"oatmeal-banana",type:"porridge",title:"Овсянка с бананом",emoji:"🥣",time:12,requires:["овсянка","банан"],supports:["молоко","йогурт","мед"],replaceable:{банан:["яблоко","апельсин"],овсянка:["гречка"]}},
        {id:"rice-chicken",type:"bowl",title:"Рис с курицей и овощами",emoji:"🍚",time:30,requires:["рис","курица"],anyOf:["vegetable"],supports:["морковь","лук","перец","брокколи"],replaceable:{курица:["индейка"],рис:["гречка"]}},
        {id:"lentil-soup",type:"stew",title:"Чечевичный суп",emoji:"🍲",time:35,requires:["чечевица"],supports:["морковь","лук","чеснок","помидоры"],replaceable:{чечевица:["фасоль"]}}
    ];

    const TYPE_REQUIREMENTS = {
        bowl:[["protein"],["carb","vegetable"]],
        roast:[["protein","dairy"],["carb","vegetable"]],
        stew:[["protein","carb"],["vegetable"]],
        salad:[["vegetable"],["vegetable"]],
        omelet:[["eggs"]],
        pasta:[["pasta"],["protein","vegetable"]],
        porridge:[["oats"]]
    };

    function normalizeId(id){ return String(id||"").toLowerCase().trim(); }

    function classify(id){
        id=normalizeId(id);
        const p=window.products?.[id];
        if(id==="яйца"||p?.category==="eggs") return "eggs";
        if(id==="паста") return "pasta";
        if(id==="овсянка") return "oats";
        for(const [category,set] of Object.entries(SEMANTICS)){
            if(set.has(id)||p?.role===category) return category;
        }
        return "other";
    }

    function categories(ids){
        return ids.reduce((out,id)=>{
            const c=classify(id);
            (out[c] ||= []).push(id);
            return out;
        },{});
    }

    function hasId(ids,id){ return ids.includes(id); }
    function hasCategory(ids,category){ return ids.some(id=>classify(id)===category); }

    function ingredientMatches(userId, requiredId, dish){
        if(userId===requiredId) return {matched:true,exact:true,via:null};
        const replacements=dish.replaceable?.[requiredId]||[];
        if(replacements.includes(userId)) return {matched:true,exact:false,via:requiredId};
        return {matched:false,exact:false,via:null};
    }

    function scoreDish(dish,ids,intent={}){
        let score=0;
        const matched=[];
        const missing=[];
        const replacements=[];

        (dish.requires||[]).forEach(requiredId=>{
            if(hasId(ids,requiredId)){
                score+=45;
                matched.push(requiredId);
                return;
            }

            const replacementValues=(dish.replaceable?.[requiredId]||[]);
            const replacement=replacementValues.find(value=>hasId(ids,value));

            if(replacement){
                score+=30;
                matched.push(replacement);
                replacements.push(requiredId+" → "+replacement);
            }else{
                score-=52;
                missing.push(requiredId);
            }
        });

        if(dish.anyOf){
            const category=dish.anyOf.find(item=>hasCategory(ids,item));
            if(category){
                score+=30;
                matched.push(category);
            }else{
                score-=20;
                missing.push(dish.anyOf.join(" / "));
            }
        }

        (dish.supports||[]).forEach(id=>{
            if(hasId(ids,id)){
                score+=9;
                matched.push(id);
            }
        });

        if(intent.type===dish.type) score+=55;
        if(intent.maxTime) score+=dish.time<=intent.maxTime?28:-Math.min(22,(dish.time-intent.maxTime)*0.5);
        if(intent.minTime) score+=dish.time>=intent.minTime?8:-10;
        if(intent.faster) score+=dish.time<=20?22:0;

        if(intent.highProtein||intent.minProtein){
            if(hasCategory(ids,"protein")||hasCategory(ids,"eggs")) score+=16;
            if(["bowl","stew","salad"].includes(dish.type)) score+=5;
        }

        if(intent.lessCalories) score+=["salad","bowl","omelet","porridge"].includes(dish.type)?8:0;

        return {
            dish,
            score,
            matched:[...new Set(matched)],
            missing:[...new Set(missing)],
            replacements,
            compatible:missing.length===0
        };
    }

    function findDishCandidates(ids,intent={},limit=8){
        return DISHES.map(dish=>scoreDish(dish,ids,intent))
            .sort((a,b)=>b.score-a.score)
            .slice(0,limit);
    }

    function chooseType(ids,intent={},allowedTypes=Object.keys(TYPE_REQUIREMENTS)){
        const candidates=findDishCandidates(ids,intent,12).filter(item=>allowedTypes.includes(item.dish.type));

        const compatible=candidates.filter(item=>item.compatible);
        if(compatible.length){
            compatible.sort((a,b)=>b.score-a.score);
            return {type:compatible[0].dish.type,score:compatible[0].score,dish:compatible[0].dish};
        }

        return null;
    }

    function compatible(type,ids,intent={}){
        const candidates=findDishCandidates(ids,intent,12).filter(item=>item.dish.type===type);
        if(!candidates.length) return {score:0,missing:[],matched:[],compatible:false};
        const best=candidates[0];
        return {score:best.score,missing:best.missing,matched:best.matched,replacements:best.replacements,compatible:best.compatible,dish:best.dish};
    }

    function getPantry(type,ids){
        const oil=hasId(ids,"масло")||hasId(ids,"сливочное-масло");
        const map={stew:["water","salt","pepper"],roast:["cookingOil","salt","pepper"],bowl:["salt"],salad:["cookingOil","salt","pepper"],omelet:["cookingOil","salt","pepper"],pasta:["salt"],porridge:["salt"]};
        return (map[type]||[]).filter(key=>!(key==="cookingOil"&&oil)).map(key=>({type:"pantry",key,source:"RecipePro",required:false}));
    }

    function explain(type,ids,pantry=[]){
        const best=findDishCandidates(ids,{type},12).find(item=>item.dish.type===type);
        const explicitProducts=ids.map(id=>window.products?.[id]?.name||id);
        return {
            dish:best?.dish||null,
            explicitProducts,
            matched:best?.matched||[],
            missing:best?.missing||[],
            replacements:best?.replacements||[],
            pantry:pantry.map(item=>item.key),
            message:pantry.length?"RecipePro использовал ваши продукты и добавил базовые кухонные ингредиенты.":"RecipePro построил блюдо из указанных продуктов."
        };
    }

    function getBestDish(ids,intent={}){
        return findDishCandidates(ids,intent,8)[0]||null;
    }

    window.recipeProIntelligence={
        version:VERSION,
        classify,
        categories,
        compatible,
        chooseType,
        getPantry,
        explain,
        findDishCandidates,
        getBestDish,
        ingredientMatches,
        dishes:DISHES
    };
})();