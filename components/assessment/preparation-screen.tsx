'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  ExternalLink,
  Clock,
  Target,
  ArrowRight,
} from 'lucide-react';

interface PreparationScreenProps {
  roundType: string;
  roundName: string;
  duration: number;
  onSkip: () => void;
  onContinue: () => void;
}

export function PreparationScreen({
  roundType,
  roundName,
  duration,
  onSkip,
  onContinue,
}: PreparationScreenProps) {
  const [preparationTime, setPreparationTime] = useState(0);

  const getPreparationResources = (type: string) => {
    const resources = {
      SCREENING: [
        {
          title: 'Resume Writing Guide',
          description: 'Learn how to craft an effective resume',
          url: 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume',
          type: 'Article',
        },
        {
          title: 'Interview Preparation Tips',
          description: 'Essential tips for interview success',
          url: 'https://www.glassdoor.com/blog/common-interview-questions/',
          type: 'Guide',
        },
      ],
      APTITUDE: [
        {
          title: 'Logical Reasoning Practice',
          description: 'Practice logical reasoning questions',
          url: 'https://www.indiabix.com/logical-reasoning/',
          type: 'Practice',
        },
        {
          title: 'Quantitative Aptitude',
          description: 'Math and quantitative reasoning',
          url: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/',
          type: 'Tutorial',
        },
      ],
      COMMUNICATION: [
        {
          title: 'Effective Communication Skills',
          description: 'Improve your communication abilities',
          url: 'https://www.coursera.org/learn/communication-skills',
          type: 'Course',
        },
        {
          title: 'Public Speaking Tips',
          description: 'Build confidence in speaking',
          url: 'https://www.toastmasters.org/resources/public-speaking-tips',
          type: 'Resource',
        },
      ],
      CODING: [
        {
          title: 'LeetCode Practice',
          description: 'Coding interview preparation',
          url: 'https://leetcode.com/',
          type: 'Platform',
        },
        {
          title: 'HackerRank',
          description: 'Programming challenges and contests',
          url: 'https://www.hackerrank.com/',
          type: 'Platform',
        },
        {
          title: 'GeeksforGeeks',
          description: 'Data structures and algorithms',
          url: 'https://www.geeksforgeeks.org/',
          type: 'Tutorial',
        },
      ],
      TECHNICAL: [
        {
          title: 'System Design Primer',
          description: 'Learn system design concepts',
          url: 'https://github.com/donnemartin/system-design-primer',
          type: 'Guide',
        },
        {
          title: 'Technical Interview Handbook',
          description: 'Comprehensive technical interview guide',
          url: 'https://www.techinterviewhandbook.org/',
          type: 'Handbook',
        },
      ],
      BEHAVIORAL: [
        {
          title: 'STAR Method Guide',
          description: 'Structure your behavioral responses',
          url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique',
          type: 'Method',
        },
        {
          title: 'Common Behavioral Questions',
          description: 'Practice common behavioral interview questions',
          url: 'https://www.glassdoor.com/blog/behavioral-interview-questions/',
          type: 'Practice',
        },
      ],
      SYSTEM_DESIGN: [
        {
          title: 'High Scalability',
          description: 'System design case studies',
          url: 'http://highscalability.com/',
          type: 'Blog',
        },
        {
          title: 'System Design Interview',
          description: 'System design interview preparation',
          url: 'https://www.educative.io/courses/grokking-the-system-design-interview',
          type: 'Course',
        },
      ],
    };

    return resources[type as keyof typeof resources] || [];
  };

  const resources = getPreparationResources(roundType);

  const handleStartPreparation = () => {
    setPreparationTime(Date.now());
  };

  const handleContinueToRound = () => {
    if (preparationTime > 0) {
      const timeSpent = Math.floor((Date.now() - preparationTime) / 1000);
      console.log(`Preparation time: ${timeSpent} seconds`);
    }
    onContinue();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            Prepare for {roundName} Round
          </CardTitle>
          <p className="text-gray-600">
            Take some time to prepare before starting the{' '}
            {roundName.toLowerCase()} round
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Round Info */}
          <div className="flex items-center justify-center gap-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{duration} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {roundType.replace('_', ' ')} Round
              </span>
            </div>
          </div>

          {/* Preparation Resources */}
          {resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Preparation Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{resource.title}</h4>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {resource.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Resource
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="outline" onClick={onSkip} className="flex-1">
              Skip Preparation
            </Button>
            {preparationTime === 0 ? (
              <Button onClick={handleStartPreparation} className="flex-1">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Preparation
              </Button>
            ) : (
              <Button onClick={handleContinueToRound} className="flex-1">
                Continue to Round
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-500">
            You can take as much time as you need to prepare. The round timer
            will start only when you begin the actual assessment.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
