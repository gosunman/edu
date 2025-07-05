'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import { simulations } from '@/data/simulations';
import { useFavorites } from '@/lib/favorites';
import styles from './simulation.module.css';

export default function SimulationPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { addFavorite, removeFavorite, checkFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  // 고유한 과목, 난이도 목록 추출
  const subjects = Array.from(new Set(simulations.map(sim => sim.subject)));
  const difficulties = Array.from(new Set(simulations.map(sim => sim.difficulty)));

  useEffect(() => { setMounted(true); }, []);

  const filteredSimulations = simulations.filter(sim => {
    const subjectMatch = selectedSubject === 'all' || sim.subject === selectedSubject;
    const difficultyMatch = selectedDifficulty === 'all' || sim.difficulty === selectedDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const handleFavoriteToggle = (simulation: any) => {
    const isFavorited = checkFavorite(simulation.id, 'simulation');
    if (isFavorited) {
      removeFavorite(simulation.id, 'simulation');
    } else {
      addFavorite({
        id: simulation.id,
        type: 'simulation',
        title: simulation.title,
        description: simulation.description,
        category: simulation.category,
        subject: simulation.subject,
        chapter: simulation.chapter,
        subChapter: simulation.subChapter
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '쉬움';
      case 'medium': return '보통';
      case 'hard': return '어려움';
      default: return '';
    }
  };

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case '중1 과학': return '중1 과학';
      case '중2 과학': return '중2 과학';
      case '중3 과학': return '중3 과학';
      default: return subject;
    }
  };

  const getIcon = (id: string) => {
    const iconMap: { [key: string]: string } = {
      'mirror-lens': '🪞',
      'moon-motion': '🌙',
      'moon-phase': '🌙',
      'electric-circuit': '⚡',
      'magnetic-field': '🧲',
      'light-synthesis': '🌈',
      'motor': '🔄',
      'commutator': '⚙️',
      'sunspot': '☀️'
    };
    return iconMap[id] || '🔬';
  };

  if (!mounted) return null;

  return (
    <MainLayout title="3D 시뮬레이션">
      <div className={styles.simulationPage}>
        {/* 필터 섹션 - 토글 버튼 */}
        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <div className={styles.toggleGroup}>
              <span className={styles.toggleLabel}>과목</span>
              <button
                className={`${styles.toggleButton} ${selectedSubject === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedSubject('all')}
              >전체</button>
              {subjects.map(subject => (
                <button
                  key={subject}
                  className={`${styles.toggleButton} ${selectedSubject === subject ? styles.active : ''}`}
                  onClick={() => setSelectedSubject(subject)}
                >{getSubjectLabel(subject)}</button>
              ))}
            </div>
            <div className={styles.toggleGroup}>
              <span className={styles.toggleLabel}>난이도</span>
              <button
                className={`${styles.toggleButton} ${selectedDifficulty === 'all' ? styles.active : ''}`}
                onClick={() => setSelectedDifficulty('all')}
              >전체</button>
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  className={`${styles.toggleButton} ${selectedDifficulty === difficulty ? styles.active : ''}`}
                  onClick={() => setSelectedDifficulty(difficulty)}
                >{getDifficultyLabel(difficulty)}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 통계 */}
        <div className={styles.stats}>
          <p>총 {filteredSimulations.length}개의 시뮬레이션</p>
        </div>

        <div className={styles.simulationGrid}>
          {filteredSimulations.length > 0 ? (
            filteredSimulations.map((simulation) => (
              <div key={simulation.id} className={styles.simulationCard}>
                <div className={styles.cardHeaderCompact}>
                  <span className={styles.cardIcon}>{getIcon(simulation.id)}</span>
                  <div className={styles.cardHeaderRight}>
                    <div className={styles.cardMetaCompact}>
                      <span
                        className={styles.difficultyBadge}
                        style={{ backgroundColor: getDifficultyColor(simulation.difficulty) }}
                      >
                        {getDifficultyLabel(simulation.difficulty)}
                      </span>
                      <span className={styles.subjectBadge}>
                        {getSubjectLabel(simulation.subject)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleFavoriteToggle(simulation);
                      }}
                      className={`${styles.favoriteButton} ${checkFavorite(simulation.id, 'simulation') ? styles.favorited : ''}`}
                    >
                      {checkFavorite(simulation.id, 'simulation') ? '★' : '☆'}
                    </button>
                  </div>
                </div>
                <Link href={simulation.path} className={styles.cardLink}>
                  <h3 className={styles.cardTitle}>{simulation.title}</h3>
                  <p className={styles.cardDescription}>{simulation.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.chapter}>{simulation.chapter}</span>
                    <span className={styles.subChapter}>{simulation.subChapter}</span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>조건에 맞는 시뮬레이션이 없습니다.</p>
              <p>필터를 조정해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 