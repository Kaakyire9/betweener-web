# Betweener Website Design System

## Token Sources

- Runtime tokens: `app/tokens.css`
- Global application styles: `app/globals.css`
- Core primitives: `components/ui/button.tsx`, `components/ui/card.tsx`
- Font stack: `app/layout.tsx`

## Brand Intent

Betweener web should feel like an editorial extension of the app: slower, more spacious, and more atmospheric, while staying aligned on trust, chemistry, context, and intentional momentum.

## Core Fonts

- Display: Playfair Display
- Body/UI: Manrope
- Support/labels: Archivo

## Semantic Color Tokens

- Canvas: `--bg-canvas`
- Elevated: `--bg-elevated`
- Surface: `--bg-surface`
- Surface Soft: `--bg-surface-soft`
- Primary Text: `--text-primary`
- Secondary Text: `--text-secondary`
- Muted Text: `--text-muted`
- Primary Brand CTA: `--accent-primary`
- Warm Editorial Accent: `--accent-warm`
- Chemistry Signal: `--signal-chemistry`
- Gold Trust Signal: `--signal-gold`

## Shape And Depth

- Small radius: `--bet-radius-sm`
- Medium radius: `--bet-radius-md`
- Large radius: `--bet-radius-lg`
- Soft shadow: `--bet-shadow-soft`
- Elevated shadow: `--bet-shadow-elevated`
- Teal glow: `--bet-glow-teal`
- Warm glow: `--bet-glow-warm`

## Usage Rules

- Use teal for action and active focus.
- Use champagne and gold for editorial framing, not primary interaction.
- Keep purple limited to chemistry/momentum storytelling.
- Use `betweener-eyebrow` for structured overlines instead of inventing new label styles.
- Use `Card` and `Button` primitives before introducing new surface or CTA treatments.
- Prefer `text-muted-foreground` for support copy and `text-foreground` for statements.

## Tailwind Theme Notes

The token file exports Tailwind v4-compatible `@theme inline` aliases for:

- fonts
- colors
- radii
- shadows

That means new components can use theme classes like `text-foreground`, `bg-background`, `font-display`, or direct token-driven arbitrary values such as `bg-[color:var(--bg-overlay)]`.

## Theming

Dark is the default production theme.
An optional light theme is scaffolded through `[data-theme="light"]` in `app/tokens.css` for future legal or campaign needs.