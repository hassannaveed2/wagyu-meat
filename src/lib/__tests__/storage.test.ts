import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { resolveUploadPath } = await import("../storage");

describe("resolveUploadPath", () => {
  it("accepts generated upload names", () => {
    expect(resolveUploadPath(["lk2x9a-0a1b2c3d4e5f.webp"])).toMatch(/lk2x9a-0a1b2c3d4e5f\.webp$/);
  });

  it.each([["..", "..", ".env"], ["../secret.webp"], ["a", "b.webp"], ["photo.png"], ["UPPER.webp"]])(
    "rejects %j",
    (...segments) => {
      expect(resolveUploadPath(segments)).toBeNull();
    },
  );
});
