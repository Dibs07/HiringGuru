'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Lock, Clock, Users, Target } from 'lucide-react';
import { useAssessmentStore } from '@/lib/stores/assessment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { AssessmentModal } from '@/components/assessment/assessment-modal';

export function PredefinedAssessments() {
  const {
    predefinedAssessments,
    isLoading,
    fetchPredefinedAssessments,
    startAssessment,
  } = useAssessmentStore();
  const { user } = useAuthStore();
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  useEffect(() => {
    fetchPredefinedAssessments();
  }, [fetchPredefinedAssessments]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
console.log(predefinedAssessments)
  const handleStartAssessment = (assessment: any) => {
    if (assessment.isPrime && !user?.isPrime) {
        setShowUpgradeModal(true);
      return;
    }
    setSelectedAssessment(assessment);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predefined Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    {
      showUpgradeModal && (
        <AssessmentModal
          assessment={selectedAssessment}
          open={showUpgradeModal}
          onOpenChange={() => setShowUpgradeModal(false)}
        />
      )
    }
      <Card id="predefined-assessments">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Predefined Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {predefinedAssessments.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assessments available
              </h3>
              <p className="text-gray-600">
                Check back later for new assessments
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predefinedAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {assessment.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {assessment.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {assessment.isPrime && (
                        <Badge
                          variant={user?.isPrime ? 'default' : 'secondary'}
                        >
                          {user?.isPrime ? (
                            'Prime'
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Premium
                            </>
                          )}
                        </Badge>
                      )}
                      <Badge
                        className={getDifficultyColor(assessment.difficulty)}
                      >
                        {assessment.difficulty.toLowerCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {assessment.totalDuration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {assessment.roundCount} rounds
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleStartAssessment(assessment)}
                    disabled={assessment.isPrime && !user?.isPrime}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          open={!!selectedAssessment}
          onOpenChange={() => setSelectedAssessment(null)}
        />
      )}
    </>
  );
}
