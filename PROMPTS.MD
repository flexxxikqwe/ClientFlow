# Project Prompts

## AI Features Integration
**Prompt:**
Implement AI features using Gemini API.

Create:
lib/ai/gemini.ts

Functions:
- generateSummary(text)
- classifyLead(text) → hot | warm | cold
- generateReply(text)

Requirements:
- return structured JSON
- handle errors
- safe output for UI

Then integrate into:
- lead detail page
- add buttons:
  - Generate summary
  - Classify lead
  - Generate reply

Output:
- full code
- integration examples

## Telegram Bot Integration
**Prompt:**
Implement Telegram bot integration.

Requirements:
- send message when new lead is created
- message includes:
  name, email, phone, message
- use environment variables

Integrate into:
- POST /api/leads

Output:
- integration code
- API update

## Project Audit & Optimization
**Prompt:**
Audit and improve the project.

Check:
- authentication security
- API validation
- XSS and SQL injection risks

Optimize:
- server/client components
- caching
- performance

Output:
- list of issues
- improved code examples

## Production Readiness
**Prompt:**
Prepare the project for production.

Include:
- environment variables setup
- logging
- monitoring
- deployment on Vercel

Output:
- checklist
- required fixes
