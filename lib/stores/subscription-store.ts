import { create } from 'zustand';
import { apiService } from '@/lib/services/api-service';
import { toast } from 'sonner';

interface SubscriptionLimits {
  assessmentsPerMonth: number;
  customAssessments: number;
  aiInterviews: number;
  detailedReports: boolean;
  prioritySupport: boolean;
}

interface SubscriptionState {
  isPrime: boolean;
  plan: string | null;
  limits: SubscriptionLimits;
  usage: {
    assessmentsThisMonth: number;
    customAssessmentsCreated: number;
    aiInterviewsUsed: number;
  };
  isLoading: boolean;

  // Actions
  fetchSubscriptionStatus: () => Promise<void>;
  createPaymentOrder: (
    plan: string,
    billing: 'monthly' | 'annual'
  ) => Promise<any>;
  verifyPayment: (paymentData: any) => Promise<void>;
  checkFeatureAccess: (feature: string) => boolean;
  incrementUsage: (feature: string) => void;
  setLoading: (loading: boolean) => void;
}

const FREE_LIMITS: SubscriptionLimits = {
  assessmentsPerMonth: 3,
  customAssessments: 1,
  aiInterviews: 1,
  detailedReports: false,
  prioritySupport: false,
};

const PRIME_LIMITS: SubscriptionLimits = {
  assessmentsPerMonth: -1, // Unlimited
  customAssessments: -1, // Unlimited
  aiInterviews: -1, // Unlimited
  detailedReports: true,
  prioritySupport: true,
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isPrime: false,
  plan: null,
  limits: FREE_LIMITS,
  usage: {
    assessmentsThisMonth: 0,
    customAssessmentsCreated: 0,
    aiInterviewsUsed: 0,
  },
  isLoading: false,

  fetchSubscriptionStatus: async () => {
    try {
      set({ isLoading: true });
      const status = await apiService.getSubscriptionStatus();
      set({
        isPrime: status.isPrime,
        plan: status.plan,
        limits: status.isPrime ? PRIME_LIMITS : FREE_LIMITS,
        usage: status.usage,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      set({
        isPrime: false,
        plan: null,
        limits: FREE_LIMITS,
        usage: {
          assessmentsThisMonth: 0,
          customAssessmentsCreated: 0,
          aiInterviewsUsed: 0,
        },
        isLoading: false,
      });
    }
  },

  createPaymentOrder: async (plan, billing) => {
    try {
      set({ isLoading: true });
      const order = await apiService.createPaymentOrder(plan, billing);
      set({ isLoading: false });
      return order;
    } catch (error) {
      console.error('Failed to create payment order:', error);
      toast.error('Failed to create payment order');
      set({ isLoading: false });
      throw error;
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      set({ isLoading: true });
      await apiService.verifyPayment(paymentData);
      // Refresh subscription status after successful payment
      await get().fetchSubscriptionStatus();
      toast.success('Payment successful! Welcome to Prime!');
      set({ isLoading: false });
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Payment verification failed');
      set({ isLoading: false });
      throw error;
    }
  },

  checkFeatureAccess: (feature) => {
    const { isPrime, limits, usage } = get();

    switch (feature) {
      case 'assessment':
        return (
          isPrime || usage.assessmentsThisMonth < limits.assessmentsPerMonth
        );
      case 'custom_assessment':
        return (
          isPrime || usage.customAssessmentsCreated < limits.customAssessments
        );
      case 'ai_interview':
        return isPrime || usage.aiInterviewsUsed < limits.aiInterviews;
      case 'detailed_reports':
        return limits.detailedReports;
      case 'priority_support':
        return limits.prioritySupport;
      default:
        return false;
    }
  },

  incrementUsage: (feature) => {
    const currentUsage = get().usage;
    switch (feature) {
      case 'assessment':
        set({
          usage: {
            ...currentUsage,
            assessmentsThisMonth: currentUsage.assessmentsThisMonth + 1,
          },
        });
        break;
      case 'custom_assessment':
        set({
          usage: {
            ...currentUsage,
            customAssessmentsCreated: currentUsage.customAssessmentsCreated + 1,
          },
        });
        break;
      case 'ai_interview':
        set({
          usage: {
            ...currentUsage,
            aiInterviewsUsed: currentUsage.aiInterviewsUsed + 1,
          },
        });
        break;
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
