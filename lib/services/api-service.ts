class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000"
  private aiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new Error(errorData.message || `API Error: ${response.statusText}`)
      ;(error as any).status = response.status
      ;(error as any).data = errorData
      throw error
    }

    return response.json()
  }

  async aiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.aiBaseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const error = new Error(errorData.message || `AI API Error: ${response.statusText}`)
      ;(error as any).status = response.status
      ;(error as any).data = errorData
      throw error
    }

    return response.json()
  }

  // Auth endpoints
  async login(provider: string) {
    return this.request("/api/user/auth/login", {
      method: "POST",
      body: JSON.stringify({ provider }),
    })
  }

  async logout() {
    return this.request("/api/user/auth/logout", {
      method: "POST",
    })
  }

  async getProfile() {
    return this.request("/api/user/profile")
  }

  // GitHub Integration
  async getGitHubProfile(username: string) {
    return this.request(`/api/user/github/${username}`)
  }

  async submitUserAnalysis(data: any) {
    return this.request("/api/user/analysis", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Hiring Process endpoints
  async getHiringProcesses() {
    return this.request("/api/hiring-processes")
  }

  async getHiringProcess(id: string) {
    return this.request(`/api/hiring-processes/${id}`)
  }

  async startHiringProcess(assessmentType: "PREDEFINED" | "CUSTOM", assessmentId: string) {
    const payload = {
      assessmentType,
      ...(assessmentType === "PREDEFINED"
        ? { predefinedAssessmentId: assessmentId }
        : { customAssessmentId: assessmentId }),
    }

    return this.request("/api/hiring-processes/start", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async terminateAssessment(id: string) {
    return this.request(`/api/hiring-processes/${id}`, {
      method: "DELETE",
    })
  }

  // Custom Assessment endpoints
  async getCustomAssessments() {
    return this.request("/api/custom-assessments")
  }

  async getCustomAssessment(id: string) {
    return this.request(`/api/custom-assessments/${id}`)
  }

  async createCustomAssessment(data: any) {
    return this.request("/api/custom-assessments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCustomAssessment(id: string, data: any) {
    return this.request(`/api/custom-assessments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCustomAssessment(id: string) {
    return this.request(`/api/custom-assessments/${id}`, {
      method: "DELETE",
    })
  }

  // Predefined Assessment endpoints
  async getPredefinedAssessments() {
    return this.request("/api/predefined-assessments")
  }

  async getPredefinedAssessment(id: string) {
    return this.request(`/api/predefined-assessments/${id}`)
  }

  // Round endpoints
  async generateQuestions(payload: any) {
    return this.request("/api/rounds/generate-questions", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async submitAnswers(payload: any) {
    return this.request("/api/rounds/submit-answers", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // AI Interview endpoints
  async startInterview(payload: { user_name: string; user_role: string; round_id: string }) {
    return this.aiRequest("/greeting", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getAIResponse(payload: { session_id: string; question_number: number; user_transcript: string }) {
    return this.aiRequest("/ai-response", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getConversation(sessionId: string) {
    return this.aiRequest(`/conversation/${sessionId}`)
  }
}

export const apiService = new ApiService()
