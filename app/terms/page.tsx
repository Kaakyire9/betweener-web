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
        title="The rules for using Betweener, written to be legible."
        description="This structure is intended to support launch, app review, and legal handoff. The highlighted placeholders should be finalized with counsel before publication."
      />

      <SectionShell className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout className="mb-8">
          <p>Operator: {siteConfig.legal.entityName}</p>
          <p>Effective date: {siteConfig.legal.effectiveDate}</p>
          <p>Jurisdiction and venue: {siteConfig.legal.jurisdiction}</p>
          <p>
            Review subscription, billing, dispute resolution, governing law, moderation, and content
            licensing terms with qualified counsel before launch.
          </p>
        </LegalCallout>

        <Card>
          <CardContent className="p-7 md:p-10">
            <div className="policy-copy">
              <p>
                These Terms of Service govern your use of Betweener, including the website, mobile
                applications, and any related services we provide.
              </p>

              <h2>1. Eligibility</h2>
              <p>
                You must be legally permitted to use the service in your jurisdiction and meet our
                minimum age requirements. You may not use Betweener if you are prohibited from doing so
                under applicable law or if your account has previously been removed for violations.
              </p>

              <h2>2. Your Account</h2>
              <p>
                You are responsible for maintaining accurate account information and for safeguarding the
                credentials used to access your account. You may not impersonate another person or create
                accounts for fraudulent or abusive purposes.
              </p>

              <h2>3. Acceptable Use</h2>
              <ul>
                <li>No harassment, abuse, threats, hate speech, or exploitative conduct.</li>
                <li>No deceptive, fraudulent, or manipulative use of the service.</li>
                <li>No attempts to access systems, data, or accounts without authorization.</li>
                <li>No scraping, reverse engineering, or interference with product operations.</li>
                <li>No posting of unlawful, infringing, or harmful content.</li>
              </ul>

              <h2>4. User Content</h2>
              <p>
                You retain ownership of the content you submit, but you grant Betweener a limited license
                to host, process, display, and transmit that content as necessary to operate and improve
                the service.
              </p>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> Confirm the final scope of your license, moral
                rights language, and moderation rights with counsel.
              </p>

              <h2>5. Safety and Enforcement</h2>
              <p>
                We may review reports, investigate misuse, restrict features, suspend accounts, or remove
                content where necessary to protect users, uphold community expectations, or comply with law.
              </p>

              <h2>6. Paid Features and Billing</h2>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> If Betweener offers paid subscriptions or premium
                features, insert your final billing, renewal, cancellation, refund, and platform-specific
                purchase terms here.
              </p>

              <h2>7. Termination</h2>
              <p>
                You may stop using the service at any time. We may suspend or terminate access if we
                reasonably believe you have violated these Terms, created risk for users, or exposed the
                service to legal or operational harm.
              </p>

              <h2>8. Disclaimers</h2>
              <p>
                Betweener is provided on an &quot;as is&quot; and &quot;as available&quot; basis to the fullest extent
                permitted by law. We do not guarantee uninterrupted access, compatibility, or any
                particular outcome from using the service.
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> Insert your jurisdiction-appropriate limitation
                of liability and exclusion language.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> Confirm the governing law, venue, and any
                arbitration or dispute resolution provisions.
              </p>

              <h2>11. Contact</h2>
              <p>
                Legal inquiries can be sent to <a href={`mailto:${siteConfig.contact.legalEmail}`}>{siteConfig.contact.legalEmail}</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    </main>
  );
}