"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CircleAdminRow, GatheringAdminRow, RelationshipGistAdminRow, WarmIntroductionAdminRow } from "@/lib/admin/types";

type NotesSetter = React.Dispatch<React.SetStateAction<Record<string, string>>>;

const csv = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const formatDate = (value?: string | null) => {
  if (!value) return "Not set";
  try { return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); } catch { return value; }
};
const shortId = (value?: string | null) => value ? value.slice(0, 8) : "none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-2"><span className="font-support text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>{children}</label>;
}

function SelectField({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/20 px-3 text-sm text-foreground outline-none">{children}</select>;
}

function statusVariant(status?: string | null) {
  const value = String(status || "").toLowerCase();
  if (["approved", "published", "accepted"].includes(value)) return "trust" as const;
  if (["rejected", "cancelled", "declined", "archived"].includes(value)) return "warm" as const;
  return "signal" as const;
}

export function CirclesAdminSection({ rows, busyId, notesById, setNotesById, onCreate, onReview }: {
  rows: CircleAdminRow[];
  busyId: string | null;
  notesById: Record<string, string>;
  setNotesById: NotesSetter;
  onCreate: (payload: Record<string, unknown>) => void;
  onReview: (item: CircleAdminRow, decision: "approve" | "reject") => void;
}) {
  const [form, setForm] = useState({ name: "", short_description: "", description: "", circle_type: "official", visibility_scope: "country", country_code: "", country_name: "", region: "", city: "", tags: "", rules: "", requires_join_approval: false });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({
      ...form,
      diaspora_tags: csv(form.tags),
      culture_tags: csv(form.tags),
      interest_tags: csv(form.tags),
      audience_tags: csv(form.tags)
    });
  };
  return <section className="mt-6 space-y-5"><Card><CardContent><Badge variant="trust">Circles Admin</Badge><h2 className="mt-3 font-display text-3xl text-foreground">Create official or partner Circle</h2><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}><Field label="Name"><Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} required /></Field><Field label="Type"><SelectField value={form.circle_type} onChange={(circle_type) => setForm((prev) => ({ ...prev, circle_type }))}><option value="official">Official Circle</option><option value="partner">Partner Circle</option><option value="gold_community">Community Circle</option><option value="private">Private Circle</option></SelectField></Field><Field label="Short description"><Input value={form.short_description} onChange={(event) => setForm((prev) => ({ ...prev, short_description: event.target.value }))} /></Field><Field label="Visibility"><SelectField value={form.visibility_scope} onChange={(visibility_scope) => setForm((prev) => ({ ...prev, visibility_scope }))}><option value="local">Near me</option><option value="country">My country</option><option value="diaspora">Diaspora</option><option value="global">Global</option><option value="invite_only">Invite only</option></SelectField></Field><Field label="Country code"><Input value={form.country_code} onChange={(event) => setForm((prev) => ({ ...prev, country_code: event.target.value.toUpperCase() }))} placeholder="GB" /></Field><Field label="City"><Input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} /></Field><Field label="Country name"><Input value={form.country_name} onChange={(event) => setForm((prev) => ({ ...prev, country_name: event.target.value }))} /></Field><Field label="Region"><Input value={form.region} onChange={(event) => setForm((prev) => ({ ...prev, region: event.target.value }))} /></Field><Field label="Tags"><Input value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="Ghana diaspora, serious intent" /></Field><label className="flex items-center gap-3 pt-7 text-sm text-muted-foreground"><input type="checkbox" checked={form.requires_join_approval} onChange={(event) => setForm((prev) => ({ ...prev, requires_join_approval: event.target.checked }))} /> Requires join approval</label><div className="md:col-span-2"><Field label="Description"><Textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} /></Field></div><div className="md:col-span-2"><Field label="Rules"><Textarea value={form.rules} onChange={(event) => setForm((prev) => ({ ...prev, rules: event.target.value }))} /></Field></div><Button disabled={busyId === "circle:create"}>{busyId === "circle:create" ? "Creating..." : "Create Circle"}</Button></form></CardContent></Card>{rows.length === 0 ? <EmptyAdminState title="No Circles loaded" /> : null}{rows.map((item) => <Card key={item.id}><CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap items-center gap-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge><Badge variant="trust">{item.circle_type}</Badge>{item.is_featured ? <Badge variant="signal">Featured</Badge> : null}<span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.created_at)}</span></div><h3 className="mt-4 font-display text-3xl text-foreground">{item.name}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.short_description || item.description || "No description yet."}</p><div className="mt-4 grid gap-3 md:grid-cols-3"><Meta label="Scope" value={item.visibility_scope} /><Meta label="Location" value={[item.city, item.country_code].filter(Boolean).join(", ") || "Global"} /><Meta label="Members" value={String(item.member_count || 0)} /></div>{item.rejected_reason ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(230,212,184,0.25)] p-3 text-sm text-[color:var(--accent-warm)]">{item.rejected_reason}</p> : null}</div><div className="space-y-3"><Textarea value={notesById[item.id] || ""} onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Rejection reason or internal note" /><div className="flex flex-wrap gap-3">{item.status !== "approved" ? <Button disabled={busyId === item.id} onClick={() => onReview(item, "approve")}>Approve</Button> : null}{item.status !== "rejected" ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onReview(item, "reject")}>Reject</Button> : null}</div></div></CardContent></Card>)}</section>;
}

