import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

type StoreBadgesProps = {
  className?: string;
};

export function StoreBadges({ className }: StoreBadgesProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={siteConfig.stores.appStore} target="_blank" rel="noreferrer">
            Download on the App Store
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href={siteConfig.stores.playStore} target="_blank" rel="noreferrer">
            Get it on Google Play
          </Link>
        </Button>
      </div>
      <p className="mt-3 max-w-xl text-xs leading-6 text-muted-foreground">
        Public store links will be added when Betweener is live. App Review can use the submitted
        build and in-app purchase products in App Store Connect.
      </p>
    </div>
  );
}