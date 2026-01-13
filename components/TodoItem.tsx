'use client';

import { useTodoActions } from '@/store/selectors/todoSelectors';
import type { Todo } from '@/types/todoTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoActions();

  return (
    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border">
      
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
        className="flex-shrink-0"
      />

      <span
        className={`
          flex-1 text-sm sm:text-base wrap-break-words
          ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}
        `}
      >
        {todo.title}
      </span>

      <Button
        variant="destructive"
        size="sm"
        onClick={() => deleteTodo(todo.id)}
        className="flex-shrink-0"
      >
        <Trash2 className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Supprimer</span>
      </Button>
    </div>
  );
}