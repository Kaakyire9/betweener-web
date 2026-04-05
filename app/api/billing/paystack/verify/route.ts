import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/get-access-token";
import { paystackVerify } from "@/lib/billing/paystack";
import { requireEnv } from "@/lib/billing/env";

export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const secretKey = requireEnv("PAYSTACK_SECRET_KEY");
  const data = await paystackVerify(reference, secretKey);

  return NextResponse.json({
    status: data.status,
    reference: data.reference,
    amount: data.amount,
    currency: data.currency
  });
}