import NodeCache = require('node-cache');

const cache = new NodeCache();

export function cacheGet<T>(key: string, ttl: number, f: () => T): T {
  if (cache.has(key)) {
    return cache.get<T>(key);
  }

  const value = f();
  cache.set(key, value, ttl);
  return value;
}
