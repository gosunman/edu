'use client';

import { Unit } from '@/types';

interface UnitListProps {
  units: Unit[];
  onSelectUnit: (unitId: string) => void;
}

export default function UnitList({ units, onSelectUnit }: UnitListProps) {
  return (
    <div className="units-container">
      <h2 className="section-title">학습 단원</h2>
      {units.map((unit) => (
        <div
          key={unit.id}
          className="unit-card"
          onClick={() => onSelectUnit(unit.id)}
        >
          <div className="unit-header">
            <div className="unit-info">
              <div className="unit-grade">{unit.grade}</div>
              <h3 className="unit-title">{unit.title}</h3>
              <p className="unit-description">{unit.description}</p>
            </div>
            <div className="unit-progress">
              <div className="progress-text">{unit.progress}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${unit.progress}%`,
                    backgroundColor: unit.color
                  }}
                />
              </div>
            </div>
          </div>
          <div className="unit-stats">
            <span className="unit-stats-text">
              완료: {unit.completedCards}/{unit.totalCards} 카드
            </span>
          </div>
        </div>
      ))}
    </div>
  );
} 