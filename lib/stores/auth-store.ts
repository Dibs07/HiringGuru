import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiService } from '@/lib/services/api-service';
import { handleApiError } from '@/lib/utils/error-handler';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  authProvider: string;
  preferences?: any;
  isPrime: boolean;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
  profileCompleted: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          const user = await apiService.getProfile()
          set({
            user:user.user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: any) {
          if (error.status !== 401) {
            handleApiError(error);
          }
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          });
        }
      },

      login: (user) => {
        set({ user, isAuthenticated: true });
        toast.success(`Welcome back, ${user.name}!`);
      },

      logout: async () => {
        try {
          await apiService.logout();
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
          window.location.href = '/';
        } catch (error) {
          handleApiError(error);
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      refreshProfile: async () => {
        try {
          const user = await apiService.getProfile()
          set({
            // user,
            isAuthenticated: true,
          });
        } catch (error) {
          handleApiError(error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
