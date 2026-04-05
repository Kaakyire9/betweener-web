# Paystack Web Billing (Betweener)

This folder contains the Paystack web checkout scaffolding and Supabase webhook integration.

## What this adds
- Web checkout UI (`/billing`, `/billing/checkout`, `/billing/processing`)
- API routes to initialize and verify Paystack transactions
- Supabase Edge Function webhook to grant fixed-term web memberships
- SQL migrations to add Paystack support

## Environment variables
### Website (Next.js)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`\n- `NEXT_PUBLIC_SITE_URL`

### Supabase Edge Function
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET`

## Files
- `app/api/billing/paystack/initialize/route.ts`
- `app/api/billing/paystack/verify/route.ts`
- `app/api/billing/me/route.ts`
- `app/billing/page.tsx`
- `app/billing/checkout/page.tsx`
- `app/billing/processing/page.tsx`
- `lib/billing/plans.ts`
- `lib/billing/paystack.ts`
- `lib/billing/env.ts`
- `lib/auth/get-access-token.ts`
- `lib/supabase/clients.ts`
- `supabase/migrations/001_paystack_web_memberships.sql`
- `supabase/functions/paystack-webhook/index.ts`

## Notes
- Paystack is **web-only**. Mobile in-app purchases remain RevenueCat.
- The webhook writes entitlements into `public.subscriptions` using the existing fields:
  `type`, `is_active`, `started_at`, `ends_at`, `source`.
- The mobile app should resolve the **highest active plan** across RevenueCat + server.