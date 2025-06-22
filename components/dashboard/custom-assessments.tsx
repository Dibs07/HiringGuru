'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Settings, Trash2, FileText } from 'lucide-react';
import { useAssessmentStore } from '@/lib/stores/assessment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { CustomAssessmentBuilder } from '@/components/assessment/custom-assessment-builder';

export function CustomAssessments() {
  const {
    customAssessments,
    isLoading,
    fetchCustomAssessments,
    deleteCustomAssessment,
    startAssessment,
  } = useAssessmentStore();
  const { user } = useAuthStore();
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    fetchCustomAssessments();
  }, [fetchCustomAssessments]);

  const handleStartAssessment = async (assessment: any) => {
    try {
      const process = await startAssessment('CUSTOM', assessment.id);
      window.location.href = `/assessment/${process.id}/start`;
    } catch (error) {
      console.error('Failed to start assessment:', error);
    }
  };

  const handleEditAssessment = (assessment: any) => {
    // TODO: Implement edit functionality
    console.log('Edit assessment:', assessment);
  };

  const handleDeleteAssessment = async (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        await deleteCustomAssessment(id);
      } catch (error) {
        console.error('Failed to delete assessment:', error);
      }
    }
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
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Custom Assessments
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Custom Assessments
            </span>
            <Button size="sm" onClick={() => setShowBuilder(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customAssessments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No custom assessments
              </h3>
              <p className="text-gray-600 mb-4">
                Create your own assessments tailored to your needs
              </p>
              <Button onClick={() => setShowBuilder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {customAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{assessment.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {assessment.description}
                      </p>
                    </div>
                    <Badge
                      className={getDifficultyColor(assessment.difficulty)}
                    >
                      {assessment.difficulty.toLowerCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{assessment.roundCount} rounds</span>
                      <span>{assessment.totalDuration} min</span>
                      <span>
                        Used {assessment._count?.hiringProcesses || 0} times
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartAssessment(assessment)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAssessment(assessment)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CustomAssessmentBuilder
        open={showBuilder}
        onOpenChange={setShowBuilder}
        onAssessmentCreated={() => {
          setShowBuilder(false);
          fetchCustomAssessments();
        }}
      />
    </>
  );
}
