"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserOnboarding } from "@/components/onboarding/user-onboarding"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Check if user already completed onboarding
    if (user?.profileCompleted) {
      router.push("/dashboard")
      return
    }

    setIsLoading(false)
  }, [isAuthenticated, user, router])

  const handleOnboardingComplete = (data: any) => {
    toast.success("Welcome to Hiring Guru! Your profile has been set up successfully.")
    router.push("/dashboard")
  }

  const handleSkipOnboarding = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <UserOnboarding onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
}
