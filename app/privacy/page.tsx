import type { Metadata } from "next";

import { LegalCallout } from "@/components/common/legal-callout";
import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | Betweener",
  description: "How Betweener collects, uses, protects, and retains personal information.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Privacy Policy"
        title="How Betweener handles personal information."
        description="This page explains what we collect, why we use it, how long we keep it, and the choices available to members who use Betweener."
      />

      <SectionShell className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout title="Policy summary" className="mb-8">
          <p>Effective date: {siteConfig.legal.effectiveDate}</p>
          <p>Operator: {siteConfig.legal.entityName}</p>
          <p>Mailing address: {siteConfig.legal.address}</p>
          <p>
            Betweener is designed around trust, safety, and intentional discovery. We process personal
            information to operate the service, protect members, maintain reliability, and comply with law.
          </p>
        </LegalCallout>

        <Card>
          <CardContent className="p-7 md:p-10">
            <div className="policy-copy">
              <p>
                Betweener respects the sensitivity of personal and relationship data. We collect and use
                information to provide the service, support safer interactions, review abuse reports,
                improve reliability, and meet our legal obligations.
              </p>

              <h2>1. Information We Collect</h2>
              <h3>Account and profile information</h3>
              <p>
                This may include your name, age, email address, phone number, profile content,
                relationship preferences, photos, videos, prompts, interests, and other information you
                choose to add to your account.
              </p>

              <h3>Usage, device, and technical information</h3>
              <p>
                We may collect log data, device identifiers, app diagnostics, IP address, approximate or
                device-permitted location information, referral data, crash information, and product
                interaction events that help us operate, secure, and improve the service.
              </p>

              <h3>Safety, moderation, and support information</h3>
              <p>
                If you contact support, submit a report, request recovery assistance, or take part in a
                verification or moderation flow, we may collect the contents of that communication along
                with related account, device, and safety context.
              </p>

              <h2>2. How We Use Information</h2>
              <ul>
                <li>To create, secure, and manage your account.</li>
                <li>To personalize discovery, matching, conversation, and trust features.</li>
                <li>To support moderation, fraud prevention, abuse handling, and platform safety.</li>
                <li>To process purchases, restore entitlements, and manage subscription support.</li>
                <li>To respond to privacy, legal, support, and account recovery requests.</li>
                <li>To analyze performance, reliability, and service quality.</li>
                <li>To comply with applicable law, lawful requests, and marketplace obligations.</li>
              </ul>

              <h2>3. Legal Bases</h2>
              <p>
                Where applicable, we process personal information on the basis of contract performance,
                legitimate interests in operating and protecting the service, consent where required, and
                compliance with legal obligations.
              </p>

              <h2>4. Sharing of Information</h2>
              <p>
                We may share information with service providers that help us operate the platform, such as
                infrastructure, analytics, communications, support, security, payments, and moderation
                tooling. We may also disclose information when required by law or where necessary to
                protect users, investigate abuse, enforce our terms, or defend legal claims.
              </p>

              <h2>5. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to provide the service, maintain
                safety, prevent abuse, meet legal obligations, resolve disputes, and enforce agreements.
              </p>
              <p>
                If you delete your account, we may retain limited records where reasonably necessary for
                fraud prevention, legal compliance, moderation history, dispute resolution, billing,
                backups, and enforcement of platform safety rules.
              </p>

              <h2>6. Account Deletion and Your Choices</h2>
              <p>
                You can request deletion through the in-app flow or through the public account deletion
                page. You may also contact us about access, correction, or privacy requests using the
                contact details below.
              </p>

              <h2>7. International Transfers</h2>
              <p>
                Your information may be processed in countries other than the one where you live. Where
                required, we use contractual, organizational, or technical safeguards intended to protect
                personal information during cross-border transfers.
              </p>

              <h2>8. Security</h2>
              <p>
                We use administrative, technical, and organizational measures intended to protect personal
                information. No service can guarantee complete security, but we design our systems around
                access control, operational restraint, and incident awareness.
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
