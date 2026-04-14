import type { Metadata } from "next";

import { LegalCallout } from "@/components/common/legal-callout";
import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy | Betweener",
  description: "How Betweener uses cookies and similar technologies on the web.",
  path: "/cookies"
});

export default function CookiesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Cookie Policy"
        title="How Betweener uses cookies and similar technologies."
        description="This page explains what cookies are, which categories we use on the Betweener website, and the choices available to visitors."
      />

      <SectionShell className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
        <LegalCallout title="Cookie summary" className="mb-8">
          <p>Effective date: {siteConfig.legal.effectiveDate}</p>
          <p>Operator: {siteConfig.legal.entityName}</p>
          <p>Mailing address: {siteConfig.legal.address}</p>
          <p>
            Betweener uses limited cookies and similar technologies to keep the website reliable,
            understand performance, protect against abuse, and support essential user actions.
          </p>
        </LegalCallout>

        <Card>
          <CardContent className="p-7 md:p-10">
            <div className="policy-copy">
              <p>
                Cookies are small text files stored on your device when you visit a website. Similar
                technologies may include pixels, local storage, or device identifiers that help a website
                remember settings, measure performance, and support security.
              </p>

              <h2>1. Types of Cookies We Use</h2>
              <h3>Strictly necessary cookies</h3>
              <p>
                These help the website function correctly, maintain security, route traffic, and remember
                essential preferences required for core site operation.
              </p>

              <h3>Performance and analytics cookies</h3>
              <p>
                These help us understand how visitors use the site, which pages are working well, and
                where reliability or design improvements are needed. They are used in an aggregated or
                service-operator context where reasonably possible.
              </p>

              <h3>Fraud prevention and abuse protection technologies</h3>
              <p>
                We may use technical identifiers or similar signals to detect suspicious traffic, prevent
                abuse, and protect platform integrity.
              </p>

              <h2>2. How We Use Cookies</h2>
              <ul>
                <li>To keep the website secure and functioning correctly.</li>
                <li>To remember essential visitor preferences.</li>
                <li>To measure site usage, reliability, and performance.</li>
                <li>To improve design, support, and technical quality over time.</li>
                <li>To help prevent fraud, spam, and abuse.</li>
              </ul>

              <h2>3. Third-Party Services</h2>
              <p>
                Some service providers we use for infrastructure, analytics, communications, embedded
                content, or security may place or read cookies or similar technologies as part of the
                services they provide to us.
              </p>

              <h2>4. Your Choices</h2>
              <p>
                Most browsers allow you to control cookies through browser settings. You can usually block,
                delete, or limit cookies, although doing so may affect parts of the website or reduce some
                functionality.
              </p>

              <h2>5. Relationship to Our Privacy Policy</h2>
              <p>
                Information collected through cookies and similar technologies may be treated as personal
                information where required by applicable law. For more information about how we handle
                personal data, please review our Privacy Policy.
              </p>

              <h2>6. Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in the website,
                applicable law, or the technologies we use. The updated version will be posted on this
                page with a revised effective date where appropriate.
              </p>

              <h2>7. Contact</h2>
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
