# ClientFlow

## Project Overview
ClientFlow is a polished CRM and lead management application designed to demonstrate modern full-stack engineering patterns. It features a visual interface for tracking prospects, managing sales pipelines, and generating AI-assisted insights for better engagement.

This project is positioned as a **portfolio showcase**, prioritizing a stable, high-fidelity demonstration experience over production-ready infrastructure.

## 🚀 Live Demo
The best way to explore ClientFlow is through the **Showcase Mode**. This path is pre-configured with realistic data and bypasses the authentication flow for immediate evaluation.

**[View Live Demo](/demo/dashboard)**

---

## Implemented Today
- **Showcase Mode:** A stable, read-only demonstration path with pre-populated leads and stats.
- **Leads Management:** Full CRUD operations for leads, featuring a dedicated "New Lead" flow and detailed profile views.
- **Activity Timeline:** A relational note-taking system to track chronological interactions for every lead.
- **AI Insights:** Integration with Google Gemini to generate automated lead summaries and professional follow-up drafts.
- **Analytics:** Dashboard metrics and trend charts for tracking conversion rates, pipeline value, and acquisition sources.
- **Data Export:** Functional CSV export for lead data directly from the management interface.
- **Hybrid Persistence:** A repository pattern implementation that switches between Supabase (Postgres) and local JSON storage.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Database:** Supabase (PostgreSQL) with local JSON fallback
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **AI:** Google Generative AI (@google/genai)
- **Validation:** Zod (Schema-based API validation)
- **Auth:** jose (JWT), bcryptjs (Note: Primary showcase uses a mock auth provider)

## Architecture Overview
- **Repository Pattern:** Data access is abstracted behind interfaces, allowing the app to swap between Supabase and local JSON storage with zero changes to business logic.
- **Demo-First Design:** The `/demo` route uses a dedicated `DemoProvider` that injects a stable state, ensuring a consistent experience for reviewers.
- **Stateless Session Management:** Normal auth uses HTTP-only cookies and signed JWTs, though the `/demo` path is the recommended evaluation route.

## Demo-First Showcase Mode
The Showcase Mode (`/demo/*`) is the intentional primary experience for this project. It demonstrates:
- **UI/UX Polish:** Smooth transitions, responsive layouts, and consistent design language.
- **Feature Depth:** Real-world CRM workflows including lead scoring, activity logging, and analytics.
- **AI Integration:** Practical application of LLMs for business value.

## Current Limitations & Honesty
- **Auth Flow:** The normal login/register flow is functional but remains secondary to the stable `/demo` path.
- **Billing:** Pricing pages and plan selection are UI-only; no real payment gateway is integrated.
- **Real-time:** UI synchronization relies on SWR revalidation rather than native WebSockets.

## Local Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Environment Variables:**
   Create a `.env.local` file. Only the Gemini key is required for the demo:
   ```env
   # Required for AI Features
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # Optional: For normal auth flow
   JWT_SECRET=your_secret_key
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Note: The app defaults to local JSON storage if Supabase keys are missing.*

## What This Project Demonstrates
- **Clean Architecture:** Effective use of patterns to handle multiple persistence layers.
- **Frontend Engineering:** Implementation of loading states, empty states, and polished transitions.
- **AI Implementation:** Real-world use of the Gemini API for summaries and replies.
- **Portfolio Mindset:** Prioritizing the reviewer's experience through a dedicated showcase path.

## Planned Next Steps
- **Full Supabase Auth Integration:** Moving user sessions to a managed cloud provider.
- **Advanced Lead Scoring:** Enhancing the AI layer with more complex data points.

---
*Built as a demonstration of modern web engineering and product design.*
