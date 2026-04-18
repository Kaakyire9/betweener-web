import type { Metadata } from "next";
import Link from "next/link";

import { SectionShell } from "@/components/common/section-shell";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Download Betweener",
  description: "Download information for Betweener."
});

export default function DownloadPage() {
  return (
    <main>
      <SectionShell tone="elevated">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-6 py-20 lg:px-8">
          <p className="betweener-eyebrow">Download</p>
          <h1 className="mt-5 font-display text-5xl leading-none text-foreground md:text-7xl">
            Betweener is preparing for public release.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Betweener is currently in App Store review. Reviewers should use the submitted build and
            in-app purchase products in App Store Connect. Public store links will be added here when
            the app is live.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/support">Contact support</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/privacy">Privacy policy</Link>
            </Button>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}