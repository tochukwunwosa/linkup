import type { AutocompletePrediction } from "./types";

interface CacheEntry {
  predictions: AutocompletePrediction[];
  expiresAt: number;
}

/**
 * Fixed-capacity, TTL-based in-memory cache with FIFO eviction.
 *
 * Uses a plain Map so insertion order is preserved, making it trivial to evict
 * the oldest entry when capacity is reached.
 */
class PlacesAutocompleteCache {
  private readonly store = new Map<string, CacheEntry>();
  private readonly maxSize: number;
  private readonly ttlMs: number;

  constructor(maxSize: number, ttlMs: number) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  get(key: string): AutocompletePrediction[] | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.predictions;
  }

  set(key: string, predictions: AutocompletePrediction[]): void {
    // Evict oldest entry if at capacity
    if (this.store.size >= this.maxSize) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey !== undefined) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      predictions,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  /**
   * Build a cache key from the user's input and their session token.
   * Keying by session token means cached entries are scoped to the current
   * session — no cross-user data leakage and Google session billing remains
   * correct (the same session token is used for both autocomplete and details).
   */
  buildKey(input: string, sessionToken: string): string {
    return `${input.toLowerCase().trim()}:${sessionToken}`;
  }
}

// ─── Module-level singleton ───────────────────────────────────────────────────
// Attached to `globalThis` so it survives Next.js hot-module reloads in dev
// and is shared across all route handler invocations in a single process.
const CACHE_SYMBOL = "__placesAutocompleteCache__";
type GlobalWithCache = typeof globalThis & {
  [CACHE_SYMBOL]?: PlacesAutocompleteCache;
};

const g = globalThis as GlobalWithCache;

if (!g[CACHE_SYMBOL]) {
  // 500 entries · 5-minute TTL
  g[CACHE_SYMBOL] = new PlacesAutocompleteCache(500, 5 * 60 * 1_000);
}

export const autocompleteCache = g[CACHE_SYMBOL]!;
