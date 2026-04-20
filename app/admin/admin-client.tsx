"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const EMPTY_DASHBOARD: AdminDashboardPayload = {
  overview: EMPTY_OVERVIEW,
  verifications: [],
  reports: [],
  conciergeRequests: [],
  recoveryRequests: [],
  mergeCases: [],
  moduleWarnings: []
};

const POLL_INTERVAL_MS = 60_000;
const VIDEO_EXTENSIONS = [".mp4", ".mov", ".m4v", ".webm", ".avi"];

type AdminState = "checking" | "signed_out" | "signed_in" | "forbidden";
type AdminTab = "verification" | "reports" | "concierge" | "recovery_requests" | "merges";
type ReportFilter = "open" | "all";
type ReportSeverity = "urgent" | "high" | "standard";

type AdminUser = { id: string; email: string | null };
type QueueCounts = { pendingVerifications: number; openReports: number; openConcierge: number; openRecovery: number; openMerges: number };
type AdminNotice = { title: string; body: string } | null;

const formatDate = (value?: string | null) => {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
};

const formatTime = (value?: Date | null) => {
  if (!value) return "Not refreshed yet";
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(value);
};

const formatVerificationType = (value?: string | null) => {
  const type = (value || "").toLowerCase();
  const labels: Record<string, string> = {
    selfie_liveness: "Selfie liveness",
    passport: "Passport / visa",
    residence: "Residence proof",
    social: "Social media",
    workplace: "Work / study proof"
  };
  if (labels[type]) return labels[type];
  return String(value || "Verification").replace(/_/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
};

const isOpenReport = (item: ReportRow) => ["PENDING", "REVIEWING"].includes(String(item.status || "PENDING").toUpperCase());
const isOpenConcierge = (item: DatePlanConciergeRow) => ["pending", "claimed"].includes(String(item.request_status || "").toLowerCase());
const isOpenRecovery = (item: AccountRecoveryRequestRow) => ["pending", "reviewing"].includes(String(item.status || "").toLowerCase());
const isOpenMerge = (item: AccountMergeCaseRow) => ["pending", "reviewing", "approved", "scheduled"].includes(String(item.status || "").toLowerCase());
const shortId = (value?: string | null) => (value ? value.slice(0, 8) : "unknown");
const reportIdentityLabel = (role: "reporter" | "member", name?: string | null, profileId?: string | null, userId?: string | null) => {
  const cleanName = name?.trim();
  if (cleanName) return cleanName;
  const idSource = profileId ? "profile" : "user";
  return `Unnamed ${role} - ${idSource} ${shortId(profileId || userId)}`;
};

const getReportSearchText = (item: ReportRow) => `${item.reason || ""} ${item.evidence_message_text || ""} ${item.evidence ? JSON.stringify(item.evidence) : ""}`.toLowerCase();
const getReportSeverity = (item: ReportRow): ReportSeverity => {
  const text = getReportSearchText(item);
  if (/underage|minor|child|threat|violence|blackmail|extortion|self[- ]?harm|suicide/.test(text)) return "urgent";
  if (/harassment|abuse|scam|fake|impersonation|sexual|nudity|money|fraud|coerc/.test(text)) return "high";
  return "standard";
};
const severityScore: Record<ReportSeverity, number> = { urgent: 3, high: 2, standard: 1 };
const severityCopy: Record<ReportSeverity, string> = { urgent: "Urgent safety", high: "High priority", standard: "Standard" };

const statusBadgeVariant = (status?: string | null) => {
  const value = String(status || "").toLowerCase();
  if (["approved", "resolved", "completed"].includes(value)) return "trust" as const;
  if (["rejected", "failed", "closed", "cancelled", "dismissed"].includes(value)) return "warm" as const;
  return "signal" as const;
};

const getVerificationReviewChecklist = (item: Pick<VerificationRow, "verification_type">) => {
  if ((item.verification_type || "").toLowerCase() === "selfie_liveness") {
    return ["Face is clearly visible throughout the clip", "Blink or turn challenge is actually completed", "No obvious replay, screen capture, or spoofing"];
  }
  return ["Document is clear and readable", "Important details are not cropped off", "Submission matches the selected verification method"];
};

const getVerificationRejectReasons = (item: Pick<VerificationRow, "verification_type">) => {
  switch ((item.verification_type || "").toLowerCase()) {
    case "selfie_liveness": return ["Face not clearly visible", "Challenge not completed", "Possible spoof or replay"];
    case "passport":
    case "residence":
    case "workplace": return ["Document is unclear", "Important details are cropped", "Unsupported or invalid document"];
    case "social": return ["Profile evidence is too weak", "Location history is not visible", "Submission does not match the claim"];
    default: return ["Submission is unclear", "Evidence is insufficient", "Please resubmit with stronger proof"];
  }
};

const getSocialVerificationEvidence = (item: Pick<VerificationRow, "verification_type" | "auto_verification_data">) => {
  if ((item.verification_type || "").toLowerCase() !== "social") return null;
  const data = item.auto_verification_data || {};
  const platform = typeof data.social_platform === "string" ? data.social_platform : null;
  const profileUrl = typeof data.social_profile_url === "string" ? data.social_profile_url : null;
  const handle = typeof data.social_handle === "string" ? data.social_handle : null;
  if (!platform && !profileUrl && !handle) return null;
  return { platform, profileUrl, handle };
};

const isVideoVerificationAsset = (item: Pick<VerificationRow, "verification_type" | "document_url">, signedUrl?: string | null) => {
  if ((item.verification_type || "").toLowerCase() === "selfie_liveness") return true;
  const assetPath = `${item.document_url || ""} ${signedUrl || ""}`.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => assetPath.includes(ext));
};

