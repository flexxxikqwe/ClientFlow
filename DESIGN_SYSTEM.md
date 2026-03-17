# ClientFlow Design System

A cohesive, production-ready UI/UX system for the ClientFlow CRM.

## 1. Layout & Spacing
- **Grid**: 8px base grid.
- **Max Width**: 1440px for dashboard views.
- **Padding**: 24px (p-6) for standard containers, 40px (p-10) for hero sections.
- **Radius**: 12px (rounded-xl) for cards and main UI elements.

## 2. Typography
- **Font Family**: Inter (Sans-serif) for UI, JetBrains Mono for data.
- **Hierarchy**:
  - **H1**: 30px (text-3xl), Bold, Tracking-tight.
  - **H2**: 24px (text-2xl), Semi-bold.
  - **Body**: 14px (text-sm), Regular.
  - **Caption**: 12px (text-xs), Medium, Muted-foreground.

## 3. Colors
- **Base**: Zinc/Slate grayscale for neutral surfaces.
- **Primary**: Indigo-600 (#4f46e5) - used for primary actions and brand identity.
- **Success**: Emerald-600 - used for "Won" status and positive feedback.
- **Warning**: Amber-500 - used for "Warm" leads and pending actions.
- **Error**: Rose-600 - used for "Lost" status and destructive actions.

## 4. UX Patterns
- **Hover**: Subtle background shifts (`hover:bg-accent/50`) and scale effects.
- **Focus**: Indigo ring with 2px offset.
- **Loading**: Pulse skeletons for all data-dependent components.
- **Empty States**: Centered illustrations with clear CTA.
- **Feedback**: Sonner toasts for all async operations.

## 5. Components
- **Buttons**:
  - `default`: Solid Indigo.
  - `outline`: Bordered Zinc.
  - `ghost`: Transparent, hover-only background.
- **Cards**: Minimal border, subtle shadow, white background (dark: zinc-950).
- **Tables**: Row hover effects, status badges, compact spacing.
- **Badges**: Pill-shaped, low-opacity background with high-contrast text.
