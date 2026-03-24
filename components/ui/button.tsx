import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,rgba(230,198,156,0.95),rgba(178,137,92,0.92))] px-5 py-3 text-[#16120f] shadow-[0_16px_45px_rgba(204,163,112,0.25)] hover:brightness-105",
        secondary:
          "border border-white/12 bg-white/6 px-5 py-3 text-foreground hover:border-white/20 hover:bg-white/10",
        ghost: "px-0 py-0 text-muted-foreground hover:text-foreground"
      },
      size: {
        default: "h-11",
        lg: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-xs uppercase tracking-[0.22em]"
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