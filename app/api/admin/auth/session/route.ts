import { NextResponse } from "next/server";

import { setAdminSessionCookies } from "@/lib/admin/auth";
import { createUserClient } from "@/lib/supabase/clients";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const accessToken = typeof body.access_token === "string" ? body.access_token : null;
    const refreshToken = typeof body.refresh_token === "string" ? body.refresh_token : null;
    const expiresIn = typeof body.expires_in === "number" ? body.expires_in : null;

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    const client = createUserClient(accessToken);
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { data: isAdmin, error: adminError } = await client.rpc("is_internal_admin");
    if (adminError || isAdmin !== true) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await setAdminSessionCookies(accessToken, refreshToken, expiresIn);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("admin session error", error);
    return NextResponse.json({ error: "Unable to establish admin session" }, { status: 500 });
  }
}
