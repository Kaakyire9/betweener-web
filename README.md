# Betweener Web

Premium marketing and compliance website for Betweener, built as a standalone Next.js App Router project.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn-style UI primitives
- Framer Motion
- Vercel-ready deployment

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Deploy on Vercel

1. Push this project to its own Git repository.
2. Import the repository into Vercel.
3. Leave the framework preset as `Next.js`.
4. Set the production domain to `getbetweener.com`.
5. Deploy.

## Replace Before Launch

- `lib/site-config.ts`
  - Replace App Store URL placeholder.
  - Replace Google Play URL placeholder.
  - Replace legal entity name.
  - Replace effective date.
  - Replace company mailing address.
  - Replace governing law and venue.
  - Confirm support and privacy emails.
- `app/privacy/page.tsx`
  - Finalize legal bases, retention schedule, and international transfer language.
- `app/terms/page.tsx`
  - Finalize billing, subscription, liability, dispute, and content license language.
- `app/delete-account/page.tsx`
  - Confirm in-app deletion path labels.
  - Confirm deletion timeline and retention exceptions.
- Homepage and CTAs
  - Swap placeholder store links for live store links.
  - Optionally replace text CTAs with official Apple and Google badge assets.

## Notes

- The site structure is designed to support future Supabase-backed forms without changing the page architecture.
- All page metadata is centralized through `lib/metadata.ts`.