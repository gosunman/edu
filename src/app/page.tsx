'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { units } from '@/data/units';
import { flashCards } from '@/data/flashCards';
import UnitList from '@/components/UnitList';
import FlashCardSection from '@/components/FlashCardSection';
import AuthWrapper from '@/components/AuthWrapper';
import ProfileSetup from '@/components/ProfileSetup';
import UserProfile from '@/components/UserProfile';
import { AuthService } from '@/lib/auth';

export default function Home() {
  const { data: session } = useSession();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userStats, setUserStats] = useState({
    totalCorrectAnswers: 0,
    totalAttempts: 0,
    accuracy: 0,
    totalSessions: 0,
    totalStudyTime: 0,
  });

  // 사용자 통계 로드
  useEffect(() => {
    if (session?.user?.id) {
      loadUserStats();
    }
  }, [session?.user?.id]);

  // 프로필 설정 필요 여부 확인
  useEffect(() => {
    if (session?.user && !session.user.school) {
      setShowProfileSetup(true);
    }
  }, [session?.user]);

  const loadUserStats = async () => {
    if (session?.user?.id) {
      const stats = await AuthService.getUserStats(session.user.id);
      setUserStats(stats);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    setTotalAttempts(prev => prev + 1);
    if (isCorrect) {
      setUserScore(prev => prev + 1);
      alert('정답! 🎉');
    } else {
      alert('틀렸어요 😅');
    }
    
    setShowAnswer(false);
    setCurrentCardIndex(prev => (prev + 1) % flashCards.length);

    // DB에 진행률 업데이트
    if (session?.user?.id) {
      const currentUnit = units[0]; // 현재 선택된 단원 (임시로 첫 번째 단원)
      await AuthService.updateProgress({
        user_id: session.user.id,
        unit_id: currentUnit.id,
        correct_answers: isCorrect ? 1 : 0,
        total_attempts: 1,
      });
      
      // 통계 새로고침
      await loadUserStats();
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const getScorePercentage = () => {
    return userStats.accuracy;
  };

  const handleSelectUnit = (unitId: string) => {
    // 단원 선택 로직 (향후 구현)
    console.log('Selected unit:', unitId);
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">🔬</div>
            <div className="header-text">
              <h1 className="header-title">과학 학습실</h1>
              <p className="header-subtitle">중1,2,3학년 과학 교육</p>
            </div>
          </div>
          <AuthWrapper />
        </div>
      </header>

      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2 className="welcome-title">안녕하세요! 👋</h2>
          <p className="welcome-text">
            오늘도 과학의 신비로운 세계를 탐험해볼까요?
          </p>
        </section>

        {/* User Profile Section */}
        {session?.user && (
          <UserProfile />
        )}

        {/* Quick Stats - 가로 배치 */}
        <section className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{getScorePercentage()}%</div>
            <div className="stat-label">정답률</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userStats.totalAttempts}</div>
            <div className="stat-label">학습 횟수</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{units.length}</div>
            <div className="stat-label">학습 단원</div>
          </div>
        </section>

        {/* Learning Modes - 세로 배치 */}
        <section className="modes-container">
          <h2 className="section-title">학습 모드</h2>
          <div className="modes-grid-vertical">
            <button 
              className={`mode-card ${!isSimulationMode ? 'active' : ''}`}
              onClick={() => setIsSimulationMode(false)}
            >
              <div className="mode-icon">📚</div>
              <h3 className="mode-title">암기 카드</h3>
              <p className="mode-description">단원별 핵심 개념 학습</p>
            </button>
            <button 
              className={`mode-card ${isSimulationMode ? 'active' : ''}`}
              onClick={() => setIsSimulationMode(true)}
            >
              <div className="mode-icon">🎮</div>
              <h3 className="mode-title">3D 시뮬레이션</h3>
              <p className="mode-description">직관적인 실험 체험</p>
            </button>
          </div>
        </section>

        {/* Flash Card Section */}
        {!isSimulationMode && (
          <FlashCardSection
            flashCards={flashCards}
            currentCardIndex={currentCardIndex}
            showAnswer={showAnswer}
            toggleAnswer={toggleAnswer}
            handleAnswer={handleAnswer}
          />
        )}

        {/* 3D Simulation Placeholder */}
        {isSimulationMode && (
          <section className="simulation-container">
            <h2 className="section-title">3D 시뮬레이션</h2>
            <div className="simulation-placeholder">
              <div className="simulation-icon">🎮</div>
              <h3 className="simulation-text">3D 시뮬레이션 준비 중...</h3>
              <p className="simulation-description">
                곧 원자 구조, 전기 회로, 화학 반응 등을 3D로 체험할 수 있어요!
              </p>
            </div>
          </section>
        )}

        {/* Units Grid - 맨 아래로 이동 */}
        <UnitList units={units} onSelectUnit={handleSelectUnit} />
      </main>

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}
    </div>
  );
}
