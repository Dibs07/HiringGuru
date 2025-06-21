'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  XCircle,
  BookOpen,
  ArrowRight,
  Trophy,
  AlertCircle,
} from 'lucide-react';

interface RoundResultsProps {
  result: any;
  onNext: () => void;
  isLastRound: boolean;
}

export function RoundResults({
  result,
  onNext,
  isLastRound,
}: RoundResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (qualified: boolean) => {
    return qualified ? 'default' : 'destructive';
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {result.qualified ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">
          {result.qualified
            ? 'Round Completed Successfully!'
            : 'Round Not Qualified'}
        </CardTitle>
        <p className="text-gray-600">
          {result.type.charAt(0).toUpperCase() + result.type.slice(1)} Round
          Results
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div
              className={`text-4xl font-bold ${getScoreColor(result.score)}`}
            >
              {result.score}%
            </div>
            <Badge
              variant={getScoreBadgeVariant(result.qualified)}
              className="text-sm"
            >
              {result.qualified ? 'Qualified for Next Round' : 'Not Qualified'}
            </Badge>
          </div>

          <Progress value={result.score} className="w-full max-w-md mx-auto" />
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.type === 'aptitude' && (
                <>
                  <div className="flex justify-between">
                    <span>Correct Answers:</span>
                    <span className="font-medium">
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                </>
              )}

              {result.type === 'coding' && (
                <>
                  <div className="flex justify-between">
                    <span>Test Cases Passed:</span>
                    <span className="font-medium">
                      {result.passedTests}/{result.totalTests}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language Used:</span>
                    <span className="font-medium capitalize">
                      {result.language}
                    </span>
                  </div>
                </>
              )}

              {result.type === 'communication' && (
                <>
                  <div className="flex justify-between">
                    <span>Tasks Completed:</span>
                    <span className="font-medium">
                      {Object.keys(result.responses || {}).length}/3
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Communication Score:</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                </>
              )}

              {result.type === 'interview' && (
                <>
                  <div className="flex justify-between">
                    <span>Questions Answered:</span>
                    <span className="font-medium">
                      {result.answeredQuestions}/{result.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interview Score:</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                </>
              )}

              {result.type === 'screening' && (
                <>
                  <div className="flex justify-between">
                    <span>Profile Match:</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligibility:</span>
                    <span className="font-medium">
                      {result.qualified ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-gray-700">{result.feedback}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preparation Resources */}
        {!result.qualified && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recommended Preparation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-800 mb-4">
                Would you like to access preparation resources to improve your
                skills in this area?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Resources
                </Button>
                <Button variant="outline" className="bg-white">
                  Practice More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center pt-6">
          {result.qualified ? (
            <Button onClick={onNext} size="lg" className="px-8">
              {isLastRound ? (
                <>
                  <Trophy className="h-5 w-5 mr-2" />
                  View Final Results
                </>
              ) : (
                <>
                  Continue to Next Round
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                You didn't qualify for the next round. You can retry this
                assessment or practice more.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/dashboard')}
                >
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry Assessment
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
