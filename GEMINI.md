# Bio-tiful Core ERP System

This repository serves as the foundational documentation and planning hub for the Bio-tiful Core ERP System.

## Project Overview

The Bio-tiful Core ERP is a highly optimized, full-scale ERP system designed to run on free-tier cloud infrastructure without performance degradation or service timeouts. It focuses on CRM, Inventory Management, and Order Processing for a web-based business.

### Core Architecture
- **Framework:** Next.js (v14+ App Router) using React Server Components (RSC).
- **Database:** Neon PostgreSQL (Free Tier) using the `@neondatabase/serverless` driver.
- **ORM:** Drizzle ORM (optimized for serverless cold starts).
- **Authentication:** Auth.js (v5) with Drizzle adapter.
- **Hosting:** Vercel (Hobby Plan).

## Key Files

- **PRD.txt:** The Product Requirements Document (Addendum). It contains the technical architecture, stack lock, free-tier optimization rules, and the initial database schema definition for Drizzle ORM.
- **GEMINI.md:** (This file) Provides context and instructions for AI agents working within this project.

## Technical Specifications

### Free-Tier Operational Constraints
To maintain stability on Vercel and Neon free tiers, developers MUST follow these rules:
1. **Connection Handling:** Use the `neon()` function for queries, NOT `Pool()`. Standard connection pooling libraries are not required as Neon's driver handles this natively.
2. **Data Fetching:** Pagination is **mandatory** for all list views (Orders, CRM, etc.) to prevent memory exhaustion and timeout errors.
3. **Heavy Operations:** Perform large data exports (e.g., CSV) on the client side (e.g., using `papaparse`) to avoid crashing Vercel serverless functions.
4. **Migrations:** Schema migrations must be run locally via Drizzle Kit before pushing code to GitHub/Vercel.

### Database Schema (Intended)
The project utilizes Drizzle ORM with the following core tables:
- `users`: Admin access control.
- `customers`: CRM data.
- `products`: Inventory and pricing.
- `orders`: Order management.
- `order_items`: Line items linking products to orders.
- `payments`: Payment tracking ledger.

## Development Workflow (Anticipated)

As the project transitions into implementation, the following commands are expected:
- `npm run dev`: Start the Next.js development server.
- `npm run db:push`: Push schema changes to Neon (via Drizzle Kit).
- `npm run build`: Build the production application for Vercel.

### Required Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string (must include `?sslmode=require`).
- `NEXTAUTH_SECRET`: Random string for session encryption.
- `NEXTAUTH_URL`: The Vercel deployment URL.
