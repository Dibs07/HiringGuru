"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Code, MessageSquare, Users, Network, Clock, Star } from "lucide-react"
import { motion } from "framer-motion"

export function CustomAssessmentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAssessments, setGeneratedAssessments] = useState<any[]>([])

  // Mock data for generated assessments
  const mockAssessments = [
    {
      id: "ai-gen-1",
      name: "Full Stack Developer Assessment",
      description: "Comprehensive evaluation covering React, Node.js, and system design",
      difficulty: "MEDIUM",
      estimatedDuration: 90,
      rounds: [
        { type: "APTITUDE", name: "Logical Reasoning", duration: 20 },
        { type: "TECHNICAL", name: "JavaScript & React", duration: 30 },
        { type: "CODING", name: "Algorithm Challenge", duration: 40 },
      ],
      matchScore: 95,
      aiRecommendation: "Perfect match for your JavaScript and React skills",
    },
    {
      id: "ai-gen-2",
      name: "Senior Backend Engineer Track",
      description: "Advanced backend development with microservices and databases",
      difficulty: "HARD",
      estimatedDuration: 120,
      rounds: [
        { type: "TECHNICAL", name: "System Architecture", duration: 45 },
        { type: "CODING", name: "Database Optimization", duration: 45 },
        { type: "BEHAVIORAL", name: "Leadership Scenarios", duration: 30 },
      ],
      matchScore: 88,
      aiRecommendation: "Great for advancing your backend expertise",
    },
    {
      id: "ai-gen-3",
      name: "Product Manager Simulation",
      description: "Strategic thinking, user research, and stakeholder management",
      difficulty: "MEDIUM",
      estimatedDuration: 75,
      rounds: [
        { type: "COMMUNICATION", name: "Stakeholder Presentation", duration: 25 },
        { type: "BEHAVIORAL", name: "Product Decisions", duration: 25 },
        { type: "SYSTEM_DESIGN", name: "Product Architecture", duration: 25 },
      ],
      matchScore: 82,
      aiRecommendation: "Excellent for transitioning to product management",
    },
  ]

  const handleGenerateAssessments = async () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      setGeneratedAssessments(mockAssessments)
      setIsGenerating(false)
    }, 2000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "HARD":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoundIcon = (type: string) => {
    switch (type) {
      case "APTITUDE":
        return <Brain className="h-4 w-4" />
      case "TECHNICAL":
        return <Code className="h-4 w-4" />
      case "CODING":
        return <Code className="h-4 w-4" />
      case "COMMUNICATION":
        return <MessageSquare className="h-4 w-4" />
      case "BEHAVIORAL":
        return <Users className="h-4 w-4" />
      case "SYSTEM_DESIGN":
        return <Network className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI-Powered Assessment Generator
            </CardTitle>
            <p className="text-gray-600 mt-1">Generate personalized assessments based on your profile and goals</p>
          </div>
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
      </CardHeader>

      <CardContent>
        {generatedAssessments.length === 0 && !isGenerating && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Generate Assessments" to create personalized assessments based on your profile</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {generatedAssessments.length > 0 && (
          <div className="space-y-4">
            {generatedAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{assessment.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{assessment.matchScore}% match</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
                    <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 p-2 rounded">
                      <Sparkles className="h-4 w-4" />
                      <span>{assessment.aiRecommendation}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(assessment.difficulty)}>{assessment.difficulty}</Badge>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.estimatedDuration} min
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Assessment Rounds:</h4>
                  <div className="flex flex-wrap gap-2">
                    {assessment.rounds.map((round: any, roundIndex: number) => (
                      <div key={roundIndex} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                        {getRoundIcon(round.type)}
                        <span>{round.name}</span>
                        <span className="text-gray-500">({round.duration}m)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Start Assessment
                  </Button>
                  <Button size="sm" variant="outline">
                    Customize
                  </Button>
                  <Button size="sm" variant="outline">
                    Save for Later
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
