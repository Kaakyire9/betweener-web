import { cookies, headers } from "next/headers";

export async function getAccessToken() {
  const authHeader = (await headers()).get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  const cookieStore = await cookies();
  const directToken = cookieStore.get("sb-access-token")?.value;
  if (directToken) return directToken;

  const authCookie = cookieStore.get("supabase-auth-token")?.value;
  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie);
      if (Array.isArray(parsed) && parsed[0]) {
        return parsed[0];
      }
    } catch {
      // Ignore malformed cookie
    }
  }

  return null;
}