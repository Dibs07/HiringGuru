'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '../timer';
import { Progress } from '@/components/ui/progress';

interface TechnicalRoundProps {
  onComplete: (result: any) => void;
  duration: number;
}

// Mock technical questions
const mockQuestions = [
  {
    id: 1,
    question:
      'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
    type: 'technical',
    timeLimit: 300, // 5 minutes
  },
  {
    id: 2,
    question:
      'How would you optimize a slow database query? Walk me through your debugging process.',
    type: 'technical',
    timeLimit: 300,
  },
  {
    id: 3,
    question:
      'Describe how you would implement caching in a web application. What are the trade-offs?',
    type: 'technical',
    timeLimit: 300,
  },
];

export function TechnicalRound({ onComplete, duration }: TechnicalRoundProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Mock score 60-100
    const result = {
      score,
      totalQuestions: mockQuestions.length,
      answeredQuestions: Object.keys(answers).length,
      qualified: score >= 70,
      feedback:
        score >= 80
          ? 'Excellent technical knowledge!'
          : score >= 70
            ? 'Good technical understanding.'
            : 'Needs improvement in technical concepts.',
      timeSpent: duration * 60 - timeRemaining,
    };
    onComplete(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Technical Interview</CardTitle>
            <Timer
              initialTime={timeRemaining}
              onTimeUp={handleComplete}
              onTimeUpdate={setTimeRemaining}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {mockQuestions.length}
              </span>
              <span>
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, '0')} remaining
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <Textarea
              placeholder="Provide a detailed technical explanation..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentQuestionIndex === mockQuestions.length - 1
                ? 'Complete Round'
                : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
