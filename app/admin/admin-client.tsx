"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const REPORT_POLL_INTERVAL_MS = 60_000;

type AdminState = "checking" | "signed_out" | "signed_in" | "forbidden";
type ReportFilter = "open" | "all";
type ReportSeverity = "urgent" | "high" | "standard";

type AdminUser = {
  id: string;
  email: string | null;
};

type QueueCounts = {
  pendingVerifications: number;
  openReports: number;
};

type AdminNotice = {
  title: string;
  body: string;
} | null;

const formatDate = (value?: string | null) => {
  if (!value) return "Not recorded";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const formatTime = (value?: Date | null) => {
  if (!value) return "Not refreshed yet";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(value);
};

const formatVerificationType = (value?: string | null) =>
  String(value || "verification")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const isOpenReport = (item: ReportRow) =>
  ["PENDING", "REVIEWING"].includes(String(item.status || "PENDING").toUpperCase());

const getReportSearchText = (item: ReportRow) => {
  const evidence = item.evidence ? JSON.stringify(item.evidence) : "";
  return `${item.reason || ""} ${item.evidence_message_text || ""} ${evidence}`.toLowerCase();
};

const getReportSeverity = (item: ReportRow): ReportSeverity => {
  const text = getReportSearchText(item);
  if (/underage|minor|child|threat|violence|blackmail|extortion|self[- ]?harm|suicide/.test(text)) {
    return "urgent";
  }
  if (/harassment|abuse|scam|fake|impersonation|sexual|nudity|money|fraud|coerc/.test(text)) {
    return "high";
  }
  return "standard";
};

const severityScore: Record<ReportSeverity, number> = {
  urgent: 3,
  high: 2,
  standard: 1
};

const severityCopy: Record<ReportSeverity, string> = {
  urgent: "Urgent safety",
  high: "High priority",
  standard: "Standard"
};

const metricCards = (overview: AdminOverview, allReportsCount: number) => [
  { label: "Pending verification", value: overview.pending_verifications, helper: "Identity review queue" },
  { label: "Open reports", value: overview.open_reports, helper: `${allReportsCount} total reports loaded` },
  { label: "Active members", value: overview.members_total, helper: `${overview.members_last_7d} joined in 7 days` },
  {
    label: "Premium active",
    value: overview.active_subscriptions,
    helper: `${overview.gold_active} Gold / ${overview.silver_active} Silver`
  }
];

const getQueueCounts = (payload: AdminDashboardPayload): QueueCounts => ({
  pendingVerifications: payload.verifications.filter((item) => String(item.status || "pending").toLowerCase() === "pending").length,
  openReports: payload.reports.filter(isOpenReport).length
});

export function AdminClient() {
  const [adminState, setAdminState] = useState<AdminState>("checking");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState("");
  const [signinSent, setSigninSent] = useState(false);
  const [signinLoading, setSigninLoading] = useState(false);
  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"verification" | "reports">("verification");
  const [reportFilter, setReportFilter] = useState<ReportFilter>("open");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [adminNotice, setAdminNotice] = useState<AdminNotice>(null);
  const [sessionActivity, setSessionActivity] = useState<string[]>([]);
  const previousCountsRef = useRef<QueueCounts | null>(null);

  const alertsSupported = typeof window !== "undefined" && "Notification" in window;

  const pendingVerifications = useMemo(
    () => (dashboard?.verifications || []).filter((item) => String(item.status || "pending").toLowerCase() === "pending"),
    [dashboard]
  );

  const sortedReports = useMemo(() => {
    return [...(dashboard?.reports || [])].sort((a, b) => {
      const severityDelta = severityScore[getReportSeverity(b)] - severityScore[getReportSeverity(a)];
      if (severityDelta !== 0) return severityDelta;
      const openDelta = Number(isOpenReport(b)) - Number(isOpenReport(a));
      if (openDelta !== 0) return openDelta;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [dashboard]);

  const activeReports = useMemo(() => sortedReports.filter(isOpenReport), [sortedReports]);
  const visibleReports = reportFilter === "open" ? activeReports : sortedReports;

  const addSessionActivity = useCallback((message: string) => {
    setSessionActivity((prev) => [`${formatTime(new Date())} - ${message}`, ...prev].slice(0, 5));
  }, []);

  const sendQueueAlert = useCallback(
    (title: string, body: string) => {
      setAdminNotice({ title, body });
      if (alertsEnabled && alertsSupported && Notification.permission === "granted") {
        new Notification(title, { body });
      }
    },
    [alertsEnabled, alertsSupported]
  );

  const loadDashboard = useCallback(
    async (options?: { silent?: boolean; notify?: boolean }) => {
      if (!options?.silent) setLoadingDashboard(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || "Unable to load admin dashboard");
        }
        const data = (await res.json()) as AdminDashboardPayload;
        const nextCounts = getQueueCounts(data);
        const previousCounts = previousCountsRef.current;

        setDashboard(data);
        setLastRefreshedAt(new Date());

        if (options?.notify && previousCounts) {
          const newReports = nextCounts.openReports - previousCounts.openReports;
          const newVerifications = nextCounts.pendingVerifications - previousCounts.pendingVerifications;
          if (newReports > 0) {
            sendQueueAlert("New safety report", `${newReports} new report${newReports === 1 ? "" : "s"} need review.`);
          } else if (newVerifications > 0) {
            sendQueueAlert(
              "New verification request",
              `${newVerifications} new verification request${newVerifications === 1 ? "" : "s"} need review.`
            );
          }
        }

        previousCountsRef.current = nextCounts;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin dashboard");
      } finally {
        if (!options?.silent) setLoadingDashboard(false);
      }
    },
    [sendQueueAlert]
  );

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!mounted) return;
        if (res.status === 401) {
          setAdminState("signed_out");
          return;
        }
        if (res.status === 403) {
          setAdminState("forbidden");
          return;
        }
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
    return () => {
      mounted = false;
    };
  }, [loadDashboard]);

  useEffect(() => {
    if (adminState !== "signed_in") return;
    const timer = window.setInterval(() => {
      void loadDashboard({ silent: true, notify: true });
    }, REPORT_POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [adminState, loadDashboard]);

  const handleStartSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigninLoading(true);
    setError(null);
    try {
      await fetch("/api/admin/auth/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      setSigninSent(true);
    } catch {
      setSigninSent(true);
    } finally {
      setSigninLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setDashboard(null);
    setUser(null);
    setAdminState("signed_out");
  };

  const handleEnableAlerts = async () => {
    if (!alertsSupported) {
      setAdminNotice({ title: "Alerts unavailable", body: "This browser does not support notification permissions." });
      return;
    }
    const permission = await Notification.requestPermission();
    const enabled = permission === "granted";
    setAlertsEnabled(enabled);
    setAdminNotice(
      enabled
        ? { title: "Admin alerts enabled", body: "This browser will notify you when new reports or verification requests arrive." }
        : { title: "Alerts not enabled", body: "Browser notification permission was not granted. In-page alerts will still appear." }
    );
  };

  const reviewVerification = async (item: VerificationRow, decision: "approved" | "rejected") => {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/verification/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: item.id,
          decision,
          notes: notesById[item.id] || null
        })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Unable to update verification");
      }
      addSessionActivity(`${decision === "approved" ? "Approved" : "Rejected"} verification for ${item.full_name || item.profile_id}`);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update verification");
    } finally {
      setBusyId(null);
    }
  };

  const updateReportStatus = async (item: ReportRow, status: "REVIEWING" | "RESOLVED" | "DISMISSED") => {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/reports/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: item.id, status })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Unable to update report");
      }
      addSessionActivity(`Marked report ${item.id.slice(0, 8)} as ${status.toLowerCase()}`);
      await loadDashboard({ notify: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update report");
    } finally {
      setBusyId(null);
    }
  };

  if (adminState === "checking") {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Badge variant="trust">Restricted</Badge>
        <h1 className="mt-4 font-display text-4xl text-foreground">Checking admin access</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">Confirming your Betweener session.</p>
      </main>
    );
  }

  if (adminState === "signed_out") {
    return (
      <main className="mx-auto flex min-h-[72vh] max-w-2xl flex-col justify-center px-6 py-16">
        <Card>
          <CardContent>
            <Badge variant="warm">Internal Admin</Badge>
            <h1 className="mt-5 font-display text-4xl leading-none text-foreground md:text-5xl">Secure operations sign in</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Enter an email listed in Betweener&apos;s internal admin registry. If it is authorized, we will send a secure magic link.
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleStartSignin}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@getbetweener.com"
                autoComplete="email"
                required
              />
              <Button className="w-full" disabled={signinLoading}>
                {signinLoading ? "Sending..." : "Send secure link"}
              </Button>
            </form>
            {signinSent ? (
              <p className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] p-4 text-sm leading-7 text-[color:var(--accent-soft)]">
                If that email is authorized, a secure sign-in link has been sent. Open it on this device to continue.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (adminState === "forbidden") {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Badge variant="warm">Access denied</Badge>
        <h1 className="mt-4 font-display text-4xl text-foreground">Admin access required</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          This account is signed in but is not listed in public.internal_admins.
        </p>
        <Button className="mt-6" variant="secondary" onClick={handleLogout}>Sign out</Button>
      </main>
    );
  }

  const overview = dashboard?.overview || EMPTY_OVERVIEW;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-[color:var(--border-soft)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge variant="trust">Restricted Operations</Badge>
          <h1 className="mt-4 font-display text-5xl leading-none text-foreground md:text-7xl">Admin dashboard</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
            Review verification submissions and moderation reports. Signed in as {user?.email || "admin"}.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Last refreshed {formatTime(lastRefreshedAt)} · Auto-checking every 60 seconds
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {alertsSupported ? (
            <Button variant="secondary" onClick={() => void handleEnableAlerts()}>
              {alertsEnabled ? "Alerts enabled" : "Enable alerts"}
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => void loadDashboard({ notify: true })} disabled={loadingDashboard}>
            {loadingDashboard ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="ghost" onClick={() => void handleLogout()}>Sign out</Button>
        </div>
      </div>

      {adminNotice ? (
        <div className="mt-6 flex flex-col gap-3 rounded-[var(--bet-radius-lg)] border border-[rgba(126,214,209,0.24)] bg-[rgba(17,197,198,0.09)] p-4 text-sm leading-7 text-[color:var(--accent-soft)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-foreground">{adminNotice.title}</p>
            <p>{adminNotice.body}</p>
          </div>
          <Button variant="ghost" onClick={() => setAdminNotice(null)}>Dismiss</Button>
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-[var(--bet-radius-md)] border border-red-400/30 bg-red-500/10 p-4 text-sm leading-7 text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {metricCards(overview, dashboard?.reports.length || 0).map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
              <p className="mt-3 font-display text-4xl text-foreground">{item.value}</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{item.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Button variant={activeTab === "verification" ? "default" : "secondary"} onClick={() => setActiveTab("verification")}>
            Verification ({pendingVerifications.length})
          </Button>
          <Button variant={activeTab === "reports" ? "default" : "secondary"} onClick={() => setActiveTab("reports")}>
            Reports ({activeReports.length})
          </Button>
        </div>
        {activeTab === "reports" ? (
          <div className="flex flex-wrap gap-2 rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-black/10 p-1">
            <Button size="sm" variant={reportFilter === "open" ? "default" : "ghost"} onClick={() => setReportFilter("open")}>
              Open ({activeReports.length})
            </Button>
            <Button size="sm" variant={reportFilter === "all" ? "default" : "ghost"} onClick={() => setReportFilter("all")}>
              All ({sortedReports.length})
            </Button>
          </div>
        ) : null}
      </div>

      {sessionActivity.length > 0 ? (
        <section className="mt-6 rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-4">
          <p className="font-support text-[11px] uppercase tracking-[0.16em] text-muted-foreground">This session</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sessionActivity.map((item) => (
              <span key={item} className="rounded-full border border-[color:var(--border-soft)] px-3 py-1 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {activeTab === "verification" ? (
        <section className="mt-6 space-y-4">
          {pendingVerifications.length === 0 ? <EmptyState title="No pending verification" body="New submissions will appear here." /> : null}
          {pendingVerifications.map((item) => (
            <Card key={item.id}>
              <CardContent className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="trust">{formatVerificationType(item.verification_type)}</Badge>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.status}</span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl text-foreground">{item.full_name || "Unknown member"}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.current_country || "Country unknown"} · Level {item.verification_level ?? 0} · Submitted {formatDate(item.submitted_at)}
                  </p>
                  {item.verification_refresh_required ? (
                    <p className="mt-3 rounded-[var(--bet-radius-md)] border border-[rgba(230,212,184,0.25)] bg-[rgba(230,212,184,0.08)] p-3 text-sm leading-6 text-[color:var(--accent-warm)]">
                      Fresh review requested: {item.verification_refresh_reason || "No reason provided"}
                    </p>
                  ) : null}
                  {item.signed_document_url ? (
                    <a
                      className="mt-4 inline-flex text-sm font-semibold text-[color:var(--accent-primary)] underline underline-offset-4"
                      href={item.signed_document_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open submitted evidence
                    </a>
                  ) : item.document_url ? (
                    <p className="mt-4 text-sm text-muted-foreground">Evidence path exists, but no signed URL was available.</p>
                  ) : null}
                  {item.auto_verification_data ? (
                    <pre className="mt-4 max-h-48 overflow-auto rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-black/20 p-3 text-xs leading-5 text-muted-foreground">
                      {JSON.stringify(item.auto_verification_data, null, 2)}
                    </pre>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <Textarea
                    value={notesById[item.id] || ""}
                    onChange={(event) => setNotesById((prev) => ({ ...prev, [item.id]: event.target.value }))}
                    placeholder="Reviewer notes, rejection reason, or approval context"
                  />
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <Button disabled={busyId === item.id} onClick={() => void reviewVerification(item, "approved")}>Approve</Button>
                    <Button disabled={busyId === item.id} variant="secondary" onClick={() => void reviewVerification(item, "rejected")}>Reject</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <section className="mt-6 space-y-4">
          {visibleReports.length === 0 ? (
            <EmptyState
              title={reportFilter === "open" ? "No active reports" : "No reports loaded"}
              body={reportFilter === "open" ? "Switch to All to inspect resolved or dismissed reports." : "New safety reports will appear here."}
            />
          ) : null}
          {visibleReports.map((item) => {
            const severity = getReportSeverity(item);
            return (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant={severity === "standard" ? "trust" : "warm"}>{severityCopy[severity]}</Badge>
                    <Badge variant="warm">{item.status}</Badge>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{formatDate(item.created_at)}</span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl text-foreground">
                    {item.reporter_name || "Unknown reporter"} → {item.reported_name || "Unknown member"}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-foreground">{item.reason}</p>
                  {item.evidence_message_id ? (
                    <div className="mt-4 rounded-[var(--bet-radius-md)] border border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] p-4">
                      <p className="font-support text-[11px] uppercase tracking-[0.16em] text-[color:var(--accent-soft)]">
                        Attached message evidence · {item.evidence_message_type || "message"}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-foreground">
                        {item.evidence_message_text || "No text snapshot was available for this message."}
                      </p>
                    </div>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button disabled={busyId === item.id} variant="secondary" onClick={() => void updateReportStatus(item, "REVIEWING")}>Mark reviewing</Button>
                    <Button disabled={busyId === item.id} onClick={() => void updateReportStatus(item, "RESOLVED")}>Resolve</Button>
                    <Button disabled={busyId === item.id} variant="secondary" onClick={() => void updateReportStatus(item, "DISMISSED")}>Dismiss</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <CardContent className="text-center">
        <Badge variant="trust">Clear</Badge>
        <h2 className="mt-4 font-display text-3xl text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
