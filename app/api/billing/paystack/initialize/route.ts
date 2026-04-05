import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/get-access-token";
import { getPlanPrice } from "@/lib/billing/plans";
import { paystackInitialize } from "@/lib/billing/paystack";
import { requireEnv } from "@/lib/billing/env";
import { createAdminClient, createUserClient } from "@/lib/supabase/clients";

const CALLBACK_URL = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/billing/processing` : "https://getbetweener.com/billing/processing";

function generateReference() {
  return `btw_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const planType = payload?.plan_type;
  const interval = payload?.billing_interval;

  if (!planType || !interval) {
    return NextResponse.json({ error: "Missing plan_type or billing_interval" }, { status: 400 });
  }

  if (planType !== "SILVER" && planType !== "GOLD") {
    return NextResponse.json({ error: "Invalid plan_type" }, { status: 400 });
  }

  if (interval !== "monthly" && interval !== "quarterly") {
    return NextResponse.json({ error: "Invalid billing_interval" }, { status: 400 });
  }

  const price = getPlanPrice(planType, interval);
  const userClient = createUserClient(accessToken);
  const { data: userData, error: userError } = await userClient.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.json({ error: "Unable to resolve user" }, { status: 401 });
  }

  const reference = generateReference();

  const initializePayload = {
    email: userData.user.email ?? "unknown@getbetweener.com",
    amount: price.amountMinor,
    currency: price.currency,
    reference,
    callback_url: CALLBACK_URL,
    metadata: {
      user_id: userData.user.id,
      plan_type: price.planType,
      billing_interval: price.interval,
      product_id: price.productId,
      source: "web"
    },
    channels: ["mobile_money", "card", "bank"]
  };

  const secretKey = requireEnv("PAYSTACK_SECRET_KEY");
  const initResult = await paystackInitialize(initializePayload, secretKey);

  const adminClient = createAdminClient();
  const { error: sessionError } = await adminClient.from("paystack_checkout_sessions").insert({
    user_id: userData.user.id,
    plan_type: price.planType,
    billing_interval: price.interval,
    reference,
    amount_minor: price.amountMinor,
    currency: price.currency,
    status: "pending"
  });

  if (sessionError) {
    return NextResponse.json({ error: "Unable to persist checkout session" }, { status: 500 });
  }

  return NextResponse.json({
    reference: initResult.reference,
    authorization_url: initResult.authorization_url
  });
}