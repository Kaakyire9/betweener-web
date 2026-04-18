import type { Metadata } from "next";

import { LegalCallout } from "@/components/common/legal-callout";
import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | Betweener",
  description: "Terms governing use of the Betweener service.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Terms of Service"
        title="The terms that govern use of Betweener."
        description="These terms explain who can use Betweener, what conduct is permitted, how paid features work, and how we may enforce platform safety."
      />

      <SectionShell className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout title="Terms summary" className="mb-8">
          <p>Operator: {siteConfig.legal.entityName}</p>
          <p>Effective date: {siteConfig.legal.effectiveDate}</p>
          <p>Jurisdiction and venue: {siteConfig.legal.jurisdiction}</p>
          <p>
            By accessing or using Betweener, you agree to these Terms and to our Privacy Policy. If you do
            not agree, do not use the service.
          </p>
          <p>
            For users who download Betweener through the Apple App Store, these Terms supplement{" "}
            <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">
              Apple&apos;s Standard Licensed Application End User License Agreement
            </a>, which also applies to your use of the app.
          </p>
        </LegalCallout>

        <Card>
          <CardContent className="p-7 md:p-10">
            <div className="policy-copy">
              <p>
                These Terms of Service govern your use of Betweener, including the website, mobile
                applications, and related services we provide.
              </p>

              <h2>1. Eligibility</h2>
              <p>
                You must be legally permitted to use the service in your jurisdiction and meet our minimum
                age requirements. You may not use Betweener if you are prohibited from doing so under
                applicable law or if your account has previously been removed for violations.
              </p>

              <h2>2. Your Account</h2>
              <p>
                You are responsible for maintaining accurate account information and for safeguarding the
                credentials used to access your account. You may not impersonate another person or create
                accounts for fraudulent, deceptive, or abusive purposes.
              </p>

              <h2>3. Acceptable Use</h2>
              <ul>
                <li>No harassment, abuse, threats, hate speech, sexual exploitation, or coercive conduct.</li>
                <li>No deceptive, fraudulent, or manipulative use of the service.</li>
                <li>No attempts to access systems, data, or accounts without authorization.</li>
                <li>No scraping, reverse engineering, or interference with product operations.</li>
                <li>No posting of unlawful, infringing, or harmful content.</li>
              </ul>

              <h2>4. User Content</h2>
              <p>
                You retain ownership of the content you submit. By using Betweener, you grant us a limited,
                non-exclusive license to host, process, display, reproduce, and transmit that content as
                reasonably necessary to operate, secure, moderate, support, and improve the service.
              </p>

              <h2>5. Safety and Enforcement</h2>
              <p>
                We may review reports, investigate misuse, restrict features, suspend accounts, remove
                content, or take other moderation action where reasonably necessary to protect users,
                uphold community expectations, or comply with law.
              </p>

              <h2>6. Paid Features and Billing</h2>
              <p>
                Some features may require a paid subscription or other purchase. Prices, billing intervals,
                renewal terms, and included features are shown at the point of purchase. Purchases made
                through Apple or Google are also subject to the terms, billing rules, and cancellation
                tools of those platforms.
              </p>
              <p>
                Unless otherwise stated, subscriptions renew automatically until cancelled. You are
                responsible for managing your subscription through the platform account used to make the
                purchase.
              </p>

              <h2>7. Termination</h2>
              <p>
                You may stop using the service at any time. We may suspend or terminate access if we
                reasonably believe you have violated these Terms, created risk for users, or exposed the
                service to legal, safety, or operational harm.
              </p>

              <h2>8. Disclaimers</h2>
              <p>
                Betweener is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the fullest extent
                permitted by law. We do not guarantee uninterrupted access, compatibility, or any
                particular outcome from using the service.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Betweener and its operators will not be liable for
                indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss
                of profits, revenue, goodwill, data, or business opportunity arising from or related to
                your use of the service.
              </p>
              <p>
                Nothing in these Terms limits liability that cannot lawfully be excluded or limited under
                applicable law.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms are governed by the laws of {siteConfig.legal.jurisdiction}. Any disputes that
                cannot be resolved informally will be subject to the courts of that jurisdiction, except
                where mandatory local law provides otherwise.
              </p>

              <h2>11. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. If we make material changes, we may provide
                notice through the service, by email, or through other reasonable means. Continued use of
                Betweener after updated Terms take effect means you accept the revised Terms.
              </p>

              <h2>12. Contact</h2>
              <p>
                Legal inquiries can be sent to <a href={`mailto:${siteConfig.contact.legalEmail}`}>{siteConfig.contact.legalEmail}</a>.
              </p>
              <p>
                General support is available at <a href={`mailto:${siteConfig.contact.supportEmail}`}>{siteConfig.contact.supportEmail}</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    </main>
  );
}
