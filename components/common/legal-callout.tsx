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
    <Card className={cn("border-amber-300/20 bg-[rgba(173,130,73,0.08)]", className)}>
      <CardContent className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-200">{title}</p>
        <div className="text-sm leading-7 text-amber-50/88">{children}</div>
      </CardContent>
    </Card>
  );
}