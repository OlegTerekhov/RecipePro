(function () {
"use strict";
const STORE="recipepro_custom_dishes_v1";
const DIARY="recipepro_food_diary_v1";
let editingDishId=null;
const $=id=>document.getElementById(id);
const fmt=(n,d=1)=>Number(Number(n||0).toFixed(d)).toLocaleString("ru-RU",{maximumFractionDigits:d});
const uid=()=>window.crypto?.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);
const escapeHtml=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch(_){return fallback;}}
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");}
function products(){return Object.entries(window.products||{}).filter(([,p])=>p&&p.raw&&[p.raw.kcal,p.raw.protein,p.raw.fat,p.raw.carbs].every(v=>Number.isFinite(Number(v)))).sort((a,b)=>String(a[1].name).localeCompare(String(b[1].name),"ru"));}
function selectedProduct(row){return window.products?.[row.querySelector("[data-dish-product]")?.value]||null;}
function addIngredientRow(data={}){
 const host=$("rpCustomDishIngredients"),list=products();if(!host||!list.length)return;
 const row=document.createElement("div");row.className="rp-custom-dish-ingredient";
 const opts=list.map(([id,p])=>'<option value="'+escapeHtml(id)+'" '+(data.productId===id?"selected":"")+'>'+escapeHtml(p.name)+'</option>').join("");
 row.innerHTML='<label class="rp-dish-ingredient-product">Продукт<select data-dish-product required>'+opts+'</select></label><label class="rp-dish-ingredient-grams">Вес, г<input data-dish-grams type="number" min="0.1" max="50000" step="0.1" value="'+escapeHtml(data.grams??100)+'" required></label><label class="rp-dish-ingredient-state">Состояние<select data-dish-state><option value="raw">Сырой / сухой</option><option value="boiled">Варёный</option><option value="fried">Жареный</option></select></label><button type="button" class="rp-dish-remove" data-remove-dish-ingredient aria-label="Удалить ингредиент">×</button>';
 if(data.state)row.querySelector("[data-dish-state]").value=data.state;
 host.appendChild(row);recalculate();
}
function ingredientsFromForm(){
 return [...$("rpCustomDishIngredients").querySelectorAll(".rp-custom-dish-ingredient")].map(row=>{
 const p=selectedProduct(row),grams=Number(row.querySelector("[data-dish-grams]").value),state=row.querySelector("[data-dish-state]").value;
 if(!p||!Number.isFinite(grams)||grams<=0)return null;
 return {productId:row.querySelector("[data-dish-product]").value,name:p.name,grams,state};
 }).filter(Boolean);
}
function calculate(items,finishedWeight){
 const engine=window.recipeProNutritionEngine;
 if(!engine||typeof engine.calculateIngredient!=="function")return null;
 const total={calories:0,protein:0,fat:0,carbs:0};
 for(const item of items){
  const product=window.products?.[item.productId];if(!product)return null;
  const result=engine.calculateIngredient({product,amount:item.grams,state:item.state,oilPer100:0});
  if(!result.known)return null;
  total.calories+=result.calories;total.protein+=result.protein;total.fat+=result.fat;total.carbs+=result.carbs;
 }
 const factor=100/finishedWeight;
 return {total,per100:{calories:total.calories*factor,protein:total.protein*factor,fat:total.fat*factor,carbs:total.carbs*factor}};
}
function currentDish(){
 const name=$("rpCustomDishName").value.trim(),items=ingredientsFromForm(),finishedWeight=Number($("rpCustomDishFinishedWeight").value),portionWeight=Number($("rpCustomDishPortionWeight").value);
 if(!name)throw new Error("Укажи название блюда.");
 if(!items.length)throw new Error("Добавь хотя бы один ингредиент и укажи его вес.");
 if(!Number.isFinite(finishedWeight)||finishedWeight<=0||finishedWeight>50000)throw new Error("Укажи вес всего готового блюда от 1 до 50 000 г.");
 if(!Number.isFinite(portionWeight)||portionWeight<=0||portionWeight>10000)throw new Error("Укажи вес порции от 1 до 10 000 г.");
 const result=calculate(items,finishedWeight);if(!result)throw new Error("Не удалось рассчитать КБЖУ. Проверь ингредиенты и обнови страницу.");
 if(portionWeight>finishedWeight)throw new Error("Вес порции не может превышать вес всего готового блюда.");
 return {id:editingDishId||uid(),name,ingredients:items,finishedWeight,portionWeight,meal:$("rpCustomDishMeal").value||"Обед",...result,updatedAt:new Date().toISOString()};
}
function renderResult(){
 const host=$("rpCustomDishResult");if(!host)return;
 try{
  const items=ingredientsFromForm(),finished=Number($("rpCustomDishFinishedWeight").value),portion=Number($("rpCustomDishPortionWeight").value);
  if(!items.length||!Number.isFinite(finished)||finished<=0||!Number.isFinite(portion)||portion<=0){host.innerHTML="<p>Добавь ингредиенты и укажи вес готового блюда и порции.</p>";return;}
  const result=calculate(items,finished);if(!result){host.innerHTML="<p>Расчёт недоступен: проверь каталог ингредиентов.</p>";return;}
  const portionFactor=portion/100,show=(obj,key,d=1)=>fmt(obj[key]*portionFactor,d);
  const oilPresent=items.some(item=>["масло","cookingoil","растительное масло","раст масла"].includes(String(item.productId).toLowerCase())||String(item.name).toLowerCase().includes("масло"));const friedWithoutOil=items.some(item=>item.state==="fried")&&!oilPresent;
  host.innerHTML='<div class="rp-dish-result-heading"><span>На 100 г</span><strong>'+fmt(result.per100.calories,0)+' ккал</strong></div><div class="rp-dish-macros"><span>Б <b>'+fmt(result.per100.protein)+' г</b></span><span>Ж <b>'+fmt(result.per100.fat)+' г</b></span><span>У <b>'+fmt(result.per100.carbs)+' г</b></span></div><div class="rp-dish-portion-result"><span>Порция '+fmt(portion,0)+' г</span><strong>'+fmt(show(result.per100,"calories",0),0)+' ккал</strong><small>Б '+show(result.per100,"protein")+' г · Ж '+show(result.per100,"fat")+' г · У '+show(result.per100,"carbs")+' г</small></div><p class="rp-dish-total-note">Всё блюдо: '+fmt(result.total.calories,0)+' ккал · вес '+fmt(finished,0)+' г</p>'+(friedWithoutOil?'<p class="rp-dish-oil-warning">Для жареных ингредиентов масло не включено автоматически. Добавь использованное масло отдельной строкой, иначе калорийность будет занижена.</p>':'');
 }catch(error){host.innerHTML='<p>'+escapeHtml(error.message)+'</p>';}
}
function readDiaryDishes(){
 const diary=read(DIARY,{}),found=[];
 Object.values(diary).forEach(list=>(Array.isArray(list)?list:[]).forEach(entry=>{if(entry?.customDishSnapshot?.id)found.push(entry.customDishSnapshot);}));
 return found;
}
function savedDishes(){
 const map=new Map();
 [...readDiaryDishes(),...read(STORE,[])].forEach(d=>{if(d&&d.id&&d.name)map.set(String(d.id),d);});
 return [...map.values()].sort((a,b)=>String(b.updatedAt||"").localeCompare(String(a.updatedAt||"")));
}
function renderSaved(){
 const host=$("rpSavedCustomDishes");if(!host)return;
 const dishes=savedDishes();
 host.innerHTML=dishes.length?dishes.map(d=>'<article class="rp-saved-dish"><button type="button" class="rp-saved-dish-load" data-load-custom-dish="'+escapeHtml(d.id)+'"><strong>'+escapeHtml(d.name)+'</strong><span>'+fmt(d.per100?.calories??(d.total?.calories||0)*100/Math.max(1,Number(d.finishedWeight)||1),0)+' ккал / 100 г · '+fmt(d.finishedWeight||0,0)+' г</span></button><button type="button" class="rp-dish-remove-saved" data-delete-custom-dish="'+escapeHtml(d.id)+'" aria-label="Удалить '+escapeHtml(d.name)+'">×</button></article>').join(""):'<p class="rp-diary-empty">Пока нет сохранённых блюд. Рассчитай первое выше.</p>';
}
function loadDish(d){
 editingDishId=String(d.id);
 $("rpCustomDishName").value=d.name||"";
 $("rpCustomDishIngredients").innerHTML="";
 (d.ingredients||[]).forEach(item=>addIngredientRow({productId:item.productId,grams:item.grams,state:item.state}));
 $("rpCustomDishFinishedWeight").value=d.finishedWeight||"";
 $("rpCustomDishPortionWeight").value=d.portionWeight||250;
 $("rpCustomDishMeal").value=d.meal||"Обед";
 recalculate();
 $("rpCustomDishPanel").scrollIntoView({behavior:"smooth",block:"start"});
}
function recalculate(){renderResult();}
function newDish(){
 editingDishId=null;
 $("rpCustomDishName").value="";
 $("rpCustomDishIngredients").innerHTML="";
 addIngredientRow({productId:products()[0]?.[0],grams:100,state:"raw"});
 $("rpCustomDishFinishedWeight").value="";
 $("rpCustomDishPortionWeight").value="250";
 $("rpCustomDishMeal").value=$("rpFoodMeal")?.value||"Обед";
 $("rpCustomDishStatus").textContent="Новое блюдо. Добавь ингредиенты и укажи итоговый вес после приготовления.";
 recalculate();
 $("rpCustomDishName").focus();
}
function saveDish(){
 try{
  const d=currentDish();editingDishId=String(d.id);const list=read(STORE,[]),next=[d,...list.filter(x=>String(x.id)!==String(d.id)&&x.name!==d.name)].slice(0,100);
  localStorage.setItem(STORE,JSON.stringify(next));$("rpCustomDishStatus").textContent="Блюдо сохранено на этом устройстве. Добавь порцию в дневник, чтобы запись синхронизировалась с аккаунтом.";renderSaved();
 }catch(error){$("rpCustomDishStatus").textContent=error.message;}
}
function addPortion(event){
 event.preventDefault();
 try{
  const d=currentDish(),portion=Number(d.portionWeight),factor=portion/100,per=d.per100||{calories:d.total.calories*100/d.finishedWeight,protein:d.total.protein*100/d.finishedWeight,fat:d.total.fat*100/d.finishedWeight,carbs:d.total.carbs*100/d.finishedWeight};
  const entry={id:uid(),name:d.name,grams:portion,state:"prepared",meal:d.meal,calories:per.calories*factor,protein:per.protein*factor,fat:per.fat*factor,carbs:per.carbs*factor,createdAt:new Date().toISOString(),customDishId:d.id,customDishSnapshot:d};
  const diary=read(DIARY,{}),dateInput=$("rpDiaryDate"),day=dateInput?.value||today();if(!Array.isArray(diary[day]))diary[day]=[];diary[day].push(entry);
  localStorage.setItem(DIARY,JSON.stringify(diary));
  const saved=read(STORE,[]);localStorage.setItem(STORE,JSON.stringify([d,...saved.filter(x=>String(x.id)!==String(d.id)&&x.name!==d.name)].slice(0,100)));editingDishId=String(d.id);
  document.dispatchEvent(new CustomEvent("recipepro:diary-updated"));
  $("rpCustomDishStatus").textContent="Добавлено в дневник: "+d.name+" — "+fmt(portion,0)+" г. КБЖУ рассчитано по весу готового блюда.";
  renderSaved();
 }catch(error){$("rpCustomDishStatus").textContent=error.message;}
}
function init(){
 if(!$("rpCustomDishForm")||!window.products||!window.recipeProNutritionEngine)return;
 addIngredientRow({productId:products()[0]?.[0],grams:100,state:"raw"});
 $("rpAddDishIngredient").addEventListener("click",()=>addIngredientRow({productId:products()[0]?.[0],grams:100,state:"raw"}));
 $("rpCustomDishIngredients").addEventListener("input",recalculate);
 $("rpCustomDishIngredients").addEventListener("change",recalculate);
 $("rpCustomDishIngredients").addEventListener("click",e=>{if(e.target.closest("[data-remove-dish-ingredient]")){e.target.closest(".rp-custom-dish-ingredient").remove();recalculate();}});
 ["rpCustomDishName","rpCustomDishFinishedWeight","rpCustomDishPortionWeight","rpCustomDishMeal"].forEach(id=>$(id).addEventListener("input",recalculate));
 $("rpSaveCustomDish").addEventListener("click",saveDish);
 $("rpNewCustomDish").addEventListener("click",newDish);
 $("rpCustomDishForm").addEventListener("submit",addPortion);
 $("rpSavedCustomDishes").addEventListener("click",e=>{
  const load=e.target.closest("[data-load-custom-dish]");if(load){const d=savedDishes().find(x=>String(x.id)===load.dataset.loadCustomDish);if(d)loadDish(d);return;}
  const del=e.target.closest("[data-delete-custom-dish]");if(del){const id=del.dataset.deleteCustomDish;localStorage.setItem(STORE,JSON.stringify(read(STORE,[]).filter(x=>String(x.id)!==id)));const diary=read(DIARY,{});let changed=false;Object.keys(diary).forEach(day=>{if(Array.isArray(diary[day]))diary[day]=diary[day].map(entry=>{if(String(entry?.customDishSnapshot?.id)!==id)return entry;const copy={...entry};delete copy.customDishSnapshot;changed=true;return copy;});});if(changed)localStorage.setItem(DIARY,JSON.stringify(diary));if(editingDishId===id)editingDishId=null;renderSaved();}
 });
 document.addEventListener("recipepro:diary-updated",renderSaved);
 $("rpCustomDishMeal").value=$("rpFoodMeal")?.value||"Обед";
 renderSaved();recalculate();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();