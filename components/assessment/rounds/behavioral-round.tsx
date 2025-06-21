'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Timer } from '../timer';
import { Progress } from '@/components/ui/progress';

interface BehavioralRoundProps {
  onComplete: (result: any) => void;
  duration: number;
}

// Mock behavioral questions
const mockQuestions = [
  {
    id: 1,
    question:
      'Tell me about a time when you had to work with a difficult team member. How did you handle the situation?',
    type: 'behavioral',
    timeLimit: 300, // 5 minutes
  },
  {
    id: 2,
    question:
      'Describe a situation where you had to meet a tight deadline. What was your approach?',
    type: 'behavioral',
    timeLimit: 300,
  },
  {
    id: 3,
    question:
      'Give me an example of a time when you had to learn something new quickly. How did you approach it?',
    type: 'behavioral',
    timeLimit: 300,
  },
  {
    id: 4,
    question:
      "Tell me about a time when you disagreed with your manager's decision. How did you handle it?",
    type: 'behavioral',
    timeLimit: 300,
  },
];

export function BehavioralRound({
  onComplete,
  duration,
}: BehavioralRoundProps) {
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
    const score = Math.floor(Math.random() * 30) + 70; // Mock score 70-100
    const result = {
      score,
      totalQuestions: mockQuestions.length,
      answeredQuestions: Object.keys(answers).length,
      qualified: score >= 75,
      feedback:
        score >= 85
          ? 'Excellent behavioral responses!'
          : score >= 75
            ? 'Good behavioral examples provided.'
            : 'Behavioral responses need more structure.',
      timeSpent: duration * 60 - timeRemaining,
    };
    onComplete(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Behavioral Interview</CardTitle>
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Tip:</strong> Use the STAR method (Situation, Task,
                Action, Result) to structure your answer.
              </p>
            </div>
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            <Textarea
              placeholder="Describe the situation, your actions, and the results using the STAR method..."
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
