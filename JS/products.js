window.products = {

    "курица": {
        name: "Куриная грудка",
        category: "meat",
        aliases: ["курица", "куриную грудку", "куриная грудка", "грудка"],
        raw: {
            kcal: 120,
            protein: 22.5,
            fat: 2.6,
            carbs: 0
        },
        cookedWeightRatio: 0.75,
        pieceWeight: 250
    ,
        nutritionSource: {"database":"USDA FoodData Central SR Legacy","fdcId":171077,"sourceUrl":"https://fdc.nal.usda.gov/food-details/171077/nutrients","note":"Куриная грудка без кожи и костей, сырая; значения на 100 г."}
    },

    "куриное-бедро": {
        name: "Куриное бедро",
        category: "meat",
        aliases: ["бедро", "куриное бедро"],
        raw: {
            kcal: 177,
            protein: 18.6,
            fat: 11,
            carbs: 0
        },
        cookedWeightRatio: 0.72,
        pieceWeight: 150
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "индейка": {
        name: "Филе индейки",
        category: "meat",
        aliases: ["индейка", "индейку", "филе индейки"],
        raw: {
            kcal: 114,
            protein: 23.7,
            fat: 2,
            carbs: 0
        },
        cookedWeightRatio: 0.75,
        pieceWeight: 250
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "говядина": {
        name: "Говядина",
        category: "meat",
        aliases: ["говядина", "говядину"],
        raw: {
            kcal: 187,
            protein: 18.9,
            fat: 12.4,
            carbs: 0
        },
        cookedWeightRatio: 0.7,
        pieceWeight: 200
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "свинина": {
        name: "Свинина",
        category: "meat",
        aliases: ["свинина", "свинину"],
        raw: {
            kcal: 242,
            protein: 16.9,
            fat: 18.4,
            carbs: 0
        },
        cookedWeightRatio: 0.7,
        pieceWeight: 200
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "лосось": {
        name: "Лосось",
        category: "fish",
        aliases: ["лосось", "лосося"],
        raw: {
            kcal: 208,
            protein: 20,
            fat: 13.4,
            carbs: 0
        },
        cookedWeightRatio: 0.8,
        pieceWeight: 200
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тунец": {
        name: "Тунец (сырой, желтопёрый)",
        category: "fish",
        aliases: ["тунец", "тунца", "желтопёрый тунец"],
        raw: {
            kcal: 109,
            protein: 24.4,
            fat: 0.5,
            carbs: 0
        },
        nutritionSource: {
            database: "USDA FoodData Central SR Legacy",
            fdcId: "175159",
            state: "raw",
            url: "https://fdc.nal.usda.gov/food-details/175159/nutrients"
        },
        cookedWeightRatio: 0.82,
        pieceWeight: 150
    },

    "креветки": {
        name: "Креветки (сырые)",
        category: "fish",
        aliases: ["креветки", "креветок", "креветку"],
        raw: {
            kcal: 85,
            protein: 20.1,
            fat: 0.5,
            carbs: 0
        },
        nutritionSource: {
            database: "USDA FoodData Central SR Legacy",
            fdcId: "175179",
            state: "raw",
            url: "https://fdc.nal.usda.gov/food-details/175179/nutrients"
        },
        cookedWeightRatio: 0.86,
        pieceWeight: 15
    },


    "картофель": {
        name: "Картофель",
        category: "vegetable",
        aliases: ["картофель", "картошка", "картошку", "картофеля"],
        raw: {
            kcal: 77,
            protein: 2,
            fat: 0.1,
            carbs: 17.5
        },
        cookedWeightRatio: 0.85,
        pieceWeight: 150
    ,
        nutritionSource: {"database":"USDA FoodData Central SR Legacy","fdcId":170026,"sourceUrl":"https://fdc.nal.usda.gov/food-details/170026/nutrients","note":"Картофель с кожурой, сырой; значения на 100 г."}
    },

    "лук": {
        name: "Лук",
        category: "vegetable",
        aliases: ["лук", "лука", "луковица"],
        raw: {
            kcal: 40,
            protein: 1.1,
            fat: 0.1,
            carbs: 9.3
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 100
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "морковь": {
        name: "Морковь",
        category: "vegetable",
        aliases: ["морковь", "морковку", "моркови"],
        raw: {
            kcal: 41,
            protein: 0.9,
            fat: 0.2,
            carbs: 9.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 80
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "помидоры": {
        name: "Помидоры",
        category: "vegetable",
        aliases: ["помидоры", "помидор", "томат", "томаты"],
        raw: {
            kcal: 18,
            protein: 0.9,
            fat: 0.2,
            carbs: 3.9
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 120
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "огурец": {
        name: "Огурец",
        category: "vegetable",
        aliases: ["огурец", "огурцы", "огурца"],
        raw: {
            kcal: 15,
            protein: 0.7,
            fat: 0.1,
            carbs: 3.6
        },
        cookedWeightRatio: 0.95,
        pieceWeight: 120
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перец": {
        name: "Болгарский перец",
        category: "vegetable",
        aliases: ["перец", "болгарский перец"],
        raw: {
            kcal: 27,
            protein: 1,
            fat: 0.2,
            carbs: 6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 150
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "брокколи": {
        name: "Брокколи",
        category: "vegetable",
        aliases: ["брокколи"],
        raw: {
            kcal: 34,
            protein: 2.8,
            fat: 0.4,
            carbs: 6.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 300
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "капуста": {
        name: "Капуста",
        category: "vegetable",
        aliases: ["капуста", "капусту"],
        raw: {
            kcal: 25,
            protein: 1.3,
            fat: 0.1,
            carbs: 5.8
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 1500
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кабачок": {
        name: "Кабачок",
        category: "vegetable",
        aliases: ["кабачок", "кабачки", "кабачка"],
        raw: {
            kcal: 24,
            protein: 0.6,
            fat: 0.3,
            carbs: 4.6
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 250
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чеснок": {
        name: "Чеснок",
        category: "vegetable",
        aliases: ["чеснок", "чеснока"],
        raw: {
            kcal: 149,
            protein: 6.4,
            fat: 0.5,
            carbs: 33
        },
        cookedWeightRatio: 0.9,
        pieceWeight: 5
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "яйца": {
        name: "Яйца",
        category: "eggs",
        aliases: ["яйца", "яйцо", "яиц", "яйца"],
        raw: {
            kcal: 143,
            protein: 12.6,
            fat: 9.5,
            carbs: 0.7
        },
        cookedWeightRatio: 0.95,
        pieceWeight: 50
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "сыр": {
        name: "Сыр",
        category: "dairy",
        aliases: ["сыр", "сыра", "сыром"],
        raw: {
            kcal: 350,
            protein: 25,
            fat: 28,
            carbs: 2
        },
        cookedWeightRatio: 1,
        pieceWeight: 20
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "моцарелла": {
        name: "Моцарелла",
        category: "dairy",
        aliases: ["моцарелла", "моцареллы"],
        raw: {
            kcal: 280,
            protein: 28,
            fat: 17,
            carbs: 3
        },
        cookedWeightRatio: 1,
        pieceWeight: 20
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко": {
        name: "Молоко",
        category: "dairy",
        aliases: ["молоко", "молока"],
        raw: {
            kcal: 52,
            protein: 2.8,
            fat: 2.5,
            carbs: 4.7
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "творог": {
        name: "Творог",
        category: "dairy",
        aliases: ["творог", "творога"],
        raw: {
            kcal: 121,
            protein: 17,
            fat: 5,
            carbs: 1.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 200
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "йогурт": {
        name: "Йогурт",
        category: "dairy",
        aliases: ["йогурт", "йогурта"],
        raw: {
            kcal: 60,
            protein: 4.5,
            fat: 3.2,
            carbs: 4
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сметана": {
        name: "Сметана",
        category: "dairy",
        aliases: ["сметана", "сметаны"],
        raw: {
            kcal: 158,
            protein: 2.6,
            fat: 15,
            carbs: 3.6
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "рис": {
        name: "Рис",
        category: "grain",
        aliases: ["рис", "риса"],
        raw: {
            kcal: 360,
            protein: 7,
            fat: 0.7,
            carbs: 79
        },
        cookedWeightRatio: 2.8
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гречка": {
        name: "Гречка",
        category: "grain",
        aliases: ["гречка", "гречневую", "гречневой"],
        raw: {
            kcal: 343,
            protein: 13.6,
            fat: 3.3,
            carbs: 71.5
        },
        cookedWeightRatio: 2.5
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "овсянка": {
        name: "Овсянка",
        category: "grain",
        aliases: ["овсянка", "овсянку", "овсяные хлопья"],
        raw: {
            kcal: 370,
            protein: 13,
            fat: 6.5,
            carbs: 62
        },
        cookedWeightRatio: 2.5
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "паста": {
        name: "Паста",
        category: "grain",
        aliases: ["паста", "макароны", "макарон", "спагетти"],
        raw: {
            kcal: 350,
            protein: 12,
            fat: 1.5,
            carbs: 70
        },
        cookedWeightRatio: 2.4
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "хлеб": {
        name: "Хлеб",
        category: "grain",
        aliases: ["хлеб", "хлеба"],
        raw: {
            kcal: 265,
            protein: 9,
            fat: 3.2,
            carbs: 49
        },
        cookedWeightRatio: 1,
        pieceWeight: 30
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "чечевица": {
        name: "Чечевица",
        category: "legumes",
        aliases: ["чечевица", "чечевицу"],
        raw: {
            kcal: 352,
            protein: 24.6,
            fat: 1.1,
            carbs: 63
        },
        cookedWeightRatio: 2.5
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль": {
        name: "Фасоль",
        category: "legumes",
        aliases: ["фасоль", "фасоли"],
        raw: {
            kcal: 333,
            protein: 23.6,
            fat: 0.8,
            carbs: 60
        },
        cookedWeightRatio: 2.4
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "банан": {
        name: "Банан",
        category: "fruit",
        aliases: ["банан", "бананы", "банана"],
        raw: {
            kcal: 89,
            protein: 1.1,
            fat: 0.3,
            carbs: 22.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 120
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "яблоко": {
        name: "Яблоко",
        category: "fruit",
        aliases: ["яблоко", "яблоки", "яблока"],
        raw: {
            kcal: 52,
            protein: 0.3,
            fat: 0.2,
            carbs: 13.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 180
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "апельсин": {
        name: "Апельсин",
        category: "fruit",
        aliases: ["апельсин", "апельсины"],
        raw: {
            kcal: 47,
            protein: 0.9,
            fat: 0.1,
            carbs: 11.8
        },
        cookedWeightRatio: 1,
        pieceWeight: 180
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },


    "масло": {
        name: "Растительное масло",
        category: "oil",
        aliases: ["масло", "растительное масло", "оливковое масло"],
        raw: {
            kcal: 899,
            protein: 0,
            fat: 99.9,
            carbs: 0
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сливочное-масло": {
        name: "Сливочное масло",
        category: "oil",
        aliases: ["сливочное масло", "сливочное", "масло сливочное"],
        raw: {
            kcal: 748,
            protein: 0.5,
            fat: 82.5,
            carbs: 0.8
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мед": {
        name: "Мёд",
        category: "sweet",
        aliases: ["мед", "мёд", "меда"],
        raw: {
            kcal: 304,
            protein: 0.3,
            fat: 0,
            carbs: 82.4
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сахар": {
        name: "Сахар",
        category: "sweet",
        aliases: ["сахар", "сахара"],
        raw: {
            kcal: 387,
            protein: 0,
            fat: 0,
            carbs: 99.8
        },
        cookedWeightRatio: 1
    ,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    }
,

    "куриное-филе": {
        name: "Куриное филе",
        category: "meat",
        aliases: ["Куриное филе", "куриная грудка", "филе курицы"],
        raw: { kcal: 120, protein: 23, fat: 2.6, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "куриный-фарш": {
        name: "Куриный фарш",
        category: "meat",
        aliases: ["Куриный фарш", "фарш куриный"],
        raw: { kcal: 143, protein: 17, fat: 8, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "утка": {
        name: "Утка",
        category: "meat",
        aliases: ["Утка"],
        raw: { kcal: 337, protein: 19, fat: 28, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кролик": {
        name: "Крольчатина",
        category: "meat",
        aliases: ["Крольчатина"],
        raw: { kcal: 173, protein: 21, fat: 10, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баранина": {
        name: "Баранина",
        category: "meat",
        aliases: ["Баранина"],
        raw: { kcal: 294, protein: 17, fat: 25, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "печень-куриная": {
        name: "Куриная печень",
        category: "meat",
        aliases: ["Куриная печень"],
        raw: { kcal: 119, protein: 17, fat: 4.8, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "печень-говяжья": {
        name: "Говяжья печень",
        category: "meat",
        aliases: ["Говяжья печень"],
        raw: { kcal: 135, protein: 20.4, fat: 3.6, carbs: 3.9 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сердце-куриное": {
        name: "Куриные сердечки",
        category: "meat",
        aliases: ["Куриные сердечки"],
        raw: { kcal: 153, protein: 15.6, fat: 9.3, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фарш-говяжий": {
        name: "Говяжий фарш",
        category: "meat",
        aliases: ["Говяжий фарш"],
        raw: { kcal: 254, protein: 17.2, fat: 20, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ветчина": {
        name: "Ветчина",
        category: "meat",
        aliases: ["Ветчина"],
        raw: { kcal: 145, protein: 20, fat: 6, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "бекон": {
        name: "Бекон",
        category: "meat",
        aliases: ["Бекон"],
        raw: { kcal: 541, protein: 37, fat: 42, carbs: 1.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "колбаса-вареная": {
        name: "Колбаса варёная",
        category: "meat",
        aliases: ["Колбаса варёная", "докторская колбаса"],
        raw: { kcal: 250, protein: 12, fat: 22, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сосиски": {
        name: "Сосиски",
        category: "meat",
        aliases: ["Сосиски"],
        raw: { kcal: 270, protein: 11, fat: 24, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "треска": {
        name: "Треска",
        category: "fish",
        aliases: ["Треска"],
        raw: { kcal: 82, protein: 18, fat: 0.7, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "минтай": {
        name: "Минтай",
        category: "fish",
        aliases: ["Минтай"],
        raw: { kcal: 72, protein: 15.9, fat: 0.9, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хек": {
        name: "Хек",
        category: "fish",
        aliases: ["Хек"],
        raw: { kcal: 86, protein: 16.6, fat: 2.2, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горбуша": {
        name: "Горбуша",
        category: "fish",
        aliases: ["Горбуша"],
        raw: { kcal: 140, protein: 20.5, fat: 6.5, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "скумбрия": {
        name: "Скумбрия",
        category: "fish",
        aliases: ["Скумбрия"],
        raw: { kcal: 205, protein: 18.6, fat: 13.9, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сельдь": {
        name: "Сельдь",
        category: "fish",
        aliases: ["Сельдь"],
        raw: { kcal: 158, protein: 17.9, fat: 9, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сардины": {
        name: "Сардины",
        category: "fish",
        aliases: ["Сардины"],
        raw: { kcal: 208, protein: 24.6, fat: 11.5, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "форель": {
        name: "Форель",
        category: "fish",
        aliases: ["Форель"],
        raw: { kcal: 148, protein: 20.8, fat: 6.6, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кальмар": {
        name: "Кальмар",
        category: "fish",
        aliases: ["Кальмар"],
        raw: { kcal: 92, protein: 15.6, fat: 1.4, carbs: 3.1 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мидии": {
        name: "Мидии",
        category: "fish",
        aliases: ["Мидии"],
        raw: { kcal: 86, protein: 11.9, fat: 2.2, carbs: 3.7 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "осьминог": {
        name: "Осьминог",
        category: "fish",
        aliases: ["Осьминог"],
        raw: { kcal: 82, protein: 14.9, fat: 1, carbs: 2.2 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "батат": {
        name: "Батат",
        category: "vegetable",
        aliases: ["Батат", "сладкий картофель"],
        raw: { kcal: 86, protein: 1.6, fat: 0.1, carbs: 20.1 },
        cookedWeightRatio: 0.85,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "свекла": {
        name: "Свёкла",
        category: "vegetable",
        aliases: ["Свёкла"],
        raw: { kcal: 43, protein: 1.6, fat: 0.2, carbs: 9.6 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тыква": {
        name: "Тыква",
        category: "vegetable",
        aliases: ["Тыква"],
        raw: { kcal: 26, protein: 1, fat: 0.1, carbs: 6.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баклажан": {
        name: "Баклажан",
        category: "vegetable",
        aliases: ["Баклажан"],
        raw: { kcal: 25, protein: 1, fat: 0.2, carbs: 5.9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "цветная-капуста": {
        name: "Цветная капуста",
        category: "vegetable",
        aliases: ["Цветная капуста"],
        raw: { kcal: 25, protein: 1.9, fat: 0.3, carbs: 5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "брюссельская-капуста": {
        name: "Брюссельская капуста",
        category: "vegetable",
        aliases: ["Брюссельская капуста"],
        raw: { kcal: 43, protein: 3.4, fat: 0.3, carbs: 9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукуруза": {
        name: "Кукуруза",
        category: "vegetable",
        aliases: ["Кукуруза", "кукуруза сладкая"],
        raw: { kcal: 86, protein: 3.3, fat: 1.4, carbs: 18.7 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "зелёный-горошек": {
        name: "Зелёный горошек",
        category: "vegetable",
        aliases: ["Зелёный горошек", "зеленый горошек"],
        raw: { kcal: 81, protein: 5.4, fat: 0.4, carbs: 14.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "стручковая-фасоль": {
        name: "Стручковая фасоль",
        category: "vegetable",
        aliases: ["Стручковая фасоль"],
        raw: { kcal: 31, protein: 1.8, fat: 0.2, carbs: 7 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шпинат": {
        name: "Шпинат",
        category: "vegetable",
        aliases: ["Шпинат"],
        raw: { kcal: 23, protein: 2.9, fat: 0.4, carbs: 3.6 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "салат-латук": {
        name: "Листовой салат",
        category: "vegetable",
        aliases: ["Листовой салат", "салат"],
        raw: { kcal: 15, protein: 1.4, fat: 0.2, carbs: 2.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пекинская-капуста": {
        name: "Пекинская капуста",
        category: "vegetable",
        aliases: ["Пекинская капуста"],
        raw: { kcal: 16, protein: 1.2, fat: 0.2, carbs: 3.2 },
        cookedWeightRatio: 0.95,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "редис": {
        name: "Редис",
        category: "vegetable",
        aliases: ["Редис"],
        raw: { kcal: 16, protein: 0.7, fat: 0.1, carbs: 3.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "редька": {
        name: "Редька",
        category: "vegetable",
        aliases: ["Редька"],
        raw: { kcal: 36, protein: 1.2, fat: 0.2, carbs: 7.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сельдерей": {
        name: "Сельдерей",
        category: "vegetable",
        aliases: ["Сельдерей"],
        raw: { kcal: 16, protein: 0.7, fat: 0.2, carbs: 3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "спаржа": {
        name: "Спаржа",
        category: "vegetable",
        aliases: ["Спаржа"],
        raw: { kcal: 20, protein: 2.2, fat: 0.1, carbs: 3.9 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шампиньоны": {
        name: "Шампиньоны",
        category: "vegetable",
        aliases: ["Шампиньоны", "грибы"],
        raw: { kcal: 22, protein: 3.1, fat: 0.3, carbs: 3.3 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вешенки": {
        name: "Вешенки",
        category: "vegetable",
        aliases: ["Вешенки"],
        raw: { kcal: 33, protein: 3.3, fat: 0.4, carbs: 6.1 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "авокадо": {
        name: "Авокадо",
        category: "fruit",
        aliases: ["Авокадо"],
        raw: { kcal: 160, protein: 2, fat: 14.7, carbs: 8.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "груша": {
        name: "Груша",
        category: "fruit",
        aliases: ["Груша"],
        raw: { kcal: 57, protein: 0.4, fat: 0.1, carbs: 15.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "персик": {
        name: "Персик",
        category: "fruit",
        aliases: ["Персик"],
        raw: { kcal: 39, protein: 0.9, fat: 0.3, carbs: 9.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нектарин": {
        name: "Нектарин",
        category: "fruit",
        aliases: ["Нектарин"],
        raw: { kcal: 44, protein: 1.1, fat: 0.3, carbs: 10.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "киви": {
        name: "Киви",
        category: "fruit",
        aliases: ["Киви"],
        raw: { kcal: 61, protein: 1.1, fat: 0.5, carbs: 14.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ананас": {
        name: "Ананас",
        category: "fruit",
        aliases: ["Ананас"],
        raw: { kcal: 50, protein: 0.5, fat: 0.1, carbs: 13.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "манго": {
        name: "Манго",
        category: "fruit",
        aliases: ["Манго"],
        raw: { kcal: 60, protein: 0.8, fat: 0.4, carbs: 15 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "виноград": {
        name: "Виноград",
        category: "fruit",
        aliases: ["Виноград"],
        raw: { kcal: 69, protein: 0.7, fat: 0.2, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "клубника": {
        name: "Клубника",
        category: "fruit",
        aliases: ["Клубника"],
        raw: { kcal: 32, protein: 0.7, fat: 0.3, carbs: 7.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "малина": {
        name: "Малина",
        category: "fruit",
        aliases: ["Малина"],
        raw: { kcal: 52, protein: 1.2, fat: 0.7, carbs: 11.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "черника": {
        name: "Черника",
        category: "fruit",
        aliases: ["Черника"],
        raw: { kcal: 57, protein: 0.7, fat: 0.3, carbs: 14.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вишня": {
        name: "Вишня",
        category: "fruit",
        aliases: ["Вишня"],
        raw: { kcal: 50, protein: 1, fat: 0.3, carbs: 12.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "арбуз": {
        name: "Арбуз",
        category: "fruit",
        aliases: ["Арбуз"],
        raw: { kcal: 30, protein: 0.6, fat: 0.2, carbs: 7.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "дыня": {
        name: "Дыня",
        category: "fruit",
        aliases: ["Дыня"],
        raw: { kcal: 34, protein: 0.8, fat: 0.2, carbs: 8.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лимон": {
        name: "Лимон",
        category: "fruit",
        aliases: ["Лимон"],
        raw: { kcal: 29, protein: 1.1, fat: 0.3, carbs: 9.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "грейпфрут": {
        name: "Грейпфрут",
        category: "fruit",
        aliases: ["Грейпфрут"],
        raw: { kcal: 42, protein: 0.8, fat: 0.1, carbs: 10.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "изюм": {
        name: "Изюм",
        category: "fruit",
        aliases: ["Изюм"],
        raw: { kcal: 299, protein: 3.1, fat: 0.5, carbs: 79.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "финики": {
        name: "Финики",
        category: "fruit",
        aliases: ["Финики"],
        raw: { kcal: 282, protein: 2.5, fat: 0.4, carbs: 75 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "киноа": {
        name: "Киноа (сухая)",
        category: "grain",
        aliases: ["Киноа (сухая)"],
        raw: { kcal: 368, protein: 14.1, fat: 6.1, carbs: 64.2 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пшено": {
        name: "Пшено (сухое)",
        category: "grain",
        aliases: ["Пшено (сухое)"],
        raw: { kcal: 378, protein: 11, fat: 4.2, carbs: 72.9 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "перловка": {
        name: "Перловая крупа (сухая)",
        category: "grain",
        aliases: ["Перловая крупа (сухая)"],
        raw: { kcal: 352, protein: 9.9, fat: 1.2, carbs: 77.7 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "булгур": {
        name: "Булгур (сухой)",
        category: "grain",
        aliases: ["Булгур (сухой)"],
        raw: { kcal: 342, protein: 12.3, fat: 1.3, carbs: 75.9 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кускус": {
        name: "Кускус (сухой)",
        category: "grain",
        aliases: ["Кускус (сухой)"],
        raw: { kcal: 376, protein: 12.8, fat: 0.6, carbs: 77.4 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "манка": {
        name: "Манная крупа",
        category: "grain",
        aliases: ["Манная крупа", "манная крупа"],
        raw: { kcal: 360, protein: 10.3, fat: 1, carbs: 73.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузная-крупа": {
        name: "Кукурузная крупа",
        category: "grain",
        aliases: ["Кукурузная крупа"],
        raw: { kcal: 370, protein: 8.3, fat: 1.2, carbs: 79.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мука-пшеничная": {
        name: "Пшеничная мука",
        category: "grain",
        aliases: ["Пшеничная мука", "мука"],
        raw: { kcal: 364, protein: 10.3, fat: 1, carbs: 76.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мука-цельнозерновая": {
        name: "Цельнозерновая мука",
        category: "grain",
        aliases: ["Цельнозерновая мука"],
        raw: { kcal: 340, protein: 13.2, fat: 2.5, carbs: 72 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лаваш": {
        name: "Лаваш",
        category: "grain",
        aliases: ["Лаваш"],
        raw: { kcal: 275, protein: 9.1, fat: 1.2, carbs: 55.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хлеб-ржаной": {
        name: "Ржаной хлеб",
        category: "grain",
        aliases: ["Ржаной хлеб"],
        raw: { kcal: 259, protein: 8.5, fat: 3.3, carbs: 48.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хлеб-цельнозерновой": {
        name: "Цельнозерновой хлеб",
        category: "grain",
        aliases: ["Цельнозерновой хлеб"],
        raw: { kcal: 247, protein: 13, fat: 4.2, carbs: 41.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рис-коричневый": {
        name: "Коричневый рис (сухой)",
        category: "grain",
        aliases: ["Коричневый рис (сухой)"],
        raw: { kcal: 370, protein: 7.5, fat: 2.7, carbs: 77.2 },
        cookedWeightRatio: 2.8,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовая-лапша": {
        name: "Рисовая лапша (сухая)",
        category: "grain",
        aliases: ["Рисовая лапша (сухая)"],
        raw: { kcal: 364, protein: 5.9, fat: 0.6, carbs: 80.2 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "лапша-яичная": {
        name: "Яичная лапша (сухая)",
        category: "grain",
        aliases: ["Яичная лапша (сухая)"],
        raw: { kcal: 384, protein: 14.2, fat: 4.4, carbs: 71.3 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нут": {
        name: "Нут (сухой)",
        category: "legumes",
        aliases: ["Нут (сухой)"],
        raw: { kcal: 364, protein: 19, fat: 6, carbs: 61 },
        cookedWeightRatio: 2.4,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горох-сухой": {
        name: "Горох сухой",
        category: "legumes",
        aliases: ["Горох сухой"],
        raw: { kcal: 341, protein: 24.6, fat: 1.2, carbs: 60.1 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "маш": {
        name: "Маш (сухой)",
        category: "legumes",
        aliases: ["Маш (сухой)"],
        raw: { kcal: 347, protein: 23.9, fat: 1.2, carbs: 62.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевые-бобы": {
        name: "Соевые бобы (сухие)",
        category: "legumes",
        aliases: ["Соевые бобы (сухие)"],
        raw: { kcal: 446, protein: 36.5, fat: 19.9, carbs: 30.2 },
        cookedWeightRatio: 2.5,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тофу": {
        name: "Тофу",
        category: "legumes",
        aliases: ["Тофу"],
        raw: { kcal: 76, protein: 8, fat: 4.8, carbs: 1.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "арахис": {
        name: "Арахис",
        category: "nuts",
        aliases: ["Арахис"],
        raw: { kcal: 567, protein: 25.8, fat: 49.2, carbs: 16.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "миндаль": {
        name: "Миндаль",
        category: "nuts",
        aliases: ["Миндаль"],
        raw: { kcal: 579, protein: 21.2, fat: 49.9, carbs: 21.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "грецкий-орех": {
        name: "Грецкий орех",
        category: "nuts",
        aliases: ["Грецкий орех"],
        raw: { kcal: 654, protein: 15.2, fat: 65.2, carbs: 13.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кешью": {
        name: "Кешью",
        category: "nuts",
        aliases: ["Кешью"],
        raw: { kcal: 553, protein: 18.2, fat: 43.9, carbs: 30.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фисташки": {
        name: "Фисташки",
        category: "nuts",
        aliases: ["Фисташки"],
        raw: { kcal: 560, protein: 20.2, fat: 45.3, carbs: 27.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фундук": {
        name: "Фундук",
        category: "nuts",
        aliases: ["Фундук"],
        raw: { kcal: 628, protein: 15, fat: 60.8, carbs: 16.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семечки-подсолнечника": {
        name: "Семечки подсолнечника",
        category: "nuts",
        aliases: ["Семечки подсолнечника", "семечки"],
        raw: { kcal: 584, protein: 20.8, fat: 51.5, carbs: 20 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семена-чия": {
        name: "Семена чиа",
        category: "nuts",
        aliases: ["Семена чиа"],
        raw: { kcal: 486, protein: 16.5, fat: 30.7, carbs: 42.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "семена-льна": {
        name: "Семена льна",
        category: "nuts",
        aliases: ["Семена льна"],
        raw: { kcal: 534, protein: 18.3, fat: 42.2, carbs: 28.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кефир": {
        name: "Кефир 2,5%",
        category: "dairy",
        aliases: ["Кефир 2,5%"],
        raw: { kcal: 53, protein: 3, fat: 2.5, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "ряженка": {
        name: "Ряженка 2,5%",
        category: "dairy",
        aliases: ["Ряженка 2,5%"],
        raw: { kcal: 54, protein: 2.9, fat: 2.5, carbs: 4.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "греческий-йогурт": {
        name: "Греческий йогурт натуральный",
        category: "dairy",
        aliases: ["Греческий йогурт натуральный"],
        raw: { kcal: 97, protein: 9, fat: 5, carbs: 3.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "йогурт-обезжиренный": {
        name: "Йогурт натуральный 1,5%",
        category: "dairy",
        aliases: ["Йогурт натуральный 1,5%"],
        raw: { kcal: 48, protein: 5, fat: 1.5, carbs: 3.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "молоко-обезжиренное": {
        name: "Молоко 1,5%",
        category: "dairy",
        aliases: ["Молоко 1,5%"],
        raw: { kcal: 44, protein: 3, fat: 1.5, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "молоко-цельное": {
        name: "Молоко 3,2%",
        category: "dairy",
        aliases: ["Молоко 3,2%"],
        raw: { kcal: 60, protein: 3, fat: 3.2, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-чеддер": {
        name: "Сыр чеддер",
        category: "dairy",
        aliases: ["Сыр чеддер"],
        raw: { kcal: 403, protein: 25, fat: 33, carbs: 1.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-пармезан": {
        name: "Пармезан",
        category: "dairy",
        aliases: ["Пармезан"],
        raw: { kcal: 431, protein: 38, fat: 29, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-фета": {
        name: "Сыр фета",
        category: "dairy",
        aliases: ["Сыр фета"],
        raw: { kcal: 264, protein: 14.2, fat: 21.3, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сыр-адыгейский": {
        name: "Адыгейский сыр",
        category: "dairy",
        aliases: ["Адыгейский сыр"],
        raw: { kcal: 240, protein: 18.5, fat: 18, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "брынза": {
        name: "Брынза",
        category: "dairy",
        aliases: ["Брынза"],
        raw: { kcal: 260, protein: 17.9, fat: 20.1, carbs: 0.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сливки-10": {
        name: "Сливки 10%",
        category: "dairy",
        aliases: ["Сливки 10%"],
        raw: { kcal: 119, protein: 3, fat: 10, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сливки-20": {
        name: "Сливки 20%",
        category: "dairy",
        aliases: ["Сливки 20%"],
        raw: { kcal: 206, protein: 2.8, fat: 20, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мороженое": {
        name: "Мороженое сливочное",
        category: "dairy",
        aliases: ["Мороженое сливочное"],
        raw: { kcal: 207, protein: 3.5, fat: 11, carbs: 24 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яичный-белок": {
        name: "Яичный белок",
        category: "eggs",
        aliases: ["Яичный белок"],
        raw: { kcal: 52, protein: 10.9, fat: 0.2, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яичный-желток": {
        name: "Яичный желток",
        category: "eggs",
        aliases: ["Яичный желток"],
        raw: { kcal: 322, protein: 15.9, fat: 26.5, carbs: 3.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "оливковое-масло": {
        name: "Оливковое масло",
        category: "oil",
        aliases: ["Оливковое масло"],
        raw: { kcal: 884, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "масло-кокосовое": {
        name: "Кокосовое масло",
        category: "oil",
        aliases: ["Кокосовое масло"],
        raw: { kcal: 892, protein: 0, fat: 99.1, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "майонез": {
        name: "Майонез",
        category: "sauce",
        aliases: ["Майонез"],
        raw: { kcal: 680, protein: 1, fat: 75, carbs: 1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кетчуп": {
        name: "Кетчуп",
        category: "sauce",
        aliases: ["Кетчуп"],
        raw: { kcal: 112, protein: 1.3, fat: 0.2, carbs: 25.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевый-соус": {
        name: "Соевый соус",
        category: "sauce",
        aliases: ["Соевый соус"],
        raw: { kcal: 53, protein: 8.1, fat: 0.6, carbs: 4.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горчица": {
        name: "Горчица столовая",
        category: "sauce",
        aliases: ["Горчица столовая"],
        raw: { kcal: 66, protein: 4.4, fat: 4, carbs: 5.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "томатная-паста": {
        name: "Томатная паста",
        category: "sauce",
        aliases: ["Томатная паста"],
        raw: { kcal: 82, protein: 4.3, fat: 0.5, carbs: 18.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соль": {
        name: "Соль",
        category: "seasoning",
        aliases: ["Соль"],
        raw: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "черный-перец": {
        name: "Чёрный перец молотый",
        category: "seasoning",
        aliases: ["Чёрный перец молотый"],
        raw: { kcal: 251, protein: 10.4, fat: 3.3, carbs: 64 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "паприка": {
        name: "Паприка",
        category: "seasoning",
        aliases: ["Паприка"],
        raw: { kcal: 282, protein: 14.1, fat: 12.9, carbs: 53.99 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "корица": {
        name: "Корица",
        category: "seasoning",
        aliases: ["Корица"],
        raw: { kcal: 247, protein: 4, fat: 1.2, carbs: 80.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "какао": {
        name: "Какао-порошок",
        category: "sweet",
        aliases: ["Какао-порошок"],
        raw: { kcal: 228, protein: 19.6, fat: 13.7, carbs: 57.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шоколад-тёмный": {
        name: "Тёмный шоколад 70–85%",
        category: "sweet",
        aliases: ["Тёмный шоколад 70–85%", "горький шоколад"],
        raw: { kcal: 598, protein: 7.8, fat: 42.6, carbs: 45.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "шоколад-молочный": {
        name: "Молочный шоколад",
        category: "sweet",
        aliases: ["Молочный шоколад"],
        raw: { kcal: 535, protein: 7.7, fat: 29.7, carbs: 59.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "варенье": {
        name: "Варенье",
        category: "sweet",
        aliases: ["Варенье"],
        raw: { kcal: 278, protein: 0.4, fat: 0.1, carbs: 70 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "джем": {
        name: "Джем",
        category: "sweet",
        aliases: ["Джем"],
        raw: { kcal: 250, protein: 0.4, fat: 0.1, carbs: 65 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "дрожжи": {
        name: "Дрожжи прессованные",
        category: "other",
        aliases: ["Дрожжи прессованные"],
        raw: { kcal: 105, protein: 8.4, fat: 1.9, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "желатин": {
        name: "Желатин сухой",
        category: "other",
        aliases: ["Желатин сухой"],
        raw: { kcal: 335, protein: 85.6, fat: 0.1, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовые-хлебцы": {
        name: "Рисовые хлебцы",
        category: "grain",
        aliases: ["Рисовые хлебцы"],
        raw: { kcal: 387, protein: 8.2, fat: 2.8, carbs: 81.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяные-отруби": {
        name: "Овсяные отруби",
        category: "grain",
        aliases: ["Овсяные отруби"],
        raw: { kcal: 246, protein: 17.3, fat: 7, carbs: 66.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пшеничные-отруби": {
        name: "Пшеничные отруби",
        category: "grain",
        aliases: ["Пшеничные отруби"],
        raw: { kcal: 216, protein: 15.6, fat: 4.3, carbs: 64.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "зелёный-лук": {
        name: "Зелёный лук",
        category: "vegetable",
        aliases: ["Зелёный лук", "зеленый лук"],
        raw: { kcal: 32, protein: 1.8, fat: 0.2, carbs: 7.3 },
        cookedWeightRatio: 0.9,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "укроп": {
        name: "Укроп",
        category: "vegetable",
        aliases: ["Укроп"],
        raw: { kcal: 43, protein: 3.5, fat: 1.1, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "петрушка": {
        name: "Петрушка",
        category: "vegetable",
        aliases: ["Петрушка"],
        raw: { kcal: 36, protein: 3, fat: 0.8, carbs: 6.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кинза": {
        name: "Кинза",
        category: "vegetable",
        aliases: ["Кинза"],
        raw: { kcal: 23, protein: 2.1, fat: 0.5, carbs: 3.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "имбирь": {
        name: "Имбирь свежий",
        category: "vegetable",
        aliases: ["Имбирь свежий"],
        raw: { kcal: 80, protein: 1.8, fat: 0.8, carbs: 17.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "оливки": {
        name: "Оливки",
        category: "vegetable",
        aliases: ["Оливки"],
        raw: { kcal: 145, protein: 1, fat: 15.3, carbs: 3.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "маслины": {
        name: "Маслины",
        category: "vegetable",
        aliases: ["Маслины"],
        raw: { kcal: 115, protein: 0.8, fat: 10.7, carbs: 6.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "солёные-огурцы": {
        name: "Огурцы солёные",
        category: "vegetable",
        aliases: ["Огурцы солёные"],
        raw: { kcal: 11, protein: 0.3, fat: 0.2, carbs: 2.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "квашеная-капуста": {
        name: "Квашеная капуста",
        category: "vegetable",
        aliases: ["Квашеная капуста"],
        raw: { kcal: 19, protein: 0.9, fat: 0.1, carbs: 4.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "морская-капуста": {
        name: "Морская капуста",
        category: "vegetable",
        aliases: ["Морская капуста"],
        raw: { kcal: 49, protein: 0.8, fat: 5, carbs: 9.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сухое-молоко": {
        name: "Сухое молоко",
        category: "dairy",
        aliases: ["Сухое молоко"],
        raw: { kcal: 496, protein: 26.3, fat: 26.7, carbs: 38.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "протеин-сывороточный": {
        name: "Сывороточный протеин (порошок)",
        category: "other",
        aliases: ["Сывороточный протеин (порошок)", "сывороточный протеин"],
        raw: { kcal: 400, protein: 80, fat: 6, carbs: 8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сок-апельсиновый": {
        name: "Апельсиновый сок",
        category: "drink",
        aliases: ["Апельсиновый сок"],
        raw: { kcal: 45, protein: 0.7, fat: 0.2, carbs: 10.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сок-яблочный": {
        name: "Яблочный сок",
        category: "drink",
        aliases: ["Яблочный сок"],
        raw: { kcal: 46, protein: 0.1, fat: 0.1, carbs: 11.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кофе-чёрный": {
        name: "Кофе чёрный без сахара",
        category: "drink",
        aliases: ["Кофе чёрный без сахара", "кофе"],
        raw: { kcal: 2, protein: 0.1, fat: 0, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "чай-чёрный": {
        name: "Чёрный чай без сахара",
        category: "drink",
        aliases: ["Чёрный чай без сахара", "чай"],
        raw: { kcal: 1, protein: 0, fat: 0, carbs: 0.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "пельмени": {
        name: "Пельмени мясные (средние)",
        category: "other",
        aliases: ["Пельмени мясные (средние)"],
        raw: { kcal: 275, protein: 11, fat: 14, carbs: 27 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "вареники-с-картофелем": {
        name: "Вареники с картофелем",
        category: "other",
        aliases: ["Вареники с картофелем"],
        raw: { kcal: 178, protein: 4.4, fat: 4.5, carbs: 30 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "блины": {
        name: "Блины домашние",
        category: "other",
        aliases: ["Блины домашние"],
        raw: { kcal: 227, protein: 6.1, fat: 12.3, carbs: 24.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сухари-панировочные": {
        name: "Панировочные сухари",
        category: "grain",
        aliases: ["Панировочные сухари"],
        raw: { kcal: 395, protein: 13, fat: 5, carbs: 72 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рисовая-мука": {
        name: "Рисовая мука",
        category: "grain",
        aliases: ["Рисовая мука"],
        raw: { kcal: 366, protein: 6, fat: 1.4, carbs: 80 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофельный-крахмал": {
        name: "Картофельный крахмал",
        category: "other",
        aliases: ["Картофельный крахмал"],
        raw: { kcal: 333, protein: 0.1, fat: 0, carbs: 83.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузный-крахмал": {
        name: "Кукурузный крахмал",
        category: "other",
        aliases: ["Кукурузный крахмал"],
        raw: { kcal: 381, protein: 0.3, fat: 0.1, carbs: 91.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сгущённое-молоко": {
        name: "Сгущённое молоко с сахаром",
        category: "dairy",
        aliases: ["Сгущённое молоко с сахаром", "сгущенка"],
        raw: { kcal: 321, protein: 7.9, fat: 8.7, carbs: 54.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сырники": {
        name: "Сырники (средние)",
        category: "other",
        aliases: ["Сырники (средние)"],
        raw: { kcal: 183, protein: 14, fat: 8, carbs: 16 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "котлета-говяжья": {
        name: "Говяжья котлета домашняя",
        category: "other",
        aliases: ["Говяжья котлета домашняя"],
        raw: { kcal: 250, protein: 17, fat: 18, carbs: 5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "куриная-котлета": {
        name: "Куриная котлета домашняя",
        category: "other",
        aliases: ["Куриная котлета домашняя"],
        raw: { kcal: 190, protein: 19, fat: 9, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "рис-варёный": {
        name: "Рис белый варёный",
        category: "grain",
        aliases: ["Рис белый варёный"],
        raw: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "гречка-варёная": {
        name: "Гречка варёная",
        category: "grain",
        aliases: ["Гречка варёная"],
        raw: { kcal: 92, protein: 3.4, fat: 0.6, carbs: 19.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяная-каша": {
        name: "Овсяная каша на воде",
        category: "grain",
        aliases: ["Овсяная каша на воде"],
        raw: { kcal: 71, protein: 2.5, fat: 1.5, carbs: 12 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "макароны-варёные": {
        name: "Макароны варёные",
        category: "grain",
        aliases: ["Макароны варёные"],
        raw: { kcal: 157, protein: 5.8, fat: 0.9, carbs: 30.9 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофель-варёный": {
        name: "Картофель варёный",
        category: "vegetable",
        aliases: ["Картофель варёный"],
        raw: { kcal: 87, protein: 1.9, fat: 0.1, carbs: 20.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "картофель-печёный": {
        name: "Картофель печёный без масла",
        category: "vegetable",
        aliases: ["Картофель печёный без масла"],
        raw: { kcal: 93, protein: 2.5, fat: 0.1, carbs: 21.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "курица-варёная": {
        name: "Куриная грудка варёная",
        category: "meat",
        aliases: ["Куриная грудка варёная"],
        raw: { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "яйцо-варёное": {
        name: "Яйцо варёное",
        category: "eggs",
        aliases: ["Яйцо варёное"],
        raw: { kcal: 155, protein: 12.6, fat: 10.6, carbs: 1.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "чечевица-варёная": {
        name: "Чечевица варёная",
        category: "legumes",
        aliases: ["Чечевица варёная"],
        raw: { kcal: 116, protein: 9, fat: 0.4, carbs: 20.1 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "нут-варёный": {
        name: "Нут варёный",
        category: "legumes",
        aliases: ["Нут варёный"],
        raw: { kcal: 164, protein: 8.9, fat: 2.6, carbs: 27.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фасоль-варёная": {
        name: "Фасоль варёная",
        category: "legumes",
        aliases: ["Фасоль варёная"],
        raw: { kcal: 127, protein: 8.7, fat: 0.5, carbs: 22.8 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукуруза-консервированная": {
        name: "Кукуруза консервированная",
        category: "vegetable",
        aliases: ["Кукуруза консервированная"],
        raw: { kcal: 86, protein: 3.2, fat: 1.2, carbs: 18.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "горошек-консервированный": {
        name: "Горошек зелёный консервированный",
        category: "vegetable",
        aliases: ["Горошек зелёный консервированный"],
        raw: { kcal: 69, protein: 4.4, fat: 0.4, carbs: 11.4 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "тунец-консервированный": {
        name: "Тунец консервированный в собственном соку",
        category: "fish",
        aliases: ["Тунец консервированный в собственном соку"],
        raw: { kcal: 116, protein: 25.5, fat: 0.8, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "фасоль-консервированная": {
        name: "Фасоль консервированная",
        category: "legumes",
        aliases: ["Фасоль консервированная"],
        raw: { kcal: 95, protein: 6.7, fat: 0.5, carbs: 16.2 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "хумус": {
        name: "Хумус",
        category: "legumes",
        aliases: ["Хумус"],
        raw: { kcal: 166, protein: 7.9, fat: 9.6, carbs: 14.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "темпе": {
        name: "Темпе",
        category: "legumes",
        aliases: ["Темпе"],
        raw: { kcal: 192, protein: 20.3, fat: 10.8, carbs: 7.6 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сейтан": {
        name: "Сейтан",
        category: "other",
        aliases: ["Сейтан"],
        raw: { kcal: 141, protein: 24.7, fat: 2.1, carbs: 7.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кокосовое-молоко": {
        name: "Кокосовое молоко консервированное",
        category: "dairy",
        aliases: ["Кокосовое молоко консервированное"],
        raw: { kcal: 230, protein: 2.3, fat: 23.8, carbs: 5.5 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "миндальное-молоко": {
        name: "Миндальный напиток без сахара",
        category: "drink",
        aliases: ["Миндальный напиток без сахара"],
        raw: { kcal: 15, protein: 0.6, fat: 1.2, carbs: 0.3 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "овсяное-молоко": {
        name: "Овсяный напиток без сахара",
        category: "drink",
        aliases: ["Овсяный напиток без сахара"],
        raw: { kcal: 45, protein: 1, fat: 1.5, carbs: 6.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "соевое-молоко": {
        name: "Соевый напиток без сахара",
        category: "drink",
        aliases: ["Соевый напиток без сахара"],
        raw: { kcal: 33, protein: 3.3, fat: 1.8, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "гранола": {
        name: "Гранола",
        category: "grain",
        aliases: ["Гранола"],
        raw: { kcal: 471, protein: 10, fat: 20, carbs: 64 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "мюсли": {
        name: "Мюсли",
        category: "grain",
        aliases: ["Мюсли"],
        raw: { kcal: 370, protein: 10, fat: 7, carbs: 66 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "кукурузные-хлопья": {
        name: "Кукурузные хлопья",
        category: "grain",
        aliases: ["Кукурузные хлопья"],
        raw: { kcal: 357, protein: 7.5, fat: 0.4, carbs: 84 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "баранки": {
        name: "Баранки",
        category: "grain",
        aliases: ["Баранки"],
        raw: { kcal: 310, protein: 10, fat: 2, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "сушки": {
        name: "Сушки",
        category: "grain",
        aliases: ["Сушки"],
        raw: { kcal: 330, protein: 11, fat: 1, carbs: 70 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    },

    "крекеры": {
        name: "Крекеры",
        category: "grain",
        aliases: ["Крекеры"],
        raw: { kcal: 430, protein: 9, fat: 14, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: "Справочные усреднённые значения; сверяй с упаковкой для брендовых продуктов"
    }
,

    "куриная-печень": {
        name: "Куриная печень",
        category: "meat",
        aliases: ["куриная печень","печень куриная"],
        raw: { kcal: 119, protein: 17, fat: 4.8, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "говяжья-печень": {
        name: "Говяжья печень",
        category: "meat",
        aliases: ["говяжья печень","печень говяжья"],
        raw: { kcal: 135, protein: 20.4, fat: 3.6, carbs: 3.9 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сердца-куриные": {
        name: "Куриные сердца",
        category: "meat",
        aliases: ["куриные сердца","куриные сердечки"],
        raw: { kcal: 153, protein: 15.6, fat: 9.3, carbs: 0.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "желудки-куриные": {
        name: "Куриные желудки",
        category: "meat",
        aliases: ["куриные желудки","желудки куриные"],
        raw: { kcal: 94, protein: 17.7, fat: 2.1, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "козлятина": {
        name: "Козлятина",
        category: "meat",
        aliases: ["козлятина"],
        raw: { kcal: 143, protein: 27.1, fat: 3, carbs: 0 },
        cookedWeightRatio: 0.7,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перепел": {
        name: "Перепёлка",
        category: "meat",
        aliases: ["перепёлка","перепелка"],
        raw: { kcal: 134, protein: 21.8, fat: 4.5, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кролик-печень": {
        name: "Печень кролика",
        category: "meat",
        aliases: ["печень кролика"],
        raw: { kcal: 166, protein: 19, fat: 10, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "камбала": {
        name: "Камбала",
        category: "fish",
        aliases: ["камбала"],
        raw: { kcal: 86, protein: 16.5, fat: 2.4, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "палтус": {
        name: "Палтус",
        category: "fish",
        aliases: ["палтус"],
        raw: { kcal: 140, protein: 18.6, fat: 6.5, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "судак": {
        name: "Судак",
        category: "fish",
        aliases: ["судак"],
        raw: { kcal: 84, protein: 18.4, fat: 1.1, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "щука": {
        name: "Щука",
        category: "fish",
        aliases: ["щука"],
        raw: { kcal: 88, protein: 18.4, fat: 1, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "карась": {
        name: "Карась",
        category: "fish",
        aliases: ["карась"],
        raw: { kcal: 87, protein: 17.7, fat: 1.8, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "морской-окунь": {
        name: "Морской окунь",
        category: "fish",
        aliases: ["морской окунь"],
        raw: { kcal: 105, protein: 18.4, fat: 3.4, carbs: 0 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "икра-лососевая": {
        name: "Икра лососёвая",
        category: "fish",
        aliases: ["икра лососёвая","красная икра"],
        raw: { kcal: 250, protein: 31.2, fat: 13.2, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "краб": {
        name: "Крабовое мясо натуральное",
        category: "fish",
        aliases: ["крабовое мясо натуральное","мясо краба"],
        raw: { kcal: 97, protein: 19.4, fat: 1.5, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-1-5": {
        name: "Молоко 1,5%",
        category: "dairy",
        aliases: ["молоко 1,5%","молоко 1.5"],
        raw: { kcal: 44, protein: 3, fat: 1.5, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-3-2": {
        name: "Молоко 3,2%",
        category: "dairy",
        aliases: ["молоко 3,2%","молоко 3.2"],
        raw: { kcal: 60, protein: 3, fat: 3.2, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "йогурт-греческий-2": {
        name: "Греческий йогурт 2%",
        category: "dairy",
        aliases: ["греческий йогурт 2%","йогурт греческий"],
        raw: { kcal: 73, protein: 10, fat: 2, carbs: 3.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "йогурт-натуральный": {
        name: "Йогурт натуральный",
        category: "dairy",
        aliases: ["йогурт натуральный"],
        raw: { kcal: 61, protein: 3.5, fat: 3.3, carbs: 4.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "творог-2": {
        name: "Творог 2%",
        category: "dairy",
        aliases: ["творог 2%","творог 2"],
        raw: { kcal: 103, protein: 18, fat: 2, carbs: 3.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "творог-9": {
        name: "Творог 9%",
        category: "dairy",
        aliases: ["творог 9%","творог 9"],
        raw: { kcal: 159, protein: 16.7, fat: 9, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рикотта": {
        name: "Рикотта",
        category: "dairy",
        aliases: ["рикотта"],
        raw: { kcal: 174, protein: 11.3, fat: 13, carbs: 3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пармезан": {
        name: "Пармезан",
        category: "dairy",
        aliases: ["пармезан"],
        raw: { kcal: 431, protein: 38, fat: 29, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сыр-гауда": {
        name: "Сыр гауда",
        category: "dairy",
        aliases: ["сыр гауда","гауда"],
        raw: { kcal: 356, protein: 24.9, fat: 27.4, carbs: 2.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "краснокочанная-капуста": {
        name: "Краснокочанная капуста",
        category: "vegetable",
        aliases: ["краснокочанная капуста"],
        raw: { kcal: 31, protein: 1.4, fat: 0.2, carbs: 7.4 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "дайкон": {
        name: "Дайкон",
        category: "vegetable",
        aliases: ["дайкон"],
        raw: { kcal: 18, protein: 0.6, fat: 0.1, carbs: 4.1 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "репа": {
        name: "Репа",
        category: "vegetable",
        aliases: ["репа"],
        raw: { kcal: 28, protein: 0.9, fat: 0.1, carbs: 6.4 },
        cookedWeightRatio: 0.85,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пастернак": {
        name: "Пастернак",
        category: "vegetable",
        aliases: ["пастернак"],
        raw: { kcal: 75, protein: 1.2, fat: 0.3, carbs: 18 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сельдерей-стебель": {
        name: "Сельдерей стеблевой",
        category: "vegetable",
        aliases: ["сельдерей стеблевой","стеблевой сельдерей"],
        raw: { kcal: 16, protein: 0.7, fat: 0.2, carbs: 3 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сельдерей-корень": {
        name: "Корень сельдерея",
        category: "vegetable",
        aliases: ["корень сельдерея"],
        raw: { kcal: 42, protein: 1.5, fat: 0.3, carbs: 9.2 },
        cookedWeightRatio: 0.85,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "руккола": {
        name: "Руккола",
        category: "vegetable",
        aliases: ["руккола"],
        raw: { kcal: 25, protein: 2.6, fat: 0.7, carbs: 3.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мангольд": {
        name: "Мангольд",
        category: "vegetable",
        aliases: ["мангольд"],
        raw: { kcal: 19, protein: 1.8, fat: 0.2, carbs: 3.7 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "артишок": {
        name: "Артишок",
        category: "vegetable",
        aliases: ["артишок"],
        raw: { kcal: 47, protein: 3.3, fat: 0.2, carbs: 10.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "порей": {
        name: "Лук-порей",
        category: "vegetable",
        aliases: ["лук-порей"],
        raw: { kcal: 61, protein: 1.5, fat: 0.3, carbs: 14.2 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "помидоры-черри": {
        name: "Помидоры черри",
        category: "vegetable",
        aliases: ["помидоры черри","черри"],
        raw: { kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перец-халапеньо": {
        name: "Перец халапеньо",
        category: "vegetable",
        aliases: ["перец халапеньо","халапеньо"],
        raw: { kcal: 29, protein: 0.9, fat: 0.4, carbs: 6.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-стручковая": {
        name: "Фасоль стручковая",
        category: "vegetable",
        aliases: ["фасоль стручковая","стручковая фасоль"],
        raw: { kcal: 31, protein: 1.8, fat: 0.2, carbs: 7 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "горох-зеленый": {
        name: "Горошек зелёный свежий",
        category: "vegetable",
        aliases: ["горошек зелёный свежий","зеленый горошек"],
        raw: { kcal: 81, protein: 5.4, fat: 0.4, carbs: 14.5 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кукуруза-свежая": {
        name: "Кукуруза свежая",
        category: "vegetable",
        aliases: ["кукуруза свежая","кукуруза"],
        raw: { kcal: 86, protein: 3.3, fat: 1.4, carbs: 18.7 },
        cookedWeightRatio: 0.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "яблоко-гренни-смит": {
        name: "Яблоко Гренни Смит",
        category: "fruit",
        aliases: ["яблоко гренни смит","зеленое яблоко"],
        raw: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 13.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "груша-конференция": {
        name: "Груша",
        category: "fruit",
        aliases: ["груша"],
        raw: { kcal: 57, protein: 0.4, fat: 0.1, carbs: 15.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "слива": {
        name: "Слива",
        category: "fruit",
        aliases: ["слива"],
        raw: { kcal: 46, protein: 0.7, fat: 0.3, carbs: 11.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "абрикос": {
        name: "Абрикос",
        category: "fruit",
        aliases: ["абрикос"],
        raw: { kcal: 48, protein: 1.4, fat: 0.4, carbs: 11.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гранат": {
        name: "Гранат",
        category: "fruit",
        aliases: ["гранат"],
        raw: { kcal: 83, protein: 1.7, fat: 1.2, carbs: 18.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "хурма": {
        name: "Хурма",
        category: "fruit",
        aliases: ["хурма"],
        raw: { kcal: 70, protein: 0.6, fat: 0.2, carbs: 18.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "папайя": {
        name: "Папайя",
        category: "fruit",
        aliases: ["папайя"],
        raw: { kcal: 43, protein: 0.5, fat: 0.3, carbs: 10.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "маракуйя": {
        name: "Маракуйя",
        category: "fruit",
        aliases: ["маракуйя","пассифлора"],
        raw: { kcal: 97, protein: 2.2, fat: 0.7, carbs: 23.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "клюква": {
        name: "Клюква",
        category: "fruit",
        aliases: ["клюква"],
        raw: { kcal: 46, protein: 0.4, fat: 0.1, carbs: 12.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ежевика": {
        name: "Ежевика",
        category: "fruit",
        aliases: ["ежевика"],
        raw: { kcal: 43, protein: 1.4, fat: 0.5, carbs: 9.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "смородина-черная": {
        name: "Чёрная смородина",
        category: "fruit",
        aliases: ["чёрная смородина","черная смородина"],
        raw: { kcal: 63, protein: 1.4, fat: 0.4, carbs: 15.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "крыжовник": {
        name: "Крыжовник",
        category: "fruit",
        aliases: ["крыжовник"],
        raw: { kcal: 44, protein: 0.9, fat: 0.6, carbs: 10.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "инжир-сушеный": {
        name: "Инжир сушёный",
        category: "fruit",
        aliases: ["инжир сушёный","сушеный инжир"],
        raw: { kcal: 249, protein: 3.3, fat: 0.9, carbs: 63.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "курага": {
        name: "Курага",
        category: "fruit",
        aliases: ["курага","сушеные абрикосы"],
        raw: { kcal: 241, protein: 3.4, fat: 0.5, carbs: 62.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чернослив": {
        name: "Чернослив",
        category: "fruit",
        aliases: ["чернослив"],
        raw: { kcal: 240, protein: 2.2, fat: 0.4, carbs: 63.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рис-длиннозерный-сухой": {
        name: "Рис длиннозёрный сухой",
        category: "grain",
        aliases: ["рис длиннозёрный сухой","длиннозерный рис сухой"],
        raw: { kcal: 365, protein: 7.1, fat: 0.7, carbs: 80 },
        cookedWeightRatio: 2.8,
        nutritionSource: {"database":"USDA FoodData Central SR Legacy","fdcId":169756,"sourceUrl":"https://fdc.nal.usda.gov/food-details/169756/nutrients","note":"Белый длиннозёрный рис, сухой, необогащённый; значения на 100 г."}
    },

    "рис-басмати-сухой": {
        name: "Рис басмати сухой",
        category: "grain",
        aliases: ["рис басмати сухой","басмати сухой"],
        raw: { kcal: 365, protein: 9, fat: 0.6, carbs: 78 },
        cookedWeightRatio: 2.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рис-жасмин-сухой": {
        name: "Рис жасмин сухой",
        category: "grain",
        aliases: ["рис жасмин сухой","жасмин сухой"],
        raw: { kcal: 356, protein: 6.7, fat: 0.7, carbs: 79 },
        cookedWeightRatio: 2.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "овсяные-хлопья": {
        name: "Овсяные хлопья сухие",
        category: "grain",
        aliases: ["овсяные хлопья сухие","овсянка сухая"],
        raw: { kcal: 389, protein: 16.9, fat: 6.9, carbs: 66.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-кукурузная": {
        name: "Мука кукурузная",
        category: "grain",
        aliases: ["мука кукурузная"],
        raw: { kcal: 361, protein: 6.9, fat: 3.9, carbs: 76.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-рисовая": {
        name: "Мука рисовая",
        category: "grain",
        aliases: ["мука рисовая"],
        raw: { kcal: 366, protein: 6, fat: 1.4, carbs: 80.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "манка-сухая": {
        name: "Манная крупа сухая",
        category: "grain",
        aliases: ["манная крупа сухая","манка"],
        raw: { kcal: 360, protein: 12.7, fat: 1, carbs: 72 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перловка-сухая": {
        name: "Перловая крупа сухая",
        category: "grain",
        aliases: ["перловая крупа сухая","перловка"],
        raw: { kcal: 352, protein: 9.9, fat: 1.2, carbs: 77.7 },
        cookedWeightRatio: 3,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кукурузная-крупа-сухая": {
        name: "Кукурузная крупа сухая",
        category: "grain",
        aliases: ["кукурузная крупа сухая"],
        raw: { kcal: 365, protein: 8.3, fat: 1.2, carbs: 79 },
        cookedWeightRatio: 3,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "амарант": {
        name: "Амарант сухой",
        category: "grain",
        aliases: ["амарант сухой"],
        raw: { kcal: 371, protein: 13.6, fat: 7, carbs: 65.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сорго": {
        name: "Сорго сухое",
        category: "grain",
        aliases: ["сорго сухое"],
        raw: { kcal: 329, protein: 10.6, fat: 3.5, carbs: 72.1 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-красная-сухая": {
        name: "Фасоль красная сухая",
        category: "legume",
        aliases: ["фасоль красная сухая"],
        raw: { kcal: 337, protein: 22.5, fat: 1.1, carbs: 61.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-белая-сухая": {
        name: "Фасоль белая сухая",
        category: "legume",
        aliases: ["фасоль белая сухая"],
        raw: { kcal: 333, protein: 23.4, fat: 0.9, carbs: 60.3 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чечевица-красная-сухая": {
        name: "Чечевица красная сухая",
        category: "legume",
        aliases: ["чечевица красная сухая"],
        raw: { kcal: 358, protein: 23.9, fat: 2.2, carbs: 63.1 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соевое-мясо-сухое": {
        name: "Текстурат соевый сухой",
        category: "legume",
        aliases: ["текстурат соевый сухой","соевое мясо"],
        raw: { kcal: 327, protein: 51.5, fat: 1.2, carbs: 33.9 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лаваш-тонкий": {
        name: "Лаваш тонкий",
        category: "bakery",
        aliases: ["лаваш тонкий"],
        raw: { kcal: 275, protein: 9.1, fat: 1.2, carbs: 55.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пита": {
        name: "Пита",
        category: "bakery",
        aliases: ["пита"],
        raw: { kcal: 275, protein: 9.1, fat: 1.2, carbs: 55.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "хлебцы-ржаные": {
        name: "Хлебцы ржаные",
        category: "bakery",
        aliases: ["хлебцы ржаные"],
        raw: { kcal: 366, protein: 9, fat: 2, carbs: 75 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "панировочные-сухари": {
        name: "Панировочные сухари",
        category: "bakery",
        aliases: ["панировочные сухари"],
        raw: { kcal: 395, protein: 13, fat: 5, carbs: 72 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "миндальная-мука": {
        name: "Мука миндальная",
        category: "nuts",
        aliases: ["мука миндальная"],
        raw: { kcal: 571, protein: 21.2, fat: 50, carbs: 21.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "арахисовая-паста": {
        name: "Паста арахисовая без сахара",
        category: "nuts",
        aliases: ["паста арахисовая без сахара","арахисовая паста"],
        raw: { kcal: 588, protein: 25, fat: 50, carbs: 20 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пекан": {
        name: "Орех пекан",
        category: "nuts",
        aliases: ["орех пекан"],
        raw: { kcal: 691, protein: 9.2, fat: 72, carbs: 13.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "макадамия": {
        name: "Орех макадамия",
        category: "nuts",
        aliases: ["орех макадамия"],
        raw: { kcal: 718, protein: 7.9, fat: 75.8, carbs: 13.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кедровые-орехи": {
        name: "Кедровые орехи",
        category: "nuts",
        aliases: ["кедровые орехи"],
        raw: { kcal: 673, protein: 13.7, fat: 68.4, carbs: 13.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "семена-кунжута": {
        name: "Кунжут",
        category: "nuts",
        aliases: ["кунжут"],
        raw: { kcal: 573, protein: 17.7, fat: 49.7, carbs: 23.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "семена-конопли": {
        name: "Семена конопли очищенные",
        category: "nuts",
        aliases: ["семена конопли очищенные"],
        raw: { kcal: 553, protein: 31.6, fat: 48.8, carbs: 8.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тахини": {
        name: "Тахини",
        category: "nuts",
        aliases: ["тахини"],
        raw: { kcal: 595, protein: 17, fat: 53.8, carbs: 21.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-терияки": {
        name: "Соус терияки",
        category: "condiment",
        aliases: ["соус терияки"],
        raw: { kcal: 89, protein: 5.9, fat: 0, carbs: 15.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "горчица-дижонская": {
        name: "Горчица дижонская",
        category: "condiment",
        aliases: ["горчица дижонская"],
        raw: { kcal: 66, protein: 4.4, fat: 3.3, carbs: 5.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-барбекю": {
        name: "Соус барбекю",
        category: "condiment",
        aliases: ["соус барбекю"],
        raw: { kcal: 172, protein: 1, fat: 0.6, carbs: 40 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "уксус-бальзамический": {
        name: "Уксус бальзамический",
        category: "condiment",
        aliases: ["уксус бальзамический"],
        raw: { kcal: 88, protein: 0.5, fat: 0, carbs: 17 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кленовый-сироп": {
        name: "Кленовый сироп",
        category: "condiment",
        aliases: ["кленовый сироп"],
        raw: { kcal: 260, protein: 0, fat: 0.1, carbs: 67 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "шоколад-горький-85": {
        name: "Шоколад горький 85%",
        category: "snack",
        aliases: ["шоколад горький 85%"],
        raw: { kcal: 598, protein: 10.9, fat: 46, carbs: 19 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "какао-порошок": {
        name: "Какао-порошок без сахара",
        category: "snack",
        aliases: ["какао-порошок без сахара"],
        raw: { kcal: 228, protein: 19.6, fat: 13.7, carbs: 57.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "дрожжи-сухие": {
        name: "Дрожжи сухие",
        category: "other",
        aliases: ["дрожжи сухие"],
        raw: { kcal: 325, protein: 40.4, fat: 7.6, carbs: 41.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тофу-копченый": {
        name: "Тофу копчёный",
        category: "legume",
        aliases: ["тофу копчёный"],
        raw: { kcal: 160, protein: 17, fat: 9, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рис-бурый-сухой": {
        name: "Рис бурый сухой",
        category: "grain",
        aliases: ["рис бурый сухой"],
        raw: { kcal: 370, protein: 7.9, fat: 2.9, carbs: 77.2 },
        cookedWeightRatio: 2.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гречка-зеленая-сухая": {
        name: "Гречка зелёная сухая",
        category: "grain",
        aliases: ["гречка зелёная сухая"],
        raw: { kcal: 343, protein: 13.3, fat: 3.4, carbs: 71.5 },
        cookedWeightRatio: 2.7,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "булгур-сухой": {
        name: "Булгур сухой",
        category: "grain",
        aliases: ["булгур сухой"],
        raw: { kcal: 342, protein: 12.3, fat: 1.3, carbs: 75.9 },
        cookedWeightRatio: 2.7,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "полента-сухая": {
        name: "Полента сухая",
        category: "grain",
        aliases: ["полента сухая"],
        raw: { kcal: 370, protein: 7, fat: 1.8, carbs: 79 },
        cookedWeightRatio: 3,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лапша-рисовая-сухая": {
        name: "Рисовая лапша сухая",
        category: "grain",
        aliases: ["рисовая лапша сухая"],
        raw: { kcal: 364, protein: 5.9, fat: 1.1, carbs: 80.2 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лапша-гречневая-сухая": {
        name: "Гречневая лапша сухая",
        category: "grain",
        aliases: ["гречневая лапша сухая"],
        raw: { kcal: 336, protein: 14.4, fat: 0.7, carbs: 70 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "паста-цельнозерновая-сухая": {
        name: "Макароны цельнозерновые сухие",
        category: "grain",
        aliases: ["макароны цельнозерновые сухие"],
        raw: { kcal: 348, protein: 13, fat: 2.5, carbs: 70 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кускус-цельнозерновой": {
        name: "Кускус цельнозерновой сухой",
        category: "grain",
        aliases: ["кускус цельнозерновой сухой"],
        raw: { kcal: 376, protein: 12.8, fat: 1.9, carbs: 77.4 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-гречневая": {
        name: "Мука гречневая",
        category: "grain",
        aliases: ["мука гречневая"],
        raw: { kcal: 335, protein: 12.6, fat: 3.1, carbs: 70.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-овсяная": {
        name: "Мука овсяная",
        category: "grain",
        aliases: ["мука овсяная"],
        raw: { kcal: 404, protein: 14.7, fat: 9.1, carbs: 65.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-кокосовая": {
        name: "Мука кокосовая",
        category: "nuts",
        aliases: ["мука кокосовая"],
        raw: { kcal: 400, protein: 20, fat: 13, carbs: 60 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пшеничные-зародыши": {
        name: "Зародыши пшеницы",
        category: "grain",
        aliases: ["зародыши пшеницы"],
        raw: { kcal: 360, protein: 23.2, fat: 9.7, carbs: 51.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "эдамаме": {
        name: "Эдамаме",
        category: "legume",
        aliases: ["эдамаме"],
        raw: { kcal: 121, protein: 12, fat: 5.2, carbs: 8.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "нут-консервированный": {
        name: "Нут консервированный",
        category: "legume",
        aliases: ["нут консервированный"],
        raw: { kcal: 139, protein: 7.1, fat: 2.8, carbs: 22.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чечевица-консервированная": {
        name: "Чечевица консервированная",
        category: "legume",
        aliases: ["чечевица консервированная"],
        raw: { kcal: 91, protein: 6, fat: 0.4, carbs: 16 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "маш-сухой": {
        name: "Маш сухой",
        category: "legume",
        aliases: ["маш сухой"],
        raw: { kcal: 347, protein: 23.9, fat: 1.2, carbs: 62.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "люпин-вареный": {
        name: "Люпин варёный",
        category: "legume",
        aliases: ["люпин варёный"],
        raw: { kcal: 119, protein: 15.6, fat: 2.9, carbs: 9.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фарш-куриный": {
        name: "Фарш куриный",
        category: "meat",
        aliases: ["фарш куриный"],
        raw: { kcal: 143, protein: 17.4, fat: 8.1, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фарш-индейки": {
        name: "Фарш индейки",
        category: "meat",
        aliases: ["фарш индейки"],
        raw: { kcal: 150, protein: 17, fat: 8, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "бекон-жареный": {
        name: "Бекон жареный",
        category: "meat",
        aliases: ["бекон жареный"],
        raw: { kcal: 541, protein: 37, fat: 42, carbs: 1.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ветчина-куриная": {
        name: "Ветчина куриная",
        category: "meat",
        aliases: ["ветчина куриная"],
        raw: { kcal: 126, protein: 18, fat: 5, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пастрами-индейка": {
        name: "Пастрами из индейки",
        category: "meat",
        aliases: ["пастрами из индейки"],
        raw: { kcal: 110, protein: 20, fat: 2.5, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "колбаса-докторская": {
        name: "Колбаса варёная докторская",
        category: "meat",
        aliases: ["колбаса варёная докторская"],
        raw: { kcal: 257, protein: 12.8, fat: 22.2, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сосиски-молочные": {
        name: "Сосиски молочные",
        category: "meat",
        aliases: ["сосиски молочные"],
        raw: { kcal: 261, protein: 11, fat: 23.9, carbs: 1.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сардельки": {
        name: "Сардельки",
        category: "meat",
        aliases: ["сардельки"],
        raw: { kcal: 322, protein: 10, fat: 31, carbs: 1.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "вареники-картофель": {
        name: "Вареники с картофелем, варёные",
        category: "prepared",
        aliases: ["вареники с картофелем, варёные"],
        raw: { kcal: 160, protein: 4, fat: 3, carbs: 29 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "голубцы": {
        name: "Голубцы с мясом и рисом",
        category: "prepared",
        aliases: ["голубцы с мясом и рисом"],
        raw: { kcal: 120, protein: 7, fat: 6, carbs: 10 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "котлета-куриная": {
        name: "Котлета куриная жареная",
        category: "prepared",
        aliases: ["котлета куриная жареная"],
        raw: { kcal: 220, protein: 18, fat: 12, carbs: 10 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фалафель": {
        name: "Фалафель жареный",
        category: "prepared",
        aliases: ["фалафель жареный"],
        raw: { kcal: 333, protein: 13.3, fat: 17.8, carbs: 31.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "хумус-классический": {
        name: "Хумус классический",
        category: "prepared",
        aliases: ["хумус классический"],
        raw: { kcal: 166, protein: 7.9, fat: 9.6, carbs: 14.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гуакамоле": {
        name: "Гуакамоле",
        category: "prepared",
        aliases: ["гуакамоле"],
        raw: { kcal: 150, protein: 2, fat: 13, carbs: 8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "салат-коул-слоу": {
        name: "Салат коул-слоу",
        category: "prepared",
        aliases: ["салат коул-слоу"],
        raw: { kcal: 152, protein: 1, fat: 11, carbs: 12 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "картофель-фри": {
        name: "Картофель фри",
        category: "prepared",
        aliases: ["картофель фри"],
        raw: { kcal: 312, protein: 3.4, fat: 15, carbs: 41 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "картофельное-пюре": {
        name: "Картофельное пюре на молоке",
        category: "prepared",
        aliases: ["картофельное пюре на молоке"],
        raw: { kcal: 113, protein: 2, fat: 4.2, carbs: 17 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "картофель-запеченный": {
        name: "Картофель запечённый",
        category: "prepared",
        aliases: ["картофель запечённый"],
        raw: { kcal: 93, protein: 2.5, fat: 0.1, carbs: 21.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "батат-запеченный": {
        name: "Батат запечённый",
        category: "prepared",
        aliases: ["батат запечённый"],
        raw: { kcal: 90, protein: 2, fat: 0.2, carbs: 20.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рис-вареный": {
        name: "Рис белый варёный",
        category: "grain",
        aliases: ["рис белый варёный"],
        raw: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гречка-вареная": {
        name: "Гречка варёная",
        category: "grain",
        aliases: ["гречка варёная"],
        raw: { kcal: 92, protein: 3.4, fat: 0.6, carbs: 19.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "макароны-вареные": {
        name: "Макароны варёные",
        category: "grain",
        aliases: ["макароны варёные"],
        raw: { kcal: 157, protein: 5.8, fat: 0.9, carbs: 30.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перловка-вареная": {
        name: "Перловка варёная",
        category: "grain",
        aliases: ["перловка варёная"],
        raw: { kcal: 123, protein: 2.3, fat: 0.4, carbs: 28.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "киноа-вареная": {
        name: "Киноа варёная",
        category: "grain",
        aliases: ["киноа варёная"],
        raw: { kcal: 120, protein: 4.4, fat: 1.9, carbs: 21.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чечевица-вареная": {
        name: "Чечевица варёная",
        category: "legume",
        aliases: ["чечевица варёная"],
        raw: { kcal: 116, protein: 9, fat: 0.4, carbs: 20.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "нут-вареный": {
        name: "Нут варёный",
        category: "legume",
        aliases: ["нут варёный"],
        raw: { kcal: 164, protein: 8.9, fat: 2.6, carbs: 27.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-красная-вареная": {
        name: "Фасоль красная варёная",
        category: "legume",
        aliases: ["фасоль красная варёная"],
        raw: { kcal: 127, protein: 8.7, fat: 0.5, carbs: 22.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-белая-вареная": {
        name: "Фасоль белая варёная",
        category: "legume",
        aliases: ["фасоль белая варёная"],
        raw: { kcal: 139, protein: 9.7, fat: 0.4, carbs: 25.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "горох-вареный": {
        name: "Горох варёный",
        category: "legume",
        aliases: ["горох варёный"],
        raw: { kcal: 118, protein: 8.3, fat: 0.4, carbs: 21.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "куриная-грудка-вареная": {
        name: "Куриная грудка варёная",
        category: "meat",
        aliases: ["куриная грудка варёная"],
        raw: { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "куриная-грудка-запеченная": {
        name: "Куриная грудка запечённая без кожи",
        category: "meat",
        aliases: ["куриная грудка запечённая без кожи"],
        raw: { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "индейка-вареная": {
        name: "Индейка варёная",
        category: "meat",
        aliases: ["индейка варёная"],
        raw: { kcal: 135, protein: 29, fat: 1.8, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "говядина-вареная": {
        name: "Говядина варёная постная",
        category: "meat",
        aliases: ["говядина варёная постная"],
        raw: { kcal: 220, protein: 32, fat: 9, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лосось-запеченный": {
        name: "Лосось запечённый",
        category: "fish",
        aliases: ["лосось запечённый"],
        raw: { kcal: 206, protein: 22, fat: 12, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "треска-вареная": {
        name: "Треска варёная",
        category: "fish",
        aliases: ["треска варёная"],
        raw: { kcal: 89, protein: 20, fat: 0.7, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "креветки-вареные": {
        name: "Креветки варёные",
        category: "fish",
        aliases: ["креветки варёные"],
        raw: { kcal: 99, protein: 24, fat: 0.3, carbs: 0.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "яйцо-вареное": {
        name: "Яйцо куриное варёное",
        category: "dairy",
        aliases: ["яйцо куриное варёное"],
        raw: { kcal: 155, protein: 12.6, fat: 10.6, carbs: 1.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "омлет-молоко": {
        name: "Омлет из яиц с молоком",
        category: "prepared",
        aliases: ["омлет из яиц с молоком"],
        raw: { kcal: 154, protein: 10, fat: 11, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сырники-классические": {
        name: "Сырники классические",
        category: "prepared",
        aliases: ["сырники классические"],
        raw: { kcal: 220, protein: 14, fat: 9, carbs: 20 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "блины-молочные": {
        name: "Блины на молоке",
        category: "prepared",
        aliases: ["блины на молоке"],
        raw: { kcal: 227, protein: 6.1, fat: 9.7, carbs: 28 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "оладьи": {
        name: "Оладьи",
        category: "prepared",
        aliases: ["оладьи"],
        raw: { kcal: 230, protein: 6, fat: 10, carbs: 30 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "вафли": {
        name: "Вафли классические",
        category: "prepared",
        aliases: ["вафли классические"],
        raw: { kcal: 291, protein: 7, fat: 14, carbs: 35 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мюсли-без-сахара": {
        name: "Мюсли без сахара",
        category: "grain",
        aliases: ["мюсли без сахара"],
        raw: { kcal: 360, protein: 10, fat: 7, carbs: 64 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "попкорн-без-масла": {
        name: "Попкорн без масла",
        category: "snack",
        aliases: ["попкорн без масла"],
        raw: { kcal: 387, protein: 12.9, fat: 4.5, carbs: 77.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "крекеры-соленые": {
        name: "Крекеры солёные",
        category: "snack",
        aliases: ["крекеры солёные"],
        raw: { kcal: 430, protein: 9, fat: 14, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "печенье-овсяное": {
        name: "Печенье овсяное",
        category: "snack",
        aliases: ["печенье овсяное"],
        raw: { kcal: 450, protein: 6.5, fat: 18, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "печенье-песочное": {
        name: "Печенье песочное",
        category: "snack",
        aliases: ["печенье песочное"],
        raw: { kcal: 480, protein: 6, fat: 22, carbs: 68 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "зефир": {
        name: "Зефир",
        category: "snack",
        aliases: ["зефир"],
        raw: { kcal: 304, protein: 0.8, fat: 0.1, carbs: 78 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мармелад": {
        name: "Мармелад",
        category: "snack",
        aliases: ["мармелад"],
        raw: { kcal: 321, protein: 0.1, fat: 0.1, carbs: 79 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мороженое-ванильное": {
        name: "Мороженое ванильное",
        category: "dairy",
        aliases: ["мороженое ванильное"],
        raw: { kcal: 207, protein: 3.5, fat: 11, carbs: 24 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мороженое-сорбет": {
        name: "Сорбет фруктовый",
        category: "snack",
        aliases: ["сорбет фруктовый"],
        raw: { kcal: 130, protein: 0.5, fat: 0.2, carbs: 32 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "йогурт-питьевой": {
        name: "Йогурт питьевой сладкий",
        category: "dairy",
        aliases: ["йогурт питьевой сладкий"],
        raw: { kcal: 82, protein: 3, fat: 2, carbs: 12 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-соевое": {
        name: "Молоко соевое без сахара",
        category: "dairy",
        aliases: ["молоко соевое без сахара"],
        raw: { kcal: 33, protein: 3.3, fat: 1.8, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-овсяное": {
        name: "Молоко овсяное без сахара",
        category: "dairy",
        aliases: ["молоко овсяное без сахара"],
        raw: { kcal: 43, protein: 1, fat: 1.5, carbs: 6.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-миндальное": {
        name: "Молоко миндальное без сахара",
        category: "dairy",
        aliases: ["молоко миндальное без сахара"],
        raw: { kcal: 15, protein: 0.6, fat: 1.2, carbs: 0.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сок-томатный": {
        name: "Сок томатный",
        category: "drink",
        aliases: ["сок томатный"],
        raw: { kcal: 17, protein: 0.9, fat: 0.2, carbs: 3.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кофе-латте": {
        name: "Кофе латте без сахара",
        category: "drink",
        aliases: ["кофе латте без сахара"],
        raw: { kcal: 43, protein: 2.9, fat: 2, carbs: 3.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "капучино": {
        name: "Капучино без сахара",
        category: "drink",
        aliases: ["капучино без сахара"],
        raw: { kcal: 40, protein: 2.5, fat: 2, carbs: 3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "какао-на-молоке": {
        name: "Какао на молоке без сахара",
        category: "drink",
        aliases: ["какао на молоке без сахара"],
        raw: { kcal: 77, protein: 3.5, fat: 3.5, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лимонад-сахарный": {
        name: "Лимонад сладкий",
        category: "drink",
        aliases: ["лимонад сладкий"],
        raw: { kcal: 40, protein: 0, fat: 0, carbs: 10 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-цезарь": {
        name: "Соус цезарь",
        category: "condiment",
        aliases: ["соус цезарь"],
        raw: { kcal: 542, protein: 2, fat: 57, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-ранч": {
        name: "Соус ранч",
        category: "condiment",
        aliases: ["соус ранч"],
        raw: { kcal: 430, protein: 1.5, fat: 44, carbs: 6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "майонез-легкий": {
        name: "Майонез лёгкий",
        category: "condiment",
        aliases: ["майонез лёгкий"],
        raw: { kcal: 310, protein: 1, fat: 30, carbs: 8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-сальса": {
        name: "Соус сальса",
        category: "condiment",
        aliases: ["соус сальса"],
        raw: { kcal: 36, protein: 1.5, fat: 0.2, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-песто": {
        name: "Соус песто",
        category: "condiment",
        aliases: ["соус песто"],
        raw: { kcal: 430, protein: 5, fat: 43, carbs: 6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-соевый": {
        name: "Соус соевый",
        category: "condiment",
        aliases: ["соус соевый"],
        raw: { kcal: 53, protein: 8.1, fat: 0.6, carbs: 4.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-устричный": {
        name: "Соус устричный",
        category: "condiment",
        aliases: ["соус устричный"],
        raw: { kcal: 51, protein: 1.4, fat: 0.3, carbs: 11 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кокосовое-масло": {
        name: "Масло кокосовое",
        category: "oil",
        aliases: ["масло кокосовое"],
        raw: { kcal: 892, protein: 0, fat: 99, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "масло-кунжутное": {
        name: "Масло кунжутное",
        category: "oil",
        aliases: ["масло кунжутное"],
        raw: { kcal: 884, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "масло-льняное": {
        name: "Масло льняное",
        category: "oil",
        aliases: ["масло льняное"],
        raw: { kcal: 884, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "маргарин": {
        name: "Маргарин",
        category: "oil",
        aliases: ["маргарин"],
        raw: { kcal: 717, protein: 0.2, fat: 80, carbs: 0.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "масло-сливочное-82": {
        name: "Масло сливочное 82%",
        category: "dairy",
        aliases: ["масло сливочное 82%"],
        raw: { kcal: 748, protein: 0.5, fat: 82, carbs: 0.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "масло-ги": {
        name: "Масло гхи",
        category: "dairy",
        aliases: ["масло гхи"],
        raw: { kcal: 900, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "масло-авокадо": {
        name: "Масло авокадо",
        category: "oil",
        aliases: ["масло авокадо"],
        raw: { kcal: 884, protein: 0, fat: 100, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кокосовая-стружка": {
        name: "Кокосовая стружка",
        category: "nuts",
        aliases: ["кокосовая стружка"],
        raw: { kcal: 660, protein: 6.9, fat: 64.5, carbs: 23.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "арахис-соленый": {
        name: "Арахис жареный солёный",
        category: "nuts",
        aliases: ["арахис жареный солёный"],
        raw: { kcal: 587, protein: 24.4, fat: 49.7, carbs: 21.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кешью-жареный": {
        name: "Кешью жареный",
        category: "nuts",
        aliases: ["кешью жареный"],
        raw: { kcal: 574, protein: 15.3, fat: 46.4, carbs: 32.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "миндаль-жареный": {
        name: "Миндаль жареный",
        category: "nuts",
        aliases: ["миндаль жареный"],
        raw: { kcal: 607, protein: 21, fat: 54, carbs: 19 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "свинина-вырезка": {
        name: "Свинина, вырезка",
        category: "meat",
        aliases: ["свинина, вырезка"],
        raw: { kcal: 143, protein: 21, fat: 6, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "свинина-карбонад": {
        name: "Свинина, карбонад",
        category: "meat",
        aliases: ["свинина, карбонад"],
        raw: { kcal: 196, protein: 19.3, fat: 12.7, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "говядина-постная": {
        name: "Говядина постная сырая",
        category: "meat",
        aliases: ["говядина постная сырая"],
        raw: { kcal: 158, protein: 22, fat: 7, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "телятина": {
        name: "Телятина",
        category: "meat",
        aliases: ["телятина"],
        raw: { kcal: 172, protein: 24, fat: 8, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "куриное-бедро-без-кожи": {
        name: "Куриное бедро без кожи",
        category: "meat",
        aliases: ["куриное бедро без кожи"],
        raw: { kcal: 119, protein: 19.7, fat: 4.7, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "куриное-крыло": {
        name: "Куриное крыло с кожей",
        category: "meat",
        aliases: ["куриное крыло с кожей"],
        raw: { kcal: 203, protein: 30.5, fat: 8.1, carbs: 0 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "индейка-бедро": {
        name: "Филе бедра индейки",
        category: "meat",
        aliases: ["филе бедра индейки"],
        raw: { kcal: 144, protein: 20.5, fat: 6.5, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "утиная-грудка": {
        name: "Утиная грудка без кожи",
        category: "meat",
        aliases: ["утиная грудка без кожи"],
        raw: { kcal: 140, protein: 23, fat: 4.5, carbs: 0 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "печень-свиная": {
        name: "Печень свиная",
        category: "meat",
        aliases: ["печень свиная"],
        raw: { kcal: 134, protein: 21.3, fat: 3.8, carbs: 2.5 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "язык-говяжий": {
        name: "Язык говяжий",
        category: "meat",
        aliases: ["язык говяжий"],
        raw: { kcal: 224, protein: 15, fat: 16, carbs: 3.7 },
        cookedWeightRatio: 0.75,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сердце-говяжье": {
        name: "Сердце говяжье",
        category: "meat",
        aliases: ["сердце говяжье"],
        raw: { kcal: 112, protein: 17.7, fat: 3.9, carbs: 0.1 },
        cookedWeightRatio: 0.72,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кальмар-сырой": {
        name: "Кальмар сырой",
        category: "fish",
        aliases: ["кальмар сырой"],
        raw: { kcal: 92, protein: 15.6, fat: 1.4, carbs: 3.1 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "морской-гребешок": {
        name: "Морской гребешок",
        category: "fish",
        aliases: ["морской гребешок"],
        raw: { kcal: 69, protein: 12.1, fat: 0.5, carbs: 3.2 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "анчоусы": {
        name: "Анчоусы консервированные",
        category: "fish",
        aliases: ["анчоусы консервированные"],
        raw: { kcal: 210, protein: 28.9, fat: 9.7, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тунец-консервированный-в-соку": {
        name: "Тунец консервированный в собственном соку",
        category: "fish",
        aliases: ["тунец консервированный в собственном соку"],
        raw: { kcal: 116, protein: 25.5, fat: 0.8, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тунец-консервированный-в-масле": {
        name: "Тунец консервированный в масле",
        category: "fish",
        aliases: ["тунец консервированный в масле"],
        raw: { kcal: 198, protein: 29, fat: 8, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "форель-копченая": {
        name: "Форель копчёная",
        category: "fish",
        aliases: ["форель копчёная"],
        raw: { kcal: 150, protein: 22, fat: 6.5, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лосось-слабосоленый": {
        name: "Лосось слабосолёный",
        category: "fish",
        aliases: ["лосось слабосолёный"],
        raw: { kcal: 208, protein: 22, fat: 13, carbs: 0 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рыбные-палочки": {
        name: "Рыбные палочки в панировке",
        category: "prepared",
        aliases: ["рыбные палочки в панировке"],
        raw: { kcal: 220, protein: 12, fat: 10, carbs: 20 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "креветки-очищенные-сырые": {
        name: "Креветки очищенные сырые",
        category: "fish",
        aliases: ["креветки очищенные сырые"],
        raw: { kcal: 85, protein: 20.1, fat: 0.5, carbs: 0.2 },
        cookedWeightRatio: 0.9,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кефир-1": {
        name: "Кефир 1%",
        category: "dairy",
        aliases: ["кефир 1%"],
        raw: { kcal: 40, protein: 3, fat: 1, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "кефир-2-5": {
        name: "Кефир 2,5%",
        category: "dairy",
        aliases: ["кефир 2,5%"],
        raw: { kcal: 53, protein: 3, fat: 2.5, carbs: 4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ряженка-4": {
        name: "Ряженка 4%",
        category: "dairy",
        aliases: ["ряженка 4%"],
        raw: { kcal: 67, protein: 2.8, fat: 4, carbs: 4.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "простокваша": {
        name: "Простокваша",
        category: "dairy",
        aliases: ["простокваша"],
        raw: { kcal: 58, protein: 2.9, fat: 3.2, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сметана-10": {
        name: "Сметана 10%",
        category: "dairy",
        aliases: ["сметана 10%"],
        raw: { kcal: 119, protein: 3, fat: 10, carbs: 3.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сметана-15": {
        name: "Сметана 15%",
        category: "dairy",
        aliases: ["сметана 15%"],
        raw: { kcal: 158, protein: 2.6, fat: 15, carbs: 3.6 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сметана-20": {
        name: "Сметана 20%",
        category: "dairy",
        aliases: ["сметана 20%"],
        raw: { kcal: 206, protein: 2.5, fat: 20, carbs: 3.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сыр-эдам": {
        name: "Сыр эдам",
        category: "dairy",
        aliases: ["сыр эдам"],
        raw: { kcal: 357, protein: 25, fat: 27.8, carbs: 1.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сыр-камамбер": {
        name: "Сыр камамбер",
        category: "dairy",
        aliases: ["сыр камамбер"],
        raw: { kcal: 300, protein: 19.8, fat: 24.3, carbs: 0.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сыр-сулугуни": {
        name: "Сыр сулугуни",
        category: "dairy",
        aliases: ["сыр сулугуни"],
        raw: { kcal: 286, protein: 19.5, fat: 22, carbs: 0.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-сухое-обезжиренное": {
        name: "Молоко сухое обезжиренное",
        category: "dairy",
        aliases: ["молоко сухое обезжиренное"],
        raw: { kcal: 362, protein: 36.2, fat: 1, carbs: 52 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молоко-сгущенное-с-сахаром": {
        name: "Молоко сгущённое с сахаром",
        category: "dairy",
        aliases: ["молоко сгущённое с сахаром"],
        raw: { kcal: 321, protein: 7.2, fat: 8.5, carbs: 56 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "яйца-перепелиные": {
        name: "Яйца перепелиные",
        category: "dairy",
        aliases: ["яйца перепелиные"],
        raw: { kcal: 158, protein: 13.1, fat: 11.1, carbs: 0.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "брокколи-замороженная": {
        name: "Брокколи замороженная",
        category: "vegetable",
        aliases: ["брокколи замороженная"],
        raw: { kcal: 34, protein: 2.8, fat: 0.4, carbs: 6.6 },
        cookedWeightRatio: 0.95,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тыква-мускатная": {
        name: "Тыква мускатная",
        category: "vegetable",
        aliases: ["тыква мускатная"],
        raw: { kcal: 45, protein: 1, fat: 0.1, carbs: 11.7 },
        cookedWeightRatio: 0.85,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "огурцы-маринованные": {
        name: "Огурцы маринованные",
        category: "vegetable",
        aliases: ["огурцы маринованные"],
        raw: { kcal: 11, protein: 0.3, fat: 0.2, carbs: 2.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "капуста-квашеная": {
        name: "Капуста квашеная",
        category: "vegetable",
        aliases: ["капуста квашеная"],
        raw: { kcal: 19, protein: 0.9, fat: 0.1, carbs: 4.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "морковь-вареная": {
        name: "Морковь варёная",
        category: "vegetable",
        aliases: ["морковь варёная"],
        raw: { kcal: 35, protein: 0.8, fat: 0.2, carbs: 8.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "свекла-вареная": {
        name: "Свёкла варёная",
        category: "vegetable",
        aliases: ["свёкла варёная"],
        raw: { kcal: 44, protein: 1.7, fat: 0.2, carbs: 10 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лук-красный": {
        name: "Лук красный",
        category: "vegetable",
        aliases: ["лук красный"],
        raw: { kcal: 40, protein: 1.1, fat: 0.1, carbs: 9.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "имбирь-свежий": {
        name: "Имбирь свежий",
        category: "vegetable",
        aliases: ["имбирь свежий"],
        raw: { kcal: 80, protein: 1.8, fat: 0.8, carbs: 17.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перец-сладкий-желтый": {
        name: "Перец сладкий жёлтый",
        category: "vegetable",
        aliases: ["перец сладкий жёлтый"],
        raw: { kcal: 27, protein: 1, fat: 0.2, carbs: 6.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "перец-сладкий-оранжевый": {
        name: "Перец сладкий оранжевый",
        category: "vegetable",
        aliases: ["перец сладкий оранжевый"],
        raw: { kcal: 31, protein: 1, fat: 0.2, carbs: 7.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "виноград-зеленый": {
        name: "Виноград зелёный",
        category: "fruit",
        aliases: ["виноград зелёный"],
        raw: { kcal: 69, protein: 0.7, fat: 0.2, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "виноград-красный": {
        name: "Виноград красный",
        category: "fruit",
        aliases: ["виноград красный"],
        raw: { kcal: 69, protein: 0.7, fat: 0.2, carbs: 18.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ананас-свежий": {
        name: "Ананас свежий",
        category: "fruit",
        aliases: ["ананас свежий"],
        raw: { kcal: 50, protein: 0.5, fat: 0.1, carbs: 13.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лайм": {
        name: "Лайм",
        category: "fruit",
        aliases: ["лайм"],
        raw: { kcal: 30, protein: 0.7, fat: 0.2, carbs: 10.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мандарин": {
        name: "Мандарин",
        category: "fruit",
        aliases: ["мандарин"],
        raw: { kcal: 53, protein: 0.8, fat: 0.3, carbs: 13.3 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "банан-зеленый": {
        name: "Банан менее спелый",
        category: "fruit",
        aliases: ["банан менее спелый"],
        raw: { kcal: 89, protein: 1.1, fat: 0.3, carbs: 22.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "малина-замороженная": {
        name: "Малина замороженная без сахара",
        category: "fruit",
        aliases: ["малина замороженная без сахара"],
        raw: { kcal: 52, protein: 1.2, fat: 0.7, carbs: 11.9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "черника-замороженная": {
        name: "Черника замороженная без сахара",
        category: "fruit",
        aliases: ["черника замороженная без сахара"],
        raw: { kcal: 57, protein: 0.7, fat: 0.3, carbs: 14.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "клубника-замороженная": {
        name: "Клубника замороженная без сахара",
        category: "fruit",
        aliases: ["клубника замороженная без сахара"],
        raw: { kcal: 35, protein: 0.7, fat: 0.3, carbs: 7.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "мука-ржаная": {
        name: "Мука ржаная",
        category: "grain",
        aliases: ["мука ржаная"],
        raw: { kcal: 325, protein: 8.9, fat: 1.7, carbs: 61.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "овсянка-быстрого-приготовления": {
        name: "Овсяные хлопья быстрого приготовления",
        category: "grain",
        aliases: ["овсяные хлопья быстрого приготовления"],
        raw: { kcal: 375, protein: 13.2, fat: 6.5, carbs: 67.7 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "рисовые-хлопья": {
        name: "Рисовые хлопья сухие",
        category: "grain",
        aliases: ["рисовые хлопья сухие"],
        raw: { kcal: 360, protein: 7, fat: 1, carbs: 80 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лапша-яичная-сухая": {
        name: "Лапша яичная сухая",
        category: "grain",
        aliases: ["лапша яичная сухая"],
        raw: { kcal: 384, protein: 14.2, fat: 4.4, carbs: 71.3 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "макароны-твердые-сухие": {
        name: "Макароны из твёрдых сортов сухие",
        category: "grain",
        aliases: ["макароны из твёрдых сортов сухие"],
        raw: { kcal: 371, protein: 13, fat: 1.5, carbs: 74.7 },
        cookedWeightRatio: 2.4,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "крупа-пшеничная": {
        name: "Крупа пшеничная сухая",
        category: "grain",
        aliases: ["крупа пшеничная сухая"],
        raw: { kcal: 342, protein: 11.5, fat: 1.3, carbs: 70.6 },
        cookedWeightRatio: 2.7,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ячневая-крупа": {
        name: "Ячневая крупа сухая",
        category: "grain",
        aliases: ["ячневая крупа сухая"],
        raw: { kcal: 324, protein: 10, fat: 1.3, carbs: 66.3 },
        cookedWeightRatio: 2.8,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "киноа-красная-сухая": {
        name: "Киноа красная сухая",
        category: "grain",
        aliases: ["киноа красная сухая"],
        raw: { kcal: 368, protein: 14.1, fat: 6.1, carbs: 64.2 },
        cookedWeightRatio: 2.7,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "гречневые-хлопья": {
        name: "Гречневые хлопья сухие",
        category: "grain",
        aliases: ["гречневые хлопья сухие"],
        raw: { kcal: 330, protein: 12, fat: 3, carbs: 65 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "горох-колотый-сухой": {
        name: "Горох колотый сухой",
        category: "legume",
        aliases: ["горох колотый сухой"],
        raw: { kcal: 341, protein: 24.6, fat: 1.2, carbs: 60.4 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "нутовая-мука": {
        name: "Нутовая мука",
        category: "legume",
        aliases: ["нутовая мука"],
        raw: { kcal: 387, protein: 22.4, fat: 6.7, carbs: 57.8 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "фасоль-пинто-сухая": {
        name: "Фасоль пинто сухая",
        category: "legume",
        aliases: ["фасоль пинто сухая"],
        raw: { kcal: 347, protein: 21.4, fat: 1.2, carbs: 62.6 },
        cookedWeightRatio: 2.5,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "арахисовая-мука": {
        name: "Мука арахисовая обезжиренная",
        category: "nuts",
        aliases: ["мука арахисовая обезжиренная"],
        raw: { kcal: 327, protein: 52, fat: 12, carbs: 18 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "бразильский-орех": {
        name: "Бразильский орех",
        category: "nuts",
        aliases: ["бразильский орех"],
        raw: { kcal: 659, protein: 14.3, fat: 67.1, carbs: 11.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "семена-чиа": {
        name: "Семена чиа",
        category: "nuts",
        aliases: ["семена чиа"],
        raw: { kcal: 486, protein: 16.5, fat: 30.7, carbs: 42.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тыквенные-семечки": {
        name: "Тыквенные семечки очищенные",
        category: "nuts",
        aliases: ["тыквенные семечки очищенные"],
        raw: { kcal: 559, protein: 30.2, fat: 49.1, carbs: 10.7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сухари-пшеничные": {
        name: "Сухари панировочные пшеничные",
        category: "bakery",
        aliases: ["сухари панировочные пшеничные"],
        raw: { kcal: 395, protein: 13.4, fat: 5.3, carbs: 71 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "багет": {
        name: "Багет пшеничный",
        category: "bakery",
        aliases: ["багет пшеничный"],
        raw: { kcal: 272, protein: 9, fat: 1.5, carbs: 56 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "булочка-сдобная": {
        name: "Булочка сдобная",
        category: "bakery",
        aliases: ["булочка сдобная"],
        raw: { kcal: 330, protein: 8, fat: 9, carbs: 55 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "торт-медовик": {
        name: "Торт медовик",
        category: "snack",
        aliases: ["торт медовик"],
        raw: { kcal: 390, protein: 5, fat: 18, carbs: 52 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "шоколад-белый": {
        name: "Шоколад белый",
        category: "snack",
        aliases: ["шоколад белый"],
        raw: { kcal: 539, protein: 5.9, fat: 32.1, carbs: 59.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "халва-арахисовая": {
        name: "Халва арахисовая",
        category: "snack",
        aliases: ["халва арахисовая"],
        raw: { kcal: 520, protein: 12, fat: 30, carbs: 52 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пастила": {
        name: "Пастила фруктовая",
        category: "snack",
        aliases: ["пастила фруктовая"],
        raw: { kcal: 310, protein: 0.5, fat: 0.1, carbs: 80 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "сыр-крем": {
        name: "Сыр сливочный крем",
        category: "dairy",
        aliases: ["сыр сливочный крем"],
        raw: { kcal: 342, protein: 5.9, fat: 34, carbs: 4.1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "майонез-классический": {
        name: "Майонез классический",
        category: "condiment",
        aliases: ["майонез классический"],
        raw: { kcal: 680, protein: 1, fat: 75, carbs: 2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "аджика": {
        name: "Аджика",
        category: "condiment",
        aliases: ["аджика"],
        raw: { kcal: 59, protein: 1, fat: 3, carbs: 7 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-сладкий-чили": {
        name: "Соус сладкий чили",
        category: "condiment",
        aliases: ["соус сладкий чили"],
        raw: { kcal: 220, protein: 0.5, fat: 0.2, carbs: 53 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-хойсин": {
        name: "Соус хойсин",
        category: "condiment",
        aliases: ["соус хойсин"],
        raw: { kcal: 220, protein: 3.3, fat: 3.4, carbs: 44 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "соус-гранатовый": {
        name: "Соус гранатовый",
        category: "condiment",
        aliases: ["соус гранатовый"],
        raw: { kcal: 250, protein: 0.5, fat: 0.2, carbs: 62 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "бульон-куриный": {
        name: "Куриный бульон",
        category: "prepared",
        aliases: ["куриный бульон"],
        raw: { kcal: 15, protein: 1.6, fat: 0.5, carbs: 0.4 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "бульон-говяжий": {
        name: "Говяжий бульон",
        category: "prepared",
        aliases: ["говяжий бульон"],
        raw: { kcal: 13, protein: 1.8, fat: 0.4, carbs: 0.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "суп-тыквенный": {
        name: "Суп-пюре из тыквы",
        category: "prepared",
        aliases: ["суп-пюре из тыквы"],
        raw: { kcal: 48, protein: 1.2, fat: 2.1, carbs: 6.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "суп-чечевичный": {
        name: "Чечевичный суп",
        category: "prepared",
        aliases: ["чечевичный суп"],
        raw: { kcal: 72, protein: 4.5, fat: 2, carbs: 9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "салат-греческий": {
        name: "Греческий салат",
        category: "prepared",
        aliases: ["греческий салат"],
        raw: { kcal: 100, protein: 3.5, fat: 7.5, carbs: 5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "салат-винегрет": {
        name: "Винегрет",
        category: "prepared",
        aliases: ["винегрет"],
        raw: { kcal: 76, protein: 1.5, fat: 4, carbs: 9 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "плов-куриный": {
        name: "Плов с курицей",
        category: "prepared",
        aliases: ["плов с курицей"],
        raw: { kcal: 170, protein: 9, fat: 6, carbs: 21 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ризотто-грибное": {
        name: "Ризотто с грибами",
        category: "prepared",
        aliases: ["ризотто с грибами"],
        raw: { kcal: 140, protein: 3.5, fat: 4, carbs: 22 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "лазанья-мясная": {
        name: "Лазанья мясная",
        category: "prepared",
        aliases: ["лазанья мясная"],
        raw: { kcal: 135, protein: 8.5, fat: 7, carbs: 10 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "пицца-маргарита": {
        name: "Пицца маргарита",
        category: "prepared",
        aliases: ["пицца маргарита"],
        raw: { kcal: 266, protein: 11, fat: 10, carbs: 33 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "суши-лосось": {
        name: "Суши с лососем",
        category: "prepared",
        aliases: ["суши с лососем"],
        raw: { kcal: 150, protein: 7, fat: 3, carbs: 25 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "ролл-калифорния": {
        name: "Ролл Калифорния",
        category: "prepared",
        aliases: ["ролл калифорния"],
        raw: { kcal: 180, protein: 6, fat: 7, carbs: 25 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "шашлык-свиной": {
        name: "Шашлык из свинины готовый",
        category: "prepared",
        aliases: ["шашлык из свинины готовый"],
        raw: { kcal: 290, protein: 25, fat: 21, carbs: 1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "шашлык-куриный": {
        name: "Шашлык из курицы готовый",
        category: "prepared",
        aliases: ["шашлык из курицы готовый"],
        raw: { kcal: 190, protein: 27, fat: 8, carbs: 1 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "печеный-перец": {
        name: "Перец запечённый",
        category: "prepared",
        aliases: ["перец запечённый"],
        raw: { kcal: 31, protein: 1, fat: 0.3, carbs: 6.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "тосты-цельнозерновые": {
        name: "Тосты цельнозерновые",
        category: "bakery",
        aliases: ["тосты цельнозерновые"],
        raw: { kcal: 260, protein: 10, fat: 4, carbs: 45 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "молочный-коктейль": {
        name: "Молочный коктейль ванильный",
        category: "drink",
        aliases: ["молочный коктейль ванильный"],
        raw: { kcal: 112, protein: 3.5, fat: 3.5, carbs: 16 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "чай-с-молоком": {
        name: "Чай с молоком без сахара",
        category: "drink",
        aliases: ["чай с молоком без сахара"],
        raw: { kcal: 15, protein: 0.8, fat: 0.8, carbs: 1.2 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "энергетик-сахарный": {
        name: "Энергетический напиток с сахаром",
        category: "drink",
        aliases: ["энергетический напиток с сахаром"],
        raw: { kcal: 45, protein: 0, fat: 0, carbs: 11 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    },

    "компот-сахарный": {
        name: "Компот с сахаром",
        category: "drink",
        aliases: ["компот с сахаром"],
        raw: { kcal: 54, protein: 0.1, fat: 0, carbs: 13.5 },
        cookedWeightRatio: 1,
        nutritionSource: { database: "Reference estimate", note: "Усреднённые справочные значения на 100 г; для точного учёта сверяйся с упаковкой или проверенной базой." }
    }
};
