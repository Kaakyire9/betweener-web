import { cn } from "@/lib/utils";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionIntro({ eyebrow, title, description, align = "left" }: SectionIntroProps) {
  return (
    <div className={cn("space-y-4", align === "center" && "mx-auto max-w-3xl text-center")}>
      <p className="betweener-eyebrow">{eyebrow}</p>
      <h2 className="max-w-3xl font-display text-4xl leading-none text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}