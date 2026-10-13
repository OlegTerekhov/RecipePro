"use strict";
(function () {
  const $ = id => document.getElementById(id);
  const LOCAL_RECIPES_KEY = "recipepro_user_recipes";
  const PUBLISHED_KEY = "recipepro_published_recipe_ids";
  const api = () => window.recipeProCloudAPI;
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  function readRecipes() {
    try {
      const data = JSON.parse(localStorage.getItem(LOCAL_RECIPES_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (_) { return []; }
  }
  function readPublished() {
    try { const value = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || "[]"); return Array.isArray(value) ? value : []; }
    catch (_) { return []; }
  }
  function status(message, error) {
    const node = $("rpCommunityStatus");
    if (!node) return;
    node.textContent = message;
    node.style.color = error ? "#9a4d3a" : "";
  }
  function refreshRecipeSelect() {
    const select = $("rpCommunityRecipeSelect");
    if (!select) return;
    const previous = select.value;
    const recipes = readRecipes();
    select.innerHTML = recipes.length
      ? '<option value="">Выбери своё блюдо…</option>' + recipes.map(recipe =>
          '<option value="' + esc(recipe.id) + '">' + esc(recipe.title || "Без названия") + '</option>'
        ).join("")
      : '<option value="">Сначала создай своё блюдо</option>';
    if (recipes.some(recipe => String(recipe.id) === previous)) select.value = previous;
  }
  function valueOf(object, keys) {
    for (const key of keys) {
      const value = object && object[key];
      if (value !== undefined && value !== null && value !== "" && Number.isFinite(Number(value))) return Number(value);
    }
    return 0;
  }
  function macroMarkup(nutrition) {
    const kcal = valueOf(nutrition, ["calories", "kcal", "energy", "caloriesPerServing"]);
    const protein = valueOf(nutrition, ["protein", "proteins"]);
    const fat = valueOf(nutrition, ["fat", "fats"]);
    const carbs = valueOf(nutrition, ["carbs", "carbohydrates"]);
    return '<div class="rp-community-macros">' +
      '<span><strong>' + Math.round(kcal) + '</strong>ккал</span>' +
      '<span><strong>' + Math.round(protein) + ' г</strong>белки</span>' +
      '<span><strong>' + Math.round(fat) + ' г</strong>жиры</span>' +
      '<span><strong>' + Math.round(carbs) + ' г</strong>углеводы</span></div>';
  }
  function ingredientSummary(ingredients) {
    if (!Array.isArray(ingredients) || !ingredients.length) return "";
    const names = ingredients.slice(0, 5).map(item => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      const productId = item.product || item.productId || "";
      const product = window.products && productId ? window.products[productId] : null;
      const name = item.name || item.title || item.productName || (product && product.name) || productId;
      const amount = item.amount ?? item.grams ?? item.quantity ?? "";
      const unit = item.unit || "г";
      return name ? String(name) + (amount !== "" ? " — " + amount + " " + unit : "") : "";
    }).filter(Boolean);
    if (!names.length) return "";
    return '<div class="rp-community-ingredients"><strong>Ингредиенты</strong><br>' + names.map(esc).join(" · ") + '</div>';
  }
  const SAVED_COMMUNITY_KEY = "recipepro_saved_community_v1";
  let currentFeedRows = [];
  function readSavedCommunity() {
    try { const rows = JSON.parse(localStorage.getItem(SAVED_COMMUNITY_KEY) || "[]"); return Array.isArray(rows) ? rows : []; }
    catch (_) { return []; }
  }
  function saveSavedCommunity(rows) { localStorage.setItem(SAVED_COMMUNITY_KEY, JSON.stringify(rows)); }
  function ensureCommunityExtras() {
    const root = $("rpCommunity");
    if (!root) return;
    if (!$("rpCommunitySaved")) {
      const section = document.createElement("section");
      section.className = "rp-community-saved-section";
      section.innerHTML = '<div class="rp-community-subhead"><div><span class="rp-community-eyebrow">ТВОЯ КОЛЛЕКЦИЯ</span><h3>Сохранённые блюда</h3><p>Блюда других авторов, которые ты хочешь приготовить позже.</p></div></div><div id="rpCommunitySaved" class="rp-community-feed"></div>';
      const feed = $("rpCommunityFeed");
      if (feed) feed.insertAdjacentElement("afterend", section); else root.appendChild(section);
    }
    if (!$("rpCommunityDialog")) {
      const dialog = document.createElement("div");
      dialog.className = "rp-community-dialog";
      dialog.id = "rpCommunityDialog";
      dialog.hidden = true;
      dialog.innerHTML = '<div class="rp-community-dialog-backdrop" data-community-close></div><section class="rp-community-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="rpCommunityDialogTitle"><button type="button" class="rp-community-dialog-close" data-community-close aria-label="Закрыть">×</button><div id="rpCommunityDialogContent"></div></section>';
      document.body.appendChild(dialog);
    }
  }
  function imageMarkup(url, title, className) {
    return typeof url === "string" && /^https:\/\//i.test(url)
      ? '<img loading="lazy" src="' + esc(url) + '" alt="' + esc(title || "Блюдо") + '">'
      : '<span aria-hidden="true">✦</span>';
  }
  function renderFeed(rows) {
    const feed = $("rpCommunityFeed");
    if (!feed) return;
    currentFeedRows = Array.isArray(rows) ? rows : [];
    if (!currentFeedRows.length) {
      feed.innerHTML = '<div class="rp-community-empty">Пока нет опубликованных блюд. Стань первым автором сообщества.</div>';
      return;
    }
    feed.innerHTML = currentFeedRows.map(row => {
      const profile = row.profile || {};
      const author = profile.display_name || (profile.username ? "@" + profile.username : "Автор RecipePro");
      const avatar = typeof profile.avatar_path === "string" && /^https:\/\//i.test(profile.avatar_path)
        ? '<img src="' + esc(profile.avatar_path) + '" alt="">'
        : '<span class="rp-community-author-initial">' + esc((author.trim()[0] || "R").toLocaleUpperCase("ru-RU")) + '</span>';
      const saved = readSavedCommunity().some(item => item.id === row.id);
      return '<article class="rp-community-card" data-community-card="' + esc(row.id) + '"><button class="rp-community-card-image rp-community-open" type="button" data-community-open="' + esc(row.id) + '" aria-label="Открыть блюдо">' + imageMarkup(row.image_path, row.title) + '</button>' +
        '<div class="rp-community-card-body"><button type="button" class="rp-community-author rp-community-author-button" data-community-author="' + esc(row.user_id) + '">' + avatar + '<span>' + esc(author) + '</span><span class="rp-community-author-arrow">↗</span></button>' +
        '<button type="button" class="rp-community-title-button" data-community-open="' + esc(row.id) + '"><h3>' + esc(row.title || "Авторское блюдо") + '</h3></button><p>' + esc(row.description || "Автор пока не добавил описание.") + '</p>' +
        macroMarkup(row.nutrition || {}) + ingredientSummary(row.ingredients) +
        '<div class="rp-community-card-actions"><button type="button" class="rp-community-primary" data-community-open="' + esc(row.id) + '">Подробнее</button><button type="button" class="rp-community-save" data-community-save="' + esc(row.id) + '">' + (saved ? "✓ В коллекции" : "＋ Сохранить") + '</button></div></div></article>';
    }).join("");
  }
  function renderSavedCommunity() {
    const node = $("rpCommunitySaved");
    if (!node) return;
    const rows = readSavedCommunity();
    if (!rows.length) {
      node.innerHTML = '<div class="rp-community-empty">Коллекция пока пуста. Сохраняй понравившиеся блюда из общей ленты.</div>';
      return;
    }
    node.innerHTML = rows.map(row => '<article class="rp-community-card rp-community-saved-card"><div class="rp-community-card-image">' + imageMarkup(row.image_path, row.title) + '</div><div class="rp-community-card-body"><div class="rp-community-author"><span class="rp-community-author-initial">' + esc((row.author || "R").trim()[0].toLocaleUpperCase("ru-RU")) + '</span><span>' + esc(row.author || "Автор RecipePro") + '</span></div><h3>' + esc(row.title || "Авторское блюдо") + '</h3>' + macroMarkup(row.nutrition || {}) + '<div class="rp-community-card-actions"><button type="button" class="rp-community-primary" data-community-saved-open="' + esc(row.id) + '">Подробнее</button><button type="button" class="rp-community-save" data-community-remove="' + esc(row.id) + '">Убрать</button></div></div></article>').join("");
  }
  function openCommunityDialog(html) {
    ensureCommunityExtras();
    const dialog = $("rpCommunityDialog");
    const content = $("rpCommunityDialogContent");
    if (!dialog || !content) return;
    content.innerHTML = html;
    dialog.hidden = false;
    document.body.classList.add("rp-community-dialog-open");
    const panel = dialog.querySelector(".rp-community-dialog-panel");
    if (panel) panel.scrollTop = 0;
  }
  function closeCommunityDialog() {
    const dialog = $("rpCommunityDialog");
    if (dialog) dialog.hidden = true;
    document.body.classList.remove("rp-community-dialog-open");
  }
  function openRecipeDetails(row, savedOnly) {
    if (!row) return;
    const profile = row.profile || {};
    const author = row.author || profile.display_name || (profile.username ? "@" + profile.username : "Автор RecipePro");
    const ingredients = Array.isArray(row.ingredients) ? row.ingredients : [];
    const fullIngredients = ingredients.length ? '<ul class="rp-community-detail-ingredients">' + ingredients.map(item => {
      if (typeof item === "string") return '<li>' + esc(item) + '</li>';
      if (!item || typeof item !== "object") return "";
      const productId = item.product || item.productId || "";
      const product = window.products && productId ? window.products[productId] : null;
      const name = item.name || item.title || item.productName || (product && product.name) || productId || "Ингредиент";
      const amount = item.amount ?? item.grams ?? item.quantity ?? "";
      const unit = item.unit || "г";
      return '<li><span>' + esc(name) + '</span><strong>' + (amount !== "" ? esc(amount) + " " + esc(unit) : "") + '</strong></li>';
    }).join("") + '</ul>' : '<p class="rp-community-empty">Автор не добавил список ингредиентов.</p>';
    openCommunityDialog('<div class="rp-community-detail"><div class="rp-community-detail-image">' + imageMarkup(row.image_path, row.title) + '</div><div class="rp-community-eyebrow">RECIPEPRO / СООБЩЕСТВО</div><h2 id="rpCommunityDialogTitle">' + esc(row.title || "Авторское блюдо") + '</h2><button type="button" class="rp-community-author rp-community-author-button" data-community-author="' + esc(row.user_id || "") + '">' + (profile.avatar_path && /^https:\/\//i.test(profile.avatar_path) ? '<img src="' + esc(profile.avatar_path) + '" alt="">' : '<span class="rp-community-author-initial">' + esc((author.trim()[0] || "R").toLocaleUpperCase("ru-RU")) + '</span>') + '<span>' + esc(author) + '</span><span class="rp-community-author-arrow">Профиль автора ↗</span></button><p class="rp-community-detail-description">' + esc(row.description || "Автор пока не добавил описание.") + '</p>' + macroMarkup(row.nutrition || {}) + '<h3>Ингредиенты</h3>' + fullIngredients + '<div class="rp-community-card-actions"><button type="button" class="rp-community-primary" data-community-import="' + esc(row.id) + '">Добавить 1 порцию в дневник</button><button type="button" class="rp-community-primary" data-community-save="' + esc(row.id) + '">' + (readSavedCommunity().some(item => item.id === row.id) ? "✓ В коллекции" : "＋ Сохранить в коллекцию") + '</button>' + (savedOnly ? '<button type="button" class="rp-community-save" data-community-remove="' + esc(row.id) + '">Убрать из коллекции</button>' : '') + '</div><p class="rp-community-disclaimer">Пищевая ценность зависит от точного состава, веса ингредиентов и способа приготовления.</p></div>');
  }
  function openAuthorProfile(userId) {
    const rows = currentFeedRows.filter(row => String(row.user_id) === String(userId));
    const profile = rows.find(row => row.profile)?.profile || {};
    const author = profile.display_name || (profile.username ? "@" + profile.username : "Автор RecipePro");
    const avatar = profile.avatar_path && /^https:\/\//i.test(profile.avatar_path) ? '<img src="' + esc(profile.avatar_path) + '" alt="">' : '<span class="rp-community-author-initial">' + esc((author.trim()[0] || "R").toLocaleUpperCase("ru-RU")) + '</span>';
    openCommunityDialog('<div class="rp-community-author-page"><div class="rp-community-author-hero">' + avatar + '<div><div class="rp-community-eyebrow">АВТОР RECIPEPRO</div><h2 id="rpCommunityDialogTitle">' + esc(author) + '</h2><p>' + esc(profile.bio || "Автор пока не добавил описание профиля.") + '</p></div></div><h3>Опубликованные блюда</h3><div class="rp-community-author-recipes">' + (rows.length ? rows.map(row => '<button type="button" class="rp-community-author-recipe" data-community-open="' + esc(row.id) + '"><span>' + esc(row.title || "Авторское блюдо") + '</span><span>Открыть ↗</span></button>').join("") : '<p class="rp-community-empty">У автора пока нет других блюд в загруженной ленте.</p>') + '</div></div>');
  }
  function handleCommunityClick(event) {
    const target = event.target.closest("[data-community-open], [data-community-save], [data-community-remove], [data-community-author], [data-community-saved-open], [data-community-close], [data-community-import]");
    if (!target) return;
    if (target.hasAttribute("data-community-close")) { closeCommunityDialog(); return; }
    const id = target.dataset.communityOpen || target.dataset.communitySave || target.dataset.communityRemove || target.dataset.communitySavedOpen || target.dataset.communityImport;
    if (target.hasAttribute("data-community-author")) { openAuthorProfile(target.dataset.communityAuthor); return; }
    if (target.hasAttribute("data-community-import")) {
      const row = currentFeedRows.find(item => String(item.id) === String(target.dataset.communityImport)) || readSavedCommunity().find(item => String(item.id) === String(target.dataset.communityImport));
      if (!row) return;
      const nutrition = row.nutrition || {};
      const servings = Math.max(1, Number(row.servings || nutrition.servings || 1));
      const ingredients = (Array.isArray(row.ingredients) ? row.ingredients : []).map(item => {
        if (typeof item === "string") return { name: item, amount: 0, unit: "" };
        return { ...item, amount: Number(item.amount ?? item.grams ?? item.quantity ?? 0) / servings };
      });
      window.dispatchEvent(new CustomEvent("recipepro:import-ingredients", { detail: { title: row.title || "Блюдо из сообщества", ingredients } }));
      closeCommunityDialog();
      status("Передали ингредиенты в дневник. Проверь продукты и вес перед сохранением.", false);
      const diary = $("rpFoodForm");
      if (diary) diary.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (target.hasAttribute("data-community-remove")) {
      saveSavedCommunity(readSavedCommunity().filter(row => String(row.id) !== String(target.dataset.communityRemove)));
      renderSavedCommunity(); renderFeed(currentFeedRows); status("Блюдо удалено из твоей коллекции.", false); return;
    }
    if (target.hasAttribute("data-community-save")) {
      const row = currentFeedRows.find(item => String(item.id) === String(target.dataset.communitySave)) || readSavedCommunity().find(item => String(item.id) === String(target.dataset.communitySave));
      if (!row) return;
      const profile = row.profile || {};
      const author = profile.display_name || (profile.username ? "@" + profile.username : row.author || "Автор RecipePro");
      const saved = readSavedCommunity();
      if (!saved.some(item => String(item.id) === String(row.id))) {
        saved.unshift({ ...row, author, profile: undefined });
        saveSavedCommunity(saved.slice(0, 100));
        status("«" + (row.title || "Блюдо") + "» добавлено в твою коллекцию.", false);
      } else status("Это блюдо уже есть в твоей коллекции.", false);
      renderSavedCommunity(); renderFeed(currentFeedRows);
      if (! $("rpCommunityDialog")?.hidden) openRecipeDetails(row, false);
      return;
    }
    if (id) {
      const row = currentFeedRows.find(item => String(item.id) === String(id)) || readSavedCommunity().find(item => String(item.id) === String(id));
      if (row) openRecipeDetails(row, !currentFeedRows.some(item => String(item.id) === String(id)));
    }
  }
  async function restoreCloudProfile() {
    try {
      const session = await api().getSession();
      if (!session.user) return;
      const local = JSON.parse(localStorage.getItem("recipepro_profile_v1") || "{}");
      if (local && (local.name || local.bio || local.photo)) return;
      const remote = await api().getOwnProfile();
      if (!remote) return;
      const restored = {
        name: remote.display_name || "",
        bio: remote.bio || "",
        photo: remote.avatar_path || "",
        isPublic: remote.is_public === true,
        updatedAt: remote.updated_at || new Date().toISOString()
      };
      localStorage.setItem("recipepro_profile_v1", JSON.stringify(restored));
      const name = $("rpProfileName");
      const bio = $("rpProfileBio");
      const title = $("rpProfileTitle");
      const preview = $("rpProfileBioPreview");
      const checkbox = $("rpProfilePublic");
      const avatar = $("rpProfileAvatar");
      if (name) name.value = restored.name;
      if (bio) bio.value = restored.bio;
      if (title) title.textContent = restored.name || "Твоя кулинарная история";
      if (preview) preview.textContent = restored.bio || "Сохраняй любимые блюда, записывай авторские рецепты и собирай собственную коллекцию.";
      if (checkbox) checkbox.checked = restored.isPublic;
      if (avatar) {
        avatar.innerHTML = "";
        if (restored.photo) {
          const img = document.createElement("img");
          img.src = restored.photo;
          img.alt = "Фото профиля";
          avatar.appendChild(img);
        } else avatar.textContent = (restored.name.trim()[0] || "R").toLocaleUpperCase("ru-RU");
      }
      const node = $("rpProfileStatus");
      if (node) node.textContent = "Профиль загружен из облака.";
    } catch (_) {
      // A visitor without an account can still use the local-first app.
    }
  }
  async function refreshFeed() {
    ensureCommunityExtras();
    const feed = $("rpCommunityFeed");
    if (feed) feed.innerHTML = '<div class="rp-community-empty">Загружаем блюда сообщества…</div>';
    if (!api()) {
      if (feed) feed.innerHTML = '<div class="rp-community-empty">Облачный модуль ещё загружается. Обнови страницу через несколько секунд.</div>';
      return;
    }
    try {
      const rows = await api().listFeed();
      renderFeed(rows);
      renderSavedCommunity();
      status("В ленте: " + rows.length + " опубликованных блюд.", false);
    } catch (error) {
      if (feed) feed.innerHTML = '<div class="rp-community-empty">Не удалось загрузить ленту. Проверь подключение к интернету и обнови страницу.</div>';
      status(error && error.message ? error.message : "Не удалось загрузить сообщество.", true);
    }
  }
  async function publishSelected() {
    const select = $("rpCommunityRecipeSelect");
    const button = $("rpCommunityPublish");
    const recipe = readRecipes().find(item => String(item.id) === String(select && select.value));
    if (!recipe) { status("Сначала выбери сохранённое блюдо.", true); return; }
    if (button) button.disabled = true;
    status("Публикуем блюдо…", false);
    try {
      await api().publishRecipe(recipe);
      const published = new Set(readPublished().map(String));
      published.add(String(recipe.id));
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify([...published]));
      status("«" + (recipe.title || "Блюдо") + "» опубликовано. Теперь оно доступно в общей ленте.", false);
      await refreshFeed();
    } catch (error) {
      status(error && error.message ? error.message : "Не удалось опубликовать блюдо.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }
  async function unpublishSelected() {
    const select = $("rpCommunityRecipeSelect");
    const button = $("rpCommunityUnpublish");
    const recipe = readRecipes().find(item => String(item.id) === String(select && select.value));
    if (!recipe) { status("Выбери блюдо, публикацию которого нужно снять.", true); return; }
    if (button) button.disabled = true;
    try {
      await api().unpublishRecipe(recipe.id);
      const published = new Set(readPublished().map(String));
      published.delete(String(recipe.id));
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify([...published]));
      status("Публикация «" + (recipe.title || "Блюдо") + "» снята.", false);
      await refreshFeed();
    } catch (error) {
      status(error && error.message ? error.message : "Не удалось снять публикацию.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }
  async function saveCloudProfile() {
    const button = $("rpProfileCloudSave");
    if (!api()) { status("Облачный модуль ещё загружается.", true); return; }
    if (button) button.disabled = true;
    try {
      const profile = JSON.parse(localStorage.getItem("recipepro_profile_v1") || "{}");
      await api().savePublicProfile(profile);
      const message = profile.isPublic
        ? "Профиль сохранён в облаке и открыт сообществу."
        : "Профиль сохранён в облаке как закрытый. Опубликованные блюда по-прежнему могут быть видны в общей ленте.";
      const node = $("rpProfileStatus");
      if (node) node.textContent = message;
    } catch (error) {
      const node = $("rpProfileStatus");
      if (node) node.textContent = error && error.message ? error.message : "Не удалось сохранить профиль в облако.";
    } finally {
      if (button) button.disabled = false;
    }
  }
  function init() {
    if (!$("rpCommunity")) return;
    ensureCommunityExtras();
    refreshRecipeSelect();
    renderSavedCommunity();
    $("rpCommunity").addEventListener("click", handleCommunityClick);
    $("rpCommunityDialog")?.addEventListener("click", handleCommunityClick);
    document.addEventListener("keydown", event => { if (event.key === "Escape") closeCommunityDialog(); });
    const grid = $("myRecipesGrid");
    if (grid) new MutationObserver(refreshRecipeSelect).observe(grid, { childList: true, subtree: true });
    $("rpCommunityRefresh")?.addEventListener("click", refreshFeed);
    $("rpCommunityPublish")?.addEventListener("click", publishSelected);
    $("rpCommunityUnpublish")?.addEventListener("click", unpublishSelected);
    $("rpProfileCloudSave")?.addEventListener("click", saveCloudProfile);
    refreshFeed();
    restoreCloudProfile();
    window.addEventListener("online", refreshFeed);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();