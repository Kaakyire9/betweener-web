import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { insertAdminSystemMessage } from "@/lib/admin/notifications";
import { createAdminClient } from "@/lib/supabase/clients";

function reportOutcomeMessage(status: string) {
  const normalized = status.toUpperCase();
  if (normalized !== "RESOLVED" && normalized !== "DISMISSED") return null;
  return "Your report has been reviewed. Thanks for helping keep Betweener safe.";
}

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

  const normalizedStatus = status.toUpperCase().trim();
  const admin = createAdminClient();
  const { data: existingReport, error: existingError } = await admin
    .from("reports")
    .select("id,status,reporter_id")
    .eq("id", reportId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_update_report_status", {
    p_report_id: reportId,
    p_status: normalizedStatus
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update report" }, { status: 500 });
  }

  const previousStatus = String(existingReport?.status || "PENDING").toUpperCase();
  const message = previousStatus !== normalizedStatus ? reportOutcomeMessage(normalizedStatus) : null;
  const notification = message
    ? await insertAdminSystemMessage({
        userId: existingReport?.reporter_id,
        eventType: "admin_report_reviewed",
        text: message,
        metadata: {
          report_id: reportId,
          report_status: normalizedStatus
        }
      })
    : { ok: true as const };

  return NextResponse.json({
    ok: true,
    notification_warning: notification.ok ? null : notification.error
  });
}
