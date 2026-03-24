import type { Metadata } from "next";

import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Betweener",
  description: "Contact routes for support, privacy, legal, and partnerships.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="A simple route into the right conversation."
        description="The site is structured so support, privacy, legal, and partnership inquiries each have a clear destination. Supabase-backed forms can be connected later without changing the content model."
      />

      <SectionShell className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              title: "Support",
              email: siteConfig.contact.supportEmail,
              copy: "For account help, app issues, billing questions, or safety reporting.",
              variant: "trust" as const
            },
            {
              title: "Privacy",
              email: siteConfig.contact.privacyEmail,
              copy: "For deletion requests, access requests, and data handling concerns.",
              variant: "warm" as const
            },
            {
              title: "Legal",
              email: siteConfig.contact.legalEmail,
              copy: "For formal legal inquiries, compliance review, and counsel contact.",
              variant: "default" as const
            },
            {
              title: "Partnerships",
              email: siteConfig.contact.partnershipsEmail,
              copy: "For partnerships, editorial conversations, and business development.",
              variant: "signal" as const
            }
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3">
                <Badge variant={item.variant} className="w-fit">
                  {item.title}
                </Badge>
                <a className="text-lg text-foreground" href={`mailto:${item.email}`}>
                  {item.email}
                </a>
                <p className="text-sm leading-7 text-muted-foreground">{item.copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}