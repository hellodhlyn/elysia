import NodeCache = require('node-cache');

const cache = new NodeCache();

export async function cacheGet<T>(key: string, ttl: number, f: () => (T | Promise<T>)): Promise<T> {
  if (cache.has(key)) {
    return cache.get<T>(key);
  }

  const value = await Promise.resolve(f());
  cache.set(key, value, ttl);
  return value;
}
