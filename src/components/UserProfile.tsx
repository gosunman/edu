'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AuthService } from '@/lib/auth';

interface UserProfileProps {
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}

export default function UserProfile({ isEditing: externalIsEditing, onEditingChange }: UserProfileProps) {
  const { data: session, update } = useSession();
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [school, setSchool] = useState(session?.user?.school || '');
  const [enrollmentYear, setEnrollmentYear] = useState<number>(
    session?.user?.enrollment_year || new Date().getFullYear()
  );
  const [achievementGoal, setAchievementGoal] = useState<'basic' | 'advanced'>(
    session?.user?.achievement_goal || 'basic'
  );
  const [isLoading, setIsLoading] = useState(false);

  // 외부에서 편집 모드가 제어되면 그것을 사용, 아니면 내부 상태 사용
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;

  const currentGrade = session?.user?.enrollment_year 
    ? AuthService.calculateCurrentGrade(session.user.enrollment_year)
    : 1;

  const handleSave = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const updatedUser = await AuthService.updateUserProfile(session.user.id, {
        name: name.trim(),
        school: school.trim(),
        enrollment_year: enrollmentYear,
        grade: AuthService.calculateCurrentGrade(enrollmentYear),
        achievement_goal: achievementGoal,
      });

      if (updatedUser) {
        await update();
        const newEditingState = false;
        if (onEditingChange) {
          onEditingChange(newEditingState);
        } else {
          setInternalIsEditing(newEditingState);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(session?.user?.name || '');
    setSchool(session?.user?.school || '');
    setEnrollmentYear(session?.user?.enrollment_year || new Date().getFullYear());
    setAchievementGoal(session?.user?.achievement_goal || 'basic');
    const newEditingState = false;
    if (onEditingChange) {
      onEditingChange(newEditingState);
    } else {
      setInternalIsEditing(newEditingState);
    }
  };

  const handleStartEditing = () => {
    const newEditingState = true;
    if (onEditingChange) {
      onEditingChange(newEditingState);
    } else {
      setInternalIsEditing(newEditingState);
    }
  };

  // 세션 데이터가 변경되면 폼 데이터도 업데이트
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setSchool(session.user.school || '');
      setEnrollmentYear(session.user.enrollment_year || new Date().getFullYear());
      setAchievementGoal(session.user.achievement_goal || 'basic');
    }
  }, [session?.user]);

  if (!session?.user) return null;

  return (
    <div className="user-profile">
      <div className="profile-content">
        {isEditing ? (
          <>
            <div className="profile-item">
              <span className="profile-label">이름</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
                placeholder="이름을 입력하세요"
              />
            </div>

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

            <div className="profile-item">
              <span className="profile-label">희망 성취 목표</span>
              <select
                value={achievementGoal}
                onChange={(e) => setAchievementGoal(e.target.value as 'basic' | 'advanced')}
                className="profile-select"
              >
                <option value="basic">기본</option>
                <option value="advanced">심화</option>
              </select>
            </div>

            <div className="profile-actions">
              <button
                onClick={handleSave}
                disabled={isLoading || !name.trim() || !school.trim()}
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
              <span className="profile-label">이름</span>
              <span className="profile-value">{session.user.name}</span>
            </div>

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

            <div className="profile-item">
              <span className="profile-label">희망 성취 목표</span>
              <span className="profile-value">
                <span className={`goal-badge ${session.user.achievement_goal === 'advanced' ? 'advanced' : 'basic'}`}>
                  {session.user.achievement_goal === 'advanced' ? '심화' : '기본'}
                </span>
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

        .goal-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .goal-badge.basic {
          background: #10b981;
          color: white;
        }

        .goal-badge.advanced {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .save-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }

        .save-button:disabled {
          background: #9ca3af;
          box-shadow: none;
          transform: none;
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
        }
      `}</style>
    </div>
  );
} 