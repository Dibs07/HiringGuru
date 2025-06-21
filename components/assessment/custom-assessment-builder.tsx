'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Play, Clock, Target } from 'lucide-react';
import { saveCustomAssessment } from '@/lib/mock-data';

interface CustomAssessmentBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentCreated?: () => void;
}

export function CustomAssessmentBuilder({
  open,
  onOpenChange,
  onAssessmentCreated,
}: CustomAssessmentBuilderProps) {
  const [assessmentName, setAssessmentName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [rounds, setRounds] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const roundTypes = [
    {
      value: 'screening',
      label: 'Screening Round',
      duration: 15,
      description: 'Skills assessment and eligibility check',
    },
    {
      value: 'aptitude',
      label: 'Aptitude Test',
      duration: 30,
      description: 'Logical reasoning and analytical thinking',
    },
    {
      value: 'communication',
      label: 'Communication Round',
      duration: 25,
      description: 'Verbal and written communication skills',
    },
    {
      value: 'coding',
      label: 'Coding Challenge',
      duration: 45,
      description: 'Programming problems and algorithms',
    },
    {
      value: 'technical',
      label: 'Technical Interview',
      duration: 30,
      description: 'In-depth technical discussion',
    },
    {
      value: 'behavioral',
      label: 'Behavioral Interview',
      duration: 25,
      description: 'Soft skills and cultural fit',
    },
    {
      value: 'system_design',
      label: 'System Design',
      duration: 40,
      description: 'Architecture and design thinking',
    },
  ];

  const addRound = () => {
    setRounds([
      ...rounds,
      {
        id: Date.now(),
        type: '',
        duration: 30,
        difficulty: 'medium',
        topics: [],
        description: '',
      },
    ]);
  };

  const removeRound = (id: number) => {
    setRounds(rounds.filter((round) => round.id !== id));
  };

  const updateRound = (id: number, field: string, value: any) => {
    setRounds(
      rounds.map((round) =>
        round.id === id ? { ...round, [field]: value } : round
      )
    );
  };

  const getTotalDuration = () => {
    return rounds.reduce((sum, round) => sum + (round.duration || 0), 0);
  };

  const saveAssessment = () => {
    const totalDuration = getTotalDuration();
    const roundNames = rounds.map((round) => {
      const roundType = roundTypes.find((rt) => rt.value === round.type);
      return roundType ? roundType.label : round.type;
    });

    const newAssessment = {
      name: assessmentName,
      description,
      difficulty,
      rounds: roundNames,
      roundsDetail: rounds.map((round) => ({
        ...round,
        name:
          roundTypes.find((rt) => rt.value === round.type)?.label || round.type,
      })),
      totalDuration,
      isCustom: true,
    };

    const savedAssessment = saveCustomAssessment(newAssessment);

    // Reset form
    setAssessmentName('');
    setDescription('');
    setDifficulty('medium');
    setRounds([]);
    setShowPreview(false);

    onAssessmentCreated?.();
    onOpenChange(false);

    // Start the assessment immediately
    window.location.href = `/assessment/custom-${savedAssessment.id}/start`;
  };

  const previewAssessment = () => {
    setShowPreview(true);
  };

  if (showPreview) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assessment Preview</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {assessmentName}
                  <Badge variant="outline" className="capitalize">
                    {difficulty}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {rounds.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Rounds</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {getTotalDuration()}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 capitalize">
                      {difficulty}
                    </div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Assessment Structure:</h4>
                  {rounds.map((round, index) => {
                    const roundType = roundTypes.find(
                      (rt) => rt.value === round.type
                    );
                    return (
                      <div
                        key={round.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h5 className="font-medium">{roundType?.label}</h5>
                            <p className="text-sm text-gray-600">
                              {roundType?.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {round.duration} min
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {round.difficulty}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Back to Edit
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveAssessment}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Create & Start Assessment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Assessment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Assessment Name *</Label>
                <Input
                  id="name"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  placeholder="e.g., Frontend Developer Challenge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this assessment covers and its objectives..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Overall Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      Easy - Entry level positions
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium - Mid-level positions
                    </SelectItem>
                    <SelectItem value="hard">
                      Hard - Senior level positions
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rounds Configuration */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">Assessment Rounds</CardTitle>
                <p className="text-sm text-gray-600">
                  Add and configure the rounds for your assessment
                </p>
              </div>
              <Button onClick={addRound} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Round
              </Button>
            </CardHeader>
            <CardContent>
              {rounds.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    No rounds added yet
                  </p>
                  <p className="text-sm">
                    Click "Add Round" to start building your assessment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rounds.map((round, index) => {
                    const selectedRoundType = roundTypes.find(
                      (rt) => rt.value === round.type
                    );
                    return (
                      <div
                        key={round.id}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center">
                              {index + 1}
                            </span>
                            Round {index + 1}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRound(round.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Round Type *</Label>
                            <Select
                              value={round.type}
                              onValueChange={(value) => {
                                updateRound(round.id, 'type', value);
                                const roundType = roundTypes.find(
                                  (rt) => rt.value === value
                                );
                                if (roundType) {
                                  updateRound(
                                    round.id,
                                    'duration',
                                    roundType.duration
                                  );
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select round type" />
                              </SelectTrigger>
                              <SelectContent>
                                {roundTypes.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {type.label}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {type.description}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {selectedRoundType && (
                              <p className="text-xs text-gray-600">
                                {selectedRoundType.description}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={round.duration}
                              onChange={(e) =>
                                updateRound(
                                  round.id,
                                  'duration',
                                  Number.parseInt(e.target.value)
                                )
                              }
                              min="5"
                              max="180"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Round Difficulty</Label>
                          <Select
                            value={round.difficulty}
                            onValueChange={(value) =>
                              updateRound(round.id, 'difficulty', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Focus Topics (comma-separated)</Label>
                          <Input
                            placeholder="e.g., JavaScript, React, Algorithms, Problem Solving"
                            onChange={(e) =>
                              updateRound(
                                round.id,
                                'topics',
                                e.target.value
                                  .split(',')
                                  .map((t) => t.trim())
                                  .filter((t) => t)
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}

                  {rounds.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          Total Assessment Duration:
                        </span>
                        <span className="font-bold text-blue-600">
                          {getTotalDuration()} minutes
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={previewAssessment}
                disabled={
                  !assessmentName || !description || rounds.length === 0
                }
              >
                Preview Assessment
              </Button>
              <Button
                onClick={saveAssessment}
                disabled={
                  !assessmentName || !description || rounds.length === 0
                }
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Create & Start
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
