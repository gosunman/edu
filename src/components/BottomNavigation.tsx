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
            <div className="level-row">
              <span className="level-label">Season Lv</span>
              <span className="level-number">{currentLv}</span>
            </div>
            <div className="level-divider"></div>
            <div className="level-row">
              <span className="level-label">Total Lv</span>
              <span className="total-level">{totalLv}</span>
            </div>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 100;
          padding: 16px 0 32px 0;
          box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
        }

        .nav-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 400px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 20px;
          min-width: 90px;
          color: rgba(255, 255, 255, 0.8);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 20px;
          z-index: -1;
        }

        .nav-item:hover {
          color: #667eea;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .nav-item:hover::before {
          opacity: 0.1;
        }

        .nav-item.active {
          color: white;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          box-shadow: 0 12px 40px rgba(79, 70, 229, 0.4);
        }

        .nav-item.active::before {
          opacity: 1;
        }

        .nav-icon {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .nav-icon svg {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          stroke-width: 2;
          transition: all 0.4s ease;
        }

        .nav-label {
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          text-align: center;
          transition: all 0.4s ease;
          letter-spacing: 0.5px;
        }

        .level-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .level-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 10px 16px;
          background: rgba(248, 250, 252, 0.95);
          border-radius: 20px;
          color: #667eea;
          font-weight: 700;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          min-width: 80px;
        }

        .level-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
          transition: left 0.6s ease;
        }

        .level-badge:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
          background: rgba(248, 250, 252, 1);
        }

        .level-badge:hover::before {
          left: 100%;
        }

        .level-row {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .level-label {
          font-size: 10px;
          opacity: 0.8;
          font-weight: 600;
          color: #667eea;
          letter-spacing: 0.3px;
        }

        .level-number {
          font-size: 16px;
          font-weight: 800;
          color: #667eea;
        }

        .total-level {
          font-size: 14px;
          opacity: 0.8;
          font-weight: 600;
          color: #667eea;
        }

        .level-divider {
          width: 50px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.9), transparent);
          margin: 2px 0;
        }

        @media (max-width: 480px) {
          .bottom-navigation {
            padding: 12px 0 28px 0;
          }

          .nav-container {
            padding: 0 20px;
          }

          .nav-item {
            padding: 14px 16px;
            min-width: 80px;
          }

          .nav-icon {
            width: 26px;
            height: 26px;
          }

          .nav-icon svg {
            width: 20px;
            height: 20px;
          }

          .nav-label {
            font-size: 12px;
          }

          .level-badge {
            padding: 10px 16px;
          }

          .level-number {
            font-size: 16px;
          }

          .total-level {
            font-size: 14px;
          }
        }

        /* iOS Safari safe area support */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .bottom-navigation {
            padding-bottom: calc(12px + env(safe-area-inset-bottom));
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .bottom-navigation {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-item {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.7);
          }

          .nav-item:hover {
            color: #818cf8;
            background: rgba(255, 255, 255, 0.1);
          }

          .nav-item.active {
            color: #818cf8;
            background: rgba(255, 255, 255, 0.9);
          }

          .level-badge {
            background: rgba(255, 255, 255, 0.9);
            color: #818cf8;
          }

          .level-badge:hover {
            background: rgba(255, 255, 255, 1);
          }

          .level-label,
          .level-number,
          .level-separator,
          .total-level {
            color: #818cf8;
          }
        }
      `}</style>
    </nav>
  );
} 