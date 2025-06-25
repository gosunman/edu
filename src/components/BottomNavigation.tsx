'use client';

import { useState, useEffect } from 'react';

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
      <div className="nav-container">
        <button
          className={`nav-item ${activeMode === 'main' ? 'active' : ''}`}
          onClick={() => onModeChange('main')}
        >
          <div className="nav-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="nav-label">홈</span>
        </button>

        <div className="level-indicator">
          <div className="level-badge">
            <span className="level-number">{currentLv}</span>
            <span className="level-separator">/</span>
            <span className="total-level">{totalLv}</span>
          </div>
        </div>

        <button
          className={`nav-item ${activeMode === 'settings' ? 'active' : ''}`}
          onClick={onSettingClick}
        >
          <div className="nav-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="nav-label">설정</span>
        </button>
      </div>

      <style jsx>{`
        .bottom-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          z-index: 100;
          padding: 12px 0 24px 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 16px;
          min-width: 80px;
          color: #6b7280;
          position: relative;
        }

        .nav-item:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
        }

        .nav-item.active {
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transform: translateY(-4px);
        }

        .nav-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .nav-icon svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          stroke-width: 2;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 600;
          line-height: 1;
          text-align: center;
          transition: all 0.3s ease;
        }

        .level-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .level-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .level-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .level-number {
          font-size: 16px;
          font-weight: 800;
        }

        .level-separator {
          font-size: 12px;
          opacity: 0.8;
          font-weight: 600;
        }

        .total-level {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .bottom-navigation {
            padding: 10px 0 20px 0;
          }

          .nav-container {
            padding: 0 16px;
          }

          .nav-item {
            padding: 10px 12px;
            min-width: 70px;
          }

          .nav-icon {
            width: 22px;
            height: 22px;
          }

          .nav-icon svg {
            width: 18px;
            height: 18px;
          }

          .nav-label {
            font-size: 11px;
          }

          .level-badge {
            padding: 6px 12px;
          }

          .level-number {
            font-size: 14px;
          }

          .total-level {
            font-size: 12px;
          }
        }

        /* iOS Safari safe area support */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-navigation {
            padding-bottom: calc(24px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </nav>
  );
} 