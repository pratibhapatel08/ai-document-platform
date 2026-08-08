import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  CLIENT_URL: z.string().url().default("http://localhost:5173"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_EXPIRES_IN: z.string().min(1).default("7d"),

  COOKIE_NAME: z.string().min(1).default("token"),

  // Groq - AI text generation
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  GROQ_CHAT_MODEL: z.string().default("llama-3.3-70b-versatile"),

  // Hugging Face - Embeddings
  HUGGINGFACE_API_KEY: z
    .string()
    .min(1, "HUGGINGFACE_API_KEY is required"),

  HUGGINGFACE_EMBEDDING_MODEL: z
    .string()
    .default("sentence-transformers/all-MiniLM-L6-v2"),

  // Summary configuration
  OPENAI_SUMMARY_MAX_CHUNK_CHARS: z.coerce
    .number()
    .int()
    .positive()
    .default(12000),

  OPENAI_SUMMARY_SINGLE_PASS_MAX_CHARS: z.coerce
    .number()
    .int()
    .positive()
    .default(80000),

  // MongoDB Atlas Vector Search
  ATLAS_VECTOR_SEARCH_INDEX: z
    .string()
    .min(1)
    .default("document_vector_index"),

  VECTOR_SEARCH_LIMIT: z.coerce
    .number()
    .int()
    .positive()
    .max(50)
    .default(10),

  // Redis
  REDIS_URL: z.string().url().optional(),

  CACHE_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(300),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(900_000),

  RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(100),

  AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce
    .number()
    .int()
    .positive()
    .default(20),

  // Production proxy
  TRUST_PROXY: z.coerce.boolean().default(false),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = parsed.data;