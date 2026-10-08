(function () {
    "use strict";

    const ENGINE_VERSION = "1.0.0";

    const TYPE_RULES = [
        {
            id: "bowl",
            title: "Боул",
            emoji: "🥗",
            baseTime: 15,
            roles: ["protein", "carb", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isCarb) && ids.some(isVegetable) ? 30 : 0
        },
        {
            id: "roast",
            title: "Запечённое блюдо",
            emoji: "🍗",
            baseTime: 35,
            roles: ["protein", "carb", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isCarb) ? 24 : 0
        },
        {
            id: "stew",
            title: "Рагу",
            emoji: "🍲",
            baseTime: 30,
            roles: ["protein", "vegetable"],
            score: ids => ids.some(isProtein) && ids.some(isVegetable) ? 22 : 0
        },
        {
            id: "pasta",
            title: "Паста",
            emoji: "🍝",
            baseTime: 25,
            roles: ["protein", "carb"],
            score: ids => ids.includes("паста") && (ids.some(isProtein) || ids.some(isVegetable)) ? 32 : 0
        },
        {
            id: "porridge",
            title: "Каша",
            emoji: "🥣",
            baseTime: 12,
            roles: ["carb", "fruit"],
            score: ids => ids.includes("овсянка") && ids.some(isFruit) ? 34 : 0
        },
        {
            id: "omelet",
            title: "Омлет",
            emoji: "🍳",
            baseTime: 15,
            roles: ["protein", "vegetable"],
            score: ids => ids.includes("яйца") && (ids.some(isVegetable) || ids.includes("сыр") || ids.includes("творог")) ? 36 : 0
        },
        {
            id: "salad",
            title: "Салат",
            emoji: "🥗",
            baseTime: 10,
            roles: ["protein", "vegetable"],
            score: ids => ids.some(isVegetable) && (ids.includes("огурец") || ids.includes("помидоры")) ? 20 : 0
        }
    ];

    function role(id) {
        const p = window.products?.[id];
        if (p?.role) return p.role;
        if (["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр"].includes(id)) return "protein";
        if (["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"].includes(id)) return "carb";
        if (["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"].includes(id)) return "vegetable";
        if (["банан","яблоко","апельсин"].includes(id)) return "fruit";
        if (["масло","сливочное-масло","сметана","мед","сахар"].includes(id)) return "fat";
        return "other";
    }

    const isProtein = id => role(id) === "protein";
    const isCarb = id => role(id) === "carb";
    const isVegetable = id => role(id) === "vegetable";
    const isFruit = id => role(id) === "fruit";

    function chooseType(ids, intent = {}) {
        const ranked = TYPE_RULES.map(rule => {
            let score = rule.score(ids);

            if (intent.type && rule.id === intent.type) score += 100;

            if (intent.faster && rule.baseTime <= 20) score += 25;
            if (intent.maxTime && rule.baseTime <= intent.maxTime) score += 30;
            if (intent.maxTime && rule.baseTime > intent.maxTime) score -= Math.min(24, (rule.baseTime - intent.maxTime) * 0.8);

            if (intent.highProtein || intent.minProtein) {
                if (["omelet","bowl","stew"].includes(rule.id)) score += 8;
            }

            if (intent.lessCalories || intent.maxCalories) {
                if (["salad","bowl","omelet"].includes(rule.id)) score += 7;
                if (rule.id === "roast") score -= 3;
            }

            return { rule, score };
        }).sort((a,b) => b.score - a.score);

        return ranked[0]?.score > 0 ? ranked[0].rule : TYPE_RULES[1];
    }

    function build(ids, intent = {}) {
        const unique = [...new Set(ids)].slice(0, 10);
        const type = chooseType(unique, intent);
        const protein = unique.find(isProtein);
        const carb = unique.find(isCarb);
        const vegetables = unique.filter(isVegetable);
        const fruits = unique.filter(isFruit);
        const fats = unique.filter(id => role(id) === "fat");
        let selected = [];

        if (type.id === "pasta") selected = ["паста", protein, ...vegetables, ...fats];
        else if (type.id === "porridge") selected = ["овсянка", ...fruits, ...fats];
        else if (type.id === "omelet") selected = ["яйца", ...vegetables, ...unique.filter(id => ["творог","сыр"].includes(id)), ...fats];
        else if (type.id === "salad") selected = [...vegetables, protein, ...fats];
        else if (type.id === "stew") selected = [protein, ...vegetables, carb, ...fats];
        else if (type.id === "roast") selected = [protein, carb, ...vegetables, ...fats];
        else selected = [protein, carb, ...vegetables, ...fats];

        selected = selected
            .filter(Boolean)
            .filter((id,i,arr) => arr.indexOf(id) === i)
            .filter(id => unique.includes(id));

        if (!selected.length) selected = unique.slice(0, 7);

        const titleMap = {
            pasta: protein ? name(protein) + " с пастой" : "Паста RecipePro",
            porridge: fruits[0] ? "Овсянка с " + name(fruits[0]) : "Овсянка RecipePro",
            omelet: "Омлет RecipePro",
            salad: protein ? "Салат с " + name(protein) : "Свежий салат",
            stew: protein ? name(protein) + " с овощами" : "Овощное рагу",
            roast: protein ? name(protein) + " с гарниром" : "Запечённое блюдо",
            bowl: protein ? "Боул с " + name(protein) : "Боул RecipePro"
        };

        const stepsByType = {
            pasta: ["Отвари пасту до готовности.","Приготовь белковый продукт и овощи.","Соедини ингредиенты и прогрей ещё 1–2 минуты."],
            porridge: ["Свари овсянку на воде или молоке.","Добавь фрукты после приготовления.","Перемешай и подай тёплой."],
            omelet: ["Смешай яйца с выбранными добавками.","Добавь овощи или творог.","Готовь под крышкой на слабом огне до полной готовности."],
            salad: ["Нарежь овощи.","Добавь белковый продукт.","Заправь небольшим количеством масла, если оно есть."],
            stew: ["Нарежь ингредиенты примерно одинаковыми кусочками.","Сначала приготовь белковую основу.","Добавь овощи и немного воды, затем туши до готовности."],
            roast: ["Нарежь основные ингредиенты.","Разложи их в форме и добавь специи.","Запекай до полной готовности продуктов."],
            bowl: ["Приготовь белковую основу и гарнир.","Нарежь свежие овощи.","Собери всё в одной миске."]
        };

        let time = type.baseTime;
        if (intent.faster) time = Math.min(time, 20);
        if (intent.maxTime) time = Math.min(time, intent.maxTime);

        const recipe = {
            engineVersion: ENGINE_VERSION,
            type: type.id,
            title: titleMap[type.id] || "Блюдо RecipePro",
            emoji: type.emoji,
            description: "Recipe Engine выбрал тип блюда по продуктам и пожеланиям пользователя.",
            time: Math.max(5, time),
            servings: 1,
            ingredients: selected.map(id => ({ product:id, ...amount(id), required:true })),
            steps: stepsByType[type.id] || ["Подготовь продукты.","Приготовь до готовности.","Подавай сразу."],
            aiChanges: ["Recipe Engine выбрал формат: " + type.title],
            aiWarnings: []
        };

        if (intent.maxTime && type.baseTime > intent.maxTime) {
            recipe.aiWarnings.push("Оценочное время исходного формата выше заданного лимита, поэтому RecipePro выбрал максимально быстрый вариант.");
        }

        if ((intent.highProtein || intent.minProtein) && !protein) {
            recipe.aiWarnings.push("В запросе нужна высокая доля белка, но среди указанных продуктов не найден явный белковый продукт.");
        }

        if (intent.maxCalories) {
            recipe.aiWarnings.push("Лимит калорий будет дополнительно проверен Nutrition Engine после расчёта порции.");
        }

        return recipe;
    }
    window.recipeProRecipeEngine = { version: ENGINE_VERSION, build, chooseType, role };
})();