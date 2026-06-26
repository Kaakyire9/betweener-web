import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

const lastUpdated = "June 2026";
const childSafetyEmail = siteConfig.contact.childSafetyEmail;

const enforcementActions = [
  "Content removal",
  "Account restriction",
  "Account suspension",
  "Permanent account ban",
  "Preservation of relevant information",
  "Reporting to appropriate authorities where required"
];

const standards = [
  {
    number: "01",
    title: "Zero tolerance for CSAE and CSAM",
    body: (
      <>
        <p>
          Betweener does not allow any content, account, profile, message, media, comment,
          behaviour, or activity that sexualises, exploits, abuses, grooms, endangers, or targets
          minors.
        </p>
        <p>
          When we identify or receive reports of conduct that violates these standards, we may take
          action including content removal, account restriction, account suspension, permanent
          account bans, preservation of relevant information, and reporting to appropriate
          authorities where required.
        </p>
      </>
    )
  },
  {
    number: "02",
    title: "Betweener is not intended for children",
    body: (
      <>
        <p>
          Betweener is intended only for users who meet the minimum age required by applicable law
          and our <Link href="/terms">Terms of Service</Link>. We do not knowingly allow children
          or underage users to access dating or social discovery features.
        </p>
        <p>
          If we become aware that an account belongs to an underage user, we may restrict, suspend,
          or remove the account.
        </p>
      </>
    )
  },
  {
    number: "03",
    title: "Reporting child safety concerns",
    body: (
      <>
        <p>
          Betweener allows users to report child safety concerns in the app. Reports may relate to
          profiles, messages, media, comments, gifts, moments, or other behaviour that may violate
          our safety standards.
        </p>
        <p>Users can also block accounts that make them feel unsafe.</p>
      </>
    ),
    callout:
      "In-app reporting is available from relevant profile, chat, content, and account safety surfaces where applicable."
  },
  {
    number: "04",
    title: "How we review and respond",
    body: (
      <>
        <p>
          Betweener reviews safety reports and takes action where necessary. Depending on the
          concern, we may remove content, restrict access, suspend accounts, permanently ban
          accounts, preserve relevant information, and cooperate with law enforcement, regulators,
          or child safety organisations where legally required.
        </p>
        <p>Reports are handled with urgency and confidentiality where appropriate.</p>
      </>
    )
  },
  {
    number: "05",
    title: "Compliance with child safety laws",
    body: (
      <>
        <p>
          Betweener is committed to complying with relevant child safety laws and reporting
          obligations. Where legally required, we may report suspected child sexual abuse material,
          grooming, exploitation, or other child safety concerns to appropriate regional or national
          authorities, law enforcement, or designated child safety organisations.
        </p>
      </>
    )
  },
  {
    number: "06",
    title: "Child safety contact",
    body: (
      <>
        <p>For child safety concerns involving Betweener, contact us at:</p>
        <p>
          <a href={`mailto:${childSafetyEmail}`}>{childSafetyEmail}</a>
        </p>
        <p>
          If a child is in immediate danger, contact emergency services or local law enforcement
          immediately.
        </p>
      </>
    )
  }
];

export const metadata: Metadata = buildMetadata({
  title: "Child Safety Standards | Betweener",
  description:
    "Betweener's published standards against child sexual abuse and exploitation (CSAE), child sexual abuse material (CSAM), and child safety concerns.",
  path: "/child-safety",
  keywords: [
    "child sexual abuse and exploitation",
    "CSAE",
    "child sexual abuse material",
    "CSAM",
    "child safety",
    "in-app reporting",
    "moderation",
    "law enforcement",
    "compliance"
  ]
});

export default function ChildSafetyPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[color:var(--border-soft)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,235,221,0.12),transparent_38%),radial-gradient(circle_at_18%_18%,rgba(17,197,198,0.16),transparent_24%),radial-gradient(circle_at_82%_10%,rgba(139,92,255,0.16),transparent_22%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Badge variant="trust" className="w-fit">
            Child Safety &amp; Compliance
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
            Betweener Child Safety Standards
          </h1>
          <p className="mt-5 max-w-3xl text-xl leading-8 text-[color:var(--accent-soft)]">
            Our standards against child sexual abuse and exploitation.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Betweener is committed to preventing child sexual abuse and exploitation (CSAE), child
            sexual abuse material (CSAM), grooming, and any behaviour that endangers children.
            These standards explain how we prevent, report, review, and respond to child safety
            concerns on our platform.
          </p>
          <p className="mt-6 font-support text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {enforcementActions.map((action) => (
            <Card
              key={action}
              className="border-[rgba(244,235,221,0.1)] bg-[linear-gradient(180deg,rgba(15,61,62,0.76),rgba(7,30,34,0.96))]"
            >
              <CardContent className="space-y-3">
                <p className="betweener-eyebrow text-[color:var(--accent-soft)]">Enforcement</p>
                <p className="text-lg text-foreground">{action}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-8 lg:pb-24">
        <div className="grid gap-6">
          {standards.map((section) => (
            <Card
              key={section.number}
              className="border-[rgba(244,235,221,0.1)] bg-[linear-gradient(180deg,rgba(15,61,62,0.72),rgba(7,30,34,0.98))]"
            >
              <CardContent className="grid gap-6 md:grid-cols-[96px_1fr] md:items-start">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(167,139,250,0.24)] bg-[rgba(139,92,255,0.1)] font-support text-sm tracking-[0.18em] text-[color:var(--signal-romance)]">
                  {section.number}
                </div>
                <div className="policy-copy">
                  <h2>{section.title}</h2>
                  {section.body}
                  {section.callout ? (
                    <div className="mt-6 rounded-[var(--bet-radius-md)] border border-[rgba(17,197,198,0.24)] bg-[rgba(17,197,198,0.08)] p-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                      {section.callout}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(17,197,198,0.06),rgba(7,30,34,0.98))]">
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="betweener-eyebrow text-[color:var(--accent-soft)]">Related policies</p>
              <h2 className="mt-3 font-display text-3xl text-foreground">Public standards and core legal pages</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                This page is publicly available at{" "}
                <span className="text-foreground">{siteConfig.url}/child-safety</span> and is
                intended for trust, safety, marketplace, and compliance review.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                href="/privacy"
                className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] px-4 py-3 text-muted-foreground transition hover:border-[color:var(--border-strong)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-soft)]"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] px-4 py-3 text-muted-foreground transition hover:border-[color:var(--border-strong)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-soft)]"
              >
                Terms of Service
              </Link>
              <a
                href={`mailto:${childSafetyEmail}`}
                className="rounded-[var(--bet-radius-md)] border border-[rgba(17,197,198,0.24)] px-4 py-3 text-[color:var(--accent-soft)] transition hover:border-[rgba(17,197,198,0.42)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-soft)]"
              >
                Contact
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
