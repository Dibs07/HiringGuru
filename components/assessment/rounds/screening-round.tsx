'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Timer } from '@/components/assessment/timer';

interface ScreeningRoundProps {
  onComplete: (result: any) => void;
  duration: number;
}

export function ScreeningRound({ onComplete, duration }: ScreeningRoundProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeUp, setTimeUp] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);

  const questions = [
    {
      id: 'experience',
      question:
        'Describe your software development experience and key achievements.',
      placeholder:
        'Please provide details about your experience, projects, and accomplishments...',
    },
    {
      id: 'motivation',
      question: 'Why are you interested in this role and what motivates you?',
      placeholder:
        'Explain your interest in the position and what drives you professionally...',
    },
    {
      id: 'skills',
      question:
        'What are your strongest technical skills and how have you applied them?',
      placeholder:
        "List your technical skills and provide examples of how you've used them...",
    },
    {
      id: 'challenges',
      question:
        'Describe a challenging project you worked on and how you overcame obstacles.',
      placeholder:
        'Share details about a difficult project and your problem-solving approach...',
    },
  ];

  const handleTimeUp = () => {
    setTimeUp(true);
  };

  const handleTimeUpdate = (time: number) => {
    setTimeRemaining(time);
  };

  const handleSubmit = () => {
    // Calculate score based on answer completeness and quality
    let score = 0;
    const totalQuestions = questions.length;

    questions.forEach((question) => {
      const answer = answers[question.id] || '';
      if (answer.trim().length > 50) score += 25; // Basic completeness check
    });

    const qualified = score >= 50;

    onComplete({
      type: 'screening',
      score,
      qualified,
      answers,
      timeSpent: duration * 60 - timeRemaining,
      feedback: qualified
        ? 'Great responses! Your background aligns well with our requirements.'
        : 'Please provide more detailed responses to better showcase your qualifications.',
    });
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const isFormComplete = questions.every(
    (q) => answers[q.id]?.trim().length > 0
  );

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Screening Round</CardTitle>
        <Timer
          initialTime={duration * 60}
          onTimeUp={handleTimeUp}
          onTimeUpdate={handleTimeUpdate}
        />
      </CardHeader>

      <CardContent className="space-y-8">
        <p className="text-gray-600">
          Please answer the following questions to help us understand your
          background and qualifications. Provide detailed responses to showcase
          your experience.
        </p>

        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <Label htmlFor={question.id} className="text-base font-medium">
              {index + 1}. {question.question}
            </Label>
            <Textarea
              id={question.id}
              placeholder={question.placeholder}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={timeUp}
            />
            <div className="text-sm text-gray-500">
              {answers[question.id]?.length || 0} characters
              {answers[question.id]?.length < 50 && (
                <span className="text-orange-600 ml-2">
                  (Minimum 50 characters recommended for a complete answer)
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!isFormComplete && !timeUp}
            size="lg"
          >
            {timeUp ? 'Time Up - Submit' : 'Submit Screening'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
