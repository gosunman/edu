'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { units } from '@/data/units';
import MainLayout from '@/components/MainLayout';
import styles from './settings.module.css';
import { AuthService } from '@/lib/auth';

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

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [examDate, setExamDate] = useState('');
  const [examRange, setExamRange] = useState<string[]>([]);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingRange, setIsEditingRange] = useState(false);
  const [userStats, setUserStats] = useState({
    totalCorrectAnswers: 0,
    totalAttempts: 0,
    accuracy: 0,
    totalSessions: 0,
    totalStudyTime: 0,
  });
  const [isValid, setIsValid] = useState(false);
  const [dateInputType, setDateInputType] = useState<'calendar' | 'manual'>('calendar');
  
  // 사용자의 현재 학년 계산
  const getUserGrade = () => {
    if (session?.user?.enrollment_year) {
      const currentYear = new Date().getFullYear();
      const enrollmentYear = session.user.enrollment_year;
      const grade = currentYear - enrollmentYear + 1;
      return Math.min(Math.max(grade, 1), 3); // 1-3학년 범위로 제한
    }
    return 1; // 기본값
  };

  // 계층적 접기/펼치기 상태 관리
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(() => {
    const userGrade = getUserGrade();
    return new Set([`중${userGrade}`]); // 사용자의 학년만 미리 열기
  });
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

  const toggleMajorChapter = (majorChapterKey: string) => {
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

  const toggleSubChapter = (subChapterKey: string) => {
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

  useEffect(() => {
    const isValidDate = examDate !== '';
    const isValidRange = examRange.length > 0;
    setIsValid(isValidDate && isValidRange);
  }, [examDate, examRange]);

  useEffect(() => {
    if (session?.user?.id) {
      AuthService.getUserStats(session.user.id).then(setUserStats);
    }
  }, [session?.user?.id]);

  // 컴포넌트 마운트 시 로컬스토리지에서 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('myExamInfo');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.examDate) setExamDate(parsed.examDate);
          if (Array.isArray(parsed.examRange)) setExamRange(parsed.examRange);
        } catch {}
      }
    }
  }, []);

  // 시험 정보 자동 저장 함수
  const saveExamInfo = (date: string, range: string[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('myExamInfo', JSON.stringify({ examDate: date, examRange: range }));
    }
  };

  // examDate, examRange가 바뀔 때마다 자동 저장
  useEffect(() => {
    saveExamInfo(examDate, examRange);
  }, [examDate, examRange]);

  const handleSave = () => {
    if (!isValid) return;
    alert('설정이 저장되었습니다!');
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleUnitToggle = (unitId: string) => {
    if (examRange.includes(unitId)) {
      setExamRange(examRange.filter(id => id !== unitId));
    } else {
      setExamRange([...examRange, unitId]);
    }
  };

  // 학년 전체 선택/해제
  const handleGradeSelect = (grade: string, allUnitIds: string[]) => {
    const isAllSelected = allUnitIds.every(id => examRange.includes(id));
    
    if (isAllSelected) {
      setExamRange(prev => prev.filter(id => !allUnitIds.includes(id)));
    } else {
      setExamRange(prev => {
        const newSelection = [...prev];
        allUnitIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // 대단원 전체 선택/해제
  const handleMajorChapterSelect = (majorChapter: string, allUnitIds: string[]) => {
    const isAllSelected = allUnitIds.every(id => examRange.includes(id));
    
    if (isAllSelected) {
      setExamRange(prev => prev.filter(id => !allUnitIds.includes(id)));
    } else {
      setExamRange(prev => {
        const newSelection = [...prev];
        allUnitIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // 중단원 전체 선택/해제
  const handleSubChapterSelect = (subChapter: string, allUnitIds: string[]) => {
    const isAllSelected = allUnitIds.every(id => examRange.includes(id));
    
    if (isAllSelected) {
      setExamRange(prev => prev.filter(id => !allUnitIds.includes(id)));
    } else {
      setExamRange(prev => {
        const newSelection = [...prev];
        allUnitIds.forEach(id => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
    }
  };

  // 시험 날짜 입력 핸들러에서 setExamDate만 호출하면 자동 저장됨
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (dateInputType === 'manual') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(value) || value === '') {
        setExamDate(value);
      }
    } else {
      setExamDate(value);
    }
  };

  const selectedUnits = units.filter(unit => examRange.includes(unit.id));

  const calculateCurrentLv = () => {
    return examRange.length > 0 ? Math.floor(examRange.length * 0.3) : 0;
  };

  const calculateTotalLv = () => {
    return units.filter(unit => unit.type === 'unit' && unit.progress >= 100).length;
  };

  const currentLv = calculateCurrentLv();
  const totalLv = calculateTotalLv();

  const completedUnits = units.filter(u => u.type === 'unit' && u.progress >= 100).length;
  const totalUnits = units.filter(u => u.type === 'unit').length;
  const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;
  const learnerLevel = Math.floor(completedUnits / 5) + 1; // 5단원 완료마다 1레벨업

  return (
    <MainLayout title="내 정보">
      <div className={styles.settingsPage}>
        {/* 학습 현황 대시보드 */}
        <section className={styles.dashboard}>
          <h2 className={styles.sectionTitle}>학습 현황</h2>
          <div className={styles.levelRowCompact}>
            <span className={styles.studyLvText}>Study Lv {learnerLevel}</span>
            <div className={styles.expBarCompact}>
              <div className={styles.expFillCompact} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <span className={styles.expTextCompact}>{completedUnits} / {totalUnits}</span>
          </div>
          <div className={styles.statsRowCompact}>
            <div className={styles.squareStatCardCompact}>
              <span className={styles.statIconCompact}>📈</span>
              <span className={styles.statValueCompact}>{userStats.totalAttempts}</span>
              <span className={styles.statLabelCompact}>학습 횟수</span>
            </div>
            <div className={styles.squareStatCardCompact}>
              <span className={styles.statIconCompact}>📚</span>
              <span className={styles.statValueCompact}>{totalUnits}</span>
              <span className={styles.statLabelCompact}>총 단원 수</span>
            </div>
          </div>
        </section>

        {/* 내 시험 정보 */}
        <section className={styles.examInfoSection}>
           <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>내 시험 정보</h2>
          </div>
          
          <div className={styles.previewItem}>
            <div className={styles.previewSides}>
              <div className={styles.previewLeft}>
                <span className={styles.previewLabel}>시험 날짜:</span>
                <span className={styles.previewValue}>
                  {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미설정'}
                </span>
              </div>
              <button onClick={() => setIsEditingDate(!isEditingDate)} className={styles.editButton + ' ' + styles.secondaryButton}>
                {isEditingDate ? '닫기' : '수정'}
              </button>
            </div>
          </div>
          {isEditingDate && (
            <div className={styles.editSection}>
              <div className={styles.settingSection}>
                <label className={styles.settingLabel}>시험 날짜</label>
                <div className={styles.dateInputContainer}>
                  <div className={styles.dateInputWrapper}>
                    <input
                      type="text"
                      value={examDate}
                      onChange={handleDateInputChange}
                      className={styles.dateInput}
                      placeholder="YYYY-MM-DD"
                      maxLength={10}
                    />
                    <input
                      type="date"
                      className={styles.hiddenDateInput}
                      onChange={(e) => setExamDate(e.target.value)}
                      value={examDate}
                    />
                    <button
                      type="button"
                      className={styles.calendarButton}
                      onClick={() => {
                        const dateInput = document.querySelector(`.${styles.hiddenDateInput}`) as HTMLInputElement;
                        if (dateInput) {
                          dateInput.showPicker();
                        }
                      }}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className={styles.dateActions}>
                    <button
                      type="button"
                      className={styles.deleteDateButton}
                      onClick={() => {
                        setExamDate('');
                      }}
                      disabled={!examDate}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.previewItem}>
            <div className={styles.previewSides}>
              <div className={styles.previewLeft}>
                <span className={styles.previewLabel}>선택된 단원:</span>
                <span className={styles.previewValue}>{examRange.length}개</span>
              </div>
              <button onClick={() => setIsEditingRange(!isEditingRange)} className={styles.editButton + ' ' + styles.secondaryButton}>
                {isEditingRange ? '닫기' : '수정'}
              </button>
            </div>
          </div>
          {isEditingRange && (
            <div className={styles.editSection}>
              <div className={styles.settingSection}>
                <label className={styles.settingLabel}>시험 범위 선택</label>
                <p className={styles.settingHint}>시험에 포함될 단원들을 선택하세요</p>
                
                <div className={styles.unitsContainer}>
                  {groupedData.map((gradeData) => {
                    const gradeUnitIds = gradeData.majorChapters.flatMap(major => 
                      major.subChapters.flatMap(sub => sub.minorChapters.map(minor => minor.id))
                    );
                    const isGradeSelected = gradeUnitIds.every(id => examRange.includes(id));
                    const isGradePartiallySelected = gradeUnitIds.some(id => examRange.includes(id)) && !isGradeSelected;

                    return (
                      <div key={gradeData.grade} className={styles.gradeSection}>
                        <div className={styles.gradeHeader}>
                          <button
                            className={styles.gradeToggleButton}
                            onClick={() => toggleGrade(gradeData.grade)}
                          >
                            <h4 className={styles.gradeTitle}>{gradeData.grade}학년</h4>
                            <svg 
                              className={`${styles.toggleIcon} ${expandedGrades.has(gradeData.grade) ? styles.expanded : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            className={`${styles.selectAllButton} ${
                              isGradeSelected ? styles.selected : 
                              isGradePartiallySelected ? styles.partiallySelected : ''
                            }`}
                            onClick={() => handleGradeSelect(gradeData.grade, gradeUnitIds)}
                            aria-label={isGradeSelected ? '전체 해제' : '전체 선택'}
                          >
                            <svg
                              className={styles.selectAllIcon}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                        </div>
                        
                        {expandedGrades.has(gradeData.grade) && (
                          <div className={styles.majorChaptersContainer}>
                            {gradeData.majorChapters.map((majorChapterData) => {
                              const majorChapterKey = `${gradeData.grade}-${majorChapterData.majorChapter}`;
                              const majorChapterUnitIds = majorChapterData.subChapters.flatMap(sub => sub.minorChapters.map(minor => minor.id));
                              const isMajorChapterSelected = majorChapterUnitIds.every(id => examRange.includes(id));
                              const isMajorChapterPartiallySelected = majorChapterUnitIds.some(id => examRange.includes(id)) && !isMajorChapterSelected;

                              return (
                                <div key={majorChapterKey} className={styles.majorChapterSection}>
                                  <div className={styles.majorChapterHeader}>
                                    <button
                                      className={styles.majorChapterToggleButton}
                                      onClick={() => toggleMajorChapter(majorChapterKey)}
                                    >
                                      <div className={styles.majorChapterInfo}>
                                        <span className={styles.majorChapterId}>{majorChapterData.majorChapter}</span>
                                        <span className={styles.majorChapterTitle}>{majorChapterData.majorChapterTitle}</span>
                                      </div>
                                      <svg 
                                        className={`${styles.toggleIcon} ${expandedMajorChapters.has(majorChapterKey) ? styles.expanded : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </button>
                                    <button
                                      className={`${styles.selectAllButton} ${
                                        isMajorChapterSelected ? styles.selected : 
                                        isMajorChapterPartiallySelected ? styles.partiallySelected : ''
                                      }`}
                                      onClick={() => handleMajorChapterSelect(majorChapterData.majorChapter, majorChapterUnitIds)}
                                      aria-label={isMajorChapterSelected ? '전체 해제' : '전체 선택'}
                                    >
                                      <svg
                                        className={styles.selectAllIcon}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </button>
                                  </div>

                                  {expandedMajorChapters.has(majorChapterKey) && (
                                    <div className={styles.subChaptersContainer}>
                                      {majorChapterData.subChapters.map((subChapterData) => {
                                        const subChapterKey = `${majorChapterKey}-${subChapterData.subChapter}`;
                                        const subChapterUnitIds = subChapterData.minorChapters.map(minor => minor.id);
                                        const isSubChapterSelected = subChapterUnitIds.every(id => examRange.includes(id));
                                        const isSubChapterPartiallySelected = subChapterUnitIds.some(id => examRange.includes(id)) && !isSubChapterSelected;

                                        return (
                                          <div key={subChapterKey} className={styles.subChapterSection}>
                                            <div className={styles.subChapterHeader}>
                                              <button
                                                className={styles.subChapterToggleButton}
                                                onClick={() => toggleSubChapter(subChapterKey)}
                                              >
                                                <div className={styles.subChapterInfo}>
                                                  <span className={styles.subChapterId}>{majorChapterData.majorChapter}-{subChapterData.subChapter}</span>
                                                  <span className={styles.subChapterTitle}>{subChapterData.subChapterTitle}</span>
                                                </div>
                                                <svg 
                                                  className={`${styles.toggleIcon} ${expandedSubChapters.has(subChapterKey) ? styles.expanded : ''}`}
                                                  fill="none" 
                                                  stroke="currentColor" 
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                              </button>
                                              <button
                                                className={`${styles.selectAllButton} ${
                                                  isSubChapterSelected ? styles.selected : 
                                                  isSubChapterPartiallySelected ? styles.partiallySelected : ''
                                                }`}
                                                onClick={() => handleSubChapterSelect(subChapterData.subChapter, subChapterUnitIds)}
                                                aria-label={isSubChapterSelected ? '전체 해제' : '전체 선택'}
                                              >
                                                <svg
                                                  className={styles.selectAllIcon}
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                              </button>
                                            </div>

                                            {expandedSubChapters.has(subChapterKey) && (
                                              <div className={styles.unitsGrid}>
                                                {subChapterData.minorChapters.map(minorChapter => (
                                                  <button
                                                    key={minorChapter.id}
                                                    onClick={() => handleUnitToggle(minorChapter.id)}
                                                    className={`${styles.unitOption} ${examRange.includes(minorChapter.id) ? styles.selected : ''}`}
                                                  >
                                                    <div className={styles.unitOptionHeader}>
                                                      <div className={styles.unitOptionId}>
                                                        {majorChapterData.majorChapter}-{subChapterData.subChapter}-{minorChapter.minorChapter}
                                                      </div>
                                                      {examRange.includes(minorChapter.id) && (
                                                        <div className={styles.unitOptionCheck}>
                                                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                          </svg>
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className={styles.unitOptionTitle}>{minorChapter.minorChapterTitle}</div>
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
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
} 