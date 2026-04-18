import type { Metadata } from "next";
import Link from "next/link";

import { SectionShell } from "@/components/common/section-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Open Betweener",
  description: "Open Betweener from the web or continue to download options."
});

export default function OpenAppPage() {
  return (
    <main>
      <SectionShell tone="elevated">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20 lg:px-8">
          <p className="betweener-eyebrow">Open App</p>
          <h1 className="mt-5 font-display text-5xl leading-none text-foreground md:text-7xl">
            Continue in Betweener.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            If Betweener is installed on this device, use the button below to open the app. If not,
            continue to download information or contact support.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={siteConfig.deepLinks.scheme}>Open Betweener</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/download">Download options</Link>
            </Button>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}