'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import './commutator.css';

export default function CommutatorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [rotorAngle, setRotorAngle] = useState(0);
  const [voltage, setVoltage] = useState(12);
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);
  const [showBrushContact, setShowBrushContact] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [animationTime, setAnimationTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [rotorAngle, showCurrentFlow, showBrushContact, showLabels, voltage, animationTime]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setRotorAngle(prev => {
          const newAngle = prev + (speed * 0.01);
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
    
    // Draw external circuit
    drawExternalCircuit(ctx);
    
    // Draw commutator
    drawCommutator(ctx);
    
    // Draw brushes
    drawBrushes(ctx);
    
    // Draw rotor coil
    drawRotorCoil(ctx);
    
    // Draw current flow
    if (showCurrentFlow) {
      drawCurrentFlow(ctx);
    }
    
    // Draw brush contact indicators
    if (showBrushContact) {
      drawBrushContact(ctx);
    }
    
    // Draw labels
    if (showLabels) {
      drawLabels(ctx);
    }
    
    // Draw info panel
    drawInfoPanel(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Grid
    ctx.strokeStyle = '#f1f5f9';
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

  const drawExternalCircuit = (ctx: CanvasRenderingContext2D) => {
    // 외부 회로 그리기
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 4;
    
    // 전원 (배터리)
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(center.x - 250, center.y - 20, 60, 40);
    
    // 전원 단자
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(center.x - 240, center.y - 30, 20, 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(center.x - 210, center.y - 30, 20, 20);
    
    // 전원 연결선
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(center.x - 230, center.y - 20);
    ctx.lineTo(center.x - 230, center.y - 100);
    ctx.lineTo(center.x - 80, center.y - 100);
    ctx.stroke();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(center.x - 200, center.y - 20);
    ctx.lineTo(center.x - 200, center.y + 100);
    ctx.lineTo(center.x - 80, center.y + 100);
    ctx.stroke();
    
    // 저항 (가변저항)
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(center.x - 300, center.y - 60, 40, 20);
    
    // 스위치
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(center.x - 260, center.y - 100);
    ctx.lineTo(center.x - 240, center.y - 90);
    ctx.stroke();
    
    // 전압 표시
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, center.x - 220, center.y + 10);
  };

  const drawCommutator = (ctx: CanvasRenderingContext2D) => {
    const commutatorRadius = 50;
    
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 정류자 세그먼트 A (위쪽)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, commutatorRadius, -Math.PI/2, Math.PI/2);
    ctx.fill();
    
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 정류자 세그먼트 B (아래쪽)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, 0, commutatorRadius, Math.PI/2, 3*Math.PI/2);
    ctx.fill();
    
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 절연체 (분할선)
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -commutatorRadius);
    ctx.lineTo(0, commutatorRadius);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-commutatorRadius, 0);
    ctx.lineTo(commutatorRadius, 0);
    ctx.stroke();
    
    // 세그먼트 라벨
    if (showLabels) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('A', 0, -commutatorRadius/2);
      ctx.fillText('B', 0, commutatorRadius/2);
    }
    
    ctx.restore();
  };

  const drawBrushes = (ctx: CanvasRenderingContext2D) => {
    const brushWidth = 12;
    const brushHeight = 30;
    const commutatorRadius = 50;
    
    // 브러시 X (오른쪽)
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(center.x + commutatorRadius + 5, center.y - brushHeight/2, brushWidth, brushHeight);
    
    // 브러시 Y (왼쪽)
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(center.x - commutatorRadius - 5 - brushWidth, center.y - brushHeight/2, brushWidth, brushHeight);
    
    // 브러시 연결선
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(center.x + commutatorRadius + 5 + brushWidth, center.y);
    ctx.lineTo(center.x + commutatorRadius + 40, center.y);
    ctx.lineTo(center.x + commutatorRadius + 40, center.y - 100);
    ctx.lineTo(center.x - 80, center.y - 100);
    ctx.stroke();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(center.x - commutatorRadius - 5, center.y);
    ctx.lineTo(center.x - commutatorRadius - 40, center.y);
    ctx.lineTo(center.x - commutatorRadius - 40, center.y + 100);
    ctx.lineTo(center.x - 80, center.y + 100);
    ctx.stroke();
    
    // 브러시 라벨
    if (showLabels) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('X', center.x + commutatorRadius + 11, center.y + 25);
      ctx.fillText('Y', center.x - commutatorRadius - 11, center.y + 25);
    }
  };

  const drawRotorCoil = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotorAngle);
    
    // 코일 연결선 (정류자에서 코일로)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    
    // 세그먼트 A에서 코일 상단으로
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(0, -120);
    ctx.lineTo(-60, -120);
    ctx.stroke();
    
    // 세그먼트 B에서 코일 하단으로
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(0, 120);
    ctx.lineTo(60, 120);
    ctx.stroke();
    
    // 코일 (간단한 직사각형)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-60, -120);
    ctx.lineTo(60, -120);
    ctx.lineTo(60, 120);
    ctx.lineTo(-60, 120);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };

  const drawCurrentFlow = (ctx: CanvasRenderingContext2D) => {
    const animOffset = (animationTime * 0.3) % 1;
    
    // 현재 각도에 따른 전류 방향 결정
    const normalizedAngle = ((rotorAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isFirstHalf = normalizedAngle < Math.PI;
    
    // 전류 흐름 점들
    for (let i = 0; i < 12; i++) {
      const t = (i / 12 + animOffset) % 1;
      let x, y;
      
      if (isFirstHalf) {
        // 첫 번째 반주기: A-상단-B-하단-A
        if (t < 0.2) {
          // 외부 회로 (상단)
          x = center.x - 80 + (t * 5) * 160;
          y = center.y - 100;
        } else if (t < 0.4) {
          // 브러시 X에서 세그먼트 A로
          x = center.x + 90 - ((t - 0.2) * 5) * 40;
          y = center.y - 100 + ((t - 0.2) * 5) * 100;
        } else if (t < 0.6) {
          // 세그먼트 A에서 코일 상단으로
          const coilT = (t - 0.4) * 5;
          x = center.x + Math.cos(rotorAngle + Math.PI/2) * (50 + coilT * 70);
          y = center.y + Math.sin(rotorAngle + Math.PI/2) * (50 + coilT * 70);
        } else if (t < 0.8) {
          // 코일 내부
          const coilT = (t - 0.6) * 5;
          x = center.x + Math.cos(rotorAngle + Math.PI/2 + coilT * Math.PI) * 120;
          y = center.y + Math.sin(rotorAngle + Math.PI/2 + coilT * Math.PI) * 120;
        } else {
          // 세그먼트 B에서 브러시 Y로
          const brushT = (t - 0.8) * 5;
          x = center.x - Math.cos(rotorAngle - Math.PI/2) * (50 + brushT * 40);
          y = center.y - Math.sin(rotorAngle - Math.PI/2) * (50 + brushT * 40);
        }
      } else {
        // 두 번째 반주기: B-하단-A-상단-B (역방향)
        if (t < 0.2) {
          // 외부 회로 (하단)
          x = center.x - 80 + (t * 5) * 160;
          y = center.y + 100;
        } else if (t < 0.4) {
          // 브러시 Y에서 세그먼트 B로
          x = center.x - 90 + ((t - 0.2) * 5) * 40;
          y = center.y + 100 - ((t - 0.2) * 5) * 100;
        } else if (t < 0.6) {
          // 세그먼트 B에서 코일 하단으로
          const coilT = (t - 0.4) * 5;
          x = center.x - Math.cos(rotorAngle - Math.PI/2) * (50 + coilT * 70);
          y = center.y - Math.sin(rotorAngle - Math.PI/2) * (50 + coilT * 70);
        } else if (t < 0.8) {
          // 코일 내부 (역방향)
          const coilT = (t - 0.6) * 5;
          x = center.x - Math.cos(rotorAngle - Math.PI/2 + coilT * Math.PI) * 120;
          y = center.y - Math.sin(rotorAngle - Math.PI/2 + coilT * Math.PI) * 120;
        } else {
          // 세그먼트 A에서 브러시 X로
          const brushT = (t - 0.8) * 5;
          x = center.x + Math.cos(rotorAngle + Math.PI/2) * (50 + brushT * 40);
          y = center.y + Math.sin(rotorAngle + Math.PI/2) * (50 + brushT * 40);
        }
      }
      
      ctx.fillStyle = isFirstHalf ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawBrushContact = (ctx: CanvasRenderingContext2D) => {
    const commutatorRadius = 50;
    
    // 브러시 X 접촉점
    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.beginPath();
    ctx.arc(center.x + commutatorRadius, center.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 브러시 Y 접촉점
    ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.beginPath();
    ctx.arc(center.x - commutatorRadius, center.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // 접촉 상태 표시
    const normalizedAngle = ((rotorAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isTransition = Math.abs(normalizedAngle) < 0.1 || Math.abs(normalizedAngle - Math.PI) < 0.1;
    
    if (isTransition) {
      // 전환 순간 - 스파크 효과
      ctx.fillStyle = '#fbbf24';
      for (let i = 0; i < 6; i++) {
        const sparkX = center.x + commutatorRadius + (Math.random() - 0.5) * 20;
        const sparkY = center.y + (Math.random() - 0.5) * 20;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawLabels = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    
    // 정류자 제목
    ctx.fillText('정류자 (Commutator)', center.x, center.y - 120);
    
    // 전류 방향 설명
    const normalizedAngle = ((rotorAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const isFirstHalf = normalizedAngle < Math.PI;
    
    ctx.font = '14px Arial';
    ctx.fillText(
      isFirstHalf ? '전류 방향: X → A → 코일 → B → Y' : '전류 방향: Y → B → 코일 → A → X',
      center.x, center.y - 160
    );
    
    // 각도 표시
    ctx.fillText(`회전각: ${(rotorAngle * 180 / Math.PI).toFixed(1)}°`, center.x, center.y + 160);
  };

  const drawInfoPanel = (ctx: CanvasRenderingContext2D) => {
    // 좌측 정보 패널
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(10, 10, 200, 180);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 180);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('정류자 동작 원리', 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText('• 전류 방향 전환 장치', 20, 50);
    ctx.fillText('• 브러시와 세그먼트 접촉', 20, 70);
    ctx.fillText('• 180° 회전마다 전환', 20, 90);
    ctx.fillText('• 연속 회전 가능', 20, 110);
    ctx.fillText('• 직류 → 교류 변환', 20, 130);
    
    const normalizedAngle = ((rotorAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const phase = normalizedAngle < Math.PI ? '1단계' : '2단계';
    ctx.fillText(`현재: ${phase}`, 20, 150);
    
    // 우측 정보 패널
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(canvasWidth - 210, 10, 200, 140);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvasWidth - 210, 10, 200, 140);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('브러시 접촉 상태', canvasWidth - 200, 30);
    ctx.font = '12px Arial';
    
    const isTransition = Math.abs(normalizedAngle) < 0.1 || Math.abs(normalizedAngle - Math.PI) < 0.1;
    
    if (isTransition) {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('⚠️ 전환 순간', canvasWidth - 200, 50);
      ctx.fillText('스파크 발생', canvasWidth - 200, 70);
      ctx.fillText('양 세그먼트 접촉', canvasWidth - 200, 90);
    } else {
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ 정상 접촉', canvasWidth - 200, 50);
      ctx.fillText('안정적 전류 흐름', canvasWidth - 200, 70);
      ctx.fillText('단일 세그먼트 접촉', canvasWidth - 200, 90);
    }
    
    ctx.fillStyle = '#1f2937';
    ctx.fillText(`전압: ${voltage}V`, canvasWidth - 200, 110);
    ctx.fillText(`속도: ${speed}`, canvasWidth - 200, 130);
  };

  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  return (
    <MainLayout title="정류자 시뮬레이션">
      <div className="commutator-page">
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
              checked={showBrushContact}
              onChange={(e) => setShowBrushContact(e.target.checked)}
            />
            브러시 접촉 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
            />
            라벨 표시
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
        <h3>정류자 동작 원리</h3>
        <p>
          정류자는 직류 전동기에서 회전자 코일의 전류 방향을 주기적으로 바꿔주는 장치입니다.
        </p>
        <ul>
          <li><strong>구조</strong>: 여러 개의 구리 세그먼트가 절연체로 분리된 원통형 구조</li>
          <li><strong>브러시</strong>: 탄소로 만든 접촉자가 정류자 표면에 접촉</li>
          <li><strong>전환 원리</strong>: 180° 회전할 때마다 전류 방향이 바뀜</li>
          <li><strong>연속 회전</strong>: 자기장과 전류의 상호작용으로 일정한 방향의 토크 생성</li>
          <li><strong>스파크</strong>: 전환 순간에 발생하는 전기적 방전 현상</li>
        </ul>
      </div>
      </div>
    </MainLayout>
  );
} 