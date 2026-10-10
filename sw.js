"use strict";

const CACHE_NAME = "recipepro-shell-v17";
const CORE_SHELL = [
    "./",
    "./index.html"
];
const APP_ASSETS = [
    "./CSS/style.css",
    "./JS/products.js",
    "./JS/product-resolver.js",
    "./JS/recipes.js",
    "./JS/recipe-intelligence.js",
    "./JS/ingredient-intelligence.js",
    "./JS/recipe-engine.js",
    "./JS/recipe-builder.js",
    "./JS/recommendation-engine.js",
    "./JS/nutrition-engine.js",
    "./JS/nutrition.js",
    "./JS/app.js",
    "./JS/ai-generator.js",
    "./JS/supabase-config.js",
    "./JS/cloud-sync.js",
    "./JS/supabase-client.js",
    "./manifest.webmanifest",
    "./icon.svg"
];

self.addEventListener("install", event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        // The document itself is essential. If it cannot be cached, fail the install.
        await cache.addAll(CORE_SHELL);
        // A single optional asset must not cancel caching of the entire application.
        await Promise.all(APP_ASSETS.map(async path => {
            try {
                const url = new URL(path, self.registration.scope).href;
                const response = await fetch(new Request(url, { cache: "reload" }));
                if (response.ok) await cache.put(url, response);
                else console.warn("RecipePro: asset not cached", path, response.status);
            } catch (error) {
                console.warn("RecipePro: asset cache failed", path, error);
            }
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key.startsWith("recipepro-") && key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET" || url.origin !== self.location.origin) return;

    if (request.mode === "navigate") {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    const cache = await caches.open(CACHE_NAME);
                    await cache.put(new URL("./index.html", self.registration.scope).href, response.clone());
                }
                return response;
            } catch {
                const cached = await caches.match(new URL("./index.html", self.registration.scope).href);
                if (cached) return cached;
                return new Response(
                    "<!doctype html><html lang='ru'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>RecipePro</title><body style='font:16px system-ui;padding:24px;color:#20372f;background:#f7f3ed'><h1>RecipePro</h1><p>Офлайн-версия ещё не сохранена на этом устройстве.</p><p>Подключись к интернету, открой приложение на несколько секунд и повтори попытку.</p></body></html>",
                    { headers: { "Content-Type": "text/html; charset=utf-8" } }
                );
            }
        })());
        return;
    }

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) return cached;
        try {
            const response = await fetch(request);
            if (response.ok) await cache.put(request, response.clone());
            return response;
        } catch {
            return new Response("", { status: 503, statusText: "Offline asset unavailable" });
        }
    })());
});
