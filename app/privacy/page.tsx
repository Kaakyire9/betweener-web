import type { Metadata } from "next";

import { LegalCallout } from "@/components/common/legal-callout";
import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Betweener",
  description: "Privacy policy and data handling overview for Betweener.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy, expressed clearly and designed to be maintained."
        description="This public page supports marketplace review, user trust, and internal legal review. Replace the marked placeholders with your final counsel-approved language before launch."
      />

      <SectionShell className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout className="mb-8">
          <p>Effective date: {siteConfig.legal.effectiveDate}</p>
          <p>Operator: {siteConfig.legal.entityName}</p>
          <p>Mailing address: {siteConfig.legal.address}</p>
          <p>
            This draft is launch-ready in structure and tone, but it still requires legal review for
            jurisdiction, retention obligations, and marketplace-specific disclosures.
          </p>
        </LegalCallout>

        <Card>
          <CardContent className="p-7 md:p-10">
            <div className="policy-copy">
              <p>
                Betweener respects the sensitivity of dating data. We collect and process information in
                order to operate the service, support user trust, maintain safety, comply with law, and
                improve the product experience.
              </p>

              <h2>1. Information We Collect</h2>
              <h3>Account and profile information</h3>
              <p>
                This may include name, age, email address, phone number, profile content, preferences,
                photos, prompts, interests, and other information you choose to provide in the app.
              </p>

              <h3>Usage and device information</h3>
              <p>
                We may collect log data, device identifiers, app diagnostics, IP address, approximate
                location derived from your device or network, referral data, and interaction events that
                help us operate and secure the service.
              </p>

              <h3>Support and safety information</h3>
              <p>
                If you contact support, submit a report, or request assistance, we may collect the
                contents of that communication along with related account and technical context.
              </p>

              <h2>2. How We Use Information</h2>
              <ul>
                <li>To create and manage your account.</li>
                <li>To personalize matching, discovery, and conversation experiences.</li>
                <li>To support trust, moderation, fraud prevention, and abuse handling.</li>
                <li>To respond to support, privacy, legal, and safety requests.</li>
                <li>To analyze performance, reliability, and service quality.</li>
                <li>To comply with applicable law, lawful requests, and marketplace obligations.</li>
              </ul>

              <h2>3. Legal Bases</h2>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> If you process data subject to UK GDPR, EU GDPR,
                or similar frameworks, insert the final legal bases for contract performance, legitimate
                interests, consent where applicable, and compliance with legal obligations.
              </p>

              <h2>4. Sharing of Information</h2>
              <p>
                We may share information with service providers that help us operate the platform, such
                as infrastructure, analytics, customer support, security, payments, and communications
                tools. We may also disclose information when required by law or where necessary to
                protect users, investigate abuse, or enforce our terms.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain information for as long as necessary to provide the service, maintain safety,
                meet legal obligations, resolve disputes, and enforce agreements.
              </p>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> Insert your final retention schedule for deleted
                accounts, support tickets, moderation records, subscription data, and backups.
              </p>

              <h2>6. Account Deletion and Your Choices</h2>
              <p>
                You can request deletion through the in-app flow or via the public account deletion page.
                Certain information may be retained where required for fraud prevention, legal compliance,
                or dispute resolution.
              </p>

              <h2>7. International Transfers</h2>
              <p>
                <strong>[LEGAL REVIEW REQUIRED]</strong> If personal data is transferred across
                jurisdictions, add the relevant transfer mechanism disclosures here, including any
                standard contractual clauses or comparable safeguards.
              </p>

              <h2>8. Security</h2>
              <p>
                We use administrative, technical, and organizational measures intended to protect
                personal information. No system can be guaranteed completely secure, but we aim to design
                our service with restraint, access control, and incident awareness in mind.
              </p>

              <h2>9. Children</h2>
              <p>
                Betweener is not intended for children and is only available to users who meet the
                minimum age required by applicable law and our Terms of Service.
              </p>

              <h2>10. Contact</h2>
              <p>
                Privacy requests can be sent to <a href={`mailto:${siteConfig.contact.privacyEmail}`}>{siteConfig.contact.privacyEmail}</a>.
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