export function GatheringsAdminSection({ rows, circles, busyId, notesById, setNotesById, onCreate, onReview }: {
  rows: GatheringAdminRow[];
  circles: CircleAdminRow[];
  busyId: string | null;
  notesById: Record<string, string>;
  setNotesById: NotesSetter;
  onCreate: (payload: Record<string, unknown>) => void;
  onReview: (item: GatheringAdminRow, decision: "approve" | "reject") => void;
}) {
  const [form, setForm] = useState({ title: "", circle_id: "", description: "", gathering_type: "physical", starts_at: "", ends_at: "", timezone: "Europe/London", country_code: "", city: "", region: "", venue_name: "", venue_address: "", address_visibility: "attendees_only", online_url: "", platform: "", max_attendees: "", tags: "", safety_note: "" });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({ ...form, circle_id: form.circle_id || null, max_attendees: form.max_attendees ? Number(form.max_attendees) : null, tags: csv(form.tags) });
  };
  return <section className="mt-6 space-y-5"><Card><CardContent><Badge variant="trust">Gatherings Admin</Badge><h2 className="mt-3 font-display text-3xl text-foreground">Create approved Gathering</h2><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}><Field label="Title"><Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required /></Field><Field label="Circle"><SelectField value={form.circle_id} onChange={(circle_id) => setForm((prev) => ({ ...prev, circle_id }))}><option value="">No Circle</option>{circles.filter((circle) => circle.status === "approved").map((circle) => <option key={circle.id} value={circle.id}>{circle.name}</option>)}</SelectField></Field><Field label="Type"><SelectField value={form.gathering_type} onChange={(gathering_type) => setForm((prev) => ({ ...prev, gathering_type }))}><option value="physical">Physical</option><option value="online">Online</option><option value="hybrid">Hybrid</option><option value="partner_venue">Partner venue</option><option value="livestream">Livestream</option></SelectField></Field><Field label="Starts at"><Input type="datetime-local" value={form.starts_at} onChange={(event) => setForm((prev) => ({ ...prev, starts_at: event.target.value }))} required /></Field><Field label="Ends at"><Input type="datetime-local" value={form.ends_at} onChange={(event) => setForm((prev) => ({ ...prev, ends_at: event.target.value }))} /></Field><Field label="Timezone"><Input value={form.timezone} onChange={(event) => setForm((prev) => ({ ...prev, timezone: event.target.value }))} /></Field><Field label="Country code"><Input value={form.country_code} onChange={(event) => setForm((prev) => ({ ...prev, country_code: event.target.value.toUpperCase() }))} /></Field><Field label="City"><Input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} /></Field><Field label="Venue"><Input value={form.venue_name} onChange={(event) => setForm((prev) => ({ ...prev, venue_name: event.target.value }))} /></Field><Field label="Address visibility"><SelectField value={form.address_visibility} onChange={(address_visibility) => setForm((prev) => ({ ...prev, address_visibility }))}><option value="hidden">Hidden</option><option value="attendees_only">Attendees only</option><option value="public">Public</option></SelectField></Field><Field label="Online URL"><Input value={form.online_url} onChange={(event) => setForm((prev) => ({ ...prev, online_url: event.target.value }))} /></Field><Field label="Platform"><Input value={form.platform} onChange={(event) => setForm((prev) => ({ ...prev, platform: event.target.value }))} /></Field><Field label="Max attendees"><Input type="number" value={form.max_attendees} onChange={(event) => setForm((prev) => ({ ...prev, max_attendees: event.target.value }))} /></Field><Field label="Tags"><Input value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} /></Field><div className="md:col-span-2"><Field label="Description"><Textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} /></Field></div><div className="md:col-span-2"><Field label="Venue address"><Textarea value={form.venue_address} onChange={(event) => setForm((prev) => ({ ...prev, venue_address: event.target.value }))} /></Field></div><div className="md:col-span-2"><Field label="Safety note"><Textarea value={form.safety_note} onChange={(event) => setForm((prev) => ({ ...prev, safety_note: event.target.value }))} /></Field></div><Button disabled={busyId === "gathering:create"}>{busyId === "gathering:create" ? "Creating..." : "Create Gathering"}</Button></form></CardContent></Card>{rows.map((item) => <Card key={item.id}><CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap items-center gap-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge><Badge variant="trust">{item.gathering_type}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.starts_at)}</span></div><h3 className="mt-4 font-display text-3xl text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{[item.city, item.country_code, item.venue_name].filter(Boolean).join(" - ") || "Location not set"}</p><div className="mt-4 grid gap-3 md:grid-cols-3"><Meta label="Address" value={item.address_visibility} /><Meta label="Attending" value={String(item.attendee_count || 0)} /><Meta label="Circle" value={shortId(item.circle_id)} /></div>{item.rejected_reason ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(230,212,184,0.25)] p-3 text-sm text-[color:var(--accent-warm)]">{item.rejected_reason}</p> : null}</div><div className="space-y-3"><Textarea value={notesById[item.id] || ""} onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Rejection reason or internal note" /><div className="flex flex-wrap gap-3">{item.status !== "approved" ? <Button disabled={busyId === item.id} onClick={() => onReview(item, "approve")}>Approve</Button> : null}{item.status !== "rejected" ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onReview(item, "reject")}>Reject</Button> : null}</div></div></CardContent></Card>)}</section>;
}

