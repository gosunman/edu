import { FlashCard } from '@/types';

export const flashCards: FlashCard[] = [
  // (모든 카드 데이터 삭제)
];

// 카테고리별 그룹화 함수
export const getFlashCardsByCategory = (category: string) => {
  return flashCards.filter(card => card.category === category);
};

// 과목별 그룹화 함수
export const getFlashCardsBySubject = (subject: string) => {
  return flashCards.filter(card => card.subject === subject);
};

// 챕터별 그룹화 함수
export const getFlashCardsByChapter = (chapter: string) => {
  return flashCards.filter(card => card.chapter === chapter);
};

// 소단원별 그룹화 함수
export const getFlashCardsBySubChapter = (subChapter: string) => {
  return flashCards.filter(card => card.subChapter === subChapter);
};

// 난이도별 그룹화 함수
export const getFlashCardsByDifficulty = (difficulty: string) => {
  return flashCards.filter(card => card.difficulty === difficulty);
};

// 검색 함수
export const searchFlashCards = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return flashCards.filter(card => 
    card.question.toLowerCase().includes(lowerQuery) ||
    card.answer.toLowerCase().includes(lowerQuery) ||
    card.subject.toLowerCase().includes(lowerQuery) ||
    card.chapter.toLowerCase().includes(lowerQuery) ||
    card.subChapter.toLowerCase().includes(lowerQuery)
  );
}; 