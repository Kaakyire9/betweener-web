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
  reporter_profile_id?: string | null;
  reported_profile_id?: string | null;
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

export type DatePlanConciergeRow = {
  request_id: string;
  request_status: string;
  request_note: string | null;
  requested_at: string;
  requested_by_profile_id: string;
  requested_by_name: string | null;
  date_plan_id: string;
  date_plan_status: string;
  scheduled_for: string;
  place_name: string;
  place_address: string | null;
  city: string | null;
  creator_profile_id: string;
  creator_name: string | null;
  recipient_profile_id: string;
  recipient_name: string | null;
  concierge_requested_at: string | null;
};

export type AccountRecoveryRequestRow = {
  id: string;
  requester_user_id: string | null;
  requester_profile_id: string | null;
  requester_name: string | null;
  requester_avatar_url: string | null;
  status: string;
  current_sign_in_method: string | null;
  previous_sign_in_method: string | null;
  contact_email: string | null;
  previous_account_email: string | null;
  note: string | null;
  evidence: Record<string, unknown> | null;
  linked_merge_case_id: string | null;
  reviewed_by: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string | null;
};

export type AccountMergeCaseRow = {
  id: string;
  status: string;
  request_channel: string;
  candidate_reason: string | null;
  source_user_id: string;
  source_profile_id: string | null;
  source_name: string | null;
  source_avatar_url: string | null;
  target_user_id: string;
  target_profile_id: string | null;
  target_name: string | null;
  target_avatar_url: string | null;
  requester_user_id: string | null;
  created_by: string | null;
  reviewed_by: string | null;
  executed_by: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  executed_at: string | null;
  resolved_at: string | null;
  preflight_summary: Record<string, unknown> | null;
  execution_summary: Record<string, unknown> | null;
  evidence: Record<string, unknown> | null;
  notes: string | null;
};

export type AdminDashboardPayload = {
  overview: AdminOverview;
  verifications: VerificationRow[];
  reports: ReportRow[];
  conciergeRequests: DatePlanConciergeRow[];
  recoveryRequests: AccountRecoveryRequestRow[];
  mergeCases: AccountMergeCaseRow[];
  moduleWarnings: string[];
};
