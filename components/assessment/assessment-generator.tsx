"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock, Users, Target, TrendingUp, Play, BookOpen, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useAssessmentStore } from "@/lib/stores/assessment-store"
import { toast } from "sonner"

interface GeneratedAssessment {
  id: string
  name: string
  description: string
  difficulty: "EASY" | "MEDIUM" | "HARD"
  totalDuration: number
  rounds: Array<{
    type: string
    name: string
    duration: number
  }>
  matchScore?: number
  aiRecommendation?: string
  tags?: string[]
  estimatedCompletion?: string
}

export function AssessmentGenerator() {
  const { user } = useAuthStore()
  const { startAssessment, fetchCustomAssessments } = useAssessmentStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAssessments, setGeneratedAssessments] = useState<GeneratedAssessment[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerateAssessments = async () => {
    if (!user?.id) {
      toast.error("Please log in to generate assessments")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:8000/generate-assessment?id=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to generate assessments: ${response.statusText}`)
      }

      const data = await response.json()
      fetchCustomAssessments() // Refresh custom assessments after generation
      // Transform the API response to match our interface
      const transformedAssessments: GeneratedAssessment[] =
        data.assessments?.map((assessment: any, index: number) => ({
          id: assessment.id || `generated-${Date.now()}-${index}`,
          name: assessment.name || assessment.title || `Generated Assessment ${index + 1}`,
          description: assessment.description || "AI-generated assessment tailored to your profile",
          difficulty: assessment.difficulty || "MEDIUM",
          totalDuration: assessment.totalDuration || assessment.duration || 90,
          rounds: [
            { type: "TECHNICAL", name: "Technical Round", duration: 30 },
            { type: "CODING", name: "Coding Challenge", duration: 45 },
            { type: "COMMUNICATION", name: "Behavioral Interview", duration: 15 },
          ],
          matchScore: assessment.matchScore || Math.floor(Math.random() * 20) + 80,
          aiRecommendation: assessment.aiRecommendation || "Recommended based on your profile and career goals",
          tags: assessment.tags || assessment.skills || ["JavaScript", "React", "Problem Solving"],
          estimatedCompletion: assessment.estimatedCompletion || "1-2 hours",
        })) || []

      setGeneratedAssessments(transformedAssessments)

      if (transformedAssessments.length === 0) {
        toast.info("Generated assessments !")
      } else {
        toast.success(`Generated ${transformedAssessments.length} personalized assessments!`)
      }
    } catch (error) {
      console.error("Error generating assessments:", error)
      setError(error instanceof Error ? error.message : "Failed to generate assessments")
      toast.error("Failed to generate assessments. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartAssessment = async (assessment: GeneratedAssessment) => {
    try {
      // Create a custom assessment from the generated one
      const customAssessment = {
        name: assessment.name,
        description: assessment.description,
        difficulty: assessment.difficulty,
        rounds: assessment.rounds,
        totalDuration: assessment.totalDuration,
      }

      const process = await startAssessment("CUSTOM", assessment.id)
      window.location.href = `/assessment/${process.id}/start`
    } catch (error) {
      console.error("Failed to start assessment:", error)
      toast.error("Failed to start assessment. Please try again.")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800 border-green-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "HARD":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoundTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "technical":
        return "🔧"
      case "coding":
        return "💻"
      case "behavioral":
        return "🗣️"
      case "system_design":
      case "system-design":
        return "🏗️"
      case "aptitude":
        return "🧠"
      case "communication":
        return "💬"
      default:
        return "📝"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Assessment Generator
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Generate personalized assessments based on your profile, skills, and career goals
            </p>
          </div>
          <div className="flex gap-2">
            {generatedAssessments.length > 0 && (
              <Button variant="outline" onClick={handleGenerateAssessments} disabled={isGenerating} size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Regenerate
              </Button>
            )}
            <Button
              onClick={handleGenerateAssessments}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Assessments
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <span className="text-red-600">⚠️</span>
              <span className="font-medium">Error generating assessments</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAssessments}
              className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Generating Your Perfect Assessments</h3>
              <p className="text-gray-600">Our AI is analyzing your profile and creating customized assessments...</p>
            </div>

            {/* Loading Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && generatedAssessments.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Generate Your Assessments?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our AI will analyze your profile, skills, and career goals to create personalized assessments that match
              your experience level and target roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Target className="h-4 w-4" />
                <span>Personalized content</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span>Skill-based matching</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="h-4 w-4" />
                <span>Career-focused</span>
              </div>
            </div>
          </div>
        )}

        {/* Generated Assessments */}
        {!isGenerating && generatedAssessments.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Assessments ({generatedAssessments.length})</h3>
              <div className="text-sm text-gray-500">Tailored for {user?.name || "you"}</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {generatedAssessments.map((assessment, index) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{assessment.name}</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{assessment.description}</p>
                        </div>
                        {assessment.matchScore && (
                          <div className="flex items-center gap-1 text-green-600 ml-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium">{assessment.matchScore}%</span>
                          </div>
                        )}
                      </div>

                      {/* AI Recommendation */}
                      {assessment.aiRecommendation && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-purple-800">{assessment.aiRecommendation}</p>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{assessment.totalDuration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{assessment.rounds.length} rounds</span>
                        </div>
                        <Badge className={getDifficultyColor(assessment.difficulty)}>
                          {assessment.difficulty.toLowerCase()}
                        </Badge>
                      </div>

                      {/* Rounds */}
                      <div className="space-y-2 mb-4">
                        <h5 className="text-sm font-medium text-gray-700">Assessment Rounds:</h5>
                        <div className="space-y-1">
                          {assessment.rounds.map((round, roundIndex) => (
                            <div
                              key={roundIndex}
                              className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1"
                            >
                              <div className="flex items-center gap-2">
                                <span>{getRoundTypeIcon(round.type)}</span>
                                <span className="font-medium">{round.name}</span>
                              </div>
                              <span className="text-gray-500">{round.duration}m</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tags */}
                      {assessment.tags && assessment.tags.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <h5 className="text-sm font-medium text-gray-700">Key Skills:</h5>
                          <div className="flex flex-wrap gap-1">
                            {assessment.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {assessment.tags.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{assessment.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStartAssessment(assessment)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start Assessment
                        </Button>
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
