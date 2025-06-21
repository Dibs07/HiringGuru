"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Camera, Clock, Play, CheckCircle, Lock } from "lucide-react"
import { AptitudeRound } from "./rounds/aptitude-round"
import { CommunicationRound } from "./rounds/communication-round"
import { CodingRound } from "./rounds/coding-round"
import { TechnicalRound } from "./rounds/technical-round"
import { BehavioralRound } from "./rounds/behavioral-round"
import { SystemDesignRound } from "./rounds/system-design-round"
import { RoundResults } from "./round-results"
import { useRouter } from "next/navigation"
import InterviewRound from "./rounds/interview-round"

interface AssessmentInterfaceProps {
  hiringProcess: any
  currentRound?: any
}

export function AssessmentInterface({ hiringProcess, currentRound }: AssessmentInterfaceProps) {
  const router = useRouter()
  const [selectedRound, setSelectedRound] = useState<any>(null)
  const [roundState, setRoundState] = useState<"selection" | "active" | "completed">("selection")
  const [roundResult, setRoundResult] = useState<any>(null)

  useEffect(() => {
    if (currentRound) {
      setSelectedRound(currentRound)
      setRoundState("active")
    }
  }, [currentRound])

  const handleRoundSelect = (round: any) => {
    if (round.status === "COMPLETED") {
      return // Don't allow restarting completed rounds
    }
    setSelectedRound(round)
    setRoundState("active")
  }

  const handleRoundComplete = (result: any) => {
    setRoundResult(result)
    setRoundState("completed")
  }

  const handleNextRound = () => {
    const currentSequence = selectedRound.sequence
    const nextRound = hiringProcess.rounds.find((r: any) => r.sequence === currentSequence + 1)

    if (nextRound) {
      setSelectedRound(nextRound)
      setRoundState("active")
      setRoundResult(null)
    } else {
      // All rounds completed
      router.push(`/assessment/${hiringProcess.id}/complete`)
    }
  }

  const handleBackToSelection = () => {
    setSelectedRound(null)
    setRoundState("selection")
    setRoundResult(null)
  }

  const renderRoundComponent = () => {
    if (roundState === "completed") {
      return (
        <RoundResults
          result={roundResult}
          onNext={handleNextRound}
          onBack={handleBackToSelection}
          isLastRound={selectedRound.sequence === hiringProcess.rounds.length}
        />
      )
    }

    const roundProps = {
      onComplete: handleRoundComplete,
      roundId: selectedRound.id,
      duration: selectedRound.duration,
      hiringProcessId: hiringProcess.id,
    }

    switch (selectedRound.roundType) {
      case "APTITUDE":
        return <AptitudeRound {...roundProps} />
      case "COMMUNICATION":
        return (
          <InterviewRound
            {...roundProps}
            userName={hiringProcess.user?.name || "User"}
            userRole={hiringProcess.predefinedAssessment?.name || "Candidate"}
          />
        )
      case "CODING":
        return <CodingRound {...roundProps} />
      case "TECHNICAL":
        return (
          <TechnicalRound
            {...roundProps}
          />
        )
      default:
        return (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6 text-center">
              <p>Round type not supported: {selectedRound.roundType}</p>
            </CardContent>
          </Card>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "NOT_STARTED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "IN_PROGRESS":
        return <Play className="h-4 w-4" />
      case "NOT_STARTED":
        return <Clock className="h-4 w-4" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  if (roundState === "active" || roundState === "completed") {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        {/* Assessment Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {hiringProcess.predefinedAssessment?.name || hiringProcess.customAssessment?.name}
                  </CardTitle>
                  <p className="text-gray-600">
                    Round {selectedRound.sequence} of {hiringProcess.rounds.length}: {selectedRound.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span>Monitoring Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Fullscreen Mode</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleBackToSelection}>
                    Back to Rounds
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {selectedRound.sequence} / {hiringProcess.rounds.length}
                  </span>
                </div>
                <Progress value={(selectedRound.sequence / hiringProcess.rounds.length) * 100} className="w-full" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Round Content */}
        {renderRoundComponent()}
      </div>
    )
  }

  // Round Selection Screen
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Assessment Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {hiringProcess.predefinedAssessment?.name || hiringProcess.customAssessment?.name}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {hiringProcess.predefinedAssessment?.description || hiringProcess.customAssessment?.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Duration</div>
                <div className="text-lg font-semibold">{hiringProcess.configSnapshot.totalDuration} minutes</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>
                  {hiringProcess.rounds.filter((r: any) => r.status === "COMPLETED").length} /{" "}
                  {hiringProcess.rounds.length} rounds completed
                </span>
              </div>
              <Progress
                value={
                  (hiringProcess.rounds.filter((r: any) => r.status === "COMPLETED").length /
                    hiringProcess.rounds.length) *
                  100
                }
                className="w-full"
              />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Rounds Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hiringProcess.rounds
            .sort((a: any, b: any) => a.sequence - b.sequence)
            .map((round: any) => (
              <Card
                key={round.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  round.status === "COMPLETED"
                    ? "border-green-200"
                    : round.status === "IN_PROGRESS"
                      ? "border-blue-200"
                      : "border-gray-200"
                }`}
                onClick={() => handleRoundSelect(round)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {round.sequence}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{round.name}</CardTitle>
                        <p className="text-sm text-gray-500">{round.roundType}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(round.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(round.status)}
                        <span className="text-xs">{round.status.replace("_", " ")}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {round.description && <p className="text-sm text-gray-600">{round.description}</p>}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{round.duration} minutes</span>
                      </div>
                      {round.timeSpent && (
                        <div className="text-gray-500">Spent: {Math.round(round.timeSpent / 60)} min</div>
                      )}
                    </div>
                    <div className="pt-2">
                      <Button
                        className="w-full"
                        variant={round.status === "COMPLETED" ? "outline" : "default"}
                        disabled={round.status === "LOCKED"}
                      >
                        {round.status === "COMPLETED"
                          ? "Review Round"
                          : round.status === "IN_PROGRESS"
                            ? "Continue Round"
                            : round.status === "LOCKED"
                              ? "Locked"
                              : "Start Round"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Assessment Actions */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Complete all rounds to finish your assessment</div>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Save & Exit
                  </Button>
                  {hiringProcess.rounds.every((r: any) => r.status === "COMPLETED") && (
                    <Button onClick={() => router.push(`/assessment/${hiringProcess.id}/complete`)}>
                      View Final Results
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
