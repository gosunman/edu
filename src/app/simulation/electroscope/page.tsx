'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface ChargeParticle {
  x: number;
  y: number;
  charge: 'positive' | 'negative';
  size: number;
}

export default function ElectroscopePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chargeType, setChargeType] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [chargeAmount, setChargeAmount] = useState(0);
  const [leafAngle, setLeafAngle] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [showCharges, setShowCharges] = useState(true);
  const [chargingMethod, setChargingMethod] = useState<'direct' | 'induction'>('direct');
  const [charges, setCharges] = useState<ChargeParticle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    // Calculate leaf angle based on charge amount
    const maxAngle = 45;
    const calculatedAngle = Math.min(Math.abs(chargeAmount) * 5, maxAngle);
    setLeafAngle(calculatedAngle);
    
    // Generate charge particles
    generateCharges();
  }, [chargeType, chargeAmount]);

  useEffect(() => {
    draw();
  }, [chargeType, chargeAmount, leafAngle, isCharging, showCharges, chargingMethod]);

  useEffect(() => {
    if (isCharging) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isCharging]);

  const animate = () => {
    if (!isCharging) return;
    
    setAnimationTime(prev => prev + 0.1);
    
    // Animate charge particles
    setCharges(prev => prev.map(charge => ({
      ...charge,
      x: charge.x + (Math.random() - 0.5) * 2,
      y: charge.y + (Math.random() - 0.5) * 2
    })));
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const generateCharges = () => {
    const newCharges: ChargeParticle[] = [];
    
    if (chargeType === 'neutral') {
      setCharges([]);
      return;
    }
    
    const numCharges = Math.abs(chargeAmount) * 5;
    
    for (let i = 0; i < numCharges; i++) {
      // Distribute charges on the metal parts
      const isOnSphere = Math.random() < 0.3;
      
      if (isOnSphere) {
        // Charges on the metal sphere
        const angle = Math.random() * Math.PI * 2;
        const radius = 40;
        newCharges.push({
          x: center.x + Math.cos(angle) * radius,
          y: center.y - 150 + Math.sin(angle) * radius,
          charge: chargeType as 'positive' | 'negative',
          size: 4
        });
      } else {
        // Charges on the leaves
        const leafSide = Math.random() < 0.5 ? -1 : 1;
        const leafX = center.x + leafSide * (10 + Math.random() * 20);
        const leafY = center.y + 50 + Math.random() * 80;
        
        newCharges.push({
          x: leafX,
          y: leafY,
          charge: chargeType as 'positive' | 'negative',
          size: 3
        });
      }
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
    
    // Draw electroscope
    drawElectroscope(ctx);
    
    // Draw charges
    if (showCharges) {
      drawCharges(ctx);
    }
    
    // Draw electric field lines
    if (chargeType !== 'neutral') {
      drawElectricField(ctx);
    }
    
    // Draw information
    drawInformation(ctx);
    
    // Draw charging rod
    if (isCharging) {
      drawChargingRod(ctx);
    }
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Laboratory background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Grid pattern
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvasWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  const drawElectroscope = (ctx: CanvasRenderingContext2D) => {
    // Base
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(center.x - 80, center.y + 150, 160, 30);
    
    // Insulator (glass or plastic)
    ctx.fillStyle = '#e5e7eb';
    ctx.fillRect(center.x - 15, center.y - 50, 30, 100);
    
    // Metal sphere (top)
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y - 150, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Metal sphere highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(center.x - 10, center.y - 160, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Metal rod (inside)
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(center.x - 2, center.y - 110, 4, 110);
    
    // Metal leaves
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    
    // Left leaf
    ctx.save();
    ctx.translate(center.x - 5, center.y + 50);
    ctx.rotate(-leafAngle * Math.PI / 180);
    ctx.fillRect(-2, 0, 4, 80);
    ctx.strokeRect(-2, 0, 4, 80);
    ctx.restore();
    
    // Right leaf
    ctx.save();
    ctx.translate(center.x + 5, center.y + 50);
    ctx.rotate(leafAngle * Math.PI / 180);
    ctx.fillRect(-2, 0, 4, 80);
    ctx.strokeRect(-2, 0, 4, 80);
    ctx.restore();
    
    // Case (protective glass)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeRect(center.x - 100, center.y - 80, 200, 160);
    
    // Case label
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('검전기', center.x, center.y + 200);
  };

  const drawCharges = (ctx: CanvasRenderingContext2D) => {
    charges.forEach(charge => {
      if (charge.charge === 'positive') {
        // Positive charge
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, charge.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Plus sign
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(charge.x - charge.size / 2, charge.y);
        ctx.lineTo(charge.x + charge.size / 2, charge.y);
        ctx.moveTo(charge.x, charge.y - charge.size / 2);
        ctx.lineTo(charge.x, charge.y + charge.size / 2);
        ctx.stroke();
      } else {
        // Negative charge
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(charge.x, charge.y, charge.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Minus sign
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(charge.x - charge.size / 2, charge.y);
        ctx.lineTo(charge.x + charge.size / 2, charge.y);
        ctx.stroke();
      }
    });
  };

  const drawElectricField = (ctx: CanvasRenderingContext2D) => {
    if (chargeType === 'neutral') return;
    
    ctx.strokeStyle = chargeType === 'positive' ? '#fca5a5' : '#93c5fd';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    
    // Electric field lines radiating from the sphere
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const startX = center.x + Math.cos(angle) * 45;
      const startY = center.y - 150 + Math.sin(angle) * 45;
      const endX = center.x + Math.cos(angle) * 120;
      const endY = center.y - 150 + Math.sin(angle) * 120;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Field direction arrows
      ctx.fillStyle = chargeType === 'positive' ? '#ef4444' : '#3b82f6';
      ctx.save();
      ctx.translate(endX, endY);
      ctx.rotate(angle + (chargeType === 'positive' ? 0 : Math.PI));
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6, -3);
      ctx.lineTo(-6, 3);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.setLineDash([]);
  };

  const drawChargingRod = (ctx: CanvasRenderingContext2D) => {
    const rodX = center.x - 150;
    const rodY = center.y - 200;
    
    // Charging rod
    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(rodX - 40, rodY - 5, 80, 10);
    
    // Rod charges
    const rodChargeType = chargingMethod === 'direct' ? chargeType : 
                         (chargeType === 'positive' ? 'negative' : 'positive');
    
    if (rodChargeType !== 'neutral') {
      for (let i = 0; i < 8; i++) {
        const x = rodX - 35 + i * 10;
        const y = rodY;
        
        ctx.fillStyle = rodChargeType === 'positive' ? '#ef4444' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Charge symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(rodChargeType === 'positive' ? '+' : '-', x, y + 2);
      }
    }
    
    // Rod label
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('충전봉', rodX, rodY + 25);
  };

  const drawInformation = (ctx: CanvasRenderingContext2D) => {
    // Information panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(520, 10, 270, 180);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(520, 10, 270, 180);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('검전기 상태', 530, 35);
    ctx.font = '14px Arial';
    ctx.fillText(`전하 종류: ${getChargeTypeName(chargeType)}`, 530, 55);
    ctx.fillText(`전하량: ${chargeAmount}`, 530, 75);
    ctx.fillText(`잎 벌어짐: ${leafAngle.toFixed(1)}°`, 530, 95);
    ctx.fillText(`충전 방법: ${chargingMethod === 'direct' ? '직접' : '유도'}`, 530, 115);
    
    // Status indicator
    const statusColor = chargeType === 'positive' ? '#ef4444' : 
                       chargeType === 'negative' ? '#3b82f6' : '#6b7280';
    
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(750, 55, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Principle explanation
    ctx.fillStyle = '#4b5563';
    ctx.font = '12px Arial';
    ctx.fillText('원리: 같은 전하끼리 밀어내어', 530, 140);
    ctx.fillText('금속 잎이 벌어집니다.', 530, 155);
    ctx.fillText('전하량이 클수록 더 많이 벌어집니다.', 530, 170);
  };

  const getChargeTypeName = (type: string): string => {
    switch (type) {
      case 'positive': return '양전하';
      case 'negative': return '음전하';
      case 'neutral': return '중성';
      default: return '';
    }
  };

  const chargeElectroscope = (type: 'positive' | 'negative') => {
    setChargeType(type);
    setChargeAmount(prev => Math.min(prev + 1, 10));
    setIsCharging(true);
    
    setTimeout(() => {
      setIsCharging(false);
    }, 2000);
  };

  const dischargeElectroscope = () => {
    setChargeType('neutral');
    setChargeAmount(0);
    setIsCharging(false);
  };

  return (
    <div className="electroscope-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>검전기 시뮬레이션</h1>
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
          <label>전하량: {chargeAmount}</label>
          <input
            type="range"
            min="0"
            max="10"
            value={chargeAmount}
            onChange={(e) => {
              const amount = Number(e.target.value);
              setChargeAmount(amount);
              if (amount === 0) {
                setChargeType('neutral');
              }
            }}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCharges}
              onChange={(e) => setShowCharges(e.target.checked)}
            />
            전하 표시
          </label>
        </div>

        <div className="button-group">
          <button 
            className="charge-button positive"
            onClick={() => chargeElectroscope('positive')}
          >
            양전하 충전
          </button>
          
          <button 
            className="charge-button negative"
            onClick={() => chargeElectroscope('negative')}
          >
            음전하 충전
          </button>
          
          <button 
            className="discharge-button"
            onClick={dischargeElectroscope}
          >
            방전
          </button>
        </div>
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
            <h4>정전기 유도</h4>
            <p>대전된 물체를 검전기에 가까이 하면 정전기 유도 현상에 의해 전하가 재분배됩니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>전하의 성질</h4>
            <p>같은 종류의 전하끼리는 서로 밀어내고, 다른 종류의 전하끼리는 서로 끌어당깁니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>검전기 작동</h4>
            <p>금속 잎에 같은 전하가 모이면 서로 밀어내어 잎이 벌어집니다. 전하량이 클수록 더 많이 벌어집니다.</p>
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

        .control-group input[type="range"] {
          width: 150px;
        }

        .control-group input[type="checkbox"] {
          width: auto;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .charge-button, .discharge-button {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .charge-button.positive {
          background: #ef4444;
          color: white;
        }

        .charge-button.positive:hover {
          background: #dc2626;
        }

        .charge-button.negative {
          background: #3b82f6;
          color: white;
        }

        .charge-button.negative:hover {
          background: #2563eb;
        }

        .discharge-button {
          background: #6b7280;
          color: white;
        }

        .discharge-button:hover {
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
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .explanation-section h4 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        .explanation-section p {
          color: #374151;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .button-group {
            flex-direction: column;
          }
          
          .simulation-canvas {
            width: 100%;
            max-width: 100%;
          }
          
          .explanation-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
} 