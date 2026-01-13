'use client';

import { useTodosCount } from '@/store/selectors/todoSelectors';
import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

export function TodoStats() {
  const { total, active, completed } = useTodosCount();

  const stats = [
    { 
      label: 'Total', 
      value: total, 
      variant: 'default' as const,
      icon: '📊',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      label: 'Actives', 
      value: active, 
      variant: 'secondary' as const,
      icon: '⏳',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    { 
      label: 'Terminées', 
      value: completed, 
      variant: 'outline' as const,
      icon: '✅',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`${stat.color} transition-transform hover:scale-105`}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <p className="text-xs sm:text-sm font-medium truncate">
                {stat.label}
              </p>
              <span className="text-lg sm:text-xl">{stat.icon}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}