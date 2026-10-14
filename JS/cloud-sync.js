"use strict";

(function () {
    const CONFIG = window.RECIPEPRO_SUPABASE_CONFIG || {};
    const STORAGE_KEYS = { recipes: "recipepro_user_recipes", favorites: "recipepro_favorites", plan: "recipepro_meal_plan", shopping: "recipepro_shopping_list", history: "recipepro_recipe_history", diary: "recipepro_food_diary_v1", goals: "recipepro_nutrition_goals_v1" };
    const TABLE = "recipepro_user_data";
    const OWNER_KEY = "recipepro_cloud_owner";
    const ACCOUNT_CACHE_PREFIX = "recipepro_account_cache_";
    const configured = Boolean(
        typeof CONFIG.url === "string" && CONFIG.url.startsWith("https://") &&
        typeof CONFIG.publishableKey === "string" && CONFIG.publishableKey.trim()
    );

    let client = null;
    let clientInitPromise = null;
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

    function readObject(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "{}");
            return value && typeof value === "object" && !Array.isArray(value) ? value : {};
        } catch {
            return {};
        }
    }

    function setLocalSnapshot(recipes, favorites, plan = {}, shopping = [], history = [], diary = {}, goals = {}) {
        isApplyingCloudData = true;
        try {
            nativeSetItem.call(localStorage, STORAGE_KEYS.recipes, JSON.stringify(recipes));
            nativeSetItem.call(localStorage, STORAGE_KEYS.favorites, JSON.stringify(favorites));
            nativeSetItem.call(localStorage, STORAGE_KEYS.plan, JSON.stringify(plan));
            nativeSetItem.call(localStorage, STORAGE_KEYS.shopping, JSON.stringify(shopping));
            nativeSetItem.call(localStorage, STORAGE_KEYS.history, JSON.stringify(history));
            nativeSetItem.call(localStorage, STORAGE_KEYS.diary, JSON.stringify(diary));
            nativeSetItem.call(localStorage, STORAGE_KEYS.goals, JSON.stringify(goals));
        } finally {
            isApplyingCloudData = false;
        }
        document.dispatchEvent(new CustomEvent("recipepro:diary-updated"));
    }

    function itemKey(item, index) {
        const id = item && typeof item === "object" ? item.id : item;
        return id == null ? "__item_" + index + "_" + JSON.stringify(item) : String(id);
    }

    function toItemMap(items) {
        const map = new Map();
        (Array.isArray(items) ? items : []).forEach((item, index) => map.set(itemKey(item, index), item));
        return map;
    }

    function sameItem(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function mergeById(localItems, cloudItems) {
        const merged = new Map();
        [...(Array.isArray(cloudItems) ? cloudItems : []), ...(Array.isArray(localItems) ? localItems : [])]
            .forEach((item, index) => merged.set(itemKey(item, index), item));
        return [...merged.values()];
    }

    function mergeThreeWay(baseItems, localItems, cloudItems) {
        const base = toItemMap(baseItems);
        const local = toItemMap(localItems);
        const cloud = toItemMap(cloudItems);
        const keys = new Set([...base.keys(), ...local.keys(), ...cloud.keys()]);
        const merged = [];

        keys.forEach(key => {
            const inBase = base.has(key);
            const inLocal = local.has(key);
            const inCloud = cloud.has(key);

            if (inBase) {
                // A deletion on either side wins over a stale copy on the other side.
                if (!inLocal || !inCloud) return;

                const baseItem = base.get(key);
                const localItem = local.get(key);
                const cloudItem = cloud.get(key);
                const localChanged = !sameItem(localItem, baseItem);
                const cloudChanged = !sameItem(cloudItem, baseItem);

                // Keep a one-sided edit; if both sides changed, prefer the local edit.
                merged.push(localChanged ? localItem : cloudItem);
                return;
            }

            // Items created since the last successful sync are kept from either side.
            if (inLocal) merged.push(local.get(key));
            else if (inCloud) merged.push(cloud.get(key));
        });

        return merged;
    }

    function baselineKey(userId) {
        return "recipepro_last_synced_" + userId;
    }

    function readBaseline(userId) {
        try {
            const value = JSON.parse(localStorage.getItem(baselineKey(userId)) || "null");
            if (!value || typeof value !== "object") return null;
            if (!Array.isArray(value.recipes) || !Array.isArray(value.favorites)) return null;
            // Older baselines predate the meal planner. Bootstrap once to preserve both devices' data.
            if (!value.plan || typeof value.plan !== "object" || Array.isArray(value.plan) || !Array.isArray(value.shopping) || !Array.isArray(value.history)) return null;
            if (!value.diary || typeof value.diary !== "object" || Array.isArray(value.diary) || !value.goals || typeof value.goals !== "object" || Array.isArray(value.goals)) return null;
            return value;
        } catch {
            return null;
        }
    }

    function saveBaseline(snapshot, user) {
        if (!user) return;
        nativeSetItem.call(localStorage, baselineKey(user.id), JSON.stringify({
            recipes: snapshot.recipes,
            favorites: snapshot.favorites,
            plan: snapshot.plan,
            shopping: snapshot.shopping,
            history: snapshot.history,
            diary: snapshot.diary,
            goals: snapshot.goals
        }));
    }

    function mergePlanThreeWay(basePlan, localPlan, cloudPlan) {
        const base = basePlan && typeof basePlan === "object" ? basePlan : {};
        const local = localPlan && typeof localPlan === "object" ? localPlan : {};
        const cloud = cloudPlan && typeof cloudPlan === "object" ? cloudPlan : {};
        const result = {};
        const dates = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(cloud)]);

        dates.forEach(date => {
            const baseDay = base[date] && typeof base[date] === "object" ? base[date] : {};
            const localDay = local[date] && typeof local[date] === "object" ? local[date] : {};
            const cloudDay = cloud[date] && typeof cloud[date] === "object" ? cloud[date] : {};
            const meals = new Set([...Object.keys(baseDay), ...Object.keys(localDay), ...Object.keys(cloudDay)]);
            const mergedDay = {};

            meals.forEach(meal => {
                const inBase = Object.prototype.hasOwnProperty.call(baseDay, meal);
                const inLocal = Object.prototype.hasOwnProperty.call(localDay, meal);
                const inCloud = Object.prototype.hasOwnProperty.call(cloudDay, meal);
                if (inBase && (!inLocal || !inCloud)) return;

                if (!inBase) {
                    if (inLocal) mergedDay[meal] = localDay[meal];
                    else if (inCloud) mergedDay[meal] = cloudDay[meal];
                    return;
                }

                const localChanged = !sameItem(localDay[meal], baseDay[meal]);
                mergedDay[meal] = localChanged ? localDay[meal] : cloudDay[meal];
            });

            if (Object.keys(mergedDay).length) result[date] = mergedDay;
        });

        return result;
    }

    function mergeDiaryUnion(localDiary, cloudDiary) {
        const result = {};
        for (const source of [cloudDiary, localDiary]) {
            if (!source || typeof source !== "object" || Array.isArray(source)) continue;
            for (const [day, entries] of Object.entries(source)) {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !Array.isArray(entries)) continue;
                result[day] = mergeById(result[day] || [], entries);
            }
        }
        return result;
    }

    function mergeDiaryThreeWay(baseDiary, localDiary, cloudDiary) {
        const result = {};
        const dates = new Set([...Object.keys(baseDiary || {}), ...Object.keys(localDiary || {}), ...Object.keys(cloudDiary || {})]);
        dates.forEach(day => {
            const merged = mergeThreeWay(
                Array.isArray(baseDiary?.[day]) ? baseDiary[day] : [],
                Array.isArray(localDiary?.[day]) ? localDiary[day] : [],
                Array.isArray(cloudDiary?.[day]) ? cloudDiary[day] : []
            );
            if (merged.length) result[day] = merged;
        });
        return result;
    }

    function mergeGoalsThreeWay(baseGoals, localGoals, cloudGoals) {
        const base = baseGoals && typeof baseGoals === "object" ? baseGoals : {};
        const local = localGoals && typeof localGoals === "object" ? localGoals : {};
        const cloud = cloudGoals && typeof cloudGoals === "object" ? cloudGoals : {};
        const merged = {};
        new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(cloud)]).forEach(key => {
            const inBase = Object.prototype.hasOwnProperty.call(base, key);
            const inLocal = Object.prototype.hasOwnProperty.call(local, key);
            const inCloud = Object.prototype.hasOwnProperty.call(cloud, key);
            if (inBase && (!inLocal || !inCloud)) return;
            if (!inBase) {
                if (inLocal) merged[key] = local[key];
                else if (inCloud) merged[key] = cloud[key];
                return;
            }
            merged[key] = sameItem(local[key], base[key]) ? cloud[key] : local[key];
        });
        return merged;
    }

    function mergeSnapshot(cloudData, user) {
        const local = {
            recipes: readArray(STORAGE_KEYS.recipes),
            favorites: readArray(STORAGE_KEYS.favorites),
            plan: readObject(STORAGE_KEYS.plan),
            shopping: readArray(STORAGE_KEYS.shopping),
            history: readArray(STORAGE_KEYS.history),
            diary: readObject(STORAGE_KEYS.diary),
            goals: readObject(STORAGE_KEYS.goals)
        };
        const cloud = {
            recipes: Array.isArray(cloudData?.recipes) ? cloudData.recipes : [],
            favorites: Array.isArray(cloudData?.favorites) ? cloudData.favorites : [],
            plan: cloudData?.meal_plan && typeof cloudData.meal_plan === "object" && !Array.isArray(cloudData.meal_plan) ? cloudData.meal_plan : {},
            shopping: Array.isArray(cloudData?.shopping_list) ? cloudData.shopping_list : [],
            history: Array.isArray(cloudData?.history) ? cloudData.history : [],
            diary: cloudData?.food_diary && typeof cloudData.food_diary === "object" && !Array.isArray(cloudData.food_diary) ? cloudData.food_diary : {},
            goals: cloudData?.nutrition_goals && typeof cloudData.nutrition_goals === "object" && !Array.isArray(cloudData.nutrition_goals) ? cloudData.nutrition_goals : {}
        };
        const baseline = readBaseline(user.id);

        // Merge local and cloud data on first use. On later syncs, three-way merge preserves edits and deletions.
        const snapshot = baseline ? {
            recipes: mergeThreeWay(baseline.recipes, local.recipes, cloud.recipes),
            favorites: mergeThreeWay(baseline.favorites, local.favorites, cloud.favorites),
            plan: mergePlanThreeWay(baseline.plan, local.plan, cloud.plan),
            shopping: mergeThreeWay(baseline.shopping, local.shopping, cloud.shopping),
            history: mergeThreeWay(baseline.history, local.history, cloud.history),
            diary: mergeDiaryThreeWay(baseline.diary, local.diary, cloud.diary),
            goals: mergeGoalsThreeWay(baseline.goals, local.goals, cloud.goals)
        } : {
            recipes: mergeById(local.recipes, cloud.recipes),
            favorites: mergeById(local.favorites, cloud.favorites),
            plan: Object.fromEntries([...new Set([...Object.keys(cloud.plan), ...Object.keys(local.plan)])].map(date => [date, { ...(cloud.plan[date] || {}), ...(local.plan[date] || {}) }])),
            shopping: mergeById(local.shopping, cloud.shopping),
            history: mergeById(local.history, cloud.history).sort((a, b) => new Date(b.viewedAt || 0) - new Date(a.viewedAt || 0)).slice(0, 12),
            diary: mergeDiaryUnion(local.diary, cloud.diary),
            goals: { ...cloud.goals, ...local.goals }
        };

        setLocalSnapshot(snapshot.recipes, snapshot.favorites, snapshot.plan, snapshot.shopping, snapshot.history, snapshot.diary, snapshot.goals);
        return snapshot;
    }

    function prepareLocalForUser(user) {
        const previousOwner = localStorage.getItem(OWNER_KEY);
        if (previousOwner && previousOwner !== user.id) {
            const previousSnapshot = {
                recipes: readArray(STORAGE_KEYS.recipes),
                favorites: readArray(STORAGE_KEYS.favorites),
                plan: readObject(STORAGE_KEYS.plan),
                shopping: readArray(STORAGE_KEYS.shopping),
                history: readArray(STORAGE_KEYS.history),
                diary: readObject(STORAGE_KEYS.diary),
                goals: readObject(STORAGE_KEYS.goals)
            };
            nativeSetItem.call(localStorage, ACCOUNT_CACHE_PREFIX + previousOwner, JSON.stringify(previousSnapshot));

            let nextSnapshot = { recipes: [], favorites: [], plan: {}, shopping: [], history: [], diary: {}, goals: {} };
            try {
                const cached = JSON.parse(localStorage.getItem(ACCOUNT_CACHE_PREFIX + user.id) || "null");
                if (cached && typeof cached === "object") {
                    nextSnapshot = {
                        recipes: Array.isArray(cached.recipes) ? cached.recipes : [],
                        favorites: Array.isArray(cached.favorites) ? cached.favorites : [],
                        plan: cached.plan && typeof cached.plan === "object" && !Array.isArray(cached.plan) ? cached.plan : {},
                        shopping: Array.isArray(cached.shopping) ? cached.shopping : [],
                        history: Array.isArray(cached.history) ? cached.history : [],
                        diary: cached.diary && typeof cached.diary === "object" && !Array.isArray(cached.diary) ? cached.diary : {},
                        goals: cached.goals && typeof cached.goals === "object" && !Array.isArray(cached.goals) ? cached.goals : {}
                    };
                }
            } catch {
                nextSnapshot = { recipes: [], favorites: [], plan: {}, shopping: [], history: [], diary: {}, goals: {} };
            }
            setLocalSnapshot(nextSnapshot.recipes, nextSnapshot.favorites, nextSnapshot.plan, nextSnapshot.shopping, nextSnapshot.history, nextSnapshot.diary, nextSnapshot.goals);
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
            ".recipepro-cloud-field{margin:0 0 13px}",
            ".recipepro-cloud-password{box-sizing:border-box;width:100%;height:46px;padding:0 13px;border:1px solid rgba(32,55,47,.18);border-radius:12px;background:#fff;color:#20372f;font:14px Inter,sans-serif}",
            ".recipepro-cloud-password:focus{outline:3px solid rgba(32,55,47,.08);border-color:#20372f}",
            ".recipepro-cloud-secondary{background:transparent!important;border-style:dashed!important}",
            ".recipepro-cloud-legacy{margin-top:15px;padding-top:15px;border-top:1px solid rgba(32,55,47,.1)}",
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

    function loadSupabaseSdk() {
        if (window.supabase?.createClient) return Promise.resolve();
        if (window.recipeProSupabaseSdkPromise) return window.recipeProSupabaseSdkPromise;

        window.recipeProSupabaseSdkPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
            script.async = true;
            script.dataset.recipeproSupabaseSdk = "true";
            const timeout = window.setTimeout(() => {
                script.onload = null;
                script.onerror = null;
                reject(new Error("Истекло время загрузки облачного модуля."));
            }, 10000);

            script.onload = () => {
                window.clearTimeout(timeout);
                if (window.supabase?.createClient) resolve();
                else reject(new Error("Библиотека облачного хранилища загрузилась некорректно."));
            };
            script.onerror = () => {
                window.clearTimeout(timeout);
                reject(new Error("Не удалось загрузить облачный модуль."));
            };
            document.head.appendChild(script);
        }).catch(error => {
            window.recipeProSupabaseSdkPromise = null;
            throw error;
        });

        return window.recipeProSupabaseSdkPromise;
    }

    function initializeCloudClient() {
        if (client) return Promise.resolve(client);
        if (clientInitPromise) return clientInitPromise;

        clientInitPromise = loadSupabaseSdk().then(() => {
            if (!window.supabase?.createClient) throw new Error("Библиотека Supabase недоступна.");

            client = window.supabase.createClient(CONFIG.url, CONFIG.publishableKey, {
                auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
            });
            client.auth.onAuthStateChange((event, session) => {
                window.setTimeout(() => handleSession(session?.user || null), 0);
            });

            return client.auth.getSession().then(({ data, error }) => {
                if (error) throw error;
                handleSession(data?.session?.user || null);
                return client;
            });
        }).catch(error => {
            clientInitPromise = null;
            throw error;
        });

        return clientInitPromise;
    }

    // Expose only an authenticated invocation helper; the Supabase client and session stay private.
    window.recipeProInvokeAI = async function (payload) {
        await initializeCloudClient();
        const { data, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data?.session?.access_token) {
            throw new Error("Для генерации через настоящий ИИ войди в аккаунт RecipePro. Пока доступен локальный генератор.");
        }

        const { data: result, error } = await client.functions.invoke("recipepro-ai-generator", {
            body: payload
        });
        if (error) {
            let message = "";
            try {
                const response = error.context;
                if (response && typeof response.json === "function") {
                    const body = await response.json();
                    message = body?.error || "";
                }
            } catch {}
            throw new Error(message || error.message || "Сервис ИИ временно недоступен.");
        }
        if (!result?.recipe) throw new Error(result?.error || "Сервис ИИ вернул некорректный ответ.");
        return result;
    };

 
    // A narrow public API for community features. Authentication/session and the client remain private.
    async function communityClient() {
        if (!configured) throw new Error("Облачное хранилище не настроено.");
        await initializeCloudClient();
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (!data?.session?.user) throw new Error("Сначала войди в аккаунт через кнопку «Облако» в шапке.");
        return { db: client, user: data.session.user };
    }

    async function uploadCommunityImage(dataUrl, folder, userId) {
        if (!dataUrl || !/^data:image\/(jpeg|png|webp);base64,/i.test(dataUrl)) return null;
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        if (blob.size > 5 * 1024 * 1024) throw new Error("Фото после сжатия должно быть меньше 5 МБ.");
        const path = userId + "/" + folder + "/" + crypto.randomUUID() + ".jpg";
        const { error } = await client.storage.from("recipepro-public-media").upload(path, blob, {
            contentType: blob.type || "image/jpeg",
            upsert: false,
            cacheControl: "31536000"
        });
        if (error) throw error;
        return client.storage.from("recipepro-public-media").getPublicUrl(path).data.publicUrl;
    }

    window.recipeProCloudAPI = {
        async getSession() {
            if (!configured) return { user: null };
            await initializeCloudClient();
            const { data, error } = await client.auth.getSession();
            if (error) throw error;
            return { user: data?.session?.user || null };
        },
        async getOwnProfile() {
            const { db, user } = await communityClient();
            const result = await db.from("recipepro_public_profiles")
                .select("username,display_name,bio,avatar_path,is_public,updated_at")
                .eq("user_id", user.id).maybeSingle();
            if (result.error) throw result.error;
            return result.data || null;
        },
        async savePublicProfile(profile) {
            const { db, user } = await communityClient();
            const current = await db.from("recipepro_public_profiles").select("avatar_path").eq("user_id", user.id).maybeSingle();
            if (current.error) throw current.error;
            let avatarPath = current.data?.avatar_path || null;
            if (profile.photo && profile.photo.startsWith("data:image/")) {
                avatarPath = await uploadCommunityImage(profile.photo, "profile", user.id);
            } else if (!profile.photo) {
                avatarPath = null;
            }
            const username = String(user.user_metadata?.username || "").trim().toLowerCase() || null;
            const result = await db.from("recipepro_public_profiles").upsert({
                user_id: user.id,
                username,
                display_name: String(profile.name || "").trim().slice(0, 50),
                bio: String(profile.bio || "").trim().slice(0, 240),
                avatar_path: avatarPath,
                is_public: profile.isPublic === true,
                updated_at: new Date().toISOString()
            }, { onConflict: "user_id" });
            if (result.error) throw result.error;
            return { userId: user.id, isPublic: profile.isPublic === true };
        },
        async publishRecipe(recipe) {
            const { db, user } = await communityClient();
            if (!recipe || !recipe.id || !String(recipe.title || "").trim()) throw new Error("Не удалось определить блюдо для публикации.");
            const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
            const nutrition = { ...(recipe.nutrition && typeof recipe.nutrition === "object" ? recipe.nutrition : {}), servings: Math.max(1, Number(recipe.servings || 1)) };
            let imagePath = null;
            if (typeof recipe.image === "string" && recipe.image.startsWith("data:image/")) {
                imagePath = await uploadCommunityImage(recipe.image, "recipes", user.id);
            } else if (typeof recipe.image === "string" && /^https:\/\//i.test(recipe.image)) {
                imagePath = recipe.image;
            }
            const payload = {
                user_id: user.id,
                source_id: String(recipe.id).slice(0, 120),
                title: String(recipe.title).trim().slice(0, 120),
                description: String(recipe.description || "").trim().slice(0, 3000),
                image_path: imagePath,
                ingredients,
                nutrition,
                is_published: true,
                updated_at: new Date().toISOString()
            };
            const result = await db.from("recipepro_public_recipes")
                .upsert(payload, { onConflict: "user_id,source_id" })
                .select("id,title,is_published")
                .single();
            if (result.error) throw result.error;
            return result.data;
        },
        async unpublishRecipe(sourceId) {
            const { db, user } = await communityClient();
            const result = await db.from("recipepro_public_recipes")
                .update({ is_published: false, updated_at: new Date().toISOString() })
                .eq("user_id", user.id).eq("source_id", String(sourceId));
            if (result.error) throw result.error;
        },
        async listFeed() {
            if (!configured) throw new Error("Облачное хранилище не настроено.");
            await initializeCloudClient();
            const result = await client.from("recipepro_public_recipes")
                .select("id,user_id,title,description,image_path,ingredients,nutrition,created_at")
                .eq("is_published", true).order("created_at", { ascending: false }).limit(30);
            if (result.error) throw result.error;
            const rows = result.data || [];
            const ids = [...new Set(rows.map(row => row.user_id))];
            let profiles = [];
            if (ids.length) {
                const profileResult = await client.from("recipepro_public_profiles")
                    .select("user_id,username,display_name,bio,avatar_path")
                    .eq("is_public", true).in("user_id", ids);
                if (profileResult.error) throw profileResult.error;
                profiles = profileResult.data || [];
            }
            const byUser = new Map(profiles.map(profile => [profile.user_id, profile]));
            return rows.map(row => ({ ...row, profile: byUser.get(row.user_id) || null }));
        }
    };

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
            '<div class="recipepro-cloud-field"><label class="recipepro-cloud-label" for="recipeProCloudUsername">Логин</label><input class="recipepro-cloud-password" id="recipeProCloudUsername" type="text" autocomplete="username" autocapitalize="none" maxlength="24" placeholder="например, oleg_1995"></div>',
            '<div class="recipepro-cloud-field"><label class="recipepro-cloud-label" for="recipeProCloudPassword">Пароль</label><input class="recipepro-cloud-password" id="recipeProCloudPassword" type="password" autocomplete="current-password" minlength="10" maxlength="128" placeholder="Не менее 10 символов"></div>',
            '<div class="recipepro-cloud-status" id="recipeProCloudStatus" role="status" aria-live="polite">Войди или создай аккаунт по логину и паролю.</div>',
            '<div class="recipepro-cloud-actions">',
            '<button class="recipepro-cloud-primary" id="recipeProCloudSignIn" type="button">Войти</button>',
            '<button id="recipeProCloudRegister" type="button">Создать аккаунт</button>',
            '<button class="recipepro-cloud-secondary" id="recipeProCloudLegacyToggle" type="button">Старый вход по почте</button>',
            '<button id="recipeProCloudSignOut" type="button" hidden>Выйти</button>',
            '</div>',
            '<div class="recipepro-cloud-legacy" id="recipeProCloudLegacy" hidden><label class="recipepro-cloud-label" for="recipeProCloudEmail">Почта старого аккаунта</label><input class="recipepro-cloud-email" id="recipeProCloudEmail" type="email" autocomplete="email" placeholder="you@example.com"><div class="recipepro-cloud-actions"><button id="recipeProCloudLegacySignIn" class="recipepro-cloud-primary" type="button">Отправить ссылку для входа</button></div></div>',
            '</div>',
            '<p class="recipepro-cloud-footnote">Логин и пароль не требуют почты. Запиши их в надёжном месте: восстановление пароля без почты пока не предусмотрено.</p>',
            '</div>'
        ].join("");
        document.body.appendChild(overlay);

        statusNode = document.getElementById("recipeProCloudStatus");
        overlay.querySelector(".recipepro-cloud-close").addEventListener("click", closeDialog);
        overlay.addEventListener("click", event => {
            if (event.target === overlay) closeDialog();
        });
        overlay.querySelector("#recipeProCloudSignIn").addEventListener("click", signInWithUsername);
        overlay.querySelector("#recipeProCloudRegister").addEventListener("click", registerWithUsername);
        overlay.querySelector("#recipeProCloudLegacyToggle").addEventListener("click", () => {
            const legacy = document.getElementById("recipeProCloudLegacy");
            legacy.hidden = !legacy.hidden;
            if (!legacy.hidden) document.getElementById("recipeProCloudEmail").focus();
        });
        overlay.querySelector("#recipeProCloudLegacySignIn").addEventListener("click", sendSignInLink);
        overlay.querySelector("#recipeProCloudSignOut").addEventListener("click", signOut);
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeDialog();
        });

        if (!configured) {
            document.getElementById("recipeProCloudAccount").hidden = true;
            document.getElementById("recipeProCloudSetup").innerHTML =
                '<div class="recipepro-cloud-config-help">Облачное хранилище подготовлено, но ещё не подключено. Создай бесплатный проект в <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">Supabase</a>, выполни SQL из файла <code>supabase/schema.sql</code>, затем добавь URL проекта и publishable key в <code>JS/supabase-config.js</code>. Секретный service_role key сюда добавлять нельзя.</div>';
            setStatus("Облако ещё не настроено", "neutral");
            return;
        }

        document.getElementById("recipeProCloudSetup").hidden = true;
        initializeCloudClient().catch(error => {
            setStatus("Облачный модуль пока недоступен. Локальные данные сохранены; подключение повторится при восстановлении сети. " + (error?.message || ""), "error");
        });
    }

    function openDialog() {
        createDialog();
        overlay.classList.add("is-open");
        if (!configured) setStatus("Облако ещё не настроено", "neutral");
        else if (!client) {
            setStatus("Подключаем облачный модуль…", "neutral");
            initializeCloudClient().catch(error => {
                setStatus("Не удалось подключить облако. Проверь интернет и попробуй ещё раз. " + (error?.message || ""), "error");
            });
        } else if (currentUser) setStatus("Вход выполнен: " + (currentUser.user_metadata?.username || currentUser.email || "аккаунт"), "success");
        else setStatus("Войди или создай аккаунт по логину и паролю.", "neutral");
    }

    function closeDialog() {
        if (overlay) overlay.classList.remove("is-open");
    }


    async function usernameAuthRequest(action, username, password) {
        if (!client) throw new Error("Облачное хранилище ещё не подключено.");
        const { data, error } = await client.functions.invoke("recipepro-username-auth", {
            body: { action, username, password }
        });
        if (error) {
            let detail = error.message || "Ошибка запроса.";
            try {
                if (error.context && typeof error.context.json === "function") {
                    const body = await error.context.json();
                    if (body?.error) detail = body.error;
                }
            } catch {}
            throw new Error(detail);
        }
        if (data?.error) throw new Error(data.error);
        return data;
    }

    function readUsernameCredentials() {
        const usernameInput = document.getElementById("recipeProCloudUsername");
        const passwordInput = document.getElementById("recipeProCloudPassword");
        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        if (!/^[a-z0-9_]{3,24}$/.test(username)) {
            usernameInput.focus();
            throw new Error("Логин: 3–24 символа, только латинские буквы, цифры и _.");
        }
        if (password.length < 10) {
            passwordInput.focus();
            throw new Error("Пароль должен содержать не менее 10 символов.");
        }
        if (password.length > 128) throw new Error("Пароль слишком длинный.");
        return { username, password };
    }

    async function signInWithUsername() {
        const button = document.getElementById("recipeProCloudSignIn");
        if (!client) return;
        button.disabled = true;
        try {
            const { username, password } = readUsernameCredentials();
            setStatus("Проверяем логин…", "neutral");
            const resolved = await usernameAuthRequest("resolve", username, password);
            const { error } = await client.auth.signInWithPassword({ email: resolved.email, password });
            if (error) throw error;
            setStatus("Вход выполнен. Загружаем рецепты…", "success");
        } catch (error) {
            setStatus(error?.message || "Не удалось войти.", "error");
        } finally {
            button.disabled = false;
        }
    }

    async function registerWithUsername() {
        const button = document.getElementById("recipeProCloudRegister");
        if (!client) return;
        button.disabled = true;
        try {
            const { username, password } = readUsernameCredentials();
            setStatus("Создаём защищённый аккаунт…", "neutral");
            const created = await usernameAuthRequest("register", username, password);
            const { error } = await client.auth.signInWithPassword({ email: created.email, password });
            if (error) throw error;
            setStatus("Аккаунт создан. Сохраняем твои рецепты…", "success");
        } catch (error) {
            setStatus(error?.message || "Не удалось создать аккаунт.", "error");
        } finally {
            button.disabled = false;
        }
    }

    async function sendSignInLink() {
        if (!client) return;
        const emailInput = document.getElementById("recipeProCloudEmail");
        const email = emailInput.value.trim();
        const button = document.getElementById("recipeProCloudLegacySignIn");
        if (!email || !emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }
        const cooldownKey = "recipepro_magic_link_last_request";
        const lastRequest = Number(localStorage.getItem(cooldownKey) || 0);
        const remaining = 60 - Math.floor((Date.now() - lastRequest) / 1000);
        if (remaining > 0) {
            setStatus("Подожди " + remaining + " сек. перед повторным запросом письма.", "error");
            return;
        }
        button.disabled = true;
        setStatus("Отправляем ссылку для входа…", "neutral");
        try {
            const result = await client.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false, emailRedirectTo: "https://olegterekhov.github.io/RecipePro/" }
            });
            if (result.error) throw result.error;
            localStorage.setItem(cooldownKey, String(Date.now()));
            setStatus("Письмо отправлено, если адрес зарегистрирован. Открой ссылку один раз на этом устройстве. Не открывай ссылку повторно.", "success");
        } catch (error) {
            const message = error?.message || "неизвестная ошибка";
            if (/rate limit|too many|429|over_email_send_rate_limit/i.test(message)) {
                setStatus("Почтовый лимит Supabase ещё действует. Не запрашивай новые письма; попробуем позже.", "error");
            } else if (/user not found|signup is disabled/i.test(message)) {
                setStatus("Не удалось отправить ссылку для этого аккаунта. Проверь адрес и настройки авторизации Supabase.", "error");
            } else {
                setStatus("Не удалось отправить ссылку: " + message, "error");
            }
        } finally {
            button.disabled = false;
        }
    }

    async function handleSession(user) {
        const previousId = currentUser?.id || null;
        currentUser = user;
        const signInButton = document.getElementById("recipeProCloudSignIn");
        const registerButton = document.getElementById("recipeProCloudRegister");
        const legacyToggle = document.getElementById("recipeProCloudLegacyToggle");
        const legacy = document.getElementById("recipeProCloudLegacy");
        const signOutButton = document.getElementById("recipeProCloudSignOut");
        const emailInput = document.getElementById("recipeProCloudEmail");
        const usernameInput = document.getElementById("recipeProCloudUsername");
        const passwordInput = document.getElementById("recipeProCloudPassword");
        if (signInButton) signInButton.hidden = Boolean(user);
        if (registerButton) registerButton.hidden = Boolean(user);
        if (legacyToggle) legacyToggle.hidden = Boolean(user);
        if (legacy && user) legacy.hidden = true;
        if (signOutButton) signOutButton.hidden = !user;
        if (emailInput && user?.email && !user.email.endsWith("@users.recipepro.invalid")) emailInput.value = user.email;
        if (usernameInput && user?.user_metadata?.username) usernameInput.value = user.user_metadata.username;
        if (passwordInput && user) passwordInput.value = "";

        if (!user) {
            if (previousId) setStatus("Вы вышли. Локальные рецепты сохранены на этом устройстве.", "neutral");
            else setStatus("Войди или создай аккаунт по логину и паролю.", "neutral");
            return;
        }

        if (syncingUserId === user.id) return;
        syncingUserId = user.id;
        setStatus("Загружаем данные из облака…", "neutral");
        try {
            prepareLocalForUser(user);
            const result = await client.from(TABLE).select("recipes,favorites,meal_plan,shopping_list,history,food_diary,nutrition_goals").eq("user_id", user.id).maybeSingle();
            if (result.error) throw result.error;
            const merged = mergeSnapshot(result.data || { recipes: [], favorites: [] }, user);
            await uploadSnapshot(merged, user);
            saveBaseline(merged, user);
            setStatus("Синхронизация завершена. Аккаунт: " + (user.user_metadata?.username || user.email || "подключён"), "success");
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
            meal_plan: snapshot.plan,
            shopping_list: snapshot.shopping,
            history: snapshot.history,
            food_diary: snapshot.diary,
            nutrition_goals: snapshot.goals,
            updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
        if (result.error) throw result.error;
    }

    function scheduleSave() {
        if (!client || !currentUser || isApplyingCloudData) return;
        window.clearTimeout(saveTimer);
        const targetUser = currentUser;

        saveTimer = window.setTimeout(async () => {
            // A user can sign out or switch accounts while this delayed save is waiting.
            // Capture the owner now so data and its sync baseline can never cross accounts.
            if (!currentUser || currentUser.id !== targetUser.id) return;

            try {
                // Merge against the newest cloud copy before writing, so an active second device's edits
                // are not overwritten by a stale local snapshot.
                const latest = await client.from(TABLE)
                    .select("recipes,favorites,meal_plan,shopping_list,history,food_diary,nutrition_goals")
                    .eq("user_id", targetUser.id)
                    .maybeSingle();
                if (latest.error) throw latest.error;
                const mergedSnapshot = mergeSnapshot(latest.data || { recipes: [], favorites: [] }, targetUser);
                await uploadSnapshot(mergedSnapshot, targetUser);
                saveBaseline(mergedSnapshot, targetUser);
                if (currentUser?.id === targetUser.id) {
                    setStatus("Изменения сохранены в облако.", "success");
                }
            } catch (error) {
                if (currentUser?.id === targetUser.id) {
                    setStatus("Не удалось сохранить в облако: " + (error?.message || "ошибка"), "error");
                }
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
        if (this === window.localStorage && Object.values(STORAGE_KEYS).includes(key)) scheduleSave();
    };

    // Explicit save notification is a fallback for browser Storage differences.
    window.addEventListener("recipepro:data-changed", scheduleSave);

    // When the connection returns, merge local edits with the latest cloud snapshot.
    // Uploading local state blindly here could overwrite changes made on another device.
    window.addEventListener("online", () => {
        if (!configured) return;
        if (!client) {
            initializeCloudClient().catch(error => {
                setStatus("Облако пока недоступно. Локальные изменения сохранены; повторим попытку позже. " + (error?.message || ""), "error");
            });
            return;
        }
        if (currentUser) handleSession(currentUser);
        else scheduleSave();
    });

    // Refresh cloud data when the app is brought back to the foreground on another device.
    // This keeps an already-open tab in sync after edits made on a phone or computer.
    function refreshCloudWhenActive() {
        if (document.visibilityState === "hidden" || !configured) return;
        if (currentUser) handleSession(currentUser);
        else if (!client) {
            initializeCloudClient().catch(() => {});
        }
    }

    window.addEventListener("focus", refreshCloudWhenActive);
    document.addEventListener("visibilitychange", refreshCloudWhenActive);

    function init() {
        createDialog();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
})();
