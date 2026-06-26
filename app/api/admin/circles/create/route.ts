import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

const asTextArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12) : [];
const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const name = text(body.name);
  if (!name) return NextResponse.json({ error: "Circle name is required" }, { status: 400 });

  const { data, error } = await session.client.rpc("rpc_create_circle_request", {
    p_name: name,
    p_description: text(body.description),
    p_short_description: text(body.short_description),
    p_circle_type: text(body.circle_type) || "official",
    p_visibility_scope: text(body.visibility_scope) || "country",
    p_country_code: text(body.country_code),
    p_country_name: text(body.country_name),
    p_region: text(body.region),
    p_city: text(body.city),
    p_diaspora_tags: asTextArray(body.diaspora_tags),
    p_culture_tags: asTextArray(body.culture_tags),
    p_faith_tags: asTextArray(body.faith_tags),
    p_interest_tags: asTextArray(body.interest_tags),
    p_audience_tags: asTextArray(body.audience_tags),
    p_requires_join_approval: Boolean(body.requires_join_approval),
    p_rules: text(body.rules)
  });

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to create Circle" }, { status: 500 });
  return NextResponse.json({ ok: true, circle: data });
}
