'use client';

import { useState, useEffect } from 'react';
import { units } from '@/data/units';

interface SettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: {
    examDate: string;
    examRange: string[];
  }) => void;
  currentSettings?: {
    examDate: string;
    examRange: string[];
  };
}

export default function SettingModal({ 
  isOpen, 
  onClose, 
  onSave,
  currentSettings 
}: SettingModalProps) {
  const [examDate, setExamDate] = useState(currentSettings?.examDate || '');
  const [examRange, setExamRange] = useState(currentSettings?.examRange || []);
  const [isValid, setIsValid] = useState(false);
  const [dateInputType, setDateInputType] = useState<'calendar' | 'manual'>('calendar');

  useEffect(() => {
    if (currentSettings) {
      setExamDate(currentSettings.examDate);
      setExamRange(currentSettings.examRange);
    }
  }, [currentSettings]);

  useEffect(() => {
    const isValidDate = examDate !== '';
    const isValidRange = examRange.length > 0;
    setIsValid(isValidDate && isValidRange);
  }, [examDate, examRange]);

  const handleSave = () => {
    if (!isValid) return;
    onSave({ examDate, examRange });
    onClose();
  };

  const handleCancel = () => {
    if (currentSettings) {
      setExamDate(currentSettings.examDate);
      setExamRange(currentSettings.examRange);
    } else {
      setExamDate('');
      setExamRange([]);
    }
    onClose();
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

  // 학년별로 단원 그룹화
  const unitsByGrade = units.reduce((acc, unit) => {
    if (!acc[unit.grade]) acc[unit.grade] = [];
    acc[unit.grade].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  if (!isOpen) return null;

  return (
    <div className="setting-modal-overlay">
      <div className="setting-modal">
        <div className="setting-modal-header">
          <h3 className="setting-modal-title">시험 설정</h3>
          <button onClick={handleCancel} className="setting-modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="setting-modal-content">
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
        </div>

        <div className="setting-modal-footer">
          <button onClick={handleCancel} className="cancel-button">취소</button>
          <button onClick={handleSave} disabled={!isValid} className="save-button">저장</button>
        </div>

        <style jsx>{`
          .setting-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 1000;
            display: flex;
            flex-direction: column;
          }

          .setting-modal {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
          }

          .setting-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            flex-shrink: 0;
          }

          .setting-modal-title {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
          }

          .setting-modal-close {
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
          }

          .setting-modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }

          .setting-modal-close svg {
            width: 18px;
            height: 18px;
          }

          .setting-modal-content {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
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

          .setting-modal-footer {
            padding: 20px 24px;
            border-top: 1px solid #f3f4f6;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            background: white;
            flex-shrink: 0;
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
            .setting-modal-header {
              padding: 16px 20px;
            }

            .setting-modal-title {
              font-size: 18px;
            }

            .setting-modal-content {
              padding: 20px;
            }

            .setting-modal-footer {
              padding: 16px 20px;
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
    </div>
  );
} 