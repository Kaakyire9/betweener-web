import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--bet-radius-sm)] border px-3 py-1.5 font-support text-[11px] font-medium uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--border-soft)] bg-[rgba(255,255,255,0.03)] text-[color:var(--text-secondary)]",
        warm:
          "border-[color:var(--border-warm)] bg-[rgba(230,212,184,0.08)] text-[color:var(--accent-warm)]",
        trust:
          "border-[rgba(126,214,209,0.22)] bg-[rgba(17,197,198,0.08)] text-[color:var(--accent-soft)]",
        signal:
          "border-[rgba(167,139,250,0.22)] bg-[rgba(167,139,250,0.08)] text-[color:var(--signal-romance)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}