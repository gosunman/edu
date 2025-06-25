'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
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
import { Unit } from '@/types';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [activeMode, setActiveMode] = useState<'main' | 'flashcard' | 'simulation' | 'units' | 'settings'>('main');
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
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

  const handleFlashCardClick = () => {
    setShowUnitSelector(true);
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setShowUnitSelector(false);
  };

  const handleFlashCardStudyClose = () => {
    setSelectedUnit(null);
  };

  const handleModeClick = (mode: 'main' | 'flashcard' | 'simulation' | 'units' | 'settings') => {
    setActiveMode(mode);
  };

  const handleSettingClick = () => {
    router.push('/settings');
  };

  // 레벨 계산 함수들
  const calculateCurrentLv = () => {
    // 시험 범위 설정이 없으면 0 반환
    return 0;
  };

  const calculateTotalLv = () => {
    // 전체 중 완료된 단원 수 계산 (progress가 100%인 단원)
    const completedUnits = units.filter(unit => 
      unit.type === 'main' && unit.progress >= 100
    ).length;
    
    return completedUnits;
  };

  const currentLv = calculateCurrentLv();
  const totalLv = calculateTotalLv();

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
        {/* Welcome Section - 메인 모드에서만 보임 */}
        {activeMode === 'main' && (
          <section className="welcome-section">
            <h2 className="welcome-title">안녕하세요! 👋</h2>
            <p className="welcome-text">
              오늘도 과학의 신비로운 세계를 탐험해볼까요?
            </p>
          </section>
        )}

        {/* Quick Stats - 메인 모드에서만 보임 */}
        {activeMode === 'main' && (
          <section className="stats-container">
            <div className="stat-card">
              <div className="stat-number">{getScorePercentage()}%</div>
              <div className="stat-label">정답률</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{userStats.totalAttempts}</div>
              <div className="stat-label">학습 횟수</div>
            </div>
            <div
              className="stat-card clickable"
              onClick={() => handleModeClick('units')}
            >
              <div className="stat-number">{units.filter(u => u.type === 'main').length}</div>
              <div className="stat-label">학습 단원</div>
            </div>
          </section>
        )}

        {/* Learning Modes - 메인 모드에서만 보임 */}
        {activeMode === 'main' && (
          <section className="modes-container">
            <h2 className="section-title">학습 모드</h2>
            <div className="modes-grid-vertical">
              <button
                className="mode-card"
                onClick={() => handleModeClick('flashcard')}
              >
                <div className="mode-icon">📚</div>
                <h3 className="mode-title">암기 카드</h3>
                <p className="mode-description">단원별 핵심 개념 학습</p>
              </button>
              <button
                className="mode-card"
                onClick={() => handleModeClick('simulation')}
              >
                <div className="mode-icon">🎮</div>
                <h3 className="mode-title">3D 시뮬레이션</h3>
                <p className="mode-description">직관적인 실험 체험</p>
              </button>
            </div>
          </section>
        )}

        {/* Flash Card Container */}
        {activeMode === 'flashcard' && (
          <section className="flash-card-container">
            <div className="page-header">
              <div className="header-content">
                <button
                  className="back-button"
                  onClick={() => handleModeClick('main')}
                >
                  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>메인으로</span>
                </button>
                <h2 className="page-title">암기 카드</h2>
              </div>
              <div className="header-decoration">
                <div className="decoration-dot"></div>
                <div className="decoration-line"></div>
              </div>
            </div>
            <FlashCardSection
              flashCards={flashCards}
              currentCardIndex={currentCardIndex}
              showAnswer={showAnswer}
              toggleAnswer={toggleAnswer}
              handleAnswer={handleAnswer}
            />
          </section>
        )}

        {/* 3D Simulation Container */}
        {activeMode === 'simulation' && (
          <section className="simulation-container">
            <div className="page-header">
              <div className="header-content">
                <button
                  className="back-button"
                  onClick={() => handleModeClick('main')}
                >
                  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>메인으로</span>
                </button>
                <h2 className="page-title">3D 시뮬레이션</h2>
              </div>
              <div className="header-decoration">
                <div className="decoration-dot"></div>
                <div className="decoration-line"></div>
              </div>
            </div>
            <div className="simulation-placeholder">
              <div className="simulation-icon">🎮</div>
              <h3 className="simulation-text">3D 시뮬레이션 준비 중...</h3>
              <p className="simulation-description">
                곧 원자 구조, 전기 회로, 화학 반응 등을 3D로 체험할 수 있어요!
              </p>
            </div>
          </section>
        )}

        {/* Units Container */}
        {activeMode === 'units' && (
          <section className="units-container">
            <div className="page-header">
              <div className="header-content">
                <button
                  className="back-button"
                  onClick={() => handleModeClick('main')}
                >
                  <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>메인으로</span>
                </button>
                <h2 className="page-title">학습 단원</h2>
              </div>
              <div className="header-decoration">
                <div className="decoration-dot"></div>
                <div className="decoration-line"></div>
              </div>
            </div>
            <UnitList units={units.filter(u => u.type === 'main')} onSelectUnit={handleSelectUnit} />
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeMode={activeMode}
        onModeChange={handleModeClick}
        onSettingClick={handleSettingClick}
        currentLv={currentLv}
        totalLv={totalLv}
      />

      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}

      {/* Unit Selector Modal */}
      {showUnitSelector && (
        <UnitSelector
          onUnitSelect={handleUnitSelect}
          onClose={() => setShowUnitSelector(false)}
        />
      )}

      {/* Flash Card Study Modal */}
      {selectedUnit && (
        <FlashCardStudy
          selectedUnit={selectedUnit}
          onClose={handleFlashCardStudyClose}
        />
      )}

      <style jsx>{`
        .main-content {
          padding-bottom: 100px; /* 하단 네비게이션 바 공간 */
        }

        .page-header {
          position: relative;
          margin-bottom: 32px;
          padding-bottom: 20px;
          }
          
        .header-content {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 20px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .back-button:active {
          transform: translateY(0);
        }

        .back-icon {
          width: 18px;
          height: 18px;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-decoration {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
        }

        .decoration-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .decoration-line {
          height: 2px;
          flex: 1;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, transparent 100%);
          border-radius: 1px;
        }

        .flash-card-container,
        .simulation-container,
        .units-container {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .simulation-placeholder {
          text-align: center;
          padding: 80px 40px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 24px;
          margin-top: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .simulation-icon {
          font-size: 80px;
          margin-bottom: 32px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .simulation-text {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
        }

        .simulation-description {
          font-size: 18px;
          color: #6b7280;
          line-height: 1.7;
          max-width: 500px;
          margin: 0 auto;
        }

        .stat-card.clickable {
          cursor: pointer;
          transition: all 0.2s;
        }

        .stat-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: row;
            align-items: flex-start;
            gap: 16px;
          }

          .page-title {
            font-size: 24px;
          }

          .back-button {
            padding: 10px 16px;
            font-size: 13px;
          }

          .flash-card-container,
          .simulation-container,
          .units-container {
            padding: 20px;
          }

          .simulation-placeholder {
            padding: 60px 20px;
          }

          .simulation-icon {
            font-size: 60px;
          }

          .simulation-text {
            font-size: 22px;
          }

          .simulation-description {
            font-size: 16px;
          }

          .main-content {
            padding-bottom: 90px;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            margin-bottom: 24px;
          }

          .header-content {
            gap: 12px;
          }

          .page-title {
            font-size: 20px;
          }

          .back-button {
            padding: 8px 12px;
            font-size: 12px;
          }

          .back-icon {
            width: 16px;
            height: 16px;
          }

          .flash-card-container,
          .simulation-container,
          .units-container {
            padding: 16px;
          }

          .main-content {
            padding-bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
}