export function RelationshipGistAdminSection({ rows, busyId, onCreate, onPublish }: {
  rows: RelationshipGistAdminRow[];
  busyId: string | null;
  onCreate: (payload: Record<string, unknown>) => void;
  onPublish: (item: RelationshipGistAdminRow) => void;
}) {
  const [form, setForm] = useState({ title: "", short_body: "", body: "", perspective: "general", country_code: "", city: "", tags: "", publish: false });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({ ...form, audience_tags: csv(form.tags), culture_tags: csv(form.tags), relationship_intent_tags: csv(form.tags) });
  };
  return <section className="mt-6 space-y-5"><Card><CardContent><Badge variant="trust">Relationship Gist Admin</Badge><h2 className="mt-3 font-display text-3xl text-foreground">Create guidance card</h2><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}><Field label="Title"><Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} required /></Field><Field label="Perspective"><SelectField value={form.perspective} onChange={(perspective) => setForm((prev) => ({ ...prev, perspective }))}><option value="general">General</option><option value="culture">Culture</option><option value="safety">Safety</option><option value="communication">Communication</option><option value="christian">Christian</option><option value="muslim">Muslim</option></SelectField></Field><Field label="Country code"><Input value={form.country_code} onChange={(event) => setForm((prev) => ({ ...prev, country_code: event.target.value.toUpperCase() }))} /></Field><Field label="City"><Input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} /></Field><Field label="Tags"><Input value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} /></Field><label className="flex items-center gap-3 pt-7 text-sm text-muted-foreground"><input type="checkbox" checked={form.publish} onChange={(event) => setForm((prev) => ({ ...prev, publish: event.target.checked }))} /> Publish immediately</label><div className="md:col-span-2"><Field label="Short body"><Textarea value={form.short_body} onChange={(event) => setForm((prev) => ({ ...prev, short_body: event.target.value }))} /></Field></div><div className="md:col-span-2"><Field label="Body"><Textarea value={form.body} onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))} required /></Field></div><Button disabled={busyId === "gist:create"}>{busyId === "gist:create" ? "Creating..." : "Create Gist"}</Button></form></CardContent></Card>{rows.map((item) => <Card key={item.id}><CardContent><div className="flex flex-wrap items-center gap-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge><Badge variant="trust">{item.perspective}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.published_at || item.created_at)}</span></div><h3 className="mt-4 font-display text-3xl text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.short_body || item.body}</p>{item.status !== "published" ? <Button className="mt-4" disabled={busyId === item.id} onClick={() => onPublish(item)}>Publish</Button> : null}</CardContent></Card>)}</section>;
}

