import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/home/hero";
import { MomentumSection } from "@/components/home/momentum-section";
import { StoryGrid } from "@/components/home/story-grid";
import { TrustSection } from "@/components/home/trust-section";
import { Reveal } from "@/components/motion/reveal";
import { SectionIntro } from "@/components/common/section-intro";
import { StoreBadges } from "@/components/common/store-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Betweener | Premium intentional dating",
  description:
    "A distinctive premium dating app centered on trust, chemistry, deeper context, and beautifully paced real-world connection.",
  keywords: [
    "intentional dating app",
    "premium dating app",
    "dating with trust",
    "meaningful connection app",
    "chemistry and context dating"
  ]
});

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StoryGrid />
      <MomentumSection />
      <TrustSection />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <SectionIntro
              eyebrow="Brand Statement"
              title="More deliberate, less performative."
              description="Betweener is for people who want dating to feel intelligent again: less like managing attention, more like understanding someone worth meeting."
            />
          </Reveal>

          <Reveal delay={0.12}>
            <Card className="h-full">
              <CardContent className="grid h-full gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-accent">Designed for</p>
                  <p className="mt-4 font-display text-3xl text-foreground">Meaningful connection</p>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">
                    The product language, interaction rhythm, and trust surfaces all support the
                    same idea: better context creates better chemistry.
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-accent">Built around</p>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                    <p>Intentional discovery rather than swipe reflex.</p>
                    <p>Conversation that sounds human, not canned.</p>
                    <p>Shared movement toward a real date, with elegance and care.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>

      <section id="download" className="border-t border-white/8 bg-[rgba(255,255,255,0.02)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Download</p>
            <h2 className="mt-5 max-w-4xl font-display text-4xl leading-none text-foreground sm:text-5xl md:text-6xl">
              When dating feels calmer, clearer, and more intentional, the right momentum has room to happen.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Explore Betweener on the App Store and Google Play, then use the support and policy
              pages below for anything operational, legal, or account-related.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="lg:justify-self-end">
            <div className="space-y-3">
              <StoreBadges />
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="ghost">
                  <Link href="/support">Support</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/privacy">Privacy</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/delete-account">Delete Account</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}