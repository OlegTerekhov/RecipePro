"use strict";

(function () {
    const CONFIG = window.RECIPEPRO_SUPABASE_CONFIG || {};
    const STORAGE_KEYS = { recipes: "recipepro_user_recipes", favorites: "recipepro_favorites" };
    const TABLE = "recipepro_user_data";
    const OWNER_KEY = "recipepro_cloud_owner";
    const ACCOUNT_CACHE_PREFIX = "recipepro_account_cache_";
    const configured = Boolean(
        typeof CONFIG.url === "string" && CONFIG.url.startsWith("https://") &&
        typeof CONFIG.publishableKey === "string" && CONFIG.publishableKey.trim()
    );

    let client = null;
    let currentUser = null;
    let syncingUserId = null;
    let isApplyingCloudData = false;
    let saveTimer = null;
    let overlay = null;
    let statusNode = null;
    let cloudButton = null;
    const nativeSetItem = Storage.prototype.setItem;

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    }

    function setLocalSnapshot(recipes, favorites) {
        isApplyingCloudData = true;
        try {
            nativeSetItem.call(localStorage, STORAGE_KEYS.recipes, JSON.stringify(recipes));
            nativeSetItem.call(localStorage, STORAGE_KEYS.favorites, JSON.stringify(favorites));
        } finally {
            isApplyingCloudData = false;
        }
    }

    function mergeById(localItems, cloudItems) {
        const merged = new Map();
        [...cloudItems, ...localItems].forEach((item, index) => {
            const id = item && typeof item === "object" ? item.id : item;
            const key = id == null ? "__item_" + index + "_" + JSON.stringify(item) : String(id);
            merged.set(key, item);
        });
        return [...merged.values()];
    }

    function mergeSnapshot(cloudData) {
        const recipes = mergeById(readArray(STORAGE_KEYS.recipes), Array.isArray(cloudData?.recipes) ? cloudData.recipes : []);
        const favorites = mergeById(readArray(STORAGE_KEYS.favorites), Array.isArray(cloudData?.favorites) ? cloudData.favorites : []);
        setLocalSnapshot(recipes, favorites);
        return { recipes, favorites };
    }

    function prepareLocalForUser(user) {
        const previousOwner = localStorage.getItem(OWNER_KEY);
        if (previousOwner && previousOwner !== user.id) {
            const previousSnapshot = {
                recipes: readArray(STORAGE_KEYS.recipes),
                favorites: readArray(STORAGE_KEYS.favorites)
            };
            nativeSetItem.call(localStorage, ACCOUNT_CACHE_PREFIX + previousOwner, JSON.stringify(previousSnapshot));

            let nextSnapshot = { recipes: [], favorites: [] };
            try {
                const cached = JSON.parse(localStorage.getItem(ACCOUNT_CACHE_PREFIX + user.id) || "null");
                if (cached && typeof cached === "object") {
                    nextSnapshot = {
                        recipes: Array.isArray(cached.recipes) ? cached.recipes : [],
                        favorites: Array.isArray(cached.favorites) ? cached.favorites : []
                    };
                }
            } catch {
                nextSnapshot = { recipes: [], favorites: [] };
            }
            setLocalSnapshot(nextSnapshot.recipes, nextSnapshot.favorites);
        }
        nativeSetItem.call(localStorage, OWNER_KEY, user.id);
    }

    function setStatus(message, type) {
        if (statusNode) {
            statusNode.textContent = message;
            statusNode.dataset.state = type || "neutral";
        }
        if (cloudButton) {
            cloudButton.classList.toggle("recipepro-cloud-connected", type === "success");
            cloudButton.classList.toggle("recipepro-cloud-error", type === "error");
            cloudButton.setAttribute("aria-label", message);
            cloudButton.title = message;
        }
    }

    function ensureStyles() {
        if (document.getElementById("recipeProCloudStyles")) return;
        const style = document.createElement("style");
        style.id = "recipeProCloudStyles";
        style.textContent = [
            ".recipepro-cloud-button{position:relative;margin-right:10px}",
            ".recipepro-cloud-button:before{content:'';display:inline-block;width:7px;height:7px;margin-right:8px;border-radius:50%;background:#a4aaa5;vertical-align:middle}",
            ".recipepro-cloud-button.recipepro-cloud-connected:before{background:#3e9b71}",
            ".recipepro-cloud-button.recipepro-cloud-error:before{background:#c76a54}",
            ".recipepro-cloud-overlay{position:fixed;inset:0;z-index:1100;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(18,30,26,.48);backdrop-filter:blur(7px)}",
            ".recipepro-cloud-overlay.is-open{display:flex}",
            ".recipepro-cloud-dialog{position:relative;width:min(460px,100%);padding:30px;border:1px solid rgba(32,55,47,.1);border-radius:24px;background:#fffdf9;box-shadow:0 24px 80px rgba(0,0,0,.18);color:#20372f}",
            ".recipepro-cloud-close{position:absolute;right:16px;top:12px;border:0;background:transparent;color:#69756e;font-size:27px;cursor:pointer}",
            ".recipepro-cloud-kicker{font:700 10px/1.4 Inter,sans-serif;letter-spacing:.16em;color:#6e8379}",
            ".recipepro-cloud-dialog h2{margin:8px 32px 8px 0;font:600 28px/1.2 'Playfair Display',Georgia,serif}",
            ".recipepro-cloud-description{margin:0 0 20px;color:#68736d;font:13px/1.6 Inter,sans-serif}",
            ".recipepro-cloud-label{display:block;margin:0 0 7px;font:600 12px Inter,sans-serif}",
            ".recipepro-cloud-email{box-sizing:border-box;width:100%;height:46px;padding:0 13px;border:1px solid rgba(32,55,47,.18);border-radius:12px;background:#fff;color:#20372f;font:14px Inter,sans-serif}",
            ".recipepro-cloud-email:focus{outline:3px solid rgba(32,55,47,.08);border-color:#20372f}",
            ".recipepro-cloud-status{margin:14px 0;padding:11px 12px;border-radius:12px;background:#f4f1ea;color:#59675f;font:12px/1.55 Inter,sans-serif;overflow-wrap:anywhere}",
            ".recipepro-cloud-status[data-state='success']{background:#eaf4ee;color:#315846}",
            ".recipepro-cloud-status[data-state='error']{background:#fff0eb;color:#8b3d2b}",
            ".recipepro-cloud-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:14px}",
            ".recipepro-cloud-actions button{flex:1;min-height:43px;padding:10px 13px;border:1px solid rgba(32,55,47,.14);border-radius:12px;background:#fff;color:#20372f;font:600 12px Inter,sans-serif;cursor:pointer}",
            ".recipepro-cloud-actions .recipepro-cloud-primary{border-color:#20372f;background:#20372f;color:#fff}",
            ".recipepro-cloud-actions button:disabled{opacity:.55;cursor:wait}",
            ".recipepro-cloud-footnote{margin:17px 0 0;color:#7c857f;font:11px/1.55 Inter,sans-serif}",
            ".recipepro-cloud-config-help{padding:13px;border-radius:12px;background:#f4f1ea;color:#59675f;font:12px/1.6 Inter,sans-serif}",
            ".recipepro-cloud-config-help a{color:#20372f;font-weight:600}",
            "@media(max-width:560px){.recipepro-cloud-button{margin-right:0}.recipepro-cloud-dialog{padding:24px 20px}.recipepro-cloud-actions{flex-direction:column}}"
        ].join("");
        document.head.appendChild(style);
    }

    function createDialog() {
        if (overlay) return;
        ensureStyles();

        const header = document.querySelector(".header-inner");
        if (header && !document.getElementById("recipeProCloudButton")) {
            cloudButton = document.createElement("button");
            cloudButton.type = "button";
            cloudButton.id = "recipeProCloudButton";
            cloudButton.className = "header-action recipepro-cloud-button";
            cloudButton.textContent = "Облако";
            const myRecipesButton = document.getElementById("myRecipesBtn");
            header.insertBefore(cloudButton, myRecipesButton || null);
            cloudButton.addEventListener("click", openDialog);
        } else {
            cloudButton = document.getElementById("recipeProCloudButton");
        }

        overlay = document.createElement("div");
        overlay.className = "recipepro-cloud-overlay";
        overlay.id = "recipeProCloudOverlay";
        overlay.innerHTML = [
            '<div class="recipepro-cloud-dialog" role="dialog" aria-modal="true" aria-labelledby="recipeProCloudTitle">',
            '<button class="recipepro-cloud-close" type="button" aria-label="Закрыть">×</button>',
            '<div class="recipepro-cloud-kicker">RECIPEPRO / CLOUD</div>',
            '<h2 id="recipeProCloudTitle">Твои рецепты — с тобой</h2>',
            '<p class="recipepro-cloud-description">Сохраняй избранное и собственные рецепты в облаке, чтобы они были доступны после входа на другом устройстве.</p>',
            '<div id="recipeProCloudSetup"></div>',
            '<div id="recipeProCloudAccount">',
            '<label class="recipepro-cloud-label" for="recipeProCloudEmail">Электронная почта</label>',
            '<input class="recipepro-cloud-email" id="recipeProCloudEmail" type="email" autocomplete="email" placeholder="you@example.com">',
            '<div class="recipepro-cloud-status" id="recipeProCloudStatus" role="status" aria-live="polite">Проверяем подключение…</div>',
            '<div class="recipepro-cloud-actions">',
            '<button class="recipepro-cloud-primary" id="recipeProCloudSignIn" type="button">Получить ссылку для входа</button>',
            '<button id="recipeProCloudSignOut" type="button" hidden>Выйти</button>',
            '</div></div>',
            '<p class="recipepro-cloud-footnote">Вход выполняется по одноразовой ссылке на почту. Твои данные доступны только твоему аккаунту.</p>',
            '</div>'
        ].join("");
        document.body.appendChild(overlay);

        statusNode = document.getElementById("recipeProCloudStatus");
        overlay.querySelector(".recipepro-cloud-close").addEventListener("click", closeDialog);
        overlay.addEventListener("click", event => {
            if (event.target === overlay) closeDialog();
        });
        overlay.querySelector("#recipeProCloudSignIn").addEventListener("click", sendSignInLink);
        overlay.querySelector("#recipeProCloudSignOut").addEventListener("click", signOut);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeDialog();
        });

        if (!configured || !window.supabase?.createClient) {
            document.getElementById("recipeProCloudAccount").hidden = true;
            document.getElementById("recipeProCloudSetup").innerHTML =
                '<div class="recipepro-cloud-config-help">Облачное хранилище подготовлено, но ещё не подключено. Создай бесплатный проект в <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase</a>, выполни SQL из файла <code>supabase/schema.sql</code>, затем добавь URL проекта и publishable key в <code>JS/supabase-config.js</code>. Секретный service_role key сюда добавлять нельзя.</div>';
            setStatus("Облако ещё не настроено", "neutral");
            return;
        }

        document.getElementById("recipeProCloudSetup").hidden = true;
        client = window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
            auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
        });
        client.auth.onAuthStateChange((event, session) => {
            window.setTimeout(() => handleSession(session?.user || null), 0);
        });
        client.auth.getSession().then(({ data, error }) => {
            if (error) {
                setStatus("Не удалось проверить сессию: " + error.message, "error");
                return;
            }
            handleSession(data.session?.user || null);
        });
    }

    function openDialog() {
        createDialog();
        overlay.classList.add("is-open");
        if (!configured || !client) setStatus("Облако ещё не настроено", "neutral");
        else if (currentUser) setStatus("Вход выполнен: " + currentUser.email, "success");
        else setStatus("Введи почту — отправим ссылку для входа.", "neutral");
    }

    function closeDialog() {
        if (overlay) overlay.classList.remove("is-open");
    }

    async function sendSignInLink() {
        if (!client) return;
        const emailInput = document.getElementById("recipeProCloudEmail");
        const email = emailInput.value.trim();
        const button = document.getElementById("recipeProCloudSignIn");
        if (!email || !emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }
        button.disabled = true;
        setStatus("Отправляем ссылку для входа…", "neutral");
        try {
            const result = await client.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: window.location.href.split("#")[0] }
            });
            if (result.error) throw result.error;
            setStatus("Письмо отправлено. Открой ссылку из письма в браузере, где хочешь использовать RecipePro.", "success");
        } catch (error) {
            setStatus("Не удалось отправить письмо: " + (error?.message || "неизвестная ошибка"), "error");
        } finally {
            button.disabled = false;
        }
    }

    async function handleSession(user) {
        const previousId = currentUser?.id || null;
        currentUser = user;
        const signInButton = document.getElementById("recipeProCloudSignIn");
        const signOutButton = document.getElementById("recipeProCloudSignOut");
        const emailInput = document.getElementById("recipeProCloudEmail");
        if (signInButton) signInButton.hidden = Boolean(user);
        if (signOutButton) signOutButton.hidden = !user;
        if (emailInput && user?.email) emailInput.value = user.email;

        if (!user) {
            if (previousId) setStatus("Вы вышли. Локальные рецепты сохранены на этом устройстве.", "neutral");
            else setStatus("Введи почту — отправим ссылку для входа.", "neutral");
            return;
        }

        if (syncingUserId === user.id) return;
        syncingUserId = user.id;
        setStatus("Загружаем данные из облака…", "neutral");
        try {
            prepareLocalForUser(user);
            const result = await client.from(TABLE).select("recipes,favorites").eq("user_id", user.id).maybeSingle();
            if (result.error) throw result.error;
            const merged = mergeSnapshot(result.data || { recipes: [], favorites: [] });
            await uploadSnapshot(merged, user);
            setStatus("Синхронизация завершена. Аккаунт: " + (user.email || "подключён"), "success");
        } catch (error) {
            setStatus("Ошибка облачной синхронизации: " + (error?.message || "проверь таблицу и политики RLS"), "error");
        } finally {
            if (syncingUserId === user.id) syncingUserId = null;
        }
    }

    async function uploadSnapshot(snapshot, user = currentUser) {
        if (!client || !user || isApplyingCloudData) return;
        const result = await client.from(TABLE).upsert({
            user_id: user.id,
            recipes: snapshot.recipes,
            favorites: snapshot.favorites,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        if (result.error) throw result.error;
    }

    function scheduleSave() {
        if (!client || !currentUser || isApplyingCloudData) return;
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(async () => {
            try {
                await uploadSnapshot({
                    recipes: readArray(STORAGE_KEYS.recipes),
                    favorites: readArray(STORAGE_KEYS.favorites)
                });
                setStatus("Изменения сохранены в облаке.", "success");
            } catch (error) {
                setStatus("Не удалось сохранить в облако: " + (error?.message || "ошибка"), "error");
            }
        }, 700);
    }

    async function signOut() {
        if (!client) return;
        const button = document.getElementById("recipeProCloudSignOut");
        button.disabled = true;
        try {
            const result = await client.auth.signOut();
            if (result.error) throw result.error;
            setStatus("Вы вышли. Локальные рецепты сохранены на этом устройстве.", "neutral");
        } catch (error) {
            setStatus("Не удалось выйти: " + (error?.message || "ошибка"), "error");
        } finally {
            button.disabled = false;
        }
    }

    Storage.prototype.setItem = function (key, value) {
        nativeSetItem.call(this, key, value);
        if (this === window.localStorage && (key === STORAGE_KEYS.recipes || key === STORAGE_KEYS.favorites)) scheduleSave();
    };

    // Explicit save notification is a fallback for browser Storage differences.
    window.addEventListener("recipepro:data-changed", scheduleSave);

    function init() {
        createDialog();
        if (client) {
            client.auth.getSession().then(({ data }) => {
                if (data?.session?.user) handleSession(data.session.user);
            });
        }
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
