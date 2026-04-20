import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const caseId = typeof body.case_id === "string" ? body.case_id : null;
  const status = typeof body.status === "string" ? body.status : null;
  const notes = typeof body.notes === "string" ? body.notes : null;

  if (!caseId || !status) {
    return NextResponse.json({ error: "case_id and status are required" }, { status: 400 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_update_account_merge_case", {
    p_case_id: caseId,
    p_status: status,
    p_notes: notes,
    p_execution_summary: null
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update merge case" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
