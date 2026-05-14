import { User, Question, QuestionCategory, UserRole, QuizResult } from '../types';

const USERS_KEY = 'polda_diy_users';
const QUESTIONS_KEY = 'polda_diy_questions';
const CATEGORIES_KEY = 'polda_diy_categories';
const CURRENT_USER_KEY = 'polda_diy_current_user';
const RESULTS_KEY = 'polda_diy_results';

// Initial Categories
const INITIAL_CATEGORIES: QuestionCategory[] = [
  { id: '1', name: 'Pengetahuan Umum', description: 'Soal-soal seputar pengetahuan umum kepolisian', icon: 'BookOpen' },
  { id: '2', name: 'Psikotes', description: 'Ujian psikologi kedinasan', icon: 'Brain' },
  { id: '3', name: 'Akademik', description: 'Materi tes akademik', icon: 'School' },
  { id: '4', name: 'Kesamaptaan', description: 'Teori tentang kesiapan fisik', icon: 'Activity' },
];

// Mock Admin and User
const INITIAL_USERS: User[] = [
  { id: 'admin-1', username: 'admin', name: 'Administrator Polda', role: 'ADMIN', email: 'admin@poldadiy.go.id' },
  { id: 'user-1', username: 'user', name: 'Peserta Ujian', role: 'USER', email: 'peserta@gmail.com' },
];

export const mockService = {
  // Auth
  login: (username: string): User | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(INITIAL_USERS));
    const user = users.find((u: User) => u.username === username);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // Questions
  getQuestions: (): Question[] => {
    return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || '[]');
  },

  addQuestion: (question: Omit<Question, 'id' | 'createdAt'>) => {
    const questions = mockService.getQuestions();
    const newQuestion: Question = {
      ...question,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify([...questions, newQuestion]));
    return newQuestion;
  },

  deleteQuestion: (id: string) => {
    const questions = mockService.getQuestions();
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions.filter(q => q.id !== id)));
  },

  // Categories
  getCategories: (): QuestionCategory[] => {
    const cats = localStorage.getItem(CATEGORIES_KEY);
    if (!cats) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(cats);
  },

  // Users Management
  getAllUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    if (!users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(users);
  },

  updateUser: (updatedUser: User) => {
    const users = mockService.getAllUsers();
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
  },

  // Quiz Results
  saveResult: (result: Omit<QuizResult, 'id' | 'completedAt'>): QuizResult => {
    const results = mockService.getResults();
    const newResult: QuizResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(RESULTS_KEY, JSON.stringify([...results, newResult]));
    return newResult;
  },

  getResults: (): QuizResult[] => {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  },

  deleteResult: (id: string) => {
    const results = mockService.getResults();
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results.filter((r: QuizResult) => r.id !== id)));
  },
};
