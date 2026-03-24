import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(7,10,18,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link className="flex items-center gap-3 text-sm font-medium tracking-[0.24em] text-foreground/90 uppercase" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-xl tracking-normal text-accent">
            B
          </span>
          Betweener
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="secondary">
            <Link href={siteConfig.deepLinks.universal}>Open App</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={siteConfig.stores.appStore} target="_blank" rel="noreferrer">
              Download
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}