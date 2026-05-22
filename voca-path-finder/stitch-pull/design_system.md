---
name: Cinematic Intelligence
colors:
  surface: '#111418'
  surface-dim: '#111418'
  surface-bright: '#36393e'
  surface-container-lowest: '#0b0e12'
  surface-container-low: '#191c20'
  surface-container: '#1d2024'
  surface-container-high: '#272a2f'
  surface-container-highest: '#323539'
  on-surface: '#e1e2e8'
  on-surface-variant: '#bcc9c8'
  inverse-surface: '#e1e2e8'
  inverse-on-surface: '#2e3135'
  outline: '#869392'
  outline-variant: '#3d4948'
  surface-tint: '#5ed9d3'
  primary: '#5ed9d3'
  on-primary: '#003735'
  primary-container: '#0ea5a0'
  on-primary-container: '#003331'
  inverse-primary: '#006a66'
  secondary: '#f1be63'
  on-secondary: '#422c00'
  secondary-container: '#805a00'
  on-secondary-container: '#ffd694'
  tertiary: '#ffb597'
  on-tertiary: '#581d00'
  tertiary-container: '#d97b51'
  on-tertiary-container: '#521b00'
  error: '#d96a6a'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df6ef'
  primary-fixed-dim: '#5ed9d3'
  on-primary-fixed: '#00201f'
  on-primary-fixed-variant: '#00504d'
  secondary-fixed: '#ffdeaa'
  secondary-fixed-dim: '#f1be63'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5f4100'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb597'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#78310c'
  background: '#111418'
  on-background: '#e1e2e8'
  surface-variant: '#323539'
  surface-1: '#11151b'
  surface-2: '#171c24'
  surface-3: '#1f2530'
  text-primary: '#edf1f7'
  text-muted: '#8b95a7'
  text-faint: '#576073'
  border-subtle: rgba(255, 255, 255, 0.08)
  success: '#4ea978'
typography:
  hero-lg:
    fontFamily: Space Grotesk
    fontSize: 88px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  hero-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  space-1: 4px
  space-2: 8px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-12: 48px
  space-24: 96px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system embodies a "Cinematic Intelligence" aesthetic—moving away from the frantic energy of typical SaaS platforms toward a calm, authoritative, and precise atmosphere. It is designed for high-stakes career intelligence, prioritizing focus, trust, and depth.

The style is a sophisticated blend of **Minimalism** and **Glassmorphism**, utilized within a **Corporate Modern** framework. 
- **Atmospheric Depth:** Visuals are built on a dark-first foundation, using deep shadows and subtle color bleeds to create a sense of vast, quiet space.
- **Precision:** Elements are aligned to a strict grid with razor-sharp typography and purposeful motion that simulates "thought" rather than just transition.
- **Premium Tactility:** Interaction is signaled through low-opacity borders and internal glows rather than heavy gradients or skeletal shadows, giving the UI a "glass-on-black" feel.

## Colors

The palette is strictly "dark-first," optimized for high-contrast legibility and reduced eye strain during deep work.

- **Primary Action (Teal):** Used exclusively for interactive elements, focus states, and progress. It represents the "active" path.
- **Highlight (Gold):** Reserved for scores, "match" percentages, and premium milestones. It represents "value" and "achievement."
- **Neutral Stack:** The background is a custom deep charcoal (`#0b0e12`). Elevation is achieved by stepping through pre-defined surface levels rather than arbitrary lightening.
- **Transparency:** Use `border-subtle` for all container outlines to maintain a lightweight, layered feel without introducing heavy visual noise.

## Typography

The typography system uses **Space Grotesk** for display roles to inject a technical, futuristic edge, and **Inter** for all functional UI and long-form reading to ensure maximum clarity.

- **Scale:** Headlines use a fluid scaling approach. Hero text should be reserved for landing moments and major section entrances.
- **Hierarchy:** Use `label-xs` for metadata and category tags, always in uppercase with increased letter spacing to distinguish from body copy.
- **Rendering:** On dark backgrounds, reduce font weight slightly (e.g., from 500 to 400) if the text appears too "bold" due to light bleed on high-resolution screens.

## Layout & Spacing

This design system operates on a strict **4px grid**. All margins, paddings, and component heights must be multiples of 4.

- **Grid Model:** A 12-column fluid grid is used for desktop (max-width 1440px), transitioning to a 4-column layout for mobile. 
- **Conversational Width:** For chat-style onboarding, content is constrained to a central 680px column to maintain readability and focus.
- **Rhythm:** Use `space-6` (24px) for standard internal card padding and `space-12` (48px) for vertical separation between distinct UI modules. 
- **Adaptation:** On mobile devices, side margins compress to 16px, and vertical gaps between "message bubbles" reduce to 8px to maximize screen real estate.

## Elevation & Depth

Depth is primarily established through **Tonal Layering** rather than heavy drop shadows. 

- **Surface Tiers:** Background (`#0b0e12`) → Surface 1 (`#11151b`) → Surface 2 (`#171c24`). Each step up represents a closer proximity to the user.
- **Low-Contrast Outlines:** Every card or elevated surface must have a `1px` border using `rgba(255,255,255,0.08)`. This creates a crisp edge that defines the object against the dark background.
- **Ambient Shadows:** When a modal or popover is required, use a high-spread, low-opacity shadow (`0 16px 48px rgba(0,0,0,0.4)`). 
- **Specialty Glows:** Elements associated with Teal or Gold may use a very subtle outer glow (bloom effect) to emphasize their importance, but this should be limited to 10-15% opacity.

## Shapes

The shape language is "Rounded" to feel approachable and modern, softening the technical edge of the dark theme and Space Grotesk.

- **Standard Radius:** 0.5rem (8px) for inputs and small components.
- **Large Radius:** 1rem (16px) for recommendation cards and chat bubbles.
- **Pill Shapes:** Reserved exclusively for buttons and "Match Score" pills to make them feel like distinct, touchable objects.

## Components

- **Chat Bubbles:** AI-generated messages use `Surface-1` with left-alignment. User "Answer Chips" use `Surface-2` with a Teal border on hover.
- **Action Buttons:** 
    - **Primary:** Linear gradient (Teal) with `text-inverse` for labels. 
    - **Secondary:** Ghost style with `border-subtle` and Teal text.
- **Skill Raters:** A custom 5-segment control. Unfilled states use `Surface-3`; active states use a solid Teal fill. These must have a minimum touch target of 44px.
- **Recommendation Cards:** Use a top-to-bottom background gradient (`rgba(255,255,255,0.02)` to `transparent`). Match scores are placed in the top-right corner using a Gold pill.
- **Input Fields:** Dark background (`#0b0e12`), `border-subtle`, and a 2px Teal bottom-border highlight on focus.
- **Adaptive Progress:** A thin (2px) Teal line at the very top of the viewport to indicate onboarding completion, maintaining a non-intrusive cinematic feel.