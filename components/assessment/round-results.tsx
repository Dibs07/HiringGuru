"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Target, TrendingUp, AlertCircle } from "lucide-react"

interface RoundResultsProps {
  result: any
  onNext: () => void
  isLastRound: boolean
}

export function RoundResults({ result, onNext, isLastRound }: RoundResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (qualified: boolean) => {
    return qualified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {result.qualified ? (
              <CheckCircle className="h-16 w-16 text-green-600" />
            ) : (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.qualified ? "Round Completed Successfully!" : "Round Completed"}
          </CardTitle>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge className={getScoreBadgeColor(result.qualified)}>
              {result.qualified ? "Qualified" : "Not Qualified"}
            </Badge>
            <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
              {result.overallScore || `${result.score}%`}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Results */}
      {result.feedback && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {result.feedback.strengths && result.feedback.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.feedback.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {result.feedback.improvements && result.feedback.improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.feedback.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Detailed Feedback */}
      {result.feedback?.detailedFeedback && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              {result.feedback.detailedFeedback}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question-wise Results */}
      {result.detailedResults && result.detailedResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Question-wise Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.detailedResults.map((questionResult: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">Question {index + 1}</h4>
                    {questionResult.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{questionResult.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Your Answer: </span>
                      <span className={questionResult.is_correct ? "text-green-600" : "text-red-600"}>
                        {questionResult.user_answer}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Correct Answer: </span>
                      <span className="text-green-600">{questionResult.correct_answer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Performance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.totalQuestions || 0}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.answeredQuestions || 0}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {result.detailedResults?.filter((r: any) => r.is_correct).length || 0}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Math.floor((result.timeSpent || 0) / 60)}m {(result.timeSpent || 0) % 60}s
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card>
        <CardContent className="pt-6 text-center">
          <Button onClick={onNext} size="lg" className="px-8">
            {isLastRound ? "Complete Assessment" : "Continue to Next Round"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
