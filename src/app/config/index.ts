import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
  return value;
}

export const config = {
  app: {
    nodeEnv: getEnv("NODE_ENV"),
    port: Number(getEnv("PORT", "5000")),
  },
  database: {
    url: getEnv("DATABASE_URL"),
  },
  cors: {
    allowedOrigin: getEnv("ALLOWED_ORIGIN"),
  },
  jwt: {
    access_token_secret: getEnv("ACCESS_TOKEN_SECRET"),
    access_token_secret_expires_in: getEnv("ACCESS_TOKEN_SECRET_EXPIRES_IN"),
    refresh_token_secret: getEnv("REFRESH_TOKEN_SECRET"),
    refresh_token_secret_expires_in: getEnv("REFRESH_TOKEN_SECRET_EXPIRES_IN"),
  },
};
