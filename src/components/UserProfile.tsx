'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AuthService } from '@/lib/auth';

export default function UserProfile() {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [school, setSchool] = useState(session?.user?.school || '');
  const [enrollmentYear, setEnrollmentYear] = useState<number>(
    session?.user?.enrollment_year || new Date().getFullYear()
  );
  const [isLoading, setIsLoading] = useState(false);

  const currentGrade = session?.user?.enrollment_year 
    ? AuthService.calculateCurrentGrade(session.user.enrollment_year)
    : 1;

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const updatedUser = await AuthService.updateUserProfile(session.user.id, {
        school: school.trim(),
        enrollment_year: enrollmentYear,
        grade: AuthService.calculateCurrentGrade(enrollmentYear),
      });

      if (updatedUser) {
        await update();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSchool(session?.user?.school || '');
    setEnrollmentYear(session?.user?.enrollment_year || new Date().getFullYear());
    setIsEditing(false);
  };

  if (!session?.user) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h3 className="profile-title">프로필 정보</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button"
          >
            편집
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-item">
          <span className="profile-label">이름</span>
          <span className="profile-value">{session.user.name}</span>
        </div>

        <div className="profile-item">
          <span className="profile-label">이메일</span>
          <span className="profile-value">{session.user.email}</span>
        </div>

        {isEditing ? (
          <>
            <div className="profile-item">
              <span className="profile-label">학교</span>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="profile-input"
                placeholder="학교명을 입력하세요"
              />
            </div>

            <div className="profile-item">
              <span className="profile-label">입학년도</span>
              <select
                value={enrollmentYear}
                onChange={(e) => setEnrollmentYear(Number(e.target.value))}
                className="profile-select"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-item">
              <span className="profile-label">현재 학년</span>
              <span className="profile-value">
                <span className="grade-badge">{currentGrade}학년</span>
              </span>
            </div>

            <div className="profile-actions">
              <button
                onClick={handleSave}
                disabled={isLoading || !school.trim()}
                className="save-button"
              >
                {isLoading ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="cancel-button"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-item">
              <span className="profile-label">학교</span>
              <span className="profile-value">
                {session.user.school || '미설정'}
              </span>
            </div>

            <div className="profile-item">
              <span className="profile-label">현재 학년</span>
              <span className="profile-value">
                {session.user.enrollment_year ? (
                  <span className="grade-badge">{currentGrade}학년</span>
                ) : (
                  '미설정'
                )}
              </span>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .user-profile {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .profile-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .edit-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .edit-button:hover {
          background: #2563eb;
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .profile-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .profile-item:last-child {
          border-bottom: none;
        }

        .profile-label {
          font-weight: 500;
          color: #6b7280;
          font-size: 14px;
        }

        .profile-value {
          color: #1f2937;
          font-size: 14px;
        }

        .profile-input,
        .profile-select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          width: 200px;
        }

        .profile-input:focus,
        .profile-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .grade-badge {
          background: #3b82f6;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .save-button,
        .cancel-button {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .save-button {
          background: #10b981;
          color: white;
        }

        .save-button:hover:not(:disabled) {
          background: #059669;
        }

        .save-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .cancel-button {
          background: #f3f4f6;
          color: #374151;
        }

        .cancel-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .cancel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .profile-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .profile-input,
          .profile-select {
            width: 100%;
          }

          .profile-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
} 