import * as React from "react";

import { cn } from "@/lib/utils";

const inputBase =
  "flex h-12 w-full rounded-[var(--bet-radius-md)] border border-[color:var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-3 text-sm text-[color:var(--text-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition placeholder:text-[color:var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(126,214,209,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return <input type={type} className={cn(inputBase, className)} ref={ref} {...props} />;
  }
);
Input.displayName = "Input";

export { Input };