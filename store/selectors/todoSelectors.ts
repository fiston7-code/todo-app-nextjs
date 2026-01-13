// store/selectors/todoSelectors.ts
import { useTodoStore } from '../todoStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook pour récupérer tous les todos
 */
export const useAllTodos = () => {
  return useTodoStore((state) => state.todos);
};

/**
 * Hook pour récupérer les todos actifs
 */
export const useActiveTodos = () => {
  return useTodoStore(
    useShallow((state) => state.todos.filter((todo) => !todo.completed))
  );
};

/**
 * Hook pour récupérer les todos complétés
 */
export const useCompletedTodos = () => {
  return useTodoStore(
    useShallow((state) => state.todos.filter((todo) => todo.completed))
  );
};

/**
 * Hook pour récupérer les compteurs
 * ✅ useShallow empêche les re-renders inutiles
 */
export const useTodosCount = () => {
  return useTodoStore(
    useShallow((state) => {
      const activeTodos = state.todos.filter((todo) => !todo.completed);
      const completedTodos = state.todos.filter((todo) => todo.completed);
      
      return {
        total: state.todos.length,
        active: activeTodos.length,
        completed: completedTodos.length,
      };
    })
  );
};

/**
 * Hook pour récupérer l'état de chargement
 * ✅ useShallow pour l'objet
 */
export const useTodosLoading = () => {
  return useTodoStore(
    useShallow((state) => ({
      loading: state.loading,
      error: state.error,
    }))
  );
};

/**
 * Hook pour récupérer les actions uniquement
 * ✅ useShallow pour les fonctions
 */
export const useTodoActions = () => {
  return useTodoStore(
    useShallow((state) => ({
      fetchTodos: state.fetchTodos,
      addTodo: state.addTodo,
      toggleTodo: state.toggleTodo,
      deleteTodo: state.deleteTodo,
    }))
  );
};