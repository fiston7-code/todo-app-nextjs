import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

export function useThemeInit() {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Détecter le thème système si aucun thème n'est sauvegardé
    const savedTheme = localStorage.getItem('theme-storage');
    
    if (!savedTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      setTheme(systemTheme);
    } else {
      // Appliquer le thème sauvegardé
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, setTheme]);
}