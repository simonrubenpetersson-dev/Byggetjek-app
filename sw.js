// Byggetjek service worker: app-skallen caches, så appen åbner uden net på byggepladsen.
// Data ligger i prototypen lokalt i browseren. Med Supabase: læg en kø af ændringer
// i IndexedDB og synkronisér ved 'online'-eventet (se README).
const CACHE = "byggetjek-20261104-1008";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" }).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html")))
  );
});
