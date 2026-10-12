(() => {
  "use strict";
  const KEYS = { plan: "recipepro_meal_plan", shopping: "recipepro_shopping_list" };
  const MEALS = [{key:"breakfast",label:"Завтрак"},{key:"lunch",label:"Обед"},{key:"dinner",label:"Ужин"}];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  function read(key, fallback) { try { const value=JSON.parse(localStorage.getItem(key)||"null"); return value==null?fallback:value; } catch { return fallback; } }
  function write(key, value) { localStorage.setItem(key,JSON.stringify(value)); window.dispatchEvent(new CustomEvent("recipepro:data-changed")); }
  function esc(value) { return String(value??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function allRecipes() {
    const builtIn=Array.isArray(window.recipes)?window.recipes:[];
    const personal=read("recipepro_user_recipes",[]);
    const seen=new Set();
    return [...builtIn,...(Array.isArray(personal)?personal:[])].filter(r=>{if(!r||!r.id||!r.title||seen.has(String(r.id)))return false;seen.add(String(r.id));return true;});
  }
  function getPlan(){const p=read(KEYS.plan,{});return p&&typeof p==="object"&&!Array.isArray(p)?p:{};}
  function getShopping(){const s=read(KEYS.shopping,[]);return Array.isArray(s)?s:[];}
  function dateKey(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function weekDates(){const today=new Date();today.setHours(12,0,0,0);const monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return d;});}
  function dayLabel(d){return new Intl.DateTimeFormat("ru-RU",{weekday:"short",day:"numeric",month:"short"}).format(d).replace(".","");}
  function renderPlanner(){
    const root=$("#rpPlannerGrid");if(!root)return;
    const plan=getPlan(), recipes=allRecipes();
    const options=recipes.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.title)+'</option>').join("");
    root.innerHTML=weekDates().map(date=>{
      const key=dateKey(date), today=key===dateKey(new Date());
      return '<article class="rp-day-card'+(today?" is-today":"")+'" data-day="'+key+'"><div class="rp-day-heading"><strong>'+esc(dayLabel(date))+'</strong>'+(today?'<span>Сегодня</span>':"")+'</div>'+
      MEALS.map(m=>'<label class="rp-meal-slot"><span>'+m.label+'</span><select data-meal="'+m.key+'" aria-label="'+m.label+', '+esc(dayLabel(date))+'"><option value="">Не выбрано</option>'+options+'</select></label>').join("")+'</article>';
    }).join("");
    $$(".rp-day-card",root).forEach(card=>{const day=plan[card.dataset.day]||{};$$("select[data-meal]",card).forEach(s=>s.value=day[s.dataset.meal]||"");});
    updatePlanSummary();
  }
  function updatePlanSummary(){const plan=getPlan();const count=Object.values(plan).reduce((n,d)=>n+MEALS.filter(m=>d&&d[m.key]).length,0);const node=$("#rpPlanSummary");if(node)node.textContent=count+" приёмов пищи запланировано";}
  function ingredientName(i){if(typeof i==="string")return i.trim();return i&&typeof i==="object"?String(i.product||i.name||i.ingredient||"").trim():"";}
  function ingredientAmount(i){if(!i||typeof i!=="object")return {amount:null,unit:""};const n=Number(i.amount??i.quantity);return {amount:Number.isFinite(n)&&n>0?n:null,unit:String(i.unit||"").trim()};}
  function itemKey(name,unit){return String(name||"").toLocaleLowerCase("ru-RU").replace(/ё/g,"е").replace(/\s+/g," ").trim()+"|"+String(unit||"").toLowerCase().trim();}
  function formatAmount(item){if(item.amount==null||item.amount==="")return "";const n=Number(item.amount);return (Number.isFinite(n)?new Intl.NumberFormat("ru-RU",{maximumFractionDigits:2}).format(n):String(item.amount))+(item.unit?" "+item.unit:"");}
  function status(message){const n=$("#rpShoppingStatus");if(n)n.textContent=message;}
  function buildShopping(){
    const plan=getPlan(), byId=new Map(allRecipes().map(r=>[String(r.id),r])), combined=new Map();
    Object.entries(plan).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,day])=>MEALS.forEach(meal=>{
      const recipe=day&&byId.get(String(day[meal.key]||""));if(!recipe||!Array.isArray(recipe.ingredients))return;
      recipe.ingredients.forEach(ingredient=>{
        const name=ingredientName(ingredient);if(!name)return;const a=ingredientAmount(ingredient),key=itemKey(name,a.unit);
        if(!combined.has(key))combined.set(key,{id:"plan-"+key,text:name,amount:a.amount,unit:a.unit,checked:false,source:"plan"});
        else if(a.amount!=null&&combined.get(key).amount!=null)combined.get(key).amount+=a.amount;
        else if(a.amount!=null)combined.get(key).amount=a.amount;
      });
    }));
    const old=getShopping(), checked=new Map(old.map(i=>[itemKey(i.text,i.unit),Boolean(i.checked)]));
    const planned=[...combined.values()].map(i=>({...i,checked:checked.get(itemKey(i.text,i.unit))||false}));
    const custom=old.filter(i=>i.source!=="plan");
    write(KEYS.shopping,[...planned,...custom]);renderShopping();
    status(planned.length?"Список собран по плану: "+planned.length+" позиций. Проверь, что уже есть дома.":"В плане пока нет рецептов. Добавь блюда на неделю, чтобы собрать список автоматически.");
  }
  function renderShopping(){
    const root=$("#rpShoppingItems");if(!root)return;const items=getShopping(),checked=items.filter(i=>i.checked).length;
    const counter=$("#rpShoppingCount");if(counter)counter.textContent=items.length?checked+" из "+items.length+" куплено":"Список пока пуст";
    if(!items.length){root.innerHTML='<div class="rp-empty-state"><span>🧺</span><strong>Пока ничего не нужно покупать</strong><p>Добавь продукты вручную или собери список из плана питания.</p></div>';return;}
    const sorted=[...items].sort((a,b)=>Number(Boolean(a.checked))-Number(Boolean(b.checked))||String(a.text).localeCompare(String(b.text),"ru"));
    root.innerHTML=sorted.map(i=>'<label class="rp-shopping-item'+(i.checked?" is-checked":"")+'"><input type="checkbox" data-shopping-check="'+esc(i.id)+'" '+(i.checked?"checked":"")+'><span class="rp-shopping-name">'+esc(i.text)+'</span><span class="rp-shopping-amount">'+esc(formatAmount(i))+'</span><button type="button" class="rp-shopping-remove" data-shopping-remove="'+esc(i.id)+'" aria-label="Удалить '+esc(i.text)+'">×</button></label>').join("");
  }
  function addManual(){
    const input=$("#rpShoppingInput"),text=(input&&input.value||"").trim();if(!text){if(input)input.focus();return;}
    const items=getShopping();if(items.some(i=>itemKey(i.text,i.unit)===itemKey(text,""))){status("Этот продукт уже есть в списке.");input.value="";return;}
    items.push({id:"manual-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),text,amount:null,unit:"",checked:false,source:"manual"});
    write(KEYS.shopping,items);input.value="";renderShopping();status("Продукт добавлен.");
  }
  async function copyList(){
    const text=getShopping().filter(i=>!i.checked).map(i=>"- "+i.text+(formatAmount(i)?" — "+formatAmount(i):"")).join("\n");
    if(!text){status("Нет непокупленных продуктов для копирования.");return;}
    try{await navigator.clipboard.writeText(text);status("Список скопирован — можно отправить его в заметки или мессенджер.");}
    catch{const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const ok=document.execCommand("copy");area.remove();status(ok?"Список скопирован.":"Не удалось скопировать список. Попробуй выделить и скопировать вручную.");}
  }
  function bind(){
    $("#rpPlannerGrid")?.addEventListener("change",e=>{const s=e.target.closest("select[data-meal]");if(!s)return;const card=s.closest("[data-day]");if(!card)return;const plan=getPlan(),date=card.dataset.day;if(!plan[date])plan[date]={};if(s.value)plan[date][s.dataset.meal]=s.value;else delete plan[date][s.dataset.meal];if(!Object.keys(plan[date]).length)delete plan[date];write(KEYS.plan,plan);updatePlanSummary();});
    $("#rpBuildShoppingBtn")?.addEventListener("click",buildShopping);
    $("#rpAddShoppingBtn")?.addEventListener("click",addManual);
    $("#rpShoppingInput")?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addManual();}});
    $("#rpShoppingItems")?.addEventListener("change",e=>{const input=e.target.closest("input[data-shopping-check]");if(!input)return;const items=getShopping(),item=items.find(i=>String(i.id)===input.dataset.shoppingCheck);if(item){item.checked=input.checked;write(KEYS.shopping,items);renderShopping();}});
    $("#rpShoppingItems")?.addEventListener("click",e=>{const b=e.target.closest("button[data-shopping-remove]");if(!b)return;e.preventDefault();e.stopPropagation();write(KEYS.shopping,getShopping().filter(i=>String(i.id)!==b.dataset.shoppingRemove));renderShopping();status("Продукт удалён.");});
    $("#rpCopyShoppingBtn")?.addEventListener("click",copyList);
    $("#rpClearCheckedBtn")?.addEventListener("click",()=>{write(KEYS.shopping,getShopping().filter(i=>!i.checked));renderShopping();status("Купленные продукты удалены из списка.");});
    $("#rpClearPlanBtn")?.addEventListener("click",()=>{if(!window.confirm("Очистить весь план питания на неделю?"))return;write(KEYS.plan,{});renderPlanner();status("План очищен. Список покупок не изменён.");});
    window.addEventListener("storage",e=>{if([KEYS.plan,KEYS.shopping,"recipepro_user_recipes"].includes(e.key)){renderPlanner();renderShopping();}});
  }
  function init(){if(!$("#rpPlannerGrid")||!$("#rpShoppingItems"))return;renderPlanner();renderShopping();bind();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();