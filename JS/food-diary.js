(function () {
"use strict";
const STORE="recipepro_food_diary_v1", GOALS="recipepro_nutrition_goals_v1";
const $=id=>document.getElementById(id);
const fmt=(n,d=1)=>Number(Number(n||0).toFixed(d)).toLocaleString("ru-RU",{maximumFractionDigits:d});
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch(_){return fallback;}}
function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^а-яa-z0-9]+/gi," ").trim();}
function findProduct(value){const q=norm(value);if(!q||!window.products)return null;const all=Object.entries(window.products);
for(const [id,p] of all)if(norm(id)===q||norm(p.name)===q)return{id,product:p};
for(const [id,p] of all)if((p.aliases||[]).some(a=>norm(a)===q))return{id,product:p};
if(q.length<4||/(?:^|\\s)(?:с|и|плюс)(?:\\s|$)/.test(q))return null;
const matches=new Map();
for(const [id,p] of all){const names=[id,p.name,...(p.aliases||[])].map(norm).filter(n=>n.length>=4);if(names.some(n=>q.includes(n)))matches.set(id,{id,product:p});}
return matches.size===1?[...matches.values()][0]:null;}
function calc(p,grams,state){const engine=window.recipeProNutritionEngine;if(engine&&typeof engine.calculateIngredient==="function"){const result=engine.calculateIngredient({product:p,amount:grams,state:state==="boiled"?"boiled":"raw"});return{calories:result.calories,protein:result.protein,fat:result.fat,carbs:result.carbs};}const raw=p.raw||{},ratio=Number(p.cookedWeightRatio);let basis=Number(grams);if(state==="boiled"&&Number.isFinite(ratio)&&ratio>0)basis/=ratio;const f=basis/100;return{calories:Number(raw.kcal||0)*f,protein:Number(raw.protein||0)*f,fat:Number(raw.fat||0)*f,carbs:Number(raw.carbs||0)*f};}
function goals(){return read(GOALS,null);}function diary(){return read(STORE,{});}function date(){return $("rpDiaryDate").value||today();}function entries(){const d=diary();return Array.isArray(d[date()])?d[date()]:[];}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderLog(list){const host=$("rpFoodLog");if(!list.length){host.innerHTML='<p class="rp-diary-empty">Пока нет записей. Добавь первый продукт выше.</p>';return;}
host.innerHTML=["Завтрак","Обед","Ужин","Перекус"].map(meal=>{const group=list.filter(e=>e.meal===meal);if(!group.length)return"";return '<div class="rp-food-meal-group"><h4>'+meal+'</h4>'+group.map(e=>'<article class="rp-food-log-row"><div class="rp-food-log-name"><strong>'+escapeHtml(e.name)+'</strong><span>'+fmt(e.grams,0)+' г · '+(e.state==="boiled"?"приготовленный вес":"сырой / сухой вес")+'</span></div><div class="rp-food-log-kcal"><strong>'+fmt(e.calories,0)+'</strong><span>ккал</span></div><div class="rp-food-log-macros"><span>Б '+fmt(e.protein)+'</span><span>Ж '+fmt(e.fat)+'</span><span>У '+fmt(e.carbs)+'</span></div><button type="button" class="rp-food-delete" data-delete-entry="'+escapeHtml(e.id)+'" aria-label="Удалить '+escapeHtml(e.name)+'">×</button></article>').join("")+'</div>';}).join("");}
function render(){const g=goals()||{},list=entries(),total=list.reduce((t,e)=>{["calories","protein","fat","carbs"].forEach(k=>t[k]+=Number(e[k]||0));return t;},{calories:0,protein:0,fat:0,carbs:0});
$("rpDiaryCalories").textContent=fmt(total.calories,0);$("rpDiaryProtein").textContent=fmt(total.protein)+" г";$("rpDiaryFat").textContent=fmt(total.fat)+" г";$("rpDiaryCarbs").textContent=fmt(total.carbs)+" г";
$("rpDiaryDayLabel").textContent=date()===today()?"Сегодня":new Date(date()+"T12:00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long"});
const cg=Number(g.calories||0),pct=cg?Math.round(total.calories/cg*100):0;$("rpDiaryCaloriePercent").textContent=Math.min(pct,999)+"%";$("rpDiaryCalorieRing").style.setProperty("--rp-progress",Math.min(pct,100)+"%");
$("rpDiaryCaloriesRemaining").textContent=cg?(total.calories>=cg?"На "+fmt(total.calories-cg,0)+" ккал выше цели":"Осталось "+fmt(cg-total.calories,0)+" ккал"):"Сначала укажи дневную норму";
[["Protein","protein"],["Fat","fat"],["Carbs","carbs"]].forEach(([label,key])=>{const target=Number(g[key]||0),value=total[key];$("rpDiary"+label+"Bar").style.width=target?Math.min(100,value/target*100)+"%":"0%";$("rpDiary"+label+"Remaining").textContent=target?(value>=target?"Норма достигнута · +"+fmt(value-target)+" г":"Осталось "+fmt(target-value)+" г"):"Норма не задана";});
if(g.calories!==undefined){$("rpGoalCalories").value=g.calories;$("rpGoalProtein").value=g.protein;$("rpGoalFat").value=g.fat;$("rpGoalCarbs").value=g.carbs;}renderLog(list);}
function save(list){const d=diary();d[date()]=list;try{localStorage.setItem(STORE,JSON.stringify(d));render();}catch(_){$("rpFoodStatus").textContent="Не удалось сохранить данные. Возможно, память браузера заполнена.";}}
function importRecipeIngredients(event){
const detail=event.detail||{},items=Array.isArray(detail.ingredients)?detail.ingredients:[];
const list=entries(),meal=$("rpFoodMeal").value||"Обед";let added=0,skipped=0;
items.forEach(item=>{
if(!item||typeof item!=="object"){skipped++;return;}
const unit=String(item.unit||"г").trim().toLowerCase();
const grams=Number(item.amount??item.grams??item.quantity??0);
if(!["г","гр","грамм","грамма","граммов","g","gram","grams"].includes(unit)||!Number.isFinite(grams)||grams<=0){skipped++;return;}
const lookup=item.product||item.productId||item.name||item.title||item.productName||"";
const found=findProduct(lookup);
if(!found){skipped++;return;}
const state=String(item.state||"raw").toLowerCase();
const cooked=["boiled","cooked","приготовленный","готовый"].includes(state)?"boiled":"raw";
const values=calc(found.product,grams,cooked);
const id=window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);
list.push({id,productId:found.id,name:found.product.name,grams,state:cooked,meal,...values,createdAt:new Date().toISOString(),sourceRecipe:String(detail.title||"Блюдо из сообщества")});
added++;
});
if(added){save(list);$("rpFoodStatus").textContent="Добавлено в дневник ингредиентов: "+added+". Проверь запись и при необходимости скорректируй вес."+(skipped?" Пропущено неподдерживаемых или неизвестных ингредиентов: "+skipped+".":"");}
else $("rpFoodStatus").textContent="Не удалось добавить ингредиенты: нужны известные продукты из каталога и количество в граммах."+(skipped?" Пропущено: "+skipped+".":"");
}
if (window.__RECIPEPRO_TEST__) window.recipeProFoodDiary = { findProduct };
function init(){if(!$("rpFoodForm")||!window.products)return;$("rpDiaryDate").value=today();window.addEventListener("recipepro:import-ingredients",importRecipeIngredients);
const options=$("rpFoodProductList");Object.values(window.products).forEach(p=>{[p.name,...(p.aliases||[]).slice(0,3)].forEach(name=>{const o=document.createElement("option");o.value=name;options.appendChild(o);});});
$("rpGoalsForm").addEventListener("submit",e=>{e.preventDefault();const g={calories:Number($("rpGoalCalories").value),protein:Number($("rpGoalProtein").value),fat:Number($("rpGoalFat").value),carbs:Number($("rpGoalCarbs").value)};if(Object.values(g).some(v=>!Number.isFinite(v)||v<0)||g.calories<=0){$("rpGoalsStatus").textContent="Калории должны быть больше нуля, остальные значения — не меньше нуля.";return;}localStorage.setItem(GOALS,JSON.stringify(g));$("rpGoalsStatus").textContent="Твоя норма сохранена на этом устройстве.";render();});
$("rpFoodForm").addEventListener("submit",e=>{e.preventDefault();const found=findProduct($("rpFoodProduct").value),grams=Number($("rpFoodGrams").value);if(!found){$("rpFoodStatus").textContent="Не нашёл этот продукт в каталоге. Выбери название из подсказок — так расчёт не будет выдуманным.";return;}if(!Number.isFinite(grams)||grams<=0||grams>10000){$("rpFoodStatus").textContent="Укажи вес от 1 до 10 000 г.";return;}const state=$("rpFoodState").value,values=calc(found.product,grams,state),id=window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);const list=entries();list.push({id,productId:found.id,name:found.product.name,grams,state,meal:$("rpFoodMeal").value,...values,createdAt:new Date().toISOString()});save(list);$("rpFoodProduct").value="";$("rpFoodGrams").value="100";$("rpFoodStatus").textContent="Добавлено: "+found.product.name+". Значения рассчитаны по каталогу RecipePro.";});
$("rpFoodLog").addEventListener("click",e=>{const b=e.target.closest("[data-delete-entry]");if(b)save(entries().filter(x=>String(x.id)!==b.dataset.deleteEntry));});
$("rpDiaryDate").addEventListener("change",render);$("rpClearDiaryBtn").addEventListener("click",()=>{if(entries().length&&confirm("Удалить все записи питания за выбранный день?"))save([]);});render();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();