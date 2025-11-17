# PWA Service Worker SEO Fix

## Problem

Google Search Console reported "Sitemap could not be read" error for `https://tech-linkup.vercel.app/sitemap.xml`.

**Root Cause**: The PWA service worker (Workbox) was intercepting requests to SEO-critical files including:
- `/sitemap.xml`
- `/robots.txt`
- `/googleb9673e02aeda5a49.html` (Google Search Console verification)

While browsers could load these files (via service worker cache), Googlebot **does not execute service workers**, so it couldn't access the actual files.

## Solution

Modified `next.config.ts` to exclude SEO-critical files from service worker caching using three complementary strategies:

### 1. **publicExcludes** (Precache Exclusion)
```typescript
publicExcludes: [
  "!sitemap.xml",
  "!robots.txt",
  "!googleb9673e02aeda5a49.html",
]
```
Prevents these files from being added to the precache manifest.

### 2. **navigateFallbackDenylist** (Navigation Fallback Exclusion)
```typescript
navigateFallbackDenylist: [
  /^\/sitemap\.xml$/,
  /^\/robots\.txt$/,
  /^\/googleb9673e02aeda5a49\.html$/,
]
```
Prevents service worker from serving fallback content for these routes.

### 3. **runtimeCaching with NetworkOnly** (Runtime Strategy)
```typescript
runtimeCaching: [
  {
    urlPattern: ({ url }) =>
      url.pathname === "/sitemap.xml" ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/googleb9673e02aeda5a49.html",
    handler: "NetworkOnly",
  },
]
```
Forces service worker to **always** fetch from network, bypassing all caches.

## Verification

### 1. Check Build Output
When running `npm run build`, you should see:
```
○ (pwa) Custom runtimeCaching array found, using it instead of the default one.
```

### 2. Test in Browser DevTools
1. Open browser DevTools → Network tab
2. Clear all cache and service worker
3. Navigate to `https://tech-linkup.vercel.app/sitemap.xml`
4. Check Network tab:
   - ✅ Should show `200` from `document` or `fetch` (NOT from ServiceWorker)
   - ❌ Should NOT show `(ServiceWorker)` in the Type/Size column

### 3. Verify Service Worker Code
Check `public/sw.js` contains:
```javascript
new e.NetworkOnly
```

### 4. Google Search Console
After deployment:
1. Wait 24-48 hours for Googlebot to recrawl
2. Go to Google Search Console → Sitemaps
3. Click on sitemap URL
4. Status should change from "Couldn't fetch" to "Success"

## Additional Notes

- **Service Worker Registration**: PWA functionality remains intact; only SEO files bypass caching
- **Cache Strategy**: All other routes still use aggressive caching for performance
- **User Experience**: No impact on users; PWA install prompt and offline mode still work
- **SEO Impact**: Critical for Google to discover and index all pages listed in sitemap

## Related Files
- `next.config.ts` - PWA configuration
- `public/sw.js` - Generated service worker (auto-generated, do not edit manually)
- `public/sitemap.xml` - Generated sitemap (from `app/sitemap.xml/route.ts`)
- `app/robots.txt/route.ts` - Robots.txt generator

## References
- Issue: Service worker intercepting sitemap.xml preventing Googlebot access
- Fix committed: 2025-01-17
- Library: `@ducanh2912/next-pwa` v10.2.9
- Workbox version: Bundled with next-pwa

---

**Last Updated**: 2025-01-17
**Author**: Claude Code (Sonnet 4.5)
