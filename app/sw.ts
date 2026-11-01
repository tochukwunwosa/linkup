/// <reference lib="webworker" />
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkFirst, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Injected at build time by @serwist/next.
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Never cache these: search engines must always get the live versions.
const isSeoFile = (pathname: string) =>
  pathname === "/sitemap.xml" || pathname === "/robots.txt";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    {
      // Home page: network first, cached copy when offline.
      matcher: ({ request, url, sameOrigin }) =>
        sameOrigin && request.mode === "navigate" && url.pathname === "/",
      handler: new NetworkFirst({ cacheName: "start-url" }),
    },
    {
      // Same-origin JSON/XML/CSV data files, except the SEO files.
      matcher: ({ url, sameOrigin }) =>
        sameOrigin &&
        /\.(?:json|xml|csv)$/i.test(url.pathname) &&
        !isSeoFile(url.pathname),
      handler: new NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
    },
  ],
  fallbacks: {
    entries: [
      {
        // Show the offline page when a page can't load without a connection.
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

// The old next-pwa worker used workbox-* cache names. Remove them so returning
// visitors don't keep stale copies taking up space on their phones.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("workbox-"))
            .map((key) => caches.delete(key))
        )
      )
  );
});

serwist.addEventListeners();
