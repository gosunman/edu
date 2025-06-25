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