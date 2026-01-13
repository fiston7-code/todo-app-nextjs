
import { supabase } from './supabase';
import { PlanType } from '@/types/planTypes';

export const getUserPlan = async (userId: string): Promise<PlanType> => {
  try {
    const { data, error } = await supabase
      .from('user_plans')
      .select('plan, is_active')
      .eq('user_id', userId)
      .single();

    if (error || !data || !data.is_active) {
      return 'free';
    }

    return data.plan as PlanType;
  } catch {
    return 'free';
  }
};

export const checkPlanLimit = async (
  userId: string,
  limitType: 'projects' | 'export'
): Promise<{ allowed: boolean; message?: string; current?: number; max?: number }> => {
  try {
    const plan = await getUserPlan(userId);

    if (plan === 'pro' || plan === 'business') {
      return { allowed: true };
    }

    if (limitType === 'projects') {
      const { count } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const maxProjects = 3;
      
      if (count !== null && count >= maxProjects) {
        return {
          allowed: false,
          message: `Limite de ${maxProjects} projets atteinte. Passez au plan Pro pour des projets illimités.`,
          current: count,
          max: maxProjects,
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking plan limit:', error);
    return { allowed: false, message: 'Erreur lors de la vérification des limites' };
  }
};

export const logActivity = async (
  userId: string,
  action: string,
  details: Record<string, any>,
  todoId?: string,
  projectId?: string
) => {
  try {
    await supabase.from('activity_logs').insert({
      user_id: userId,
      todo_id: todoId,
      project_id: projectId,
      action,
      details,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};
