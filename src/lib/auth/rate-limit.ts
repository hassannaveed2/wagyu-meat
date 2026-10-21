type Window = { count: number; resetAt: number };

/** Fixed-window, in-memory limiter. Per server instance; adequate for admin login. */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  return {
    /** Records an attempt; returns false once the key is over its limit. */
    hit(key: string, now: number = Date.now()): boolean {
      const current = windows.get(key);
      if (!current || now >= current.resetAt) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      current.count += 1;
      return current.count <= limit;
    },
    reset(key: string): void {
      windows.delete(key);
    },
  };
}
