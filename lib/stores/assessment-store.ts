import { create } from 'zustand';
import { apiService } from '@/lib/services/api-service';
import { handleApiError } from '@/lib/utils/error-handler';
import { toast } from 'sonner';

interface HiringProcess {
  id: string;
  userId: string;
  assessmentType: 'PREDEFINED' | 'CUSTOM';
  predefinedAssessmentId?: string;
  customAssessmentId?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  currentRound: number;
  isCompleted: boolean;
  isLocked: boolean;
  lockedAt?: string;
  configSnapshot: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  rounds: any[];
  predefinedAssessment?: any;
  customAssessment?: any;
  finalAssessment?: any;
}

interface PredefinedAssessment {
  id: string;
  name: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  isActive: boolean;
  isPrime: boolean;
  totalDuration: number;
  roundCount: number;
  rounds: any[];
}

interface CustomAssessment {
  id: string;
  userId: string;
  name: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  totalDuration: number;
  roundCount: number;
  isTemplate: boolean;
  rounds: any[];
  _count?: { hiringProcesses: number };
}

interface AssessmentState {
  hiringProcesses: HiringProcess[];
  predefinedAssessments: PredefinedAssessment[];
  customAssessments: CustomAssessment[];
  currentProcess: HiringProcess | null;
  isLoading: boolean;

  // Actions
  fetchHiringProcesses: () => Promise<void>;
  fetchPredefinedAssessments: () => Promise<void>;
  fetchCustomAssessments: () => Promise<void>;
  getHiringProcess: (id: string) => Promise<HiringProcess>;
  getPredefinedAssessment: (id: string) => Promise<PredefinedAssessment>;
  getCustomAssessment: (id: string) => Promise<CustomAssessment>;
  startAssessment: (
    type: 'PREDEFINED' | 'CUSTOM',
    assessmentId: string
  ) => Promise<HiringProcess>;
  createCustomAssessment: (data: any) => Promise<void>;
  updateCustomAssessment: (id: string, data: any) => Promise<void>;
  deleteCustomAssessment: (id: string) => Promise<void>;
  setCurrentProcess: (process: HiringProcess | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  hiringProcesses: [],
  predefinedAssessments: [],
  customAssessments: [],
  currentProcess: null,
  isLoading: false,

  fetchHiringProcesses: async () => {
    try {
      set({ isLoading: true });
      const processes = await apiService.getHiringProcesses();
      set({ hiringProcesses: processes, isLoading: false });
    } catch (error) {
      handleApiError(error);
      set({ hiringProcesses: [], isLoading: false });
    }
  },

  fetchPredefinedAssessments: async () => {
    try {
      set({ isLoading: true });
      const assessments = await apiService.getPredefinedAssessments();
      set({ predefinedAssessments: assessments, isLoading: false });
    } catch (error) {
      handleApiError(error);
      set({ predefinedAssessments: [], isLoading: false });
    }
  },

  fetchCustomAssessments: async () => {
    try {
      set({ isLoading: true });
      const assessments = await apiService.getCustomAssessments();
      set({ customAssessments: assessments, isLoading: false });
    } catch (error) {
      handleApiError(error);
      set({ customAssessments: [], isLoading: false });
    }
  },

  getHiringProcess: async (id: string) => {
    try {
      const process = await apiService.getHiringProcess(id);
      return process;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getPredefinedAssessment: async (id: string) => {
    try {
      const assessment = await apiService.getPredefinedAssessment(id);
      return assessment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  getCustomAssessment: async (id: string) => {
    try {
      const assessment = await apiService.getCustomAssessment(id);
      return assessment;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  startAssessment: async (
    type: 'PREDEFINED' | 'CUSTOM',
    assessmentId: string
  ) => {
    try {
      set({ isLoading: true });
      const process = await apiService.startHiringProcess(type, assessmentId);
      const currentProcesses = get().hiringProcesses;
      set({
        hiringProcesses: [...currentProcesses, process],
        currentProcess: process,
        isLoading: false,
      });
      toast.success('Assessment started successfully!');
      return process;
    } catch (error) {
      handleApiError(error);
      set({ isLoading: false });
      throw error;
    }
  },

  createCustomAssessment: async (data) => {
    try {
      set({ isLoading: true });
      const newAssessment = await apiService.createCustomAssessment(data);
      const currentCustom = get().customAssessments;
      set({
        customAssessments: [...currentCustom, newAssessment],
        isLoading: false,
      });
      toast.success('Custom assessment created successfully!');
    } catch (error) {
      handleApiError(error);
      set({ isLoading: false });
    }
  },

  updateCustomAssessment: async (id, data) => {
    try {
      set({ isLoading: true });
      const updatedAssessment = await apiService.updateCustomAssessment(
        id,
        data
      );
      const currentCustom = get().customAssessments;
      set({
        customAssessments: currentCustom.map((a) =>
          a.id === id ? updatedAssessment : a
        ),
        isLoading: false,
      });
      toast.success('Assessment updated successfully!');
    } catch (error) {
      handleApiError(error);
      set({ isLoading: false });
    }
  },

  deleteCustomAssessment: async (id) => {
    try {
      await apiService.deleteCustomAssessment(id);
      const currentCustom = get().customAssessments;
      set({
        customAssessments: currentCustom.filter((a) => a.id !== id),
      });
      toast.success('Assessment deleted successfully!');
    } catch (error) {
      handleApiError(error);
    }
  },

  setCurrentProcess: (process) => {
    set({ currentProcess: process });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
