'use client';

import { useEffect, useRef } from 'react';

interface UseFullscreenMonitorProps {
  onExitAttempt: () => void;
  maxAttempts?: number;
  onMaxAttemptsReached: () => void;
}

export function useFullscreenMonitor({
  onExitAttempt,
  maxAttempts = 3,
  onMaxAttemptsReached,
}: UseFullscreenMonitorProps) {
  const exitAttemptsRef = useRef(0);
  const isInAssessmentRef = useRef(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (!isInAssessmentRef.current) return;

      if (document.hidden) {
        exitAttemptsRef.current += 1;
        onExitAttempt();

        if (exitAttemptsRef.current >= maxAttempts) {
          onMaxAttemptsReached();
          return;
        }
      }
    };

    const handleFullscreenChange = () => {
      if (!isInAssessmentRef.current) return;

      if (!document.fullscreenElement) {
        exitAttemptsRef.current += 1;
        onExitAttempt();

        if (exitAttemptsRef.current >= maxAttempts) {
          onMaxAttemptsReached();
          return;
        }

        // Try to re-enter fullscreen after a short delay
        timeoutId = setTimeout(() => {
          document.documentElement.requestFullscreen().catch(console.error);
        }, 1000);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isInAssessmentRef.current) return;

      exitAttemptsRef.current += 1;
      if (exitAttemptsRef.current >= maxAttempts) {
        onMaxAttemptsReached();
      }

      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the assessment?';
      return e.returnValue;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onExitAttempt, maxAttempts, onMaxAttemptsReached]);

  const stopMonitoring = () => {
    isInAssessmentRef.current = false;
  };

  const getExitAttempts = () => exitAttemptsRef.current;

  return { stopMonitoring, getExitAttempts };
}
