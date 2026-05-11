---
name: Emergency Operations Command
colors:
  surface: '#fbf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fbf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#1e1200'
  on-tertiary: '#ffffff'
  tertiary-container: '#35260c'
  on-tertiary-container: '#a38c6a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fadfb8'
  tertiary-fixed-dim: '#ddc39d'
  on-tertiary-fixed: '#271902'
  on-tertiary-fixed-variant: '#564427'
  background: '#fbf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e3'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style
The visual identity of this design system is rooted in **Corporate Minimalism**, specifically optimized for high-pressure emergency management environments. The design must project absolute reliability, technical precision, and calm authority. By stripping away non-essential decorative elements, the UI focuses entirely on data clarity and rapid decision-making.

The aesthetic follows a "Modern SaaS" approach: clean, functional, and systematic. It avoids visual clutter to reduce cognitive load for operators who must process complex information quickly. The interface feels like a sophisticated tool—utilitarian yet refined—utilizing ample whitespace and a disciplined color application to guide the user's eye to critical alerts.

## Colors
The palette is anchored by **Deep Slate (#1e293b)**, providing a stable, authoritative foundation for primary actions and navigation. The background uses a **Soft Neutral (#f8fafc)** to reduce screen glare during long shifts while maintaining a crisp, modern feel.

Semantic colors are the most vital part of the palette. They are used sparingly but vibrantly to denote status. **Critical Red** and **High Priority Orange** are reserved for active emergencies and immediate threats, while **Success Green** confirms resolved states. High contrast between text and background is strictly maintained to ensure accessibility under various lighting conditions.

## Typography
This design system utilizes **Inter** as the primary typeface for its exceptional legibility in digital interfaces and its neutral, professional tone. The hierarchy is strictly enforced to separate "System Information" from "Operational Data."

- **Headlines:** Use tighter letter spacing and heavier weights to anchor card sections.
- **Data Display:** For coordinates, timestamps, and ID numbers, a secondary monospace font (JetBrains Mono) is recommended to ensure character distinction (e.g., distinguishing '0' from 'O').
- **Labels:** Small, uppercase labels with increased tracking are used for metadata headers to provide a clear distinction from interactive body text.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum constraints for dashboard views. Content is organized into a 12-column system on desktop, collapsing to a single column on mobile.

- **Dashboard Layout:** Utilizes a sidebar navigation (240px fixed) with a flexible main content area.
- **Card Spacing:** A standard 16px (md) gutter exists between cards, while internal card padding is set to 24px (lg) to ensure data doesn't feel cramped.
- **Rhythm:** All spatial dimensions are multiples of 4px, creating a predictable visual cadence that aids in rapid scanning of tabular data.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Outlines** rather than heavy shadows. This keeps the interface feeling "flat" and efficient.

- **Level 0 (Background):** #f8fafc.
- **Level 1 (Cards/Surface):** White (#ffffff) with a 1px solid border in #e2e8f0. This is the primary container for data.
- **Level 2 (Popovers/Modals):** White with a soft, diffused shadow (0 10px 15px -3px rgba(0, 0, 0, 0.05)) to indicate temporary interaction layers.
- **Interactive States:** Buttons and clickable rows use a subtle background shift (e.g., #f1f5f9) on hover rather than an elevation change, maintaining a stable UI footprint.

## Shapes
The design system employs a **Rounded (8px)** corner radius for all primary containers and interactive elements. This radius strikes a balance between the precision of sharp corners and the approachability of rounded ones.

- **Components:** Buttons, Input fields, and Cards all share the 8px radius.
- **Badges/Pills:** Status indicators use a fully rounded (pill) shape to distinguish them from larger structural elements.
- **Selection States:** Focus rings should follow the 8px radius with a 2px offset to maintain shape integrity.

## Components
Consistent with the **shadcn/ui** philosophy, components are minimalist and highly functional.

- **Buttons:** Primary buttons use the Slate (#1e293b) background with white text. Secondary buttons use a ghost style with the Slate border.
- **Status Pills:** Used for "Active," "Pending," and "Resolved" states. These use a light tinted background of the semantic color (10% opacity) with high-contrast bold text.
- **Data Tables:** Clean rows with 1px bottom borders. Header cells use the `label-caps` typography style. Zebra-striping is avoided in favor of hover highlighting.
- **Information Cards:** Cards are the primary unit of the layout. They must contain a clear header, an optional icon, and a structured body.
- **Iconography:** Use **Lucide-React**. Icons should be set to a 2px stroke width. In navigation, icons precede text; in status badges, they act as immediate visual cues for the severity of the alert.
- **Alert Banners:** Full-width components at the top of the viewport for system-wide emergencies, using the Critical Red or High Priority Orange background.