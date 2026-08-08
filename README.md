AI Document Insights Platform

A full-stack document management platform built with React, Node.js, Express, and MongoDB. The application supports PDF/TXT uploads, text extraction, AI-generated summaries, semantic search using vector embeddings, and role-based access for users and administrators.

The backend uses Groq for LLM-based summarization and Hugging Face for generating document/query embeddings. Embeddings are stored in MongoDB Atlas and queried through Atlas Vector Search. Redis is used as an optional cache for semantic search results.

Project status: Production-ready assessment project / deployed

Features

Document Management

Upload PDF and TXT documents

Maximum upload size: 5 MB

Server-side file type validation

PDF text extraction using pdf-parse

Document metadata and processing status tracking

Paginated document listing

Document details with extracted text and generated summary

User-level document ownership

Admin-level document management

AI Processing

AI-powered document summarization using Groq

llama-3.3-70b-versatile configured as the default Groq model

Structured Markdown summaries

Large-document chunking and multi-step summarization

Embedding generation through Hugging Face

Configurable Hugging Face embedding model

Semantic Search

Natural-language document search

Query embedding generation

MongoDB Atlas Vector Search

Similarity-ranked search results

Search result caching with Redis

Only successfully processed documents are included in vector search

Authentication & Authorization

User registration and login

Password hashing with bcrypt

JWT-based authentication

JWT stored in an HttpOnly cookie

User and admin roles

Protected frontend routes

Backend role-based authorization middleware

Admin

Dashboard statistics

Platform-wide document listing

Document status filtering

Document deletion

AI summary regeneration

Processing and success/failure metrics


Backend & Security

TypeScript throughout the backend and frontend

Express 5 REST API

Zod validation

Helmet security headers

CORS with credentials

Request rate limiting

Compression

Morgan request logging

Centralized error handling

Environment variable validation

Swagger/OpenAPI documentation

Infrastructure

Dockerfiles for frontend and backend

Multi-stage Docker builds

Nginx for serving the production frontend container

Container health checks

Redis support

MongoDB Atlas integration

Vercel SPA rewrite configuration for frontend deployment

Architecture

                           ┌──────────────────────┐
                           │      React App       │
                           │ React + TypeScript   │
                           │ Tailwind CSS + Axios │
                           └──────────┬───────────┘
                                      │
                              HTTP / HttpOnly Cookie
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │     Express API      │
                           │ Node.js + TypeScript │
                           └──────────┬───────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
     ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
     │ MongoDB Atlas  │      │     Redis      │      │     AI APIs    │
     │                │      │    ioredis     │      │                │
     │ Documents      │      │ Search Cache   │      │ Groq           │
     │ Users          │      │                │      │ Hugging Face   │
     │ Vector Search  │      └────────────────┘      └────────────────┘
     └────────────────┘

Document Processing Flow

When a document is uploaded, the backend processes it synchronously through the following pipeline:

PDF / TXT Upload
       │
       ▼
Multer Validation
       │
       ▼
Text Extraction
       │
       ▼
Document Stored in MongoDB
       │
       ▼
AI Summary Generation ──────────────┐
       │                            │
       │                            ▼
       │                    Groq LLM Processing
       │                            │
       │                            ▼
       │                       Final Summary
       │
       ▼
Embedding Generation
       │
       ▼
Hugging Face Embedding Model
       │
       ▼
Embedding Stored in MongoDB
       │
       ▼
processingStatus = completed

If processing fails, the document is retained with processingStatus = failed and the processing error is stored for visibility.

Semantic Search Flow

Semantic search is based on vector similarity rather than keyword matching.

User Search Query
       │
       ▼
Normalize Query
       │
       ▼
Check Redis Cache
       │
       ├── Cache Hit ───────────────► Return Results
       │
       ▼
Hugging Face Embedding
       │
       ▼
Query Vector
       │
       ▼
MongoDB Atlas Vector Search
       │
       ▼
Similarity Ranking
       │
       ▼
Cache Results in Redis
       │
       ▼
Return Relevant Documents

Search results include the document title, original filename, summary, creation date, and similarity score.

AI Implementation

Groq

