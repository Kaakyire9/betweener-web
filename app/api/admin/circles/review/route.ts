import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const circleId = typeof body.circle_id === "string" ? body.circle_id : null;
  const decision = typeof body.decision === "string" ? body.decision : null;
  const reason = typeof body.reason === "string" ? body.reason : null;

  if (!circleId || !decision) return NextResponse.json({ error: "circle_id and decision are required" }, { status: 400 });
  const rpc = decision === "approve" ? "rpc_approve_circle" : decision === "reject" ? "rpc_reject_circle" : null;
  if (!rpc) return NextResponse.json({ error: "decision must be approve or reject" }, { status: 400 });

  const { data, error } = decision === "approve"
    ? await session.client.rpc("rpc_approve_circle", { p_circle_id: circleId })
    : await session.client.rpc("rpc_reject_circle", { p_circle_id: circleId, p_reason: reason || "Rejected by Betweener review." });

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to update Circle" }, { status: 500 });
  return NextResponse.json({ ok: true, circle: data });
}
