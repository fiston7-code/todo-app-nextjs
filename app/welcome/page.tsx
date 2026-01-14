'use client';

import { useEffect, useState } from 'react';
import { PricingPlans } from '@/components/PricingPlans';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import PricingPage from '../pricing/page';

export default function WelcomePage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .single();

      if (data?.name) {
        setUsername(data.name);
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleContinueWithFree = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="pt-12 pb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 mb-6 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenue {username} ! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2 max-w-2xl mx-auto px-4">
          Votre compte a été créé avec succès
        </p>
        
        <p className="text-lg text-gray-500 dark:text-gray-500 mb-8 max-w-2xl mx-auto px-4">
          Choisissez le plan qui vous convient pour commencer
        </p>

        {/* Quick Action */}
        <button
          onClick={handleContinueWithFree}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all text-gray-700 dark:text-gray-300 font-medium shadow-sm"
        >
          <span>Continuer avec le plan gratuit</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pricing Section */}
   <PricingPage/>

      {/* Skip Button */}
      <div className="text-center pb-12">
        <button
          onClick={handleContinueWithFree}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
        >
          Je choisirai plus tard
        </button>
      </div>
    </div>
  );
}