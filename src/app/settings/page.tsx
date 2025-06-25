'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { units } from '@/data/units';
import BottomNavigation from '@/components/BottomNavigation';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [examDate, setExamDate] = useState('');
  const [examRange, setExamRange] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [dateInputType, setDateInputType] = useState<'calendar' | 'manual'>('calendar');

  useEffect(() => {
    const isValidDate = examDate !== '';
    const isValidRange = examRange.length > 0;
    setIsValid(isValidDate && isValidRange);
  }, [examDate, examRange]);

  const handleSave = () => {
    if (!isValid) return;
    console.log('Settings saved:', { examDate, examRange });
    alert('설정이 저장되었습니다!');
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleUnitToggle = (unitId: string) => {
    if (examRange.includes(unitId)) {
      setExamRange(examRange.filter(id => id !== unitId));
    } else {
      setExamRange([...examRange, unitId]);
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (dateInputType === 'manual') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(value) || value === '') {
        setExamDate(value);
      }
    } else {
      setExamDate(value);
    }
  };

  const selectedUnits = units.filter(unit => examRange.includes(unit.id));

  const unitsByGrade = units.reduce((acc, unit) => {
    if (!acc[unit.grade]) acc[unit.grade] = [];
    acc[unit.grade].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  const calculateCurrentLv = () => {
    return examRange.length > 0 ? Math.floor(examRange.length * 0.3) : 0;
  };

  const calculateTotalLv = () => {
    return units.filter(unit => unit.type === 'main' && unit.progress >= 100).length;
  };

  const currentLv = calculateCurrentLv();
  const totalLv = calculateTotalLv();

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div className="header-content">
          <button onClick={handleCancel} className="back-button">
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>뒤로</span>
          </button>
          <h1 className="page-title">시험 설정</h1>
        </div>
      </header>

      <main className="settings-content">
        <div className="setting-section">
          <label className="setting-label">시험 날짜</label>
          <div className="date-input-container">
            <div className="date-input-type-selector">
              <button
                className={`date-type-button ${dateInputType === 'calendar' ? 'active' : ''}`}
                onClick={() => setDateInputType('calendar')}
              >
                📅 캘린더
              </button>
              <button
                className={`date-type-button ${dateInputType === 'manual' ? 'active' : ''}`}
                onClick={() => setDateInputType('manual')}
              >
                ✏️ 직접 입력
              </button>
            </div>
            <input
              type={dateInputType === 'calendar' ? 'date' : 'text'}
              value={examDate}
              onChange={handleDateInputChange}
              className="setting-input"
              placeholder={dateInputType === 'manual' ? 'YYYY-MM-DD' : '시험 날짜를 선택하세요'}
              maxLength={dateInputType === 'manual' ? 10 : undefined}
            />
          </div>
        </div>

        <div className="setting-section">
          <label className="setting-label">시험 범위 선택</label>
          <p className="setting-hint">시험에 포함될 단원들을 선택하세요</p>
          
          <div className="units-container">
            {Object.entries(unitsByGrade).map(([grade, gradeUnits]) => (
              <div key={grade} className="grade-section">
                <h4 className="grade-title">{grade}학년</h4>
                <div className="units-grid">
                  {gradeUnits.map(unit => (
                    <button
                      key={unit.id}
                      onClick={() => handleUnitToggle(unit.id)}
                      className={`unit-option ${examRange.includes(unit.id) ? 'selected' : ''}`}
                    >
                      <div className="unit-option-header">
                        <div className="unit-option-id">{unit.chapter}-{unit.subChapter}</div>
                        {examRange.includes(unit.id) && (
                          <div className="unit-option-check">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="unit-option-title">{unit.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-section">
          <div className="setting-preview">
            <h4 className="preview-title">설정 미리보기</h4>
            <div className="preview-content">
              <div className="preview-item">
                <span className="preview-label">시험 날짜:</span>
                <span className="preview-value">
                  {examDate ? new Date(examDate).toLocaleDateString('ko-KR') : '미설정'}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">선택된 단원:</span>
                <span className="preview-value">{selectedUnits.length}개 단원</span>
              </div>
              {selectedUnits.length > 0 && (
                <div className="preview-item">
                  <span className="preview-label">단원 목록:</span>
                  <div className="preview-units">
                    {selectedUnits.map(unit => (
                      <span key={unit.id} className="preview-unit-tag">
                        {unit.grade} {unit.chapter}-{unit.subChapter} {unit.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button onClick={handleCancel} className="cancel-button">취소</button>
          <button onClick={handleSave} disabled={!isValid} className="save-button">저장</button>
        </div>
      </main>

      <BottomNavigation
        activeMode="settings"
        onModeChange={(mode) => {
          if (mode === 'main') router.push('/');
        }}
        onSettingClick={() => {}}
        currentLv={currentLv}
        totalLv={totalLv}
      />

      <style jsx>{`
        .settings-page {
          min-height: 100vh;
          background: white;
          display: flex;
          flex-direction: column;
        }

        .settings-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 24px;
          flex-shrink: 0;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .back-icon {
          width: 16px;
          height: 16px;
        }

        .page-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .settings-content {
          flex: 1;
          padding: 24px;
          padding-bottom: 100px;
        }

        .setting-section {
          margin-bottom: 32px;
        }

        .setting-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .setting-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
          background: white;
        }

        .setting-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .date-input-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .date-input-type-selector {
          display: flex;
          gap: 8px;
        }

        .date-type-button {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .date-type-button.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .setting-hint {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .units-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .grade-section {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
        }

        .grade-title {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 12px 16px;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .units-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 8px;
          padding: 16px;
        }

        .unit-option {
          display: flex;
          flex-direction: column;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          min-height: 80px;
        }

        .unit-option:hover {
          border-color: #667eea;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .unit-option.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }

        .unit-option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .unit-option-id {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .unit-option-check {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .unit-option-check svg {
          width: 12px;
          height: 12px;
        }

        .unit-option-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          line-height: 1.3;
        }

        .setting-preview {
          background: #f9fafb;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid #e5e7eb;
        }

        .preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 12px 0;
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .preview-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .preview-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
          min-width: 80px;
        }

        .preview-value {
          font-size: 12px;
          color: #374151;
          font-weight: 600;
          flex: 1;
        }

        .preview-units {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .preview-unit-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 500;
          line-height: 1.3;
        }

        .settings-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .cancel-button,
        .save-button {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .cancel-button {
          background: #f3f4f6;
          color: #6b7280;
        }

        .cancel-button:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .save-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .save-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .save-button:disabled {
          background: #9ca3af;
          box-shadow: none;
          transform: none;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .settings-header {
            padding: 16px 20px;
          }

          .page-title {
            font-size: 18px;
          }

          .settings-content {
            padding: 20px;
            padding-bottom: 90px;
          }

          .preview-item {
            flex-direction: column;
            gap: 4px;
          }

          .preview-label {
            min-width: auto;
          }

          .units-grid {
            grid-template-columns: 1fr;
          }

          .date-input-type-selector {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
} 