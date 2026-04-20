import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const body = await request.json().catch(() => ({}));
  const profileId = typeof body.profile_id === "string" ? body.profile_id : null;
  const action = typeof body.action === "string" ? body.action : null;

  if (!profileId || !action) {
    return NextResponse.json({ error: "profile_id and action are required" }, { status: 400 });
  }

  const response =
    action === "request"
      ? await session.client.rpc("rpc_admin_request_verification_refresh", {
          p_profile_id: profileId,
          p_target_level: Number(body.target_level || 1),
          p_reason: typeof body.reason === "string" ? body.reason : null
        })
      : action === "clear"
        ? await session.client.rpc("rpc_admin_clear_verification_refresh", { p_profile_id: profileId })
        : { data: null, error: { message: "Invalid fresh review action" } };

  if (response.error || !response.data) {
    return NextResponse.json({ error: response.error?.message || "Unable to update fresh review request" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
