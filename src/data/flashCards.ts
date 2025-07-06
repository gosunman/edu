import { FlashCard } from '@/types';
import { units } from './units';

function makeQuestionsForUnit(unit: typeof units[number]): FlashCard[] {
  const base = {
    unitId: unit.id,
    subject: '과학' as const,
    chapter: unit.majorChapter,
    subChapter: unit.subChapter,
    category: 'science' as const,
  };
  // 대표 개념 위주로 임의 생성
  return [
    {
      id: `${unit.id}-1`,
      question: `${unit.minorChapterTitle}의 정의를 서술하시오.`,
      answer: unit.description.replace('학습합니다.', '').replace('이해합니다.', '').replace('배웁니다.', ''),
      difficulty: 'easy',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-2`,
      question: `${unit.minorChapterTitle}는 ${unit.title}와(과) 관련이 있다. (O/X)`,
      answer: 'O',
      difficulty: 'easy',
      type: 'boolean',
      ...base,
    },
    {
      id: `${unit.id}-3`,
      question: `${unit.minorChapterTitle}의 특징을 2가지 쓰시오.`,
      answer: `${unit.minorChapterTitle}의 대표적 특징 1, 특징 2`,
      difficulty: 'medium',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-4`,
      question: `${unit.minorChapterTitle}는 ${unit.majorChapterTitle} 단원에 속한다. (O/X)`,
      answer: 'O',
      difficulty: 'easy',
      type: 'boolean',
      ...base,
    },
    {
      id: `${unit.id}-5`,
      question: `${unit.minorChapterTitle}와(과) 관련된 실생활 예시를 한 가지 쓰시오.`,
      answer: '교과서 및 수업 예시 참고',
      difficulty: 'medium',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-6`,
      question: `${unit.minorChapterTitle}의 중요성에 대해 서술하시오.`,
      answer: '중요한 과학 개념임',
      difficulty: 'medium',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-7`,
      question: `${unit.minorChapterTitle}와(과) 관련된 실험 또는 관찰 활동을 한 가지 쓰시오.`,
      answer: '교과서 실험 참고',
      difficulty: 'medium',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-8`,
      question: `${unit.minorChapterTitle}의 예시를 한 가지 쓰시오.`,
      answer: '교과서 예시 참고',
      difficulty: 'easy',
      type: 'subjective',
      ...base,
    },
    {
      id: `${unit.id}-9`,
      question: `${unit.minorChapterTitle}에 대해 올바른 설명을 고르시오. (O/X)`,
      answer: 'O',
      difficulty: 'easy',
      type: 'boolean',
      ...base,
    },
    {
      id: `${unit.id}-10`,
      question: `${unit.minorChapterTitle}의 개념은 모든 과학 교과서에서 중요하게 다뤄진다. (O/X)`,
      answer: 'O',
      difficulty: 'easy',
      type: 'boolean',
      ...base,
    },
  ];
}

console.log('units length:', units.length);
console.log('first unit:', units[0]);
console.log('first 5 unit ids:', units.slice(0,5).map(u=>u.id));

export const flashCards: FlashCard[] = [
  ...units.filter(u => u.type === 'unit' && ['중1','중2','중3'].includes(u.grade)).flatMap(unit => makeQuestionsForUnit(unit))
];

console.log('first 5 flashCards:', flashCards.slice(0,5));
console.log('과학적 탐구 방법 카드:', flashCards.filter(card => card.unitId === 'ms1-1-1-1'));

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