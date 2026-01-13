
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/theme-store';
import { useThemeInit } from '@/hooks/use-theme-init';
import { Moon, Sun } from 'lucide-react';
import Logo from '../Logo/page';


export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  // Initialiser le thème
  useThemeInit();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href='/'>
            <Logo />
            </Link>
            
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <Link href="/auth">
              <Button 
                variant="ghost"
                className="font-medium text-sm sm:text-base px-3 sm:px-4 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Se connecter
              </Button>
            </Link>

            <Link href="/auth">
              <Button 
                className="bg- from-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-sm sm:text-base px-3 sm:px-4"
              >
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
