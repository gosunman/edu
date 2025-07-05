'use client';

import { Mode } from '@/types';
import styles from './BottomNavigation.module.css';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface BottomNavigationProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
  onSettingClick: () => void;
  currentLv: number;
  totalLv: number;
}

export default function BottomNavigation({
  activeMode,
  onModeChange,
  onSettingClick,
  currentLv,
  totalLv
}: BottomNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className={styles.bottomNavigation}>
      <div className={styles.navContainer}>
        <button
          onClick={() => onModeChange('main')}
          className={`${styles.navButton} ${activeMode === 'main' ? styles.active : ''}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className={styles.navLabel}>홈</span>
        </button>

        <button
          onClick={() => onModeChange('flashcard')}
          className={`${styles.navButton} ${activeMode === 'flashcard' ? styles.active : ''}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className={styles.navLabel}>암기카드</span>
        </button>

        <button
          onClick={() => onModeChange('simulation')}
          className={`${styles.navButton} ${activeMode === 'simulation' ? styles.active : ''}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className={styles.navLabel}>시뮬레이션</span>
        </button>

        <button
          onClick={onSettingClick}
          className={`${styles.navButton} ${activeMode === 'settings' ? styles.active : ''}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className={styles.navLabel}>내 정보</span>
        </button>
      </div>
    </nav>
  );
} 