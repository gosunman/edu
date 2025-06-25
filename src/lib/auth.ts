import { supabase } from './supabase';
import { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type StudySession = Database['public']['Tables']['study_sessions']['Row'];

export class AuthService {
  // 사용자 생성 또는 업데이트
  static async upsertUser(userData: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
  }): Promise<User | null> {
    try {
      console.log('Attempting to upsert user:', userData);
      
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('User upserted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in upsertUser:', error);
      return null;
    }
  }

  // 사용자 정보 조회
  static async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUser:', error);
      return null;
    }
  }

  // 사용자 진행률 조회
  static async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user progress:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return [];
    }
  }

  // 단원별 진행률 조회
  static async getUnitProgress(userId: string, unitId: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('unit_id', unitId)
        .single();

      if (error) {
        console.error('Error fetching unit progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUnitProgress:', error);
      return null;
    }
  }

  // 진행률 업데이트
  static async updateProgress(progressData: {
    user_id: string;
    unit_id: string;
    correct_answers?: number;
    total_attempts?: number;
    completed_cards?: number;
  }): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          ...progressData,
          updated_at: new Date().toISOString(),
          last_studied: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProgress:', error);
      return null;
    }
  }

  // 학습 세션 시작
  static async startStudySession(sessionData: {
    user_id: string;
    unit_id?: string;
    session_type: 'flashcard' | 'simulation';
  }): Promise<StudySession | null> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...sessionData,
          started_at: new Date().toISOString(),
          correct_answers: 0,
          total_questions: 0,
          duration_minutes: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting study session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in startStudySession:', error);
      return null;
    }
  }

  // 학습 세션 종료
  static async endStudySession(
    sessionId: string,
    sessionData: {
      correct_answers: number;
      total_questions: number;
      duration_minutes: number;
    }
  ): Promise<StudySession | null> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({
          ...sessionData,
          ended_at: new Date().toISOString(),
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error ending study session:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in endStudySession:', error);
      return null;
    }
  }

  // 사용자 통계 조회
  static async getUserStats(userId: string) {
    try {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      const { data: sessionData } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId);

      const totalCorrectAnswers = progressData?.reduce((sum, progress) => sum + progress.correct_answers, 0) || 0;
      const totalAttempts = progressData?.reduce((sum, progress) => sum + progress.total_attempts, 0) || 0;
      const totalSessions = sessionData?.length || 0;
      const totalStudyTime = sessionData?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0;

      return {
        totalCorrectAnswers,
        totalAttempts,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrectAnswers / totalAttempts) * 100) : 0,
        totalSessions,
        totalStudyTime,
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        totalCorrectAnswers: 0,
        totalAttempts: 0,
        accuracy: 0,
        totalSessions: 0,
        totalStudyTime: 0,
      };
    }
  }
} 