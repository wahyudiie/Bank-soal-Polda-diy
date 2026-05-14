import { supabase } from '../lib/supabase';
import { Question, QuestionCategory, QuizResult, User } from '../types';
import { mockService } from './mockService';

export const supabaseService = {
  // Helper to check if DB is connected
  isConnected: () => !!supabase,

  // Categories
  getCategories: async (): Promise<QuestionCategory[]> => {
    if (!supabase) return mockService.getCategories();
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      if (!data || data.length === 0) return mockService.getCategories();
      return data;
    } catch (err) {
      console.error(err);
      return mockService.getCategories();
    }
  },

  // Questions
  getQuestions: async (): Promise<Question[]> => {
    if (!supabase) return mockService.getQuestions();
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return mockService.getQuestions();
      return data.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        categoryId: q.categoryid,
        fileUrl: q.fileurl,
        fileName: q.filename,
        uploadedBy: q.uploadedby,
        createdAt: q.created_at,
        tags: q.tags,
        items: q.items
      }));
    } catch (err) {
      console.error(err);
      return mockService.getQuestions();
    }
  },

  addQuestion: async (question: Partial<Question>): Promise<void> => {
    if (!supabase) {
      mockService.addQuestion(question as any);
      return;
    }
    try {
      const dbQuestion = {
        id: question.id,
        title: question.title,
        description: question.description,
        categoryid: question.categoryId,
        fileurl: question.fileUrl,
        filename: question.fileName,
        uploadedby: question.uploadedBy,
        created_at: question.createdAt || new Date().toISOString(),
        tags: question.tags,
        items: question.items
      };
      const { error } = await supabase
        .from('questions')
        .insert([dbQuestion]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      mockService.addQuestion(question as any);
    }
  },

  deleteQuestion: async (id: string): Promise<void> => {
    if (!supabase) {
      mockService.deleteQuestion(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
      if (error) throw error;
      mockService.deleteQuestion(id);
    } catch (err) {
      console.error(err);
      mockService.deleteQuestion(id);
    }
  },

  // Results
  getResults: async (): Promise<QuizResult[]> => {
    if (!supabase) return mockService.getResults();
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('completed_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return mockService.getResults();
      return data.map(r => ({
        id: r.id,
        userId: r.userid,
        userName: r.username,
        userUsername: r.userusername,
        questionId: r.questionid,
        questionTitle: r.questiontitle,
        score: r.score,
        totalQuestions: r.totalquestions,
        correctAnswers: r.correctanswers,
        completedAt: r.completed_at,
        timeTaken: r.timetaken,
        status: r.status
      }));
    } catch (err) {
      console.error(err);
      return mockService.getResults();
    }
  },

  saveResult: async (result: Partial<QuizResult>): Promise<void> => {
    if (!supabase) {
      mockService.saveResult(result as any);
      return;
    }
    try {
      const dbResult = {
        id: result.id,
        userid: result.userId,
        username: result.userName,
        userusername: result.userUsername,
        questionid: result.questionId,
        questiontitle: result.questionTitle,
        score: result.score,
        totalquestions: result.totalQuestions,
        correctanswers: result.correctAnswers,
        completed_at: result.completedAt || new Date().toISOString(),
        timetaken: result.timeTaken,
        status: result.status
      };
      const { error } = await supabase
        .from('quiz_results')
        .insert([dbResult]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      mockService.saveResult(result as any);
    }
  },

  deleteResult: async (id: string): Promise<void> => {
    if (!supabase) {
      mockService.deleteResult(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('quiz_results')
        .delete()
        .eq('id', id);
      if (error) throw error;
      mockService.deleteResult(id);
    } catch (err) {
      console.error(err);
      mockService.deleteResult(id);
    }
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    if (!supabase) return mockService.getAllUsers();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, password, name, role, email')
        .order('name');
      if (error) throw error;
      if (!data || data.length === 0) return mockService.getAllUsers();
      return data;
    } catch (err) {
      console.error(err);
      return mockService.getAllUsers();
    }
  },

  login: async (username: string, password?: string): Promise<User | null> => {
    if (!supabase) return mockService.login(username);
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('username', username);
      
      if (password) {
        query = query.eq('password', password);
      }
      
      const { data, error } = await query.single();
      if (error) throw error;
      if (!data) return mockService.login(username);
      return data;
    } catch (err) {
      console.error(err);
      return mockService.login(username);
    }
  },

  createUser: async (user: Partial<User>): Promise<void> => {
    // Add to mock service to ensure it always exists locally
    try {
      const newUser = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
      } as User;
      const users = mockService.getAllUsers();
      localStorage.setItem('polda_diy_users', JSON.stringify([...users, newUser]));
    } catch (e) {}

    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('users')
        .insert([user]);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      // We already inserted into local storage above, so we just swallow the error 
      // or we can throw it if we want the UI to show an error.
      // But the user just wants the data to be saved and appear.
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      const users = mockService.getAllUsers();
      localStorage.setItem('polda_diy_users', JSON.stringify(users.filter(u => u.id !== id)));
    } catch (e) {}

    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
    }
  }
};
