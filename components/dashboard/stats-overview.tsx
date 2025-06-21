'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export function StatsOverview() {
  // Dummy analytics data - will be replaced with real data from API
  const stats = {
    totalAssessments: 0,
    completedAssessments: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    improvementRate: 0,
  };

  const achievements = [
    { name: 'First Assessment', completed: false, icon: Target },
    { name: 'Perfect Score', completed: false, icon: Award },
    { name: 'Week Streak', completed: false, icon: Calendar },
    { name: 'Speed Runner', completed: false, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Assessments
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAssessments}</div>
          <p className="text-xs text-muted-foreground">
            Start your first assessment!
          </p>
        </CardContent>
      </Card>

      {/* Completed Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedAssessments}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAssessments > 0
              ? `${Math.round((stats.completedAssessments / stats.totalAssessments) * 100)}% completion rate`
              : 'No assessments yet'}
          </p>
        </CardContent>
      </Card>

      {/* Average Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.improvementRate > 0
              ? `+${stats.improvementRate}% from last week`
              : 'Complete assessments to track'}
          </p>
        </CardContent>
      </Card>

      {/* Time Spent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.floor(stats.totalTimeSpent / 60)}h
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.currentStreak > 0
              ? `${stats.currentStreak} day streak`
              : 'Start practicing today!'}
          </p>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`flex flex-col items-center p-4 rounded-lg border ${
                  achievement.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <achievement.icon
                  className={`h-8 w-8 mb-2 ${achievement.completed ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span className="text-sm font-medium text-center">
                  {achievement.name}
                </span>
                <Badge
                  variant={achievement.completed ? 'default' : 'secondary'}
                  className="mt-1 text-xs"
                >
                  {achievement.completed ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
