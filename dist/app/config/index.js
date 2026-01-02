"use strict";
// import dotenv from "dotenv";
// import path from "path";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// dotenv.config({ path: path.resolve(process.cwd(), ".env") });
// function getEnv(key: string, fallback?: string): string {
//   const value = process.env[key] || fallback;
//   if (!value) {
//     throw new Error(`❌ Missing required env variable: ${key}`);
//   }
//   return value;
// }
// export const config = {
//   app: {
//     nodeEnv: process.env.NODE_ENV || 'production',
//     port: Number(getEnv("PORT", "5000")),
//   },
//   database: {
//     url: getEnv("DATABASE_URL"),
//   },
//   cors: {
//     allowedOrigin: getEnv("ALLOWED_ORIGIN"),
//   },
//   jwt: {
//     access_token_secret: getEnv("ACCESS_TOKEN_SECRET"),
//     access_token_secret_expires_in: getEnv("ACCESS_TOKEN_SECRET_EXPIRES_IN"),
//     refresh_token_secret: getEnv("REFRESH_TOKEN_SECRET"),
//     refresh_token_secret_expires_in: getEnv("REFRESH_TOKEN_SECRET_EXPIRES_IN"),
//   },
// };
function getEnv(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Missing env variable: ${key}`);
    }
    return value;
}
exports.config = {
    app: {
        nodeEnv: getEnv('NODE_ENV', 'production'),
    },
    database: {
        url: getEnv('DATABASE_URL'),
    },
    cors: {
        allowedOrigin: getEnv('ALLOWED_ORIGIN'),
    },
};