Groq is used for document summarization through its chat-completion API.

The default model is:

llama-3.3-70b-versatile

For normal-sized documents, the extracted text is summarized in a single request.

For larger documents:

Text is split into chunks.

Each chunk is summarized separately.

The individual summaries are combined into a final structured summary.

The generated summary uses these sections:

## Executive Summary
## Key Points
## Important Technologies
## Conclusion

Hugging Face

Hugging Face is used to generate embeddings through the configured feature-extraction model.

Default configuration:

sentence-transformers/all-MiniLM-L6-v2

The same embedding service is used for both:

Document embeddings during document processing

Query embeddings during semantic search

MongoDB Atlas Vector Search

Document embeddings are stored alongside document records in MongoDB.

The vector search pipeline:

Uses the configured Atlas Vector Search index

Searches the embedding field

Uses a configurable result limit

Filters results to processingStatus = completed

Returns MongoDB's vectorSearchScore

Sorts results by similarity score

Tech Stack

Area

Technology

Frontend

React 19, TypeScript, Vite

Styling

Tailwind CSS 4

Routing

React Router 7

Forms

React Hook Form

Validation

Zod

HTTP Client

Axios

Backend

Node.js, Express 5, TypeScript

Database

MongoDB Atlas, Mongoose

Vector Search

MongoDB Atlas Vector Search

LLM

Groq

LLM Model

Llama 3.3 70B Versatile

Embeddings

Hugging Face

Embedding Model

sentence-transformers/all-MiniLM-L6-v2

Cache

Redis, ioredis

Authentication

JWT, HttpOnly Cookies

Password Hashing

bcryptjs

File Upload

Multer

PDF Extraction

pdf-parse

API Documentation

Swagger UI, OpenAPI

Web Server

Nginx

Containers

Docker

Frontend Deployment Config

Vercel

Project Structure

AI-DOCUMENT-PLATFORM/
│
├── backend/
│   ├── src/
│   │   ├── config/          # Environment, database and Swagger configuration
│   │   ├── constants/       # AI prompts and embedding/search constants
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── lib/             # JWT, cookies and Redis clients
│   │   ├── middleware/      # Auth, RBAC, validation, uploads, rate limiting
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # REST API routes
│   │   ├── services/        # Business logic and AI/search services
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Text extraction, chunking, mappers and helpers
│   │   ├── validators/      # Zod request schemas
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Application bootstrap and graceful shutdown
│   │
│   ├── tests/
│   ├── uploads/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Application-level setup
│   │   ├── components/      # Reusable UI and feature components
│   │   ├── context/         # Authentication and toast contexts
│   │   ├── features/        # Feature-specific modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Axios client and frontend constants
│   │   ├── pages/           # Route-level pages
│   │   ├── routes/          # Routing and route guards
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles
│   │   ├── types/           # Frontend TypeScript types
│   │   └── utils/           # Frontend utilities
│   │
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

Prerequisites

Before running the application locally, install/configure:

Node.js 18+

MongoDB Atlas cluster

MongoDB Atlas Vector Search index

Groq API key

Hugging Face API key

Redis (optional; semantic-search caching is disabled when Redis is unavailable)

Git

Docker is optional for containerized development.

Getting Started

1. Clone the repository

git clone https://github.com/pratibhapatel08/ai-document-platform.git
cd AI-DOCUMENT-PLATFORM

2. Configure the backend

cd backend
npm install

Create the environment file:

cp .env.example .env

Update the values in backend/.env.

Start the backend:

npm run dev

The API runs on:

http://localhost:5000

API base path:

http://localhost:5000/api

3. Configure the frontend

Open a new terminal:

cd frontend
npm install

Create the environment file:

cp .env.example .env

For local development:

VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=AI Document Insights

Start the frontend:

npm run dev

The frontend is available at:

http://localhost:5173

Environment Variables

Backend

Create:

backend/.env

Required configuration:

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=<mongodb-atlas-connection-string>

JWT_SECRET=<minimum-32-character-secret>
JWT_EXPIRES_IN=7d
COOKIE_NAME=token