const getQueueCounts = (payload: AdminDashboardPayload): QueueCounts => ({
  pendingVerifications: payload.verifications.filter((item) => String(item.status || "pending").toLowerCase() === "pending").length,
  openReports: payload.reports.filter(isOpenReport).length,
  openConcierge: payload.conciergeRequests.filter(isOpenConcierge).length,
  openRecovery: payload.recoveryRequests.filter(isOpenRecovery).length,
  openMerges: payload.mergeCases.filter(isOpenMerge).length
});

export function AdminClient() {
  const [adminState, setAdminState] = useState<AdminState>("checking");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [signinSent, setSigninSent] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboardPayload>(EMPTY_DASHBOARD);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("verification");
  const [reportFilter, setReportFilter] = useState<ReportFilter>("open");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [adminNotice, setAdminNotice] = useState<AdminNotice>(null);
  const [sessionActivity, setSessionActivity] = useState<string[]>([]);
  const [preflight, setPreflight] = useState<Record<string, unknown> | null>(null);
  const previousCountsRef = useRef<QueueCounts | null>(null);

  const alertsSupported = typeof window !== "undefined" && "Notification" in window;
  const pendingVerifications = useMemo(() => dashboard.verifications.filter((item) => String(item.status || "pending").toLowerCase() === "pending"), [dashboard.verifications]);
  const sortedReports = useMemo(() => [...dashboard.reports].sort((a, b) => {
    const severityDelta = severityScore[getReportSeverity(b)] - severityScore[getReportSeverity(a)];
    if (severityDelta !== 0) return severityDelta;
    const openDelta = Number(isOpenReport(b)) - Number(isOpenReport(a));
    if (openDelta !== 0) return openDelta;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }), [dashboard.reports]);
  const activeReports = useMemo(() => sortedReports.filter(isOpenReport), [sortedReports]);
  const visibleReports = reportFilter === "open" ? activeReports : sortedReports;
  const openConciergeRequests = useMemo(() => dashboard.conciergeRequests.filter(isOpenConcierge), [dashboard.conciergeRequests]);
  const openRecoveryRequests = useMemo(() => dashboard.recoveryRequests.filter(isOpenRecovery), [dashboard.recoveryRequests]);
  const openMergeCases = useMemo(() => dashboard.mergeCases.filter(isOpenMerge), [dashboard.mergeCases]);

  const addSessionActivity = useCallback((message: string) => {
    setSessionActivity((prev) => [`${formatTime(new Date())} - ${message}`, ...prev].slice(0, 6));
  }, []);

  const sendQueueAlert = useCallback((title: string, body: string) => {
    setAdminNotice({ title, body });
    if (alertsEnabled && alertsSupported && Notification.permission === "granted") new Notification(title, { body });
  }, [alertsEnabled, alertsSupported]);

  const loadDashboard = useCallback(async (options?: { silent?: boolean; notify?: boolean }) => {
    if (!options?.silent) setLoadingDashboard(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Unable to load admin dashboard");
      }
      const raw = (await res.json()) as Partial<AdminDashboardPayload>;
      const data: AdminDashboardPayload = {
        ...EMPTY_DASHBOARD,
        ...raw,
        overview: { ...EMPTY_OVERVIEW, ...(raw.overview || {}) },
        verifications: raw.verifications || [],
        reports: raw.reports || [],
        conciergeRequests: raw.conciergeRequests || [],
        recoveryRequests: raw.recoveryRequests || [],
        mergeCases: raw.mergeCases || [],
        moduleWarnings: raw.moduleWarnings || []
      };
      const nextCounts = getQueueCounts(data);
      const previousCounts = previousCountsRef.current;
      setDashboard(data);
      setLastRefreshedAt(new Date());
      if (options?.notify && previousCounts) {
        const deltas = [
          { title: "New safety report", count: nextCounts.openReports - previousCounts.openReports },
          { title: "New verification request", count: nextCounts.pendingVerifications - previousCounts.pendingVerifications },
          { title: "New concierge request", count: nextCounts.openConcierge - previousCounts.openConcierge },
          { title: "New recovery request", count: nextCounts.openRecovery - previousCounts.openRecovery },
          { title: "New merge case", count: nextCounts.openMerges - previousCounts.openMerges }
        ];
        const firstDelta = deltas.find((item) => item.count > 0);
        if (firstDelta) sendQueueAlert(firstDelta.title, `${firstDelta.count} item${firstDelta.count === 1 ? "" : "s"} need review.`);
      }
      previousCountsRef.current = nextCounts;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load admin dashboard");
    } finally {
      if (!options?.silent) setLoadingDashboard(false);
    }
  }, [sendQueueAlert]);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!mounted) return;
        if (res.status === 401) return setAdminState("signed_out");
        if (res.status === 403) return setAdminState("forbidden");
        if (!res.ok) throw new Error("Unable to confirm admin session");
        const data = (await res.json()) as { user: AdminUser };
        setUser(data.user);
        setAdminState("signed_in");
        await loadDashboard({ notify: false });
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to confirm admin session");
        setAdminState("signed_out");
      }
    };
    void checkSession();
    return () => { mounted = false; };
  }, [loadDashboard]);

  useEffect(() => {
    if (adminState !== "signed_in") return;
    const timer = window.setInterval(() => void loadDashboard({ silent: true, notify: true }), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [adminState, loadDashboard]);

  const handleStartSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigninLoading(true);
    setError(null);
    try {
      await fetch("/api/admin/auth/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setSigninSent(true);
    } catch {
      setSigninSent(true);
    } finally {
      setSigninLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setDashboard(EMPTY_DASHBOARD);
    setUser(null);
    setAdminState("signed_out");
  };

  const handleEnableAlerts = async () => {
    if (!alertsSupported) return setAdminNotice({ title: "Alerts unavailable", body: "This browser does not support notification permissions." });
    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    setAlertsEnabled(enabled);
    setAdminNotice(enabled
      ? { title: "Admin alerts enabled", body: "This browser will notify you when new queues need attention." }
      : { title: "Alerts not enabled", body: "Browser notification permission was not granted. In-page alerts will still appear." });
  };

  const postAction = async (url: string, body: Record<string, unknown>, label: string) => {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      throw new Error(payload?.error || `Unable to ${label}`);
    }
  };

  const reviewVerification = async (item: VerificationRow, decision: "approved" | "rejected", noteOverride?: string) => {
    if (!window.confirm(`${decision === "approved" ? "Approve" : "Reject"} ${formatVerificationType(item.verification_type)} for ${item.full_name || "this member"}?`)) return;
    setBusyId(item.id);
    setError(null);
    try {
      await postAction("/api/admin/verification/review", {
        request_id: item.id,
        decision,
        notes: noteOverride || notesById[item.id] || (decision === "approved" ? "Approved by internal review." : "Rejected by internal review. Please resubmit clearer evidence.")
      }, "update verification");
      addSessionActivity(`${decision === "approved" ? "Approved" : "Rejected"} verification for ${item.full_name || item.profile_id}`);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update verification");
    } finally {
      setBusyId(null);
    }
  };

  const updateFreshReview = async (item: VerificationRow, action: "request" | "clear") => {
    if (!item.profile_id) return setError("This verification row is missing a profile id.");
    const currentLevel = Math.max(1, Math.min(2, item.verification_level || 1));
    const reason = `Betweener needs a fresh ${formatVerificationType(item.verification_type).toLowerCase()} check to keep this trust signal current.`;
    setBusyId(item.id);
    setError(null);
    try {
      await postAction("/api/admin/verification/fresh-review", { profile_id: item.profile_id, action, target_level: currentLevel, reason }, "update fresh review");
      addSessionActivity(`${action === "request" ? "Requested" : "Cancelled"} fresh review for ${item.full_name || item.profile_id}`);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update fresh review");
    } finally {
      setBusyId(null);
    }
  };

  const updateStatus = async (url: string, id: string, body: Record<string, unknown>, activity: string) => {
    setBusyId(id);
    setError(null);
    try {
      await postAction(url, body, activity.toLowerCase());
      addSessionActivity(activity);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update queue item");
    } finally {
      setBusyId(null);
    }
  };

  const updateReportStatus = (item: ReportRow, status: "REVIEWING" | "RESOLVED" | "DISMISSED") =>
    updateStatus("/api/admin/reports/status", item.id, { report_id: item.id, status }, `Marked report ${shortId(item.id)} as ${status.toLowerCase()}`);
  const updateConciergeStatus = (item: DatePlanConciergeRow, status: "claimed" | "completed" | "cancelled") =>
    updateStatus("/api/admin/concierge/status", item.request_id, { request_id: item.request_id, status }, `Marked concierge ${shortId(item.request_id)} as ${status}`);
  const updateRecoveryStatus = (item: AccountRecoveryRequestRow, status: "reviewing" | "resolved" | "closed") =>
    updateStatus("/api/admin/recovery/status", item.id, { request_id: item.id, status, review_notes: notesById[item.id] || item.review_notes || null, linked_merge_case_id: item.linked_merge_case_id }, `Marked recovery ${shortId(item.id)} as ${status}`);
  const updateMergeStatus = (item: AccountMergeCaseRow, status: "reviewing" | "approved" | "rejected" | "failed" | "cancelled") => {
    if (["rejected", "failed", "cancelled"].includes(status) && !window.confirm(`Mark this merge case as ${status}?`)) return;
    return updateStatus("/api/admin/merge/status", item.id, { case_id: item.id, status, notes: notesById[item.id] || item.notes || null }, `Marked merge ${shortId(item.id)} as ${status}`);
  };

  const previewMerge = async (item: AccountMergeCaseRow) => {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/merge/preflight", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ case_id: item.id }) });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "Unable to preview merge case");
      }
      const payload = (await res.json()) as { preflight: Record<string, unknown> | null };
      setPreflight(payload.preflight || null);
      addSessionActivity(`Previewed merge ${shortId(item.id)}`);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to preview merge case");
    } finally {
      setBusyId(null);
    }
  };

  if (adminState === "checking") {
    return <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center"><Badge variant="trust">Restricted</Badge><h1 className="mt-4 font-display text-4xl text-foreground">Checking admin access</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">Confirming your Betweener session.</p></main>;
  }

  if (adminState === "signed_out") {
    return (
      <main className="mx-auto flex min-h-[72vh] max-w-2xl flex-col justify-center px-6 py-16">
        <Card><CardContent><Badge variant="warm">Internal Admin</Badge><h1 className="mt-5 font-display text-4xl leading-none text-foreground md:text-5xl">Secure operations sign in</h1><p className="mt-4 text-sm leading-7 text-muted-foreground">Enter an email listed in Betweener&apos;s internal admin registry. If it is authorized, we will send a secure magic link.</p><form className="mt-8 space-y-4" onSubmit={handleStartSignin}><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@getbetweener.com" autoComplete="email" required /><Button className="w-full" disabled={signinLoading}>{signinLoading ? "Sending..." : "Send secure link"}</Button></form>{signinSent ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] p-4 text-sm leading-7 text-[color:var(--accent-soft)]">If that email is authorized, a secure sign-in link has been sent. Open it on this device to continue.</p> : null}</CardContent></Card>
      </main>
    );
  }

  if (adminState === "forbidden") {
    return <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center"><Badge variant="warm">Access denied</Badge><h1 className="mt-4 font-display text-4xl text-foreground">Admin access required</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">This account is signed in but is not listed in public.internal_admins.</p><Button className="mt-6" variant="secondary" onClick={handleLogout}>Sign out</Button></main>;
  }

  const overview = dashboard.overview;
  const recoveryReviewingCount = dashboard.recoveryRequests.filter((item) => (item.status || "").toLowerCase() === "reviewing").length;
  const recoveryResolvedCount = dashboard.recoveryRequests.filter((item) => (item.status || "").toLowerCase() === "resolved").length;
  const mergeReviewingCount = dashboard.mergeCases.filter((item) => (item.status || "").toLowerCase() === "reviewing").length;
  const mergeApprovedCount = dashboard.mergeCases.filter((item) => (item.status || "").toLowerCase() === "approved").length;
  const mergeFailedCount = dashboard.mergeCases.filter((item) => (item.status || "").toLowerCase() === "failed").length;
  const metricCards = [
    { key: "verification" as const, label: "Pending verification", value: overview.pending_verifications, helper: "Open queue" },
    { key: "reports" as const, label: "Open reports", value: overview.open_reports, helper: "Moderation queue" },
    { key: "concierge" as const, label: "Date concierge", value: openConciergeRequests.length, helper: "Planning help queue" },
    { key: "recovery_requests" as const, label: "Recovery requests", value: openRecoveryRequests.length, helper: "User support queue" },
    { key: "merges" as const, label: "Merge cases", value: openMergeCases.length, helper: "Recovery execution" },
    { key: "verification" as const, label: "Members", value: overview.members_total, helper: `${overview.members_last_7d} joined in 7 days` },
    { key: "reports" as const, label: "Unread rejections", value: overview.rejected_unread, helper: "Follow-up needed" }
  ];
  const operationCards = [
    { key: "verification" as const, title: "Verification queue", subtitle: `${pendingVerifications.length} pending`, detail: pendingVerifications.length > 0 ? "Review documents and approve or reject." : "No one is waiting right now." },
    { key: "reports" as const, title: "Moderation queue", subtitle: `${activeReports.length} active`, detail: activeReports.length > 0 ? "Move reports from pending to resolved." : "No active moderation reports." },
    { key: "concierge" as const, title: "Date concierge", subtitle: `${openConciergeRequests.length} open`, detail: openConciergeRequests.length > 0 ? "Check who needs planning help next." : "No open concierge requests." },
    { key: "recovery_requests" as const, title: "Recovery requests", subtitle: `${openRecoveryRequests.length} open`, detail: openRecoveryRequests.length > 0 ? "Triage user-submitted account access issues." : "No open recovery requests." },
    { key: "merges" as const, title: "Merge cases", subtitle: `${openMergeCases.length} open`, detail: openMergeCases.length > 0 ? "Review duplicate-account merge cases." : "No open account recovery cases." }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-soft)] pb-8 md:flex-row md:items-end md:justify-between"><div><Badge variant="trust">Restricted Operations</Badge><h1 className="mt-4 font-display text-5xl leading-none text-foreground md:text-7xl">Admin dashboard</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Review verification submissions, reports, concierge requests, and account recovery queues. Signed in as {user?.email || "admin"}.</p><p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Last refreshed {formatTime(lastRefreshedAt)} - Auto-checking every 60 seconds</p></div><div className="flex flex-wrap gap-3">{alertsSupported ? <Button variant="secondary" onClick={() => void handleEnableAlerts()}>{alertsEnabled ? "Alerts enabled" : "Enable alerts"}</Button> : null}<Button variant="secondary" onClick={() => void loadDashboard({ notify: true })} disabled={loadingDashboard}>{loadingDashboard ? "Refreshing..." : "Refresh"}</Button><Button variant="ghost" onClick={() => void handleLogout()}>Sign out</Button></div></div>
      {adminNotice ? <div className="mt-6 flex flex-col gap-3 rounded-[var(--bet-radius-lg)] border border-[rgba(126,214,209,0.24)] bg-[rgba(17,197,198,0.09)] p-4 text-sm leading-7 text-[color:var(--accent-soft)] sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-foreground">{adminNotice.title}</p><p>{adminNotice.body}</p></div><Button variant="ghost" onClick={() => setAdminNotice(null)}>Dismiss</Button></div> : null}
      {error ? <div className="mt-6 rounded-[var(--bet-radius-md)] border border-red-400/30 bg-red-500/10 p-4 text-sm leading-7 text-red-200">{error}</div> : null}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{metricCards.map((item) => <button key={item.label} type="button" className="text-left" onClick={() => setActiveTab(item.key)}><Card className="h-full transition hover:border-[color:var(--border-strong)]"><CardContent className="p-5"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p><p className="mt-3 font-display text-4xl text-foreground">{item.value}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{item.helper}</p></CardContent></Card></button>)}</section>
      <section className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]"><Card><CardContent><h2 className="font-display text-3xl text-foreground">Operations</h2><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{operationCards.map((card) => <button key={card.key} type="button" className="text-left" onClick={() => setActiveTab(card.key)}><div className={`h-full rounded-[var(--bet-radius-md)] border p-4 transition ${activeTab === card.key ? "border-[rgba(126,214,209,0.42)] bg-[rgba(17,197,198,0.1)]" : "border-[color:var(--border-soft)] bg-black/10"}`}><p className="font-semibold text-foreground">{card.title}</p><p className="mt-2 text-sm text-[color:var(--accent-soft)]">{card.subtitle}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{card.detail}</p></div></button>)}</div></CardContent></Card><Card><CardContent><h2 className="font-display text-3xl text-foreground">Revenue and member health</h2><div className="mt-5 grid grid-cols-2 gap-3"><StatPill label="Silver" value={overview.silver_active} /><StatPill label="Gold" value={overview.gold_active} /><StatPill label="Active subscriptions" value={overview.active_subscriptions} /><StatPill label="New in 7 days" value={overview.members_last_7d} /></div></CardContent></Card></section>
      {dashboard.moduleWarnings.length > 0 ? <Card className="mt-6"><CardContent className="p-5"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Module status</p><div className="mt-3 space-y-2">{dashboard.moduleWarnings.map((warning) => <p key={warning} className="text-sm leading-7 text-[color:var(--accent-warm)]">{warning}</p>)}</div></CardContent></Card> : null}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-3">{[{ key: "verification", label: `Verification (${pendingVerifications.length})` }, { key: "reports", label: `Reports (${activeReports.length})` }, { key: "concierge", label: `Concierge (${openConciergeRequests.length})` }, { key: "recovery_requests", label: `Requests (${openRecoveryRequests.length})` }, { key: "merges", label: `Recovery (${openMergeCases.length})` }].map((tab) => <Button key={tab.key} variant={activeTab === tab.key ? "default" : "secondary"} onClick={() => setActiveTab(tab.key as AdminTab)}>{tab.label}</Button>)}</div>{activeTab === "reports" ? <div className="flex flex-wrap gap-2 rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-black/10 p-1"><Button size="sm" variant={reportFilter === "open" ? "default" : "ghost"} onClick={() => setReportFilter("open")}>Open ({activeReports.length})</Button><Button size="sm" variant={reportFilter === "all" ? "default" : "ghost"} onClick={() => setReportFilter("all")}>All ({sortedReports.length})</Button></div> : null}</div>
      {sessionActivity.length > 0 ? <section className="mt-6 rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-4"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">This session</p><div className="mt-3 flex flex-wrap gap-2">{sessionActivity.map((item) => <span key={item} className="rounded-full border border-[color:var(--border-soft)] px-3 py-1 text-xs text-muted-foreground">{item}</span>)}</div></section> : null}
      {activeTab === "verification" ? <VerificationQueue rows={dashboard.verifications} busyId={busyId} notesById={notesById} setNotesById={setNotesById} onReview={reviewVerification} onFreshReview={updateFreshReview} /> : activeTab === "reports" ? <ReportsQueue rows={visibleReports} filter={reportFilter} busyId={busyId} onStatus={updateReportStatus} /> : activeTab === "concierge" ? <ConciergeQueue rows={dashboard.conciergeRequests} busyId={busyId} onStatus={updateConciergeStatus} /> : activeTab === "recovery_requests" ? <RecoveryQueue rows={dashboard.recoveryRequests} reviewingCount={recoveryReviewingCount} resolvedCount={recoveryResolvedCount} busyId={busyId} notesById={notesById} setNotesById={setNotesById} onStatus={updateRecoveryStatus} /> : <MergeQueue rows={dashboard.mergeCases} reviewingCount={mergeReviewingCount} approvedCount={mergeApprovedCount} failedCount={mergeFailedCount} busyId={busyId} notesById={notesById} setNotesById={setNotesById} onStatus={updateMergeStatus} onPreflight={previewMerge} />}
      {preflight ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><Card className="max-h-[86vh] w-full max-w-3xl overflow-hidden"><CardContent><div className="flex items-start justify-between gap-4"><div><Badge variant="trust">Merge preflight</Badge><h2 className="mt-3 font-display text-3xl text-foreground">Reference preview</h2></div><Button variant="ghost" onClick={() => setPreflight(null)}>Close</Button></div><pre className="mt-5 max-h-[58vh] overflow-auto rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/25 p-4 text-xs leading-6 text-muted-foreground">{JSON.stringify(preflight, null, 2)}</pre></CardContent></Card></div> : null}
    </main>
  );
}

