'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Camera, Monitor, AlertTriangle, Play } from 'lucide-react';
import { useAssessmentStore } from '@/lib/stores/assessment-store';
import { toast } from 'sonner';

interface AssessmentModalProps {
  assessment: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssessmentModal({
  assessment,
  open,
  onOpenChange,
}: AssessmentModalProps) {
  const [loading, setLoading] = useState(false);
  const { startAssessment } = useAssessmentStore();
  const [currentStep, setCurrentStep] = useState('overview');

const handleStartAssessment = async () => {
  try {
    setLoading(true);
    const hiringProcess = await startAssessment('PREDEFINED', assessment.id);
    window.location.href = `/assessment/${hiringProcess.id}/start`;
  } catch (error) {
    console.error('Failed to start assessment:', error);
    toast.error('Failed to start assessment. Please try again later.');
    setCurrentStep('overview');
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {assessment.name} - {assessment.position || 'Assessment'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assessment Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {assessment.rounds?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Rounds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {assessment.totalDuration || 0} min
                  </div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {assessment.difficulty}
                  </Badge>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{assessment.description}</p>
            </CardContent>
          </Card>

          {/* Rounds Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Assessment Rounds</h3>
              <div className="space-y-3">
                {assessment.rounds?.map((round: any, index: number) => (
                  <div
                    key={round.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{round.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {round.roundType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {round.duration} min
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Instructions */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-orange-800">
                    Important Instructions
                  </h3>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Camera will be enabled during the assessment (no recording)
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Full-screen mode will be automatically activated
                    </li>
                    <li>• Exiting full-screen will trigger warnings</li>
                    <li>• Each round must be completed in sequence</li>
                    <li>• You cannot go back to previous rounds</li>
                    <li>• Ensure stable internet connection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          {loading ?       <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div> : <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={handleStartAssessment}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Assessment
            </Button>
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
