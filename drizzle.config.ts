import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { connectionOptions } from "./src/db/connection";

const { host, port, user, password, database, ssl } = connectionOptions();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: host!,
    port,
    user,
    password,
    database: database!,
    ssl: ssl as object,
  },
});
