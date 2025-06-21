import { toast } from "sonner";

class ApiService {
  private baseUrl =
    process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:5000';

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(
        errorData.message || `API Error: ${response.statusText}`
      );
      return;
    }

    return response.json();
  }

  // Auth endpoints
  async login(provider: string) {
    return this.request('/api/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({ provider }),
    });
  }

  async logout() {
    return this.request('/api/user/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/api/user/profile');
  }

  // Hiring Process endpoints
  async getHiringProcesses() {
    return this.request('/api/hiring-processes');
  }

  async getHiringProcess(id: string) {
    return this.request(`/api/hiring-processes/${id}`);
  }

  async startHiringProcess(
    assessmentType: 'PREDEFINED' | 'CUSTOM',
    assessmentId: string
  ) {
    const payload = {
      assessmentType,
      ...(assessmentType === 'PREDEFINED'
        ? { predefinedAssessmentId: assessmentId }
        : { customAssessmentId: assessmentId }),
    };

    return this.request('/api/hiring-processes/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Custom Assessment endpoints
  async getCustomAssessments() {
    return this.request('/api/custom-assessments');
  }

  async getCustomAssessment(id: string) {
    return this.request(`/api/custom-assessments/${id}`);
  }

  async createCustomAssessment(data: any) {
    return this.request('/api/custom-assessments/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomAssessment(id: string, data: any) {
    return this.request(`/api/custom-assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomAssessment(id: string) {
    return this.request(`/api/custom-assessments/${id}`, {
      method: 'DELETE',
    });
  }

  // Predefined Assessment endpoints
  async getPredefinedAssessments() {
    return this.request('/api/predefined-assessments');
  }

  async getPredefinedAssessment(id: string) {
    return this.request(`/api/predefined-assessments/${id}`);
  }
}

export const apiService = new ApiService();
