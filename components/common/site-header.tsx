import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border-soft)] bg-[color:var(--bg-overlay)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <BrandLockup compact />

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