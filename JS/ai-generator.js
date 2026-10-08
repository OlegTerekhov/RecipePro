(function () {
    "use strict";

    const MODAL_ID = "aiRecipeGeneratorModal";

    const PRODUCT_ORDER = [
        "курица", "куриное-бедро", "индейка", "говядина", "свинина",
        "лосось", "тунец", "креветки",
        "яйца", "творог", "сыр", "моцарелла", "йогурт", "сметана", "молоко",
        "картофель", "лук", "морковь", "помидоры", "огурец", "перец",
        "брокколи", "капуста", "кабачок", "чеснок",
        "рис", "гречка", "овсянка", "паста", "хлеб", "чечевица", "фасоль",
        "банан", "яблоко", "апельсин", "масло", "сливочное-масло", "мед", "сахар"
    ];

    const ALIASES = {
        "курица": ["курица", "курицу", "куриной", "куриное", "грудка", "грудку"],
        "куриное-бедро": ["бедро", "бедрышко"],
        "индейка": ["индейка", "индейку", "индейки"],
        "говядина": ["говядина", "говядину"],
        "свинина": ["свинина", "свинину"],
        "лосось": ["лосось", "лосося"],
        "тунец": ["тунец", "тунца"],
        "креветки": ["креветки", "креветок"],
        "яйца": ["яйца", "яйцо", "яиц"],
        "творог": ["творог", "творога"],
        "сыр": ["сыр", "сыра"],
        "моцарелла": ["моцарелла"],
        "йогурт": ["йогурт", "йогурта"],
        "сметана": ["сметана", "сметаны"],
        "молоко": ["молоко", "молока"],
        "картофель": ["картофель", "картошка", "картошку", "картофеля"],
        "лук": ["лук", "лука"],
        "морковь": ["морковь", "морковку"],
        "помидоры": ["помидоры", "помидор", "томат", "томаты"],
        "огурец": ["огурец", "огурцы"],
        "перец": ["перец"],
        "брокколи": ["брокколи"],
        "капуста": ["капуста", "капусту"],
        "кабачок": ["кабачок", "кабачки"],
        "чеснок": ["чеснок", "чеснока"],
        "рис": ["рис", "риса"],
        "гречка": ["гречка", "гречневую", "гречневой"],
        "овсянка": ["овсянка", "овсянку", "овсяные хлопья"],
        "паста": ["паста", "макароны", "макарон", "спагетти"],
        "хлеб": ["хлеб", "хлеба"],
        "чечевица": ["чечевица", "чечевицу"],
        "фасоль": ["фасоль", "фасоли"],
        "банан": ["банан", "бананы", "банана"],
        "яблоко": ["яблоко", "яблоки", "яблока"],
        "апельсин": ["апельсин", "апельсины"],
        "масло": ["масло", "растительное", "оливковое"],
        "сливочное-масло": ["сливочное масло"],
        "мед": ["мед", "мёд"],
        "сахар": ["сахар"]
    };

    const NAMES = {
        "курица": "куриная грудка", "куриное-бедро": "куриное бедро", "индейка": "индейка",
        "говядина": "говядина", "свинина": "свинина", "лосось": "лосось", "тунец": "тунец",
        "креветки": "креветки", "яйца": "яйца", "творог": "творог", "сыр": "сыр",
        "моцарелла": "моцарелла", "йогурт": "йогурт", "сметана": "сметана", "молоко": "молоко",
        "картофель": "картофель", "лук": "лук", "морковь": "морковь", "помидоры": "помидоры",
        "огурец": "огурец", "перец": "болгарский перец", "брокколи": "брокколи",
        "капуста": "капуста", "кабачок": "кабачок", "чеснок": "чеснок", "рис": "рис",
        "гречка": "гречка", "овсянка": "овсянка", "паста": "паста", "хлеб": "хлеб",
        "чечевица": "чечевица", "фасоль": "фасоль", "банан": "банан", "яблоко": "яблоко",
        "апельсин": "апельсин", "масло": "растительное масло", "сливочное-масло": "сливочное масло",
        "мед": "мёд", "сахар": "сахар"
    };

    const $ = (selector, root=document) => root.querySelector(selector);

    function esc(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function injectStyles() {
        if ($("#aiGeneratorStyles")) return;
        const style=document.createElement("style");
        style.id="aiGeneratorStyles";
        style.textContent=`
.ai-generator-trigger{width:100%;margin-top:18px;display:flex;align-items:center;gap:14px;padding:15px 17px;border:1px solid rgba(32,55,47,.14);border-radius:18px;background:rgba(255,255,255,.72);color:#20372F;text-align:left;cursor:pointer;box-shadow:0 8px 25px rgba(32,55,47,.06);transition:.22s ease}
.ai-generator-trigger:hover{transform:translateY(-2px);box-shadow:0 14px 32px rgba(32,55,47,.1);border-color:rgba(32,55,47,.25)}
.ai-generator-trigger-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#20372F;color:#fff;font-size:18px;flex:0 0 auto}
.ai-generator-trigger strong,.ai-generator-trigger small{display:block}
.ai-generator-trigger strong{font:600 14px Inter,sans-serif}
.ai-generator-trigger small{margin-top:3px;color:#6d756f;font:400 12px Inter,sans-serif}
.ai-generator-trigger-arrow{margin-left:auto;font-size:18px}
.ai-generator-overlay{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(18,30,26,.48);backdrop-filter:blur(8px)}
.ai-generator-overlay.is-open{display:flex}
.ai-generator-modal{width:min(720px,100%);max-height:min(760px,92vh);overflow:auto;border-radius:28px;background:#fffdf9;box-shadow:0 30px 90px rgba(0,0,0,.2);position:relative}
.ai-generator-head{padding:34px 36px 22px;border-bottom:1px solid rgba(32,55,47,.1)}
.ai-generator-kicker{font:700 11px Inter,sans-serif;letter-spacing:.16em;color:#6e8379}
.ai-generator-head h2{margin:8px 0 7px;font:600 30px "Playfair Display",serif;color:#20372F}
.ai-generator-head p{margin:0;color:#69736e;font:14px/1.6 Inter,sans-serif}
.ai-generator-close{position:absolute;right:20px;top:18px;border:0;background:transparent;font-size:28px;color:#65706a;cursor:pointer}
.ai-generator-body{padding:28px 36px 34px}
.ai-generator-label{display:block;margin-bottom:9px;font:600 12px Inter,sans-serif;color:#20372F}
.ai-generator-input{width:100%;min-height:115px;resize:vertical;box-sizing:border-box;border:1px solid rgba(32,55,47,.15);border-radius:18px;background:#fff;padding:16px 17px;font:15px/1.55 Inter,sans-serif;color:#20372F;outline:none}
.ai-generator-input:focus{border-color:#20372F;box-shadow:0 0 0 4px rgba(32,55,47,.07)}
.ai-generator-examples{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 24px}
.ai-generator-example{border:1px solid rgba(32,55,47,.12);background:#fff;border-radius:999px;padding:8px 12px;color:#53625b;cursor:pointer;font:12px Inter,sans-serif}
.ai-generator-example:hover{border-color:rgba(32,55,47,.3);color:#20372F}
.ai-generator-actions{display:flex;justify-content:flex-end;gap:10px}
.ai-generator-result{margin-top:24px;padding:22px;border-radius:22px;background:#f5f1e9;border:1px solid rgba(32,55,47,.08)}
.ai-generator-result-top{display:flex;align-items:flex-start;gap:16px}
.ai-generator-result-emoji{width:64px;height:64px;display:grid;place-items:center;border-radius:18px;background:#fff;font-size:34px;flex:0 0 auto}
.ai-generator-result h3{margin:0 0 5px;font:600 23px "Playfair Display",serif;color:#20372F}
.ai-generator-result p{margin:0;color:#68736d;font:13px/1.5 Inter,sans-serif}
.ai-generator-tags{display:flex;flex-wrap:wrap;gap:7px;margin:18px 0}
.ai-generator-tag{padding:6px 9px;border-radius:999px;background:#fff;color:#56635d;font:11px Inter,sans-serif}
.ai-generator-ingredients{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.ai-generator-ingredient{display:flex;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:12px;background:#fff;font:12px Inter,sans-serif;color:#33453d}
.ai-generator-ingredient span:last-child{color:#728078}
.ai-generator-steps{margin:12px 0 0;padding-left:20px;color:#53615b;font:13px/1.65 Inter,sans-serif}
.ai-generator-note{margin-top:18px;color:#7a847f;font:11px/1.5 Inter,sans-serif}
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
<p>Напиши, что есть дома. Сначала RecipePro соберёт безопасный локальный черновик — без изменения основной базы рецептов.</p>
</div>
<div class="ai-generator-body">
<label class="ai-generator-label" for="aiGeneratorInput">Твои продукты</label>
<textarea class="ai-generator-input" id="aiGeneratorInput" placeholder="Например: яйца, творог и банан"></textarea>
<div class="ai-generator-examples">
<button class="ai-generator-example" type="button" data-example="яйца, творог и банан">яйца + творог + банан</button>
<button class="ai-generator-example" type="button" data-example="курица, картошка и лук">курица + картошка + лук</button>
<button class="ai-generator-example" type="button" data-example="рис, курица и морковь">рис + курица + морковь</button>
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

    function detectProducts(input) {
        const text=input.toLowerCase().replace(/ё/g,"е");
        return PRODUCT_ORDER.filter(id => {
            const aliases=ALIASES[id] || [id];
            return aliases.some(alias => text.includes(alias.replace(/ё/g,"е")));
        }).slice(0,8);
    }

    function amountFor(id) {
        const p=window.products?.[id];
        if (p?.pieceWeight && ["яйца","банан","яблоко","апельсин"].includes(id)) return {amount:p.pieceWeight,unit:"г"};
        if (["масло","сливочное-масло"].includes(id)) return {amount:10,unit:"г"};
        if (["лук","чеснок","морковь","помидоры","перец"].includes(id)) return {amount:80,unit:"г"};
        if (["рис","гречка","овсянка","паста","чечевица","фасоль"].includes(id)) return {amount:70,unit:"г"};
        if (["творог","йогурт","сметана","молоко","сыр","моцарелла"].includes(id)) return {amount:120,unit:"г"};
        return {amount:180,unit:"г"};
    }

    function nutrition(ingredients) {
        return ingredients.reduce((sum,item)=>{
            const p=window.products?.[item.product];
            if(!p?.raw) return sum;
            const factor=item.amount/100;
            sum.calories+=p.raw.kcal*factor;
            sum.protein+=p.raw.protein*factor;
            sum.fat+=p.raw.fat*factor;
            sum.carbs+=p.raw.carbs*factor;
            return sum;
        },{calories:0,protein:0,fat:0,carbs:0});
    }

    function buildRecipe(ids) {
        const has=id=>ids.includes(id);
        let title="Домашнее блюдо RecipePro";
        let emoji="🍽️";
        let steps=[];
        let selected=[...ids];

        const protein=ids.find(id=>["курица","куриное-бедро","индейка","говядина","свинина","лосось","тунец","креветки"].includes(id));
        const grain=ids.find(id=>["рис","гречка","паста","чечевица","фасоль"].includes(id));
        const breakfast=has("яйца") || has("творог") || has("овсянка") || has("банан");

        if (has("яйца") && has("творог") && has("банан")) {
            title="Творожный омлет с бананом"; emoji="🥞";
            selected=["яйца","творог","банан"];
            steps=["Смешай яйца с творогом до однородной массы.","Добавь банан и аккуратно разомни его вилкой.","Готовь на антипригарной сковороде под крышкой 5–7 минут на слабом огне."];
        } else if (protein && has("картофель")) {
            title=NAMES[protein]+" с картофелем"; emoji="🍗";
            selected=[protein,"картофель",...(has("лук")?["лук"]:[]),...(has("морковь")?["морковь"]:[])];
            steps=["Нарежь белковый продукт и овощи небольшими кусочками.","Обжарь или прогрей белковый продукт на хорошо разогретой сковороде.","Добавь картофель и овощи, немного воды, накрой крышкой и готовь до мягкости."];
        } else if (protein && grain) {
            title=NAMES[protein]+" с "+NAMES[grain]; emoji="🍲";
            selected=[protein,grain,...(has("морковь")?["морковь"]:[]),...(has("лук")?["лук"]:[])];
            steps=["Подготовь белковый продукт и нарежь овощи.","Приготовь крупу или пасту до готовности.","Соедини ингредиенты и прогрей вместе 3–5 минут."];
        } else if (has("овсянка") && has("банан")) {
            title="Овсянка с бананом"; emoji="🥣";
            selected=["овсянка","банан",...(has("молоко")?["молоко"]:[])];
            steps=["Залей овсянку молоком или водой.","Готовь до мягкости 5–7 минут.","Добавь банан перед подачей."];
        } else if (breakfast) {
            title="Тёплый завтрак из того, что есть"; emoji="🍳";
            selected=ids.slice(0,5);
            steps=["Подготовь продукты и нарежь крупные ингредиенты.","Соедини продукты в подходящей для них последовательности.","Готовь до полной готовности продуктов и подавай сразу."];
        } else {
            selected=ids.slice(0,5);
            title=selected.slice(0,3).map(id=>NAMES[id]).join(" · ");
            emoji=protein?"🍲":"🥗";
            steps=["Подготовь и нарежь ингредиенты.","Приготовь продукты с самым долгим временем готовки первыми.","Добавь остальные ингредиенты и доведи блюдо до готовности."];
        }

        const ingredients=selected.map(product=>{
            const a=amountFor(product);
            return {product,amount:a.amount,unit:a.unit,state:"raw"};
        });
        const n=nutrition(ingredients);
        return {
            id:"ai-draft-"+Date.now(),
            title,description:"Черновик, собранный RecipePro AI из доступных продуктов.",
            emoji,time:breakfast?15:30,servings:2,ingredients,steps,
            nutrition:{
                calories:Math.round(n.calories/2),
                protein:Math.round(n.protein/2*10)/10,
                fat:Math.round(n.fat/2*10)/10,
                carbs:Math.round(n.carbs/2*10)/10
            }
        };
    }

    function renderResult(recipe, detected) {
        const ingredientHtml=recipe.ingredients.map(item=>{
            const name=NAMES[item.product] || item.product;
            return `<div class="ai-generator-ingredient"><span>${esc(name)}</span><span>${item.amount} ${esc(item.unit)}</span></div>`;
        }).join("");
        const stepHtml=recipe.steps.map(step=>`<li>${esc(step)}</li>`).join("");
        $("#aiGeneratorResult").innerHTML=`
<div class="ai-generator-result">
<div class="ai-generator-result-top">
<div class="ai-generator-result-emoji">${recipe.emoji}</div>
<div><h3>${esc(recipe.title)}</h3><p>${esc(recipe.description)}</p></div>
</div>
<div class="ai-generator-tags">
<span class="ai-generator-tag">${recipe.time} мин</span>
<span class="ai-generator-tag">${recipe.nutrition.calories} ккал / порция</span>
<span class="ai-generator-tag">${recipe.nutrition.protein} г белка</span>
<span class="ai-generator-tag">2 порции</span>
</div>
<strong class="ai-generator-label">Ингредиенты</strong>
<div class="ai-generator-ingredients">${ingredientHtml}</div>
<strong class="ai-generator-label" style="margin-top:18px">Как приготовить</strong>
<ol class="ai-generator-steps">${stepHtml}</ol>
<div class="ai-generator-note">Распознано: ${detected.map(id=>esc(NAMES[id]||id)).join(", ")}. На этом этапе результат — локальный черновик: база рецептов и Мои рецепты не изменяются.</div>
</div>`;
    }

    function open() {
        injectStyles(); ensureModal();
        $("#"+MODAL_ID).classList.add("is-open");
        $("#aiGeneratorInput").focus();
    }

    function close() {
        const modal=$("#"+MODAL_ID);
        if(modal) modal.classList.remove("is-open");
    }

    function generate() {
        const input=$("#aiGeneratorInput").value.trim();
        const detected=detectProducts(input);
        const result=$("#aiGeneratorResult");
        if(!detected.length){
            result.innerHTML=`<div class="ai-generator-result"><strong>Не нашёл продукты</strong><p style="margin-top:7px">Попробуй написать, например: «курица, картошка и лук».</p></div>`;
            return;
        }
        renderResult(buildRecipe(detected),detected);
    }

    document.addEventListener("DOMContentLoaded",()=>{
        injectStyles(); ensureModal();
        $("#aiRecipeGeneratorBtn")?.addEventListener("click",open);
        $("#aiGeneratorClose")?.addEventListener("click",close);
        $("#aiGeneratorCancel")?.addEventListener("click",close);
        $("#aiGeneratorGenerate")?.addEventListener("click",generate);
        $("#aiGeneratorInput")?.addEventListener("keydown",e=>{
            if((e.ctrlKey||e.metaKey)&&e.key==="Enter") generate();
        });
        $$("#aiRecipeGeneratorModal .ai-generator-example").forEach(btn=>{
            btn.addEventListener("click",()=>{
                $("#aiGeneratorInput").value=btn.dataset.example||"";
                $("#aiGeneratorInput").focus();
            });
        });
        $("#aiRecipeGeneratorModal")?.addEventListener("click",e=>{
            if(e.target.id===MODAL_ID) close();
        });
        document.addEventListener("keydown",e=>{
            if(e.key==="Escape") close();
        });
    });

    function $$(selector,root=document){ return Array.from(root.querySelectorAll(selector)); }
})();