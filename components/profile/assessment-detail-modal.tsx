'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';

interface AssessmentDetailModalProps {
  assessment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssessmentDetailModal({
  assessment,
  open,
  onOpenChange,
}: AssessmentDetailModalProps) {
  const getRoundStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'current':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {assessment.company} - {assessment.position} Assessment Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Assessment Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {assessment.overallScore || 'N/A'}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {assessment.rounds.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Rounds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {assessment.totalDuration}min
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <Badge
                    variant={
                      assessment.status === 'Completed'
                        ? 'default'
                        : assessment.status === 'Failed'
                          ? 'destructive'
                          : 'secondary'
                    }
                  >
                    {assessment.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {assessment.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {assessment.totalDuration} minutes
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Round-by-Round Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessment.rounds.map((round: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getRoundStatusColor(round.status)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{round.name}</h4>
                        {round.duration && (
                          <p className="text-sm opacity-75">
                            Duration: {round.duration} minutes
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {round.score && (
                          <div className="text-2xl font-bold">
                            {round.score}%
                          </div>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {round.status}
                        </Badge>
                      </div>
                    </div>

                    {round.score && (
                      <Progress value={round.score} className="h-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          {assessment.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-800">{assessment.feedback}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assessment.status === 'Failed' ? (
                  <>
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <p className="text-orange-800 font-medium">
                        Areas for Improvement:
                      </p>
                      <ul className="mt-2 text-orange-700 text-sm list-disc list-inside">
                        <li>Focus on technical problem-solving skills</li>
                        <li>Practice more coding challenges</li>
                        <li>
                          Review fundamental algorithms and data structures
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Strengths:</p>
                      <ul className="mt-2 text-green-700 text-sm list-disc list-inside">
                        <li>Strong communication skills</li>
                        <li>Good technical knowledge</li>
                        <li>Effective problem-solving approach</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
