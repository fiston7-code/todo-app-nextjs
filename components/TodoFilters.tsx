'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TodoFiltersProps {
  currentFilter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export function TodoFilters({ currentFilter, onFilterChange }: TodoFiltersProps) {
  return (
    <Tabs value={currentFilter} onValueChange={(value) => onFilterChange(value as any)}>
      <TabsList className="grid w-full sm:w-auto grid-cols-3">
        <TabsTrigger value="all" className="text-xs sm:text-sm">
          <span className="hidden sm:inline mr-1">📋</span>
          Toutes
        </TabsTrigger>
        <TabsTrigger value="active" className="text-xs sm:text-sm">
          <span className="hidden sm:inline mr-1">⏳</span>
          Actives
        </TabsTrigger>
        <TabsTrigger value="completed" className="text-xs sm:text-sm">
          <span className="hidden sm:inline mr-1">✅</span>
          Terminées
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}