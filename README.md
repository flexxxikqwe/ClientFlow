# ClientFlow

## Overview
ClientFlow is a CRM and lead management application designed to organize sales workflows. It provides teams with a visual interface to track prospects, log activity, and generate AI-assisted insights for better engagement.

This project serves as a full-stack portfolio piece demonstrating a real-world migration strategy. It has evolved from a local JSON-based prototype into a hybrid architecture that leverages Supabase for data persistence while maintaining a robust fallback system.

## Implemented Today
- **Authentication:** Custom JWT-based session management with bcrypt hashing, currently backed by a local JSON store.
- **Leads Management:** Full CRUD operations for leads, featuring a dedicated "New Lead" flow and detailed profile views.
- **Activity Timeline:** A relational note-taking system to track chronological interactions for every lead.
- **AI Insights:** Integration with Google Gemini to generate automated lead summaries and professional follow-up drafts.
- **Analytics:** Dashboard metrics and trend charts for tracking conversion rates, pipeline value, and acquisition sources.
- **Data Export:** Functional CSV export for lead data directly from the management interface.
- **Demo Mode:** A one-click "Demo Mode" with state handling, allowing exploration without registration.
- **Hybrid Persistence:** A repository pattern implementation that switches between Supabase (Postgres) and local JSON storage based on environment configuration.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Database:** Supabase (PostgreSQL) with local JSON fallback
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **AI:** Google Generative AI (@google/genai)
- **Validation:** Zod (Schema-based API validation)
- **Auth:** jose (JWT), bcryptjs

## Architecture
- **Next.js App Router:** Utilizes modern React Server Components and optimized Route Handlers.
- **Repository Pattern:** Data access is abstracted behind interfaces (`ILeadsRepository`, etc.), decoupling business logic from the storage layer.
- **Hybrid Persistence:** The app detects `NEXT_PUBLIC_SUPABASE_URL` at runtime. If present, it uses Supabase repositories; otherwise, it falls back to a local `data.json` implementation for development.
- **Stateless Auth:** Sessions are managed via HTTP-only cookies containing signed JWTs.
- **Feature-Driven Structure:** Code is organized by domain (e.g., `/features/leads`, `/features/auth`) to improve maintainability.

## Current Limitations
- **Auth Migration:** Authentication and user profiles are still managed via the JSON store; migration to Supabase Auth is pending.
- **Real-time Updates:** UI synchronization relies on SWR revalidation rather than native Supabase Realtime/WebSockets.
- **Analytics Processing:** Metrics are currently calculated at the application level rather than using database-level aggregations.

## Local Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Environment Variables:**
   Create a `.env.local` file:
   ```env
   JWT_SECRET=your_secret_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # Optional: Add these to enable Supabase persistence
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Note: If Supabase keys are missing, the app will automatically use `lib/data.json` for storage.*

## Demo Flow
1. **Entry:** Visit the `/login` page and click **"Try Demo Mode"**.
2. **Dashboard:** View sales metrics and acquisition trends.
3. **Leads:** Browse leads and export data to CSV.
4. **Insights:** Open a lead and use the **AI Insights** tab to generate a summary via the Gemini API.

## What This Project Demonstrates
- **Migration Strategy:** Transitioning a prototype from local files to a cloud database without breaking existing flows.
- **Clean Architecture:** Effective use of the Repository Pattern to handle multiple persistence layers.
- **API Design:** Structured Route Handlers with robust Zod validation and clear error handling.
- **Frontend Engineering:** Implementation of loading states, empty states, and consistent UI transitions.

## Planned Next Steps
- **Full Auth Migration:** Moving user sessions and profiles to Supabase Auth.
- **Database-Level Analytics:** Optimizing metrics using PostgreSQL views and aggregations.
- **E2E Testing:** Implementing Playwright tests for critical lead management journeys.

---
*Note: Screenshots and demo visuals can be added here once the project is hosted.*
