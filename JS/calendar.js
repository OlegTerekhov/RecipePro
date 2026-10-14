(() => {
  "use strict";
  const STORE = "recipepro_food_diary_v1";
  const GOALS = "recipepro_nutrition_goals_v1";
  const $ = id => document.getElementById(id);
  const todayKey = () => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
  };
  const parseKey = key => {
    const [y,m,d] = key.split("-").map(Number);
    return new Date(y, m-1, d, 12);
  };
  const keyOf = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  const readDiary = () => {
    try { const data = JSON.parse(localStorage.getItem(STORE) || "{}"); return data && typeof data === "object" ? data : {}; }
    catch { return {}; }
  };
  const fmt = (n, digits=0) => Number(Number(n||0).toFixed(digits)).toLocaleString("ru-RU",{maximumFractionDigits:digits});
  const readGoals = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(GOALS) || "{}");
      return { calories: 2500, protein: 140, fat: 80, carbs: 150, ...saved };
    } catch {
      return { calories: 2500, protein: 140, fat: 80, carbs: 150 };
    }
  };
  function renderGoalCheck(total) {
    const host = $("rpCalendarGoalCheck");
    if (!host) return;
    const goals = readGoals();
    const rows = [
      ["Калории", "calories", "ккал", 0],
      ["Белки", "protein", "г", 1],
      ["Жиры", "fat", "г", 1],
      ["Углеводы", "carbs", "г", 1]
    ];
    host.innerHTML = rows.map(([label, key, unit, digits]) => {
      const target = Number(goals[key] || 0);
      const value = Number(total[key] || 0);
      let status = "Норма не задана";
      let className = "is-unset";
      if (target > 0) {
        if (value > target) {
          status = "Перебор " + fmt(value - target, digits) + " " + unit;
          className = "is-over";
        } else if (value === target) {
          status = "Цель достигнута";
          className = "is-met";
        } else {
          status = "Осталось " + fmt(target - value, digits) + " " + unit;
          className = "is-under";
        }
      }
      return '<div class="rp-calendar-goal-row ' + className + '"><span>' + label + '</span><strong>' + status + '</strong></div>';
    }).join("");
  }
  const monthLabel = d => new Intl.DateTimeFormat("ru-RU",{month:"long",year:"numeric"}).format(d);
  const dayLabel = d => new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"long",year:"numeric"}).format(d);
  let month = new Date(new Date().getFullYear(),new Date().getMonth(),1,12);
  let selected = todayKey();
  function totals(key, diary) {
    const rows = Array.isArray(diary[key]) ? diary[key] : [];
    return {
      rows,
      calories: rows.reduce((sum,e)=>sum+Number(e.calories||0),0),
      protein: rows.reduce((sum,e)=>sum+Number(e.protein||0),0),
      fat: rows.reduce((sum,e)=>sum+Number(e.fat||0),0),
      carbs: rows.reduce((sum,e)=>sum+Number(e.carbs||0),0)
    };
  }
  function renderDetail(diary) {
    const total = totals(selected,diary);
    $("rpCalendarSelectedDate").textContent = dayLabel(parseKey(selected));
    $("rpCalendarCalories").textContent = fmt(total.calories);
    $("rpCalendarProtein").textContent = fmt(total.protein)+" г";
    $("rpCalendarFat").textContent = fmt(total.fat)+" г";
    $("rpCalendarCarbs").textContent = fmt(total.carbs)+" г";
    renderGoalCheck(total);
    const names = total.rows.map(e => String(e.name||"Продукт")+" — "+fmt(e.grams,0)+" г").slice(0,8);
    $("rpCalendarEntries").textContent = names.length ? names.join(" · ")+(total.rows.length>8?" · и ещё "+(total.rows.length-8):"") : "В этот день пока нет записей.";
  }
  function render() {
    if (!$("rpCalendarDays")) return;
    const diary = readDiary();
    $("rpCalendarMonth").textContent = monthLabel(month);
    const first = new Date(month.getFullYear(),month.getMonth(),1,12);
    const startOffset = (first.getDay()+6)%7;
    const start = new Date(first);
    start.setDate(first.getDate()-startOffset);
    const today = todayKey();
    const cells = [];
    for (let i=0;i<42;i++) {
      const day = new Date(start);
      day.setDate(start.getDate()+i);
      const key = keyOf(day), inMonth = day.getMonth()===month.getMonth();
      const hasEntries = Array.isArray(diary[key]) && diary[key].length>0;
      const classes = ["rp-calendar-day",inMonth?"":"is-outside",key===selected?"is-selected":"",key===today?"is-today":"",hasEntries?"has-entries":""].filter(Boolean).join(" ");
      cells.push('<button type="button" class="'+classes+'" data-calendar-date="'+key+'" aria-pressed="'+(key===selected)+'" aria-label="'+dayLabel(day)+(hasEntries?", есть записи":"")+'"><span>'+day.getDate()+'</span><i class="rp-calendar-dot" aria-hidden="true"></i></button>');
    }
    $("rpCalendarDays").innerHTML = cells.join("");
    renderDetail(diary);
  }
  function init() {
    if (!$("rpCalendarDays")) return;
    $("rpCalendarPrev").addEventListener("click",()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1,12);render();});
    $("rpCalendarNext").addEventListener("click",()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1,12);render();});
    $("rpCalendarDays").addEventListener("click",event=>{
      const button=event.target.closest("[data-calendar-date]");
      if(!button)return;
      selected=button.dataset.calendarDate;
      const date=parseKey(selected);
      month=new Date(date.getFullYear(),date.getMonth(),1,12);
      render();
    });
    $("rpCalendarOpenDiary").addEventListener("click",()=>{
      const dateInput=$("rpDiaryDate");
      if(dateInput){dateInput.value=selected;dateInput.dispatchEvent(new Event("change",{bubbles:true}));}
      location.hash="#home";
    });
    document.addEventListener("recipepro:diary-updated",render);
    window.addEventListener("storage",event=>{if(event.key===STORE)render();});
    render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();