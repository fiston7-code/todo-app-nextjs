'use client';

import { useAllTodos, useActiveTodos, useCompletedTodos } from '@/store/selectors/todoSelectors';
import { TodoItem } from './TodoItem';
import { FileX } from 'lucide-react';

interface TodoListProps {
  filter: 'all' | 'active' | 'completed';
}

export function TodoList({ filter }: TodoListProps) {
  const allTodos = useAllTodos();
  const activeTodos = useActiveTodos();
  const completedTodos = useCompletedTodos();

  const todos = filter === 'all' ? allTodos : filter === 'active' ? activeTodos : completedTodos;

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <FileX className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base text-gray-600">
          {filter === 'all' && 'Aucune tâche. Créez-en une !'}
          {filter === 'active' && 'Aucune tâche active.'}
          {filter === 'completed' && 'Aucune tâche terminée.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}