/**
 * API Base URL
 * In development: use relative path which gets proxied by Vite to http://localhost:5000
 * In production: use VITE_API_URL environment variable (must be set in Vercel dashboard)
 * 
 * To deploy on Vercel:
 * 1. Deploy backend separately (Render, Railway, etc.)
 * 2. Add VITE_API_URL to Vercel environment variables
 *    Example: https://your-backend.onrender.com/api
 * 3. Redeploy frontend on Vercel
 */
export const API_BASE_URL = 
  import.meta.env.MODE === 'development' 
    ? '/api'  // Use Vite proxy in development
    : (import.meta.env.VITE_API_URL?.trim() || '/api'); // Use env var or fallback to /api

console.log('API Base URL:', API_BASE_URL, 'Mode:', import.meta.env.MODE);
if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL?.trim()) {
  console.warn('⚠️ WARNING: VITE_API_URL not set! Using relative path /api. Set VITE_API_URL in Vercel environment variables if backend is on different domain.');
}

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('portfolioToken') || localStorage.getItem('authToken') || localStorage.getItem('adminToken');
};

// API Request wrapper
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  body: {[key: string]: unknown} | null = null
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${method} ${fullUrl}`, { body: config.body });

  try {
    const response = await fetch(fullUrl, config);

    console.log(`API Response: ${response.status} ${response.statusText}`);

    // Handle 304 Not Modified - return empty data
    if (response.status === 304) {
      console.warn('⚠️ 304 Not Modified received, returning empty data');
      return { success: false, data: [] };
    }

    // Don't auto-redirect on login/register endpoints - let component handle it
    if (!response.ok && response.status === 401 && !endpoint.includes('/auth/')) {
      // Clear token if unauthorized (for protected endpoints)
      localStorage.removeItem('portfolioToken');
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse response JSON:', e);
      throw new Error(`Invalid response from server: ${response.statusText}`);
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.errors?.[0]?.message || 'API request failed';
      console.error(`API Error: ${response.status}`, { errorMessage, data });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Error (Fetch):', error);
    throw error;
  }
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', 'POST', { email, password }),

  register: (name: string, email: string, password: string) =>
    apiRequest('/auth/register', 'POST', { name, email, password }),

  getCurrentUser: () =>
    apiRequest('/auth/me', 'GET'),

  updateProfile: (name: string, email: string) =>
    apiRequest('/auth/profile', 'PUT', { name, email }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest('/auth/change-password', 'PUT', { currentPassword, newPassword }),
};

// ============================================
// PROJECTS API
// ============================================

export const projectAPI = {
  getAllProjects: () =>
    apiRequest('/projects', 'GET'),

  getProject: (id: string) =>
    apiRequest(`/projects/${id}`, 'GET'),

  getFeaturedProjects: () =>
    apiRequest('/projects/featured', 'GET'),

  createProject: (projectData: {
    title: string;
    description: string;
    techStack: string[];
    imageUrl: string;
    imageAlt?: string;
    githubLink?: string;
    liveLink?: string;
    featured?: boolean;
    order?: number;
  }) =>
    apiRequest('/projects', 'POST', projectData),

  updateProject: (id: string, projectData: {[key: string]: unknown}) =>
    apiRequest(`/projects/${id}`, 'PUT', projectData),

  deleteProject: (id: string) =>
    apiRequest(`/projects/${id}`, 'DELETE'),

  bulkCreateProjects: (projects: {[key: string]: unknown}[]) =>
    apiRequest('/projects/bulk', 'POST', { projects }),
};

// ============================================
// CONTACT API
// ============================================

export const contactAPI = {
  submitForm: (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) =>
    apiRequest('/contact', 'POST', contactData),

  getAllMessages: (page: number = 1, limit: number = 10, filters?: {[key: string]: unknown}) =>
    apiRequest(`/contact?page=${page}&limit=${limit}`, 'GET'),

  getMessage: (id: string) =>
    apiRequest(`/contact/${id}`, 'GET'),

  markAsRead: (id: string) =>
    apiRequest(`/contact/${id}/read`, 'PUT'),

  markAsReplied: (id: string) =>
    apiRequest(`/contact/${id}/replied`, 'PUT'),

  deleteMessage: (id: string) =>
    apiRequest(`/contact/${id}`, 'DELETE'),

  getStats: () =>
    apiRequest('/contact/stats', 'GET'),
};

// ============================================
// SKILLS API
// ============================================

export const skillAPI = {
  getAllSkills: () =>
    apiRequest('/skills', 'GET'),

  getSkill: (id: string) =>
    apiRequest(`/skills/${id}`, 'GET'),

  createSkill: (skillData: {
    category: string;
    skills: {name: string; proficiency?: string; yearsOfExperience?: number}[];
    order?: number;
  }) =>
    apiRequest('/skills', 'POST', skillData),

  updateSkill: (id: string, skillData: {[key: string]: unknown}) =>
    apiRequest(`/skills/${id}`, 'PUT', skillData),

  deleteSkill: (id: string) =>
    apiRequest(`/skills/${id}`, 'DELETE'),

  addSkillToCategory: (categoryId: string, skillData: {
    name: string;
    proficiency?: string;
    yearsOfExperience?: number;
  }) =>
    apiRequest(`/skills/${categoryId}/skills`, 'POST', skillData),

  removeSkillFromCategory: (categoryId: string, skillId: string) =>
    apiRequest(`/skills/${categoryId}/skills/${skillId}`, 'DELETE'),
};

// ============================================
// EXPERIENCE API
// ============================================

export const experienceAPI = {
  getAllExperience: () =>
    apiRequest('/experience', 'GET'),

  getExperience: (id: string) =>
    apiRequest(`/experience/${id}`, 'GET'),

  getCurrentRole: () =>
    apiRequest('/experience/current', 'GET'),

  createExperience: (experienceData: {
    title: string;
    company: string;
    location?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrentRole?: boolean;
    technologies?: string[];
    order?: number;
  }) =>
    apiRequest('/experience', 'POST', experienceData),

  updateExperience: (id: string, experienceData: {[key: string]: unknown}) =>
    apiRequest(`/experience/${id}`, 'PUT', experienceData),

  deleteExperience: (id: string) =>
    apiRequest(`/experience/${id}`, 'DELETE'),
};

// ============================================
// CASE STUDIES API
// ============================================

export const caseStudyAPI = {
  getAllCaseStudies: () =>
    apiRequest('/case-studies', 'GET'),

  getCaseStudy: (id: string) =>
    apiRequest(`/case-studies/${id}`, 'GET'),

  createCaseStudy: (caseStudyData: {
    title: string;
    description: string;
    imageUrl: string;
    challenge?: string;
    solution?: string;
    results?: string;
    technologies?: string[];
    link?: string;
    order?: number;
  }) =>
    apiRequest('/case-studies', 'POST', caseStudyData),

  updateCaseStudy: (id: string, caseStudyData: {[key: string]: unknown}) =>
    apiRequest(`/case-studies/${id}`, 'PUT', caseStudyData),

  deleteCaseStudy: (id: string) =>
    apiRequest(`/case-studies/${id}`, 'DELETE'),
};

// ============================================
// LEADERSHIP & ACHIEVEMENTS API
// ============================================

export const achievementAPI = {
  getAllAchievements: () =>
    apiRequest('/achievements', 'GET'),

  getAchievement: (id: string) =>
    apiRequest(`/achievements/${id}`, 'GET'),

  createAchievement: (achievementData: {
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    details: string[];
    gradient: string;
    color: string;
    order?: number;
  }) =>
    apiRequest('/achievements', 'POST', achievementData),

  updateAchievement: (id: string, achievementData: {[key: string]: unknown}) =>
    apiRequest(`/achievements/${id}`, 'PUT', achievementData),

  deleteAchievement: (id: string) =>
    apiRequest(`/achievements/${id}`, 'DELETE'),
};

// ============================================
// MESSAGES API
// ============================================

export const messagesAPI = {
  getAllMessages: (page: number = 1, limit: number = 10) =>
    apiRequest(`/contact?page=${page}&limit=${limit}`, 'GET'),

  getMessage: (id: string) =>
    apiRequest(`/contact/${id}`, 'GET'),

  getStats: () =>
    apiRequest('/contact/stats', 'GET'),

  markAsRead: (id: string) =>
    apiRequest(`/contact/${id}/read`, 'PUT', {}),

  markAsReplied: (id: string) =>
    apiRequest(`/contact/${id}/replied`, 'PUT', {}),

  deleteMessage: (id: string) =>
    apiRequest(`/contact/${id}`, 'DELETE'),
};

// ============================================
// RESUME API
// ============================================

export const resumeAPI = {
  downloadResume: (filename: string = 'advitiya-ranjan') => {
    return `${API_BASE_URL}/resumes/download/${filename}`;
  },

  listResumes: () =>
    apiRequest('/resumes/list', 'GET'),
};

// ============================================
// PORTFOLIO API
// ============================================

export const portfolioAPI = {
  getPortfolio: () =>
    apiRequest('/portfolio', 'GET'),

  incrementView: () =>
    apiRequest('/portfolio/view', 'POST', {}),

  updatePortfolio: (portfolioData: FormData | {[key: string]: unknown}, isFormData: boolean = false) => {
    const headers: HeadersInit = {};
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (isFormData) {
      // Don't set Content-Type for FormData, browser will set it
      return fetch(`${API_BASE_URL}/portfolio`, {
        method: 'PUT',
        headers,
        body: portfolioData as FormData,
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Update failed');
        return data;
      });
    }

    return apiRequest('/portfolio', 'PUT', portfolioData as {[key: string]: unknown});
  },

  updateResumeLink: (resumeLink: string) =>
    apiRequest('/portfolio/resume', 'PUT', { resumeLink }),

  uploadProfileImage: (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    const headers: HeadersInit = {};
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_BASE_URL}/portfolio/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      return data;
    });
  },

  getStats: () =>
    apiRequest('/portfolio/stats', 'GET'),
};

// ============================================
// EXPORT ALL APIs
// ============================================

export default {
  authAPI,
  projectAPI,
  contactAPI,
  skillAPI,
  experienceAPI,
  caseStudyAPI,
  messagesAPI,
  resumeAPI,
  portfolioAPI,
};
