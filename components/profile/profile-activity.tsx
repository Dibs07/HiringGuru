'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
} from 'lucide-react';
import { getAssessmentHistory } from '@/lib/mock-data';
import { AssessmentDetailModal } from '@/components/profile/assessment-detail-modal';

export function ProfileActivity() {
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  useEffect(() => {
    setAssessmentHistory(getAssessmentHistory());
  }, []);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            Completed
          </Badge>
        );
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoundStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'current':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessmentHistory.map((assessment) => (
              <div
                key={assessment.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getStatusIcon(assessment.status)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {assessment.company} - {assessment.position}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {assessment.date} • {assessment.totalDuration} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(assessment.status)}
                    {assessment.overallScore && (
                      <span
                        className={`font-medium text-sm ${
                          assessment.overallScore >= 80
                            ? 'text-green-600'
                            : assessment.overallScore >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {assessment.overallScore}%
                      </span>
                    )}
                  </div>
                </div>

                {assessment.overallScore && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Performance</span>
                      <span>{assessment.overallScore}%</span>
                    </div>
                    <Progress value={assessment.overallScore} className="h-2" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(assessment.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {expandedItems.has(assessment.id) ? (
                      <>
                        Hide Details <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show Details <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Report
                  </Button>
                </div>

                {expandedItems.has(assessment.id) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <h5 className="font-medium">Round-by-Round Performance:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {assessment.rounds.map((round: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div>
                            <span className="font-medium">{round.name}</span>
                            {round.duration && (
                              <span className="text-sm text-gray-500 ml-2">
                                ({round.duration}min)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {round.score && (
                              <span
                                className={`font-medium ${getRoundStatusColor(round.status)}`}
                              >
                                {round.score}%
                              </span>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRoundStatusColor(round.status)}`}
                            >
                              {round.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {assessment.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                          {assessment.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedAssessment && (
        <AssessmentDetailModal
          assessment={selectedAssessment}
          open={!!selectedAssessment}
          onOpenChange={() => setSelectedAssessment(null)}
        />
      )}
    </>
  );
}
