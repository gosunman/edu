'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AuthService } from '@/lib/auth';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { data: session, update } = useSession();
  const [school, setSchool] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [currentGrade, setCurrentGrade] = useState(1);

  // 입학년도가 변경될 때마다 현재 학년 계산
  useEffect(() => {
    const grade = AuthService.calculateCurrentGrade(enrollmentYear);
    setCurrentGrade(grade);
  }, [enrollmentYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !school.trim()) return;

    setIsLoading(true);
    try {
      const updatedUser = await AuthService.updateUserProfile(session.user.id, {
        school: school.trim(),
        enrollment_year: enrollmentYear,
        grade: currentGrade,
      });

      if (updatedUser) {
        // 세션 업데이트
        await update();
        onComplete();
      }
    } catch (error) {
      // 에러 처리 (필요시 사용자에게 알림)
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const enrollmentYears = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="profile-setup">
      <div className="profile-setup-content">
        <h2 className="profile-setup-title">프로필 설정</h2>
        <p className="profile-setup-subtitle">
          더 나은 학습 경험을 위해 학교 정보를 입력해주세요
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="school" className="form-label">
              학교명
            </label>
            <input
              type="text"
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="예: 서울중학교"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="enrollmentYear" className="form-label">
              입학년도
            </label>
            <select
              id="enrollmentYear"
              value={enrollmentYear}
              onChange={(e) => setEnrollmentYear(Number(e.target.value))}
              className="form-select"
            >
              {enrollmentYears.map((year) => (
                <option key={year} value={year}>
                  {year}년
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">현재 학년</label>
            <div className="current-grade-display">
              <span className="grade-badge">{currentGrade}학년</span>
              <p className="grade-note">
                * 학년은 입학년도와 현재 날짜를 기준으로 자동 계산됩니다
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !school.trim()}
            className="submit-button"
          >
            {isLoading ? '저장 중...' : '프로필 저장'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .profile-setup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .profile-setup-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 480px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .profile-setup-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          text-align: center;
        }

        .profile-setup-subtitle {
          color: #6b7280;
          text-align: center;
          margin-bottom: 32px;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .form-input,
        .form-select {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .current-grade-display {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .grade-badge {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          width: fit-content;
        }

        .grade-note {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .submit-button {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 16px;
        }

        .submit-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .submit-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .profile-setup-content {
            padding: 24px;
            margin: 16px;
          }
        }
      `}</style>
    </div>
  );
} 