GROQ_API_KEY=<groq-api-key>
GROQ_CHAT_MODEL=llama-3.3-70b-versatile

HUGGINGFACE_API_KEY=<hugging-face-api-key>
HUGGINGFACE_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

ATLAS_VECTOR_SEARCH_INDEX=document_vector_index
VECTOR_SEARCH_LIMIT=10

REDIS_URL=redis://localhost:6379
CACHE_TTL_SECONDS=300

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=20

TRUST_PROXY=false

Do not commit .env files or API credentials to source control.

Frontend

VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=AI Document Insights

API Reference

All API routes are prefixed with:

/api

Health

Method

Endpoint

Access

Description

GET

/api/health

Public

API health check

Authentication

Method

Endpoint

Access

Description

POST

/api/auth/register

Public

Register a user

POST

/api/auth/login

Public

Authenticate a user

GET

/api/auth/profile

Authenticated

Get current user profile

Documents

Method

Endpoint

Access

Description

POST

/api/documents/upload

Authenticated

Upload and process a PDF/TXT document

GET

/api/documents

Authenticated

List accessible documents

GET

/api/documents/:id

Authenticated

Get a document by ID

DELETE

/api/documents/:id

Authenticated

Delete a document

GET

/api/documents/search?q=

Authenticated

Perform semantic search

Admin

Method

Endpoint

Access

Description

GET

/api/admin/dashboard

Admin

Get dashboard statistics

GET

/api/admin/documents

Admin

List all platform documents

POST

/api/admin/refresh-summary/:id

Admin

Regenerate a document summary

Authentication Model

Authentication is handled with JWTs stored in an HttpOnly cookie.

Register / Login
       │
       ▼
JWT generated
       │
       ▼
HttpOnly cookie
       │
       ▼
Browser sends cookie automatically
       │
       ▼
authenticate middleware
       │
       ▼
Verify JWT
       │
       ▼
Load user
       │
       ▼
Attach authenticated user to request

The application does not store the JWT in localStorage.

In production, the authentication cookie is configured as:

HttpOnly

Secure

SameSite=Strict

Role-Based Access Control

Two roles are supported:

Role

Capabilities

User

Upload, view, search and delete owned documents

Admin

Access admin dashboard, view/manage platform documents and regenerate summaries

Backend authorization is enforced with middleware, so frontend route protection is not the only access-control layer.

File Processing

Supported file types:

PDF
TXT

Maximum file size:

5 MB

Uploaded files are stored using generated UUID-based filenames to avoid relying on the original filename for storage.

Text extraction is handled by:

pdf-parse for PDF files

Node.js filesystem APIs for TXT files

Redis Caching

Redis is optional.

When Redis is available, semantic search results are cached using a SHA-256 based cache key.

Default TTL:

300 seconds

If Redis is unavailable, the application continues to operate without caching.

This allows local development without requiring Redis while keeping caching available in environments where Redis is configured.

Validation & Security

The backend applies validation and security controls at multiple layers.

Request Validation

Zod schemas validate:

Authentication payloads

Document upload data

Document IDs

Document list queries

Admin queries

Semantic search queries

Security Middleware

Helmet

CORS

HttpOnly cookies

JWT verification

Role-based authorization

Rate limiting

Request body limits

File type validation

File size limits

Centralized error handling

Rate Limits

Default configuration:

General API:
100 requests / 15 minutes

Authentication:
20 requests / 15 minutes

API Documentation

Swagger UI is available locally at:

http://localhost:5000/api/docs

OpenAPI JSON:

http://localhost:5000/api/docs.json

The Swagger configuration is maintained in:

backend/src/config/swagger.ts

Production Deployment

The application is designed to run as separate frontend and backend services.

Deployment Components

GitHub Repository
       │
       ├── Frontend Docker Image
       │        ↓
       │     Frontend Hosting
       │
       └── Backend Docker Image
                ↓
           Backend Hosting
                │
        ┌───────┼────────┐
        ↓       ↓        ↓
   MongoDB   Groq     Hugging Face
    Atlas      │          │
        │      └──────┬───┘
        │             ↓
        └────── Backend API
                 │
               Redis

CI/CD