function VerificationQueue({ rows, busyId, notesById, setNotesById, onReview, onFreshReview }: { rows: VerificationRow[]; busyId: string | null; notesById: Record<string, string>; setNotesById: React.Dispatch<React.SetStateAction<Record<string, string>>>; onReview: (item: VerificationRow, decision: "approved" | "rejected", noteOverride?: string) => void; onFreshReview: (item: VerificationRow, action: "request" | "clear") => void }) {
  return <section className="mt-6 space-y-4">{rows.length === 0 ? <EmptyState title="No verification requests" body="New submissions will appear here." /> : null}{rows.map((item) => {
    const documentUrl = item.signed_document_url || null;
    const isPending = String(item.status || "").toLowerCase() === "pending";
    const isApproved = String(item.status || "").toLowerCase() === "approved";
    const socialEvidence = getSocialVerificationEvidence(item);
    return <Card key={item.id}><CardContent className="grid gap-5 lg:grid-cols-[1fr_340px]"><div><div className="flex flex-wrap items-center gap-3"><Badge variant="trust">{formatVerificationType(item.verification_type)}</Badge><Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Submitted {formatDate(item.submitted_at)}</span></div><h2 className="mt-4 font-display text-3xl text-foreground">{item.full_name || "Unknown member"}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{item.current_country || "Country unknown"} - Level {item.verification_level ?? 0} - Auto score {typeof item.auto_verification_score === "number" ? `${Math.round(item.auto_verification_score * 100)}%` : "N/A"}</p>{item.reviewer_notes ? <p className="mt-3 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] p-3 text-sm text-muted-foreground">{item.reviewer_notes}</p> : null}{item.verification_refresh_required ? <div className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(230,212,184,0.25)] bg-[rgba(230,212,184,0.08)] p-4"><p className="font-semibold text-[color:var(--accent-warm)]">Fresh review requested</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Target level: {item.verification_refresh_target_level || item.verification_level || 1}</p>{item.verification_refresh_reason ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.verification_refresh_reason}</p> : null}</div> : null}{socialEvidence ? <div className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] p-4"><p className="font-semibold text-[color:var(--accent-soft)]">Linked social proof</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Platform: {socialEvidence.platform || "Not specified"}</p>{socialEvidence.handle ? <p className="text-sm leading-6 text-muted-foreground">Handle: @{socialEvidence.handle}</p> : null}{socialEvidence.profileUrl ? <a className="mt-2 block truncate text-sm font-semibold text-[color:var(--accent-primary)] underline underline-offset-4" href={socialEvidence.profileUrl} target="_blank" rel="noreferrer">{socialEvidence.profileUrl}</a> : null}</div> : null}<div className="mt-4 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/10 p-4"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Reviewer checklist</p><div className="mt-3 space-y-2">{getVerificationReviewChecklist(item).map((point) => <p key={`${item.id}:${point}`} className="text-sm leading-6 text-muted-foreground">- {point}</p>)}</div></div>{item.auto_verification_data ? <details className="mt-4 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/10 p-4"><summary className="cursor-pointer text-sm font-semibold text-foreground">Auto verification data</summary><pre className="mt-3 max-h-48 overflow-auto text-xs leading-5 text-muted-foreground">{JSON.stringify(item.auto_verification_data, null, 2)}</pre></details> : null}</div><div className="space-y-4"><VerificationAssetPreview uri={documentUrl} isVideo={isVideoVerificationAsset(item, documentUrl)} /><Textarea value={notesById[item.id] || ""} onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Reviewer notes, rejection reason, or approval context" />{isPending ? <><div className="flex flex-wrap gap-2">{getVerificationRejectReasons(item).map((reason) => <Button key={`${item.id}:${reason}`} size="sm" variant="secondary" disabled={busyId === item.id} onClick={() => onReview(item, "rejected", reason)}>{reason}</Button>)}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><Button disabled={busyId === item.id} onClick={() => onReview(item, "approved")}>Approve</Button><Button disabled={busyId === item.id} variant="secondary" onClick={() => onReview(item, "rejected")}>Reject</Button></div></> : null}{isApproved && item.profile_id ? item.verification_refresh_required ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onFreshReview(item, "clear")}>Cancel fresh review</Button> : <Button disabled={busyId === item.id} variant="secondary" onClick={() => onFreshReview(item, "request")}>Ask fresh review</Button> : null}</div></CardContent></Card>;
  })}</section>;
}

