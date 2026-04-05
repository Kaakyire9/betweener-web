import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/get-access-token";
import { createUserClient } from "@/lib/supabase/clients";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = createUserClient(accessToken);
  const { data, error } = await client.rpc("rpc_get_my_premium_state");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ premium_state: data });
}