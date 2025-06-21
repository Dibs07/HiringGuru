'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useFullscreenMonitor } from '@/lib/hooks/use-fullscreen-monitor';

export function FullScreenHandler() {
  const [showWarning, setShowWarning] = useState(false);
  const [exitAttempts, setExitAttempts] = useState(0);
  const [isExited, setIsExited] = useState(false);
  const router = useRouter();

  const { stopMonitoring } = useFullscreenMonitor({
    onExitAttempt: () => {
      setExitAttempts((prev) => prev + 1);
      setShowWarning(true);

      // Auto-hide warning after 5 seconds
      setTimeout(() => setShowWarning(false), 5000);
    },
    maxAttempts: 3,
    onMaxAttemptsReached: () => {
      setIsExited(true);
      stopMonitoring();

      // Exit assessment after 3 seconds
      setTimeout(() => {
        router.push('/dashboard?assessment_exited=true');
      }, 3000);
    },
  });

  useEffect(() => {
    // Enter fullscreen on component mount
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    };

    enterFullscreen();

    // Cleanup on unmount
    return () => {
      stopMonitoring();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
    };
  }, [stopMonitoring]);

  if (isExited) {
    return (
      <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Assessment Terminated</h1>
          <p className="text-xl mb-4">
            You have exceeded the maximum number of exit attempts (3)
          </p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showWarning && (
        <Alert className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-96 border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Warning!</strong> Exit attempt {exitAttempts}/3 detected.
            {exitAttempts < 3
              ? ' Please stay in fullscreen mode.'
              : ' Next attempt will terminate the assessment.'}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
