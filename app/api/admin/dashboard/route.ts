import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/clients";
import type {
  AccountMergeCaseRow,
  AccountRecoveryRequestRow,
  AdminDashboardPayload,
  AdminOverview,
  DatePlanConciergeRow,
  ReportRow,
  VerificationRow
} from "@/lib/admin/types";

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

  const [overviewRes, verificationRes, reportsRes, conciergeRes, recoveryRes, mergeRes] = await Promise.all([
    session.client.rpc("rpc_admin_dashboard_overview"),
    session.client.rpc("rpc_admin_get_verification_queue"),
    session.client.rpc("rpc_admin_get_reports_queue"),
    session.client.rpc("rpc_admin_get_date_plan_concierge_queue"),
    session.client.rpc("rpc_admin_get_account_recovery_requests"),
    session.client.rpc("rpc_admin_get_account_merge_queue")
  ]);

  const firstError = overviewRes.error || verificationRes.error || reportsRes.error;
  if (firstError) {
    return NextResponse.json({ error: firstError.message }, { status: 500 });
  }

  const verifications = ((verificationRes.data || []) as VerificationRow[]).slice(0, 100);
  const reports = ((reportsRes.data || []) as ReportRow[]).slice(0, 100);
  const moduleWarnings: string[] = [];
  const conciergeRequests = conciergeRes.error
    ? (moduleWarnings.push("Date concierge queue is unavailable. Confirm the latest admin migration has been applied."), [])
    : (((conciergeRes.data || []) as DatePlanConciergeRow[]).slice(0, 100));
  const recoveryRequests = recoveryRes.error
    ? (moduleWarnings.push("Account recovery requests are unavailable. Confirm the latest admin migration has been applied."), [])
    : (((recoveryRes.data || []) as AccountRecoveryRequestRow[]).slice(0, 100));
  const mergeCases = mergeRes.error
    ? (moduleWarnings.push("Account merge queue is unavailable. Confirm the latest admin migration has been applied."), [])
    : (((mergeRes.data || []) as AccountMergeCaseRow[]).slice(0, 100));

  const withSignedUrls = await Promise.all(
    verifications.map(async (item) => {
      if (!item.document_url) return { ...item, signed_document_url: null };
      const { data, error } = await session.client.storage.from("verification-docs").createSignedUrl(item.document_url, 60 * 30);
      return { ...item, signed_document_url: error ? null : data?.signedUrl ?? null };
    })
  );

  const reportUserIds = Array.from(
    new Set(reports.flatMap((item) => [item.reporter_user_id, item.reported_user_id]).filter(Boolean))
  );
  const profileByUserId = new Map<string, { id: string; full_name: string | null; verification_level: number | null }>();
  if (reportUserIds.length > 0) {
    const { data } = await createAdminClient()
      .from("profiles")
      .select("id,user_id,full_name,verification_level")
      .in("user_id", reportUserIds);

    for (const row of (data || []) as { id: string; user_id: string; full_name: string | null; verification_level: number | null }[]) {
      profileByUserId.set(row.user_id, row);
    }
  }

  const enrichedReports = reports.map((item) => {
    const reporterProfile = profileByUserId.get(item.reporter_user_id);
    const reportedProfile = profileByUserId.get(item.reported_user_id);
    return {
      ...item,
      reporter_profile_id: reporterProfile?.id ?? null,
      reported_profile_id: reportedProfile?.id ?? null,
      reporter_name: item.reporter_name || reporterProfile?.full_name || null,
      reported_name: item.reported_name || reportedProfile?.full_name || null,
      reporter_verification_level: item.reporter_verification_level ?? reporterProfile?.verification_level ?? null,
      reported_verification_level: item.reported_verification_level ?? reportedProfile?.verification_level ?? null
    };
  });

  const payload: AdminDashboardPayload = {
    overview: ((overviewRes.data || EMPTY_OVERVIEW) as AdminOverview) || EMPTY_OVERVIEW,
    verifications: withSignedUrls,
    reports: enrichedReports,
    conciergeRequests,
    recoveryRequests,
    mergeCases,
    moduleWarnings
  };

  return NextResponse.json(payload);
}
