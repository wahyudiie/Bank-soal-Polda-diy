import { supabase } from '../lib/supabase';
import { Question, QuestionCategory, QuizResult, User } from '../types';

export const supabaseService = {
  // Categories
  getCategories: async (): Promise<QuestionCategory[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  // Questions
  getQuestions: async (): Promise<Question[]> => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  addQuestion: async (question: Partial<Question>): Promise<void> => {
    const { error } = await supabase
      .from('questions')
      .insert([question]);
    if (error) throw error;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Results
  getResults: async (): Promise<QuizResult[]> => {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('completed_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  saveResult: async (result: Partial<QuizResult>): Promise<void> => {
    const { error } = await supabase
      .from('quiz_results')
      .insert([result]);
    if (error) throw error;
  },

  deleteResult: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    if (error) throw error;
    return data || [];
  },

  login: async (username: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    if (error) return null;
    return data;
  },

  createUser: async (user: Partial<User>): Promise<void> => {
    const { error } = await supabase
      .from('users')
      .insert([user]);
    if (error) throw error;
  }
};
