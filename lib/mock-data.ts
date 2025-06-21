// Mock data for development - replace with actual API calls
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Prime Features Configuration
export const PRIME_FEATURES = {
  unlimitedAssessments: true,
  customAssessmentBuilder: true,
  advancedAnalytics: true,
  interviewRecording: true,
  prioritySupport: true,
  allCompanySimulations: true,
  personalizedPreparation: true,
  detailedFeedback: true,
  progressTracking: true,
  exportResults: true,
  aiMentorship: true,
  practiceScheduling: true,
};

export const FREE_FEATURES = {
  unlimitedAssessments: false, // 3 per month
  customAssessmentBuilder: false,
  advancedAnalytics: false, // Basic only
  interviewRecording: false,
  prioritySupport: false,
  allCompanySimulations: false, // 5 companies only
  personalizedPreparation: false,
  detailedFeedback: false, // Basic feedback only
  progressTracking: true,
  exportResults: false,
  aiMentorship: false,
  practiceScheduling: false,
};

// User Profile Management
export const getUserProfile = () => {
  if (USE_MOCK_DATA) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userProfile');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
  // Real API call would go here
};

export const saveUserProfile = (profile: any) => {
  if (USE_MOCK_DATA) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    return profile;
  }
  // Real API call would go here
};

export const isUserLoggedIn = () => {
  if (USE_MOCK_DATA) {
    return getUserProfile() !== null;
  }
  // Real auth check would go here
};

// Assessment History with detailed stats
export const getAssessmentHistory = () => {
  if (USE_MOCK_DATA) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('assessmentHistory');
      return stored ? JSON.parse(stored) : mockAssessmentHistory;
    }
    return mockAssessmentHistory;
  }
  // Real API call would go here
};

export const saveAssessmentResult = (result: any) => {
  if (USE_MOCK_DATA) {
    const history = getAssessmentHistory();
    const newResult = {
      ...result,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newResult, ...history];
    localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
    return newResult;
  }
  // Real API call would go here
};

const mockAssessmentHistory = [
  {
    id: 1,
    company: 'Amazon',
    position: 'SDE 1',
    date: '2024-01-15',
    status: 'Completed',
    overallScore: 85,
    rounds: [
      { name: 'Screening', score: 90, status: 'passed', duration: 15 },
      { name: 'Aptitude', score: 82, status: 'passed', duration: 30 },
      { name: 'Communication', score: 88, status: 'passed', duration: 25 },
      { name: 'Coding', score: 80, status: 'passed', duration: 45 },
      {
        name: 'Technical Interview',
        score: 85,
        status: 'passed',
        duration: 30,
      },
    ],
    totalDuration: 145,
    feedback:
      'Excellent performance across all rounds. Strong technical skills demonstrated.',
  },
  {
    id: 2,
    company: 'Google',
    position: 'Software Engineer',
    date: '2024-01-12',
    status: 'In Progress',
    overallScore: null,
    rounds: [
      { name: 'Screening', score: 95, status: 'passed', duration: 20 },
      { name: 'Aptitude', score: 88, status: 'passed', duration: 30 },
      { name: 'Coding', score: 92, status: 'passed', duration: 60 },
      { name: 'System Design', score: null, status: 'current', duration: null },
    ],
    totalDuration: 110,
    feedback: null,
  },
  {
    id: 3,
    company: 'Microsoft',
    position: 'SDE 2',
    date: '2024-01-10',
    status: 'Failed',
    overallScore: 45,
    rounds: [
      { name: 'Screening', score: 85, status: 'passed', duration: 15 },
      { name: 'Technical', score: 40, status: 'failed', duration: 45 },
    ],
    totalDuration: 60,
    feedback:
      'Need to improve technical problem-solving skills. Focus on algorithms and data structures.',
  },
];

export const mockAssessments = [
  {
    id: 1,
    company: 'Amazon',
    position: 'SDE 1',
    date: '2024-01-15',
    status: 'Completed',
    score: 85,
    rounds: ['Screening', 'Aptitude', 'Coding', 'Communication', 'Technical'],
  },
  {
    id: 2,
    company: 'Google',
    position: 'Software Engineer',
    date: '2024-01-12',
    status: 'In Progress',
    score: null,
    rounds: ['Screening', 'Aptitude', 'Coding'],
  },
  {
    id: 3,
    company: 'Microsoft',
    position: 'SDE 2',
    date: '2024-01-10',
    status: 'Completed',
    score: 92,
    rounds: ['Screening', 'Technical', 'System Design', 'Behavioral'],
  },
];

export const mockUserStats = {
  totalAssessments: 24,
  successRate: 87,
  hoursPracticed: 156,
  achievements: 12,
};

export const mockCustomAssessments = [
  {
    id: 1,
    name: 'Frontend Developer Practice',
    rounds: ['Screening', 'Coding', 'System Design'],
    difficulty: 'Medium',
    created: '2024-01-10',
    description: 'Custom assessment for frontend development skills',
    totalDuration: 120,
  },
  {
    id: 2,
    name: 'Full Stack Challenge',
    rounds: ['Technical', 'Coding', 'Behavioral'],
    difficulty: 'Hard',
    created: '2024-01-08',
    description: 'Comprehensive full-stack development assessment',
    totalDuration: 180,
  },
  {
    id: 3,
    name: 'Backend API Design',
    rounds: ['System Design', 'Coding', 'Technical'],
    difficulty: 'Hard',
    created: '2024-01-05',
    description: 'Focus on backend architecture and API design',
    totalDuration: 150,
  },
];

// Store custom assessments locally
export const saveCustomAssessment = (assessment: any) => {
  if (USE_MOCK_DATA) {
    const existingAssessments = getCustomAssessments();
    const newAssessment = {
      ...assessment,
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
    };

    const updatedAssessments = [...existingAssessments, newAssessment];
    localStorage.setItem(
      'customAssessments',
      JSON.stringify(updatedAssessments)
    );
    return newAssessment;
  }
  // Real API call would go here
};

export const getCustomAssessments = () => {
  if (USE_MOCK_DATA) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('customAssessments');
      return stored ? JSON.parse(stored) : mockCustomAssessments;
    }
    return mockCustomAssessments;
  }
  // Real API call would go here
};

export const deleteCustomAssessment = (id: number) => {
  if (USE_MOCK_DATA) {
    const existingAssessments = getCustomAssessments();
    const updatedAssessments = existingAssessments.filter(
      (a: any) => a.id !== id
    );
    localStorage.setItem(
      'customAssessments',
      JSON.stringify(updatedAssessments)
    );
    return true;
  }
  // Real API call would go here
};

// Check if Prime is enabled
export const isPrimeEnabled = () => {
  return process.env.NEXT_PUBLIC_ENABLE_PRIME === 'true';
};

export const getUserFeatures = () => {
  const isPrime = isPrimeEnabled();
  return isPrime ? PRIME_FEATURES : FREE_FEATURES;
};

// API simulation functions
export const apiCall = async (endpoint: string, options?: any) => {
  if (USE_MOCK_DATA) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock data based on endpoint
    switch (endpoint) {
      case '/api/assessments':
        return { data: mockAssessments };
      case '/api/user/stats':
        return { data: mockUserStats };
      case '/api/custom-assessments':
        return { data: getCustomAssessments() };
      default:
        return { data: null };
    }
  } else {
    // Real API call
    const response = await fetch(endpoint, options);
    return response.json();
  }
};
