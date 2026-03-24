import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { StoreBadges } from "@/components/common/store-badges";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(196,154,102,0.20),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(132,158,178,0.14),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06),transparent_36%)]" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-18 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
        <Reveal className="relative z-10">
          <p className="text-xs uppercase tracking-[0.32em] text-accent">Premium Intentional Dating</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.94] text-foreground sm:text-6xl md:text-7xl lg:text-[5.4rem]">
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
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          <div className="relative mx-auto max-w-[32rem]">
            <div className="absolute -left-8 top-12 hidden w-44 rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-xl md:block">
              <p className="text-xs uppercase tracking-[0.24em] text-accent">Intent</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Designed to elevate context before momentum, and momentum before noise.
              </p>
            </div>

            <Card className="relative overflow-hidden rounded-[36px] border-white/14 bg-[linear-gradient(180deg,rgba(9,12,20,0.96),rgba(18,23,34,0.78))]">
              <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(201,166,117,0.32),transparent_60%)]" />
              <CardContent className="space-y-6 p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-accent">Betweener</p>
                    <p className="mt-2 font-display text-3xl text-foreground">Tonight has a shape.</p>
                  </div>
                  <div className="rounded-full border border-white/12 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/70">
                    Live Preview
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-accent">Discover</p>
                        <p className="mt-3 max-w-xs text-xl text-foreground">
                          A profile that feels like a person, not a card to clear.
                        </p>
                      </div>
                      <div className="h-14 w-14 rounded-full bg-[radial-gradient(circle,rgba(230,198,156,0.92),rgba(178,137,92,0.35))]" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[26px] border border-white/10 bg-[#121825] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-accent">Conversation</p>
                      <p className="mt-3 text-lg text-foreground">Prompts that open the room, not just the chat.</p>
                      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                        <div className="rounded-2xl bg-white/6 p-3">What would a slow Sunday in your city feel like?</div>
                        <div className="ml-auto max-w-[88%] rounded-2xl bg-accent/14 p-3 text-foreground/88">
                          Like somewhere with music low enough to keep hearing you.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(28,34,49,0.96),rgba(16,19,29,0.92))] p-5">
                      <p className="text-xs uppercase tracking-[0.24em] text-accent">Momentum</p>
                      <p className="mt-3 text-lg text-foreground">From curiosity to a beautifully planned evening.</p>
                      <div className="mt-5 rounded-[22px] border border-white/10 bg-black/15 p-4">
                        <p className="text-sm font-medium text-foreground">Thursday, 19:30</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Candlelit wine bar, saved and shared with both of you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="absolute -right-6 bottom-8 hidden w-48 rounded-[24px] border border-white/12 bg-[rgba(11,16,25,0.82)] p-4 backdrop-blur-xl md:block">
              <p className="text-xs uppercase tracking-[0.24em] text-accent">Trust</p>
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