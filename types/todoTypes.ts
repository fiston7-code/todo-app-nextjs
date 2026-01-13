export type Priority = 'high' | 'medium' | 'low';
export type TodoStatus = 'todo' | 'in_progress' | 'done';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
  // Nouveaux champs pour les fonctionnalités premium
  description?: string;
  priority?: Priority;
  status?: TodoStatus;
  due_date?: string;
  project_id?: string;
  order_index?: number;
  updated_at?: string;
}

// Type pour créer un nouveau todo
export interface CreateTodoInput {
  title: string;
  user_id: string;
  description?: string;
  priority?: Priority;
  status?: TodoStatus;
  due_date?: string;
  project_id?: string;
}

// Type pour mettre à jour un todo
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  description?: string;
  priority?: Priority;
  status?: TodoStatus;
  due_date?: string;
  project_id?: string;
  order_index?: number;
}