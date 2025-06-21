'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AssessmentInterface } from '@/components/assessment/assessment-interface';
import { FullScreenHandler } from '@/components/assessment/fullscreen-handler';
import { CameraPermission } from '@/components/assessment/camera-permission';
import { PreparationScreen } from '@/components/assessment/preparation-screen';
import { useAssessmentStore } from '@/lib/stores/assessment-store';

export default function AssessmentStartPage() {
  const params = useParams();
  const { getHiringProcess } = useAssessmentStore();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [hiringProcess, setHiringProcess] = useState<any>(null);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [showPreparation, setShowPreparation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHiringProcess();
  }, [params.id]);

const loadHiringProcess = async () => {
  try {
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const process = await getHiringProcess(params.id as string);
        setHiringProcess(process);

        const current = process.rounds?.find(
          (r: any) => r.sequence === process.currentRound
        );
        if (current) {
          setCurrentRound(current);
          if (current.status === 'NOT_STARTED') {
            setShowPreparation(true);
          }
        }
      } catch (err) {
        console.error('Failed to load hiring process inside timeout:', err);
      } finally {
        setIsLoading(false); // ✅ Only here
      }
    }, 2000); // Simulated loading delay
  } catch (error) {
    console.error('Failed to load hiring process:', error);
  }
};


  const handleSkipPreparation = () => {
    setShowPreparation(false);
  };

  const handleContinueToRound = () => {
    setShowPreparation(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!hiringProcess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assessment Not Found
          </h1>
          <p className="text-gray-600">
            The assessment you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Show preparation screen
  if (showPreparation && currentRound) {
    return (
      <PreparationScreen
        roundType={currentRound.roundType}
        roundName={currentRound.name}
        duration={currentRound.duration}
        onSkip={handleSkipPreparation}
        onContinue={handleContinueToRound}
      />
    );
  }

  if (!permissionsGranted) {
    return (
      <CameraPermission
        onPermissionsGranted={() => setPermissionsGranted(true)}
        assessment={hiringProcess}
      />
    );
  }

  return (
    <div className="assessment-mode">
      <style jsx global>{`
        .assessment-mode nav {
          display: none !important;
        }
      `}</style>
      <FullScreenHandler />
      <AssessmentInterface
        hiringProcess={hiringProcess}
        currentRound={currentRound}
      />
    </div>
  );
}
