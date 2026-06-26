import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const gistId = typeof body.gist_id === "string" ? body.gist_id : null;
  if (!gistId) return NextResponse.json({ error: "gist_id is required" }, { status: 400 });

  const { data, error } = await session.client.rpc("rpc_publish_relationship_gist", { p_gist_id: gistId });
  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to publish Relationship Gist" }, { status: 500 });
  return NextResponse.json({ ok: true, gist: data });
}
