import type { Metadata } from "next";

import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Safety | Betweener",
  description: "Safety principles and reporting guidance for Betweener.",
  path: "/safety"
});

export default function SafetyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Safety"
        title="Trust is not a side note. It is part of the product surface."
        description="Betweener is designed to support more deliberate, respectful connection. This page outlines the principles and habits that help keep the experience safe."
      />

      <SectionShell className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Protect your information",
              copy: "Share personal details gradually. Use in-app communication until trust is established.",
              variant: "trust" as const
            },
            {
              title: "Meet intentionally",
              copy: "For first meetings, choose public places, tell a friend your plan, and keep control of your transport.",
              variant: "warm" as const
            },
            {
              title: "Report concerns",
              copy: "If someone behaves deceptively, abusively, or makes you uncomfortable, report it through support.",
              variant: "default" as const
            }
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3">
                <Badge variant={item.variant} className="w-fit">
                  {item.title}
                </Badge>
                <p className="text-sm leading-7 text-muted-foreground">{item.copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(17,197,198,0.05),rgba(18,38,34,0.98))]">
          <CardContent className="space-y-4">
            <p className="betweener-eyebrow">Reporting</p>
            <h2 className="font-display text-4xl text-foreground">How to raise a safety issue</h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              Include as much detail as you can: profile name, screenshots, the nature of the
              concern, and whether there is any urgent risk. If there is immediate danger, contact
              local emergency services first and then notify us through the support page.
            </p>
          </CardContent>
        </Card>
      </SectionShell>
    </main>
  );
}