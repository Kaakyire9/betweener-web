import { Reveal } from "@/components/motion/reveal";
import { SectionIntro } from "@/components/common/section-intro";
import { Card, CardContent } from "@/components/ui/card";

const rhythm = [
  {
    step: "01",
    title: "Signal",
    copy: "Profiles communicate intent, taste, and context so attraction has something real to land on."
  },
  {
    step: "02",
    title: "Chemistry",
    copy:
      "Prompts and conversation framing help both people sound more human, more specific, and more present."
  },
  {
    step: "03",
    title: "Follow-through",
    copy: "Shared momentum becomes a plan, with the emotional temperature of the experience kept steady and elegant."
  }
] as const;

export function MomentumSection() {
  return (
    <section className="border-y border-white/8 bg-[rgba(255,255,255,0.02)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <Reveal>
          <SectionIntro
            eyebrow="Relationship Rhythm"
            title="Trust, chemistry, and context working in sequence."
            description="Betweener is designed around progression. Each layer of the product exists to make the next step feel earned, legible, and emotionally intelligent."
          />
        </Reveal>

        <div className="space-y-5">
          {rhythm.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.08}>
              <Card>
                <CardContent className="grid gap-4 md:grid-cols-[6rem_1fr] md:items-start">
                  <div className="text-sm uppercase tracking-[0.28em] text-accent">{item.step}</div>
                  <div>
                    <h3 className="font-display text-3xl text-foreground">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">{item.copy}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}