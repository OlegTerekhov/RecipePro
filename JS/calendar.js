(() => {
  "use strict";
  const STORE = "recipepro_food_diary_v1";
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
      location.hash="#dailyDiary";
    });
    document.addEventListener("recipepro:diary-updated",render);
    window.addEventListener("storage",event=>{if(event.key===STORE)render();});
    render();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();