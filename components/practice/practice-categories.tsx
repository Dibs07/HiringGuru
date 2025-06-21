'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Code, Mic, Play } from 'lucide-react';

export function PracticeCategories() {
  const categories = [
    {
      id: 'aptitude',
      title: 'Aptitude Practice',
      description: 'Logical reasoning, quantitative, and analytical thinking',
      icon: Brain,
      color: 'bg-purple-100 text-purple-600',
      exercises: [
        { name: 'Logical Reasoning', difficulty: 'Medium', duration: '15 min' },
        {
          name: 'Quantitative Aptitude',
          difficulty: 'Hard',
          duration: '20 min',
        },
        { name: 'Pattern Recognition', difficulty: 'Easy', duration: '10 min' },
      ],
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Verbal and written communication practice',
      icon: MessageSquare,
      color: 'bg-green-100 text-green-600',
      exercises: [
        {
          name: 'Audio Comprehension',
          difficulty: 'Medium',
          duration: '12 min',
        },
        { name: 'Verbal Response', difficulty: 'Medium', duration: '8 min' },
        {
          name: 'Reading Comprehension',
          difficulty: 'Easy',
          duration: '15 min',
        },
      ],
    },
    {
      id: 'coding',
      title: 'Coding Challenges',
      description: 'Programming problems and algorithm practice',
      icon: Code,
      color: 'bg-blue-100 text-blue-600',
      exercises: [
        { name: 'Array Problems', difficulty: 'Medium', duration: '30 min' },
        { name: 'String Manipulation', difficulty: 'Easy', duration: '20 min' },
        { name: 'Dynamic Programming', difficulty: 'Hard', duration: '45 min' },
      ],
    },
    {
      id: 'interview',
      title: 'Mock Interviews',
      description: 'Practice behavioral and technical interviews',
      icon: Mic,
      color: 'bg-orange-100 text-orange-600',
      exercises: [
        {
          name: 'Behavioral Questions',
          difficulty: 'Medium',
          duration: '25 min',
        },
        {
          name: 'Technical Discussion',
          difficulty: 'Hard',
          duration: '30 min',
        },
        { name: 'System Design', difficulty: 'Hard', duration: '40 min' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Practice Categories</h2>

      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle>{category.title}</CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {category.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium mb-2">{exercise.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          exercise.difficulty === 'Easy'
                            ? 'border-green-500 text-green-700'
                            : exercise.difficulty === 'Medium'
                              ? 'border-yellow-500 text-yellow-700'
                              : 'border-red-500 text-red-700'
                        }`}
                      >
                        {exercise.difficulty}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {exercise.duration}
                      </span>
                    </div>
                    <Button size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Practice
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
