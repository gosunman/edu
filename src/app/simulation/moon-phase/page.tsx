'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './moon-phase.css';

interface MoonPhase {
  name: string;
  description: string;
  angle: number;
  illumination: number;
}

export default function MoonPhasePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [moonAngle, setMoonAngle] = useState(0);
  const [showEarthView, setShowEarthView] = useState(true);
  const [showSunlight, setShowSunlight] = useState(true);
  const [showOrbitPath, setShowOrbitPath] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [viewMode, setViewMode] = useState<'space' | 'earth'>('space');
  const animationRef = useRef<number | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };
  const earthRadius = 30;
  const moonRadius = 12;
  const orbitRadius = 150;

  const moonPhases: MoonPhase[] = [
    { name: '신월', description: '달이 보이지 않음', angle: 0, illumination: 0 },
    { name: '초승달', description: '오른쪽이 조금 밝음', angle: Math.PI / 4, illumination: 0.25 },
    { name: '상현달', description: '오른쪽 반이 밝음', angle: Math.PI / 2, illumination: 0.5 },
    { name: '보름달 전', description: '대부분이 밝음', angle: 3 * Math.PI / 4, illumination: 0.75 },
    { name: '보름달', description: '달 전체가 밝음', angle: Math.PI, illumination: 1 },
    { name: '보름달 후', description: '왼쪽이 조금 어두워짐', angle: 5 * Math.PI / 4, illumination: 0.75 },
    { name: '하현달', description: '왼쪽 반이 밝음', angle: 3 * Math.PI / 2, illumination: 0.5 },
    { name: '그믐달', description: '왼쪽이 조금 밝음', angle: 7 * Math.PI / 4, illumination: 0.25 }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [moonAngle, showEarthView, showSunlight, showOrbitPath, currentPhase, viewMode]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setMoonAngle(prev => {
          const newAngle = prev - (speed * 0.02); // 반시계 방향
          
          // 위상 업데이트
          const normalizedAngle = ((newAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
          const phaseIndex = Math.floor((normalizedAngle / (Math.PI * 2)) * 8);
          setCurrentPhase(phaseIndex);
          
          return newAngle;
        });
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
    
    if (viewMode === 'space') {
      drawSpaceView(ctx);
    } else {
      drawEarthView(ctx);
    }
    
    // Draw info panel
    drawInfoPanel(ctx);
  };

  const drawSpaceView = (ctx: CanvasRenderingContext2D) => {
    // Space background
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 7) % canvasWidth;
      const y = (i * 11) % canvasHeight;
      const size = (i % 3) * 0.5 + 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Sun (fixed position)
    const sunX = center.x + 300;
    const sunY = center.y;
    
    const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 40);
    sunGradient.addColorStop(0, '#ffd700');
    sunGradient.addColorStop(0.8, '#ffb000');
    sunGradient.addColorStop(1, '#ff8c00');
    
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun rays
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * 50, sunY + Math.sin(angle) * 50);
      ctx.lineTo(sunX + Math.cos(angle) * 70, sunY + Math.sin(angle) * 70);
      ctx.stroke();
    }
    
    // Sunlight direction
    if (showSunlight) {
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 15; i++) {
        const y = center.y - 200 + (i * 30);
        ctx.beginPath();
        ctx.moveTo(center.x - 250, y);
        ctx.lineTo(center.x + 250, y);
        ctx.stroke();
        
        // Arrow heads
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.moveTo(center.x + 240, y);
        ctx.lineTo(center.x + 230, y - 5);
        ctx.lineTo(center.x + 230, y + 5);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Orbit path
    if (showOrbitPath) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(center.x, center.y, orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Earth
    drawEarth(ctx, center.x, center.y);
    
    // Moon
    const moonX = center.x + Math.cos(moonAngle) * orbitRadius;
    const moonY = center.y + Math.sin(moonAngle) * orbitRadius;
    drawMoon(ctx, moonX, moonY, moonAngle);
    
    // Earth-Moon line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(moonX, moonY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Phase labels
    drawPhaseLabels(ctx);
  };

  const drawEarthView = (ctx: CanvasRenderingContext2D) => {
    // Sky background
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, canvasHeight - 100, canvasWidth, 100);
    
    // Horizon
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight - 100);
    ctx.lineTo(canvasWidth, canvasHeight - 100);
    ctx.stroke();
    
    // Moon as seen from Earth
    const moonSize = 80;
    const moonX = center.x;
    const moonY = center.y - 100;
    
    drawMoonPhase(ctx, moonX, moonY, moonSize, moonAngle);
    
    // Phase description
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(moonPhases[currentPhase].name, center.x, center.y + 150);
    
    ctx.font = '16px Arial';
    ctx.fillText(moonPhases[currentPhase].description, center.x, center.y + 180);
    
    // Date calculation (assuming 29.5 day cycle)
    const dayInCycle = ((moonAngle / (Math.PI * 2)) * 29.5) % 29.5;
    ctx.fillText(`음력 ${Math.floor(dayInCycle) + 1}일`, center.x, center.y + 210);
  };

  const drawEarth = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Earth body
    const earthGradient = ctx.createRadialGradient(x, y, 0, x, y, earthRadius);
    earthGradient.addColorStop(0, '#4ade80');
    earthGradient.addColorStop(0.7, '#22c55e');
    earthGradient.addColorStop(1, '#16a34a');
    
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(x, y, earthRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Continents
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(x - 10, y - 5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 8, y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Earth label
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('지구', x, y + earthRadius + 15);
  };

  const drawMoon = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) => {
    // Moon body
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.arc(x, y, moonRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Illuminated part calculation
    const sunAngle = 0; // Sun is to the right
    const phaseAngle = angle - sunAngle;
    
    // Draw dark side
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    
    if (Math.cos(phaseAngle) > 0) {
      // Moon is between new and full (right side lit)
      ctx.arc(x, y, moonRadius, Math.PI / 2, 3 * Math.PI / 2);
      ctx.arc(x, y, moonRadius * Math.cos(phaseAngle), 3 * Math.PI / 2, Math.PI / 2, true);
    } else {
      // Moon is between full and new (left side lit)  
      ctx.arc(x, y, moonRadius, 3 * Math.PI / 2, Math.PI / 2);
      ctx.arc(x, y, moonRadius * -Math.cos(phaseAngle), Math.PI / 2, 3 * Math.PI / 2, true);
    }
    
    ctx.fill();
    
    // Moon craters
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(x - 4, y - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 3, y + 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon label
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('달', x, y + moonRadius + 15);
  };

  const drawMoonPhase = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
    const radius = size / 2;
    
    // Moon body
    ctx.fillStyle = '#d1d5db';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Calculate illumination
    const phaseAngle = angle;
    
    // Draw dark side
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    
    if (Math.cos(phaseAngle) > 0) {
      // Right side illuminated
      ctx.arc(x, y, radius, Math.PI / 2, 3 * Math.PI / 2);
      ctx.arc(x, y, radius * Math.cos(phaseAngle), 3 * Math.PI / 2, Math.PI / 2, true);
    } else {
      // Left side illuminated
      ctx.arc(x, y, radius, 3 * Math.PI / 2, Math.PI / 2);
      ctx.arc(x, y, radius * -Math.cos(phaseAngle), Math.PI / 2, 3 * Math.PI / 2, true);
    }
    
    ctx.fill();
    
    // Moon craters (larger)
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(x - radius * 0.3, y - radius * 0.2, radius * 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + radius * 0.2, y + radius * 0.3, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - radius * 0.4, radius * 0.08, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPhaseLabels = (ctx: CanvasRenderingContext2D) => {
    moonPhases.forEach((phase, index) => {
      const angle = phase.angle;
      const labelX = center.x + Math.cos(angle) * (orbitRadius + 40);
      const labelY = center.y + Math.sin(angle) * (orbitRadius + 40);
      
      // Highlight current phase
      if (index === currentPhase) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px Arial';
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
      }
      
      ctx.textAlign = 'center';
      ctx.fillText(phase.name, labelX, labelY);
    });
  };

  const drawInfoPanel = (ctx: CanvasRenderingContext2D) => {
    // Info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 160);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 200, 160);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('달의 위상변화', 20, 30);
    ctx.font = '12px Arial';
    
    const days = ((moonAngle / (Math.PI * 2)) * 29.5) % 29.5;
    ctx.fillText(`현재 위상: ${moonPhases[currentPhase].name}`, 20, 50);
    ctx.fillText(`음력: ${Math.floor(days) + 1}일`, 20, 70);
    ctx.fillText(`각도: ${(moonAngle * 180 / Math.PI % 360).toFixed(1)}°`, 20, 90);
    ctx.fillText(`조명율: ${(moonPhases[currentPhase].illumination * 100).toFixed(0)}%`, 20, 110);
    
    ctx.fillText('달의 공전주기:', 20, 140);
    ctx.fillText('약 29.5일 (1달)', 20, 155);
  };

  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  const jumpToPhase = (phaseIndex: number) => {
    setMoonAngle(moonPhases[phaseIndex].angle);
    setCurrentPhase(phaseIndex);
  };

  return (
    <div className="moon-phase-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>달의 위상변화 시뮬레이션</h1>
      </div>

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
          <label>속도: {speed}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>관측 모드</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as 'space' | 'earth')}
          >
            <option value="space">우주에서 보기</option>
            <option value="earth">지구에서 보기</option>
          </select>
        </div>

        {viewMode === 'space' && (
          <>
            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={showSunlight}
                  onChange={(e) => setShowSunlight(e.target.checked)}
                />
                태양빛 표시
              </label>
            </div>

            <div className="control-group">
              <label>
                <input
                  type="checkbox"
                  checked={showOrbitPath}
                  onChange={(e) => setShowOrbitPath(e.target.checked)}
                />
                궤도 표시
              </label>
            </div>
          </>
        )}
      </div>

      <div className="phase-buttons">
        {moonPhases.map((phase, index) => (
          <button
            key={index}
            onClick={() => jumpToPhase(index)}
            className={`phase-button ${index === currentPhase ? 'active' : ''}`}
          >
            {phase.name}
          </button>
        ))}
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
        <h3>달의 위상변화 원리</h3>
        <p>
          달의 위상변화는 태양-지구-달의 상대적 위치에 따라 달이 받는 태양빛의 양이 변하면서 발생합니다.
        </p>
        <ul>
          <li><strong>신월</strong>: 달이 태양과 지구 사이에 위치하여 보이지 않음</li>
          <li><strong>초승달</strong>: 달의 오른쪽 일부가 밝게 보임</li>
          <li><strong>상현달</strong>: 달의 오른쪽 반이 밝게 보임</li>
          <li><strong>보름달</strong>: 지구가 태양과 달 사이에 위치하여 달 전체가 밝게 보임</li>
          <li><strong>하현달</strong>: 달의 왼쪽 반이 밝게 보임</li>
          <li><strong>그믐달</strong>: 달의 왼쪽 일부가 밝게 보임</li>
        </ul>
      </div>
    </div>
  );
} 