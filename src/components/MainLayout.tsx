'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NavigationHeader from '@/components/NavigationHeader';
import BottomNavigation from '@/components/BottomNavigation';
import AuthWrapper from '@/components/AuthWrapper';
import { Mode } from '@/types';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  currentLv?: number;
  totalLv?: number;
}

export default function MainLayout({ 
  children, 
  title, 
  showBackButton,
  currentLv = 0,
  totalLv = 0
}: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 활성 모드 결정
  const getActiveMode = (): Mode => {
    if (pathname.startsWith('/flashcard')) return 'flashcard';
    if (pathname.startsWith('/simulation')) return 'simulation';
    if (pathname.startsWith('/settings')) return 'settings';
    if (pathname === '/') return 'main';
    return 'main';
  };

  const activeMode = getActiveMode();

  const handleModeChange = (mode: Mode) => {
    switch (mode) {
      case 'main':
        router.push('/');
        break;
      case 'simulation':
        router.push('/simulation');
        break;
      case 'flashcard':
        router.push('/flashcard');
        break;
      case 'units':
        router.push('/?mode=units');
        break;
    }
  };

  const handleSettingClick = () => {
    router.push('/settings');
  };

  // 기본 네비게이션 페이지 확인
  const isDefaultPage = ['/', '/flashcard', '/simulation', '/settings'].includes(pathname);
  
  // 개별 시뮬레이션 페이지 등, 뒤로가기 버튼이 필요한 페이지
  const needsBackButton = !isDefaultPage;

  return (
    <div className={styles.mainLayout}>
      {needsBackButton ? (
        <NavigationHeader 
          title={title} 
          showBackButton={showBackButton === undefined ? true : showBackButton} 
        />
      ) : (
        <header className={styles.homeHeader}>
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
      )}

      <main className={styles.mainContent}>
        {children}
      </main>

      <BottomNavigation
        activeMode={activeMode}
        onModeChange={handleModeChange}
        onSettingClick={handleSettingClick}
        currentLv={currentLv}
        totalLv={totalLv}
      />
    </div>
  );
} 