"use strict";

const CACHE_NAME = "recipepro-shell-v19";
const CORE_SHELL = ["./", "./index.html"];
const APP_ASSETS = [
    "./CSS/style.css", "./JS/products.js", "./JS/product-resolver.js",
    "./JS/recipes.js", "./JS/recipe-intelligence.js", "./JS/ingredient-intelligence.js",
    "./JS/recipe-engine.js", "./JS/recipe-builder.js", "./JS/recommendation-engine.js",
    "./JS/nutrition-engine.js", "./JS/nutrition.js", "./JS/app.js", "./JS/ai-generator.js",
    "./JS/supabase-config.js", "./JS/cloud-sync.js", "./manifest.webmanifest", "./icon.svg"
];
const EXTERNAL_ASSETS = ["https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"];

async function fetchWithTimeout(request, timeoutMs = 5000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const req = request instanceof Request
            ? new Request(request, { signal: controller.signal })
            : new Request(request, { signal: controller.signal });
        return await fetch(req);
    } finally {
        clearTimeout(timer);
    }
}

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CORE_SHELL);

        // Cache local files independently so one missing/slow asset cannot cancel installation.
        await Promise.all(APP_ASSETS.map(async path => {
            try {
                const url = new URL(path, self.registration.scope).href;
                const response = await fetchWithTimeout(new Request(url, { cache: "reload" }));
                if (response.ok) await cache.put(url, response);
                else console.warn("RecipePro: asset not cached", path, response.status);
            } catch (error) {
                console.warn("RecipePro: asset cache failed", path, error);
            }
        }));

        // The cloud SDK is optional; cache it when reachable, but never let it hold up install.
        await Promise.all(EXTERNAL_ASSETS.map(async url => {
            try {
                const response = await fetchWithTimeout(
                    new Request(url, { cache: "reload", mode: "cors" }), 2500
                );
                if (response.ok && response.type !== "opaque") await cache.put(url, response);
            } catch (error) {
                console.warn("RecipePro: optional cloud SDK not cached", error);
            }
        }));

        await self.skipWaiting();
    })());
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(key => key.startsWith("recipepro-") && key !== CACHE_NAME)
                .map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);
    if (request.method !== "GET") return;

    // Cache-first for the optional cross-origin SDK; fail quickly if uncached.
    if (EXTERNAL_ASSETS.some(asset => url.href === asset || url.href.startsWith(asset + "?"))) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(request, { ignoreSearch: true });
            if (cached) return cached;
            try {
                const response = await fetchWithTimeout(request, 2500);
                if (response.ok && response.type !== "opaque") await cache.put(request, response.clone());
                return response;
            } catch {
                return new Response("/* RecipePro cloud sync unavailable offline. */", {
                    status: 200,
                    headers: { "Content-Type": "application/javascript; charset=utf-8" }
                });
            }
        })());
        return;
    }

    if (url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            const indexUrl = new URL("./index.html", self.registration.scope).href;
            const cached = await cache.match(indexUrl);

            const networkResponse = fetchWithTimeout(request, 1800).then(async response => {
                if (response.ok) await cache.put(indexUrl, response.clone());
                return response;
            });

            // A slow or missing network must not leave the installed app on a blank screen.
            try {
                return await Promise.race([
                    networkResponse,
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Navigation timeout")), 1800))
                ]);
            } catch {
                if (cached) return cached;
                try {
                    return await networkResponse;
                } catch {
                    return new Response(
                        "<!doctype html><html lang='ru'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>RecipePro</title><body style='font:16px system-ui;padding:24px;color:#20372f;background:#f7f3ed'><h1>RecipePro</h1><p>Офлайн-версия ещё не сохранена на этом устройстве.</p><p>Подключись к интернету, открой приложение на несколько секунд и повтори попытку.</p></body></html>",
                        { headers: { "Content-Type": "text/html; charset=utf-8" } }
                    );
                }
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) return cached;
        try {
            const response = await fetchWithTimeout(request, 5000);
            if (response.ok) await cache.put(request, response.clone());
            return response;
        } catch {
            return new Response("", { status: 503, statusText: "Offline asset unavailable" });
        }
    })());
});
