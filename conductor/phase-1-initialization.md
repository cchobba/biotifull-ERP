# Phase 1: Project Initialization & Environment Setup

## Objective
Set up the core infrastructure for the Bio-tiful Core ERP System, ensuring all free-tier architectural constraints (Neon serverless driver, Drizzle ORM, Next.js App Router) are correctly configured.

## Key Files & Context
- **PRD.txt:** Technical architecture and schema requirements.
- **GEMINI.md:** Project overview and free-tier operational rules.

## Implementation Steps

### 1. Project Initialization
- Initialize Next.js (v14+) in the root directory:
  - `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- Remove boilerplate files from `src/app/`.

### 2. Dependency Installation
- **Core Dependencies:**
  - `drizzle-orm`: Lightweight ORM.
  - `@neondatabase/serverless`: Neon's HTTP-based driver (mandatory for free tier).
  - `next-auth@beta`: Authentication (Auth.js v5).
  - `zod`: Schema validation.
  - `lucide-react`: UI icons.
  - `clsx`, `tailwind-merge`: CSS utility helpers.
- **Development Dependencies:**
  - `drizzle-kit`: CLI for migrations.
  - `@types/node`, `@types/react`, `@types/react-dom`: TypeScript types.

### 3. Database Configuration
- **Schema Definition (`src/db/schema.ts`):** 
  - Translate the schema from `PRD.txt` into Drizzle TypeScript definitions (Users, Customers, Products, Orders, Order Items, Payments).
- **Client Configuration (`src/db/index.ts`):**
  - Implement the `neon()` HTTP-based connection.
  - Export the `db` instance for use in Server Components.
- **Drizzle Config (`drizzle.config.ts`):**
  - Configure `drizzle-kit` to point to the schema and migration output folder.

### 4. Environment Setup
- Create `.env.example` with:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`

## Verification & Testing
- Run `npm run build` to ensure project integrity.
- Run `npx drizzle-kit generate` to verify schema definitions.
- Verify that `src/db/index.ts` uses the `neon()` function from `@neondatabase/serverless` and NOT `Pool()`.
