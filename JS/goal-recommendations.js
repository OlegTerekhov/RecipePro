(function () {
"use strict";
const DIARY_KEY="recipepro_food_diary_v1", GOALS_KEY="recipepro_nutrition_goals_v1";
const $=id=>document.getElementById(id), num=v=>Number.isFinite(Number(v))?Number(v):0;
const fmt=(v,d=0)=>Number(num(v).toFixed(d)).toLocaleString("ru-RU",{maximumFractionDigits:d});
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");};
function read(k,f){try{return JSON.parse(localStorage.getItem(k))??f;}catch(_){return f;}}
function nutritionPerServing(recipe){
 const engine=window.recipeProNutritionEngine;if(!recipe||!Array.isArray(recipe.ingredients)||!engine?.calculateRecipe)return null;
 const normalized={...recipe,ingredients:recipe.ingredients.map(item=>{const product=window.products?.[item.product||item.productId];let amount=num(item.amount);if(String(item.unit||"").toLowerCase()==="шт"&&product?.pieceWeight)amount*=num(product.pieceWeight);return{...item,amount,state:item.state||"raw"};})};
 const result=engine.calculateRecipe(normalized);return result.unknownCount>0?null:result.perServing;
}
function remainingTargets(goals,consumed){const r={};["calories","protein","fat","carbs"].forEach(k=>{const target=num(goals?.[k]);r[k]=target>0?Math.max(0,target-num(consumed?.[k])):null;});return r;}
function scoreRecipe(recipe,remaining){
 const n=nutritionPerServing(recipe);if(!n)return null;let score=0,weightSum=0;
 if(remaining.calories!==null){const target=remaining.calories,ideal=Math.min(target,550),diff=n.calories-ideal;score+=100-Math.min(150,Math.abs(diff)/Math.max(220,ideal||220)*100)-(diff>0?Math.min(90,diff/Math.max(220,ideal||220)*95):0);weightSum++;}
 [["protein",1.2],["fat",.35],["carbs",.35]].forEach(([k,w])=>{if(remaining[k]===null)return;const target=remaining[k],ideal=Math.min(target,k==="protein"?35:25),diff=n[k]-ideal;score+=(100-Math.min(120,Math.abs(diff)/Math.max(8,ideal||8)*70)-(n[k]>target?Math.min(60,(n[k]-target)/Math.max(8,target||8)*40):0))*w;weightSum+=w;});
 if(!weightSum)return null;return{recipe,nutrition:n,score:score/weightSum,fitsCalories:remaining.calories===null||n.calories<=remaining.calories+20};
}
function rankRecipes(recipes,goals,consumed){const remaining=remainingTargets(goals,consumed);if(!Object.values(remaining).some(v=>v!==null))return{remaining,items:[],hasGoals:false};const items=(Array.isArray(recipes)?recipes:[]).map(r=>scoreRecipe(r,remaining)).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,3);return{remaining,items,hasGoals:true};}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function consumedFor(date){const diary=read(DIARY_KEY,{});return(Array.isArray(diary[date])?diary[date]:[]).reduce((s,e)=>{["calories","protein","fat","carbs"].forEach(k=>s[k]+=num(e[k]));return s;},{calories:0,protein:0,fat:0,carbs:0});}
function allRecipes(){const own=read("recipepro_user_recipes",[]);return[...(Array.isArray(window.recipes)?window.recipes:[]),...(Array.isArray(own)?own:[])];}
function render(){
 const host=$("rpGoalRecommendations");if(!host)return;const date=$("rpDiaryDate")?.value||today(),goals=read(GOALS_KEY,null),result=rankRecipes(allRecipes(),goals,consumedFor(date)),label=$("rpRecommendationContext");
 if(!result.hasGoals){if(label)label.textContent="Укажи дневную норму выше — подберём блюда под твой остаток.";host.innerHTML='<div class="rp-recommendation-empty"><span class="rp-recommendation-empty-icon">◎</span><div><strong>Сначала настроим цель</strong><p>После сохранения нормы здесь появятся идеи с учётом уже съеденного.</p></div><button type="button" data-recommendation-goals>Указать норму →</button></div>';return;}
 const rem=result.remaining,chips=[];if(rem.calories!==null)chips.push("Калории: "+fmt(rem.calories)+" ккал");if(rem.protein!==null)chips.push("Белки: "+fmt(rem.protein,1)+" г");if(rem.fat!==null)chips.push("Жиры: "+fmt(rem.fat,1)+" г");if(rem.carbs!==null)chips.push("Углеводы: "+fmt(rem.carbs,1)+" г");
 if(label)label.textContent="Остаток на выбранный день: "+chips.join(" · ");
 if(!result.items.length){host.innerHTML='<div class="rp-recommendation-empty"><span class="rp-recommendation-empty-icon">✦</span><div><strong>Пока не удалось подобрать блюдо</strong><p>Проверь каталог рецептов и заданные цели.</p></div></div>';return;}
 host.innerHTML=result.items.map((item,i)=>{const r=item.recipe,n=item.nutrition,fit=rem.calories===null?"Калорийность на порцию":item.fitsCalories?"В пределах остатка":"Выше остатка на "+fmt(Math.max(0,n.calories-rem.calories))+" ккал";return'<article class="rp-recommendation-card"><div class="rp-recommendation-card-top"><span class="rp-recommendation-rank">'+String(i+1).padStart(2,"0")+'</span><span class="rp-recommendation-emoji" aria-hidden="true">'+esc(r.emoji||"🍽️")+'</span><span class="rp-recommendation-time">◷ '+fmt(r.time||0)+' мин</span></div><div class="rp-recommendation-card-body"><h4>'+esc(r.title||"Блюдо")+'</h4><div class="rp-recommendation-calories"><strong>'+fmt(n.calories)+'</strong><span>ккал / порция</span></div><div class="rp-recommendation-macros"><span><b>Б</b> '+fmt(n.protein,1)+' г</span><span><b>Ж</b> '+fmt(n.fat,1)+' г</span><span><b>У</b> '+fmt(n.carbs,1)+' г</span></div><p class="rp-recommendation-fit '+(item.fitsCalories?"is-fit":"is-over")+'">'+esc(fit)+'</p><button type="button" class="rp-recommendation-open" data-recommendation-recipe="'+esc(r.id)+'">Посмотреть рецепт <span>→</span></button></div></article>';}).join("");
}
function init(){if(!$("rpGoalRecommendations"))return;render();$("rpDiaryDate")?.addEventListener("change",render);document.addEventListener("recipepro:diary-updated",render);document.addEventListener("recipepro:data-changed",render);window.addEventListener("storage",render);$("rpGoalsForm")?.addEventListener("submit",()=>setTimeout(render,0));document.addEventListener("click",event=>{const goalButton=event.target.closest("[data-recommendation-goals]");if(goalButton){$("rpGoalsForm")?.scrollIntoView({behavior:"smooth",block:"center"});$("rpGoalCalories")?.focus();return;}const button=event.target.closest("[data-recommendation-recipe]");if(!button)return;const id=button.dataset.recommendationRecipe;document.querySelector("#recipes")?.scrollIntoView({behavior:"smooth",block:"start"});const open=()=>document.querySelector('[data-open-recipe="'+CSS.escape(id)+'"]')?.click();setTimeout(open,250);setTimeout(open,800);});}
if(window.__RECIPEPRO_TEST__)window.recipeProGoalRecommendations={nutritionPerServing,remainingTargets,rankRecipes};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();