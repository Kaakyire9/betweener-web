import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/common/page-hero";
import { SectionShell } from "@/components/common/section-shell";
import { StoreBadges } from "@/components/common/store-badges";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildMetadata } from "@/lib/metadata";

const colorGroups = [
  {
    title: "Core surfaces",
    tokens: [
      ["Canvas", "--bg-canvas"],
      ["Elevated", "--bg-elevated"],
      ["Surface", "--bg-surface"],
      ["Surface Soft", "--bg-surface-soft"]
    ]
  },
  {
    title: "Brand accents",
    tokens: [
      ["Primary Teal", "--accent-primary"],
      ["Deep Teal", "--accent-primary-hover"],
      ["Soft Aqua", "--accent-soft"],
      ["Trust Mint", "--accent-trust"]
    ]
  },
  {
    title: "Warm premium",
    tokens: [
      ["Champagne", "--accent-warm"],
      ["Warm Ivory", "--accent-warm-soft"],
      ["Rose Clay", "--accent-rose"],
      ["Gold Trust", "--signal-gold"]
    ]
  }
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Design System | Betweener",
  description: "Preview the Betweener website design tokens and component primitives.",
  path: "/design-system",
  noIndex: true
});

export default function DesignSystemPage() {
  return (
    <main>
      <PageHero
        eyebrow="Design System"
        title="A visual reference for the Betweener web brand."
        description="This page is a working preview of the semantic token system, typography, reusable UI primitives, and exported brand assets used to build the marketing and compliance site."
      />

      <SectionShell className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mb-5 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/brand/betweener-mark.svg" target="_blank">
              Brand Mark SVG
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/brand/betweener-wordmark.svg" target="_blank">
              Wordmark SVG
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/opengraph-image" target="_blank">
              Open Graph Preview
            </Link>
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {colorGroups.map((group) => (
            <Card key={group.title}>
              <CardContent className="space-y-5">
                <div>
                  <p className="betweener-eyebrow">Palette</p>
                  <h2 className="mt-3 font-display text-3xl text-foreground">{group.title}</h2>
                </div>
                <div className="grid gap-4">
                  {group.tokens.map(([label, token]) => (
                    <div key={token} className="rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] p-3">
                      <div
                        className="h-16 rounded-[12px] border border-[color:var(--border-soft)]"
                        style={{ background: `var(${token})` }}
                      />
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-sm text-foreground">{label}</p>
                        <p className="font-support text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {token}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionShell>

      <SectionShell tone="elevated" border="y" className="mx-auto px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardContent className="space-y-6">
              <div>
                <p className="betweener-eyebrow">Typography</p>
                <h2 className="mt-3 font-display text-5xl leading-none text-foreground">
                  Editorial, calm, and legible.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Playfair Display carries emotional and editorial weight. Manrope handles body and UI.
                Archivo provides structured support for labels, chips, and utility content.
              </p>
              <div className="space-y-4">
                <p className="font-display text-4xl text-foreground">Meaningful connection with room to breathe.</p>
                <p className="text-base leading-8 text-muted-foreground">
                  The website should feel slower and more spacious than the app while remaining part
                  of the same premium dark system.
                </p>
                <p className="font-support text-xs uppercase tracking-[0.2em] text-[color:var(--accent-soft)]">
                  Support labels use archivo
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6">
              <div>
                <p className="betweener-eyebrow">Actions And Labels</p>
                <h2 className="mt-3 font-display text-3xl text-foreground">Buttons, badges, and CTA behavior.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>Primary CTA</Button>
                <Button variant="secondary">Secondary CTA</Button>
                <Button variant="ghost">Ghost Link</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="warm">Warm</Badge>
                <Badge variant="trust">Trust</Badge>
                <Badge variant="signal">Chemistry</Badge>
              </div>
              <StoreBadges />
            </CardContent>
          </Card>
        </div>
      </SectionShell>

      <SectionShell className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <Card>
            <CardContent className="space-y-5">
              <div>
                <p className="betweener-eyebrow">Form Controls</p>
                <h2 className="mt-3 font-display text-3xl text-foreground">Inputs should feel composed, not corporate.</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="font-support text-xs uppercase tracking-[0.16em] text-muted-foreground"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="you@getbetweener.com" />
                </div>
                <div className="space-y-2">
                  <label
                    className="font-support text-xs uppercase tracking-[0.16em] text-muted-foreground"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell us what you are building or what you need help with." />
                </div>
                <Button className="w-full sm:w-auto">Submit</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-4">
                <p className="betweener-eyebrow">Surface</p>
                <h3 className="font-display text-3xl text-foreground">Default content card</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Use this for feature stories, trust blocks, support modules, and editorial content.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[color:var(--border-warm)] bg-[linear-gradient(180deg,rgba(23,49,44,0.90),rgba(18,38,34,0.98))] shadow-[var(--bet-glow-warm)]">
              <CardContent className="space-y-4">
                <p className="betweener-eyebrow">Premium surface</p>
                <h3 className="font-display text-3xl text-foreground">Warm editorial emphasis</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Reserve this treatment for hero-adjacent content, trust framing, or high-emphasis storytelling.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(17,197,198,0.08),rgba(18,38,34,0.96))]">
              <CardContent className="space-y-4">
                <p className="betweener-eyebrow">Action surface</p>
                <h3 className="font-display text-3xl text-foreground">Teal-led clarity</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Use sparingly for active CTA modules, download sections, or focused support pathways.
                </p>
              </CardContent>
            </Card>
            <Card className="border-[rgba(167,139,250,0.18)] bg-[linear-gradient(180deg,rgba(167,139,250,0.08),rgba(18,38,34,0.96))]">
              <CardContent className="space-y-4">
                <p className="betweener-eyebrow">Signal surface</p>
                <h3 className="font-display text-3xl text-foreground">Chemistry accent</h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Use only for momentum, chemistry, or date-planning moments. It should never dominate the brand.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}