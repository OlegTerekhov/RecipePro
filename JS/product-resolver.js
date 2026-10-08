(() => {
    "use strict";

    const API = "https://world.openfoodfacts.org/cgi/search.pl";
    const CACHE_KEY = "recipepro_product_cache_v1";
    const cache = loadCache();

    function loadCache() {
        try {
            const data = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
            return data && typeof data === "object" ? data : {};
        } catch {
            return {};
        }
    }

    function saveCache() {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch {}
    }

    function normalize(text) {
        return String(text || "")
            .toLowerCase()
            .replace(/ё/g, "е")
            .replace(/[^a-zа-я0-9\s-]/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function slug(text) {
        return normalize(text)
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 80) || "product";
    }

    function detectRole(category, name) {
        const text = normalize((category || "") + " " + (name || ""));
        if (/meat|poultry|fish|seafood|egg|dairy|cheese|мяс|птиц|рыб|морепродукт|яйц|молоч|сыр/.test(text)) return "protein";
        if (/cereal|grain|pasta|bread|rice|flour|legume|зерн|круп|паст|макарон|хлеб|рис|мук|бобов/.test(text)) return "carb";
        if (/vegetable|herb|salad|овощ|зелень|салат/.test(text)) return "vegetable";
        if (/fruit|berry|фрукт|ягод/.test(text)) return "fruit";
        if (/oil|fat|масл|жир/.test(text)) return "fat";
        return "other";
    }

    function parseNumber(value) {
        if (value === undefined || value === null || value === "") return null;
        const n = Number(String(value).replace(",", "."));
        return Number.isFinite(n) ? n : null;
    }

    function toLocalProduct(item, requestedName) {
        const nutriments = item.nutriments || {};
        const kcal = parseNumber(
            nutriments["energy-kcal_100g"] ??
            nutriments["energy-kcal"] ??
            (parseNumber(nutriments.energy_100g) ? parseNumber(nutriments.energy_100g) / 4.184 : null)
        );
        const protein = parseNumber(nutriments.proteins_100g) ?? 0;
        const fat = parseNumber(nutriments.fat_100g) ?? 0;
        const carbs = parseNumber(nutriments.carbohydrates_100g) ?? 0;

        if (kcal === null || !item.product_name) return null;

        const displayName = item.product_name.trim();
        const keyBase = slug(requestedName || displayName);
        let key = keyBase;
        let suffix = 2;

        while (window.products[key]) {
            const existing = window.products[key];
            if (existing && existing.sourceCode === item.code) return key;
            key = keyBase + "-" + suffix++;
        }

        const categories = item.categories || "";
        const role = detectRole(categories, displayName);

        window.products[key] = {
            name: displayName,
            category: role,
            aliases: [requestedName, displayName].filter(Boolean),
            raw: {
                kcal: Math.round(kcal * 10) / 10,
                protein: Math.round(protein * 10) / 10,
                fat: Math.round(fat * 10) / 10,
                carbs: Math.round(carbs * 10) / 10
            },
            cookedWeightRatio: 1,
            source: "Open Food Facts",
            sourceCode: item.code || null,
            sourceUrl: item.code ? "https://world.openfoodfacts.org/product/" + item.code : null,
            role
        };

        return key;
    }

    async function searchRemote(query) {
        const clean = normalize(query);
        if (!clean) return null;

        const cacheKey = clean;
        if (cache[cacheKey] && window.products[cache[cacheKey]]) {
            return cache[cacheKey];
        }

        const url = API +
            "?action=process&json=true&page_size=8&fields=code,product_name,categories,nutriments&search_terms=" +
            encodeURIComponent(clean);

        try {
            const response = await fetch(url, {
                headers: { Accept: "application/json" }
            });

            if (!response.ok) return null;

            const data = await response.json();
            const products = Array.isArray(data.products) ? data.products : [];

            const usable = products.find(item => {
                const n = item.nutriments || {};
                return item.product_name &&
                    (n["energy-kcal_100g"] !== undefined || n.energy_100g !== undefined) &&
                    n.proteins_100g !== undefined;
            });

            if (!usable) return null;

            const key = toLocalProduct(usable, query);
            if (!key) return null;

            cache[cacheKey] = key;
            saveCache();
            return key;
        } catch (error) {
            console.warn("RecipePro product database:", error);
            return null;
        }
    }

    function localResolve(input) {
        const text = normalize(input);
        const found = new Set();

        Object.entries(window.products || {}).forEach(([id, product]) => {
            const aliases = Array.isArray(product.aliases) ? product.aliases : [];
            if ([id, product.name, ...aliases].some(alias => {
                const a = normalize(alias);
                return a && (text.includes(a) || a === text);
            })) {
                found.add(id);
            }
        });

        return [...found];
    }

    function extractCandidates(input) {
        let text = normalize(input);

        text = text
            .replace(/\bу меня\b|\bесть\b|\bимею\b|\bимеются\b/g, "")
            .replace(/\bхочу\b.*$/g, "")
            .replace(/\bсделай\b.*$/g, "")
            .replace(/\bприготовь\b.*$/g, "")
            .replace(/\bнужно\b.*$/g, "");

        return text
            .split(/,|\+|\s+и\s+|;|\n/g)
            .map(part => part.trim())
            .filter(Boolean)
            .filter(part => part.length >= 2)
            .filter(part => !/^(до|от|максимум|минимум|не больше|не более|не дольше|максимум)\b/.test(part))
            .slice(0, 10);
    }

    async function resolve(input) {
        const local = localResolve(input);
        const candidates = extractCandidates(input);
        const resolved = [...local];
        const unresolved = [];

        for (const candidate of candidates) {
            if (localResolve(candidate).length) continue;
            unresolved.push(candidate);
        }

        for (const candidate of unresolved.slice(0, 5)) {
            const key = await searchRemote(candidate);
            if (key && !resolved.includes(key)) resolved.push(key);
        }

        return resolved.slice(0, 10);
    }

    window.recipeProProductResolver = {
        resolve,
        searchRemote,
        localResolve,
        clearCache() {
            Object.keys(cache).forEach(key => delete cache[key]);
            try { localStorage.removeItem(CACHE_KEY); } catch {}
        }
    };
})();