import fs from "node:fs";
import type { ConnectionOptions } from "mysql2";

/**
 * TLS for DigitalOcean managed MySQL. With DATABASE_CA_CERT the server certificate is
 * verified. Without it the connection is still encrypted but unverified, which is only
 * allowed outside production unless DATABASE_ALLOW_UNVERIFIED_TLS=true.
 */
function sslOptions(): ConnectionOptions["ssl"] {
  const caPath = process.env.DATABASE_CA_CERT;
  if (caPath) return { ca: fs.readFileSync(caPath, "utf8"), rejectUnauthorized: true };

  const allowUnverified =
    process.env.NODE_ENV !== "production" || process.env.DATABASE_ALLOW_UNVERIFIED_TLS === "true";
  if (!allowUnverified) {
    throw new Error("DATABASE_CA_CERT is required in production for verified TLS to MySQL");
  }
  return { rejectUnauthorized: false };
}

export function connectionOptions(): ConnectionOptions {
  const { DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;
  if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_NAME) {
    throw new Error("DATABASE_HOST, DATABASE_USER and DATABASE_NAME must be set");
  }
  return {
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT ?? 3306),
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    ssl: sslOptions(),
    timezone: "Z",
  };
}
