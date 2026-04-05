export type PlanType = "SILVER" | "GOLD";
export type BillingInterval = "monthly" | "quarterly";

export type PlanPrice = {
  planType: PlanType;
  interval: BillingInterval;
  amountMinor: number;
  currency: "GHS";
  productId: string;
};

// TODO: Replace with live Ghana pricing before launch.
export const PLAN_PRICES: PlanPrice[] = [
  {
    planType: "SILVER",
    interval: "monthly",
    amountMinor: 5000,
    currency: "GHS",
    productId: "silver_monthly_ghs"
  },
  {
    planType: "SILVER",
    interval: "quarterly",
    amountMinor: 13500,
    currency: "GHS",
    productId: "silver_quarterly_ghs"
  },
  {
    planType: "GOLD",
    interval: "monthly",
    amountMinor: 9000,
    currency: "GHS",
    productId: "gold_monthly_ghs"
  },
  {
    planType: "GOLD",
    interval: "quarterly",
    amountMinor: 24000,
    currency: "GHS",
    productId: "gold_quarterly_ghs"
  }
];

export function getPlanPrice(planType: PlanType, interval: BillingInterval) {
  const match = PLAN_PRICES.find(
    (plan) => plan.planType === planType && plan.interval === interval
  );
  if (!match) {
    throw new Error(`Unsupported plan/interval: ${planType} ${interval}`);
  }
  return match;
}
