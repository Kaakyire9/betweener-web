import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const caseId = typeof body.case_id === "string" ? body.case_id : null;

  if (!caseId) {
    return NextResponse.json({ error: "case_id is required" }, { status: 400 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_preview_account_merge_case", {
    p_case_id: caseId
  });

  if (error) {
    return NextResponse.json({ error: error.message || "Unable to preview merge case" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, preflight: data ?? null });
}
