import { beforeAll, describe, expect, it } from "vitest";
import { SESSION_TTL_SECONDS, signSessionToken, verifySessionToken, type Session } from "../token";

const session: Session = { userId: 7, email: "staff@wagyumeat.pk", name: "Staff", role: "staff" };

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-test-secret-test-secret-1234";
});

describe("session tokens", () => {
  it("round-trips a valid token", async () => {
    const token = await signSessionToken(session);
    expect(await verifySessionToken(token)).toEqual(session);
  });

  it("rejects a tampered token", async () => {
    const token = await signSessionToken(session);
    const [header, payload, signature] = token.split(".");
    const forged = JSON.parse(Buffer.from(payload, "base64url").toString());
    forged.role = "admin";
    const tampered = [header, Buffer.from(JSON.stringify(forged)).toString("base64url"), signature].join(".");
    expect(await verifySessionToken(tampered)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const issued = new Date("2026-01-01T00:00:00Z");
    const token = await signSessionToken(session, issued);
    const later = new Date(issued.getTime() + (SESSION_TTL_SECONDS + 60) * 1000);
    expect(await verifySessionToken(token, later)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSessionToken(session);
    process.env.AUTH_SECRET = "another-secret-another-secret-another-99";
    expect(await verifySessionToken(token)).toBeNull();
    process.env.AUTH_SECRET = "test-secret-test-secret-test-secret-1234";
  });

  it("returns null for missing or garbage input", async () => {
    expect(await verifySessionToken(undefined)).toBeNull();
    expect(await verifySessionToken("not-a-jwt")).toBeNull();
  });
});
