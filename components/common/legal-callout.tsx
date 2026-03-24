import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LegalCalloutProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function LegalCallout({
  title = "Legal Review Required",
  children,
  className
}: LegalCalloutProps) {
  return (
    <Card
      className={cn(
        "border-[color:var(--border-warm)] bg-[linear-gradient(180deg,rgba(230,212,184,0.08),rgba(18,38,34,0.96))] shadow-[var(--bet-glow-warm)]",
        className
      )}
    >
      <CardContent className="space-y-3">
        <p className="betweener-eyebrow text-[color:var(--accent-warm)]">{title}</p>
        <div className="text-sm leading-7 text-[color:var(--text-secondary)]">{children}</div>
      </CardContent>
    </Card>
  );
}