export function WarmIntroductionsAdminSection({ rows, circles, busyId, onCreate }: {
  rows: WarmIntroductionAdminRow[];
  circles: CircleAdminRow[];
  busyId: string | null;
  onCreate: (payload: Record<string, unknown>) => void;
}) {
  const [form, setForm] = useState({ circle_id: "", profile_a_id: "", profile_b_id: "", reason: "", shared_context: "" });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onCreate({ ...form, circle_id: form.circle_id || null, shared_context: csv(form.shared_context) });
  };
  return <section className="mt-6 space-y-5"><Card><CardContent><Badge variant="trust">Warm Introductions Admin</Badge><h2 className="mt-3 font-display text-3xl text-foreground">Send curated introduction</h2><form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submit}><Field label="Circle"><SelectField value={form.circle_id} onChange={(circle_id) => setForm((prev) => ({ ...prev, circle_id }))}><option value="">No Circle</option>{circles.filter((circle) => circle.status === "approved").map((circle) => <option key={circle.id} value={circle.id}>{circle.name}</option>)}</SelectField></Field><Field label="Shared context"><Input value={form.shared_context} onChange={(event) => setForm((prev) => ({ ...prev, shared_context: event.target.value }))} placeholder="Shared Circle, serious intent" /></Field><Field label="Profile A ID"><Input value={form.profile_a_id} onChange={(event) => setForm((prev) => ({ ...prev, profile_a_id: event.target.value }))} required /></Field><Field label="Profile B ID"><Input value={form.profile_b_id} onChange={(event) => setForm((prev) => ({ ...prev, profile_b_id: event.target.value }))} required /></Field><div className="md:col-span-2"><Field label="Reason"><Textarea value={form.reason} onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))} required /></Field></div><Button disabled={busyId === "warm:create"}>{busyId === "warm:create" ? "Sending..." : "Send Warm Introduction"}</Button></form></CardContent></Card>{rows.map((item) => <Card key={item.id}><CardContent><div className="flex flex-wrap items-center gap-3"><Badge variant={statusVariant(item.status)}>{item.status}</Badge><Badge variant="trust">{item.initiator_role}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Expires {formatDate(item.expires_at)}</span></div><h3 className="mt-4 font-display text-3xl text-foreground">{shortId(item.profile_a_id)} -&gt; {shortId(item.profile_b_id)}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.reason}</p>{item.shared_context.length ? <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[color:var(--accent-soft)]">{item.shared_context.join(" - ")}</p> : null}</CardContent></Card>)}</section>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/10 p-3"><p className="font-support text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm text-foreground">{value}</p></div>;
}

function EmptyAdminState({ title }: { title: string }) {
  return <Card><CardContent className="text-center"><Badge variant="trust">Clear</Badge><h2 className="mt-4 font-display text-3xl text-foreground">{title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">New Circles 2.0 admin items will appear here.</p></CardContent></Card>;
}
