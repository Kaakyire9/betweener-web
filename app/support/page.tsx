import type { Metadata } from "next";

import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Support | Betweener",
  description: "Public support information for Betweener users and app marketplace review.",
  path: "/support"
});

export default function SupportPage() {
  return (
    <main>
      <PageHero
        eyebrow="Support"
        title="Support that stays clear, calm, and easy to find."
        description="This page is public so users, App Store Connect reviewers, and Google Play reviewers can quickly locate assistance, safety reporting routes, and account management help."
      />

      <SectionShell className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "General support",
              copy: siteConfig.contact.supportEmail,
              detail: siteConfig.contact.responseWindow,
              variant: "trust" as const
            },
            {
              title: "Privacy requests",
              copy: siteConfig.contact.privacyEmail,
              detail: "Use this channel for access, deletion, or data handling questions.",
              variant: "warm" as const
            },
            {
              title: "Legal inquiries",
              copy: siteConfig.contact.legalEmail,
              detail: "For formal notices, counsel, or compliance review.",
              variant: "default" as const
            }
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3">
                <Badge variant={item.variant} className="w-fit">
                  {item.title}
                </Badge>
                <p className="text-lg text-foreground">{item.copy}</p>
                <p className="text-sm leading-7 text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <p className="betweener-eyebrow">What we can help with</p>
                <h2 className="mt-4 font-display text-4xl text-foreground">Account, billing, safety, and access.</h2>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  "Sign-in or account recovery assistance",
                  "App functionality and bug reports",
                  "Subscription or billing questions",
                  "Profile, privacy, or content concerns",
                  "Reporting unsafe or suspicious behaviour",
                  "Deletion and data handling requests"
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-[rgba(7,19,17,0.18)] p-4 text-sm leading-7 text-muted-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-5">
              <div>
                <p className="betweener-eyebrow">Response details</p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Support hours: {siteConfig.contact.supportHours}
                </p>
                <p className="mt-2 text-base leading-8 text-muted-foreground">
                  Target response window: {siteConfig.contact.responseWindow}
                </p>
              </div>

              <div className="rounded-[var(--bet-radius-lg)] border border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(17,197,198,0.06),rgba(18,38,34,0.96))] p-5">
                <p className="text-sm font-semibold text-foreground">Report an urgent safety concern</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Email <a href={`mailto:${siteConfig.contact.supportEmail}`}>{siteConfig.contact.supportEmail}</a> with
                  the subject line &quot;Safety Report&quot; and include any relevant profile details,
                  screenshots, and context. If someone is in immediate danger, contact local
                  emergency services first.
                </p>
              </div>

              <div className="rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                <p className="text-sm font-semibold text-foreground">Delete your account</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  A public deletion page is available at <span className="text-foreground">/delete-account</span>.
                  In-app deletion remains the primary route where supported.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    </main>
  );
}