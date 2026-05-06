// Prisma configuration file
// See: https://pris.ly/prisma-config
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Uses DATABASE_URL from .env
    // For Neon: set DIRECT_DATABASE_URL for migrations (direct connection, bypasses pooler)
    url: process.env["DATABASE_URL"],
  },
});
