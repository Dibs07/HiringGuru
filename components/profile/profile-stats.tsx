import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Clock, TrendingUp, Award } from 'lucide-react';

export function ProfileStats() {
  const stats = [
    {
      title: 'Assessments Completed',
      value: '24',
      change: '+3 this month',
      icon: Target,
      color: 'text-blue-600',
    },
    {
      title: 'Average Score',
      value: '87%',
      change: '+5% improvement',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Practice Hours',
      value: '156',
      change: '+12 this week',
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+8% this month',
      icon: Award,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 font-medium">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
