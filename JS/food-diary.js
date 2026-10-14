(function () {
"use strict";
const STORE="recipepro_food_diary_v1", GOALS="recipepro_nutrition_goals_v1";
const externalProducts=new Map();
let searchRequest=0,searchTimer=null;
const $=id=>document.getElementById(id);
const fmt=(n,d=1)=>Number(Number(n||0).toFixed(d)).toLocaleString("ru-RU",{maximumFractionDigits:d});
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");};
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch(_){return fallback;}}
function norm(v){return String(v||"").toLowerCase().replace(/ё/g,"е").replace(/[^а-яa-z0-9]+/gi," ").trim();}
function findProduct(value){const q=norm(value);if(!q||!window.products)return null;const external=[...externalProducts.values()].find(p=>norm(p.name)===q||norm(p.id)===q);if(external)return{id:external.id,product:external};const all=Object.entries(window.products);
for(const [id,p] of all)if(norm(id)===q||norm(p.name)===q)return{id,product:p};
for(const [id,p] of all)if((p.aliases||[]).some(a=>norm(a)===q))return{id,product:p};
if(q.length<4||/(?:^|\s)(?:с|и|плюс)(?:\s|$)/.test(q))return null;
const matches=new Map();
for(const [id,p] of all){const names=[id,p.name,...(p.aliases||[])].map(norm).filter(n=>n.length>=4);if(names.some(n=>q.includes(n)))matches.set(id,{id,product:p});}
return matches.size===1?[...matches.values()][0]:null;}
function isOilProduct(p){return p?.category==="oil"||/масл|oil/i.test(String(p?.name||""));}
function calc(p,grams,state){const normalized=["boiled","fried"].includes(state)?state:"raw";const engine=window.recipeProNutritionEngine;if(engine&&typeof engine.calculateIngredient==="function"){const result=engine.calculateIngredient({product:p,amount:grams,state:normalized,oilPer100:normalized==="fried"&&!isOilProduct(p)?5:0});return{calories:result.calories,protein:result.protein,fat:result.fat,carbs:result.carbs};}const raw=p.raw||{},ratio=Number(p.cookedWeightRatio);let basis=Number(grams);if(normalized!=="raw"&&Number.isFinite(ratio)&&ratio>0)basis/=ratio;const f=basis/100,oil=normalized==="fried"&&!isOilProduct(p)?Number(grams)*0.05:0,oilProduct=window.products?.["масло"]?.raw;return{calories:Number(raw.kcal||0)*f+(oilProduct?Number(oilProduct.kcal||0)*oil/100:oil*8.99),protein:Number(raw.protein||0)*f+(oilProduct?Number(oilProduct.protein||0)*oil/100:0),fat:Number(raw.fat||0)*f+(oilProduct?Number(oilProduct.fat||0)*oil/100:oil*0.999),carbs:Number(raw.carbs||0)*f};}
function defaultMealForHour(hour){if(hour>=5&&hour<11)return'Завтрак';if(hour>=11&&hour<16)return'Обед';if(hour>=16&&hour<22)return'Ужин';return'Перекус';}
function goals(){return read(GOALS,{calories:2500,protein:140,fat:80,carbs:150});}
function productMatches(value){
const q=norm(value);if(!q||!window.products)return[];
const all=Object.entries(window.products).map(([id,product])=>({id,product}));
const exact=all.filter(({id,product})=>norm(id)===q||norm(product.name)===q||(product.aliases||[]).some(a=>norm(a)===q));
if(exact.length)return exact.slice(0,6);
if(q.length<2)return[];
const starts=all.filter(({id,product})=>[product.name,id,...(product.aliases||[])].some(n=>norm(n).startsWith(q)));
const includes=all.filter(({id,product})=>[product.name,id,...(product.aliases||[])].some(n=>norm(n).includes(q)));
return [...starts,...includes.filter(x=>!starts.some(y=>y.id===x.id))].slice(0,6);
}
function renderProductSuggestions(){
const input=$("rpFoodProduct"),host=$("rpProductSuggestions");if(!input||!host)return;
if(searchTimer)clearTimeout(searchTimer);
const request=++searchRequest;
const q=input.value.trim();if(!q){host.hidden=true;host.innerHTML="";return;}
const matches=productMatches(q);
host.innerHTML=matches.map(({id,product})=>'<button type="button" class="rp-product-suggestion" role="option" data-product-id="'+escapeHtml(id)+'"><span>'+escapeHtml(product.name)+'</span><small>'+fmt(product.raw?.kcal||0,0)+' ккал · '+fmt(product.raw?.protein||0)+' г белка / 100 г · RecipePro</small></button>').join("");
host.hidden=!matches.length;
if(q.length>=3&&!/^\d{8,14}$/.test(q))searchTimer=setTimeout(()=>searchOpenFoodFacts(q,request),450);
else if(/^\d{8,14}$/.test(q))searchTimer=setTimeout(()=>searchOpenFoodFacts(q,request),250);
}
function offProductToRecord(item){
const n=item?.nutriments||{};
const kcalValue=n["energy-kcal_100g"],kjValue=n["energy-kj_100g"];
const kcal=kcalValue!==undefined&&kcalValue!==null&&kcalValue!==""?Number(kcalValue):kjValue!==undefined&&kjValue!==null&&kjValue!==""?Number(kjValue)/4.184:NaN;
const protein=Number(n.proteins_100g),fat=Number(n.fat_100g),carbs=Number(n.carbohydrates_100g);
if(!item||!item.code||!item.product_name||![kcal,protein,fat,carbs].every(v=>Number.isFinite(v)&&v>=0)||kcal>1000||protein>100||fat>100||carbs>100)return null;
const brand=String(item.brands||"").split(",")[0].trim();
const name=String(item.product_name).trim()+(brand?" · "+brand:"");
return{id:"off:"+String(item.code),name,brand,barcode:String(item.code),raw:{kcal,protein,fat,carbs},cookedWeightRatio:1,category:"packaged",nutritionSource:"Open Food Facts",sourceUrl:"https://world.openfoodfacts.org/product/"+encodeURIComponent(String(item.code))};
}
function mergeExternalResults(products,request){
if(request!==searchRequest)return;
const host=$("rpProductSuggestions"),input=$("rpFoodProduct");if(!host||!input||!input.value.trim())return;
const existing=new Set(productMatches(input.value).map(x=>x.id));
const remote=[];
for(const item of products||[]){const p=offProductToRecord(item);if(!p||existing.has(p.id))continue;externalProducts.set(p.id,p);remote.push(p);if(remote.length>=5)break;}
const local=productMatches(input.value).map(({id,product})=>'<button type="button" class="rp-product-suggestion" role="option" data-product-id="'+escapeHtml(id)+'"><span>'+escapeHtml(product.name)+'</span><small>'+fmt(product.raw?.kcal||0,0)+' ккал · '+fmt(product.raw?.protein||0)+' г белка / 100 г · RecipePro</small></button>').join("");
const external=remote.map(p=>'<button type="button" class="rp-product-suggestion rp-product-suggestion-external" role="option" data-product-id="'+escapeHtml(p.id)+'"><span>'+escapeHtml(p.name)+'</span><small>'+fmt(p.raw.kcal,0)+' ккал · Б '+fmt(p.raw.protein)+' · Ж '+fmt(p.raw.fat)+' · У '+fmt(p.raw.carbs)+' / 100 г</small><small>Open Food Facts · данные упаковки, если указаны</small></button>').join("");
if(local||external){host.innerHTML=local+external;host.hidden=false;}
if(!local&&!external){host.innerHTML='<div class="rp-product-search-note">В каталоге ничего не найдено. Попробуй название с упаковки или штрихкод.</div>';host.hidden=false;}
}
async function searchOpenFoodFacts(query,request){
const host=$("rpProductSuggestions");if(!host)return;
const isBarcode=/^\d{8,14}$/.test(query.replace(/\s/g,""));
const url=isBarcode
?"https://world.openfoodfacts.org/api/v2/product/"+encodeURIComponent(query.replace(/\s/g,""))+"?fields=code,product_name,brands,nutriments"
:"https://world.openfoodfacts.org/cgi/search.pl?search_terms="+encodeURIComponent(query)+"&search_simple=1&action=process&json=1&page_size=6&fields=code,product_name,brands,nutriments";
try{
const response=await fetch(url,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(6500)});
if(!response.ok)throw new Error("HTTP "+response.status);
const data=await response.json();
const products=isBarcode?(data.status===1&&data.product?[data.product]:[]):(Array.isArray(data.products)?data.products:[]);
mergeExternalResults(products,request);
}catch(_){
if(request!==searchRequest)return;
if(!productMatches(query).length){host.innerHTML='<div class="rp-product-search-note">Внешняя база сейчас недоступна. Можно выбрать продукт из каталога RecipePro.</div>';host.hidden=false;}
}
}
function recentProducts(){
const all=diary(),seen=new Set(),result=[];
Object.keys(all).sort().reverse().forEach(day=>{(all[day]||[]).slice().reverse().forEach(entry=>{if(entry.productId&&!seen.has(entry.productId)&&(window.products?.[entry.productId]||entry.productSnapshot)){seen.add(entry.productId);result.push({id:entry.productId,name:window.products?.[entry.productId]?.name||entry.productSnapshot?.name||entry.name,grams:entry.grams,state:entry.state,meal:entry.meal,productSnapshot:entry.productSnapshot});}});});
return result.slice(0,5);
}
function renderRecentProducts(){
const host=$("rpRecentProducts");if(!host)return;
const recent=recentProducts();
host.innerHTML=recent.map(item=>'<button type="button" class="rp-recent-product" data-recent-product="'+escapeHtml(item.id)+'" data-snapshot="'+(item.productSnapshot?escapeHtml(encodeURIComponent(JSON.stringify(item.productSnapshot))):"")+'" data-grams="'+Number(item.grams||100)+'" data-state="'+(["boiled","fried"].includes(item.state)?item.state:"raw")+'" data-meal="'+escapeHtml(item.meal||"Обед")+'">'+escapeHtml(item.name)+'<small>'+fmt(item.grams||100,0)+' г</small></button>').join("");
host.hidden=!recent.length;
}
function diary(){return read(STORE,{});}function date(){return $("rpDiaryDate").value||today();}function entries(){const d=diary();return Array.isArray(d[date()])?d[date()]:[];}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderLog(list){const host=$("rpFoodLog");if(!list.length){host.innerHTML='<p class="rp-diary-empty">Пока нет записей. Добавь первый продукт выше.</p>';return;}
host.innerHTML=["Завтрак","Обед","Ужин","Перекус"].map(meal=>{const group=list.filter(e=>e.meal===meal);if(!group.length)return"";return '<div class="rp-food-meal-group"><h4>'+meal+'</h4>'+group.map(e=>'<article class="rp-food-log-row"><div class="rp-food-log-name"><strong>'+escapeHtml(e.name)+'</strong><span>'+fmt(e.grams,0)+' г · '+(e.state==="boiled"?"варёный / приготовленный вес":e.state==="fried"?"жареный вес · учтено ~5 г масла на 100 г":"сырой / сухой вес")+'</span></div><div class="rp-food-log-kcal"><strong>'+fmt(e.calories,0)+'</strong><span>ккал</span></div><div class="rp-food-log-macros"><span>Б '+fmt(e.protein)+'</span><span>Ж '+fmt(e.fat)+'</span><span>У '+fmt(e.carbs)+'</span></div><button type="button" class="rp-food-delete" data-delete-entry="'+escapeHtml(e.id)+'" aria-label="Удалить '+escapeHtml(e.name)+'">×</button></article>').join("")+'</div>';}).join("");}
function render(){const g=goals()||{},list=entries(),total=list.reduce((t,e)=>{["calories","protein","fat","carbs"].forEach(k=>t[k]+=Number(e[k]||0));return t;},{calories:0,protein:0,fat:0,carbs:0});
$("rpDiaryCalories").textContent=fmt(total.calories,0);$("rpDiaryProtein").textContent=fmt(total.protein)+" г";$("rpDiaryFat").textContent=fmt(total.fat)+" г";$("rpDiaryCarbs").textContent=fmt(total.carbs)+" г";
$("rpDiaryDayLabel").textContent=date()===today()?"Сегодня":new Date(date()+"T12:00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long"});
const cg=Number(g.calories||0),pct=cg?Math.round(total.calories/cg*100):0;$("rpDiaryCaloriePercent").textContent=Math.min(pct,999)+"%";$("rpDiaryCalorieRing").style.setProperty("--rp-progress",Math.min(pct,100)+"%");
$("rpDiaryCaloriesRemaining").textContent=cg?(total.calories>cg?"Превышение на "+fmt(total.calories-cg,0)+" ккал":total.calories===cg?"Дневная цель достигнута":"Осталось "+fmt(cg-total.calories,0)+" ккал"):"Сначала укажи дневную норму";
[["Protein","protein"],["Fat","fat"],["Carbs","carbs"]].forEach(([label,key])=>{const target=Number(g[key]||0),value=total[key];$("rpDiary"+label+"Bar").style.width=target?Math.min(100,value/target*100)+"%":"0%";$("rpDiary"+label+"Remaining").textContent=target?(value>target?"Превышение на "+fmt(value-target,1)+" г":value===target?"Дневная цель достигнута":"Осталось "+fmt(target-value,1)+" г"):"Норма не задана";});
const warnings=[];[["Калории","calories","ккал",0],["Белки","protein","г",1],["Жиры","fat","г",1],["Углеводы","carbs","г",1]].forEach(([name,key,unit,digits])=>{const target=Number(g[key]||0),value=Number(total[key]||0);if(target>0&&value>target)warnings.push(name+": +"+fmt(value-target,digits)+" "+unit);});
const warningHost=$("rpDiaryGoalWarnings");if(warningHost){warningHost.hidden=!warnings.length;warningHost.classList.toggle("has-overage",warnings.length>0);warningHost.textContent=warnings.length?"Дневная цель превышена: "+warnings.join(" · "):"";}
if(g.calories!==undefined){$("rpGoalCalories").value=g.calories;$("rpGoalProtein").value=g.protein;$("rpGoalFat").value=g.fat;$("rpGoalCarbs").value=g.carbs;}renderLog(list);renderRecentProducts();}
function save(list){const d=diary();d[date()]=list;try{localStorage.setItem(STORE,JSON.stringify(d));render();document.dispatchEvent(new CustomEvent("recipepro:diary-updated"));}catch(_){$("rpFoodStatus").textContent="Не удалось сохранить данные. Возможно, память браузера заполнена.";}}
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
const cooked=["fried","жареный","жареное","жареная","pan-fried"].includes(state)?"fried":["boiled","cooked","приготовленный","готовый","варёный","вареный"].includes(state)?"boiled":"raw";
const values=calc(found.product,grams,cooked);
const id=window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);
list.push({id,productId:found.id,name:found.product.name,grams,state:cooked,meal,...values,createdAt:new Date().toISOString(),sourceRecipe:String(detail.title||"Блюдо из сообщества")});
added++;
});
if(added){save(list);$("rpFoodStatus").textContent="Добавлено в дневник ингредиентов: "+added+". Проверь запись и при необходимости скорректируй вес."+(skipped?" Пропущено неподдерживаемых или неизвестных ингредиентов: "+skipped+".":"");}
else $("rpFoodStatus").textContent="Не удалось добавить ингредиенты: нужны известные продукты из каталога и количество в граммах."+(skipped?" Пропущено: "+skipped+".":"");
}
if (window.__RECIPEPRO_TEST__) window.recipeProFoodDiary = { findProduct, defaultMealForHour };
let scannerStream=null,scannerFrame=0,scannerActive=false,scannerDetector=null;
function stopScanner(){scannerActive=false;if(scannerFrame)cancelAnimationFrame(scannerFrame);scannerFrame=0;if(scannerStream){scannerStream.getTracks().forEach(track=>track.stop());scannerStream=null;}const video=$("rpScannerVideo");if(video){video.pause();video.srcObject=null;}}
function closeScanner(){stopScanner();const modal=$("rpBarcodeScanner");if(modal)modal.hidden=true;const open=$("rpOpenScanner");if(open)open.focus();}
async function scanFrame(){if(!scannerActive||!scannerDetector)return;const video=$("rpScannerVideo");if(video&&video.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA){try{const codes=await scannerDetector.detect(video);const hit=codes.find(item=>/^\d{8,14}$/.test(String(item.rawValue||"").replace(/\s/g,"")));if(hit){const barcode=String(hit.rawValue).replace(/\s/g,"");stopScanner();$("rpBarcodeScanner").hidden=true;$("rpFoodProduct").value=barcode;$("rpFoodProduct").dispatchEvent(new Event("input",{bubbles:true}));$("rpFoodStatus").textContent="Штрихкод считан: "+barcode+". Ищем продукт в базе Open Food Facts.";return;}}catch(_){}}
if(scannerActive)scannerFrame=requestAnimationFrame(scanFrame);}
async function openScanner(){const modal=$("rpBarcodeScanner"),status=$("rpScannerStatus");if(!modal||!status)return;modal.hidden=false;status.textContent="Запрашиваем доступ к камере…";if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){status.textContent="Камера недоступна в этом контексте. Введи цифры штрихкода вручную.";return;}if(!("BarcodeDetector" in window)){status.textContent="Этот браузер пока не поддерживает чтение штрихкодов камерой. Введи цифры вручную — поиск по базе уже работает.";return;}try{scannerDetector=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128","itf"]});scannerStream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}}});const video=$("rpScannerVideo");video.srcObject=scannerStream;await video.play();status.textContent="Держи упаковку ровно: помести штрихкод в рамку.";scannerActive=true;scannerFrame=requestAnimationFrame(scanFrame);}catch(error){stopScanner();status.textContent=error?.name==="NotAllowedError"?"Нет доступа к камере. Разреши камеру для сайта или введи штрихкод вручную.":"Не удалось запустить камеру. Проверь разрешение на камеру или введи штрихкод вручную.";}}
function init(){if(!$("rpFoodForm")||!window.products)return;$("rpDiaryDate").value=today();$("rpFoodMeal").value=defaultMealForHour(new Date().getHours());window.addEventListener("recipepro:import-ingredients",importRecipeIngredients);document.addEventListener("recipepro:diary-updated",render);
const options=$("rpFoodProductList");Object.values(window.products).forEach(p=>{[p.name,...(p.aliases||[]).slice(0,3)].forEach(name=>{const o=document.createElement("option");o.value=name;options.appendChild(o);});});
const productInput=$("rpFoodProduct"),suggestions=$("rpProductSuggestions");
$("rpOpenScanner").addEventListener("click",openScanner);$("rpCloseScanner").addEventListener("click",closeScanner);$("rpScannerManual").addEventListener("click",()=>{closeScanner();$("rpFoodProduct").focus();$("rpFoodStatus").textContent="Введи цифры штрихкода в поле продукта. Поиск выполнится автоматически.";});$("rpBarcodeScanner").addEventListener("click",e=>{if(e.target.hasAttribute("data-close-scanner"))closeScanner();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("rpBarcodeScanner").hidden)closeScanner();});
productInput.addEventListener("input",()=>{selectedExternalProduct=null;renderProductSuggestions();});
productInput.addEventListener("focus",renderProductSuggestions);
document.querySelectorAll("[data-grams-shortcut]").forEach(button=>button.addEventListener("click",()=>{$("rpFoodGrams").value=button.dataset.gramsShortcut;document.querySelectorAll("[data-grams-shortcut]").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));$("rpFoodGrams").dispatchEvent(new Event("change",{bubbles:true}));}));
productInput.addEventListener("keydown",e=>{if(e.key==="Escape"){suggestions.hidden=true;return;}if(e.key==="Enter"&&!suggestions.hidden){const first=suggestions.querySelector("[data-product-id]");if(first){e.preventDefault();chooseProduct(first.dataset.productId);}}});
let selectedExternalProduct=null;function chooseProduct(id){const p=window.products[id]||externalProducts.get(id);if(!p)return;selectedExternalProduct=externalProducts.has(id)?p:null;productInput.value=p.name;suggestions.hidden=true;suggestions.innerHTML="";$("rpFoodGrams").focus();$("rpFoodStatus").textContent=selectedExternalProduct?"Выбран продукт из Open Food Facts. Проверь значения на упаковке и укажи вес.":"Выбран продукт из каталога RecipePro. Укажи вес и добавь запись."; }
suggestions.addEventListener("click",e=>{const b=e.target.closest("[data-product-id]");if(b)chooseProduct(b.dataset.productId);});
$("rpRecentProducts").addEventListener("click",e=>{const b=e.target.closest("[data-recent-product]");if(!b)return;if(b.dataset.recentProduct.startsWith("off:")&&b.dataset.snapshot){const p=JSON.parse(decodeURIComponent(b.dataset.snapshot));externalProducts.set(p.id,p);}chooseProduct(b.dataset.recentProduct);$("rpFoodGrams").value=b.dataset.grams||100;$("rpFoodState").value=b.dataset.state||"raw";$("rpFoodMeal").value=b.dataset.meal||"Обед";$("rpFoodGrams").focus();});
document.addEventListener("click",e=>{if(!e.target.closest(".rp-food-name"))suggestions.hidden=true;});
$("rpGoalsForm").addEventListener("submit",e=>{e.preventDefault();const g={calories:Number($("rpGoalCalories").value),protein:Number($("rpGoalProtein").value),fat:Number($("rpGoalFat").value),carbs:Number($("rpGoalCarbs").value)};if(Object.values(g).some(v=>!Number.isFinite(v)||v<0)||g.calories<=0){$("rpGoalsStatus").textContent="Калории должны быть больше нуля, остальные значения — не меньше нуля.";return;}localStorage.setItem(GOALS,JSON.stringify(g));$("rpGoalsStatus").textContent="Твоя норма сохранена на этом устройстве.";render();document.dispatchEvent(new CustomEvent("recipepro:diary-updated"));});
$("rpFoodForm").addEventListener("submit",e=>{e.preventDefault();const found=selectedExternalProduct&&norm(selectedExternalProduct.name)===norm($("rpFoodProduct").value)?{id:selectedExternalProduct.id,product:selectedExternalProduct}:findProduct($("rpFoodProduct").value),grams=Number($("rpFoodGrams").value);if(!found){$("rpFoodStatus").textContent="Не нашёл этот продукт в каталоге. Выбери название из подсказок — так расчёт не будет выдуманным.";return;}if(!Number.isFinite(grams)||grams<=0||grams>10000){$("rpFoodStatus").textContent="Укажи вес от 1 до 10 000 г.";return;}const state=$("rpFoodState").value,values=calc(found.product,grams,state),id=window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2);const list=entries();list.push({id,productId:found.id,name:found.product.name,grams,state,meal:$("rpFoodMeal").value,...values,...(found.id.startsWith("off:")?{productSnapshot:found.product,nutritionSource:"Open Food Facts"}:{}),createdAt:new Date().toISOString()});save(list);$("rpFoodProduct").value="";selectedExternalProduct=null;$("rpProductSuggestions").hidden=true;$("rpFoodGrams").value="100";document.querySelectorAll("[data-grams-shortcut]").forEach(item=>item.setAttribute("aria-pressed",String(item.dataset.gramsShortcut==="100")));$("rpFoodStatus").textContent="Добавлено: "+found.product.name+". Источник КБЖУ: "+(found.id.startsWith("off:")?"Open Food Facts — сверь с упаковкой.":"каталог RecipePro.");});
$("rpFoodLog").addEventListener("click",e=>{const b=e.target.closest("[data-delete-entry]");if(b)save(entries().filter(x=>String(x.id)!==b.dataset.deleteEntry));});
$("rpDiaryDate").addEventListener("change",render);$("rpClearDiaryBtn").addEventListener("click",()=>{if(entries().length&&confirm("Удалить все записи питания за выбранный день?"))save([]);});render();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();