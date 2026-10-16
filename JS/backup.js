"use strict";

(() => {
  const KEYS = {
    recipes: "recipepro_user_recipes",
    favorites: "recipepro_favorites",
    plan: "recipepro_meal_plan",
    shopping: "recipepro_shopping_list",
    history: "recipepro_recipe_history",
    diary: "recipepro_food_diary_v1",
    goals: "recipepro_nutrition_goals_v1"
  };
  const MAX_BACKUP_BYTES = 5 * 1024 * 1024;
  const $ = (selector, root = document) => root.querySelector(selector);

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function mergeByIdentity(current, incoming) {
    const result = [...safeArray(current)];
    const positions = new Map();
    result.forEach((item, index) => {
      const id = item && typeof item === "object" ? item.id : item;
      if (id != null) positions.set(String(id), index);
    });
    for (const item of safeArray(incoming)) {
      const id = item && typeof item === "object" ? item.id : item;
      if (id == null) {
        if (!result.some(existing => JSON.stringify(existing) === JSON.stringify(item))) result.push(item);
        continue;
      }
      const key = String(id);
      if (positions.has(key)) result[positions.get(key)] = item;
      else {
        positions.set(key, result.length);
        result.push(item);
      }
    }
    return result;
  }

  function createBackup() {
    const data = {};
    for (const [name, key] of Object.entries(KEYS)) {
      const fallback = ["plan", "diary", "goals"].includes(name) ? {} : [];
      data[name] = readJson(key, fallback);
    }
    return {
      format: "RecipeProBackup",
      version: 1,
      createdAt: new Date().toISOString(),
      data
    };
  }

  function downloadBackup() {
    const backup = createBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = "nutrio-backup-" + date + ".json";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Резервная копия подготовлена: включены дневник питания и дневные цели. Храни файл в надёжном месте.");
  }

  function validateBackup(parsed) {
    if (!parsed || typeof parsed !== "object" || parsed.format !== "RecipeProBackup" || parsed.version !== 1 || !parsed.data || typeof parsed.data !== "object") {
      throw new Error("Это не резервная копия NUTRIO поддерживаемого формата.");
    }
    const d = parsed.data;
    if (!Array.isArray(d.recipes) || !Array.isArray(d.favorites) || !d.plan || typeof d.plan !== "object" || Array.isArray(d.plan) || !Array.isArray(d.shopping) || !Array.isArray(d.history)) {
      throw new Error("В резервной копии отсутствуют обязательные данные или их формат повреждён.");
    }
    if (d.recipes.length > 5000 || d.favorites.length > 10000 || d.shopping.length > 10000 || d.history.length > 1000 || Object.keys(d.plan).length > 1000) {
      throw new Error("В резервной копии слишком много элементов.");
    }
    if (d.diary === undefined) d.diary = {};
    if (!d.diary || typeof d.diary !== "object" || Array.isArray(d.diary) || Object.keys(d.diary).length > 5000) throw new Error("Дневник питания в резервной копии повреждён.");
    for (const [day, entries] of Object.entries(d.diary)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Array.isArray(entries) || entries.length > 1000) throw new Error("Обнаружен некорректный день в дневнике питания.");
      for (const entry of entries) {
        if (!entry || typeof entry !== "object" || !Number.isFinite(Number(entry.grams)) || Number(entry.grams) <= 0 || Number(entry.grams) > 10000) throw new Error("В дневнике есть запись с некорректным весом.");
      }
    }
    if (d.goals === undefined) d.goals = {};
    if (!d.goals || typeof d.goals !== "object" || Array.isArray(d.goals)) throw new Error("Цели питания в резервной копии повреждены.");
    for (const key of ["calories", "protein", "fat", "carbs"]) {
      if (d.goals[key] !== undefined && (!Number.isFinite(Number(d.goals[key])) || Number(d.goals[key]) < 0 || Number(d.goals[key]) > 100000)) throw new Error("В резервной копии обнаружена некорректная цель питания.");
    }
    for (const recipe of d.recipes) {
      if (!recipe || typeof recipe !== "object" || !recipe.id || typeof recipe.title !== "string" || recipe.title.length > 300) {
        throw new Error("В копии обнаружен некорректный пользовательский рецепт.");
      }
    }
    return d;
  }

  function mergePlan(current, incoming) {
    const result = current && typeof current === "object" && !Array.isArray(current) ? { ...current } : {};
    for (const [date, meals] of Object.entries(incoming)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !meals || typeof meals !== "object" || Array.isArray(meals)) continue;
      result[date] = { ...(result[date] || {}), ...meals };
    }
    return result;
  }

  function mergeDiary(current, incoming) {
    const result = current && typeof current === "object" && !Array.isArray(current) ? { ...current } : {};
    for (const [day, entries] of Object.entries(incoming || {})) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Array.isArray(entries)) continue;
      result[day] = mergeByIdentity(safeArray(result[day]), entries);
    }
    return result;
  }

  function importData(data) {
    const merged = {
      recipes: mergeByIdentity(readJson(KEYS.recipes, []), data.recipes),
      favorites: [...new Set([...safeArray(readJson(KEYS.favorites, [])), ...data.favorites].map(String))],
      plan: mergePlan(readJson(KEYS.plan, {}), data.plan),
      shopping: mergeByIdentity(readJson(KEYS.shopping, []), data.shopping),
      history: mergeByIdentity(readJson(KEYS.history, []), data.history),
      diary: mergeDiary(readJson(KEYS.diary, {}), data.diary),
      goals: { ...(readJson(KEYS.goals, {}) || {}), ...(data.goals || {}) }
    };

    // Validate and build every collection before writing any of them.
    for (const [name, key] of Object.entries(KEYS)) {
      localStorage.setItem(key, JSON.stringify(merged[name]));
    }
    window.dispatchEvent(new CustomEvent("recipepro:data-changed"));
    announce("Данные объединены с текущими. Перезагружаю приложение…");
    window.setTimeout(() => window.location.reload(), 500);
  }

  function chooseBackup() {
    const input = $("#recipeProBackupFile");
    if (input) {
      input.value = "";
      input.click();
    }
  }

  async function handleFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (file.size > MAX_BACKUP_BYTES) {
      announce("Файл слишком большой. Максимальный размер — 5 МБ.");
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      const data = validateBackup(parsed);
      const counts = [
        data.recipes.length + " рецептов",
        data.favorites.length + " избранных",
        Object.keys(data.plan).length + " дней плана",
        data.shopping.length + " покупок",
        Object.values(data.diary || {}).reduce((sum, day) => sum + day.length, 0) + " записей питания"
      ].join(", ");
      if (!window.confirm("Импортировать резервную копию (" + counts + ")?\n\nДанные будут объединены с текущими, а не заменят их.")) return;
      importData(data);
    } catch (error) {
      announce(error instanceof SyntaxError ? "Не удалось прочитать JSON-файл. Возможно, он повреждён." : (error.message || "Не удалось импортировать копию."));
    }
  }

  function announce(message) {
    let node = $("#recipeProBackupStatus");
    if (!node) {
      node = document.createElement("p");
      node.id = "recipeProBackupStatus";
      node.setAttribute("role", "status");
      node.style.cssText = "margin:10px 0 0;color:#315846;font-size:13px;line-height:1.5";
      const host = $(".my-recipes-header");
      if (host) host.insertAdjacentElement("afterend", node);
      else document.body.appendChild(node);
    }
    node.textContent = message;
  }

  function init() {
    const host = $(".my-recipes-header");
    if (!host || $("#recipeProBackupActions")) return;
    const actions = document.createElement("div");
    actions.id = "recipeProBackupActions";
    actions.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px";
    actions.innerHTML = '<button type="button" class="primary-button" id="recipeProExportBackup">Скачать резервную копию</button><button type="button" class="primary-button" id="recipeProImportBackup" style="background:#fff;color:#20372f;border:1px solid rgba(32,55,47,.2)">Импортировать копию</button><input type="file" id="recipeProBackupFile" accept=".json,application/json" hidden>';
    host.insertAdjacentElement("afterend", actions);
    $("#recipeProExportBackup").addEventListener("click", downloadBackup);
    $("#recipeProImportBackup").addEventListener("click", chooseBackup);
    $("#recipeProBackupFile").addEventListener("change", handleFile);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
