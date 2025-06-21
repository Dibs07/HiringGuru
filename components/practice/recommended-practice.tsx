'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock } from 'lucide-react';

export function RecommendedPractice() {
  const recommendations = [
    {
      title: 'Improve Coding Speed',
      description: 'Based on your recent coding round performance',
      progress: 65,
      action: 'Practice Array Problems',
      priority: 'High',
    },
    {
      title: 'Communication Skills',
      description: 'Enhance verbal response clarity',
      progress: 80,
      action: 'Mock Interview Session',
      priority: 'Medium',
    },
    {
      title: 'Logical Reasoning',
      description: 'Strengthen pattern recognition',
      progress: 45,
      action: 'Aptitude Practice',
      priority: 'High',
    },
  ];

  const weeklyGoal = {
    target: 10,
    completed: 7,
    remaining: 3,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Practice Sessions</span>
              <span>
                {weeklyGoal.completed}/{weeklyGoal.target}
              </span>
            </div>
            <Progress
              value={(weeklyGoal.completed / weeklyGoal.target) * 100}
            />
            <p className="text-sm text-gray-600">
              {weeklyGoal.remaining} more sessions to reach your weekly goal!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                  <Badge
                    variant={
                      rec.priority === 'High' ? 'destructive' : 'secondary'
                    }
                  >
                    {rec.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{rec.progress}%</span>
                  </div>
                  <Progress value={rec.progress} />
                </div>

                <Button size="sm" variant="outline" className="w-full">
                  {rec.action}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              5-min Aptitude Quiz
            </Button>
            <Button variant="outline" className="w-full justify-start">
              10-min Coding Challenge
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Mock Interview Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
