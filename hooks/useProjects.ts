
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types/planTypes';
import { usePlanPermissions } from './usePlanPermissions';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const permissions = usePlanPermissions();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Check plan limits
      if (permissions.maxProjects !== null && projects.length >= permissions.maxProjects) {
        throw new Error(`Limite de ${permissions.maxProjects} projets atteinte. Passez au plan Pro pour des projets illimités.`);
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          description,
          color,
          icon,
        })
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création du projet';
      setError(message);
      throw new Error(message);
    }
  };

  const updateProject = async (
    id: string,
    updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
  ) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updates } : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du projet');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du projet');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();

    const subscription = supabase
      .channel('projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => fetchProjects()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
};
