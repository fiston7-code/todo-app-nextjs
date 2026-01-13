// Types liés aux todos
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

// Type pour créer un nouveau todo
export interface CreateTodoInput {
  title: string;
  user_id: string;
}

// Type pour mettre à jour un todo
export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}