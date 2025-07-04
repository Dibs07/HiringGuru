"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, RotateCcw, Calendar, Play } from "lucide-react"
import { useAssessmentStore } from "@/lib/stores/assessment-store"
import { AssessmentDetailModal } from "./assessment-detail-modal"

export function RecentAssessments() {
  const { hiringProcesses, isLoading, fetchHiringProcesses, getHiringProcess } = useAssessmentStore()
  const [selectedProcess, setSelectedProcess] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchHiringProcesses()
  }, [fetchHiringProcesses])

  const handleView = async (processId: string) => {
    try {
      const process = await getHiringProcess(processId)
      setSelectedProcess(process)
      setShowDetailModal(true)
    } catch (error) {
      console.error("Failed to fetch process details:", error)
    }
  }

  const handleContinue = async (processId: string) => {
    try {
      const process = await getHiringProcess(processId)
      // Redirect to assessment with the fetched process data
      window.location.href = `/assessment/${processId}/start`
    } catch (error) {
      console.error("Failed to continue assessment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "ABANDONED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hiringProcesses.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
              <p className="text-gray-600 mb-4">Start your first assessment to see your progress here</p>
              <Button asChild>
                <a href="#predefined-assessments">Browse Assessments</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {hiringProcesses.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">
                        {process.predefinedAssessment?.name || process.customAssessment?.name || "Assessment"}
                      </h4>
                      <Badge className={getStatusColor(process.status)}>
                        {process.status.replace("_", " ").toLowerCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Round {process.currentRound} of {process.configSnapshot?.roundCount || 0}
                      </span>
                      <span>Started: {new Date(process.startedAt || "").toLocaleDateString()}</span>
                      {process.completedAt && (
                        <span>Completed: {new Date(process.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(process.id)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {process.status === "IN_PROGRESS" && (
                      <Button variant="outline" size="sm" onClick={() => handleContinue(process.id)}>
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    )}
                    {process.status === "COMPLETED" && (
                      <Button variant="outline" size="sm" onClick={() => handleContinue(process.id)}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AssessmentDetailModal open={showDetailModal} onOpenChange={setShowDetailModal} hiringProcess={selectedProcess} />
    </>
  )
}
