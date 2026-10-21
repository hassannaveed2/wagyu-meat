import fs from "node:fs/promises";
import { resolveUploadPath } from "@/lib/storage";

export async function GET(_request: Request, { params }: RouteContext<"/uploads/[...path]">) {
  const { path } = await params;
  const file = resolveUploadPath(path);
  if (!file) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": "image/webp",
        // Names are content-unique, so uploads can be cached forever.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
