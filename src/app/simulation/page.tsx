'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SimulationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  subject: 'physics' | 'chemistry' | 'biology' | 'earth-science';
}

const simulations: SimulationItem[] = [
  {
    id: 'mirror-lens',
    title: '거울과 렌즈 작도',
    description: '평면거울, 볼록거울, 오목거울과 볼록렌즈, 오목렌즈의 상 형성 원리를 학습합니다.',
    icon: '🪞',
    path: '/simulation/mirror-lens',
    difficulty: 'intermediate',
    subject: 'physics'
  },
  {
    id: 'moon-motion',
    title: '달의 움직임과 일주/연주운동',
    description: '달의 위상 변화와 지구의 자전, 공전 운동을 3D로 시뮬레이션합니다.',
    icon: '🌙',
    path: '/simulation/moon-motion',
    difficulty: 'intermediate',
    subject: 'earth-science'
  },
  {
    id: 'electric-circuit',
    title: '전압, 전류, 저항 시뮬레이터',
    description: '옴의 법칙을 이용한 전기 회로의 전압, 전류, 저항 관계를 학습합니다.',
    icon: '⚡',
    path: '/simulation/electric-circuit',
    difficulty: 'basic',
    subject: 'physics'
  },
  {
    id: 'magnetic-field',
    title: '자기장 시뮬레이터',
    description: '자석 주변의 자기장과 전류에 의한 자기장을 시각화합니다.',
    icon: '🧲',
    path: '/simulation/magnetic-field',
    difficulty: 'intermediate',
    subject: 'physics'
  },
  {
    id: 'light-synthesis',
    title: '빛의 합성',
    description: '유리 프리즘과 사과를 통한 빛의 굴절과 색 분해 현상을 학습합니다.',
    icon: '🌈',
    path: '/simulation/light-synthesis',
    difficulty: 'advanced',
    subject: 'physics'
  },
  {
    id: 'electroscope',
    title: '검전기 시뮬레이션',
    description: '검전기의 원리와 정전기 현상을 이해합니다. 대전체와 손가락 터치 시나리오 포함.',
    icon: '⚡',
    path: '/simulation/electroscope-v2',
    difficulty: 'basic',
    subject: 'physics'
  },
  {
    id: 'motor',
    title: '전동기 시뮬레이션',
    description: '자기장 속에서 전류가 받는 힘과 전동기의 회전 원리를 학습합니다.',
    icon: '🔄',
    path: '/simulation/motor',
    difficulty: 'advanced',
    subject: 'physics'
  },
  {
    id: 'commutator',
    title: '정류자 시뮬레이션',
    description: '전동기의 정류자 동작 원리와 브러시 접촉을 자세히 학습합니다.',
    icon: '⚙️',
    path: '/simulation/commutator',
    difficulty: 'advanced',
    subject: 'physics'
  },
  {
    id: 'sunspot',
    title: '태양 흑점 관측',
    description: '태양 흑점의 이동을 통해 태양의 자전을 관측하는 방법을 학습합니다.',
    icon: '☀️',
    path: '/simulation/sunspot',
    difficulty: 'intermediate',
    subject: 'earth-science'
  }
];

export default function SimulationPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredSimulations = simulations.filter(sim => {
    const subjectMatch = selectedSubject === 'all' || sim.subject === selectedSubject;
    const difficultyMatch = selectedDifficulty === 'all' || sim.difficulty === selectedDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return '기초';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '';
    }
  };

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case 'physics': return '물리';
      case 'chemistry': return '화학';
      case 'biology': return '생물';
      case 'earth-science': return '지구과학';
      default: return '';
    }
  };

  return (
    <div className="simulation-page">
      <div className="page-header">
        <h1 className="page-title">3D 시뮬레이션</h1>
        <p className="page-description">
          중등 과정의 과학 개념을 3D 시뮬레이션으로 학습해보세요.
        </p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>과목 선택</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="filter-select"
          >
            <option value="all">전체</option>
            <option value="physics">물리</option>
            <option value="chemistry">화학</option>
            <option value="biology">생물</option>
            <option value="earth-science">지구과학</option>
          </select>
        </div>

        <div className="filter-group">
          <label>난이도 선택</label>
          <select 
            value={selectedDifficulty} 
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="filter-select"
          >
            <option value="all">전체</option>
            <option value="basic">기초</option>
            <option value="intermediate">중급</option>
            <option value="advanced">고급</option>
          </select>
        </div>
      </div>

      <div className="simulation-grid">
        {filteredSimulations.map((simulation) => (
          <Link 
            key={simulation.id} 
            href={simulation.path}
            className="simulation-card"
          >
            <div className="card-header">
              <div className="card-icon">{simulation.icon}</div>
              <div className="card-meta">
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(simulation.difficulty) }}
                >
                  {getDifficultyLabel(simulation.difficulty)}
                </span>
                <span className="subject-badge">
                  {getSubjectLabel(simulation.subject)}
                </span>
              </div>
            </div>
            <h3 className="card-title">{simulation.title}</h3>
            <p className="card-description">{simulation.description}</p>
            <div className="card-footer">
              <span className="start-button">시작하기 →</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .simulation-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .page-description {
          font-size: 1.1rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .filters {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .filter-select {
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          background: white;
          color: #374151;
          min-width: 120px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .simulation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .simulation-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
          border: 1px solid #e5e7eb;
        }

        .simulation-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .difficulty-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }

        .subject-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          background: #f3f4f6;
          color: #374151;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .card-description {
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .start-button {
          color: #3b82f6;
          font-weight: 500;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .simulation-page {
            padding: 16px;
          }

          .page-title {
            font-size: 2rem;
          }

          .filters {
            flex-direction: column;
            align-items: center;
          }

          .simulation-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 