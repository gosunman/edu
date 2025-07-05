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
    school?: string;
    grade?: number;
    enrollment_year?: number;
  }): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar_url,
          school: userData.school,
          grade: userData.grade,
          enrollment_year: userData.enrollment_year,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
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
        // 사용자가 존재하지 않는 경우, 기본 사용자 정보 반환
        if (error.code === 'PGRST116') {
          return null;
        }
        
        return null;
      }

      return data;
    } catch (error) {
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
        return [];
      }

      return data || [];
    } catch (error) {
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
        return null;
      }

      return data;
    } catch (error) {
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
        return null;
      }

      return data;
    } catch (error) {
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
        return null;
      }

      return data;
    } catch (error) {
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
        return null;
      }

      return data;
    } catch (error) {
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

      const totalCorrectAnswers = progressData?.reduce((sum: number, progress: any) => sum + progress.correct_answers, 0) || 0;
      const totalAttempts = progressData?.reduce((sum: number, progress: any) => sum + progress.total_attempts, 0) || 0;
      const totalSessions = sessionData?.length || 0;
      const totalStudyTime = sessionData?.reduce((sum: number, session: any) => sum + session.duration_minutes, 0) || 0;

      return {
        totalCorrectAnswers,
        totalAttempts,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrectAnswers / totalAttempts) * 100) : 0,
        totalSessions,
        totalStudyTime,
      };
    } catch (error) {
      return {
        totalCorrectAnswers: 0,
        totalAttempts: 0,
        accuracy: 0,
        totalSessions: 0,
        totalStudyTime: 0,
      };
    }
  }

  // 사용자 정보 업데이트
  static async updateUserProfile(userId: string, profileData: {
    name?: string;
    school?: string;
    grade?: number;
    enrollment_year?: number;
    achievement_goal?: 'basic' | 'advanced';
  }): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  // 현재 학년 계산 (입학년도 기준)
  static calculateCurrentGrade(enrollmentYear: number): number {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    // 3월부터 새 학년으로 계산
    const academicYear = currentMonth >= 3 ? currentYear : currentYear - 1;
    const grade = academicYear - enrollmentYear + 1;
    
    // 중학교는 1-3학년까지만
    return Math.min(Math.max(grade, 1), 3);
  }
} 