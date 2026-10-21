import { describe, expect, it } from "vitest";
import { createRateLimiter } from "../rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    const t = 10_000;
    expect([1, 2, 3].map(() => limiter.hit("ip", t))).toEqual([true, true, true]);
    expect(limiter.hit("ip", t + 10)).toBe(false);
  });

  it("resets after the window passes", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.hit("ip", 0)).toBe(true);
    expect(limiter.hit("ip", 500)).toBe(false);
    expect(limiter.hit("ip", 1001)).toBe(true);
  });

  it("tracks keys independently and can be cleared", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.hit("a", 0)).toBe(true);
    expect(limiter.hit("b", 0)).toBe(true);
    limiter.reset("a");
    expect(limiter.hit("a", 1)).toBe(true);
  });
});
