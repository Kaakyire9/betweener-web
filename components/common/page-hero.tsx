type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--border-soft)]">
      <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(230,212,184,0.18),transparent_52%),radial-gradient(circle_at_72%_18%,rgba(17,197,198,0.08),transparent_26%)]" />
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
        <p className="betweener-eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl leading-none text-foreground sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
      </div>
    </section>
  );
}