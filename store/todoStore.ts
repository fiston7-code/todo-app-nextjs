// store/todoStore.ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Todo } from '@/types/todoTypes';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  
  fetchTodos: (userId: string) => Promise<void>; // ✅ Ajout du paramètre
  addTodo: (title: string, userId: string) => Promise<void>;
  toggleTodo: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async (userId: string) => { // ✅ Ajout du paramètre
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId) // ✅ Filtre par user_id
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ todos: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addTodo: async (title: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert({ title, user_id: userId, completed: false })
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ todos: [data, ...state.todos] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleTodo: async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !currentStatus } : todo
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));