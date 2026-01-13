import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const statsData = [
    {
      title: 'Tâches totales',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Toutes vos tâches',
    },
    {
      title: 'En cours',
      value: stats.active,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'À compléter',
    },
    {
      title: 'Terminées',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: `${completionRate}% de réussite`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}