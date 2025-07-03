export interface Unit {
  id: string;
  title: string;
  description: string;
  grade: string; // 중1, 중2, 중3
  semester?: string; // 1학기, 2학기
  majorChapter: string; // 대단원 번호 (1, 2, 3...)
  majorChapterTitle: string; // 대단원 제목 (과학과 인류의 지속가능한 삶, 생물의 구성과 다양성...)
  subChapter: string; // 중단원 번호 (1, 2, 3...)
  subChapterTitle: string; // 중단원 제목 (과학과 인류의 미래, 생물의 구성...)
  minorChapter: string; // 소단원 번호 (1, 2, 3...)
  minorChapterTitle: string; // 소단원 제목 (과학적 탐구 방법, 세포...)
  color: string;
  progress: number;
  totalCards: number;
  completedCards: number;
  type: 'unit'; // 모든 unit은 동일한 type
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