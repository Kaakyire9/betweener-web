import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const reportId = typeof body.report_id === "string" ? body.report_id : null;
  const status = typeof body.status === "string" ? body.status : null;

  if (!reportId || !status) {
    return NextResponse.json({ error: "report_id and status are required" }, { status: 400 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_update_report_status", {
    p_report_id: reportId,
    p_status: status
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update report" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
