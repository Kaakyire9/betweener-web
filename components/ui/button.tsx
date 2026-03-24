import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--bet-radius-md)] text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(126,214,209,0.65)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-primary-hover))] px-5 py-3 text-[color:var(--text-inverse)] shadow-[var(--bet-glow-teal)] hover:brightness-105",
        secondary:
          "border border-[color:var(--border-soft)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-5 py-3 text-[color:var(--text-primary)] shadow-[var(--bet-shadow-soft)] hover:border-[color:var(--border-strong)] hover:bg-[rgba(255,255,255,0.06)]",
        ghost: "px-0 py-0 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]"
      },
      size: {
        default: "h-11",
        lg: "h-12 px-6 text-sm",
        sm: "h-9 px-4 font-support text-[11px] uppercase tracking-[0.18em]"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };