import { Suspense } from "react";

import { BillingCheckoutClient } from "@/app/billing/checkout/checkout-client";

export default function BillingCheckoutPage() {
  return (
    <Suspense>
      <BillingCheckoutClient />
    </Suspense>
  );
}