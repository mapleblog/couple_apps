# Role: Senior Full-Stack Architect (Relationship Tech Specialist)

# Task: Implementation of Backend Logic, Server Actions, and Storage for "Love Story" - A Couple Memory Gallery

## Context
We are building "Love Story," a premium digital space for couples. The backend must support a shared environment where two users track their "days together" and maintain a joint gallery of memories. We use **Next.js (App Router)**, **Supabase** (Auth & Storage), and **Prisma** (PostgreSQL).

## Requirements

### 1. Server Actions (The Emotional Logic)
Implement **Next.js Server Actions** in `@/actions/` with a focus on shared couple data:
- `getCoupleData`: Fetch the `anniversary_date` and shared profile for the logged-in user's couple.
- `getMemories`: Fetch all shared memories, ordered by `event_date` (descending).
- `addMemory`: Validate input (Zod), handle multi-image upload to Supabase, and link to the `CoupleID`.
- `updateAnniversary`: Specialized action to update the "Day One" date.
- `deleteMemory`: Clean up both DB records and files in Storage.

### 2. File Storage Integration (Supabase Storage)
- Use a Supabase bucket named `memories`.
- Logic: Implement image compression or resizing (if possible) and return `publicUrl`.
- Organization: Store files under folder paths like `couple-id/memory-id/filename`.

### 3. "Couple-Aware" Middleware & Auth
- **Shared Access**: Write logic to verify that the current user belongs to a `Couple`. Only users linked to the same `CoupleID` can access the shared memories.
- **Guard**: Protect all routes under `/dashboard` or `/gallery`. Unauthenticated users or users not in a "Couple" relationship should be redirected.

### 4. Data Validation (The Memory Schema)
Use **Zod** to define the `Memory` schema:
- `title`: String, min 1 char.
- `content`: String (Markdown for stories).
- `eventDate`: Date object (Crucial for the timeline).
- `imageUrls`: Array of strings (Support multiple photos per memory).
- `mood`: Optional string (e.g., "Happy", "Romantic").

### 5. Anniversary Engine
- Implement a server-side utility that takes an `anniversary_date` and calculates the current total days, hours, and minutes for the "Love Story" hero section.

## Instructions for AI
1. Setup the **Supabase Server Client** using `@supabase/ssr`.
2. Provide the **Zod schema** tailored for romantic memories.
3. Write the **Server Actions** ensuring all data is scoped to the `CoupleID`, not just the `UserID`.
4. Provide a React Hook `useCoupleStats` snippet that calls the server action to get the "Days Together" count.
5. Ensure all error responses are handled with the standard `{ success: boolean, data?: any, error?: string }` format.

"Let's build a secure, romantic digital vault for a lifetime of stories."