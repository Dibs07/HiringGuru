"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserOnboarding } from "@/components/onboarding/user-onboarding"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Onboarding useEffect:', { 
      isAuthenticated, 
      isInitialized,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        profileCompleted: user.profileCompleted
      } : null 
    });
    
    // Wait for auth to be initialized
    if (!isInitialized) {
      return
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      router.push("/login")
      return
    }

    // Check if user already completed onboarding - be very specific about the check
    if (user && user.profileCompleted === true) {
      console.log('User profile already completed, redirecting to dashboard');
      router.push("/dashboard")
      return
    }

    console.log('User can access onboarding page');
    setIsLoading(false)
  }, [isAuthenticated, isInitialized, user?.profileCompleted, router])

  const handleOnboardingComplete = async (data: any) => {
    try {
      // Update the user's profile completion status
      const { updateUser, refreshProfile } = useAuthStore.getState();
      updateUser({ profileCompleted: true });
      
      // Also refresh profile from server to sync
      await refreshProfile();
      
      toast.success("Welcome to Hiring Guru! Your profile has been set up successfully.")
      router.push("/dashboard")
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("There was an issue completing setup, but you can proceed to dashboard");
      router.push("/dashboard")
    }
  }

  const handleSkipOnboarding = () => {
    // Update the user's profile completion status even when skipping
    const { updateUser } = useAuthStore.getState();
    updateUser({ profileCompleted: true });
    
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Loading onboarding...</p>
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-500">
            <p>Auth initialized: {isInitialized ? 'Yes' : 'No'}</p>
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Profile completed: {user?.profileCompleted?.toString() || 'undefined'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Debug panel - remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 z-50 bg-black bg-opacity-75 text-white p-2 text-xs">
          <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>
          <div>Profile Complete: {user?.profileCompleted?.toString() || 'undefined'}</div>
          <div>User ID: {user?.id || 'None'}</div>
          <button 
            onClick={() => {
              const { updateUser } = useAuthStore.getState();
              updateUser({ profileCompleted: false });
              console.log('Manually set profileCompleted to false');
            }}
            className="bg-red-600 px-2 py-1 rounded mt-1"
          >
            Force Reset Profile
          </button>
        </div>
      )}
      <UserOnboarding onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} />
    </div>
  )
}
