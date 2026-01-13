
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Sparkles, Zap, Shield, ArrowRight} from 'lucide-react';
 import { Button } from '@/components/ui/button';


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </main>
    );
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Simple & Intuitif',
      description: 'Interface épurée pour une productivité maximale. Ajoutez des tâches en un clic.',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Temps Réel',
      description: 'Synchronisation instantanée. Vos données accessibles partout, tout le temps.',
      color: 'purple',
    },
    {
      icon: Shield,
      title: '100% Sécurisé',
      description: 'Authentification robuste et données chiffrées. Votre vie privée protégée.',
      color: 'green',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      
     

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 md:py-20 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium mb-6 sm:mb-8 hover:scale-105 transition-transform cursor-default">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex shrink-0" />
            <span className="whitespace-nowrap">Nouveau : Version 2.0 disponible</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
            Organisez votre vie,{' '}
            <span className="block sm:inline text-blue-600 dark:text-blue-400">
              simplement
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            L'outil de gestion de tâches pensé pour les professionnels et les étudiants.
            <br className="hidden sm:block" />
            <span className="text-gray-500 dark:text-gray-500 text-sm sm:text-base md:text-lg block mt-2 sm:inline sm:mt-0">
              Ne ratez plus jamais une deadline.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              onClick={() => router.push('/auth')}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all group w-full sm:w-auto"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/auth')}
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
            >
              Voir la démo
            </Button>
          </div>

          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-4">
            ✨ Gratuit pour toujours · Aucune carte bancaire requise
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20 md:mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
              green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            };

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 
                  border-2 border-gray-100 dark:border-gray-700
                  transition-all duration-300 cursor-default
                  ${hoveredCard === index ? 'shadow-2xl sm:scale-105 border-blue-200 dark:border-blue-800' : 'shadow-md'}
                `}
              >
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6
                  ${colorClasses[feature.color as keyof typeof colorClasses]}
                  ${hoveredCard === index ? 'scale-110' : ''}
                  transition-transform duration-300
                `}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-white text-center mb-16 sm:mb-20 md:mb-24 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">10K+</div>
              <div className="text-sm sm:text-base text-blue-100">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-sm sm:text-base text-blue-100">Tâches complétées</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-sm sm:text-base text-blue-100">Disponibilité</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Prêt à booster votre productivité ? 🚀
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-4 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont transformé leur façon de travailler.
          </p>
          <Button 
            size="lg"
            onClick={() => router.push('/auth')}
            className="text-base sm:text-lg px-8 sm:px-12 py-5 sm:py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-md sm:max-w-none"
          >
            Créer mon compte gratuitement
          </Button>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Configuration en moins de 2 minutes ⏱️
          </p>
        </div>
      </div>

      
    </main>
  );
}
