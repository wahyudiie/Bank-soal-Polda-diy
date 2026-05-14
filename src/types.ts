export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
  tags?: string[];
  items?: QuizItem[];
}

export interface QuizResult {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  questionId: string;
  questionTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeTaken: number; // seconds
  status: 'LULUS' | 'TIDAK LULUS';
}
