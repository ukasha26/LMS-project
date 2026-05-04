const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('vu_lms_token', token);
  } else {
    localStorage.removeItem('vu_lms_token');
  }
}

export function getAuthToken(): string | null {
  return authToken || localStorage.getItem('vu_lms_token');
}

async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'instructor';
    student_id?: string;
    avatar?: string;
  }) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => apiFetch<{ user: any }>('/auth/me'),

  logout: () =>
    apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),

  // Courses
  listCourses: (query?: string, category?: string, status?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    return apiFetch<any[]>(`/courses${params ? '?' + params : ''}`);
  },

  getCourse: (id: number) => apiFetch<any>(`/courses/${id}`),

  myCourses: () => apiFetch<any[]>('/instructor/courses'),

  createCourse: (data: {
    code: string;
    title: string;
    description: string;
    category: string;
    status: string;
    credits: number;
    cover?: string;
  }) =>
    apiFetch<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCourse: (id: number, data: any) =>
    apiFetch<any>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: number) =>
    apiFetch<any>(`/courses/${id}`, { method: 'DELETE' }),

  // Lessons
  getLessons: (courseId: number) =>
    apiFetch<any[]>(`/courses/${courseId}/lessons`),

  createLesson: (courseId: number, data: any) =>
    apiFetch<any>(`/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateLesson: (id: number, data: any) =>
    apiFetch<any>(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteLesson: (id: number) =>
    apiFetch<any>(`/lessons/${id}`, { method: 'DELETE' }),

  // Enrollments
  getMyEnrollments: () =>
    apiFetch<any[]>('/me/enrollments'),

  enroll: (courseId: number) =>
    apiFetch<any>(`/courses/${courseId}/enroll`, { method: 'POST' }),

  unenroll: (courseId: number) =>
    apiFetch<any>(`/courses/${courseId}/enroll`, { method: 'DELETE' }),

  updateProgress: (courseId: number, progress: number) =>
    apiFetch<any>(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    }),

  getCourseEnrollments: (courseId: number) =>
    apiFetch<any[]>(`/courses/${courseId}/enrollments`),

  // Quizzes
  getQuizzes: (courseId: number) =>
    apiFetch<any[]>(`/courses/${courseId}/quizzes`),

  getQuizQuestions: (quizId: number) =>
    apiFetch<any[]>(`/quizzes/${quizId}/questions`),

  createQuiz: (courseId: number, data: any) =>
    apiFetch<any>(`/courses/${courseId}/quizzes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateQuiz: (id: number, data: any) =>
    apiFetch<any>(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteQuiz: (id: number) =>
    apiFetch<any>(`/quizzes/${id}`, { method: 'DELETE' }),

  addQuestion: (quizId: number, data: any) =>
    apiFetch<any>(`/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteQuestion: (id: number) =>
    apiFetch<any>(`/questions/${id}`, { method: 'DELETE' }),

  // Quiz Attempts
  submitAttempt: (quizId: number, answers: Record<number, number>) =>
    apiFetch<any>(`/quizzes/${quizId}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),

  getMyAttempts: () =>
    apiFetch<any[]>('/me/attempts'),

  getQuizAttempts: (quizId: number) =>
    apiFetch<any[]>(`/quizzes/${quizId}/attempts`),

  // Reports
  getAdminReports: () =>
    apiFetch<any>('/admin/reports'),
};
