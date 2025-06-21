"use client"

import { useEffect, useRef, useCallback } from "react"

interface FullscreenMonitorOptions {
  onExitAttempt: () => void
  maxAttempts: number
  onMaxAttemptsReached: () => void
  onTerminate?: () => void
}

export function useFullscreenMonitor({
  onExitAttempt,
  maxAttempts,
  onMaxAttemptsReached,
  onTerminate,
}: FullscreenMonitorOptions) {
  const attemptsRef = useRef(0)
  const isMonitoringRef = useRef(false)

  const handleFullscreenChange = useCallback(() => {
    if (!isMonitoringRef.current) return

    if (!document.fullscreenElement) {
      attemptsRef.current += 1
      onExitAttempt()

      if (attemptsRef.current >= maxAttempts) {
        onMaxAttemptsReached()
        if (onTerminate) {
          onTerminate()
        }
      }
    }
  }, [onExitAttempt, maxAttempts, onMaxAttemptsReached, onTerminate])

  const startMonitoring = useCallback(() => {
    isMonitoringRef.current = true
    document.addEventListener("fullscreenchange", handleFullscreenChange)
  }, [handleFullscreenChange])

  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false
    document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [handleFullscreenChange])

  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [stopMonitoring])

  return {
    startMonitoring,
    stopMonitoring,
    currentAttempts: attemptsRef.current,
  }
}
