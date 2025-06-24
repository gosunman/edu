import { Unit } from '../types';

export const units: Unit[] = [
  {
    id: 'unit1',
    title: '물질의 구성',
    grade: '중1',
    description: '원자, 분자, 원소의 이해',
    color: '#FF6B9D',
    progress: 75,
    totalCards: 20,
    completedCards: 15
  },
  {
    id: 'unit2',
    title: '전기와 자기',
    grade: '중2',
    description: '전류, 전압, 자기장의 원리',
    color: '#4ECDC4',
    progress: 45,
    totalCards: 25,
    completedCards: 11
  },
  {
    id: 'unit3',
    title: '화학 반응',
    grade: '중3',
    description: '산화환원, 중화반응',
    color: '#45B7D1',
    progress: 20,
    totalCards: 30,
    completedCards: 6
  },
  {
    id: 'unit4',
    title: '생태계',
    grade: '중2',
    description: '생물과 환경의 상호작용',
    color: '#96CEB4',
    progress: 90,
    totalCards: 18,
    completedCards: 16
  }
]; 