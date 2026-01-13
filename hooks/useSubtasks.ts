
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Subtask } from '@/types/planTypes';
import { usePlanPermissions } from './usePlanPermissions';

export const useSubtasks = (todoId: string) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const permissions = usePlanPermissions();

  const fetchSubtasks = async () => {
    if (!todoId) {
      setSubtasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('todo_id', todoId)
        .order('order_index');

      if (error) throw error;
      setSubtasks(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des sous-tâches');
    } finally {
      setLoading(false);
    }
  };

  const createSubtask = async (title: string) => {
    try {
      if (!permissions.canUseSubtasks) {
        throw new Error('Les sous-tâches sont disponibles uniquement pour les plans Pro et Business');
      }

      const maxOrder = subtasks.length > 0
        ? Math.max(...subtasks.map(s => s.order_index))
        : -1;

      const { data, error } = await supabase
        .from('subtasks')
        .insert({
          todo_id: todoId,
          title,
          completed: false,
          order_index: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSubtasks(prev => [...prev, data]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la sous-tâche';
      setError(message);
      throw new Error(message);
    }
  };

  const toggleSubtask = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
      
      setSubtasks(prev =>
        prev.map(s => (s.id === id ? { ...s, completed } : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la sous-tâche');
      throw err;
    }
  };

  const deleteSubtask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubtasks(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la sous-tâche');
      throw err;
    }
  };

  useEffect(() => {
    fetchSubtasks();

    if (!todoId) return;

    const subscription = supabase
      .channel(`subtasks_${todoId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subtasks',
          filter: `todo_id=eq.${todoId}`,
        },
        () => fetchSubtasks()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [todoId]);

  return {
    subtasks,
    loading,
    error,
    createSubtask,
    toggleSubtask,
    deleteSubtask,
    refetch: fetchSubtasks,
    completedCount: subtasks.filter(s => s.completed).length,
    totalCount: subtasks.length,
  };
};
