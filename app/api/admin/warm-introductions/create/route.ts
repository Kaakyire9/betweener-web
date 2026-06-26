import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

const asTextArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12) : [];
const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const profileA = text(body.profile_a_id);
  const profileB = text(body.profile_b_id);
  const reason = text(body.reason);
  if (!profileA || !profileB || !reason) return NextResponse.json({ error: "profile_a_id, profile_b_id, and reason are required" }, { status: 400 });

  const { data, error } = await session.client.rpc("rpc_create_warm_introduction", {
    p_circle_id: text(body.circle_id),
    p_profile_a_id: profileA,
    p_profile_b_id: profileB,
    p_reason: reason,
    p_shared_context: asTextArray(body.shared_context),
    p_expires_at: text(body.expires_at)
  });

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to create Warm Introduction" }, { status: 500 });
  return NextResponse.json({ ok: true, introduction: data });
}
