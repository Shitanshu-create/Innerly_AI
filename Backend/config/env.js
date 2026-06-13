import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const requiredEnv = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET || process.env.jwtSecret,
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY
};

const missingEnv = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(", ")}`);
}

const parseBoolean = (value, fallback) => {
    if (value === undefined) return fallback;
    return value === "true";
};

const parseInteger = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInteger(process.env.PORT, 3000),
    mongoUri: requiredEnv.MONGO_URI,
    jwtSecret: requiredEnv.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    jsonLimit: process.env.JSON_LIMIT || "10mb",
    rateLimit: {
        windowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
        max: parseInteger(process.env.RATE_LIMIT_MAX, 300)
    },
    backendUrl: process.env.BACKEND_URL || `http://localhost:${parseInteger(process.env.PORT, 3000)}`,
    cookie: {
        secure: parseBoolean(process.env.COOKIE_SECURE, process.env.NODE_ENV === "production"),
        sameSite: process.env.COOKIE_SAME_SITE || "Lax",
        maxAge: parseInteger(process.env.COOKIE_MAX_AGE_MS, 24 * 60 * 60 * 1000)
    },
    csrfCookieName: process.env.CSRF_COOKIE_NAME || "_csrf",
    googleGenAiApiKey: requiredEnv.GOOGLE_GENAI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview",
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    githubClientId: process.env.GITHUB_CLIENT_ID || "",
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || ""
};

export default env;
