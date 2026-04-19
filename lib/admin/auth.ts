import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/get-access-token";
import { createAnonClient, createUserClient } from "@/lib/supabase/clients";

export const ADMIN_ACCESS_COOKIE = "bt-admin-access-token";
export const ADMIN_REFRESH_COOKIE = "bt-admin-refresh-token";

export type AdminUser = {
  id: string;
  email: string | null;
};

export async function getAdminSession() {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false as const, status: 401, error: "Unauthorized" };

  const client = createUserClient(accessToken);
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false as const, status: 401, error: "Session expired" };
  }

  const { data: isAdmin, error: adminError } = await client.rpc("is_internal_admin");
  if (adminError || isAdmin !== true) {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }

  return {
    ok: true as const,
    accessToken,
    client,
    user: {
      id: userData.user.id,
      email: userData.user.email ?? null
    } satisfies AdminUser
  };
}

export async function setAdminSessionCookies(accessToken: string, refreshToken?: string | null, expiresIn?: number | null) {
  const cookieStore = await cookies();
  const maxAge = Math.max(300, Math.min(Number(expiresIn || 3600), 60 * 60 * 24 * 7));

  cookieStore.set(ADMIN_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });

  cookieStore.set("sb-access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });

  if (refreshToken) {
    cookieStore.set(ADMIN_REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }
}

export async function clearAdminSessionCookies(response?: NextResponse) {
  const cookieStore = await cookies();
  const names = [ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE, "sb-access-token"];

  for (const name of names) {
    cookieStore.delete(name);
    response?.cookies.delete(name);
  }
}

export async function refreshAdminSession(refreshToken: string) {
  const anon = createAnonClient();
  const { data, error } = await anon.auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session?.access_token) return null;
  await setAdminSessionCookies(data.session.access_token, data.session.refresh_token, data.session.expires_in);
  return data.session.access_token;
}
