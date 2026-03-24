import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(5,7,13,0.72)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-3xl text-foreground">Betweener</p>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            Premium intentional dating for people who want deeper context, real chemistry, and
            thoughtful follow-through.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Explore</p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {siteConfig.footerNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Contact</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Support:{" "}
              <a className="transition hover:text-foreground" href={`mailto:${siteConfig.contact.supportEmail}`}>
                {siteConfig.contact.supportEmail}
              </a>
            </p>
            <p>
              Privacy:{" "}
              <a className="transition hover:text-foreground" href={`mailto:${siteConfig.contact.privacyEmail}`}>
                {siteConfig.contact.privacyEmail}
              </a>
            </p>
            <p>
              Legal:{" "}
              <a className="transition hover:text-foreground" href={`mailto:${siteConfig.contact.legalEmail}`}>
                {siteConfig.contact.legalEmail}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 px-6 py-5 text-center text-xs tracking-[0.16em] text-muted-foreground uppercase">
        (c) {new Date().getFullYear()} {siteConfig.legal.entityName}. All rights reserved.
      </div>
    </footer>
  );
}