"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Timer } from "@/components/assessment/timer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, XCircle, Code, Clock, Trophy, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface CodingRoundProps {
  onComplete: (result: any) => void
  roundId: string
  duration?: number
}

interface Problem {
  "Problem Statement": string
  Title: string
  "test cases": Array<{
    input: string
    output: string
  }>
  "Boiler Plate": {
    Python: string
    Java: string
    "C++": string
  }
}

interface TestResult {
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  executionTime?: number
  memory?: number
}

export function CodingRound({ onComplete, roundId, duration = 45 }: CodingRoundProps) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("Python")
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submissionResult, setSubmissionResult] = useState<any>(null)

  const API_BASE_URL = "http://localhost:5000"

  const languages = [
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
  ]

  useEffect(() => {
    fetchProblems()
  }, [])

  useEffect(() => {
    if (currentProblem && selectedLanguage) {
      const boilerPlateKey = selectedLanguage as keyof (typeof currentProblem)["Boiler Plate"]
      const boilerPlateCode = currentProblem["Boiler Plate"][boilerPlateKey]
      if (boilerPlateCode) {
        try {
          const decodedCode = atob(boilerPlateCode)
           setCode(decodedCode)
        } catch (error) {
          console.error("Error decoding boilerplate code:", error)
          setCode("// Error loading boilerplate code")
        }
      }
    }
  }, [currentProblem, selectedLanguage])

  const fetchProblems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/coding`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProblems(data)

      // Select first problem by default
      if (data.length > 0) {
        setCurrentProblem(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error)
      toast.error("Failed to load coding problems. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const runCode = async () => {
    if (!currentProblem || !code.trim()) {
      toast.error("Please write some code before running")
      return
    }

    setIsRunning(true)
    setTestResults([])

    try {
      const testCases = currentProblem["test cases"].map((tc) => ({
        input: tc.input,
        expectedOutput: tc.output,
      }))

      const response = await fetch(`${API_BASE_URL}/api/coding/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage.toLowerCase(),
          roundId,
          questionId: currentProblem.Title.replace(/\s+/g, "_").toLowerCase(),
          testCases,
          stdin: testCases[0]?.input || "",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setTestResults(data.results)
        toast.success(`Tests completed: ${data.summary.passedTests}/${data.summary.totalTests} passed`)
      } else {
        toast.error("Code execution failed")
      }
    } catch (error) {
      console.error("Failed to run code:", error)
      toast.error("Failed to run code. Please try again.")
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    if (!currentProblem || !code.trim()) {
      toast.error("Please write some code before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      const testCases = currentProblem["test cases"].map((tc) => ({
        input: tc.input,
        expectedOutput: tc.output,
      }))

      const response = await fetch(`${API_BASE_URL}/api/coding/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage.toLowerCase(),
          roundId,
          questionId: currentProblem.Title.replace(/\s+/g, "_").toLowerCase(),
          testCases,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSubmissionResult(data)
        toast.success(`Submission successful! Score: ${data.score}%`)

        // Complete the round
        const result = {
          type: "coding",
          score: data.score,
          qualified: data.score >= 70,
          submissionId: data.submissionId,
          summary: data.summary,
          testResults: data.testResults,
          code,
          language: selectedLanguage,
          problem: currentProblem.Title,
          feedback:
            data.score >= 70
              ? `Excellent coding skills! You scored ${data.score}%.`
              : `You scored ${data.score}%. You need at least 70% to qualify.`,
        }

        onComplete(result)
      } else {
        toast.error("Submission failed")
      }
    } catch (error) {
      console.error("Failed to submit code:", error)
      toast.error("Failed to submit code. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setTestResults([]) // Clear previous test results
  }

  const getDifficultyColor = (title: string) => {
    // Simple heuristic based on problem complexity
    if (title.toLowerCase().includes("tree") || title.toLowerCase().includes("graph")) {
      return "text-red-600 border-red-600"
    } else if (title.toLowerCase().includes("array") || title.toLowerCase().includes("string")) {
      return "text-green-600 border-green-600"
    }
    return "text-orange-600 border-orange-600"
  }

  if (isLoading) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading coding problems...</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentProblem) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p>No coding problems available. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Coding Round
          </CardTitle>
          <p className="text-gray-600">Solve the coding problem below</p>
        </div>
        <div className="flex items-center gap-4">
          <Timer initialTime={duration * 60} onTimeUp={() => setTimeUp(true)} onTimeUpdate={()=>{}} />
          {problems.length > 1 && (
            <Select
              value={currentProblem.Title}
              onValueChange={(title) => {
                const problem = problems.find((p) => p.Title === title)
                if (problem) setCurrentProblem(problem)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {problems.map((problem) => (
                  <SelectItem key={problem.Title} value={problem.Title}>
                    {problem.Title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{currentProblem.Title}</h2>
              <Badge variant="outline" className={getDifficultyColor(currentProblem.Title)}>
                Medium
              </Badge>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{currentProblem["Problem Statement"]}</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Examples:</h3>
              {currentProblem["test cases"].map((example, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <strong>Input:</strong> {example.input}
                  </div>
                  <div>
                    <strong>Output:</strong> {example.output}
                  </div>
                </div>
              ))}
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Test Results:</h3>
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium text-sm">Test Case {index + 1}</span>
                        {result.executionTime && (
                          <span className="text-xs text-gray-500">{result.executionTime}ms</span>
                        )}
                        {result.memory && <span className="text-xs text-gray-500">{result.memory}KB</span>}
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Input: {result.input}</div>
                        <div>Expected: {result.expectedOutput}</div>
                        <div>Actual: {result.actualOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Result */}
            {submissionResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Submission Result</span>
                </div>
                <div className="text-sm space-y-1">
                  <div>Score: {submissionResult.score}%</div>
                  <div>Summary: {submissionResult.summary}</div>
                  <div>Submission ID: {submissionResult.submissionId}</div>
                </div>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button onClick={runCode} disabled={isRunning || !code.trim()} variant="outline">
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>

                <Button onClick={submitCode} disabled={isSubmitting || !code.trim()}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm min-h-[500px] resize-none"
                placeholder="Write your code here..."
              />
            </div>

            {timeUp && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <Clock className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <p className="text-red-800 font-medium">Time's up! Submit your solution now.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
