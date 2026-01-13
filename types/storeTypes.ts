import { Todo } from './todoTypes';

// Interface pour le TodoStore
export interface TodoStore {
  // État
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  // Actions CRUD
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, userId: string) => Promise<void>;
  updateTodo: (id: string, updates: { title?: string; completed?: boolean }) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  
  // Computed properties (sélecteurs)
  activeTodos: () => Todo[];
  completedTodos: () => Todo[];
  
  // Utilitaires
  clearError: () => void;
}