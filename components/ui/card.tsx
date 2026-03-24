import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[var(--bet-radius-lg)] border border-[color:var(--border-soft)] bg-[linear-gradient(180deg,var(--surface-card-top),var(--surface-card-bottom))] shadow-[var(--bet-shadow-soft)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 md:p-8", className)} {...props} />
);
CardContent.displayName = "CardContent";

export { Card, CardContent };