The recommended production workflow is:

Git Push
   ↓
GitHub Actions
   ↓
Install Dependencies
   ↓
Build / Validate
   ↓
Build Docker Images
   ↓
Deploy
   ↓
Health Check

Production secrets must be configured in the hosting platform's environmentvariables or GitHub Actions secrets and must not be committed to the repository.

Docker

Both applications include production-oriented Dockerfiles.

Backend

The backend Dockerfile uses a multi-stage build:

Node 20 Alpine
      ↓
Install dependencies
      ↓
Compile TypeScript
      ↓
Production image
      ↓
Run as non-root user

It also includes a container health check against:

/api/health

Frontend

The frontend Dockerfile uses:

Node 20 Alpine
      ↓
Vite production build
      ↓
Nginx Alpine
      ↓
Serve static assets

Nginx is configured for:

SPA fallback routing

Gzip compression

Long-term static asset caching

Build the frontend image:

cd frontend
docker build -t ai-document-frontend .

Build the backend image:

cd backend
docker build -t ai-document-backend .

Run the backend container:

docker run --env-file .env -p 5000:5000 ai-document-backend

Run the frontend container:

docker run -p 8080:80 ai-document-frontend

MongoDB is hosted through MongoDB Atlas rather than a local MongoDB container.

Available Scripts

Backend

npm run dev

Starts the development server using tsx.

npm run build

Compiles TypeScript to dist.

npm start

Runs the compiled backend.

npm run typecheck

Runs TypeScript type checking without emitting files.

npm run lint

Runs the configured TypeScript-based lint/typecheck command.

Frontend

npm run dev

Starts the Vite development server.

npm run build

Runs TypeScript build checks and creates the Vite production bundle.

npm run preview

Serves the production build locally.

npm run typecheck

Runs TypeScript checks without emitting files.

npm run lint

Runs the configured TypeScript-based lint/typecheck command.

Testing

The repository contains test directory placeholders for:

backend/tests/
├── unit/
├── integration/
└── e2e/

frontend/tests/
├── unit/
└── e2e/

Automated test coverage is planned as a future improvement.

Current Limitations

The following items are intentionally not part of the current implementation:

Refresh-token rotation

Server-side logout endpoint

Background document processing queue

Object storage such as S3

Detailed user management

Real-time processing updates

Multi-tenant organizations

Document collaboration/sharing

Automated unit/integration/e2e test suite

The frontend's Users page currently provides an overview and indicates that detailed user management is planned for a future release.

Roadmap

Add refresh-token rotation

Add server-side logout endpoint

Move document processing to a background job queue

Add S3 or equivalent object storage

Implement detailed user management

Add automated unit and integration tests

Add end-to-end testing

Add real-time processing status updates

Add multi-tenant organization support

Add document sharing and collaboration

Project Status

The application is configured for local development and production deployment.

Production deployment follows the same application workflow validated locally:

Authentication
      ↓
Document Upload
      ↓
Text Extraction
      ↓
AI Summary
      ↓
Embedding Generation
      ↓
MongoDB Vector Storage
      ↓
Semantic Search
      ↓
Redis Cache

Demo / Interview Access

For assessment and interview testing, provide the deployed application URL andseparate demo credentials to the evaluator.

Live Application

Frontend: https://ai-document-platform-frontend.onrender.com
Backend API: https://ai-document-platform-f08a.onrender.com
Swagger: https://ai-document-platform-f08a.onrender.com/api/docs

Admin Demo Account

Email: test3@example.com
Password: Test12345

User Demo Account

Email: <USER_EMAIL>
Password: <USER_PASSWORD>

>Security Note: The credentials provided above are for application login only.
> Sensitive credentials such as MongoDB Atlas credentials, API keys, JWT secrets,
> and production environment variables are not included in this repository.
RBAC Test Flow

The evaluator can verify the following:

Log in with the User account and access user-level document features.

Log in with the Admin account and access the Admin Dashboard.

Verify that admin-only API operations are protected by backend RBAC middleware.

Verify document upload, AI summary generation, and semantic search.

Verify that user-owned document access is separated from platform-wide admin access.

License

MIT