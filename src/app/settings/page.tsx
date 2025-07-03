'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { units } from '@/data/units';
import BottomNavigation from '@/components/BottomNavigation';
import styles from './settings.module.css';

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
  const [cssLoaded, setCssLoaded] = useState(false);
  const [examDate, setExamDate] = useState('');
  const [examRange, setExamRange] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [dateInputType, setDateInputType] = useState<'calendar' | 'manual'>('calendar');
  
  // CSS 로딩 상태 확인 - 간단한 타이머 기반
  useEffect(() => {
    const timer = setTimeout(() => {
      setCssLoaded(true);
    }, 500); // 500ms 후 CSS 로드 완료로 간주
    
    return () => clearTimeout(timer);
  }, []);
  
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

  const handleSave = () => {
    if (!isValid) return;
    console.log('Settings saved:', { examDate, examRange });
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
    return units.filter(unit => unit.progress >= 100).length;
  };

  const currentLv = calculateCurrentLv();
  const totalLv = calculateTotalLv();

  // CSS가 로드되지 않았으면 로딩 상태 표시
  if (!cssLoaded) {
    return (
      <div className={styles.settingsPage}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.settingsPage} ${cssLoaded ? styles.loaded : styles.loading}`}>
      <header className={styles.settingsHeader}>
        <div className={styles.headerContent}>
          <button onClick={handleCancel} className={styles.backButton}>
            <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>뒤로</span>
          </button>
          <h1 className={styles.pageTitle}>시험 설정</h1>
        </div>
      </header>

      <main className={styles.settingsContent}>
        <div className={styles.settingSection}>
          <div className={styles.settingPreview}>
            <h4 className={styles.previewTitle}>내 시험 정보</h4>
            <div className={styles.previewContent}>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>시험 날짜:</span>
                <span className={styles.previewValue}>
                  {examDate ? new Date(examDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\. /g, '/').replace(/\./g, '') : '미설정'}
                </span>
              </div>
              <div className={styles.previewItem}>
                <span className={styles.previewLabel}>선택된 단원:</span>
                <span className={styles.previewValue}>{selectedUnits.length}개 단원</span>
              </div>
              {selectedUnits.length > 0 && (
                <div className={styles.previewItem}>
                  <span className={styles.previewLabel}>단원 목록:</span>
                  <div className={styles.previewUnits}>
                    {selectedUnits.map(unit => (
                      <span key={unit.id} className={styles.previewUnitTag}>
                        {unit.grade} {unit.majorChapter}-{unit.subChapter}-{unit.minorChapter} {unit.minorChapterTitle}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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
                className={styles.saveDateButton}
                onClick={() => {
                  console.log('날짜 저장:', examDate);
                }}
                disabled={!examDate}
              >
                저장
              </button>
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
                    >
                      {isGradeSelected ? '전체 해제' : '전체 선택'}
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
                              >
                                {isMajorChapterSelected ? '전체 해제' : '전체 선택'}
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
                                        >
                                          {isSubChapterSelected ? '전체 해제' : '전체 선택'}
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

        <div className={styles.settingsActions}>
          <button onClick={handleCancel} className={styles.cancelButton}>취소</button>
          <button onClick={handleSave} disabled={!isValid} className={styles.saveButton}>저장</button>
        </div>
      </main>

      <BottomNavigation
        activeMode="settings"
        onModeChange={(mode) => {
          if (mode === 'main') router.push('/');
        }}
        onSettingClick={() => {}}
        currentLv={currentLv}
        totalLv={totalLv}
      />
    </div>
  );
} 