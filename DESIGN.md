---
name: Heritage Intelligence
colors:
  surface: '#191211'
  surface-dim: '#191211'
  surface-bright: '#403736'
  surface-container-lowest: '#130d0c'
  surface-container-low: '#211a19'
  surface-container: '#261e1d'
  surface-container-high: '#302827'
  surface-container-highest: '#3c3332'
  on-surface: '#eedfdd'
  on-surface-variant: '#e0bfb6'
  inverse-surface: '#eedfdd'
  inverse-on-surface: '#372e2d'
  outline: '#a88a81'
  outline-variant: '#59413a'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5d1800'
  primary-container: '#ef6637'
  on-primary-container: '#521400'
  inverse-primary: '#ab3506'
  secondary: '#f4b8b5'
  on-secondary: '#4c2525'
  secondary-container: '#663b3a'
  on-secondary-container: '#e1a7a4'
  tertiary: '#ffb95c'
  on-tertiary: '#462a00'
  tertiary-container: '#c48320'
  on-tertiary-container: '#3d2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#390b00'
  on-primary-fixed-variant: '#842500'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#f4b8b5'
  on-secondary-fixed: '#321111'
  on-secondary-fixed-variant: '#663b3a'
  tertiary-fixed: '#ffddb7'
  tertiary-fixed-dim: '#ffb95c'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#191211'
  on-background: '#eedfdd'
  surface-variant: '#3c3332'
typography:
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1280px
---

## Brand & Style
The design system is anchored in a narrative of timeless wisdom and high-end archival intelligence. It evokes a feeling of warmth, authority, and scholarly depth, blending the richness of historical textures with the precision of modern data analysis. 

The visual style is **Corporate / Modern** with a **Tactile** lean. It uses deep, earthen backgrounds and vibrant, warm accents to create a high-contrast environment that feels both sophisticated and accessible. The interface prioritizes readability and structural clarity, ensuring that complex information feels grounded and prestigious.

## Colors
This design system utilizes a dark-mode first palette inspired by natural pigments and sunset hues.

- **Primary Accent (#E05B2D):** A vibrant Sunset Orange used for key actions, brand highlights, and critical path indicators.
- **Secondary / Container (#613736):** A Muted Mahogany used for structural grouping, cards, and secondary navigation elements to provide warmth without overwhelming the eye.
- **Tertiary / Functional (#F0A844):** A Marigold Gold reserved for informational accents, warnings, or specialized data visualization points.
- **Surface / Neutral (#271F1E):** A Deep Charcoal Brown that serves as the foundation of the UI, providing a low-strain, premium backdrop.
- **Text / Ivory (#F5F2F0):** A soft, desaturated off-white used for all readable content to maintain high contrast against the dark base while avoiding the harshness of pure white.

## Typography
The typography strategy pairs the intellectual authority of a serif with the functional efficiency of a sharp sans-serif.

- **Headlines:** Use **Source Serif 4**. It provides a clean, literary quality that reinforces the "Heritage" aspect of the system. Large display headers should use tighter letter spacing and bold weights.
- **UI & Body:** Use **Hanken Grotesk**. This font delivers high legibility for data-heavy views and interface labels. 
- **Labels:** Small UI labels and buttons should utilize the semi-bold weight of Hanken Grotesk with a slight increase in letter-spacing for maximum clarity in dark mode.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain the editorial, structured feel of a high-end publication, while transitioning to a fluid model for mobile devices.

- **Desktop:** A 12-column grid with 24px gutters. The content is centered with a max-width of 1280px.
- **Tablet:** An 8-column grid with 16px gutters and 24px side margins.
- **Mobile:** A 4-column fluid grid with 16px margins. 

Spacing follows a strict 8px linear scale. Large sections of content should be separated by 48px or 64px to allow the deep background colors to provide visual breathing room.

## Elevation & Depth
Depth is created through **Tonal Layering** rather than traditional shadows. Because the background is a deep charcoal brown, elevation is expressed by shifting the surface color towards the Muted Mahogany (#613736).

- **Level 0 (Base):** Deep Charcoal Brown (#271F1E).
- **Level 1 (Cards/Containers):** Muted Mahogany (#613736) at 100% opacity.
- **Level 2 (Overlays/Modals):** Muted Mahogany with a 1px inner stroke of Ivory at 10% opacity to define the edge.
- **Shadows:** When necessary, use very large, soft blurs (30px+) with 40% opacity of a black tint to create a subtle ambient lift.

## Shapes
The shape language is modern and approachable. A consistent 8px (0.5rem) corner radius is applied to all primary UI elements, balancing the classic serif typography with a contemporary, "soft-tech" feel. 

Interactive elements like buttons and input fields adhere strictly to this 8px rule, while larger container blocks or feature sections may scale up to 16px (rounded-lg) to emphasize their structural importance.

## Components
- **Buttons:** Primary buttons use Sunset Orange (#E05B2D) with Ivory text. Secondary buttons use an Ivory outline with 15% opacity.
- **Input Fields:** Use the Surface color with a 1px border of Muted Mahogany. On focus, the border transitions to Sunset Orange.
- **Chips:** Small, 8px rounded capsules using Muted Mahogany backgrounds and Marigold Gold text for status indicators.
- **Lists:** Separated by thin 1px horizontal dividers in Ivory at 5% opacity. High-density list items use Hanken Grotesk labels.
- **Cards:** Use the Muted Mahogany base. Imagery within cards should have a subtle warm overlay to harmonize with the brand palette.
- **Navigation:** Top-level navigation items use Source Serif 4 in Medium weight to feel like a table of contents in a premium archive.