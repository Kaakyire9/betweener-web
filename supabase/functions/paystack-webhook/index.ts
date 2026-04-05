import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function hmacSHA512(key: string, payload: string) {
  const encoder = new TextEncoder();
  return crypto.subtle
    .importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-512" }, false, ["sign"])
    .then((cryptoKey) => crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(payload)));
}

async function verifySignature(rawBody: string, signature: string) {
  const sig = await hmacSHA512(PAYSTACK_SECRET, rawBody);
  const hash = Array.from(new Uint8Array(sig))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hash === signature;
}

function getDurationDays(interval: string) {
  return interval === "quarterly" ? 90 : 30;
}

serve(async (req) => {
  if (!PAYSTACK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";

  if (!(await verifySignature(rawBody, signature))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventReference = event.data?.reference ?? event.data?.id ?? "unknown";
  const eventId = `${event.event}:${eventReference}`;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { error: eventError } = await supabase.from("paystack_webhook_events").insert({
    event_id: eventId,
    event_type: event.event,
    reference: event.data?.reference ?? null,
    payload: event
  });

  if (eventError && eventError.code !== "23505") {
    return new Response("Event insert failed", { status: 500 });
  }

  if (eventError && eventError.code === "23505") {
    return new Response("Duplicate", { status: 200 });
  }

  const metadata = event.data?.metadata ?? {};
  const userId = metadata.user_id;
  if (!userId) {
    return new Response("Missing user_id", { status: 400 });
  }

  if (event.event === "charge.success") {
    const interval = metadata.billing_interval ?? "monthly";
    const planType = metadata.plan_type;
    if (planType !== "SILVER" && planType !== "GOLD") {
      return new Response("Invalid plan_type", { status: 400 });
    }
    if (interval !== "monthly" && interval !== "quarterly") {
      return new Response("Invalid billing_interval", { status: 400 });
    }

    const durationDays = getDurationDays(interval);
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

    await supabase
      .from("subscriptions")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("source", "paystack");

    await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          type: planType,
          is_active: true,
          started_at: startedAt.toISOString(),
          ends_at: endsAt.toISOString(),
          source: "paystack",
          billing_provider: "paystack",
          external_reference: event.data.reference,
          external_customer_id: event.data.customer?.customer_code ?? null,
          external_product_id: metadata.product_id ?? null,
          billing_interval: interval,
          currency: event.data.currency,
          amount_minor: event.data.amount,
          metadata
        },
        { onConflict: "external_reference" }
      );
  }

  if (event.event === "charge.reversed") {
    await supabase
      .from("subscriptions")
      .update({ is_active: false, cancelled_at: new Date().toISOString() })
      .eq("external_reference", event.data.reference)
      .eq("source", "paystack");
  }

  return new Response("OK", { status: 200 });
});