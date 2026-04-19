import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import type { AdminDashboardPayload, AdminOverview, ReportRow, VerificationRow } from "@/lib/admin/types";

const EMPTY_OVERVIEW: AdminOverview = {
  pending_verifications: 0,
  rejected_unread: 0,
  open_reports: 0,
  active_subscriptions: 0,
  silver_active: 0,
  gold_active: 0,
  members_total: 0,
  members_last_7d: 0
};

export async function GET() {
  const session = await getAdminSession();
  if (!session.ok) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const [overviewRes, verificationRes, reportsRes] = await Promise.all([
    session.client.rpc("rpc_admin_dashboard_overview"),
    session.client.rpc("rpc_admin_get_verification_queue"),
    session.client.rpc("rpc_admin_get_reports_queue")
  ]);

  const firstError = overviewRes.error || verificationRes.error || reportsRes.error;
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 });
  }

  const verifications = ((verificationRes.data || []) as VerificationRow[]).slice(0, 100);
  const reports = ((reportsRes.data || []) as ReportRow[]).slice(0, 100);

  const withSignedUrls = await Promise.all(
    verifications.map(async (item) => {
      if (!item.document_url) return { ...item, signed_document_url: null };
      const { data, error } = await session.client.storage.from("verification-docs").createSignedUrl(item.document_url, 60 * 30);
      return { ...item, signed_document_url: error ? null : data?.signedUrl ?? null };
    })
  );

  const payload: AdminDashboardPayload = {
    overview: ((overviewRes.data || EMPTY_OVERVIEW) as AdminOverview) || EMPTY_OVERVIEW,
    verifications: withSignedUrls,
    reports
  };

  return NextResponse.json(payload);
}
