import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { insertAdminSystemMessage } from "@/lib/admin/notifications";
import { createAdminClient } from "@/lib/supabase/clients";

function recoveryMessage(status: string) {
  switch (status) {
    case "reviewing":
      return "Your account recovery request is being reviewed by Betweener support.";
    case "resolved":
      return "Your account recovery request has been completed. Open Betweener to continue.";
    case "closed":
      return "Your account recovery request has been reviewed and closed. If you still need help, contact support@getbetweener.com.";
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
  const reviewNotes = typeof body.review_notes === "string" ? body.review_notes : null;
  const linkedMergeCaseId = typeof body.linked_merge_case_id === "string" ? body.linked_merge_case_id : null;

  if (!requestId || !status) {
    return NextResponse.json({ error: "request_id and status are required" }, { status: 400 });
  }

  const normalizedStatus = status.toLowerCase().trim();
  const admin = createAdminClient();
  const { data: existingRequest, error: existingError } = await admin
    .from("account_recovery_requests")
    .select("id,status,requester_user_id,requester_profile_id,linked_merge_case_id")
    .eq("id", requestId)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  const { data, error } = await session.client.rpc("rpc_admin_update_account_recovery_request", {
    p_request_id: requestId,
    p_status: normalizedStatus,
    p_review_notes: reviewNotes,
    p_linked_merge_case_id: linkedMergeCaseId
  });

  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Unable to update recovery request" }, { status: 500 });
  }

  const previousStatus = String(existingRequest?.status || "pending").toLowerCase();
  const message = previousStatus !== normalizedStatus ? recoveryMessage(normalizedStatus) : null;
  const notification = message
    ? await insertAdminSystemMessage({
        userId: existingRequest?.requester_user_id,
        eventType: `account_recovery_${normalizedStatus}`,
        text: message,
        metadata: {
          recovery_request_id: requestId,
          requester_profile_id: existingRequest?.requester_profile_id ?? null,
          linked_merge_case_id: linkedMergeCaseId ?? existingRequest?.linked_merge_case_id ?? null
        }
      })
    : { ok: true as const };

  return NextResponse.json({
    ok: true,
    notification_warning: notification.ok ? null : notification.error
  });
}
