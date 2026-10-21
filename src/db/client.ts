import "server-only";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { connectionOptions } from "./connection";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

// Reuse one pool across hot reloads in development.
const globalForDb = globalThis as unknown as { wagyuPool?: mysql.Pool; wagyuDb?: Db };

function createDb(): Db {
  const pool =
    globalForDb.wagyuPool ??
    mysql.createPool({
      ...connectionOptions(),
      // Cached queries run concurrently while rendering; keep enough connections that
      // they rarely queue behind each other.
      connectionLimit: 25,
      waitForConnections: true,
      // Managed MySQL drops idle connections; recycle them before the server does.
      maxIdle: 5,
      idleTimeout: 60_000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
      connectTimeout: 20_000,
    });
  globalForDb.wagyuPool = pool;
  return drizzle(pool, { schema, mode: "default" });
}

export const db: Db = globalForDb.wagyuDb ?? (globalForDb.wagyuDb = createDb());
