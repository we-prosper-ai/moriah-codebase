// ─── Teaching ───────────────────────────────────────────────

export interface Teaching {
  id: string;
  theme: string;
  title: string;
  core_teaching: string;
  key_insight?: string;
  quote?: string;
  action_steps?: string[];
  case_study?: CaseStudy;
  related_ids?: string[];
  course_module?: string;
  curriculum_ref?: string;
  currency_tags?: CurrencyTag[];
  source_file?: string;
  created_at: string;
  updated_at: string;
}

export type CurrencyTag = "money" | "time" | "energy" | "freedom";

export interface CaseStudy {
  client_name?: string;
  situation?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timeline?: string;
  results?: string;
}

// ─── User ────────────────────────────────────────────────────

export interface User {
  id: string;
  external_id?: string;
  name?: string;
  email?: string;
  plan: "free" | "monthly" | "annual";
  currencies_baseline?: CurrenciesBaseline;
  created_at: string;
  last_active_at?: string;
}

export interface CurrenciesBaseline {
  money: number;   // 1-10
  time: number;
  energy: number;
  freedom: number;
}

// ─── Coaching Session ────────────────────────────────────────

export type CoachingPhase = "probe" | "diagnose" | "advise" | "deepen";

export interface CoachingSession {
  id: string;
  user_id: string;
  phase: CoachingPhase;
  topic?: string;
  identified_fundamentals?: string[];
  turn_count: number;
  status: "active" | "completed" | "abandoned";
  started_at: string;
  ended_at?: string;
}

export interface SessionTurn {
  id: number;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  phase?: string;
  teaching_ids?: string[];
  tokens_used?: number;
  created_at: string;
}

// ─── User Progress ───────────────────────────────────────────

export interface UserProgress {
  id: number;
  user_id: string;
  module_id: string;
  lesson_id?: string;
  status: "not_started" | "in_progress" | "completed";
  score?: number;
  notes?: string;
  completed_at?: string;
  updated_at: string;
}

// ─── API Request/Response ────────────────────────────────────

export interface TeachingSyncPayload {
  source?: string;
  teachings: Partial<Teaching>[];
}

export interface StartSessionPayload {
  user_id: string;
  topic?: string;
  currencies_baseline?: CurrenciesBaseline;
}

export interface CoachRespondPayload {
  session_id: string;
  user_id: string;
  message: string;
}

export interface CoachResponse {
  session_id: string;
  phase: CoachingPhase;
  response: string;
  turn_count: number;
  teaching_ids_used: string[];
}

export interface ProgressSummary {
  user_id: string;
  modules_completed: number;
  modules_total: number;
  sessions_count: number;
  topics_explored: number;
  currencies_baseline?: CurrenciesBaseline;
  module_breakdown: ModuleProgress[];
  recent_sessions: Partial<CoachingSession>[];
}

export interface ModuleProgress {
  module_id: string;
  module_name: string;
  status: "not_started" | "in_progress" | "completed";
  lessons_completed: number;
  lessons_total: number;
}

export interface Recommendation {
  teaching_id: string;
  title: string;
  theme: string;
  reason: string;
  priority: "high" | "medium" | "low";
  currency_focus: CurrencyTag[];
}
