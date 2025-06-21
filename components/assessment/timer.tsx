'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  onTimeUpdate: (time: number) => void;
}

export function Timer({ initialTime, onTimeUp, onTimeUpdate }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
        isCritical
          ? 'bg-red-100 text-red-700'
          : isLowTime
            ? 'bg-orange-100 text-orange-700'
            : 'bg-blue-100 text-blue-700'
      }`}
    >
      <Clock className="h-4 w-4" />
      {formatTime(timeLeft)}
    </div>
  );
}
