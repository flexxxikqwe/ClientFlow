# ClientFlow

ClientFlow is a CRM and lead management prototype built to demonstrate modern full-stack development patterns. It provides sales teams with a visual interface to track prospects, log activity, and generate AI-assisted insights.

## Implemented Today

The current version of ClientFlow is a functional prototype that implements the core lifecycle of lead management, from ingestion to analysis.

- **Authentication:** Custom JWT-based session management with bcrypt password hashing.
- **Lead CRM:** Full CRUD operations for leads, including status tracking and value estimation.
- **AI Insights:** Integration with Google Gemini to generate lead summaries and follow-up drafts.
- **Analytics:** Server-side computation of conversion rates and pipeline health.
- **Activity Logging:** Relational note-taking system for tracking lead interactions.

## Core Features

- **Dashboard Overview:** High-level metrics showing total leads, conversion rates, and acquisition trends.
- **Lead Pipeline:** A centralized list for managing prospects with filtering and detail views.
- **AI Assistant:** Automated lead summarization and professional reply generation via the Gemini API.
- **Activity Timeline:** Chronological history of notes and events for every lead.
- **Demo Access:** A one-click "Demo Mode" to explore the application without registration.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Validation:** Zod (Schema-based API validation)
- **AI:** Google Generative AI (@google/genai)
- **Auth:** jose (JWT), bcryptjs
- **Persistence:** Local JSON-based filesystem storage (prototype implementation)

## Architecture Overview

The application is structured to separate concerns and ensure maintainability:

- **Repository Pattern:** Data operations are abstracted behind interfaces in `lib/repositories/`. This decouples the API routes from the underlying storage implementation.
- **Feature-Based Organization:** Logic is grouped by domain (e.g., `/features/leads`, `/features/auth`) rather than generic types.
- **Stateless Auth:** Sessions are managed via HTTP-only cookies containing signed JWTs.
- **Type Safety:** TypeScript is used across the stack, with Zod ensuring runtime safety for API boundaries.

## Current Limitations

- **Persistence:** Data is stored in a local `data.json` file. This is a prototype shortcut and does not support concurrent writes or multi-instance scaling.
- **Real-time:** UI updates rely on SWR polling rather than WebSockets or server-sent events.
- **Auth:** Social login (Google OAuth) is not yet implemented.

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/clientflow.git
   cd clientflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file:
   ```env
   JWT_SECRET=your_secret_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Demo / Usage Flow

1. **Entry:** Visit the `/login` page and click **"Try Demo Mode"**.
2. **Dashboard:** View aggregated sales metrics and acquisition charts.
3. **Leads:** Navigate to the Leads page to see the active pipeline.
4. **Insights:** Open a lead's details and use the **AI Insights** tab to generate a summary or a follow-up email.
5. **Activity:** Log a new note in the Activity Timeline to track progress.

## What This Project Demonstrates

- **Clean Architecture:** Use of the Repository Pattern to decouple business logic from persistence.
- **Modern React:** Leveraging React 19 features and Next.js 15 App Router patterns.
- **API Design:** Structured Route Handlers with robust input validation.
- **UI/UX Craft:** Focus on micro-interactions, loading states, and responsive design.

## Planned Next Steps

- **Database Migration:** Implementing a `SupabaseLeadsRepository` to replace the JSON store.
- **Social Auth:** Integrating NextAuth.js for Google OAuth support.
- **Testing:** Adding Playwright E2E tests for core user journeys.

---
*Note: Screenshots and demo visuals can be added here once the project is hosted.*
