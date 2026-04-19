export type AdminOverview = {
  pending_verifications: number;
  rejected_unread: number;
  open_reports: number;
  active_subscriptions: number;
  silver_active: number;
  gold_active: number;
  members_total: number;
  members_last_7d: number;
};

export type VerificationRow = {
  id: string;
  user_id: string;
  profile_id: string;
  verification_type: string;
  status: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  auto_verification_score: number | null;
  auto_verification_data: Record<string, unknown> | null;
  document_url: string | null;
  full_name: string | null;
  current_country: string | null;
  avatar_url: string | null;
  verification_level: number | null;
  verification_refresh_required?: boolean | null;
  verification_refresh_reason?: string | null;
  verification_refresh_target_level?: number | null;
  verification_refresh_requested_at?: string | null;
  signed_document_url?: string | null;
};

export type ReportRow = {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_user_id: string;
  reported_user_id: string;
  reporter_name: string | null;
  reporter_avatar: string | null;
  reporter_verification_level: number | null;
  reported_name: string | null;
  reported_avatar: string | null;
  reported_verification_level: number | null;
  evidence_message_id?: string | null;
  evidence_message_text?: string | null;
  evidence_message_type?: string | null;
  evidence_message_sender_id?: string | null;
  evidence_message_created_at?: string | null;
  evidence?: Record<string, unknown> | null;
};

export type AdminDashboardPayload = {
  overview: AdminOverview;
  verifications: VerificationRow[];
  reports: ReportRow[];
};
