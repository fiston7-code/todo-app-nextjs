export type PlanType = 'free' | 'pro' | 'business';
export type ViewType = 'list' | 'kanban' | 'calendar';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface UserPlan {
  id: string;
  user_id: string;
  plan: PlanType;
  mobile_money_number?: string;
  mobile_money_provider?: string;
  subscription_start?: string;
  subscription_end?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  todo_id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_at: string;
}

export interface TodoTag {
  id: string;
  todo_id: string;
  tag_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  todo_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface SavedView {
  id: string;
  user_id: string;
  name: string;
  view_type: ViewType;
  filters: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
}

export interface TodoReminder {
  id: string;
  todo_id: string;
  remind_at: string;
  sent: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  todo_id?: string;
  project_id?: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface TeamMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}