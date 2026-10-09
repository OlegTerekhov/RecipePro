(function () {
    "use strict";

    const MODAL_ID = "aiRecipeGeneratorModal";

    const PRODUCT_ORDER = [
        "курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки",
        "яйца","творог","сыр","моцарелла","йогурт","сметана","молоко",
        "картофель","лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок",
        "рис","гречка","овсянка","паста","хлеб","чечевица","фасоль","банан","яблоко","апельсин",
        "масло","сливочное-масло","мед","сахар"
    ];

    const ALIASES = {
        "курица":["курица","курицу","куриной","куриное","грудка","грудку"],
        "куриное-бедро":["бедро","бедрышко"], "индейка":["индейка","индейку","индейки"],
        "говядина":["говядина","говядину"], "свинина":["свинина","свинину"],
        "лосось":["лосось","лосося"], "тунец":["тунец","тунца"], "креветки":["креветки","креветок"],
        "яйца":["яйца","яйцо","яиц"], "творог":["творог","творога"], "сыр":["сыр","сыра"],
        "моцарелла":["моцарелла"], "йогурт":["йогурт","йогурта"], "сметана":["сметана","сметаны"], "молоко":["молоко","молока"],
        "картофель":["картофель","картошка","картошку","картофеля"], "лук":["лук","лука"],
        "морковь":["морковь","морковку"], "помидоры":["помидоры","помидор","томат","томаты"],
        "огурец":["огурец","огурцы"], "перец":["перец"], "брокколи":["брокколи"], "капуста":["капуста","капусту"],
        "кабачок":["кабачок","кабачки"], "чеснок":["чеснок","чеснока"],
        "рис":["рис","риса"], "гречка":["гречка","гречневую","гречневой"],
        "овсянка":["овсянка","овсянку","овсяные хлопья"], "паста":["паста","макароны","макарон","спагетти"],
        "хлеб":["хлеб","хлеба"], "чечевица":["чечевица","чечевицу"], "фасоль":["фасоль","фасоли"],
        "банан":["банан","бананы","банана"], "яблоко":["яблоко","яблоки","яблока"], "апельсин":["апельсин","апельсины"],
        "масло":["масло","растительное","оливковое"], "сливочное-масло":["сливочное масло"],
        "мед":["мед","мёд"], "сахар":["сахар"]
    };

    const NAMES = {
        "курица":"куриная грудка","куриное-бедро":"куриное бедро","индейка":"индейка","говядина":"говядина","свинина":"свинина",
        "лосось":"лосось","тунец":"тунец","креветки":"креветки","яйца":"яйца","творог":"творог","сыр":"сыр","моцарелла":"моцарелла",
        "йогурт":"йогурт","сметана":"сметана","молоко":"молоко","картофель":"картофель","лук":"лук","морковь":"морковь",
        "помидоры":"помидоры","огурец":"огурец","перец":"болгарский перец","брокколи":"брокколи","капуста":"капуста",
        "кабачок":"кабачок","чеснок":"чеснок","рис":"рис","гречка":"гречка","овсянка":"овсянка","паста":"паста",
        "хлеб":"хлеб","чечевица":"чечевица","фасоль":"фасоль","банан":"банан","яблоко":"яблоко","апельсин":"апельсин",
        "масло":"растительное масло","сливочное-масло":"сливочное масло","мед":"мёд","сахар":"сахар"
    };

    const PROTEINS = ["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки","яйца","творог","сыр"];
    const CARBS = ["картофель","рис","гречка","паста","хлеб","овсянка","чечевица","фасоль"];
    const VEGETABLES = ["лук","морковь","помидоры","огурец","перец","брокколи","капуста","кабачок","чеснок"];
    const FATS = ["масло","сливочное-масло","сыр","моцарелла","сметана","мед","сахар"];

    const $ = (selector, root=document) => root.querySelector(selector);
    const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));

    function esc(value) {
        return String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
    }

    function injectStyles() {
        if ($("#aiGeneratorStyles")) return;
        const style = document.createElement("style");
        style.id = "aiGeneratorStyles";
        style.textContent = `
.ai-generator-trigger{width:100%;margin-top:18px;display:flex;align-items:center;gap:14px;padding:15px 17px;border:1px solid rgba(32,55,47,.14);border-radius:18px;background:rgba(255,255,255,.72);color:#20372F;text-align:left;cursor:pointer;box-shadow:0 8px 25px rgba(32,55,47,.06);transition:.22s ease}
.ai-generator-trigger:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(32,55,47,.1);border-color:rgba(32,55,47,.25)}
.ai-generator-trigger-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#20372F;color:#fff;font-size:18px;flex:0 0 auto}
.ai-generator-trigger strong,.ai-generator-trigger small{display:block}.ai-generator-trigger strong{font:600 14px Inter,sans-serif}.ai-generator-trigger small{margin-top:3px;color:#6d756f;font:400 12px Inter,sans-serif}.ai-generator-trigger-arrow{margin-left:auto;font-size:18px}
.ai-generator-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(18,30,26,.48);backdrop-filter:blur(8px)}.ai-generator-overlay.is-open{display:flex}
.ai-generator-modal{width:min(720px,100%);max-height:min(760px,92vh);overflow:auto;border-radius:28px;background:#fffdf9;box-shadow:0 30px 90px rgba(0,0,0,.2);position:relative}
.ai-generator-head{padding:34px 36px 22px;border-bottom:1px solid rgba(32,55,47,.1)}.ai-generator-kicker{font:700 11px Inter,sans-serif;letter-spacing:.16em;color:#6e8379}
.ai-generator-head h2{margin:8px 0 7px;font:600 30px "Playfair Display",serif;color:#20372F}.ai-generator-head p{margin:0;color:#69736e;font:14px/1.6 Inter,sans-serif}
.ai-generator-close{position:absolute;right:20px;top:18px;border:0;background:transparent;font-size:28px;color:#65706a;cursor:pointer}.ai-generator-body{padding:28px 36px 34px}
.ai-generator-label{display:block;margin-bottom:9px;font:600 12px Inter,sans-serif;color:#20372F}.ai-generator-input{width:100%;min-height:115px;resize:vertical;box-sizing:border-box;border:1px solid rgba(32,55,47,.15);border-radius:18px;background:#fff;padding:16px 17px;font:15px/1.55 Inter,sans-serif;color:#20372F;outline:none}
.ai-generator-input:focus{border-color:#20372F;box-shadow:0 0 0 4px rgba(32,55,47,.07)}.ai-generator-examples{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 24px}
.ai-generator-example{border:1px solid rgba(32,55,47,.12);background:#fff;border-radius:999px;padding:8px 12px;color:#53625b;cursor:pointer;font:12px Inter,sans-serif}.ai-generator-example:hover{border-color:rgba(32,55,47,.3);color:#20372F}
.ai-generator-actions{display:flex;justify-content:flex-end;gap:10px}.ai-generator-result{margin-top:24px;padding:22px;border-radius:22px;background:#f5f1e9;border:1px solid rgba(32,55,47,.08)}
.ai-generator-result-top{display:flex;align-items:flex-start;gap:16px}.ai-generator-result-emoji{width:64px;height:64px;display:grid;place-items:center;border-radius:18px;background:#fff;font-size:34px;flex:0 0 auto}
.ai-generator-result h3{margin:0 0 5px;font:600 23px "Playfair Display",serif;color:#20372F}.ai-generator-result p{margin:0;color:#68736d;font:13px/1.5 Inter,sans-serif}
.ai-generator-tags{display:flex;flex-wrap:wrap;gap:7px;margin:18px 0}.ai-generator-tag{padding:6px 9px;border-radius:999px;background:#fff;color:#56635d;font:11px Inter,sans-serif}
.ai-generator-ingredients{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.ai-generator-ingredient{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:12px;background:#fff;font:12px Inter,sans-serif;color:#33453d}.ai-generator-ingredient span:last-child{color:#728078}
.ai-generator-steps{margin:12px 0 0;padding-left:20px;color:#53615b;font:13px/1.65 Inter,sans-serif}.ai-generator-note{margin-top:18px;color:#7a847f;font:11px/1.5 Inter,sans-serif}
.ai-generator-constraints{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0 2px}.ai-generator-constraint{padding:6px 9px;border-radius:999px;background:#e9f2ed;color:#315846;font:600 11px Inter,sans-serif}
.ai-generator-warning{margin-top:12px;padding:11px 13px;border-radius:12px;background:#fff5df;color:#795d22;font:600 12px/1.5 Inter,sans-serif}
.ai-generator-save-row{margin-top:18px;display:flex;justify-content:flex-end}.ai-generator-saved{margin-top:12px;padding:11px 13px;border-radius:12px;background:#e9f2ed;color:#315846;font:600 12px Inter,sans-serif}
.ai-generator-alternatives{margin-top:20px;padding-top:18px;border-top:1px solid rgba(32,55,47,.1)}.ai-generator-alternatives-title{font:600 12px Inter,sans-serif;color:#20372F;margin-bottom:10px}.ai-generator-alternative{display:flex;align-items:center;gap:12px;padding:12px;margin-top:8px;border-radius:14px;background:#fff;border:1px solid rgba(32,55,47,.08)}.ai-generator-alternative.is-best{border-color:rgba(32,55,47,.2);box-shadow:0 6px 18px rgba(32,55,47,.06)}.ai-generator-alternative-emoji{font-size:25px;width:38px;text-align:center}.ai-generator-alternative-main{min-width:0;flex:1}.ai-generator-alternative-main strong{display:block;font:600 13px Inter,sans-serif;color:#20372F}.ai-generator-alternative-main small{display:block;margin-top:4px;color:#718078;font:11px Inter,sans-serif}.ai-generator-alternative-score{font:700 11px Inter,sans-serif;color:#315846}.ai-generator-changes{margin-top:16px;padding:14px;border-radius:15px;background:#fff;border:1px solid rgba(32,55,47,.08)}.ai-generator-changes strong{display:block;margin-bottom:6px;font:600 12px Inter,sans-serif;color:#20372F}.ai-generator-changes ul{margin:0;padding-left:18px;color:#56635d;font:12px/1.6 Inter,sans-serif}
@media(max-width:640px){.ai-generator-overlay{padding:12px}.ai-generator-head,.ai-generator-body{padding-left:20px;padding-right:20px}.ai-generator-head h2{font-size:26px}.ai-generator-ingredients{grid-template-columns:1fr}.ai-generator-actions{flex-direction:column}.ai-generator-actions button{width:100%}}
`;
        document.head.appendChild(style);
    }

    function ensureModal() {
        if ($("#"+MODAL_ID)) return;
        const overlay=document.createElement("div");
        overlay.id=MODAL_ID;
        overlay.className="ai-generator-overlay";
        overlay.innerHTML=`
<div class="ai-generator-modal" role="dialog" aria-modal="true" aria-labelledby="aiGeneratorTitle">
<button class="ai-generator-close" id="aiGeneratorClose" type="button" aria-label="Закрыть">×</button>
<div class="ai-generator-head">
<div class="ai-generator-kicker">RECIPEPRO AI / GENERATOR</div>
<h2 id="aiGeneratorTitle">Придумаем блюдо из твоих продуктов</h2>
<p>Опиши продукты и пожелания обычными словами. RecipePro распознает продукты, калории, белок, время и порции.</p>
</div>
<div class="ai-generator-body">
<label class="ai-generator-label" for="aiGeneratorInput">Твой запрос</label>
<textarea class="ai-generator-input" id="aiGeneratorInput" placeholder="Например: у меня курица и картошка, хочу белковое блюдо до 600 ккал и максимум 30 минут"></textarea>
<div class="ai-generator-examples">
<button class="ai-generator-example" type="button" data-example="яйца, творог и банан">яйца + творог + банан</button>
<button class="ai-generator-example" type="button" data-example="курица, картошка и лук">курица + картошка + лук</button>
<button class="ai-generator-example" type="button" data-example="у меня курица и картошка, хочу белковое до 600 ккал, максимум 30 минут">курица + картошка + белковое + 600 ккал</button>
</div>
<div class="ai-generator-actions">
<button class="secondary-button" id="aiGeneratorCancel" type="button">Отмена</button>
<button class="primary-button large" id="aiGeneratorGenerate" type="button">✦ Сгенерировать</button>
</div>
<div id="aiGeneratorResult"></div>
</div>
</div>`;
        document.body.appendChild(overlay);
    }

    async function detectProducts(input) {
        const text=input.toLowerCase().replace(/ё/g,"е");
        const local=PRODUCT_ORDER.filter(id => (ALIASES[id]||[id]).some(alias => text.includes(alias.replace(/ё/g,"е"))));
        if(window.recipeProProductResolver){
            const resolved=await window.recipeProProductResolver.resolve(input);
            return [...new Set([...local,...resolved])].slice(0,10);
        }
        return local.slice(0,8);
    }

    function parseRequest(input) {
        const text=input.toLowerCase().replace(/ё/g,"е");
        const findNumber=patterns=>{for(const pattern of patterns){const match=text.match(pattern);if(match)return Number(match[1]);}return null;};
        let type=null;
        if (/суп|супа|супе/.test(text)) type="stew";
        else if (/салат/.test(text)) type="salad";
        else if (/паста|макарон|спагетти/.test(text)) type="pasta";
        else if (/омлет|яичниц/.test(text)) type="omelet";
        else if (/каша|овсян/.test(text)) type="porridge";
        else if (/боул/.test(text)) type="bowl";
        else if (/рагу/.test(text)) type="stew";
        else if (/запекан|запечь|запечен/.test(text)) type="roast";

        return {
            targetServings:findNumber([/на\s+(\d+)\s+порц/i,/на\s+(\d+)\s+человек/i,/для\s+(\d+)\s+человек/i]),
            maxCalories:findNumber([/(?:до|максимум|не\s+больше|не\s+более)\s+(\d+)\s*(?:ккал|калори)/i]),
            minCalories:findNumber([/(?:от|минимум)\s+(\d+)\s*(?:ккал|калори)/i]),
            minProtein:findNumber([/(?:минимум|от)\s+(\d+)\s*г?\s*(?:белка|протеина)/i]),
            maxProtein:findNumber([/(?:до|максимум|не\s+больше|не\s+более)\s+(\d+)\s*г?\s*(?:белка|протеина)/i]),
            maxTime:findNumber([/(?:до|максимум|не\s+больше|не\s+дольше|менее)\s+(\d+)\s*(?:мин|минут)/i]),
            minTime:findNumber([/(?:от|минимум)\s+(\d+)\s*(?:мин|минут)/i]),
            highProtein:/белков\w*|протеин\w*|много\s+белка|высок\w*\s+содержани\w*\s+белка|богат\w*\s+белк/i.test(text),
            lessCalories:/менее\s+калори|низк\w*\s+калори/i.test(text),
            faster:/быстр\w*|за\s+полчаса|быстро\s+приготов/i.test(text),
            type
        };
    }

    function getRole(id) {
        const p=window.products?.[id];
        if(PROTEINS.includes(id)||p?.role==="protein") return "protein";
        if(CARBS.includes(id)||p?.role==="carb") return "carb";
        if(VEGETABLES.includes(id)||p?.role==="vegetable") return "vegetable";
        if(p?.role==="fruit") return "fruit";
        if(FATS.includes(id)||p?.role==="fat") return "fat";
        return "other";
    }

    function getProductName(id) {
        return NAMES[id] || window.products?.[id]?.name || id;
    }

    function amountFor(id) {
        const p=window.products?.[id];
        if(p?.pieceWeight && ["яйца","банан","яблоко","апельсин"].includes(id)) return {amount:p.pieceWeight,unit:"г"};
        if(["масло","сливочное-масло"].includes(id)) return {amount:10,unit:"г"};
        if(VEGETABLES.includes(id)) return {amount:80,unit:"г"};
        if(CARBS.includes(id)) return {amount:70,unit:"г"};
        if(["творог","йогурт","сметана","молоко","сыр","моцарелла"].includes(id)) return {amount:120,unit:"г"};
        return {amount:180,unit:"г"};
    }

    function nutrition(ingredients) {
        const engine = window.recipeProNutritionEngine;

        if (engine?.calculateRecipe) {
            const result = engine.calculateRecipe({
                ingredients: Array.isArray(ingredients) ? ingredients : [],
                servings: 1
            }, { servings: 1 });

            return {
                calories: result.calories,
                protein: result.protein,
                fat: result.fat,
                carbs: result.carbs,
                unknownCount: result.unknownCount
            };
        }

        return (Array.isArray(ingredients) ? ingredients : []).reduce((sum, item) => {
            const id = item.product || item.productId;
            const product = typeof id === "object" ? id : window.products?.[id];
            if (!product?.raw || (item.pantry && ["salt", "pepper", "water", "соль", "перец", "вода"].includes(String(id).toLowerCase()))) return sum;

            const amount = Math.max(0, Number(item.amount) || 0);
            const factor = amount / 100;
            sum.calories += Number(product.raw.kcal || 0) * factor;
            sum.protein += Number(product.raw.protein || 0) * factor;
            sum.fat += Number(product.raw.fat || 0) * factor;
            sum.carbs += Number(product.raw.carbs || 0) * factor;
            return sum;
        }, { calories: 0, protein: 0, fat: 0, carbs: 0, unknownCount: 0 });
    }

    function buildRecipe(ids, intent = {}) {
        if (window.recipeProRecipeEngine) {
            return window.recipeProRecipeEngine.build(ids, intent);
        }
        return {
            title: "Блюдо RecipePro",
            description: "Не удалось запустить Recipe Engine.",
            emoji: "🍽️",
            time: 30,
            servings: 1,
            ingredients: ids.map(id => ({ product:id, amount:100, unit:"г", required:true })),
            steps: ["Подготовь продукты.","Приготовь до готовности.","Подавай сразу."],
            aiChanges: [],
            aiWarnings: ["Recipe Engine недоступен."]
        };
    }
    function finalize(recipe) {
        const n = nutrition(recipe.ingredients);
        const servings = Math.max(1, Number(recipe.servings) || 2);

        recipe.nutrition = {
            calories: Math.round(n.calories / servings),
            protein: Math.round(n.protein / servings * 10) / 10,
            fat: Math.round(n.fat / servings * 10) / 10,
            carbs: Math.round(n.carbs / servings * 10) / 10
        };

        recipe.nutritionUnknownCount = Math.max(0, Number(n.unknownCount) || 0);
        return recipe;
    }

    function setAmount(recipe,id,amount,changes){
        const item=recipe.ingredients.find(x=>x.product===id);
        if(!item)return;
        const next=Math.max(20,Math.round(amount/10)*10);
        if(next!==item.amount){item.amount=next;changes.push(getProductName(id)+": "+item.amount+" г");}
    }

    function adaptRecipe(recipe,constraints){
        const r=JSON.parse(JSON.stringify(recipe));
        const changes=[],warnings=[];
        const sourceServings=Math.max(1,Number(r.servings)||1);
        const targetServings=Math.max(1,Number(constraints.targetServings)||sourceServings);
        const servingMultiplier=targetServings/sourceServings;

        if(servingMultiplier!==1){
            r.ingredients=(r.ingredients||[]).map(item=>({
                ...item,
                amount:Math.round((Math.max(0,Number(item.amount)||0)*servingMultiplier)*10)/10,
                ...(item.oilAmount!==undefined?{oilAmount:Math.round((Math.max(0,Number(item.oilAmount)||0)*servingMultiplier)*10)/10}:{})
            }));
            changes.push("количество ингредиентов пересчитано на "+targetServings+" порц.");
        }
        r.servings=targetServings;

        const getItemId=item=>item.product||item.productId;
        const main=r.ingredients.find(item=>getRole(getItemId(item))==="protein");
        const carb=r.ingredients.find(item=>getRole(getItemId(item))==="carb");
        const fats=r.ingredients.filter(item=>getRole(getItemId(item))==="fat");
        const calorieAdditions=r.ingredients.filter(item=>["fat","dairy"].includes(getRole(getItemId(item))));
        const minAmount=20;

        function recalc(){ finalize(r); }

        function changeAmount(item,factor,label){
            if(!item)return false;
            const before=Number(item.amount)||0;
            const next=Math.max(minAmount,Math.round(before*factor/10)*10);
            if(next!==before){
                item.amount=next;
                changes.push(label||("скорректирован "+getProductName(getItemId(item))));
                return true;
            }
            return false;
        }

        if(constraints.highProtein||constraints.minProtein){
            changeAmount(main,1.25,"увеличена белковая основа");
            calorieAdditions.forEach(item=>changeAmount(item,.75,"уменьшены калорийные добавки"));
            recalc();
        }

        if(constraints.lessCalories||constraints.maxCalories){
            calorieAdditions.forEach(item=>changeAmount(item,.65,"снижены калорийные добавки"));
            if(carb)changeAmount(carb,.75,"скорректирован объём гарнира");
            recalc();
        }

        if(constraints.maxCalories){
            for(let pass=0;pass<5 && r.nutrition.calories>constraints.maxCalories;pass++){
                const ratio=constraints.maxCalories/r.nutrition.calories;
                let changed=false;
                const targets=[...calorieAdditions,...(carb?[carb]:[])];
                for(const item of targets){
                    const factor=Math.max(.35,Math.min(.85,ratio));
                    changed=changeAmount(item,factor,"рецепт дополнительно адаптирован под лимит калорий")||changed;
                }
                recalc();
                if(!changed)break;
            }
        }

        if(constraints.highProtein||constraints.minProtein){
            for(let pass=0;pass<3 && constraints.minProtein && r.nutrition.protein<constraints.minProtein;pass++){
                if(!main)break;
                if(!changeAmount(main,1.2,"белковая основа увеличена для достижения цели"))break;
                recalc();
            }
        }

        if(constraints.faster){
            r.time=Math.max(10,Math.round(r.time*.7));
            changes.push("выбран более быстрый способ приготовления");
        }
        if(constraints.maxTime&&r.time>constraints.maxTime){
            r.time=constraints.maxTime;
            changes.push("время адаптировано под заданный лимит");
        }

        if(constraints.minCalories&&r.nutrition.calories<constraints.minCalories){
            const target=constraints.minCalories;
            const ratio=Math.min(2,target/Math.max(1,r.nutrition.calories));
            const targets=[main,carb,...fats].filter(Boolean);
            targets.slice(0,2).forEach(item=>changeAmount(item,ratio,"увеличены ингредиенты для достижения минимума калорий"));
            recalc();
        }

        if(constraints.minProtein&&r.nutrition.protein<constraints.minProtein){
            warnings.push("Цель по белку не достигнута: "+r.nutrition.protein+" г при цели "+constraints.minProtein+" г на порцию.");
        }
        if(constraints.maxProtein&&r.nutrition.protein>constraints.maxProtein){
            warnings.push("Белка получилось больше максимума: "+r.nutrition.protein+" г при лимите "+constraints.maxProtein+" г.");
        }
        if(constraints.maxCalories&&r.nutrition.calories>constraints.maxCalories){
            warnings.push("Цель по калориям не достигнута: "+r.nutrition.calories+" ккал при лимите "+constraints.maxCalories+" ккал.");
        }

        if(constraints.highProtein)r.description="Адаптировано под высокий белок: RecipePro увеличил белковую основу и сократил лишние калорийные добавки.";
        if(constraints.maxCalories)r.description+=" Калорийность автоматически скорректирована под заданный лимит насколько позволяют ингредиенты.";

        r.aiChanges=changes;
        r.aiWarnings=warnings;
        return r;
    }

    function constraintHtml(c){
        const out=[];
        if(c.targetServings)out.push("✓ "+c.targetServings+" порции");
        if(c.maxCalories)out.push("≤ "+c.maxCalories+" ккал");
        if(c.minCalories)out.push("≥ "+c.minCalories+" ккал");
        if(c.highProtein)out.push("✓ высокобелковое");
        if(c.minProtein)out.push("≥ "+c.minProtein+" г белка");
        if(c.maxProtein)out.push("≤ "+c.maxProtein+" г белка");
        if(c.maxTime)out.push("≤ "+c.maxTime+" мин");
        if(c.minTime)out.push("≥ "+c.minTime+" мин");
        if(c.faster)out.push("✓ быстрее");
        return out;
    }

    function renderResult(recipe,detected,constraints,alternatives=[]){
        const ingredientHtml=recipe.ingredients.map(item=>`<div class="ai-generator-ingredient"><span>${esc(getProductName(item.product||item.productId))}</span><span>${item.amount} ${esc(item.unit)}</span></div>`).join("");
        const stepHtml=recipe.steps.map(step=>`<li>${esc(step)}</li>`).join("");
        const chips=constraintHtml(constraints).map(x=>`<span class="ai-generator-constraint">${esc(x)}</span>`).join("");
        const warnings=(recipe.aiWarnings||[]).map(x=>`<div class="ai-generator-warning">⚠️ ${esc(x)}</div>`).join("");
        const nutritionWarning=recipe.nutritionUnknownCount>0?`<div class="ai-generator-warning">⚠️ КБЖУ рассчитано не полностью: для ${recipe.nutritionUnknownCount} ингредиент(а/ов) нет данных о пищевой ценности. Значения не включают эти продукты.</div>`:"";
        const changes=recipe.aiChanges?.length?`<div class="ai-generator-changes"><strong>RecipePro AI изменил рецепт</strong><ul>${recipe.aiChanges.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:"";
        $("#aiGeneratorResult").innerHTML=`
<div class="ai-generator-result">
<div class="ai-generator-result-top"><div class="ai-generator-result-emoji">${recipe.emoji}</div><div><h3>${esc(recipe.title)}</h3><p>${esc(recipe.description)}</p></div></div>
<div class="ai-generator-tags"><span class="ai-generator-tag">${recipe.time} мин</span><span class="ai-generator-tag">${recipe.nutrition.calories} ккал / порция</span><span class="ai-generator-tag">${recipe.nutrition.protein} г белка</span><span class="ai-generator-tag">${recipe.servings} порции</span></div>
${chips?`<div class="ai-generator-constraints">${chips}</div>`:""}
${warnings}
${nutritionWarning}
<strong class="ai-generator-label">Ингредиенты</strong><div class="ai-generator-ingredients">${ingredientHtml}</div>
<strong class="ai-generator-label" style="margin-top:18px">Как приготовить</strong><ol class="ai-generator-steps">${stepHtml}</ol>
${changes}
${alternatives.length?`<div class="ai-generator-alternatives"><div class="ai-generator-alternatives-title">Другие варианты</div>${alternatives.map((item,index)=>`<div class="ai-generator-alternative ${index===0?"is-best":""}"><div class="ai-generator-alternative-emoji">${item.recipe.emoji}</div><div class="ai-generator-alternative-main"><strong>${esc(item.recipe.title)}</strong><small>${item.recipe.time} мин · ${item.recipe.nutrition.calories} ккал · ${item.recipe.nutrition.protein} г белка · ${esc(item.reason||"подходит по продуктам")}</small></div><div class="ai-generator-alternative-score">${Math.round(item.score)}</div></div>`).join("")}</div>`:""}
<div class="ai-generator-note">Распознано: ${detected.map(id=>esc(getProductName(id)||id)).join(", ")}. Локальная база RecipePro дополнена внешней базой продуктов при необходимости; КБЖУ является ориентировочной оценкой.</div>
<div class="ai-generator-save-row"><button class="primary-button large" id="aiGeneratorSave" type="button">Сохранить в мои рецепты →</button></div>
</div>`;
    }

    function saveRecipe(recipe,constraints,input){
        const key="recipepro_user_recipes";let saved=[];
        try{const raw=localStorage.getItem(key);saved=raw?JSON.parse(raw):[];if(!Array.isArray(saved))saved=[];}catch(error){saved=[];}
        const recipeToSave={
            ...recipe,id:"ai-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),
            title:recipe.title+" — AI-рецепт",tags:["Рецепт пользователя","AI Recipe"],filters:["protein"],isAiGenerated:true,
            aiGeneratedAt:new Date().toISOString(),aiSourceProducts:recipe.ingredients.map(item=>item.product||item.productId),
            aiRequest:input,aiConstraints:constraints,aiChanges:recipe.aiChanges||[],aiWarnings:recipe.aiWarnings||[]
        };
        saved.push(recipeToSave);localStorage.setItem(key,JSON.stringify(saved));return recipeToSave;
    }

    function handleSave(recipe,constraints,input){
        try{
            saveRecipe(recipe,constraints,input);
            $("#aiGeneratorSave").disabled=true;$("#aiGeneratorSave").textContent="✓ Сохранено";
            $("#aiGeneratorResult").insertAdjacentHTML("beforeend",'<div class="ai-generator-saved">Рецепт сохранён в «Мои рецепты»</div>');
            setTimeout(()=>{close();window.location.hash="#my-recipes";window.location.reload();},700);
        }catch(error){console.error("RecipePro AI save error:",error);alert("Не удалось сохранить рецепт. Попробуй ещё раз.");}
    }

    async function generate(){
        const input=$("#aiGeneratorInput").value.trim(),result=$("#aiGeneratorResult");
        if(!input){
            result.innerHTML='<div class="ai-generator-result"><strong>Опиши продукты</strong><p style="margin-top:7px">Напиши, что есть дома и, если хочешь, добавь ограничения по калориям, белку, времени или порциям.</p></div>';
            return;
        }
        result.innerHTML='<div class="ai-generator-result"><strong>RecipePro ищет продукты…</strong><p style="margin-top:7px">Проверяю локальную базу и открытую базу продуктов.</p></div>';
        const detected=await detectProducts(input);
        if(!detected.length){
            result.innerHTML='<div class="ai-generator-result"><strong>Не удалось распознать продукты</strong><p style="margin-top:7px">Попробуй написать названия продуктов через запятую. Если продукта нет в локальной базе, RecipePro попробует найти его во внешней базе.</p></div>';
            return;
        }
        const constraints=parseRequest(input);
        const builder=window.recipeProRecipeBuilder;
        const built=builder?.build?.(detected,constraints);
        const recommendation=window.recipeProRecommendationEngine?.recommend(detected,constraints);
        const ranked=recommendation?.candidates||[];
        const primary=ranked[0]?.recipe||built||buildRecipe(detected,constraints);
        if(!primary){
            result.innerHTML='<div class="ai-generator-result"><strong>Не удалось собрать подходящее блюдо</strong><p style="margin-top:7px">RecipePro не будет добавлять отсутствующие обязательные продукты. Попробуй добавить ещё один продукт или попроси другой тип блюда.</p></div>';
            return;
        }
        const recipe=adaptRecipe(primary,constraints);
        const generatedCandidates=ranked.length ? ranked : (built ? [{recipe:built,score:0,reasons:["собрано из ваших продуктов"]}] : []);
        const alternatives=generatedCandidates.slice(1,4).map(item=>({ ...item, recipe:adaptRecipe(item.recipe,constraints) }));
        renderResult(recipe,detected,constraints,alternatives);
        $("#aiGeneratorSave")?.addEventListener("click",()=>handleSave(recipe,constraints,input));
    }

    function open(){injectStyles();ensureModal();$("#"+MODAL_ID).classList.add("is-open");$("#aiGeneratorInput").focus();}
    function close(){const modal=$("#"+MODAL_ID);if(modal)modal.classList.remove("is-open");}

    document.addEventListener("DOMContentLoaded",()=>{
        injectStyles();ensureModal();
        $("#aiRecipeGeneratorBtn")?.addEventListener("click",open);
        $("#aiGeneratorClose")?.addEventListener("click",close);
        $("#aiGeneratorCancel")?.addEventListener("click",close);
        $("#aiGeneratorGenerate")?.addEventListener("click",generate);
        $("#aiGeneratorInput")?.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")generate();});
        $$("#aiRecipeGeneratorModal .ai-generator-example").forEach(btn=>btn.addEventListener("click",()=>{$("#aiGeneratorInput").value=btn.dataset.example||"";$("#aiGeneratorInput").focus();}));
        $("#aiRecipeGeneratorModal")?.addEventListener("click",e=>{if(e.target.id===MODAL_ID)close();});
        document.addEventListener("keydown",e=>{if(e.key==="Escape")close();});
    });
})();