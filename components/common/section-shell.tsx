import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionShellVariants = cva("relative overflow-hidden", {
  variants: {
    tone: {
      default: "",
      elevated: "bg-[rgba(255,255,255,0.02)]",
      soft: "bg-[linear-gradient(180deg,rgba(23,49,44,0.30),rgba(7,19,17,0))]"
    },
    border: {
      none: "",
      top: "border-t border-[color:var(--border-soft)]",
      bottom: "border-b border-[color:var(--border-soft)]",
      y: "border-y border-[color:var(--border-soft)]"
    }
  },
  defaultVariants: {
    tone: "default",
    border: "none"
  }
});

export interface SectionShellProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionShellVariants> {}

export function SectionShell({ className, tone, border, ...props }: SectionShellProps) {
  return <section className={cn(sectionShellVariants({ tone, border }), className)} {...props} />;
}