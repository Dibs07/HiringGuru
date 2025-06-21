'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Camera } from 'lucide-react';
import { ScreeningRound } from './rounds/screening-round';
import { AptitudeRound } from './rounds/aptitude-round';
import { CommunicationRound } from './rounds/communication-round';
import { CodingRound } from './rounds/coding-round';
import { InterviewRound } from './rounds/interview-round';
import { RoundResults } from './round-results';
import { TechnicalRound } from './rounds/technical-round';

interface AssessmentInterfaceProps {
  hiringProcess: any;
  currentRound: any;
}

export function AssessmentInterface({
  hiringProcess,
  currentRound,
}: AssessmentInterfaceProps) {
  const [roundState, setRoundState] = useState<'active' | 'completed'>(
    'active'
  );
  const [roundResult, setRoundResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(
    currentRound?.duration * 60 || 0
  );

  const handleRoundComplete = (result: any) => {
    setRoundResult(result);
    setRoundState('completed');
  };
  const handleNextRound = () => {
    // Navigate to next round or complete assessment
    const nextRoundSequence = currentRound.sequence + 1;
    const totalRounds = hiringProcess.configSnapshot?.roundCount || 0;

    if (nextRoundSequence <= totalRounds) {
      currentRound.sequence = nextRoundSequence;
    } else {
      window.location.href = `/assessment/${hiringProcess.id}/complete`;
    }
  };

  const renderRoundComponent = () => {
    if (roundState === 'completed') {
      return (
        <RoundResults
          result={roundResult}
          onNext={handleNextRound}
          isLastRound={
            currentRound.sequence === hiringProcess.configSnapshot?.roundCount
          }
        />
      );
    }

    const roundProps = {
      roundId: currentRound.id,
      onComplete: handleRoundComplete,
      duration: currentRound.duration,
    };

    switch (currentRound.roundType) {
      case 'APTITUDE':
        return <AptitudeRound {...roundProps} />;
      case 'COMMUNICATION':
        return <CommunicationRound {...roundProps} />;
      case 'CODING':
        return <CodingRound {...roundProps} />;
      case 'TECHNICAL':
        return <TechnicalRound {...roundProps} />;
      case 'BEHAVIORAL':
        return <InterviewRound {...roundProps} />;
      case 'SYSTEM_DESIGN':
        return <InterviewRound {...roundProps} />;
      default:
        return (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6 text-center">
              <p>Round type not supported: {currentRound.roundType}</p>
            </CardContent>
          </Card>
        );
    }
  };

  const progress =
    ((currentRound.sequence - 1) /
      (hiringProcess.configSnapshot?.roundCount || 1)) *
    100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Assessment Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {hiringProcess.predefinedAssessment?.name ||
                    hiringProcess.customAssessment?.name}
                </CardTitle>
                <p className="text-gray-600">
                  Round {currentRound.sequence} of{' '}
                  {hiringProcess.configSnapshot?.roundCount}:{' '}
                  {currentRound.name}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4" />
                  <span>Monitoring Active</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Fullscreen Mode</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>
                  {currentRound.sequence} /{' '}
                  {hiringProcess.configSnapshot?.roundCount}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Round Content */}
      {renderRoundComponent()}
    </div>
  );
}
