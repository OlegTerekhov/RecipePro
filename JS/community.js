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
  function renderFeed(rows) {
    const feed = $("rpCommunityFeed");
    if (!feed) return;
    if (!rows.length) {
      feed.innerHTML = '<div class="rp-community-empty">Пока нет опубликованных блюд. Стань первым автором сообщества.</div>';
      return;
    }
    feed.innerHTML = rows.map(row => {
      const profile = row.profile || {};
      const author = profile.display_name || (profile.username ? "@" + profile.username : "Автор RecipePro");
      const image = typeof row.image_path === "string" && /^https:\/\//i.test(row.image_path)
        ? '<img loading="lazy" src="' + esc(row.image_path) + '" alt="' + esc(row.title) + '">'
        : '<span aria-hidden="true">✦</span>';
      const avatar = typeof profile.avatar_path === "string" && /^https:\/\//i.test(profile.avatar_path)
        ? '<img src="' + esc(profile.avatar_path) + '" alt="">'
        : '<span class="rp-community-author-initial">' + esc((author.trim()[0] || "R").toLocaleUpperCase("ru-RU")) + '</span>';
      return '<article class="rp-community-card"><div class="rp-community-card-image">' + image + '</div>' +
        '<div class="rp-community-card-body"><div class="rp-community-author">' + avatar + '<span>' + esc(author) + '</span></div>' +
        '<h3>' + esc(row.title || "Авторское блюдо") + '</h3><p>' + esc(row.description || "Автор пока не добавил описание.") + '</p>' +
        macroMarkup(row.nutrition || {}) + ingredientSummary(row.ingredients) + '</div></article>';
    }).join("");
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
    const feed = $("rpCommunityFeed");
    if (feed) feed.innerHTML = '<div class="rp-community-empty">Загружаем блюда сообщества…</div>';
    if (!api()) {
      if (feed) feed.innerHTML = '<div class="rp-community-empty">Облачный модуль ещё загружается. Обнови страницу через несколько секунд.</div>';
      return;
    }
    try {
      const rows = await api().listFeed();
      renderFeed(rows);
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
    refreshRecipeSelect();
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