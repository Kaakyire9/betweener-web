import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const gatheringId = typeof body.gathering_id === "string" ? body.gathering_id : null;
  const decision = typeof body.decision === "string" ? body.decision : null;
  const reason = typeof body.reason === "string" ? body.reason : null;

  if (!gatheringId || !decision) return NextResponse.json({ error: "gathering_id and decision are required" }, { status: 400 });
  if (decision !== "approve" && decision !== "reject") return NextResponse.json({ error: "decision must be approve or reject" }, { status: 400 });

  const { data, error } = decision === "approve"
    ? await session.client.rpc("rpc_approve_gathering", { p_gathering_id: gatheringId })
    : await session.client.rpc("rpc_reject_gathering", { p_gathering_id: gatheringId, p_reason: reason || "Rejected by Betweener review." });

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to update Gathering" }, { status: 500 });
  return NextResponse.json({ ok: true, gathering: data });
}
