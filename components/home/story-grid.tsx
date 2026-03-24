import { Reveal } from "@/components/motion/reveal";
import { SectionIntro } from "@/components/common/section-intro";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stories = [
  {
    title: 'Discover people, not just profiles',
    copy:
      'Betweener favors signal over speed. The product story centers personality, context, and how someone moves through the world, so discovery feels considered instead of disposable.',
    note: 'Depth before volume',
    className: 'lg:col-span-7'
  },
  {
    title: 'Go beyond "hey"',
    copy:
      'Conversation is framed to open texture, tone, and curiosity. It becomes easier to say something that actually sounds like you.',
    note: 'Conversation with shape',
    className: 'lg:col-span-5'
  },
  {
    title: 'Turn curiosity into connection',
    copy:
      'The app is built to create momentum without pressure. Mutual interest can move forward with clarity, timing, and better shared context.',
    note: 'Warmth without haste',
    className: 'lg:col-span-5'
  },
  {
    title: 'Plan the date beautifully',
    copy:
      'From the first spark to the first plan, the experience is designed to feel calm, elevated, and distinctly real-world.',
    note: 'Real-world follow-through',
    className: 'lg:col-span-7'
  }
] as const;

export function StoryGrid() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <Reveal>
        <SectionIntro
          eyebrow="Editorial Product Story"
          title="A dating experience composed like a relationship product, not a growth machine."
          description="Each section of the experience is intended to feel more like good hospitality than feed mechanics: attentive, calm, and built to carry interest into the real world."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-12">
        {stories.map((story, index) => (
          <Reveal key={story.title} delay={index * 0.08} className={cn("h-full", story.className)}>
            <Card className="h-full min-h-[18rem]">
              <CardContent className="flex h-full flex-col justify-between gap-8">
                <div className="space-y-4">
                  <p className="betweener-eyebrow">{story.note}</p>
                  <h3 className="max-w-xl font-display text-3xl leading-tight text-foreground sm:text-4xl">
                    {story.title}
                  </h3>
                  <p className="max-w-xl text-base leading-8 text-muted-foreground">{story.copy}</p>
                </div>
                <div className="betweener-divider pt-5 text-sm text-[color:var(--text-secondary)]">
                  Thoughtful interface choices create calmer, more legible dating momentum.
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}