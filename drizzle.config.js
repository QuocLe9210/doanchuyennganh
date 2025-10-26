// ...existing code...
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_oLswj1xPK0mV@ep-winter-scene-a4yd9dmy-pooler.us-east-1.aws.neon.tech/AI-Meterial-Study-Ge?sslmode=require&channel_binding=require'",
  },
});
