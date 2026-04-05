"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export default function BillingProcessingPage() {
  const [status, setStatus] = useState<"pending" | "verified" | "failed">("pending");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      try {
        const response = await fetch("/api/billing/me");
        if (response.ok) {
          const data = await response.json();
          if (data?.premium_state?.type && data?.premium_state?.type !== "FREE") {
            setStatus("verified");
            return;
          }
        }
      } catch {
        // ignore
      }

      timer = setTimeout(poll, 2500);
    };

    poll();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <Badge>Processing</Badge>
      <h1 className="mt-4 font-display text-4xl text-foreground">
        {status === "verified" ? "Membership confirmed" : "Finalizing your membership"}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {status === "verified"
          ? "Your web purchase is now active. You can return to the app."
          : "We are waiting for Paystack to confirm your payment. This usually takes a few seconds."}
      </p>

      {status === "verified" ? (
        <div className="mt-6 w-full">
          <Button className="w-full" variant="primary" asChild>
            <a href={siteConfig.deepLinks.universal}>Open Betweener</a>
          </Button>
        </div>
      ) : null}

      {status === "failed" ? (
        <p className="mt-4 text-sm text-red-300">We could not confirm your payment yet.</p>
      ) : null}
    </main>
  );
}