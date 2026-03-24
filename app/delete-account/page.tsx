import type { Metadata } from "next";

import { LegalCallout } from "@/components/common/legal-callout";
import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Delete Account | Betweener",
  description: "Public account deletion instructions for Betweener users and Google Play compliance.",
  path: "/delete-account"
});

export default function DeleteAccountPage() {
  return (
    <main>
      <PageHero
        eyebrow="Delete Account"
        title="A clear public deletion route for marketplace compliance and user trust."
        description="Google Play requires a public account deletion page. This route explains the default in-app path, fallback support contact, and what users should expect from the process."
      />

      <SectionShell className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout className="mb-8">
          <p>
            Replace the in-app navigation path below if your final UI uses different labels. Confirm
            the retention exceptions and deletion timeline with counsel and your backend team.
          </p>
        </LegalCallout>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <Badge variant="trust" className="w-fit">
                  Preferred path
                </Badge>
                <h2 className="mt-4 font-display text-4xl text-foreground">Delete your account in the app</h2>
              </div>

              <ol className="list-decimal space-y-4 pl-5 text-base leading-8 text-muted-foreground">
                <li>Open Betweener and sign in to the account you want to delete.</li>
                <li>Go to Profile, then Settings.</li>
                <li>Select Account.</li>
                <li>Choose Delete Account.</li>
                <li>Follow the confirmation prompts to complete the request.</li>
              </ol>

              <div className="rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-5">
                <p className="text-sm font-semibold text-foreground">Can&apos;t access the app?</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Email <a href={`mailto:${siteConfig.contact.privacyEmail}`}>{siteConfig.contact.privacyEmail}</a> from the
                  address associated with your account and use the subject line &quot;Delete My Account&quot;.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6">
              <div>
                <Badge variant="warm" className="w-fit">
                  What to expect
                </Badge>
                <h2 className="mt-4 font-display text-4xl text-foreground">Deletion timing and retained data.</h2>
              </div>

              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Account deletion requests are processed as soon as reasonably possible after identity
                  verification where needed.
                </p>
                <p>
                  <strong>[LEGAL REVIEW REQUIRED]</strong> Insert your target deletion window, any
                  staged deletion timeline, and the list of data categories retained for fraud
                  prevention, billing, legal compliance, dispute resolution, or backup recovery.
                </p>
                <p>
                  If a subscription was purchased through Apple or Google, cancellation may also need
                  to be managed through the relevant store account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionShell>
    </main>
  );
}