
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag } from '@/types/planTypes';
import { usePlanPermissions } from './usePlanPermissions';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const permissions = usePlanPermissions();

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setTags([]);
        return;
      }

      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setTags(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string, color: string) => {
    try {
      if (!permissions.canUseTags) {
        throw new Error('Les tags sont disponibles uniquement pour les plans Pro et Business');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('tags')
        .insert({
          user_id: user.id,
          name,
          color,
        })
        .select()
        .single();

      if (error) throw error;
      
      setTags(prev => [...prev, data]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création du tag';
      setError(message);
      throw new Error(message);
    }
  };

  const updateTag = async (id: string, updates: { name?: string; color?: string }) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setTags(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du tag');
      throw err;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTags(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du tag');
      throw err;
    }
  };

  useEffect(() => {
    fetchTags();

    const subscription = supabase
      .channel('tags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags',
        },
        () => fetchTags()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
};