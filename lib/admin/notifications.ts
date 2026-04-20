import { createAdminClient } from "@/lib/supabase/clients";

type AdminSystemMessageInput = {
  userId: string | null | undefined;
  eventType: string;
  text: string;
  metadata?: Record<string, unknown>;
  peerUserId?: string | null;
};

export async function insertAdminSystemMessage({
  userId,
  peerUserId,
  eventType,
  text,
  metadata = {}
}: AdminSystemMessageInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!userId) {
    return { ok: false, error: "Missing notification recipient" };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("system_messages").insert({
    user_id: userId,
    peer_user_id: peerUserId || userId,
    event_type: eventType,
    text,
    metadata: {
      source: "web_admin",
      ...metadata
    }
  });

  if (error) {
    console.error("[admin-notification] system message insert failed", {
      eventType,
      userId,
      message: error.message
    });
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
