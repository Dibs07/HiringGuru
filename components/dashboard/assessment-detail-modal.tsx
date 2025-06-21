'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  Calendar,
  Target,
  CheckCircle,
  XCircle,
  Minus,
} from 'lucide-react';

interface AssessmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hiringProcess: any;
}

export function AssessmentDetailModal({
  open,
  onOpenChange,
  hiringProcess,
}: AssessmentDetailModalProps) {
  if (!hiringProcess) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'NOT_STARTED':
        return <Minus className="h-4 w-4 text-gray-400" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {hiringProcess.predefinedAssessment?.name ||
              hiringProcess.customAssessment?.name ||
              'Assessment Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assessment Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {hiringProcess.configSnapshot?.roundCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Rounds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {hiringProcess.configSnapshot?.totalDuration || 0} min
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <Badge
                    className={getStatusColor(hiringProcess.status)}
                    variant="outline"
                  >
                    {hiringProcess.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    Started:{' '}
                    {new Date(hiringProcess.startedAt).toLocaleString()}
                  </span>
                </div>
                {hiringProcess.completedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>
                      Completed:{' '}
                      {new Date(hiringProcess.completedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>Current Round: {hiringProcess.currentRound}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Type: {hiringProcess.assessmentType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rounds Progress */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Round Progress</h3>
              <div className="space-y-3">
                {hiringProcess.rounds?.map((round: any, index: number) => (
                  <div
                    key={round.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {round.sequence}
                      </div>
                      <div>
                        <h4 className="font-medium">{round.name}</h4>
                        <p className="text-sm text-gray-600">
                          {round.roundType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="font-medium">{round.duration} min</div>
                        {round.timeSpent && (
                          <div className="text-gray-500">
                            Spent: {round.timeSpent} min
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(round.status)}
                        <Badge
                          className={getStatusColor(round.status)}
                          variant="outline"
                        >
                          {round.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Description */}
          {(hiringProcess.predefinedAssessment?.description ||
            hiringProcess.customAssessment?.description) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">
                  {hiringProcess.predefinedAssessment?.description ||
                    hiringProcess.customAssessment?.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
