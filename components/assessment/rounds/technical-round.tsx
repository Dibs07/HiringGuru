"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Timer } from "../timer"
import { Progress } from "@/components/ui/progress"
import { apiService } from "@/lib/services/api-service"
import { handleApiError } from "@/lib/utils/error-handler"
import { useParams } from "next/navigation"

interface TechnicalRoundProps {
  onComplete: (result: any) => void
  duration: number
  roundId?: string
  difficulty?: string
  category?: string
}

export function TechnicalRound({ 
  onComplete, 
  duration, 
  roundId, 
  difficulty = "MEDIUM",
  category = "JavaScript"
}: TechnicalRoundProps) {
  const params = useParams()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { selectedOption: string; timeSpent: number }>>({})
  const [questions, setQuestions] = useState<any[]>([])
  const [timeUp, setTimeUp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const isGeneratingRef = useRef(false)
  const hasGeneratedRef = useRef(false)

  useEffect(() => {
    // Only generate questions when params.id is available and not already generated/generating
    if (params.id && !hasGeneratedRef.current && !isGeneratingRef.current) {
      generateQuestions()
    }
  }, [params.id])

  useEffect(() => {
    setQuestionStartTime(Date.now())
  }, [currentQuestion])

  const generateQuestions = async () => {
    // Prevent multiple simultaneous calls
    if (isGeneratingRef.current || hasGeneratedRef.current) {
      return
    }

    try {
      isGeneratingRef.current = true
      setIsLoading(true)
      const payload = {
        roundId: roundId || "mock-round-id",
        roundType: "TECHNICAL",
        difficulty: difficulty.toLowerCase(),
        questionCount: 2,
        category: category || "JavaScript",
        duration: duration,
        type: "MCQ",
      }
      console.log("Generating questions with payload:", payload)
      const response = await apiService.generateQuestions(payload)
      if (response.success && response.questions) {
        setQuestions(response.questions)
        hasGeneratedRef.current = true
      } else {
        throw new Error("Failed to generate questions")
      }
    } catch (error) {
      handleApiError(error)
      // Fallback to mock questions
      setQuestions(getMockTechnicalQuestions())
      hasGeneratedRef.current = true
    } finally {
      setIsLoading(false)
      isGeneratingRef.current = false
    }
  }

  const getMockTechnicalQuestions = () => [
    {
      id: 1,
      type: "technical",
      content: "What is the time complexity of searching in a balanced binary search tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correct: 1,
    },
    {
      id: 2,
      type: "technical",
      content: "In React, what is the purpose of useEffect hook?",
      options: [
        "To manage component state",
        "To handle side effects in functional components",
        "To create custom hooks",
        "To optimize component rendering"
      ],
      correct: 1,
    },
  ]

  const handleAnswerSelect = (value: string) => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setAnswers({
      ...answers,
      [currentQuestion]: { selectedOption: value, timeSpent },
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const totalTimeSpent = Object.values(answers).reduce((sum, answer) => sum + answer.timeSpent, 0)

      const submissionPayload = {
        roundId,
        answers: Object.entries(answers).map(([questionIndex, answer]) => ({
          questionId: questions[Number(questionIndex)].id,
          answer: answer.selectedOption,
          timeSpent: answer.timeSpent,
        })),
        totalTimeSpent,
        roundType: "TECHNICAL",
      }

      const response = await apiService.submitAnswers(submissionPayload)

      const result = {
        type: "technical",
        score: Number.parseFloat(response.overallScore.replace("%", "")),
        qualified: Number.parseFloat(response.overallScore.replace("%", "")) >= 70,
        feedback: response.feedback,
        detailedResults: response.detailedResults,
        overallScore: response.overallScore,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
      }

      onComplete(result)
    } catch (error) {
      handleApiError(error)
      // Fallback to mock result
      const mockScore = Math.floor(Math.random() * 40) + 60
      onComplete({
        type: "technical",
        score: mockScore,
        qualified: mockScore >= 70,
        feedback: {
          strengths: ["Good understanding of data structures"],
          improvements: ["Practice more algorithm problems"],
          detailedFeedback: `You scored ${mockScore}% on the technical test.`,
        },
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Generating questions...</p>
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6 text-center">
          <p>Failed to load questions. Please try again.</p>
          <Button 
            onClick={() => {
              hasGeneratedRef.current = false
              isGeneratingRef.current = false
              generateQuestions()
            }} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Technical Round - {category}</CardTitle>
          <p className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <Timer
          initialTime={duration * 60}
          onTimeUp={() => setTimeUp(true)}
          onTimeUpdate={() => {}}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        <Progress value={progress} className="w-full" />

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                {currentQ.type?.charAt(0).toUpperCase() + currentQ.type?.slice(1) || 'Technical'}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                {category}
              </span>
            </div>
            <h3 className="text-lg font-medium mb-4">{currentQ.content}</h3>

            <RadioGroup value={answers[currentQuestion]?.selectedOption || ""} onValueChange={handleAnswerSelect}>
              {currentQ.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-white">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext}>Next Question</Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={(!timeUp && Object.keys(answers).length < questions.length) || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : timeUp ? (
                    "Time Up - Submit"
                  ) : (
                    "Submit Test"
                  )}
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
                    ? "bg-blue-600 text-white"
                    : answers[index] !== undefined
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}