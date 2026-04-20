import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { insertAdminSystemMessage } from "@/lib/admin/notifications";
import { createAdminClient } from "@/lib/supabase/clients";

function conciergeMessage(status: string) {
  switch (status) {
    case "claimed":
      return "A Betweener concierge is reviewing your date request.";
    case "completed":
      return "Your Betweener concierge request has been completed. Open the date plan to review the details.";
    case "cancelled":
      return "Your Betweener concierge request has been closed. You can still suggest another date when it feels right.";
    default:
      return null;
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const requestId = typeof body.request_id === "string" ? body.request_id : null;
  const status = typeof body.status === "string" ? body.status : null;

  if (!requestId || !status) {
    return NextResponse.json({ error: "request_id and status are required" }, { status: 400 });
  }

  const normalizedStatus = status.toLowerCase().trim();
  const admin = createAdminClient();
  const { data: existingRequest, error: existingError } = await admin
    .from("date_plan_concierge_requests")
    .select("id,status,date_plan_id,requested_by_user_id,requested_by_profile_id")
    .eq("id", requestId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_update_date_plan_concierge_request", {
    p_request_id: requestId,
    p_status: normalizedStatus
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update concierge request" }, { status: 500 });
  }

  const previousStatus = String(existingRequest?.status || "pending").toLowerCase();
  const message = previousStatus !== normalizedStatus ? conciergeMessage(normalizedStatus) : null;
  const notification = message
    ? await insertAdminSystemMessage({
        userId: existingRequest?.requested_by_user_id,
        eventType: `date_plan_concierge_${normalizedStatus}`,
        text: message,
        metadata: {
          concierge_request_id: requestId,
          date_plan_id: existingRequest?.date_plan_id ?? null,
          requested_by_profile_id: existingRequest?.requested_by_profile_id ?? null
        }
      })
    : { ok: true as const };

  return NextResponse.json({
    ok: true,
    notification_warning: notification.ok ? null : notification.error
  });
}
