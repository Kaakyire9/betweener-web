import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  for (const name of ["bt-admin-access-token", "bt-admin-refresh-token", "sb-access-token"]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }
  return response;
}
