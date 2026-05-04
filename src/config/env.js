import dotenv from "dotenv";

dotenv.config({ path: '/Users/harsh/projects/coaching-ai-bot/.env', override: false });

const PORT = "";
const ENVIRONMENT = "";
const DB_URL = "";
const GEMINI_API_KEY = "";
const WHATSAPP_MASTER_TOKEN = "";
const WEBHOOK_VERIFY_TOKEN = "";
const META_APP_ID = "";
const NGROK_AUTHTOKEN = "";
const REDIS_HOST = ""; // 127.0.0.1 or Container name
const REDIS_PORT = ""; // 6379


export const env = {
    DB_URL: process.env.DB_URL || "",
}