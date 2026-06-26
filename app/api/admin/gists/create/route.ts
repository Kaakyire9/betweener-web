import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/clients";

const asTextArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12) : [];
const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const title = text(body.title);
  const gistBody = text(body.body);
  if (!title || !gistBody) return NextResponse.json({ error: "title and body are required" }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("relationship_gists")
    .insert({
      title,
      body: gistBody,
      short_body: text(body.short_body),
      perspective: text(body.perspective) || "general",
      status: body.publish === true ? "published" : "draft",
      country_code: text(body.country_code),
      city: text(body.city),
      audience_tags: asTextArray(body.audience_tags),
      faith_tags: asTextArray(body.faith_tags),
      culture_tags: asTextArray(body.culture_tags),
      relationship_intent_tags: asTextArray(body.relationship_intent_tags),
      created_by_admin_id: session.user.id,
      published_at: body.publish === true ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to create Relationship Gist" }, { status: 500 });
  return NextResponse.json({ ok: true, gist: data });
}
