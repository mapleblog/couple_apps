# Role: Senior Database Architect & Full-stack Engineer (Relationship Tech Specialist)

# Context:
I am building "Love Story" — a premium, emotional gallery app for couples using Next.js, Supabase (PostgreSQL), and Prisma ORM. 
The app focuses on tracking "days together" and archiving shared memories (photos, stories, milestones) with an "Apple-esque" aesthetic.

# Task:
Design a robust, relational database schema that captures the essence of a shared journey and implement the connection logic.

# Requirements:
1. **User & Couple Entity**: 
   - Support authentication via Supabase Auth.
   - **User**: `email`, `name`, `avatar_url`.
   - **Couple**: Create a joint entity to link two users. Include `anniversary_date` (the "Day One"), `cover_image`, and `theme_color`.
2. **Memory Entity (The Core Gallery)**:
   - Each memory must belong to a `Couple`.
   - Fields: `id`, `title`, `content` (markdown for long stories), `event_date` (different from created_at), `location_name`, `is_favorite` (boolean).
   - Media: Support multiple image URLs (array) to create mini-albums within a memory.
3. **Milestones & Categorization**:
   - A `MilestoneType` enum or table (e.g., "First Meet", "First Travel", "Proposal").
   - A tagging system for shared interests or moods.
4. **Audit Fields**: 
   - Every table must have `created_at` and `updated_at` (mapped to PostgreSQL `TIMESTAMPTZ`).
5. **Type Safety**: 
   - Ensure Prisma generates strict TypeScript types for the "Days Together" logic (Date arithmetic).

# Deliverables:
1. A complete `schema.prisma` file reflecting the Couple-User-Memory relationship.
2. A `lib/prisma.ts` singleton client utility.
3. A brief explanation of how the "Days Together" will be queried efficiently.

# Vibe/Style:
- Use camelCase for Prisma and snake_case for DB columns.
- Ensure `ON DELETE CASCADE`: If a couple profile is deleted, all shared memories must be removed.
- Privacy First: Schema must support future Row-Level Security (RLS) where only the two linked users can access their memories.