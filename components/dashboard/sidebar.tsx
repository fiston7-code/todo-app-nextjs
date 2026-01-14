'use client';
import { useState, useEffect } from 'react'; // Ajoutez ceci
import { supabase } from '@/lib/supabase'; // Vérifiez le chemin vers votre client
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  X,
  Briefcase,
  Home,
  ShoppingBag,
  Heart,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getUserPlan } from '@/lib/supabaseHelpers';
import { PlanType } from '@/types/planTypes';


const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendrier', href: '/dashboard/calendar', icon: Calendar, proOnly: true },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings, proOnly: true },
];

const categories = [
  { name: 'Travail', icon: Briefcase, color: 'bg-blue-500', count: 12 },
  { name: 'Personnel', icon: Home, color: 'bg-green-500', count: 8 },
  { name: 'Courses', icon: ShoppingBag, color: 'bg-orange-500', count: 5 },
  { name: 'Santé', icon: Heart, color: 'bg-red-500', count: 3 },
  { name: 'Urgent', icon: Zap, color: 'bg-yellow-500', count: 7 },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanType>('free');






  useEffect(() => {
  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const name =
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Utilisateur';

    setUserName(name);

    const userPlan = await getUserPlan(user.id);
    setPlan(userPlan);
  };

  loadUser();
}, []);


  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Mosala</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Navigation principale */}
            {/* <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div> */}

            {navigation.map((item) => {
  const Icon = item.icon;
  const isActive = pathname === item.href;
  const isLocked = item.proOnly && plan === 'free';

  return (
    <div key={item.name} className="relative">
      <Link
        href={isLocked ? '#' : item.href}
        onClick={(e) => {
          if (isLocked) e.preventDefault();
        }}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
          isActive && !isLocked
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            : 'text-gray-700 dark:text-gray-300',
          isLocked &&
            'opacity-50 cursor-not-allowed hover:bg-transparent'
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{item.name}</span>

        {isLocked && (
          <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
            PRO
          </span>
        )}
      </Link>
    </div>
  );
})}


            {/* Catégories */}
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            category.color
                          )}
                        />
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User section (bottom) */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userName ? userName[0].toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {/* 4. REMPLACER "Utilisateur" par la variable ci-dessous */}
              {userName|| 'Chargement...'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Version gratuite
            </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo + Close button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Mosala</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>

          {/* Navigation (même contenu que desktop) */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Navigation principale */}
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Catégories */}
            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            category.color
                          )}
                        />
                        <Icon className="w-4 h-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {userName ? userName[0].toUpperCase() : 'U'}
               </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName || 'Chargement...'} {/* Remplacez 'Utilisateur' par ceci */}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Version gratuit</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}