import { NextResponse } from "next/server";

import { createAdminClient, createAnonClient } from "@/lib/supabase/clients";

const normalizeEmail = (value: unknown) => String(value || "").trim().toLowerCase();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    // Always return the same public response so this endpoint cannot be used to enumerate admins.
    const publicOk = NextResponse.json({ ok: true });
    if (!email || !email.includes("@")) return publicOk;

    const adminClient = createAdminClient();
    const { data: adminRow } = await adminClient
      .from("internal_admins")
      .select("user_id,email")
      .eq("email", email)
      .maybeSingle();

    if (!adminRow?.user_id) return publicOk;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getbetweener.com";
    const anonClient = createAnonClient();
    await anonClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl.replace(/\/$/, "")}/admin/callback`,
        shouldCreateUser: false
      }
    });

    return publicOk;
  } catch (error) {
    console.error("admin auth start error", error);
    return NextResponse.json({ ok: true });
  }
}
