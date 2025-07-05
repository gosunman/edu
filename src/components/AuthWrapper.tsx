'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import UserProfile from './UserProfile';

// 개발 환경용 Mock 세션 데이터
const mockSession = {
  user: {
    id: 'dev-user-123',
    name: '개발자',
    email: 'dev@example.com',
    image: null,
    school: '테스트 대학교',
    grade: 2,
    enrollment_year: 2023,
    achievement_goal: 'advanced' as const,
    stats: {
      totalStudyTime: 120,
      completedUnits: 5,
      streak: 7,
      averageScore: 85
    }
  }
};

export default function AuthWrapper() {
  const { data: session, status } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 개발 환경에서는 Mock 세션 사용
  const isDevelopment = process.env.NODE_ENV === 'development';
  const effectiveSession = isDevelopment ? mockSession : session;
  const effectiveStatus = isDevelopment ? 'authenticated' : status;

  if (effectiveStatus === 'loading') {
    return (
      <div className="auth-wrapper">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (effectiveStatus === 'unauthenticated') {
    return (
      <div className="auth-wrapper">
        <button
          onClick={() => signIn('google')}
          className="login-button"
        >
          <svg className="google-icon" viewBox="-4 -4 32 32">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </button>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
    setIsEditing(false);
  };

  return (
    <div className="auth-wrapper">
      <div 
        className="user-section clickable"
        onClick={() => setShowProfile(true)}
      >
        <div className="user-info">
          <div className="user-name">{effectiveSession?.user?.name}</div>
          <div className="user-email">{effectiveSession?.user?.email}</div>
        </div>
        <div className="user-avatar">
          {effectiveSession?.user?.image ? (
            <img 
              src={effectiveSession.user.image} 
              alt="Profile" 
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              {effectiveSession?.user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="profile-modal-overlay" onClick={handleProfileClose}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <div className="modal-header-content">
                <div className="modal-avatar">
                  {effectiveSession?.user?.image ? (
                    <img 
                      src={effectiveSession.user.image} 
                      alt="Profile" 
                      className="modal-avatar-image"
                    />
                  ) : (
                    <div className="modal-avatar-placeholder">
                      {effectiveSession?.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="modal-user-info">
                  <h3 className="profile-modal-title">{effectiveSession?.user?.name}</h3>
                  <p className="profile-modal-subtitle">{effectiveSession?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleProfileClose}
                className="profile-modal-close"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="profile-modal-content">
              <UserProfile 
                isEditing={isEditing}
                onEditingChange={setIsEditing}
              />
            </div>
            <div className="profile-modal-footer">
              <div className="footer-buttons">
                <button
                  onClick={handleEditClick}
                  className="edit-button"
                >
                  <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {isEditing ? '취소' : '편집'}
                </button>
                <button
                  onClick={() => {
                    if (isDevelopment) {
                      alert('개발 환경에서는 로그아웃 기능이 비활성화되어 있습니다.');
                    } else {
                      signOut();
                    }
                  }}
                  className="logout-button"
                >
                  <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isDevelopment ? '로그아웃 (비활성화)' : '로그아웃'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .auth-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 80px;
          height: 70px;
          justify-content: center;
        }

        .user-section {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          width: 100%;
          position: relative;
        }

        .clickable {
          cursor: pointer;
          transition: all 0.2s;
        }

        .clickable:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
          order: 2;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
          flex: 1;
          order: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 10px;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 8px;
          opacity: 0.8;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .login-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: none;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          width: 35px;
          height: 35px;
        }

        .login-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .google-icon {
          width: 16px;
          height: 16px;
        }

        .loading-spinner {
          color: #6b7280;
          font-size: 12px;
          padding: 6px 10px;
          height: 60px;
          display: flex;
          align-items: center;
        }

        /* Profile Modal Styles */
        .profile-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .profile-modal {
          background: white;
          border-radius: 20px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .profile-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 20px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px 20px 0 0;
          position: relative;
        }

        .modal-header-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .modal-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .modal-avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-avatar-placeholder {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 24px;
        }

        .modal-user-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .profile-modal-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .profile-modal-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.2;
        }

        .profile-modal-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          color: white;
          transition: all 0.2s;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .profile-modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .profile-modal-close svg {
          width: 18px;
          height: 18px;
        }

        .profile-modal-content {
          padding: 24px;
          background: white;
        }

        .profile-modal-footer {
          padding: 20px 24px 24px 24px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: center;
          background: #fafafa;
          border-radius: 0 0 20px 20px;
        }

        .footer-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
          max-width: 300px;
        }

        .edit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          flex: 1;
        }

        .edit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          background: #f3f4f6;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          flex: 1;
        }

        .logout-button:hover {
          transform: translateY(-1px);
          background: #e5e7eb;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .edit-icon, .logout-icon {
          width: 16px;
          height: 16px;
        }

        @media (max-width: 640px) {
          .auth-wrapper {
            align-items: stretch;
            max-width: none;
            height: 50px;
          }

          .user-section {
            justify-content: center;
            align-items: center;
          }

          .loading-spinner {
            height: 50px;
          }

          .profile-modal-overlay {
            padding: 16px;
          }

          .profile-modal {
            border-radius: 16px;
          }

          .profile-modal-header {
            border-radius: 16px 16px 0 0;
            padding: 20px 20px 16px 20px;
          }

          .modal-avatar {
            width: 50px;
            height: 50px;
          }

          .modal-avatar-placeholder {
            font-size: 20px;
          }

          .profile-modal-title {
            font-size: 18px;
          }

          .profile-modal-subtitle {
            font-size: 13px;
          }

          .profile-modal-content {
            padding: 20px;
          }

          .profile-modal-footer {
            padding: 16px 20px 20px 20px;
          }

          .footer-buttons {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
} 