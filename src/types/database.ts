export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          school: string | null;
          grade: number | null;
          enrollment_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          school?: string | null;
          grade?: number | null;
          enrollment_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          school?: string | null;
          grade?: number | null;
          enrollment_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          unit_id: string;
          total_cards: number;
          completed_cards: number;
          correct_answers: number;
          total_attempts: number;
          last_studied: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          unit_id: string;
          total_cards?: number;
          completed_cards?: number;
          correct_answers?: number;
          total_attempts?: number;
          last_studied?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          unit_id?: string;
          total_cards?: number;
          completed_cards?: number;
          correct_answers?: number;
          total_attempts?: number;
          last_studied?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          unit_id: string | null;
          session_type: 'flashcard' | 'simulation';
          correct_answers: number;
          total_questions: number;
          duration_minutes: number;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          unit_id?: string | null;
          session_type: 'flashcard' | 'simulation';
          correct_answers?: number;
          total_questions?: number;
          duration_minutes?: number;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          unit_id?: string | null;
          session_type?: 'flashcard' | 'simulation';
          correct_answers?: number;
          total_questions?: number;
          duration_minutes?: number;
          started_at?: string;
          ended_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
} 