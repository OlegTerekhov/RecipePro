(function () {
    "use strict";

    const VERSION = "1.0.0";

    const TYPES = {
        bowl: { label:"Боул", emoji:"🥗", time:20, steps:["Подготовьте основные ингредиенты.","Приготовьте основу до готовности.","Соедините ингредиенты в одной миске и подавайте."] },
        roast: { label:"Запечённое блюдо", emoji:"🍽️", time:40, steps:["Нарежьте ингредиенты одинаковыми кусочками.","Смешайте продукты и добавьте базовые специи.","Запекайте до полной готовности основных ингредиентов."] },
        stew: { label:"Тушёное блюдо", emoji:"🍲", time:35, steps:["Нарежьте основные ингредиенты.","Обжарьте ароматные ингредиенты при необходимости.","Добавьте остальные продукты и немного воды, затем тушите до готовности."] },
        salad: { label:"Салат", emoji:"🥗", time:15, steps:["Подготовьте и нарежьте продукты.","Соедините ингредиенты.","Заправьте и аккуратно перемешайте."] },
        omelet: { label:"Омлет", emoji:"🍳", time:15, steps:["Подготовьте яйца и дополнительные ингредиенты.","Обжарьте овощи или другие добавки.","Добавьте яйца и готовьте до полной готовности."] },
        pasta: { label:"Паста", emoji:"🍝", time:25, steps:["Отварите пасту до готовности.","Приготовьте белковую или овощную часть.","Соедините пасту с соусом и добавками."] },
        porridge: { label:"Каша", emoji:"🥣", time:12, steps:["Подготовьте крупу.","Сварите до мягкости.","Добавьте подходящие дополнительные ингредиенты."] }
    };

    function normalize(id) { return String(id || "").toLowerCase().trim(); }

    function unique(ids) { return [...new Set((ids || []).map(normalize).filter(Boolean))]; }

    function classify(id) {
        id = normalize(id);
        if (id === "яйца") return "eggs";
        return window.recipeProIngredientIntelligence?.role?.(id)
            || window.recipeProIntelligence?.classify?.(id)
            || "other";
    }

    function pick(ids, role) {
        return ids.find(id => classify(id) === role);
    }

    function titleFor(type, ids) {
        const names = ids.map(id => window.products?.[id]?.name || id);
        const protein = pick(ids,"protein");
        const carb = pick(ids,"carb");
        const vegetable = pick(ids,"vegetable");
        if (type === "bowl" && protein && carb) return (window.products?.[protein]?.name || protein) + " с " + (window.products?.[carb]?.name || carb);
        if (type === "stew" && protein) return "Тушёное блюдо с " + (window.products?.[protein]?.name || protein);
        if (type === "roast" && ids.includes("яйца") && ids.includes("сыр") && ids.includes("морковь")) return "Запеканка с яйцом, сыром и морковью";
        if (type === "roast" && ids.includes("сыр") && ids.includes("морковь")) return "Запечённая морковь с сыром" + (ids.includes("чеснок") ? " и чесноком" : "");
        if (type === "roast" && protein && carb) return (window.products?.[protein]?.name || protein) + " с " + (window.products?.[carb]?.name || carb) + " в духовке";
        if (type === "salad" && ids.includes("яйца") && ids.includes("сыр") && ids.includes("морковь")) return "Салат с яйцом, сыром и морковью";
        if (type === "salad" && protein) return "Салат с " + (window.products?.[protein]?.name || protein);
        if (type === "salad" && ids.includes("сыр") && ids.includes("морковь") && ids.includes("чеснок")) return "Сырная закуска с морковью и чесноком";
        if (type === "salad" && ids.includes("сыр") && ids.includes("чеснок")) return "Сырная закуска с чесноком";
        if (type === "salad" && vegetable) {
            const instrumental = { "морковь":"морковью", "чеснок":"чесноком", "лук":"луком", "огурец":"огурцом", "помидоры":"помидорами", "перец":"перцем", "брокколи":"брокколи", "капуста":"капустой", "кабачок":"кабачком" };
            return "Овощная закуска с " + (instrumental[vegetable] || (window.products?.[vegetable]?.name || vegetable).toLowerCase());
        }
        if (type === "salad" && ids.length) return "Домашняя закуска из " + names.slice(0,2).map(name => name.toLowerCase()).join(" и ");
        if (type === "omelet") return "Омлет с " + (vegetable ? (window.products?.[vegetable]?.name || vegetable) : "добавками");
        if (type === "pasta" && protein) return "Паста с " + (window.products?.[protein]?.name || protein);
        if (type === "porridge") return "Каша с " + (names[1] || names[0]);
        return TYPES[type]?.label || "Домашнее блюдо";
    }

    function chooseType(ids, intent) {
        const intelligence = window.recipeProIntelligence;
        if (intelligence?.chooseType) {
            const selected = intelligence.chooseType(ids, intent || {});
            if (selected?.type) return selected.type;
        }

        const roles = ids.map(classify);
        if (roles.includes("eggs")) return "omelet";
        if (roles.includes("oats")) return "porridge";
        if (roles.includes("pasta")) return "pasta";
        if (roles.includes("protein") && roles.includes("carb")) return "bowl";
        if (roles.includes("protein") && roles.includes("vegetable")) return "stew";
        return "salad";
    }

    function canBuildType(ids, type, intent = {}) {
        ids = unique(ids);
        const roles = ids.map(classify);
        const has = role => roles.includes(role);
        const hasId = id => ids.includes(id);

        if (type === "omelet") return has("eggs") || hasId("яйца");
        if (type === "pasta") return hasId("паста");
        if (type === "porridge") return hasId("овсянка") && (has("fruit") || hasId("молоко") || hasId("йогурт") || ids.length > 1);
        if (type === "bowl") {
            return (has("protein") && (has("carb") || has("vegetable")))
                || (has("carb") && has("vegetable"))
                || (has("dairy") && has("fruit"));
        }
        if (type === "roast") return (has("protein") || has("dairy")) && (has("carb") || has("vegetable"));
        if (type === "stew") return (has("protein") || has("carb")) && has("vegetable");
        if (type === "salad") return has("vegetable") || (has("dairy") && has("aromatic")) || (has("fruit") && has("dairy"));
        return false;
    }

    function chooseSafeFallbackType(ids, intent = {}, compatibleDish = null) {
        if (intent.type && canBuildType(ids, intent.type, intent)) return intent.type;
        if (compatibleDish?.dish?.type && canBuildType(ids, compatibleDish.dish.type, intent)) return compatibleDish.dish.type;

        const roles = ids.map(classify);
        const has = role => roles.includes(role);
        const hasId = id => ids.includes(id);

        if (has("eggs") || hasId("яйца")) return "omelet";
        if (hasId("паста")) return "pasta";
        if (hasId("овсянка") && (has("fruit") || hasId("молоко") || hasId("йогурт"))) return "porridge";
        if ((has("protein") && (has("carb") || has("vegetable"))) || (has("carb") && has("vegetable"))) {
            return has("carb") && has("vegetable") && !has("protein") ? "bowl" : "bowl";
        }
        if ((has("protein") || has("carb")) && has("vegetable")) return "stew";
        if (has("vegetable") || (has("dairy") && has("aromatic")) || (has("fruit") && has("dairy"))) return "salad";
        return null;
    }

    function pantry(type, ids) {
        return window.recipeProIntelligence?.getPantry?.(type, ids) || [];
    }

    function build(ids, intent = {}) {
        ids = unique(ids);
        if (!ids.length) return null;

        const intelligence = window.recipeProIntelligence;
        const dishChoice = intelligence?.getBestDish?.(ids, intent);
        const requestedTypeIsValid = intent.type && canBuildType(ids, intent.type, intent);
        const compatibleDish = dishChoice?.compatible
            && (!requestedTypeIsValid || dishChoice.dish?.type === intent.type)
            && canBuildType(ids, dishChoice.dish?.type, intent)
            ? dishChoice
            : null;

        const type = chooseSafeFallbackType(ids, intent, compatibleDish);
        if (!type) return null;

        const template = TYPES[type] || TYPES.bowl;
        const targetServings = Math.max(1, Number(intent.targetServings) || 2);
        const servingMultiplier = targetServings / 2;
        const scaledAmount = amount => Math.max(1, Math.round(amount * servingMultiplier / 5) * 5);
        const selected=ids.filter(id=>{
            const r=classify(id);
            return ["protein","carb","vegetable","fruit","dairy","fat","aromatic","eggs"].includes(r);
        });

        const ingredients=selected.map(id=>({
            productId:id,
            product:id,
            name:window.products?.[id]?.name||id,
            amount:scaledAmount(roleAmount(id, classify(id))),
            unit:"г",
            state:"raw",
            required:true,
            source:"user"
        }));

        const pantryIngredients=pantry(type,ids).map(item=>({
            productId:item.key,
            product:item.key==="cookingOil"?"масло":item.key,
            name:item.key==="cookingOil"?"Растительное масло":item.key==="salt"?"Соль":item.key==="pepper"?"Чёрный перец":"Вода",
            amount:scaledAmount(item.key==="cookingOil"?10:item.key==="water"?250:item.key==="salt"?2:1),
            unit:item.key==="water"?"мл":"г",
            state:"raw",
            required:false,
            pantry:true,
            source:"RecipePro"
        }));

        const allIngredients=ingredients.concat(pantryIngredients);
        const warnings = [];
        if (intent.type && intent.type !== type) {
            warnings.push("Запрошенный тип блюда («" + intent.type + "») не подходит к указанным продуктам. RecipePro выбрал безопасный вариант без отсутствующих обязательных ингредиентов.");
        }
        if (dishChoice?.missing?.length && !compatibleDish) {
            warnings.push("Для ближайшего классического рецепта не хватает: " + dishChoice.missing.join(", ") + ". Поэтому показан адаптированный вариант из имеющихся продуктов.");
        }
        if (compatibleDish?.replacements?.length) {
            warnings.push("Использованы допустимые замены: " + compatibleDish.replacements.join(", ") + ".");
        }
        if (!selected.length) warnings.push("RecipePro не нашёл продуктов с известной пищевой ролью. Рецепт собран как базовая закуска.");

        return {
            id:"generated-"+Date.now(),
            title:compatibleDish?.dish?.title || titleFor(type,selected),
            emoji:compatibleDish?.dish?.emoji||template.emoji,
            description:"Рецепт собран RecipePro из продуктов, которые указал пользователь.",
            time:compatibleDish?.dish?.time||template.time,
            servings:targetServings,
            tags:["AI Recipe","Из ваших продуктов"],
            filters:["protein"],
            type,
            ingredients:allIngredients,
            pantryIngredients,
            requiredProducts:ingredients.map(item=>item.productId),
            steps:compatibleDish?.dish?.steps||template.steps,
            aiGenerated:true,
            generatedBy:"RecipePro Recipe Builder",
            intelligence:{
                dishId:compatibleDish?.dish?.id||null,
                dishMatch:!!compatibleDish,
                matchScore:compatibleDish?.score??0,
                missing:compatibleDish?.missing||[],
                replacements:compatibleDish?.replacements||[],
                compatibility:window.recipeProIngredientIntelligence?.analyze?.(ids)||null,
                suggestions:window.recipeProIngredientIntelligence?.suggestions?.(ids)||[]
            },
            warnings
        };
    }

    function roleAmount(id, role) {
        const productId = String(id || "").toLowerCase();

        if (role === "protein") return 250;
        if (role === "eggs") return 150;
        if (role === "fruit") return 120;
        if (role === "fat") return 10;
        if (role === "aromatic") {
            if (productId === "чеснок") return 10;
            if (productId === "лук") return 60;
            return 10;
        }
        if (role === "carb") {
            if (productId === "картофель") return 300;
            if (productId === "хлеб") return 100;
            if (["рис", "гречка", "овсянка", "паста", "чечевица", "фасоль"].includes(productId)) return 150;
            return 150;
        }
        if (role === "vegetable") return 150;
        if (role === "dairy") {
            if (["молоко", "йогурт", "сметана"].includes(productId)) return 100;
            return 100;
        }
        return 100;
    }

    function buildFromText(text, intent = {}) {
        const resolver = window.recipeProProductResolver;
        if (!resolver?.resolve) return null;
        return resolver.resolve(text).then(result => {
            const ids = result?.productIds || result?.ids || [];
            return build(ids, intent);
        });
    }

    window.recipeProRecipeBuilder = {
        version:VERSION,
        build,
        buildFromText,
        chooseType,
        canBuildType,
        types:TYPES
    };
})();