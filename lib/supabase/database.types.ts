// Generated-compatible application database surface. Regenerate from a running
// local Supabase stack after every migration before deploying schema changes.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type AppRole = "contributor" | "media_team" | "approver" | "admin";
export type WorkflowStatus = "idea" | "developing" | "draft" | "review" | "approved" | "ready_to_share" | "archived";
export type ShareEventType = "view" | "caption_copy" | "media_download" | "share";
type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = { Row: Row; Insert: Insert; Update: Update; Relationships: [] };
type Entity = { id: string; created_at: string; updated_at: string };
export type Database = { public: { Tables: {
  organizations: Table<Entity & { name: string; slug: string }>;
  campaigns: Table<Entity & { organization_id: string; name: string; location: string; starts_on: string; ends_on: string | null; message: string; selling_points: string[]; ai_guidance: string; is_active: boolean; created_by: string | null }>;
  campaign_themes: Table<Entity & { campaign_id: string; parent_id: string | null; name: string; description: string; sort_order: number; created_by: string | null }>;
  ideas: Table<Entity & { campaign_id: string; theme_id: string | null; title: string; description: string; notes: string; status: WorkflowStatus; owner_id: string | null; created_by: string }>;
  content_packages: Table<Entity & { idea_id: string; title: string; description: string; created_by: string }>;
  content_items: Table<Entity & { package_id: string; content_type_id: number; theme_id: string | null; title: string; body: string; caption: string; call_to_action: string; status: WorkflowStatus; created_by: string; approved_by: string | null; approved_at: string | null; ready_at: string | null; archived_at: string | null }>;
  media_assets: Table<{ id: string; content_item_id: string; storage_path: string; file_name: string; media_type: "image" | "video" | "thumbnail"; mime_type: string; width: number | null; height: number | null; duration_seconds: number | null; size_bytes: number; alt_text: string; uploaded_by: string; created_at: string }>;
  review_comments: Table<Entity & { content_item_id: string; body: string; created_by: string }>;
  status_history: Table<{ id: string; idea_id: string | null; content_item_id: string | null; from_status: WorkflowStatus | null; to_status: WorkflowStatus; note: string; changed_by: string; created_at: string }>;
  share_events: Table<{ id: string; content_item_id: string; event_type: ShareEventType; platform_id: number | null; session_hash: string | null; user_agent_family: string | null; created_at: string }>;
}; Views: Record<string, never>; Functions: Record<string, never>; Enums: { app_role: AppRole; workflow_status: WorkflowStatus; share_event_type: ShareEventType }; CompositeTypes: Record<string, never> } };
