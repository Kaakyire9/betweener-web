"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionShell } from "@/components/common/section-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

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

type AuthState = "loading" | "authed" | "unauth";

export default function BillingPage() {
  const [authState, setAuthState] = useState<AuthState>("loading");

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/billing/me");
        if (!isMounted) return;
        if (res.status === 401) {
          setAuthState("unauth");
          return;
        }
        setAuthState(res.ok ? "authed" : "unauth");
      } catch {
        if (isMounted) setAuthState("unauth");
      }
    };
    void checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === "loading") {
    return (
      <main>
        <SectionShell className="mx-auto max-w-2xl px-6 py-20 text-center">
          <Badge>Web Membership</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground">Checking your access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Please wait while we confirm your Betweener session.
          </p>
        </SectionShell>
      </main>
    );
  }

  if (authState === "unauth") {
    return (
      <main>
        <SectionShell className="mx-auto max-w-2xl px-6 py-20 text-center">
          <Badge>Sign in required</Badge>
          <h1 className="mt-4 font-display text-3xl text-foreground">Open Betweener to continue</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Web membership checkout requires a signed-in Betweener account so we can assign your plan.
          </p>
          <div className="mt-6">
            <Button variant="primary" asChild>
              <a href={siteConfig.deepLinks.universal}>Open Betweener</a>
            </Button>
          </div>
        </SectionShell>
      </main>
    );
  }

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