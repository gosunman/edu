'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { units } from '@/data/units';
import BottomNavigation from './BottomNavigation';
import styles from './UnitSelector.module.css';

interface GroupedData {
  grade: string;
  majorChapters: {
    majorChapter: string;
    majorChapterTitle: string;
    subChapters: {
      subChapter: string;
      subChapterTitle: string;
      minorChapters: {
        id: string;
        minorChapter: string;
        minorChapterTitle: string;
        title: string;
        description: string;
        totalCards: number;
        color: string;
      }[];
    }[];
  }[];
}

export default function UnitSelector() {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set(['중1']));
  const [expandedMajorChapters, setExpandedMajorChapters] = useState<Set<string>>(new Set());
  const [expandedSubChapters, setExpandedSubChapters] = useState<Set<string>>(new Set());

  // 데이터를 4단계로 그룹핑: 학년 → 대단원 → 중단원 → 소단원
  const groupedData: GroupedData[] = units.reduce((acc, unit) => {
    const gradeIndex = acc.findIndex(g => g.grade === unit.grade);
    if (gradeIndex === -1) {
      acc.push({
        grade: unit.grade,
        majorChapters: [{
          majorChapter: unit.majorChapter,
          majorChapterTitle: unit.majorChapterTitle,
          subChapters: [{
            subChapter: unit.subChapter,
            subChapterTitle: unit.subChapterTitle,
            minorChapters: [{
              id: unit.id,
              minorChapter: unit.minorChapter,
              minorChapterTitle: unit.minorChapterTitle,
              title: unit.title,
              description: unit.description,
              totalCards: unit.totalCards,
              color: unit.color
            }]
          }]
        }]
      });
    } else {
      const majorChapterIndex = acc[gradeIndex].majorChapters.findIndex(m => m.majorChapter === unit.majorChapter);
      if (majorChapterIndex === -1) {
        acc[gradeIndex].majorChapters.push({
          majorChapter: unit.majorChapter,
          majorChapterTitle: unit.majorChapterTitle,
          subChapters: [{
            subChapter: unit.subChapter,
            subChapterTitle: unit.subChapterTitle,
            minorChapters: [{
              id: unit.id,
              minorChapter: unit.minorChapter,
              minorChapterTitle: unit.minorChapterTitle,
              title: unit.title,
              description: unit.description,
              totalCards: unit.totalCards,
              color: unit.color
            }]
          }]
        });
      } else {
        const subChapterIndex = acc[gradeIndex].majorChapters[majorChapterIndex].subChapters.findIndex(s => s.subChapter === unit.subChapter);
        if (subChapterIndex === -1) {
          acc[gradeIndex].majorChapters[majorChapterIndex].subChapters.push({
            subChapter: unit.subChapter,
            subChapterTitle: unit.subChapterTitle,
            minorChapters: [{
              id: unit.id,
              minorChapter: unit.minorChapter,
              minorChapterTitle: unit.minorChapterTitle,
              title: unit.title,
              description: unit.description,
              totalCards: unit.totalCards,
              color: unit.color
            }]
          });
        } else {
          acc[gradeIndex].majorChapters[majorChapterIndex].subChapters[subChapterIndex].minorChapters.push({
            id: unit.id,
            minorChapter: unit.minorChapter,
            minorChapterTitle: unit.minorChapterTitle,
            title: unit.title,
            description: unit.description,
            totalCards: unit.totalCards,
            color: unit.color
          });
        }
      }
    }
    return acc;
  }, [] as GroupedData[]);

  const handleGradeToggle = (grade: string) => {
    setExpandedGrades(prev => {
      const newSet = new Set(prev);
      if (newSet.has(grade)) {
        newSet.delete(grade);
      } else {
        newSet.add(grade);
      }
      return newSet;
    });
  };

  const handleMajorChapterToggle = (majorChapterKey: string) => {
    setExpandedMajorChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(majorChapterKey)) {
        newSet.delete(majorChapterKey);
      } else {
        newSet.add(majorChapterKey);
      }
      return newSet;
    });
  };

  const handleSubChapterToggle = (subChapterKey: string) => {
    setExpandedSubChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subChapterKey)) {
        newSet.delete(subChapterKey);
      } else {
        newSet.add(subChapterKey);
      }
      return newSet;
    });
  };

  const handleCardToggle = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleGradeSelect = (grade: string, cards: string[]) => {
    const allCardIds = cards;
    const isAllSelected = allCardIds.every(id => selectedCards.includes(id));
    
    if (isAllSelected) {
      setSelectedCards(prev => prev.filter(id => !allCardIds.includes(id)));
    } else {
      setSelectedCards(prev => {
        const newSelection = [...prev];
        allCardIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleMajorChapterSelect = (majorChapter: string, cards: string[]) => {
    const allCardIds = cards;
    const isAllSelected = allCardIds.every(id => selectedCards.includes(id));
    
    if (isAllSelected) {
      setSelectedCards(prev => prev.filter(id => !allCardIds.includes(id)));
    } else {
      setSelectedCards(prev => {
        const newSelection = [...prev];
        allCardIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleSubChapterSelect = (subChapter: string, cards: string[]) => {
    const allCardIds = cards;
    const isAllSelected = allCardIds.every(id => selectedCards.includes(id));
    
    if (isAllSelected) {
      setSelectedCards(prev => prev.filter(id => !allCardIds.includes(id)));
    } else {
      setSelectedCards(prev => {
        const newSelection = [...prev];
        allCardIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  const handleConfirm = () => {
    if (selectedCards.length > 0) {
      console.log('Selected cards:', selectedCards);
      router.push('/flashcard');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const canConfirm = selectedCards.length > 0;

  return (
    <div className={styles.unitSelector}>
      <div className={styles.header}>
        <h1 className={styles.title}>시험 범위 선택</h1>
        <p className={styles.subtitle}>학습할 단원을 선택하세요</p>
      </div>

      <div className={styles.hierarchicalSelector}>
        <div className={styles.selectionInfo}>
          <h3 className={styles.selectionTitle}>단원 선택</h3>
          <p className={styles.selectionCount}>
            {selectedCards.length}개 선택됨
          </p>
        </div>

        {groupedData.map(gradeData => {
          const isGradeExpanded = expandedGrades.has(gradeData.grade);
          const gradeCardIds = gradeData.majorChapters.flatMap(major => 
            major.subChapters.flatMap(sub => sub.minorChapters.map(minor => minor.id))
          );
          const isGradeSelected = gradeCardIds.every(id => selectedCards.includes(id));
          const isGradePartiallySelected = gradeCardIds.some(id => selectedCards.includes(id)) && !isGradeSelected;

          return (
            <div key={gradeData.grade} className={styles.gradeGroup}>
              <button
                onClick={() => handleGradeToggle(gradeData.grade)}
                className={`${styles.gradeHeader} ${isGradeExpanded ? styles.expanded : ''}`}
              >
                <div className={styles.gradeInfo}>
                  <div className={styles.gradeTitle}>{gradeData.grade}학년</div>
                </div>
                <div className={styles.gradeActions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGradeSelect(gradeData.grade, gradeCardIds);
                    }}
                    className={`${styles.selectButton} ${
                      isGradeSelected ? styles.selected : 
                      isGradePartiallySelected ? styles.partiallySelected : ''
                    }`}
                  >
                    {isGradeSelected ? '전체 해제' : '전체 선택'}
                  </button>
                  <svg className={styles.expandIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isGradeExpanded && (
                <div className={styles.majorChapterList}>
                  {gradeData.majorChapters.map(majorChapterData => {
                    const majorChapterKey = `${gradeData.grade}-${majorChapterData.majorChapter}`;
                    const isMajorChapterExpanded = expandedMajorChapters.has(majorChapterKey);
                    const majorChapterCardIds = majorChapterData.subChapters.flatMap(sub => sub.minorChapters.map(minor => minor.id));
                    const isMajorChapterSelected = majorChapterCardIds.every(id => selectedCards.includes(id));
                    const isMajorChapterPartiallySelected = majorChapterCardIds.some(id => selectedCards.includes(id)) && !isMajorChapterSelected;

                    return (
                      <div key={majorChapterKey} className={styles.mainUnitGroup}>
                        <button
                          onClick={() => handleMajorChapterToggle(majorChapterKey)}
                          className={`${styles.mainUnitHeader} ${isMajorChapterExpanded ? styles.expanded : ''}`}
                        >
                          <div className={styles.mainUnitInfo}>
                            <div className={styles.chapterId}>{majorChapterData.majorChapter}</div>
                            <div className={styles.mainUnitTitle}>{majorChapterData.majorChapterTitle}</div>
                          </div>
                          <div className={styles.mainUnitActions}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMajorChapterSelect(majorChapterData.majorChapter, majorChapterCardIds);
                              }}
                              className={`${styles.selectButton} ${
                                isMajorChapterSelected ? styles.selected : 
                                isMajorChapterPartiallySelected ? styles.partiallySelected : ''
                              }`}
                            >
                              {isMajorChapterSelected ? '전체 해제' : '전체 선택'}
                            </button>
                            <svg className={styles.expandIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        {isMajorChapterExpanded && (
                          <div className={styles.subUnitList}>
                            {majorChapterData.subChapters.map(subChapterData => {
                              const subChapterKey = `${majorChapterKey}-${subChapterData.subChapter}`;
                              const isSubChapterExpanded = expandedSubChapters.has(subChapterKey);
                              const subChapterCardIds = subChapterData.minorChapters.map(minor => minor.id);
                              const isSubChapterSelected = subChapterCardIds.every(id => selectedCards.includes(id));
                              const isSubChapterPartiallySelected = subChapterCardIds.some(id => selectedCards.includes(id)) && !isSubChapterSelected;

                              return (
                                <div key={subChapterKey} className={styles.subUnitGroup}>
                                  <button
                                    onClick={() => handleSubChapterToggle(subChapterKey)}
                                    className={`${styles.subUnitHeader} ${isSubChapterExpanded ? styles.expanded : ''}`}
                                  >
                                    <div className={styles.subUnitInfo}>
                                      <div className={styles.subUnitId}>{majorChapterData.majorChapter}-{subChapterData.subChapter}</div>
                                      <div className={styles.subUnitTitle}>{subChapterData.subChapterTitle}</div>
                                    </div>
                                    <div className={styles.subUnitActions}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSubChapterSelect(subChapterData.subChapter, subChapterCardIds);
                                        }}
                                        className={`${styles.selectButton} ${
                                          isSubChapterSelected ? styles.selected : 
                                          isSubChapterPartiallySelected ? styles.partiallySelected : ''
                                        }`}
                                      >
                                        {isSubChapterSelected ? '전체 해제' : '전체 선택'}
                                      </button>
                                      <svg className={styles.expandIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </button>

                                  {isSubChapterExpanded && (
                                    <div className={styles.cardList}>
                                      {subChapterData.minorChapters.map(minorChapter => (
                                        <button
                                          key={minorChapter.id}
                                          onClick={() => handleCardToggle(minorChapter.id)}
                                          className={`${styles.cardButton} ${selectedCards.includes(minorChapter.id) ? styles.selected : ''}`}
                                        >
                                          <div className={styles.cardHeader}>
                                            <div className={styles.cardId}>{majorChapterData.majorChapter}-{subChapterData.subChapter}-{minorChapter.minorChapter}</div>
                                            {selectedCards.includes(minorChapter.id) && (
                                              <div className={styles.cardCheck}>
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                              </div>
                                            )}
                                          </div>
                                          <div className={styles.cardTitle}>{minorChapter.minorChapterTitle}</div>
                                          <div className={styles.cardDescription}>{minorChapter.description}</div>
                                          <div className={styles.cardCount}>{minorChapter.totalCards}개 카드</div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button onClick={handleCancel} className={styles.cancelButton}>
          취소
        </button>
        <button 
          onClick={handleConfirm} 
          className={`${styles.confirmButton} ${canConfirm ? styles.active : ''}`}
          disabled={!canConfirm}
        >
          시작하기 ({selectedCards.length})
        </button>
      </div>

      <BottomNavigation 
        activeMode="units"
        onModeChange={(mode) => {
          if (mode === 'main') router.push('/');
        }}
        onSettingClick={() => {}}
        currentLv={0}
        totalLv={0}
      />
    </div>
  );
} 