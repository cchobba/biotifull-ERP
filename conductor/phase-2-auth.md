# Phase 2: Authentication & Route Protection

## Objective
Implement a secure authentication system using Auth.js (v5) and Drizzle ORM, ensuring that only authorized users can access the ERP modules.

## Key Files & Context
- **src/db/schema.ts:** Contains the `users` table definition.
- **src/db/index.ts:** Database client instance.
- **PRD.txt:** Mentions "Users (Admin Access)" and "NextAuth.js (v5)".

## Implementation Steps

### 1. Auth.js Configuration (`src/auth.ts`)
- Initialize `NextAuth` with the `DrizzleAdapter`.
- Configure the `Credentials` provider for email/password login.
- Implement `authorize` logic to verify user credentials against the database.
- Define `callbacks` to include user ID in the session.

### 2. Password Hashing Utility (`src/lib/auth-utils.ts`)
- Implement (or install) a lightweight hashing utility (e.g., `bcryptjs`) to securely handle passwords.
- *Note: Using `bcryptjs` as it is compatible with Vercel Edge/Serverless environments.*

### 3. Login Page (`src/app/login/page.tsx`)
- Create a clean, professional login form using Tailwind CSS and Lucide icons.
- Implement a Server Action for handling the login process.

### 4. Middleware & Route Protection (`src/middleware.ts`)
- Use Next.js Middleware to protect all routes under `/dashboard` (or the root if applicable).
- Ensure the `/login` page is accessible to unauthenticated users.

### 5. Admin Seed Script (`scripts/seed-admin.ts`)
- Create a simple script to seed the initial admin user, as there is no public registration for this ERP.

## Verification & Testing
- Attempt to access a protected route without being logged in (should redirect to `/login`).
- Verify successful login with seeded credentials.
- Ensure the session persists across page reloads.
