import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";

const asTextArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12) : [];
const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

  const body = await request.json().catch(() => ({}));
  const title = text(body.title);
  const startsAt = text(body.starts_at);
  if (!title || !startsAt) return NextResponse.json({ error: "title and starts_at are required" }, { status: 400 });

  const { data, error } = await session.client.rpc("rpc_create_gathering_request", {
    p_circle_id: text(body.circle_id),
    p_title: title,
    p_description: text(body.description),
    p_gathering_type: text(body.gathering_type) || "physical",
    p_country_code: text(body.country_code),
    p_country_name: text(body.country_name),
    p_region: text(body.region),
    p_city: text(body.city),
    p_venue_name: text(body.venue_name),
    p_venue_address: text(body.venue_address),
    p_address_visibility: text(body.address_visibility) || "attendees_only",
    p_online_url: text(body.online_url),
    p_platform: text(body.platform),
    p_starts_at: startsAt,
    p_ends_at: text(body.ends_at),
    p_timezone: text(body.timezone),
    p_max_attendees: typeof body.max_attendees === "number" ? body.max_attendees : null,
    p_tags: asTextArray(body.tags),
    p_safety_note: text(body.safety_note)
  });

  if (error || !data) return NextResponse.json({ error: error?.message || "Unable to create Gathering" }, { status: 500 });
  return NextResponse.json({ ok: true, gathering: data });
}
