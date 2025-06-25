export interface Unit {
  id: string;
  title: string;
  grade: string;
  description: string;
  color: string;
  progress: number;
  totalCards: number;
  completedCards: number;
  parentId?: string | null;
  type: 'main' | 'sub';
  chapter: string;
  subChapter: string;
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  unitId: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserStats {
  totalCorrectAnswers: number;
  totalAttempts: number;
  accuracy: number;
  totalSessions: number;
  totalStudyTime: number;
}

export interface ProgressUpdate {
  user_id: string;
  unit_id: string;
  correct_answers: number;
  total_attempts: number;
}

export type Mode = 'main' | 'flashcard' | 'simulation' | 'units' | 'settings'; 