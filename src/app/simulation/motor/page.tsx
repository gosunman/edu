'use client';
import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import './motor.css';

export default function MotorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [showMagneticField, setShowMagneticField] = useState(true);
  const [showForces, setShowForces] = useState(true);
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);
  const [showCommutator, setShowCommutator] = useState(true);
  const [rotorAngle, setRotorAngle] = useState(0);
  const [voltage, setVoltage] = useState(12);
  const [currentDirection, setCurrentDirection] = useState<'clockwise' | 'counter-clockwise'>('clockwise');
  const animationRef = useRef<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [rotorAngle, showMagneticField, showForces, showCurrentFlow, showCommutator, voltage, currentDirection, animationTime]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setRotorAngle(prev => {
          const newAngle = prev + (speed * 0.02);
          return newAngle % (Math.PI * 2);
        });
        setAnimationTime(prev => prev + 0.1);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    drawBackground(ctx);
    
    // Draw magnetic field
    if (showMagneticField) {
      drawMagneticField(ctx);
    }
    
    // Draw stator (permanent magnets)
    drawStator(ctx);
    
    // Draw rotor
    drawRotor(ctx);
    
    // Draw commutator
    if (showCommutator) {
      drawCommutator(ctx);
    }
    
    // Draw forces
    if (showForces) {
      drawForces(ctx);
    }
    
    // Draw current flow
    if (showCurrentFlow) {
      drawCurrentFlow(ctx);
    }
    
    // Draw info panel
    drawInfoPanel(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Grid
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

  const drawMagneticField = (ctx: CanvasRenderingContext2D) => {
    // 균일한 자기장 (N극에서 S극으로)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 12; i++) {
      const y = center.y - 150 + (i * 25);
      ctx.beginPath();
      ctx.moveTo(center.x - 180, y);
      ctx.lineTo(center.x + 180, y);
      ctx.stroke();
      
      // 자기장 방향 화살표
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.beginPath();
      ctx.moveTo(center.x + 150, y);
      ctx.lineTo(center.x + 140, y - 5);
      ctx.lineTo(center.x + 140, y + 5);
      ctx.closePath();
      ctx.fill();
    }
  };

  const drawStator = (ctx: CanvasRenderingContext2D) => {
    // N극 (위쪽)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(center.x - 200, center.y - 220, 400, 40);
    
    // S극 (아래쪽)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(center.x - 200, center.y + 180, 400, 40);
    
    // 극 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', center.x, center.y - 195);
    ctx.fillText('S', center.x, center.y + 205);
    
    // 자기장 방향 표시
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.fillText('자기장 방향: N → S', center.x, center.y - 250);
  };

  const drawRotor = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 회전자 코일 (직사각형)
    const coilWidth = 120;
    const coilHeight = 8;
    
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-coilWidth / 2, -coilHeight / 2, coilWidth, coilHeight);
    ctx.fillRect(-coilWidth / 2, -coilHeight / 2 - 80, coilWidth, coilHeight);
    ctx.fillRect(-coilWidth / 2, -coilHeight / 2 + 80, coilWidth, coilHeight);
    
    // 수직 부분
    ctx.fillRect(-coilWidth / 2, -coilHeight / 2 - 80, coilHeight, 160);
    ctx.fillRect(coilWidth / 2 - coilHeight, -coilHeight / 2 - 80, coilHeight, 160);
    
    // 회전축
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawCommutator = (ctx: CanvasRenderingContext2D) => {
    // 정류자 (두 개의 반원)
    const commutatorRadius = 25;
    
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 정류자 세그먼트 1
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, commutatorRadius, 0, Math.PI);
    ctx.fill();
    
    // 정류자 세그먼트 2
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, commutatorRadius, Math.PI, 2 * Math.PI);
    ctx.fill();
    
    // 분할선
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-commutatorRadius, 0);
    ctx.lineTo(commutatorRadius, 0);
    ctx.stroke();
    
    ctx.restore();
    
    // 브러시 (고정)
    ctx.fillStyle = '#374151';
    ctx.fillRect(center.x - 30, center.y - 5, 10, 10);
    ctx.fillRect(center.x + 20, center.y - 5, 10, 10);
    
    // 브러시 라벨
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('+', center.x - 25, center.y - 10);
    ctx.fillText('−', center.x + 25, center.y - 10);
    
    // 전원 연결선
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center.x - 30, center.y);
    ctx.lineTo(center.x - 60, center.y);
    ctx.stroke();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(center.x + 30, center.y);
    ctx.lineTo(center.x + 60, center.y);
    ctx.stroke();
    
    // 전원 표시
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${voltage}V`, center.x + 70, center.y + 5);
  };

  const drawForces = (ctx: CanvasRenderingContext2D) => {
    // 자기력 벡터 (F = BIL)
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 좌측 도선에 작용하는 힘
    const forceScale = 40;
    const leftForceAngle = Math.PI / 2; // 위쪽 힘
    const rightForceAngle = -Math.PI / 2; // 아래쪽 힘
    
    // 좌측 힘 벡터
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-60, 0);
    ctx.lineTo(-60 + Math.cos(leftForceAngle) * forceScale, Math.sin(leftForceAngle) * forceScale);
    ctx.stroke();
    
    // 좌측 화살표
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-60 + Math.cos(leftForceAngle) * forceScale, Math.sin(leftForceAngle) * forceScale);
    ctx.lineTo(-60 + Math.cos(leftForceAngle) * (forceScale - 10) - 5, Math.sin(leftForceAngle) * (forceScale - 10) - 5);
    ctx.lineTo(-60 + Math.cos(leftForceAngle) * (forceScale - 10) + 5, Math.sin(leftForceAngle) * (forceScale - 10) + 5);
    ctx.closePath();
    ctx.fill();
    
    // 우측 힘 벡터
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(60 + Math.cos(rightForceAngle) * forceScale, Math.sin(rightForceAngle) * forceScale);
    ctx.stroke();
    
    // 우측 화살표
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(60 + Math.cos(rightForceAngle) * forceScale, Math.sin(rightForceAngle) * forceScale);
    ctx.lineTo(60 + Math.cos(rightForceAngle) * (forceScale - 10) - 5, Math.sin(rightForceAngle) * (forceScale - 10) + 5);
    ctx.lineTo(60 + Math.cos(rightForceAngle) * (forceScale - 10) + 5, Math.sin(rightForceAngle) * (forceScale - 10) - 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    
    // 토크 표시
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(center.x, center.y, 80, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 토크 방향 화살표
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(center.x + 80, center.y);
    ctx.lineTo(center.x + 70, center.y - 10);
    ctx.lineTo(center.x + 70, center.y + 10);
    ctx.closePath();
    ctx.fill();
  };

  const drawCurrentFlow = (ctx: CanvasRenderingContext2D) => {
    // 전류 흐름 애니메이션
    const animOffset = (animationTime * 0.5) % 1;
    
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 전류 흐름 점들
    for (let i = 0; i < 8; i++) {
      const t = (i / 8 + animOffset) % 1;
      let x, y;
      
      if (t < 0.25) {
        // 위쪽 가로 부분
        x = -60 + (t * 4) * 120;
        y = -80;
      } else if (t < 0.5) {
        // 오른쪽 세로 부분
        x = 60;
        y = -80 + ((t - 0.25) * 4) * 160;
      } else if (t < 0.75) {
        // 아래쪽 가로 부분
        x = 60 - ((t - 0.5) * 4) * 120;
        y = 80;
      } else {
        // 왼쪽 세로 부분
        x = -60;
        y = 80 - ((t - 0.75) * 4) * 160;
      }
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
    
    // 전류 방향 표시
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('전류 흐름', center.x - 150, center.y - 100);
  };

  const drawInfoPanel = (ctx: CanvasRenderingContext2D) => {
    // 정보 패널
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 220, 160);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 160);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('전동기 시뮬레이션', 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText('• 자기장 속 전류가 흐르는 도선', 20, 50);
    ctx.fillText('• 플레밍 왼손 법칙', 20, 70);
    ctx.fillText('• F = BIL (자기력)', 20, 90);
    ctx.fillText('• 정류자로 회전 연속', 20, 110);
    ctx.fillText(`• 회전각: ${(rotorAngle * 180 / Math.PI).toFixed(1)}°`, 20, 130);
    ctx.fillText(`• 전압: ${voltage}V`, 20, 150);
    
    // 물리 법칙 설명
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(canvasWidth - 230, 10, 220, 120);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth - 230, 10, 220, 120);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('플레밍 왼손 법칙', canvasWidth - 220, 30);
    ctx.font = '12px Arial';
    ctx.fillText('• 엄지: 힘의 방향', canvasWidth - 220, 50);
    ctx.fillText('• 검지: 자기장 방향', canvasWidth - 220, 70);
    ctx.fillText('• 중지: 전류 방향', canvasWidth - 220, 90);
    ctx.fillText('• F = BIL sin θ', canvasWidth - 220, 110);
  };

  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  return (
    <MainLayout title="전동기 시뮬레이션">
      <div className="motor-page">
        <div className="controls">
        <div className="control-group">
          <button 
            onClick={toggleAnimation}
            className={`animation-button ${isRunning ? 'running' : ''}`}
          >
            {isRunning ? '일시정지' : '시작'}
          </button>
        </div>

        <div className="control-group">
          <label>회전 속도: {speed}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>전압: {voltage}V</label>
          <input
            type="range"
            min="1"
            max="24"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showMagneticField}
              onChange={(e) => setShowMagneticField(e.target.checked)}
            />
            자기장 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showForces}
              onChange={(e) => setShowForces(e.target.checked)}
            />
            자기력 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCurrentFlow}
              onChange={(e) => setShowCurrentFlow(e.target.checked)}
            />
            전류 흐름 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCommutator}
              onChange={(e) => setShowCommutator(e.target.checked)}
            />
            정류자 표시
          </label>
        </div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="simulation-canvas"
        />
      </div>

      <div className="explanation">
        <h3>전동기 원리</h3>
        <p>
          전동기는 자기장 속에서 전류가 흐르는 도선이 받는 자기력을 이용하여 회전 운동을 만드는 장치입니다.
        </p>
        <ul>
          <li><strong>플레밍 왼손 법칙</strong>: 자기장(검지), 전류(중지), 힘(엄지)의 방향 관계</li>
          <li><strong>자기력</strong>: F = BIL sin θ (자기장 × 전류 × 도선 길이)</li>
          <li><strong>정류자</strong>: 회전하는 코일의 전류 방향을 바꿔 연속 회전 가능</li>
          <li><strong>토크</strong>: 회전축에 대한 회전력, 코일 양쪽에서 발생하는 힘의 합</li>
        </ul>
      </div>
      </div>
    </MainLayout>
  );
} 