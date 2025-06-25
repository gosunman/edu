'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface BottomNavigationProps {
  activeMode: 'main' | 'flashcard' | 'simulation' | 'units' | 'settings';
  onModeChange: (mode: 'main' | 'flashcard' | 'simulation' | 'units' | 'settings') => void;
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
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 클라이언트 사이드에서만 렌더링
  if (!mounted) {
    return null;
  }

  return (
    <nav className="bottom-navigation">
      <div className="level-info">
        <span className="level-text">Lv {currentLv}</span>
        <span className="level-separator">/</span>
        <span className="total-level-text">Total {totalLv} Lv</span>
      </div>

      <button
        className={`nav-item ${activeMode === 'main' ? 'active' : ''}`}
        onClick={() => onModeChange('main')}
      >
        <div className="nav-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="nav-label">Home</span>
      </button>

      <button
        className="nav-item setting-nav"
        onClick={onSettingClick}
      >
        <div className="nav-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="nav-label">Setting</span>
      </button>

      <style jsx>{`
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0 16px 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .level-info {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .level-text {
          font-size: 14px;
          font-weight: 700;
        }

        .level-separator {
          opacity: 0.7;
        }

        .total-level-text {
          font-size: 11px;
          opacity: 0.9;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 12px;
          min-width: 60px;
          color: #6b7280;
        }

        .nav-item:hover {
          background: rgba(102, 126, 234, 0.05);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .nav-item.active .nav-icon {
          transform: scale(1.1);
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .nav-icon svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
        }

        .nav-label {
          font-size: 11px;
          font-weight: 500;
          line-height: 1;
          text-align: center;
        }

        .nav-item.active .nav-label {
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .bottom-navigation {
            padding: 6px 0 12px 0;
          }

          .level-info {
            padding: 6px 8px;
            font-size: 11px;
          }

          .level-text {
            font-size: 12px;
          }

          .total-level-text {
            font-size: 10px;
          }

          .nav-item {
            padding: 6px 8px;
            min-width: 50px;
          }

          .nav-icon {
            width: 20px;
            height: 20px;
          }

          .nav-icon svg {
            width: 16px;
            height: 16px;
          }

          .nav-label {
            font-size: 10px;
          }
        }

        /* iOS Safari safe area support */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-navigation {
            padding-bottom: calc(16px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </nav>
  );
} 