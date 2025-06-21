'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '../timer';
import { Progress } from '@/components/ui/progress';

interface SystemDesignRoundProps {
  onComplete: (result: any) => void;
  duration: number;
}

// Mock system design questions
const mockQuestions = [
  {
    id: 1,
    question:
      'Design a URL shortening service like bit.ly. Consider scalability, reliability, and performance.',
    type: 'system_design',
    timeLimit: 900, // 15 minutes
  },
  {
    id: 2,
    question:
      'Design a chat application like WhatsApp. Focus on real-time messaging, user presence, and message delivery.',
    type: 'system_design',
    timeLimit: 900,
  },
];

export function SystemDesignRound({
  onComplete,
  duration,
}: SystemDesignRoundProps) {
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
    const score = Math.floor(Math.random() * 35) + 65; // Mock score 65-100
    const result = {
      score,
      totalQuestions: mockQuestions.length,
      answeredQuestions: Object.keys(answers).length,
      qualified: score >= 70,
      feedback:
        score >= 85
          ? 'Excellent system design approach!'
          : score >= 70
            ? 'Good system design thinking.'
            : 'System design needs more depth and scalability considerations.',
      timeSpent: duration * 60 - timeRemaining,
    };
    onComplete(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Design Interview</CardTitle>
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
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 mb-2">
                <strong>Approach:</strong> Start with requirements, then
                high-level design, dive into components, and discuss
                scalability.
              </p>
            </div>
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <Textarea
              placeholder="1. Clarify requirements and constraints
2. Estimate scale (users, requests, storage)
3. High-level system design
4. Detailed component design
5. Scale the design
6. Address bottlenecks"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
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
