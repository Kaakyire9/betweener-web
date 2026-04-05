"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BillingCheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "SILVER";
  const interval = searchParams.get("interval") ?? "monthly";
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const label = useMemo(() => `${plan} ${interval}`, [plan, interval]);

  const handleCheckout = async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/billing/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan_type: plan,
          billing_interval: interval
        })
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error ?? "Unable to initialize payment");
      }

      const data = await response.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error");
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <Badge>Secure Checkout</Badge>
      <h1 className="mt-4 font-display text-4xl text-foreground">{label}</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        You will be redirected to Paystack to complete your fixed-term web membership purchase.
      </p>

      <div className="mt-8 w-full">
        <Button className="w-full" variant="primary" onClick={handleCheckout} disabled={status === "loading"}>
          {status === "loading" ? "Redirecting..." : "Continue to Paystack"}
        </Button>
        {status === "error" && errorMessage ? (
          <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
        ) : null}
      </div>
    </main>
  );
}