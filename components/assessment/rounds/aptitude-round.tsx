'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Timer } from '@/components/assessment/timer';
import { Progress } from '@/components/ui/progress';

interface AptitudeRoundProps {
  onComplete: (result: any) => void;
}

export function AptitudeRound({ onComplete }: AptitudeRoundProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeUp, setTimeUp] = useState(false);

  const questions = [
    {
      id: 1,
      type: 'logical',
      question:
        'If all roses are flowers and some flowers fade quickly, which of the following must be true?',
      options: [
        'All roses fade quickly',
        'Some roses may fade quickly',
        'No roses fade quickly',
        'All flowers are roses',
      ],
      correct: 1,
    },
    {
      id: 2,
      type: 'numerical',
      question: 'What is the next number in the sequence: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '46'],
      correct: 1,
    },
    {
      id: 3,
      type: 'pattern',
      question:
        'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?',
      options: ['EOJDDJMF', 'NFEJDJOF', 'MFEJDJMF', 'EOJDJMF'],
      correct: 0,
    },
    {
      id: 4,
      type: 'logical',
      question:
        'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
      options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
      correct: 0,
    },
    {
      id: 5,
      type: 'numerical',
      question:
        'A train 125m long running at 50 km/hr takes 18 seconds to cross a bridge. What is the length of the bridge?',
      options: ['125m', '150m', '175m', '200m'],
      correct: 1,
    },
    {
      id: 6,
      type: 'pattern',
      question: 'Find the odd one out: 3, 5, 11, 14, 17, 21',
      options: ['3', '5', '14', '17'],
      correct: 2,
    },
    {
      id: 7,
      type: 'logical',
      question: 'All birds can fly. Penguins are birds. Therefore:',
      options: [
        'Penguins can fly',
        'The first statement is false',
        'Penguins are not birds',
        'All of the above could be true',
      ],
      correct: 1,
    },
    {
      id: 8,
      type: 'numerical',
      question: 'If 20% of a number is 15, what is 60% of that number?',
      options: ['25', '35', '45', '55'],
      correct: 2,
    },
  ];

  const handleAnswerSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (Number.parseInt(answers[index]) === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const qualified = score >= 60;

    onComplete({
      type: 'aptitude',
      score,
      qualified,
      correctAnswers,
      totalQuestions: questions.length,
      answers,
      feedback: qualified
        ? `Excellent! You scored ${score}% on the aptitude test.`
        : `You scored ${score}%. You need at least 60% to qualify for the next round.`,
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Aptitude Round</CardTitle>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <Timer duration={30 * 60} onTimeUp={() => setTimeUp(true)} />
      </CardHeader>

      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                {currentQ.type.charAt(0).toUpperCase() + currentQ.type.slice(1)}
              </span>
            </div>
            <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>

            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswerSelect}
            >
              {currentQ.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-white"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext}>Next Question</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !timeUp && Object.keys(answers).length < questions.length
                  }
                >
                  {timeUp ? 'Time Up - Submit' : 'Submit Test'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Question Navigator:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== undefined
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