function ReportsQueue({ rows, filter, busyId, onStatus }: { rows: ReportRow[]; filter: ReportFilter; busyId: string | null; onStatus: (item: ReportRow, status: "REVIEWING" | "RESOLVED" | "DISMISSED") => void }) {
  return <section className="mt-6 space-y-4">{rows.length === 0 ? <EmptyState title={filter === "open" ? "No active reports" : "No reports loaded"} body={filter === "open" ? "Switch to All to inspect resolved or dismissed reports." : "New safety reports will appear here."} /> : null}{rows.map((item) => { const severity = getReportSeverity(item); const hasMissingName = !item.reporter_name || !item.reported_name; return <Card key={item.id}><CardContent><div className="flex flex-wrap items-center gap-3"><Badge variant={severity === "standard" ? "trust" : "warm"}>{severityCopy[severity]}</Badge><Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge>{hasMissingName ? <Badge variant="warm">Name missing</Badge> : null}<span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.created_at)}</span></div><h2 className="mt-4 font-display text-3xl text-foreground">{reportIdentityLabel("reporter", item.reporter_name, item.reporter_profile_id, item.reporter_user_id)} -&gt; {reportIdentityLabel("member", item.reported_name, item.reported_profile_id, item.reported_user_id)}</h2>{hasMissingName ? <p className="mt-2 text-sm leading-6 text-[color:var(--accent-warm)]">One or both profile names are missing. Use the profile and user IDs below for moderation.</p> : null}<p className="mt-3 text-sm leading-7 text-foreground">{item.reason}</p><div className="mt-4 grid gap-3 md:grid-cols-2"><MetaLine label="Reporter verified" value={item.reporter_verification_level ? "Yes" : "No"} /><MetaLine label="Reported verified" value={item.reported_verification_level ? "Yes" : "No"} /><MetaLine label="Reporter profile" value={shortId(item.reporter_profile_id)} /><MetaLine label="Reported profile" value={shortId(item.reported_profile_id)} /><MetaLine label="Reporter user" value={shortId(item.reporter_user_id)} /><MetaLine label="Reported user" value={shortId(item.reported_user_id)} /></div>{item.evidence_message_id ? <div className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] p-4"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent-soft)]">Attached message evidence - {item.evidence_message_type || "message"}</p><p className="mt-2 text-sm leading-7 text-foreground">{item.evidence_message_text || "No text snapshot was available for this message."}</p><p className="mt-2 text-xs text-muted-foreground">Message time: {formatDate(item.evidence_message_created_at)}</p></div> : null}<div className="mt-5 flex flex-wrap gap-3"><Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "REVIEWING")}>Mark reviewing</Button><Button disabled={busyId === item.id} onClick={() => onStatus(item, "RESOLVED")}>Resolve</Button><Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "DISMISSED")}>Dismiss</Button></div></CardContent></Card>; })}</section>;
}

