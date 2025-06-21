// Use a generic type for cache values
const cache = new Map<string, unknown>();

export function getCache<T = unknown>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setCache<T = unknown>(key: string, value: T): void {
  cache.set(key, value);
}

export function clearCache(): void {
  cache.clear();
}
