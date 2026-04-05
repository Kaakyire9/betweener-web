export type PaystackInitializePayload = {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback_url: string;
  metadata: Record<string, unknown>;
  channels?: string[];
};

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string; customer_code: string } | null;
    metadata?: Record<string, unknown>;
  };
};

export async function paystackInitialize(
  payload: PaystackInitializePayload,
  secretKey: string
) {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Paystack initialize failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as PaystackInitializeResponse;
  if (!data.status) {
    throw new Error(`Paystack initialize failed: ${data.message}`);
  }

  return data.data;
}

export async function paystackVerify(reference: string, secretKey: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Paystack verify failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as PaystackVerifyResponse;
  if (!data.status) {
    throw new Error(`Paystack verify failed: ${data.message}`);
  }

  return data.data;
}