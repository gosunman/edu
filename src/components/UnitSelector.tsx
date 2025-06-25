'use client';

import { useState } from 'react';
import { units } from '@/data/units';
import { Unit } from '@/types';

interface UnitSelectorProps {
  onUnitSelect: (unit: Unit) => void;
  onClose: () => void;
}

export default function UnitSelector({ onUnitSelect, onClose }: UnitSelectorProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('중1');
  const [selectedMainUnit, setSelectedMainUnit] = useState<string | null>(null);

  // 대단원들만 필터링 (type: 'main')
  const mainUnits = units.filter(unit => unit.type === 'main' && unit.grade === selectedGrade);
  
  // 선택된 대단원의 소단원들 필터링
  const subUnits = selectedMainUnit 
    ? units.filter(unit => unit.parentId === selectedMainUnit)
    : [];

  const grades = ['중1', '중2', '중3'];

  return (
    <div className="unit-selector-overlay" onClick={onClose}>
      <div className="unit-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="unit-selector-header">
          <h2 className="unit-selector-title">학습할 단원을 선택하세요</h2>
          <button onClick={onClose} className="unit-selector-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="unit-selector-content">
          {/* 학년 선택 */}
          <div className="grade-selector">
            <h3 className="grade-title">학년 선택</h3>
            <div className="grade-buttons">
              {grades.map(grade => (
                <button
                  key={grade}
                  onClick={() => {
                    setSelectedGrade(grade);
                    setSelectedMainUnit(null);
                  }}
                  className={`grade-button ${selectedGrade === grade ? 'active' : ''}`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* 대단원 선택 */}
          <div className="main-unit-section">
            <h3 className="section-title">대단원 선택</h3>
            <div className="main-unit-grid">
              {mainUnits.map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedMainUnit(unit.id)}
                  className={`main-unit-card ${selectedMainUnit === unit.id ? 'selected' : ''}`}
                >
                  <div className="unit-card-header">
                    <div className="unit-color" style={{ backgroundColor: unit.color }}></div>
                    <div className="unit-info">
                      <h4 className="unit-title">{unit.title}</h4>
                      <p className="unit-description">{unit.description}</p>
                    </div>
                  </div>
                  <div className="unit-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${unit.progress}%`,
                          backgroundColor: unit.color 
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{unit.completedCards}/{unit.totalCards} 완료</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 소단원 선택 */}
          {selectedMainUnit && subUnits.length > 0 && (
            <div className="sub-unit-section">
              <h3 className="section-title">소단원 선택</h3>
              <div className="sub-unit-grid">
                {subUnits.map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => onUnitSelect(unit)}
                    className="sub-unit-card"
                  >
                    <div className="unit-card-header">
                      <div className="unit-color" style={{ backgroundColor: unit.color }}></div>
                      <div className="unit-info">
                        <h4 className="unit-title">{unit.title}</h4>
                        <p className="unit-description">{unit.description}</p>
                      </div>
                    </div>
                    <div className="unit-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${unit.progress}%`,
                            backgroundColor: unit.color 
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{unit.completedCards}/{unit.totalCards} 완료</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .unit-selector-overlay {
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

          .unit-selector-modal {
            background: white;
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          .unit-selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 24px 0 24px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 16px;
          }

          .unit-selector-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }

          .unit-selector-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            color: #6b7280;
            transition: all 0.2s;
          }

          .unit-selector-close:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .unit-selector-close svg {
            width: 20px;
            height: 20px;
          }

          .unit-selector-content {
            padding: 24px;
          }

          .grade-selector {
            margin-bottom: 32px;
          }

          .grade-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 16px 0;
          }

          .grade-buttons {
            display: flex;
            gap: 12px;
          }

          .grade-button {
            padding: 10px 20px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            background: white;
            color: #6b7280;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .grade-button:hover {
            border-color: #667eea;
            color: #667eea;
          }

          .grade-button.active {
            border-color: #667eea;
            background: #667eea;
            color: white;
          }

          .main-unit-section {
            margin-bottom: 32px;
          }

          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 16px 0;
          }

          .main-unit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
          }

          .main-unit-card {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }

          .main-unit-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
          }

          .main-unit-card.selected {
            border-color: #667eea;
            background: #f8fafc;
          }

          .unit-card-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
          }

          .unit-color {
            width: 8px;
            height: 40px;
            border-radius: 4px;
            flex-shrink: 0;
          }

          .unit-info {
            flex: 1;
          }

          .unit-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 4px 0;
          }

          .unit-description {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
            line-height: 1.4;
          }

          .unit-progress {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .progress-bar {
            flex: 1;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
          }

          .progress-text {
            font-size: 11px;
            color: #6b7280;
            white-space: nowrap;
          }

          .sub-unit-section {
            margin-top: 24px;
          }

          .sub-unit-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 12px;
          }

          .sub-unit-card {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
          }

          .sub-unit-card:hover {
            border-color: #667eea;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
          }

          @media (max-width: 640px) {
            .unit-selector-overlay {
              padding: 16px;
            }

            .unit-selector-modal {
              border-radius: 16px;
            }

            .unit-selector-header {
              padding: 20px 20px 0 20px;
            }

            .unit-selector-content {
              padding: 20px;
            }

            .grade-buttons {
              flex-direction: column;
            }

            .main-unit-grid,
            .sub-unit-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
} 