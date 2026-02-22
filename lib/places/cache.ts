import type { AutocompletePrediction } from "./types";

interface CacheEntry {
  predictions: AutocompletePrediction[];
  expiresAt: number;
}

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
    // Evict oldest entry if at capacity (FIFO)
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
   * Cache key = normalised input + session token.
   * Keying by session token keeps cache entries scoped to the current session
   * so Google's session-based billing remains correct.
   */
  buildKey(input: string, sessionToken: string): string {
    return `${input.toLowerCase().trim()}:${sessionToken}`;
  }
}

// ─── Module-level singleton ───────────────────────────────────────────────────
// In Next.js, route-handler modules are long-lived within a process.
// A simple module-level variable is enough — no globalThis hacks needed.
// In dev, HMR resets the cache on file edits, which is fine (it just repopulates).
export const autocompleteCache = new PlacesAutocompleteCache(500, 5 * 60 * 1_000);
