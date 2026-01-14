'use client';

import { useThemeInit } from '@/hooks/use-theme-init';

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useThemeInit();
  return <>{children}</>;
};