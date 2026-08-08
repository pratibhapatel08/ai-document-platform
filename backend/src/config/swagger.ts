import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "AI Document Insights & Management Platform API",
    version: "1.0.0",
    description:
      "Production API for document upload, AI summarization, semantic search, and admin management.",
    contact: {
      name: "Platform Support",
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}/api`,
      description: "Local development",
    },
    {
      url: "https://your-backend.onrender.com/api",
      description: "Production (Render)",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: env.COOKIE_NAME,
        description: "HttpOnly JWT cookie set after login/register",
      },
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string" },
          data: { type: "object" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "object" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      UploadDocumentRequest: {
        type: "object",
        required: ["title", "file"],
        properties: {
          title: { type: "string" },
          file: { type: "string", format: "binary" },
        },
      },
    },
  },
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Auth", description: "Authentication and profile" },
    { name: "Documents", description: "Document upload and management" },
    { name: "Search", description: "Semantic vector search" },
    { name: "Admin", description: "Admin-only operations" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Server is running" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          400: { description: "Validation error" },
          409: { description: "Email already exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Get current user profile",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Profile retrieved" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/documents": {
      get: {
        tags: ["Documents"],
        summary: "List documents (paginated)",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Documents list" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/documents/upload": {
      post: {
        tags: ["Documents"],
        summary: "Upload a document (PDF/TXT, max 5MB)",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/UploadDocumentRequest" },
            },
          },
        },
        responses: {
          201: { description: "Document uploaded" },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/documents/search": {
      get: {
        tags: ["Search"],
        summary: "Semantic vector search",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Search results ranked by similarity",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    results: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          title: { type: "string" },
                          originalFileName: { type: "string" },
                          summary: { type: "string" },
                          score: { type: "number" },
                          createdAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/documents/{id}": {
      get: {
        tags: ["Documents"],
        summary: "Get document by ID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Document details" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Documents"],
        summary: "Delete document",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Document deleted" },
          403: { description: "Forbidden" },
          404: { description: "Not found" },
        },
      },
    },
    "/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Get admin dashboard statistics",
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: "Dashboard stats" }, 403: { description: "Admin only" } },
      },
    },
    "/admin/documents": {
      get: {
        tags: ["Admin"],
        summary: "List all documents (admin)",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["all", "processing", "completed", "failed"] } },
        ],
        responses: { 200: { description: "Admin documents list" } },
      },
    },
    "/admin/refresh-summary/{id}": {
      post: {
        tags: ["Admin"],
        summary: "Regenerate AI summary for a document",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Summary refreshed" }, 404: { description: "Not found" } },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});
