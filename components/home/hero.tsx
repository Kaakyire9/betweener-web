import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { StoreBadges } from "@/components/common/store-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(230,212,184,0.18),transparent_26%),radial-gradient(circle_at_76%_18%,rgba(17,197,198,0.10),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(215,166,255,0.08),transparent_30%)]" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <Reveal className="relative z-10">
          <Badge variant="warm" className="w-fit">
            Premium Intentional Dating
          </Badge>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.92] text-foreground sm:text-6xl md:text-7xl lg:text-[5.4rem]">
            Dating with more context, more chemistry, and more composure.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Betweener is built for people who want the signal behind the profile, the conversation
            behind the opening line, and the confidence to move from curiosity to something real.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/#download">Explore the Experience</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/privacy">See Our Privacy Approach</Link>
            </Button>
          </div>

          <StoreBadges className="mt-8" />

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Thoughtful discovery", "Profiles with context, pace, and signal."],
              ["Intentional momentum", "Designed to move elegantly toward a real date."],
              ["Trust by design", "Privacy, reporting, and respectful follow-through built in."]
            ].map(([title, copy], index) => (
              <div
                key={title}
                className={index === 1 ? "betweener-surface-soft rounded-[var(--bet-radius-lg)] p-4" : "betweener-surface rounded-[var(--bet-radius-lg)] p-4"}
              >
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div className="relative mx-auto max-w-[32rem]">
            <div className="betweener-surface-soft absolute -left-8 top-12 hidden w-44 rounded-[var(--bet-radius-lg)] p-4 backdrop-blur-xl md:block">
              <p className="betweener-eyebrow">Intent</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Designed to elevate context before momentum, and momentum before noise.
              </p>
            </div>

            <Card className="relative overflow-hidden rounded-[36px] border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(12,28,24,0.96),rgba(18,38,34,0.92))]">
              <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(230,212,184,0.22),transparent_60%),radial-gradient(circle_at_78%_10%,rgba(17,197,198,0.10),transparent_30%)]" />
              <CardContent className="space-y-6 p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="betweener-eyebrow">Betweener</p>
                    <p className="mt-2 font-display text-3xl text-foreground">Tonight has a shape.</p>
                  </div>
                  <Badge variant="trust">Live Preview</Badge>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-[color:var(--border-warm)] bg-[linear-gradient(135deg,rgba(230,212,184,0.08),rgba(255,255,255,0.02))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="betweener-eyebrow">Discover</p>
                        <p className="mt-3 max-w-xs text-xl text-foreground">
                          A profile that feels like a person, not a card to clear.
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-[radial-gradient(circle,rgba(230,212,184,0.88),rgba(214,178,94,0.30))]" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                    <div className="betweener-surface-soft rounded-[26px] p-5">
                      <p className="betweener-eyebrow">Conversation</p>
                      <p className="mt-3 text-lg text-foreground">Prompts that open the room, not just the chat.</p>
                      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                        <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] p-3">
                          What would a slow Sunday in your city feel like?
                        </div>
                        <div className="ml-auto max-w-[88%] rounded-2xl border border-[rgba(167,139,250,0.16)] bg-[rgba(167,139,250,0.10)] p-3 text-[color:var(--text-primary)]">
                          Like somewhere with music low enough to keep hearing you.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-[color:var(--border-soft)] bg-[linear-gradient(180deg,rgba(18,38,34,0.98),rgba(13,29,26,0.92))] p-5">
                      <p className="betweener-eyebrow">Momentum</p>
                      <p className="mt-3 text-lg text-foreground">From curiosity to a beautifully planned evening.</p>
                      <div className="mt-5 rounded-[22px] border border-[color:var(--border-soft)] bg-[rgba(7,19,17,0.35)] p-4">
                        <p className="font-support text-sm tracking-[0.08em] text-foreground">Thursday, 19:30</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Candlelit wine bar, saved and shared with both of you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="betweener-surface-soft absolute -right-6 bottom-8 hidden w-48 rounded-[var(--bet-radius-lg)] p-4 backdrop-blur-xl md:block">
              <p className="betweener-eyebrow">Trust</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Moderation, account controls, and deletion pathways built to support store compliance
                and user confidence.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}