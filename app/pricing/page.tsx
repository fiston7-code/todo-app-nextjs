'use client';

import { useEffect, useState } from 'react';
import { PricingPlans } from '@/components/PricingPlans';
import { supabase } from '@/lib/supabase';
import { PlanType } from '@/types/planTypes';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data } = await supabase
        .from('user_plans')
        .select('plan, is_active')
        .eq('user_id', user.id)
        .single();

      if (data?.is_active) {
        setCurrentPlan(data.plan as PlanType);
      }
      
      setLoading(false);
    };

    fetchUserPlan();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PricingPlans currentPlan={currentPlan} />
    </div>
  );
}