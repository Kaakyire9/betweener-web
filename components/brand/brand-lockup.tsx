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
    <Link
      href={href}
      className={cn("inline-flex min-w-0 items-center gap-3", className)}
      aria-label="Betweener home"
    >
      <BrandMark size={compact ? "sm" : "md"} className="shrink-0" />
      <span className="flex min-w-0 flex-col">
        <span className="hidden truncate font-support text-[11px] uppercase tracking-[0.22em] text-[color:var(--text-muted)] sm:block">
          Premium Intentional Dating
        </span>
        <span className="truncate font-display text-[1.35rem] leading-none text-foreground sm:text-[1.65rem]">
          Betweener
        </span>
      </span>
    </Link>
  );
}