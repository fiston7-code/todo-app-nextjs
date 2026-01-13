'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlanType } from '@/types/planTypes';
import { PLAN_LIMITS } from '@/lib/constants';

export interface PlanPermissions {
  plan: PlanType;
  canCreateProjects: boolean;
  maxProjects: number | null;
  canUseTags: boolean;
  canUseSubtasks: boolean;
  canUseReminders: boolean;
  canUseKanban: boolean;
  canUseCalendar: boolean;
  canCollaborate: boolean;
  canUseAutomations: boolean;
  canUseTemplates: boolean;
  canUseAdvancedFilters: boolean;
  canUseSavedViews: boolean;
  canUseAnalytics: boolean;
  maxExportRows: number | null;
  hasHistoryLimit: boolean;
  historyDays: number | null;
  loading: boolean;
}

const DEFAULT_PERMISSIONS: Record<PlanType, Omit<PlanPermissions, 'loading'>> = {
  free: {
    plan: 'free',
    canCreateProjects: true,
    maxProjects: PLAN_LIMITS.free.maxProjects,
    canUseTags: false,
    canUseSubtasks: false,
    canUseReminders: false,
    canUseKanban: false,
    canUseCalendar: false,
    canCollaborate: false,
    canUseAutomations: false,
    canUseTemplates: false,
    canUseAdvancedFilters: false,
    canUseSavedViews: false,
    canUseAnalytics: false,
    maxExportRows: PLAN_LIMITS.free.maxExportRows,
    hasHistoryLimit: true,
    historyDays: PLAN_LIMITS.free.historyDays,
  },
  pro: {
    plan: 'pro',
    canCreateProjects: true,
    maxProjects: null,
    canUseTags: true,
    canUseSubtasks: true,
    canUseReminders: true,
    canUseKanban: true,
    canUseCalendar: true,
    canCollaborate: false,
    canUseAutomations: false,
    canUseTemplates: true,
    canUseAdvancedFilters: true,
    canUseSavedViews: true,
    canUseAnalytics: true,
    maxExportRows: null,
    hasHistoryLimit: false,
    historyDays: null,
  },
  business: {
    plan: 'business',
    canCreateProjects: true,
    maxProjects: null,
    canUseTags: true,
    canUseSubtasks: true,
    canUseReminders: true,
    canUseKanban: true,
    canUseCalendar: true,
    canCollaborate: true,
    canUseAutomations: true,
    canUseTemplates: true,
    canUseAdvancedFilters: true,
    canUseSavedViews: true,
    canUseAnalytics: true,
    maxExportRows: null,
    hasHistoryLimit: false,
    historyDays: null,
  },
};

export const usePlanPermissions = () => {
  const [permissions, setPermissions] = useState<PlanPermissions>({
    ...DEFAULT_PERMISSIONS.free,
    loading: true,
  });

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setPermissions({ ...DEFAULT_PERMISSIONS.free, loading: false });
          return;
        }

        const { data: userPlan } = await supabase
          .from('user_plans')
          .select('plan, is_active')
          .eq('user_id', user.id)
          .single();

        const plan: PlanType = userPlan?.is_active ? userPlan.plan : 'free';
        
        setPermissions({
          ...DEFAULT_PERMISSIONS[plan],
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching plan:', error);
        setPermissions({ ...DEFAULT_PERMISSIONS.free, loading: false });
      }
    };

    fetchPlan();

    // Subscribe to plan changes
    const subscription = supabase
      .channel('user_plans_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_plans',
        },
        () => fetchPlan()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return permissions;
};