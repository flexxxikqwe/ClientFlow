# ClientFlow

## Overview
ClientFlow is a streamlined CRM and lead management platform designed to help small teams track prospects, manage sales pipelines, and leverage AI for better engagement. It provides a visual, high-fidelity interface for organizing customer data and generating actionable insights from lead interactions.

This project is a **demo-first portfolio showcase**. It is built to demonstrate modern full-stack engineering patterns, polished UI/UX design, and practical AI integration. While it contains a functional authentication system, it is best evaluated through the dedicated showcase path which provides a stable, pre-populated environment for immediate review.

## Live Demo / Best Way to Explore
The recommended way to experience ClientFlow is through the **Showcase Mode**. This path bypasses the standard authentication barrier and drops you directly into a pre-configured environment with realistic sample data.

1. Navigate to the **Landing Page**.
2. Click **"View Demo"** or **"Explore as Guest"**.
3. You will be redirected to `/demo/dashboard`.

This exists to ensure that reviewers can immediately see the product's full capabilities—including analytics and AI features—without needing to create an account or manually populate a database.

## Implemented Today
- **CRM-style Leads Management:** Full CRUD operations for leads with a dedicated "New Lead" flow and detailed profile views.
- **Notes & Activity Tracking:** A relational activity system to record and view chronological interactions for every lead.
- **Analytics Dashboard:** Real-time metrics and trend charts for conversion rates, pipeline value, and acquisition sources.
- **AI-Assisted Features:** Integration with Google Gemini to generate automated lead summaries and professional follow-up drafts.
- **Data Export:** Functional CSV export for lead data directly from the management interface.
- **Pricing & Onboarding Flow:** A complete mock billing and plan selection experience.
- **Dedicated Showcase Path:** A stable `/demo` route that uses a dedicated state provider for consistent evaluation.
- **Honest Auth Reality:** A functional JWT-based authentication system (Login/Register) is implemented but remains secondary to the optimized showcase experience.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Charts:** Recharts
- **AI:** Google Generative AI (@google/genai)
- **Persistence:** Supabase (PostgreSQL) with a local JSON fallback
- **Validation:** Zod (Schema-based API validation)
- **Auth:** jose (JWT) and bcryptjs

## Architecture
- **Next.js App Router:** Utilizes modern routing patterns, including parallel routes and layouts for the dashboard.
- **Route Handlers:** A clean API structure using Next.js Route Handlers for all data operations.
- **Repository Pattern:** Data access is abstracted behind interfaces, allowing the application to seamlessly switch between Supabase and local JSON storage.
- **Hybrid Persistence:** The app defaults to local JSON persistence if Supabase credentials are not provided, ensuring it works "out of the box."
- **Demo-First Showcase Route:** A dedicated `/demo` path that wraps the application in a `DemoProvider` to inject a stable, read-only state.

## Demo-First Showcase Mode
The `/demo` path is the primary showcase experience. It exists to solve the "empty state" problem common in portfolio projects. Instead of asking a reviewer to sign up and type in fake leads, the showcase mode provides a high-fidelity environment that demonstrates the product's value immediately. It uses the same components and logic as the authenticated app but is backed by a stable, pre-populated data set.

## Current Limitations
- **Showcase Focus:** Evaluation through the `/demo` path is the recommended and most stable experience.
- **Mock Billing:** The pricing and billing steps are for demonstration purposes; no real payment gateway is connected.
- **Auth Flow:** While functional, the standard auth flow is less optimized for public showcase than the dedicated demo path.
- **No Enterprise Claims:** This is a portfolio project designed to demonstrate engineering skill, not a production-ready enterprise SaaS.

## Local Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure Environment Variables:**
   Create a `.env.local` file. Only the Gemini key is required for the demo/showcase features:
   ```env
   # Required for AI Features (Gemini API)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # Optional: For standard auth flow
   JWT_SECRET=your_32_character_secret
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *Note: The application will automatically fall back to local JSON storage if Supabase keys are missing.*

## Suggested Demo Flow
1. **Open the Landing Page:** View the product positioning and value proposition.
2. **Click "View Demo":** Enter the showcase environment at `/demo/dashboard`.
3. **Explore Analytics:** View the Recharts-powered metrics.
4. **Manage Leads:** Navigate to the Leads page, click a lead, and view the AI-generated summary.
5. **Test Export:** Click the Export button to see the CSV generation in action.

## What This Project Demonstrates
- **Product Thinking:** Building a cohesive experience from landing page to onboarding to dashboard.
- **Modern Full-Stack Structure:** Clean separation of concerns using the repository pattern and Next.js App Router.
- **Demo-Ready UX:** Attention to detail in loading states, transitions, and empty states.
- **Data Presentation:** Effective use of charts and tables to make CRM data readable.
- **Component Architecture:** Reusable, strongly-typed React components styled with Tailwind 4.
- **TypeScript Proficiency:** Strict typing across the entire stack, from API responses to UI props.

## Planned Next Steps
- **Full Supabase Auth:** Migrating from custom JWTs to managed Supabase Auth.
- **Advanced Lead Scoring:** Enhancing the AI layer to provide more complex lead prioritization.
- **Real-Time Notifications:** Implementing live updates for lead activity.

---
*Built to demonstrate modern web engineering and intentional product design.*
