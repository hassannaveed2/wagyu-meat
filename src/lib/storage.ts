import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * Local-disk image storage for admin uploads. Files live outside `public/` (Next only serves
 * public files present at build time) and are served by `src/app/uploads/[...path]/route.ts`.
 * Swap this module for an S3/DigitalOcean Spaces implementation when deploying to more than one server.
 */
export const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR ?? "storage/uploads");
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export class UploadError extends Error {}

/** Validates, converts to WebP (max 1800px wide) and stores an image. Returns its public URL. */
export async function saveImageUpload(file: File): Promise<string> {
  if (!ACCEPTED.has(file.type)) throw new UploadError("Only JPEG, PNG, WebP or AVIF images are accepted.");
  if (file.size > MAX_BYTES) throw new UploadError("Images must be 8 MB or smaller.");

  const input = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.webp`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await sharp(input).rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name));
  } catch {
    throw new UploadError("That file could not be read as an image.");
  }
  return `/uploads/${name}`;
}

/** Resolves an upload URL path to a file inside UPLOAD_DIR, refusing anything that escapes it. */
export function resolveUploadPath(segments: string[]): string | null {
  const name = segments.join("/");
  if (!/^[a-z0-9-]+\.webp$/.test(name)) return null;
  return path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, name);
}
