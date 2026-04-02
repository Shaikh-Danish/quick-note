# Quick Note - AI Architecture & Implementation Guide

This document serves as the absolute "Ground Truth" for any AI agent or developer contributing to this codebase. When generating code, you MUST adhere strictly to the structures, abstraction patterns, and folder separation logic defined below.

## 1. Core Technology Stack
- **Framework**: Next.js App Router
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: `better-auth` (Email/Password & Username plugins)
- **Forms & Validation**: `react-hook-form` + `zod`
- **Client State**: `@tanstack/react-query`
- **UI & Styling**: Tailwind CSS, React Hot Toast

---

## 2. Global Directory & Architecture Rules

This application strictly follows a decoupled, feature-sliced layered architecture. You must NEVER mix concerns across these isolated boundaries.

### 🗄️ `data-access/` (The Database Layer)
**Responsibility**: This folder is the exclusive gateway to the database. It isolates the Prisma ORM from the rest of the application.
*   **Rules**:
    *   You may **NEVER** import or call `prisma` directly inside an API Route (`app/api`), a Next.js Server Component, or a Service.
    *   Instead, you must export clean, semantic functions (Repository Pattern) from this folder to perform operations.
*   **Example Structure**:
    ```typescript
    // data-access/user.ts
    import { prisma } from './prisma-client';
    
    export async function getUserByEmail(email: string) {
       return prisma.user.findUnique({ where: { email } });
    }
    ```

### 🔌 `services/` (The 3rd-Party & Integration Layer)
**Responsibility**: This folder abstracts away external APIs and 3rd-party vendor SDKs (Emails, Payments, Cloud Storage, AI processors).
*   **Rules**:
    *   Never expose provider-specific types or SDK quirks to the rest of the app.
    *   The rest of the app should not know if we use Resend, Nodemailer, or AWS SES. They should only understand generic interfaces.
*   **Example Structure**:
    ```typescript
    // services/email.ts
    // BAD: export async function sendResendTemplate(...)
    // GOOD: export async function sendWelcomeEmail(address: string, name: string)
    ```

### 🎯 `features/` (The Domain Logic Layer)
**Responsibility**: This folder contains vertical slices of "business logic" grouped by specific domains (e.g., `features/auth`, `features/notes`, `features/billing`).
*   **Rules**:
    *   If logic requires orchestrating the `data-access` layer and the `services` layer simultaneously, it belongs here.
    *   Feature folders should contain their own `/server.ts` (backend business logic) and `/client.ts` (client-side hooks or API callers).
    *   Do NOT put visual Next.js UI components here.

### 🛠️ `lib/` (The Universal Utilities Layer)
**Responsibility**: Contains global, framework-agnostic utilities, configurations, and singletons used across the entire application stack.
*   **Rules and Structure**:
    *   `lib/env.ts`: Houses the `@t3-oss/env-nextjs` validation schema.
    *   `lib/schemas/`: The centralized home for all Zod validation rules (e.g., `auth.ts`). **Never define validation schemas inside UI forms.**
    *   `lib/utils.ts`: Generic string formatters, Tailwind mergers (`cn`), or date-parsers.

---

## 3. Route & UI Structure (`app/` vs `components/`)

### 3.1. Route-Linked Components (`app/_components`)
The `app/` folder should act purely as the Controller (routing and rendering).
*   **The `_components` Approach**: UI components that are heavily specific to a single route (like a complex Dashboard Layout or Marketing Hero) MUST live in an adjacent folder prefixed with an underscore inside a route group.
*   **Example Layout**:
    ```text
    app/(marketing)/
    ├── _components/
    │   └── landing/landing-page.tsx
    └── page.tsx
    ```

### 3.2. Global Shared UI (`components/ui`)
*   **Rule**: The root `/components` folder is strictly reserved for "dumb", highly reusable shell components (Buttons, Modals, Wrappers).
*   **Constraint**: Components here must NEVER fetch their own data or contain domain-specific business logic. They receive props and emit events.

---

## 4. Mandatory Abstraction Patterns
To prevent vendor lock-in and duplicate boilerplate, you MUST use the following internal wrappers instead of raw packages:

### ✅ 4.1. Forms (`useZodForm`)
Do not use `useForm` directly or manually attach `zodResolver`.
*   **BAD**: `import { useForm } from "react-hook-form";`
*   **GOOD**: `import { useZodForm } from "@/hooks/use-zod-form";`

### ✅ 4.2. Environment Variables (`@t3-oss/env-nextjs`)
Never use raw `process.env`.
*   **BAD**: `const db = process.env.DATABASE_URL`
*   **GOOD**: `import { env } from "@/lib/env"; const db = env.DATABASE_URL;`

### ✅ 4.3. Icons (`components/ui/icons`)
Never import directly from an icon library (e.g., `@phosphor-icons/react`). Use the centralized dictionary.
*   **GOOD**: `import { Icons } from "@/components/ui/icons"; <Icons.email size={18} />`

### ✅ 4.4. Toasts & Notifications
Use the centralized wrapper so the library can be swapped globally.
*   **GOOD**: `import { toast } from "@/components/ui/toast"; toast.success("Looks great!")`

---

## 5. Rendering & State Protocol

### 5.1 Server vs Client Boundaries
*   **Default to React Server Components (RSC)**: Layouts, shells, and fast initial data reads must remain on the server.
*   **Push `"use client"` down**: Only drop down to client components at the lowest leaf node necessary (e.g., a specific button requiring `onClick`, or a form requiring `useZodForm`).

### 5.2 State Management Protocol
*   **Server State (DB/Mutations)**: Handled exclusively via TanStack `@tanstack/react-query`.
*   **Form State**: Handled exclusively via `react-hook-form` via the `useZodForm` wrapper.
*   **Local UI State**: Use React `useState` or `useReducer`. No massive global stores (like Redux) allowed unless absolutely required by a specific complex interactive feature.

---

## 6. API, Mutations & Error Handling Philosophy

### 6.1 Route Handlers Over Server Actions
*   **Rule**: Due to payload constraints (>1GB file limits) and strict security boundaries, do NOT use React Server Actions for core data mutations or form submissions.
*   **Use Next.js API Routes**: Build standard REST-like endpoints (`app/api/.../route.ts`). Trigger them securely from the frontend using TanStack Query's `useMutation`.

### 6.2 Strict Validation & Error Responses
*   **Validation**: Every API route MUST immediately validate the incoming `request.json()` against the exact same shared Zod schema exported from `/lib/schemas/`.
*   **Error Interface**: APIs must never throw unhandled 500 HTML traces. Always catch errors and return consistent JSON (e.g., `return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })`) so the frontend client can cleanly map it to `toast.error()`.
