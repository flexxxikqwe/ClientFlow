# ClientFlow

ClientFlow is a polished CRM-style SaaS prototype designed to demonstrate modern full-stack development patterns. Built with Next.js 15 and React 19, the application features a production-ready interface styled with Tailwind CSS v4 and fluid animations powered by Framer Motion.

This project serves as a portfolio prototype, showcasing a clean architecture that separates business logic from data storage. It utilizes a secure authentication system based on JWT with bcrypt password hashing and follows an API-first design. The codebase is fully prepared for a seamless transition to a real database like Supabase or PostgreSQL and supports the addition of social login providers.

## Features

- Production-quality UI with a focus on user experience and responsive design.
- Secure authentication using JSON Web Tokens and industry-standard password hashing.
- Decoupled data layer using a repository pattern for easy database migration.
- Dynamic lead management pipeline with real-time-ready API structures.

## Google OAuth

The application is architected to easily integrate social authentication. By plugging in NextAuth.js, you can enable one-click login via Google while maintaining the existing JWT implementation as a secure fallback. The integration is designed to sync OAuth users directly into the system via the established usersRepository, ensuring consistent data management whether the backend is a local JSON store or a production database.

## Production Roadmap

To transform this prototype into a production-ready SaaS application, follow these steps:

- Database Migration: Replace the current JSON-based storage with Supabase or PostgreSQL by providing a new implementation of the repository interfaces. Because the UI and API routes depend on the repository layer rather than the database directly, no changes to the frontend or route logic are required.
- Advanced Authentication: Transition to the NextAuth Supabase adapter to manage user sessions externally. This allows for more complex auth flows and centralized user management.
- Environment Configuration: Secure the application by configuring environment variables for JWT_SECRET, NEXTAUTH_SECRET, and GOOGLE_CLIENT_ID, along with your production DATABASE_URL.
- Scalability: The modular architecture ensures that as the feature set grows, the core components and API structures remain stable and performant.
