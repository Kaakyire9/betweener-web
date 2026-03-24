import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { SectionIntro } from "@/components/common/section-intro";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const trustPoints = [
  {
    title: "Privacy and control",
    copy: "Clear policies, meaningful account controls, and public support routes that satisfy app marketplace requirements."
  },
  {
    title: "Safety pathways",
    copy: "Reporting, support, and deletion guidance live on public pages so users and reviewers can find them without friction."
  },
  {
    title: "Premium clarity",
    copy: "Store links, contact details, and policy architecture are all driven from shared config so updates stay consistent."
  }
] as const;

export function TrustSection() {
  return (
    <section id="trust" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <Reveal>
        <SectionIntro
          eyebrow="Trust Layer"
          title="Calm confidence is part of the product."
          description="The website supports the app with the same tone as the experience itself: precise, warm, and responsibly transparent."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col justify-between gap-8">
              <div className="grid gap-5 md:grid-cols-3">
                {trustPoints.map((item) => (
                  <div key={item.title} className="rounded-[24px] border border-white/10 bg-black/12 p-5">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(201,166,117,0.12),rgba(117,134,153,0.08))] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Marketplace ready</p>
                <p className="mt-3 max-w-3xl text-lg leading-8 text-foreground/90">
                  Public support, privacy, terms, and account deletion routes are included from day
                  one so the site supports App Store Connect and Google Play review requirements.
                </p>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.12}>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Need the policies?</p>
                <h3 className="mt-4 font-display text-4xl leading-tight text-foreground">
                  Privacy, support, terms, safety, and deletion are part of the launch surface.
                </h3>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  The site architecture keeps legal and operational content easy to review, update,
                  and extend as you add forms, waitlists, or deeper support tooling later.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary">
                  <Link href="/support">Support</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/privacy">Privacy</Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/delete-account">Delete Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}