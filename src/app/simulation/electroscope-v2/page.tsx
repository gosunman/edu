'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ChargeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  charge: number;
  type: 'positive' | 'negative';
}

export default function ElectroscopeV2Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chargeType, setChargeType] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [leafAngle, setLeafAngle] = useState(0);
  const [showCharges, setShowCharges] = useState(true);
  const [chargingMethod, setChargingMethod] = useState<'direct' | 'induction'>('direct');
  const [chargedObject, setChargedObject] = useState<{x: number, y: number, active: boolean, type: 'positive' | 'negative'}>({
    x: 200, y: 100, active: false, type: 'positive'
  });
  const [fingerTouch, setFingerTouch] = useState<{x: number, y: number, active: boolean}>({
    x: 200, y: 50, active: false
  });
  const [charges, setCharges] = useState<ChargeParticle[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    generateCharges();
  }, [chargeType, chargedObject, fingerTouch]);

  useEffect(() => {
    // Calculate leaf angle based on charge amount
    const maxAngle = 45;
    let chargeAmount = 0;
    
    if (chargeType === 'positive') chargeAmount = 1;
    else if (chargeType === 'negative') chargeAmount = -1;
    
    // Increase angle if charged object is nearby
    if (chargedObject.active) {
      const distance = Math.sqrt(
        Math.pow(chargedObject.x - center.x, 2) + 
        Math.pow(chargedObject.y - center.y, 2)
      );
      const proximity = Math.max(0, 1 - distance / 200);
      chargeAmount += proximity * (chargedObject.type === 'positive' ? 1 : -1);
    }
    
    const calculatedAngle = Math.min(Math.abs(chargeAmount) * 15, maxAngle);
    setLeafAngle(calculatedAngle);
  }, [chargeType, chargedObject, fingerTouch]);

  useEffect(() => {
    draw();
  }, [chargeType, leafAngle, showCharges, chargingMethod, chargedObject, fingerTouch, charges]);

  const generateCharges = () => {
    const newCharges: ChargeParticle[] = [];
    
    // Generate charges based on electroscope state
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * 2 * Math.PI;
      const radius = 20 + Math.random() * 80;
      
      let chargeSign = 0;
      if (chargeType === 'positive') chargeSign = 1;
      else if (chargeType === 'negative') chargeSign = -1;
      else chargeSign = Math.random() > 0.5 ? 1 : -1;
      
      newCharges.push({
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        charge: chargeSign,
        type: chargeSign > 0 ? 'positive' : 'negative'
      });
    }
    
    setCharges(newCharges);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    drawBackground(ctx);
    
    // Draw charged object if active
    if (chargedObject.active) {
      drawChargedObject(ctx);
    }
    
    // Draw finger if active
    if (fingerTouch.active) {
      drawFinger(ctx);
    }
    
    // Draw electroscope
    drawElectroscope(ctx);
    
    // Draw charges
    if (showCharges) {
      drawCharges(ctx);
    }
    
    // Draw field lines
    drawFieldLines(ctx);
    
    // Draw information
    drawInformation(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#f0f9ff');
    gradient.addColorStop(1, '#e0f2fe');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const drawElectroscope = (ctx: CanvasRenderingContext2D) => {
    // Metal sphere at top
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(center.x, center.y - 100, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Metal sphere highlight
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.arc(center.x - 10, center.y - 110, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Insulator
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(center.x - 8, center.y - 70, 16, 50);
    
    // Metal rod
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(center.x - 3, center.y - 70, 6, 100);
    
    // Glass case
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(center.x - 80, center.y - 20, 160, 120);
    
    // Metal leaves
    ctx.fillStyle = chargeType === 'positive' ? '#ef4444' : 
                    chargeType === 'negative' ? '#3b82f6' : '#9ca3af';
    
    // Left leaf
    ctx.save();
    ctx.translate(center.x - 5, center.y + 30);
    ctx.rotate(-leafAngle * Math.PI / 180);
    ctx.fillRect(-20, -2, 20, 4);
    ctx.restore();
    
    // Right leaf
    ctx.save();
    ctx.translate(center.x + 5, center.y + 30);
    ctx.rotate(leafAngle * Math.PI / 180);
    ctx.fillRect(0, -2, 20, 4);
    ctx.restore();
  };

  const drawChargedObject = (ctx: CanvasRenderingContext2D) => {
    // Charged rod or object
    ctx.fillStyle = chargedObject.type === 'positive' ? '#ef4444' : '#3b82f6';
    ctx.fillRect(chargedObject.x - 30, chargedObject.y - 10, 60, 20);
    
    // Charge symbols
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < 3; i++) {
      const x = chargedObject.x - 15 + (i * 15);
      const symbol = chargedObject.type === 'positive' ? '+' : '-';
      ctx.fillText(symbol, x, chargedObject.y + 5);
    }
  };

  const drawFinger = (ctx: CanvasRenderingContext2D) => {
    // Human finger
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(fingerTouch.x, fingerTouch.y, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Fingernail
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.ellipse(fingerTouch.x, fingerTouch.y - 15, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawCharges = (ctx: CanvasRenderingContext2D) => {
    charges.forEach(charge => {
      ctx.fillStyle = charge.type === 'positive' ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(charge.x, charge.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Charge symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(charge.type === 'positive' ? '+' : '-', charge.x, charge.y + 3);
    });
  };

  const drawFieldLines = (ctx: CanvasRenderingContext2D) => {
    if (!chargedObject.active) return;
    
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Draw field lines from charged object to electroscope
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const startX = chargedObject.x + Math.cos(angle) * 40;
      const startY = chargedObject.y + Math.sin(angle) * 40;
      const endX = center.x + Math.cos(angle) * 30;
      const endY = center.y - 100 + Math.sin(angle) * 30;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        (startX + endX) / 2 + Math.cos(angle + Math.PI/2) * 20,
        (startY + endY) / 2 + Math.sin(angle + Math.PI/2) * 20,
        endX, endY
      );
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawInformation = (ctx: CanvasRenderingContext2D) => {
    // Information panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 220, 180);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 180);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('검전기 시뮬레이션', 20, 30);
    ctx.fillText(`충전 방법: ${chargingMethod === 'direct' ? '직접 충전' : '유도 충전'}`, 20, 50);
    ctx.fillText(`전하 상태: ${getChargeState()}`, 20, 70);
    ctx.fillText(`금속박 각도: ${leafAngle.toFixed(1)}°`, 20, 90);
    
    if (chargedObject.active) {
      ctx.fillText(`대전체: ${chargedObject.type === 'positive' ? '양전하' : '음전하'}`, 20, 110);
    }
    
    if (fingerTouch.active) {
      ctx.fillText('손가락 접촉 중', 20, 130);
    }
    
    ctx.fillText('전기장 세기:', 20, 150);
    ctx.fillText(`${getFieldStrength()}`, 20, 170);
  };

  const getChargeState = (): string => {
    if (chargeType === 'positive') return '양전하';
    if (chargeType === 'negative') return '음전하';
    return '중성';
  };

  const getFieldStrength = (): string => {
    if (!chargedObject.active) return '약함';
    const distance = Math.sqrt(
      Math.pow(chargedObject.x - center.x, 2) + 
      Math.pow(chargedObject.y - center.y, 2)
    );
    if (distance < 100) return '강함';
    if (distance < 200) return '보통';
    return '약함';
  };

  const handleChargedObjectToggle = () => {
    setChargedObject(prev => ({ ...prev, active: !prev.active }));
  };

  const handleFingerTouchToggle = () => {
    setFingerTouch(prev => ({ ...prev, active: !prev.active }));
    
    // When finger touches, discharge the electroscope
    if (!fingerTouch.active) {
      setChargeType('neutral');
      setLeafAngle(0);
    }
  };

  const handleReset = () => {
    setChargeType('neutral');
    setLeafAngle(0);
    setChargedObject(prev => ({ ...prev, active: false }));
    setFingerTouch(prev => ({ ...prev, active: false }));
    generateCharges();
  };

  return (
    <div className="electroscope-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>검전기 시뮬레이션 (개선)</h1>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>충전 방법</label>
          <select 
            value={chargingMethod} 
            onChange={(e) => setChargingMethod(e.target.value as 'direct' | 'induction')}
          >
            <option value="direct">직접 충전</option>
            <option value="induction">유도 충전</option>
          </select>
        </div>

        <div className="control-group">
          <label>전하 종류</label>
          <select 
            value={chargeType} 
            onChange={(e) => setChargeType(e.target.value as 'positive' | 'negative' | 'neutral')}
          >
            <option value="neutral">중성</option>
            <option value="positive">양전하</option>
            <option value="negative">음전하</option>
          </select>
        </div>

        <div className="control-group">
          <label>대전체 종류</label>
          <select 
            value={chargedObject.type} 
            onChange={(e) => setChargedObject(prev => ({ ...prev, type: e.target.value as 'positive' | 'negative' }))}
          >
            <option value="positive">양전하</option>
            <option value="negative">음전하</option>
          </select>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCharges}
              onChange={(e) => setShowCharges(e.target.checked)}
            />
            전하 입자 표시
          </label>
        </div>

        <button 
          className={`action-button ${chargedObject.active ? 'active' : ''}`}
          onClick={handleChargedObjectToggle}
        >
          {chargedObject.active ? '대전체 제거' : '대전체 가져오기'}
        </button>

        <button 
          className={`action-button ${fingerTouch.active ? 'active' : ''}`}
          onClick={handleFingerTouchToggle}
        >
          {fingerTouch.active ? '손가락 떼기' : '손가락 대기'}
        </button>

        <button 
          className="reset-button"
          onClick={handleReset}
        >
          초기화
        </button>
      </div>

      <div className="simulation-area">
        <canvas 
          ref={canvasRef} 
          width={canvasWidth} 
          height={canvasHeight}
          className="simulation-canvas"
        />
      </div>

      <div className="explanation">
        <h3>검전기의 원리</h3>
        <div className="explanation-content">
          <div className="explanation-section">
            <h4>직접 충전</h4>
            <p>대전된 물체를 직접 접촉시켜 전하를 전달하는 방법입니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>유도 충전</h4>
            <p>대전체를 가까이 가져와 전기장으로 전하를 분리시키는 방법입니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>방전</h4>
            <p>손가락을 대면 전하가 몸으로 흘러나가 중성상태가 됩니다.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .electroscope-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .back-button {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .back-button:hover {
          text-decoration: underline;
        }

        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          align-items: flex-end;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .control-group select,
        .control-group input {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .control-group input[type="checkbox"] {
          width: auto;
        }

        .action-button {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .action-button:hover {
          background: #2563eb;
        }

        .action-button.active {
          background: #ef4444;
        }

        .action-button.active:hover {
          background: #dc2626;
        }

        .reset-button {
          padding: 10px 20px;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-button:hover {
          background: #4b5563;
        }

        .simulation-area {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .simulation-canvas {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .explanation {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #3b82f6;
        }

        .explanation h3 {
          color: #1f2937;
          margin-bottom: 20px;
        }

        .explanation-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .explanation-section {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .explanation-section h4 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        .explanation-section p {
          color: #6b7280;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
} 