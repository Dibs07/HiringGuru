"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useAssessmentStore } from "@/lib/stores/assessment-store"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/stores/auth-store"

interface CustomAssessmentBuilderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssessmentCreated: () => void
  editingAssessment?: any
}

const ROUND_TYPES = [
  { value: "APTITUDE", label: "Aptitude Test" },
  { value: "COMMUNICATION", label: "Communication" },
  { value: "CODING", label: "Coding Challenge" },
  { value: "TECHNICAL", label: "Technical Interview" },
  { value: "BEHAVIORAL", label: "Behavioral Interview" },
  { value: "SYSTEM_DESIGN", label: "System Design" },
]

export function CustomAssessmentBuilder({
  open,
  onOpenChange,
  onAssessmentCreated,
  editingAssessment,
}: CustomAssessmentBuilderProps) {
  const { createCustomAssessment, updateCustomAssessment, deleteCustomAssessment, isLoading } = useAssessmentStore()
  const { user } = useAuthStore()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    difficulty: "MEDIUM",
    rounds: [] as any[],
  })

  useEffect(() => {
    if (editingAssessment) {
      setFormData({
        name: editingAssessment.name,
        description: editingAssessment.description,
        difficulty: editingAssessment.difficulty,
        rounds: editingAssessment.rounds.map((round: any) => ({
          roundType: round.roundType,
          name: round.name,
          description: round.description || "",
          duration: round.duration,
          sequence: round.sequence,
          config: round.config || {},
        })),
      })
    } else {
      setFormData({
        name: "",
        description: "",
        difficulty: "MEDIUM",
        rounds: [],
      })
    }
  }, [editingAssessment, open])

  const addRound = () => {
    const newRound = {
      roundType: "APTITUDE",
      name: "New Round",
      description: "",
      duration: 30,
      sequence: formData.rounds.length + 1,
      config: {},
    }
    setFormData((prev) => ({
      ...prev,
      rounds: [...prev.rounds, newRound],
    }))
  }

  const updateRound = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.map((round, i) => (i === index ? { ...round, [field]: value } : round)),
    }))
  }

  const removeRound = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index).map((round, i) => ({ ...round, sequence: i + 1 })),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rounds.length === 0) {
      toast.error("Please add at least one round")
      return
    }

    const totalDuration = formData.rounds.reduce((sum, round) => sum + round.duration, 0)
    const assessmentData = {
      ...formData,
      userId: user?.id,
    }

    try {
      if (editingAssessment) {
        await updateCustomAssessment(editingAssessment.id, assessmentData)
        // Delete and redirect as requested
        await deleteCustomAssessment(editingAssessment.id)
        window.location.href = "/dashboard"
      } else {
        await createCustomAssessment(assessmentData)
      }
      onAssessmentCreated()
    } catch (error) {
      console.error("Failed to save assessment:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAssessment ? "Edit" : "Create"} Custom Assessment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Assessment Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Full Stack Developer Assessment"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this assessment evaluates..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Assessment Rounds</h3>
              <Button type="button" onClick={addRound} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Round
              </Button>
            </div>

            {formData.rounds.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-gray-500">
                  <p>No rounds added yet. Click "Add Round" to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.rounds.map((round, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Round {index + 1}</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeRound(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Round Type</Label>
                          <Select
                            value={round.roundType}
                            onValueChange={(value) => updateRound(index, "roundType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROUND_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Round Name</Label>
                          <Input
                            value={round.name}
                            onChange={(e) => updateRound(index, "name", e.target.value)}
                            placeholder="e.g., Technical Interview"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input
                            type="number"
                            value={round.duration}
                            onChange={(e) => updateRound(index, "duration", Number.parseInt(e.target.value) || 0)}
                            min="1"
                            max="180"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                          value={round.description}
                          onChange={(e) => updateRound(index, "description", e.target.value)}
                          placeholder="Describe what this round evaluates..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {formData.rounds.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span>Total Rounds: {formData.rounds.length}</span>
                <span>Total Duration: {formData.rounds.reduce((sum, round) => sum + round.duration, 0)} minutes</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : editingAssessment ? "Update Assessment" : "Create Assessment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
