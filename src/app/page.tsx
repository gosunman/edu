'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { units } from '@/data/units';
import { flashCards } from '@/data/flashCards';
import UnitList from '@/components/UnitList';
import FlashCardSection from '@/components/FlashCardSection';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileSetup from '@/components/ProfileSetup';
import UnitSelector from '@/components/UnitSelector';
import FlashCardStudy from '@/components/FlashCardStudy';
import BottomNavigation from '@/components/BottomNavigation';
import { AuthService } from '@/lib/auth';
import { Unit, UserStats, Mode, ProgressUpdate } from '@/types';
import styles from './Home.module.css';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>('main');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalCorrectAnswers: 0,
    totalAttempts: 0,
    accuracy: 0,
    totalSessions: 0,
    totalStudyTime: 0,
  });

  // Effects
  useEffect(() => {
    if (session?.user?.id) {
      loadUserStats();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user && !session.user.school) {
      setShowProfileSetup(true);
    }
  }, [session?.user]);

  // Functions
  const loadUserStats = async () => {
    if (session?.user?.id) {
      const stats = await AuthService.getUserStats(session.user.id);
      setUserStats(stats);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      alert('정답! 🎉');
    } else {
      alert('틀렸어요 😅');
    }

    setShowAnswer(false);
    setCurrentCardIndex(prev => (prev + 1) % flashCards.length);

    // DB에 진행률 업데이트
    if (session?.user?.id) {
      const currentUnit = units[0];
      await AuthService.updateProgress({
        user_id: session.user.id,
        unit_id: currentUnit.id,
        correct_answers: isCorrect ? 1 : 0,
        total_attempts: 1,
      });
      await loadUserStats();
    }
  };

  const handleModeClick = (mode: Mode) => {
    setActiveMode(mode);
  };

  const handleSettingClick = () => {
    router.push('/settings');
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowUnitSelector(false);
  };

  const calculateTotalLv = () => {
    return units.filter(unit => unit.type === 'unit' && unit.progress >= 100).length;
  };

  const currentLv = 0; // 시험 범위 설정이 없으면 0
  const totalLv = calculateTotalLv();

  // Render functions
  const renderMainContent = () => (
    <>
      <section className={styles.welcomeSection}>
        <h2 className={styles.welcomeTitle}>안녕하세요! 👋</h2>
        <p className={styles.welcomeText}>오늘도 과학의 신비로운 세계를 탐험해볼까요?</p>
      </section>

      <section className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{userStats.accuracy}%</div>
          <div className={styles.statLabel}>정답률</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{userStats.totalAttempts}</div>
          <div className={styles.statLabel}>학습 횟수</div>
        </div>
        <div className={styles.statCardClickable} onClick={() => handleModeClick('units')}>
          <div className={styles.statNumber}>{units.filter(u => u.type === 'unit').length}</div>
          <div className={styles.statLabel}>학습 단원</div>
        </div>
      </section>

      <section className={styles.modesContainer}>
        <h2 className={styles.sectionTitle}>학습 모드</h2>
        <div className={styles.modesGridVertical}>
          <button className={styles.modeCard} onClick={() => handleModeClick('flashcard')}>
            <div className={styles.modeIcon}>📚</div>
            <h3 className={styles.modeTitle}>암기 카드</h3>
            <p className={styles.modeDescription}>단원별 핵심 개념 학습</p>
          </button>
          <button className={styles.modeCard} onClick={() => handleModeClick('simulation')}>
            <div className={styles.modeIcon}>🎮</div>
            <h3 className={styles.modeTitle}>3D 시뮬레이션</h3>
            <p className={styles.modeDescription}>직관적인 실험 체험</p>
          </button>
        </div>
      </section>
    </>
  );

  const renderFlashCardContent = () => (
    <section className={styles.flashCardContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.pageTitle}>암기 카드</h2>
        </div>
        <div className={styles.headerDecoration}>
          <div className={styles.decorationDot}></div>
          <div className={styles.decorationLine}></div>
        </div>
      </div>
      <FlashCardSection
        flashCards={flashCards}
        currentCardIndex={currentCardIndex}
        showAnswer={showAnswer}
        toggleAnswer={() => setShowAnswer(!showAnswer)}
        handleAnswer={handleAnswer}
      />
    </section>
  );

  const renderSimulationContent = () => (
    <section className={styles.simulationContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.pageTitle}>3D 시뮬레이션</h2>
        </div>
        <div className={styles.headerDecoration}>
          <div className={styles.decorationDot}></div>
          <div className={styles.decorationLine}></div>
        </div>
      </div>
      <div className={styles.simulationPlaceholder}>
        <div className={styles.simulationIcon}>🎮</div>
        <h3 className={styles.simulationText}>3D 시뮬레이션 준비 중...</h3>
        <p className={styles.simulationDescription}>
          곧 원자 구조, 전기 회로, 화학 반응 등을 3D로 체험할 수 있어요!
        </p>
      </div>
    </section>
  );

  const renderUnitsContent = () => (
    <section className={styles.unitsContainer}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.pageTitle}>학습 단원</h2>
        </div>
        <div className={styles.headerDecoration}>
          <div className={styles.decorationDot}></div>
          <div className={styles.decorationLine}></div>
        </div>
      </div>
      <UnitList 
        onUnitSelect={(unit) => {
          console.log('Selected unit:', unit);
          setSelectedUnit(unit);
        }}
        selectedUnits={selectedUnit ? [selectedUnit.id] : []}
      />
    </section>
  );

  const renderContent = () => {
    switch (activeMode) {
      case 'main':
        return renderMainContent();
      case 'flashcard':
        return renderFlashCardContent();
      case 'simulation':
        return renderSimulationContent();
      case 'units':
        return renderUnitsContent();
      default:
        return renderMainContent();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>🔬</div>
            <div className={styles.headerText}>
              <h1 className={styles.headerTitle}>과학 학습실</h1>
              <p className={styles.headerSubtitle}>중1,2,3학년 과학 교육</p>
            </div>
          </div>
          <AuthWrapper />
        </div>
      </header>

      <main className={styles.mainContent}>
        {renderContent()}
      </main>

      {showProfileSetup && (
        <ProfileSetup onComplete={() => setShowProfileSetup(false)} />
      )}

      {selectedUnit && (
        <FlashCardStudy
          selectedUnit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
        />
      )}

      <BottomNavigation
        activeMode={activeMode}
        onModeChange={handleModeClick}
        onSettingClick={handleSettingClick}
        currentLv={currentLv}
        totalLv={totalLv}
      />
    </div>
  );
}
