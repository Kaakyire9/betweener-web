import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  return NextResponse.json({ user: session.user });
}