function ConciergeQueue({ rows, busyId, onStatus }: { rows: DatePlanConciergeRow[]; busyId: string | null; onStatus: (item: DatePlanConciergeRow, status: "claimed" | "completed" | "cancelled") => void }) {
  return <section className="mt-6 space-y-4">{rows.length === 0 ? <EmptyState title="No date concierge requests" body="Date-planning help requests will appear here." /> : null}{rows.map((item) => <Card key={item.request_id}><CardContent><div className="flex flex-wrap items-center gap-3"><Badge variant={statusBadgeVariant(item.request_status)}>{item.request_status}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Requested {formatDate(item.requested_at)}</span></div><h2 className="mt-4 font-display text-3xl text-foreground">{item.creator_name || "Unknown"} and {item.recipient_name || "Unknown"}</h2><p className="mt-3 text-sm leading-7 text-foreground">{item.place_name || "Date plan"}{item.city ? `, ${item.city}` : ""} - {formatDate(item.scheduled_for)}</p>{item.place_address ? <p className="mt-2 text-sm text-muted-foreground">{item.place_address}</p> : null}{item.request_note ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] p-3 text-sm text-muted-foreground">{item.request_note}</p> : null}<div className="mt-4 grid gap-3 md:grid-cols-2"><MetaLine label="Requested by" value={item.requested_by_name || "participant"} /><MetaLine label="Plan status" value={item.date_plan_status} /></div><div className="mt-5 flex flex-wrap gap-3">{(item.request_status || "").toLowerCase() === "pending" ? <Button disabled={busyId === item.request_id} variant="secondary" onClick={() => onStatus(item, "claimed")}>Claim</Button> : null}{isOpenConcierge(item) ? <Button disabled={busyId === item.request_id} onClick={() => onStatus(item, "completed")}>Complete</Button> : null}{isOpenConcierge(item) ? <Button disabled={busyId === item.request_id} variant="secondary" onClick={() => onStatus(item, "cancelled")}>Cancel</Button> : null}</div></CardContent></Card>)}</section>;
}

function RecoveryQueue({ rows, reviewingCount, resolvedCount, busyId, notesById, setNotesById, onStatus }: { rows: AccountRecoveryRequestRow[]; reviewingCount: number; resolvedCount: number; busyId: string | null; notesById: Record<string, string>; setNotesById: React.Dispatch<React.SetStateAction<Record<string, string>>>; onStatus: (item: AccountRecoveryRequestRow, status: "reviewing" | "resolved" | "closed") => void }) {
  return <section className="mt-6 space-y-4"><div className="grid gap-3 md:grid-cols-2"><StatPill label="Reviewing" value={reviewingCount} /><StatPill label="Resolved" value={resolvedCount} /></div>{rows.length === 0 ? <EmptyState title="No recovery requests" body="User-filed recovery requests will appear here." /> : null}{rows.map((item) => <Card key={item.id}><CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap items-center gap-3"><Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.created_at)}</span></div><h2 className="mt-4 font-display text-3xl text-foreground">{item.requester_name || item.contact_email || "Unknown member"}</h2><p className="mt-3 text-sm leading-7 text-foreground">{(item.current_sign_in_method || "unknown").toUpperCase()} -&gt; {(item.previous_sign_in_method || "unknown").toUpperCase()}</p>{item.note ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] p-3 text-sm text-muted-foreground">{item.note}</p> : null}<div className="mt-4 grid gap-3 md:grid-cols-2"><MetaLine label="Contact" value={item.contact_email || "Not provided"} /><MetaLine label="Previous email" value={item.previous_account_email || "Unknown"} /><MetaLine label="Requester user" value={shortId(item.requester_user_id)} /><MetaLine label="Linked merge" value={shortId(item.linked_merge_case_id)} /></div></div><div className="space-y-3"><Textarea value={notesById[item.id] ?? item.review_notes ?? ""} onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Internal recovery review notes" /><div className="flex flex-wrap gap-3">{(item.status || "").toLowerCase() === "pending" ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "reviewing")}>Review</Button> : null}{isOpenRecovery(item) ? <Button disabled={busyId === item.id} onClick={() => onStatus(item, "resolved")}>Resolve</Button> : null}{["pending", "reviewing", "resolved"].includes((item.status || "").toLowerCase()) ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "closed")}>Close</Button> : null}</div></div></CardContent></Card>)}</section>;
}

function MergeQueue({ rows, reviewingCount, approvedCount, failedCount, busyId, notesById, setNotesById, onStatus, onPreflight }: { rows: AccountMergeCaseRow[]; reviewingCount: number; approvedCount: number; failedCount: number; busyId: string | null; notesById: Record<string, string>; setNotesById: React.Dispatch<React.SetStateAction<Record<string, string>>>; onStatus: (item: AccountMergeCaseRow, status: "reviewing" | "approved" | "rejected" | "failed" | "cancelled") => void; onPreflight: (item: AccountMergeCaseRow) => void }) {
  return <section className="mt-6 space-y-4"><div className="grid gap-3 md:grid-cols-3"><StatPill label="Reviewing" value={reviewingCount} /><StatPill label="Approved" value={approvedCount} /><StatPill label="Failed" value={failedCount} /></div>{rows.length === 0 ? <EmptyState title="No merge cases" body="Duplicate-account recovery cases will appear here." /> : null}{rows.map((item) => <Card key={item.id}><CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]"><div><div className="flex flex-wrap items-center gap-3"><Badge variant={statusBadgeVariant(item.status)}>{item.status}</Badge><span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.created_at)}</span></div><h2 className="mt-4 font-display text-3xl text-foreground">{item.source_name || "Unknown source"} -&gt; {item.target_name || "Unknown target"}</h2>{item.candidate_reason ? <p className="mt-3 text-sm leading-7 text-foreground">{item.candidate_reason}</p> : null}{item.notes ? <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] p-3 text-sm text-muted-foreground">{item.notes}</p> : null}<div className="mt-4 grid gap-3 md:grid-cols-2"><MetaLine label="Source user" value={shortId(item.source_user_id)} /><MetaLine label="Target user" value={shortId(item.target_user_id)} /><MetaLine label="Channel" value={item.request_channel || "support"} /><MetaLine label="Executed" value={item.executed_at ? formatDate(item.executed_at) : "No"} /></div>{item.execution_summary && String((item.execution_summary as { error_message?: unknown }).error_message || "") ? <div className="mt-4 rounded-[var(--bet-radius-md)] border border-red-400/30 bg-red-500/10 p-4"><p className="font-semibold text-red-200">Last execution failed</p><p className="mt-2 text-sm leading-6 text-red-100">{String((item.execution_summary as { error_message?: unknown }).error_message)}</p></div> : null}</div><div className="space-y-3"><Textarea value={notesById[item.id] ?? item.notes ?? ""} onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Internal merge notes" /><div className="flex flex-wrap gap-3">{isOpenMerge(item) ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onPreflight(item)}>Preflight</Button> : null}{(item.status || "").toLowerCase() === "pending" ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "reviewing")}>Review</Button> : null}{["pending", "reviewing"].includes((item.status || "").toLowerCase()) ? <Button disabled={busyId === item.id} onClick={() => onStatus(item, "approved")}>Approve</Button> : null}{["pending", "reviewing"].includes((item.status || "").toLowerCase()) ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "rejected")}>Reject</Button> : null}{isOpenMerge(item) ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "failed")}>Fail</Button> : null}{isOpenMerge(item) ? <Button disabled={busyId === item.id} variant="secondary" onClick={() => onStatus(item, "cancelled")}>Cancel case</Button> : null}</div><p className="text-xs leading-6 text-muted-foreground">Merge execution is intentionally not exposed on this card yet. Use preflight first, then execute from the dedicated internal flow.</p></div></CardContent></Card>)}</section>;
}

function VerificationAssetPreview({ uri, isVideo }: { uri?: string | null; isVideo: boolean }) {
  if (!uri) return <div className="flex min-h-48 items-center justify-center rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/20 p-4 text-center text-sm text-muted-foreground">No signed evidence preview available.</div>;
  if (isVideo) return <video className="max-h-[420px] w-full rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black object-contain" src={uri} controls playsInline />;
  return (
    <a href={uri} target="_blank" rel="noreferrer" className="block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={uri} alt="Verification evidence" className="max-h-[420px] w-full rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black object-contain" />
    </a>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return <div className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/10 p-4"><p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl text-foreground">{value}</p></div>;
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/10 p-3"><p className="font-support text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p><p className="mt-1 break-words text-sm text-foreground">{value}</p></div>;
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return <Card><CardContent className="text-center"><Badge variant="trust">Clear</Badge><h2 className="mt-4 font-display text-3xl text-foreground">{title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p></CardContent></Card>;
}
