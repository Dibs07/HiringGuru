"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink, BookOpen, Video, FileText, ArrowRight } from "lucide-react"

interface PreparationScreenProps {
  roundType: string
  roundName: string
  duration: number
  onSkip: () => void
  onContinue: () => void
}

const PREPARATION_RESOURCES = {
  APTITUDE: {
    title: "Aptitude Test Preparation",
    description: "Prepare for logical reasoning, numerical ability, and analytical thinking questions.",
    resources: [
      {
        title: "Logical Reasoning Practice",
        url: "https://www.indiabix.com/logical-reasoning/",
        type: "practice",
        icon: BookOpen,
      },
      {
        title: "Quantitative Aptitude Guide",
        url: "https://www.geeksforgeeks.org/aptitude-questions-and-answers/",
        type: "guide",
        icon: FileText,
      },
      {
        title: "Aptitude Test Tips",
        url: "https://www.youtube.com/watch?v=aptitude-tips",
        type: "video",
        icon: Video,
      },
    ],
    tips: [
      "Read questions carefully and identify the pattern",
      "Manage your time effectively - don't spend too long on one question",
      "Practice mental math to solve problems quickly",
      "Use elimination method for multiple choice questions",
    ],
  },
  TECHNICAL: {
    title: "Technical Interview Preparation",
    description: "Get ready for data structures, algorithms, and system design questions.",
    resources: [
      {
        title: "LeetCode Practice",
        url: "https://leetcode.com/",
        type: "practice",
        icon: BookOpen,
      },
      {
        title: "System Design Primer",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "guide",
        icon: FileText,
      },
      {
        title: "Technical Interview Guide",
        url: "https://www.youtube.com/watch?v=tech-interview",
        type: "video",
        icon: Video,
      },
    ],
    tips: [
      "Think out loud and explain your approach",
      "Start with a brute force solution, then optimize",
      "Ask clarifying questions about requirements",
      "Consider edge cases and time/space complexity",
    ],
  },
  CODING: {
    title: "Coding Challenge Preparation",
    description: "Practice coding problems and algorithm implementation.",
    resources: [
      {
        title: "HackerRank Practice",
        url: "https://www.hackerrank.com/",
        type: "practice",
        icon: BookOpen,
      },
      {
        title: "Algorithm Visualizer",
        url: "https://algorithm-visualizer.org/",
        type: "guide",
        icon: FileText,
      },
      {
        title: "Coding Interview Tips",
        url: "https://www.youtube.com/watch?v=coding-tips",
        type: "video",
        icon: Video,
      },
    ],
    tips: [
      "Write clean, readable code with proper variable names",
      "Test your solution with sample inputs",
      "Handle edge cases and error conditions",
      "Optimize for both time and space complexity",
    ],
  },
  COMMUNICATION: {
    title: "Communication Round Preparation",
    description: "Prepare for verbal communication and presentation skills assessment.",
    resources: [
      {
        title: "Public Speaking Tips",
        url: "https://www.toastmasters.org/",
        type: "guide",
        icon: FileText,
      },
      {
        title: "Communication Skills Course",
        url: "https://www.coursera.org/learn/communication-skills",
        type: "video",
        icon: Video,
      },
      {
        title: "Presentation Practice",
        url: "https://www.prezi.com/presentation-tips/",
        type: "practice",
        icon: BookOpen,
      },
    ],
    tips: [
      "Speak clearly and at an appropriate pace",
      "Maintain eye contact and confident body language",
      "Structure your responses with clear beginning, middle, and end",
      "Practice active listening and ask relevant questions",
    ],
  },
  BEHAVIORAL: {
    title: "Behavioral Interview Preparation",
    description: "Prepare for questions about your experience, motivation, and soft skills.",
    resources: [
      {
        title: "STAR Method Guide",
        url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-method",
        type: "guide",
        icon: FileText,
      },
      {
        title: "Common Behavioral Questions",
        url: "https://www.glassdoor.com/blog/common-behavioral-interview-questions/",
        type: "practice",
        icon: BookOpen,
      },
      {
        title: "Behavioral Interview Tips",
        url: "https://www.youtube.com/watch?v=behavioral-tips",
        type: "video",
        icon: Video,
      },
    ],
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Prepare specific examples from your experience",
      "Be honest and authentic in your responses",
      "Focus on your contributions and learnings",
    ],
  },
  SYSTEM_DESIGN: {
    title: "System Design Preparation",
    description: "Prepare for designing scalable systems and architecture discussions.",
    resources: [
      {
        title: "System Design Interview",
        url: "https://github.com/checkcheckzz/system-design-interview",
        type: "guide",
        icon: FileText,
      },
      {
        title: "High Scalability",
        url: "http://highscalability.com/",
        type: "practice",
        icon: BookOpen,
      },
      {
        title: "System Design Course",
        url: "https://www.youtube.com/watch?v=system-design",
        type: "video",
        icon: Video,
      },
    ],
    tips: [
      "Start with high-level architecture and drill down",
      "Consider scalability, reliability, and performance",
      "Discuss trade-offs and alternative approaches",
      "Ask about scale, users, and specific requirements",
    ],
  },
}

export function PreparationScreen({ roundType, roundName, duration, onSkip, onContinue }: PreparationScreenProps) {
  const [timeSpent, setTimeSpent] = useState(0)
  const preparation = PREPARATION_RESOURCES[roundType as keyof typeof PREPARATION_RESOURCES] || {
    title: "Round Preparation",
    description: "Prepare for the upcoming round.",
    resources: [],
    tips: [],
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{preparation.title}</CardTitle>
                <p className="text-gray-600 mt-1">{preparation.description}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="mb-2">
                  {roundName}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{duration} minutes</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Preparation Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Preparation Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {preparation.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <resource.icon className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-medium group-hover:text-blue-600">{resource.title}</h4>
                    <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {preparation.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{tip}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Ready to start the {roundName}?</h3>
                <p className="text-sm text-gray-600">
                  You can skip preparation or take some time to review the resources above.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onSkip}>
                  Skip Preparation
                </Button>
                <Button onClick={onContinue} className="flex items-center gap-2">
                  Start Round
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
