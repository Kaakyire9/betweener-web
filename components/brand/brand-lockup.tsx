import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  href?: string;
  className?: string;
  compact?: boolean;
};

export function BrandLockup({ href = "/", className, compact = false }: BrandLockupProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)} aria-label="Betweener home">
      <BrandMark size={compact ? "sm" : "md"} />
      <span className="flex flex-col">
        <span className="font-support text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
          Premium Intentional Dating
        </span>
        <span className="font-display text-[1.65rem] leading-none text-foreground">Betweener</span>
      </span>
    </Link>
  );
}