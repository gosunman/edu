import { Simulation } from '@/types';

export const simulations: Simulation[] = [
  // 중1 과학 시뮬레이션
  {
    id: 'moon-motion',
    title: '달의 공전 시뮬레이션',
    description: '달이 지구 주위를 공전하는 모습을 관찰하고 위상변화를 이해해보세요.',
    category: 'science',
    subject: '중1 과학',
    chapter: '지구와 달',
    subChapter: '달의 운동',
    difficulty: 'medium',
    path: '/simulation/moon-motion'
  },
  {
    id: 'moon-phase',
    title: '달의 위상변화 시뮬레이션',
    description: '달의 위상변화 과정을 관찰하고 원리를 이해해보세요.',
    category: 'science',
    subject: '중1 과학',
    chapter: '지구와 달',
    subChapter: '달의 위상변화',
    difficulty: 'easy',
    path: '/simulation/moon-phase'
  },
  {
    id: 'moon-phase-3d',
    title: '달의 위상변화 3D 시뮬레이션',
    description: '태양-지구-달의 3D 운동과 위상변화를 입체적으로 관찰해보세요.',
    category: 'science',
    subject: '중1 과학',
    chapter: '지구와 달',
    subChapter: '달의 위상변화',
    difficulty: 'medium',
    path: '/simulation/moon-phase-3d'
  },
  {
    id: 'magnetic-field',
    title: '자기장 시뮬레이터',
    description: '다양한 자석과 전류의 자기장을 탐구해보세요.',
    category: 'science',
    subject: '중1 과학',
    chapter: '전기와 자기',
    subChapter: '자기 현상',
    difficulty: 'medium',
    path: '/simulation/magnetic-field'
  },
  {
    id: 'electric-circuit',
    title: '전기회로 시뮬레이션',
    description: '직렬회로와 병렬회로의 특성을 실험해보세요.',
    category: 'science',
    subject: '중1 과학',
    chapter: '전기와 자기',
    subChapter: '전기 현상',
    difficulty: 'medium',
    path: '/simulation/electric-circuit'
  },

  // 중2 과학 시뮬레이션
  {
    id: 'motor',
    title: '전동기 시뮬레이션',
    description: '전동기의 작동 원리와 플레밍의 왼손 법칙을 이해해보세요.',
    category: 'science',
    subject: '중2 과학',
    chapter: '전기와 자기',
    subChapter: '전류의 자기 작용',
    difficulty: 'hard',
    path: '/simulation/motor'
  },
  {
    id: 'commutator',
    title: '정류자 시뮬레이션',
    description: '정류자의 작동 원리와 전류 방향 전환을 관찰해보세요.',
    category: 'science',
    subject: '중2 과학',
    chapter: '전기와 자기',
    subChapter: '전류의 자기 작용',
    difficulty: 'hard',
    path: '/simulation/commutator'
  },

  // 중3 과학 시뮬레이션
  {
    id: 'sunspot',
    title: '태양 흑점 시뮬레이션',
    description: '태양 흑점의 관측과 태양 자전을 이해해보세요.',
    category: 'science',
    subject: '중3 과학',
    chapter: '태양계',
    subChapter: '태양',
    difficulty: 'medium',
    path: '/simulation/sunspot'
  },
  {
    id: 'mirror-lens',
    title: '거울과 렌즈 시뮬레이션',
    description: '거울과 렌즈의 상 형성 원리를 실험해보세요.',
    category: 'science',
    subject: '중3 과학',
    chapter: '빛과 파동',
    subChapter: '거울과 렌즈',
    difficulty: 'medium',
    path: '/simulation/mirror-lens'
  },
  {
    id: 'light-synthesis',
    title: '빛의 합성 시뮬레이션',
    description: '색의 삼원색과 빛의 합성을 실험해보세요.',
    category: 'science',
    subject: '중3 과학',
    chapter: '빛과 파동',
    subChapter: '빛의 합성',
    difficulty: 'easy',
    path: '/simulation/light-synthesis'
  }
];

// 카테고리별 그룹화 함수
export const getSimulationsByCategory = (category: string) => {
  return simulations.filter(sim => sim.category === category);
};

// 과목별 그룹화 함수
export const getSimulationsBySubject = (subject: string) => {
  return simulations.filter(sim => sim.subject === subject);
};

// 챕터별 그룹화 함수
export const getSimulationsByChapter = (chapter: string) => {
  return simulations.filter(sim => sim.chapter === chapter);
};

// 소단원별 그룹화 함수
export const getSimulationsBySubChapter = (subChapter: string) => {
  return simulations.filter(sim => sim.subChapter === subChapter);
};

// 난이도별 그룹화 함수
export const getSimulationsByDifficulty = (difficulty: string) => {
  return simulations.filter(sim => sim.difficulty === difficulty);
};

// 검색 함수
export const searchSimulations = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return simulations.filter(sim => 
    sim.title.toLowerCase().includes(lowerQuery) ||
    sim.description.toLowerCase().includes(lowerQuery) ||
    sim.subject.toLowerCase().includes(lowerQuery) ||
    sim.chapter.toLowerCase().includes(lowerQuery) ||
    sim.subChapter.toLowerCase().includes(lowerQuery)
  );
}; 