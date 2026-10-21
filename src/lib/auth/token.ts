import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "wm_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AdminRole = "admin" | "staff";

export type Session = {
  userId: number;
  email: string;
  name: string;
  role: AdminRole;
};

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(session: Session, now: Date = new Date()): Promise<string> {
  const iat = Math.floor(now.getTime() / 1000);
  return new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.userId))
    .setIssuedAt(iat)
    .setExpirationTime(iat + SESSION_TTL_SECONDS)
    .sign(secretKey());
}

/** Returns the session for a valid, unexpired token; null for anything else. */
export async function verifySessionToken(
  token: string | undefined,
  now: Date = new Date(),
): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
      currentDate: now,
    });
    const role = payload.role;
    if (role !== "admin" && role !== "staff") return null;
    return {
      userId: Number(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role,
    };
  } catch {
    return null;
  }
}
