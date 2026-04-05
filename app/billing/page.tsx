import Link from "next/link";

import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    type: "SILVER",
    description: "Boosts, advanced Vibes filters, notes, standard gifts, and date-plan initiation.",
    intervals: ["monthly", "quarterly"]
  },
  {
    type: "GOLD",
    description: "Signature gifts, concierge, elite positioning, and everything in Silver.",
    intervals: ["monthly", "quarterly"]
  }
] as const;

export default function BillingPage() {
  return (
    <main>
      <SectionShell className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mx-auto">Web Membership</Badge>
          <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
            Choose a fixed-term Betweener membership
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Paystack web checkout supports Ghana-friendly payment methods. This does not replace in-app
            purchases. Your membership activates after secure verification.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className="flex flex-col justify-between rounded-[28px] border border-[color:var(--border-soft)] bg-[color:var(--surface-1)] p-6"
            >
              <div>
                <h2 className="font-display text-3xl text-foreground">{plan.type}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {plan.intervals.map((interval) => (
                  <Link
                    key={interval}
                    href={`/billing/checkout?plan=${plan.type}&interval=${interval}`}
                    className="w-full"
                  >
                    <Button className="w-full" variant="primary">
                      Continue with {interval}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    </main>
  );
}