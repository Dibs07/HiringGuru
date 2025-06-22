"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, MessageSquare, Trophy, AlertTriangle } from "lucide-react"

interface AIVerdict {
  overallScore: string
  feedback: {
    strengths: string[]
    improvements: string[]
    detailedFeedback: string
  }
  detailedResults: Array<{
    question: string
    user_answer: string
    correct_answer: string
    is_correct: boolean
  }>
}

interface RoundResultsProps {
  result: {
    detailedResults: { question: string; user_answer: string; correct_answer: string; is_correct: boolean }[] | undefined
    type: string
    score?: number
    qualified?: boolean
    questionsAnswered?: number
    totalQuestions?: number
    conversation?: Array<{ type: string; text: string }>
    feedback?: any
    userFeedback?: string
    aiVerdict?: AIVerdict
  }
  onNext: () => void
  onBack?: () => void
  isLastRound: boolean
}

export function RoundResults({ result, onNext, onBack, isLastRound }: RoundResultsProps) {
  // Parse score from aiVerdict if available, otherwise use result.score
  const getScore = () => {
    if (result.aiVerdict?.overallScore) {
      return parseFloat(result.aiVerdict.overallScore.replace('%', ''))
    }
    return result.score || 0
  }

  const score = getScore()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getQualificationStatus = () => {
    if (result.qualified !== undefined) {
      return result.qualified ? "Qualified" : "Needs Improvement"
    }
    // Determine based on score
    return score >= 60 ? "Qualified" : "Needs Improvement"
  }

  const renderInterviewResults = () => {
    if (!["communication", "technical", "behavioral", "system_design"].includes(result.type)) {
      return null
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{result.questionsAnswered}</div>
            <div className="text-sm text-gray-600">Questions Answered</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{result.totalQuestions}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>

        {result.conversation && result.conversation.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Interview Highlights:</h4>
            <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-lg">
              {result.conversation
                .filter((msg: any) => msg.type === "ai")
                .slice(0, 3)
                .map((msg: any, index: number) => (
                  <div key={index} className="text-sm text-gray-700 p-2 bg-white rounded border-l-4 border-blue-400">
                    <strong>Q{index + 1}:</strong> {msg.text.substring(0, 100)}
                    {msg.text.length > 100 && "..."}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderDetailedResults = () => {
    // Use aiVerdict detailedResults if available, otherwise fallback to result.detailedResults
    const detailedResults = result.aiVerdict?.detailedResults || result.detailedResults
    
    if (!detailedResults || detailedResults.length === 0) return null

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Question-wise Results:</h4>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {detailedResults.map((item: any, index: number) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {item.is_correct ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{item.question}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Your answer: </span>
                      <span className={item.is_correct ? "text-green-600" : "text-red-600"}>{item.user_answer}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Correct answer: </span>
                      <span className="text-green-600">{item.correct_answer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderFeedback = () => {
    // Use aiVerdict feedback if available, otherwise fallback to result.feedback
    const feedbackData = result.aiVerdict?.feedback || result.feedback
    
    if (!feedbackData) return null

    const feedback = typeof feedbackData === "string" ? { detailedFeedback: feedbackData } : feedbackData

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Performance Feedback:</h4>

        {feedback.strengths && feedback.strengths.length > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Strengths:</h5>
            <ul className="text-sm text-green-700 space-y-1">
              {feedback.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.improvements && feedback.improvements.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-2">Areas for Improvement:</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              {feedback.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feedback.detailedFeedback && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Detailed Analysis:</h5>
            <p className="text-sm text-blue-700 whitespace-pre-line">{feedback.detailedFeedback}</p>
          </div>
        )}
      </div>
    )
  }

  const renderScoreBreakdown = () => {
    if (!result.aiVerdict?.feedback?.detailedFeedback) return null

    // Extract score breakdown from detailed feedback if it contains performance data
    const detailedFeedback = result.aiVerdict.feedback.detailedFeedback
    const lines = detailedFeedback.split('\n')
    
    // Look for lines that contain score information
    const scoreLines = lines.filter(line => 
      line.includes('/') && (line.includes('%') || line.includes('accuracy'))
    )

    if (scoreLines.length === 0) return null

    return (
      <div className="space-y-4">
        <h4 className="font-medium">Performance Breakdown:</h4>
        <div className="grid gap-3">
          {scoreLines.map((line, index) => {
            const trimmedLine = line.trim().replace(/^-\s*/, '')
            return (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{trimmedLine}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-yellow-600" />
          <CardTitle className="text-2xl">Round Completed!</CardTitle>
        </div>
        <p className="text-gray-600">{result.type.charAt(0).toUpperCase() + result.type.slice(1)} Round Results</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {Math.round(score)}%
            </div>
            <Badge className={getScoreBadgeColor(score)}>
              {getQualificationStatus()}
            </Badge>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Performance</span>
              <span>{Math.round(score)}%</span>
            </div>
            <Progress value={score} className="h-3" />
          </div>
        </div>

        {/* Type-specific Results */}
        {renderInterviewResults()}
        {renderDetailedResults()}
        {renderScoreBreakdown()}
        {renderFeedback()}

        {/* User Feedback */}
        {result.userFeedback && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Your Feedback:</h4>
            <p className="text-sm text-gray-700">{result.userFeedback}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back to Rounds
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button onClick={onNext}>{isLastRound ? "Complete Assessment" : "Next Round"}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}