'use client';

import { useNavigation } from '@/lib/navigation';
import { useRouter } from 'next/navigation';
import styles from './NavigationHeader.module.css';

interface NavigationHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function NavigationHeader({ 
  title, 
  showBackButton = true, 
  onBack 
}: NavigationHeaderProps) {
  const { canGoBack, goBack, getPageTitle, currentPath } = useNavigation();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      goBack();
    } else {
      router.push('/');
    }
  };

  const displayTitle = title || getPageTitle(currentPath);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {showBackButton && (
          <button 
            onClick={handleBack}
            className={styles.backButton}
            aria-label="뒤로 가기"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span>뒤로</span>
          </button>
        )}
        <h1 className={styles.title}>{displayTitle}</h1>
      </div>
    </header>
  );
} 