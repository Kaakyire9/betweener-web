import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const requestId = typeof body.request_id === "string" ? body.request_id : null;
  const decision = typeof body.decision === "string" ? body.decision : null;
  const notes = typeof body.notes === "string" ? body.notes : null;

  if (!requestId || !decision) {
    return NextResponse.json({ error: "request_id and decision are required" }, { status: 400 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_review_verification_request", {
    p_request_id: requestId,
    p_decision: decision,
    p_notes: notes
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update verification" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
