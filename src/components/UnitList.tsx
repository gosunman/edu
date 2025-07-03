'use client';

import { useState } from 'react';
import { units } from '@/data/units';
import { Unit } from '@/types';
import styles from './UnitList.module.css';

interface UnitListProps {
  onUnitSelect: (unit: Unit) => void;
  selectedUnits?: string[];
}

export default function UnitList({ onUnitSelect, selectedUnits = [] }: UnitListProps) {
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set(['중1']));

  const toggleGrade = (grade: string) => {
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

  // 학년별 단원 그룹화
  const unitsByGrade = units.reduce((acc, unit) => {
    if (!acc[unit.grade]) acc[unit.grade] = [];
    acc[unit.grade].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  // 대단원별로 그룹화
  const groupByMainUnit = (gradeUnits: typeof units) => {
    const mainUnits = gradeUnits.filter(unit => unit.type === 'main');
    return mainUnits.map(mainUnit => {
      const subUnits = gradeUnits.filter(unit => 
        unit.type === 'sub' && unit.mainUnit === mainUnit.id
      );
      return { mainUnit, subUnits };
    });
  };

  // 중단원별로 소단원 그룹화
  const groupBySubUnit = (subUnits: typeof units) => {
    return subUnits.map(subUnit => {
      const cards = units.filter(unit => 
        unit.type === 'card' && unit.subUnit === subUnit.id
      );
      return { subUnit, cards };
    });
  };

  return (
    <div className={styles.unitList}>
      {Object.entries(unitsByGrade).map(([grade, gradeUnits]) => (
        <div key={grade} className={styles.gradeSection}>
          <h2 className={styles.gradeTitle}>{grade}학년</h2>
          
          {expandedGrades.has(grade) && (
            <>
              {groupByMainUnit(gradeUnits).map(({ mainUnit, subUnits }) => (
                <div key={mainUnit.id} className={styles.mainUnitGroup}>
                  <div className={styles.mainUnitHeader}>
                    <h3 className={styles.mainUnitTitle}>
                      {mainUnit.chapter}. {mainUnit.title}
                    </h3>
                  </div>
                  
                  {groupBySubUnit(subUnits).map(({ subUnit, cards }) => (
                    <div key={subUnit.id} className={styles.subUnitGroup}>
                      <div className={styles.subUnitHeader}>
                        <h4 className={styles.subUnitTitle}>
                          {subUnit.chapter}-{subUnit.subChapter}. {subUnit.title}
                        </h4>
                      </div>
                      
                      <div className={styles.cardGrid}>
                        {cards.map(card => (
                          <div
                            key={card.id}
                            onClick={() => onUnitSelect(card)}
                            className={`${styles.unitCard} ${selectedUnits.includes(card.id) ? styles.selected : ''}`}
                          >
                            <div className={`${styles.unitColor} ${styles.card}`}></div>
                            
                            {selectedUnits.includes(card.id) && (
                              <div className={styles.selectionIndicator}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            
                            <div className={styles.unitHeader}>
                              <div className={styles.unitInfo}>
                                <div className={styles.unitNumber}>
                                  {card.chapter}-{card.subChapter}
                                </div>
                                <h5 className={styles.unitTitle}>{card.title}</h5>
                                <p className={styles.unitDescription}>{card.description}</p>
                              </div>
                            </div>
                            
                            <div className={styles.unitProgress}>
                              <div className={styles.progressBar}>
                                <div 
                                  className={styles.progressFill} 
                                  style={{ width: `${card.progress}%` }}
                                ></div>
                              </div>
                              <div className={styles.progressText}>
                                {card.completedCards}/{card.totalCards} 완료
                              </div>
                            </div>
                            
                            <div className={styles.unitStats}>
                              <div className={styles.statItem}>
                                <span className={styles.statValue}>{card.progress}%</span>
                                <span className={styles.statLabel}>진행률</span>
                              </div>
                              <div className={styles.statItem}>
                                <span className={styles.statValue}>{card.completedCards}</span>
                                <span className={styles.statLabel}>완료</span>
                              </div>
                              <div className={styles.statItem}>
                                <span className={styles.statValue}>{card.totalCards}</span>
                                <span className={styles.statLabel}>전체</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
} 