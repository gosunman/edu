'use client';

import { Mode } from '@/types';
import styles from './BottomNavigation.module.css';

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

        <div className={styles.levelIndicator}>
          <div className={styles.levelSection}>
            <span className={styles.levelLabel}>시즌</span>
            <span className={styles.levelValue}>Lv.{currentLv}</span>
          </div>
          <div className={styles.levelDivider}></div>
          <div className={styles.levelSection}>
            <span className={styles.levelLabel}>누적</span>
            <span className={styles.levelValue}>Lv.{totalLv}</span>
          </div>
        </div>

        <button
          onClick={onSettingClick}
          className={`${styles.navButton} ${activeMode === 'settings' ? styles.active : ''}`}
        >
          <svg className={styles.navIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={styles.navLabel}>설정</span>
        </button>
      </div>
    </nav>
  );
} 