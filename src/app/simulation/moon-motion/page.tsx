'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';

interface CelestialBody {
  x: number;
  y: number;
  angle: number;
  radius: number;
  color: string;
  name: string;
}

export default function MoonMotionPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showPhases, setShowPhases] = useState(true);
  const [currentDay, setCurrentDay] = useState(0);
  const [viewMode, setViewMode] = useState<'solar-system' | 'earth-moon'>('solar-system');
  const animationRef = useRef<number | null>(null);
  
  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  // 천체 객체들
  const [sun, setSun] = useState<CelestialBody>({
    x: center.x,
    y: center.y,
    angle: 0,
    radius: 30,
    color: '#fbbf24',
    name: '태양'
  });

  const [earth, setEarth] = useState<CelestialBody>({
    x: center.x + 200,
    y: center.y,
    angle: 0,
    radius: 15,
    color: '#3b82f6',
    name: '지구'
  });

  const [moon, setMoon] = useState<CelestialBody>({
    x: center.x + 200 + 50,
    y: center.y,
    angle: 0,
    radius: 8,
    color: '#d1d5db',
    name: '달'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw space background
    drawSpaceBackground(ctx);
    
    // Draw orbits
    if (showOrbits) {
      drawOrbits(ctx);
    }
    
    // Draw celestial bodies
    drawCelestialBodies(ctx);
    
    // Draw moon phases
    if (showPhases && viewMode === 'earth-moon') {
      drawMoonPhases(ctx);
    }
    
    // Draw information
    drawInformation(ctx);
  }, [showOrbits, showPhases, viewMode, currentDay, earth, moon, sun]);

  useEffect(() => {
    const animate = () => {
      if (!isRunning) return;
      
      setCurrentDay(prev => prev + speed * 0.1);
      
      // Update based on current state
      setEarth(prev => {
        const earthAngle = -((prev.angle || 0) + speed * 0.1 / 365) * 2 * Math.PI;
        const earthOrbitRadius = viewMode === 'solar-system' ? 200 : 150;
        const earthRotation = -((prev.angle || 0) + speed * 0.1) * 2 * Math.PI;
        
        return {
          ...prev,
          x: center.x + Math.cos(earthAngle) * earthOrbitRadius,
          y: center.y + Math.sin(earthAngle) * earthOrbitRadius,
          angle: earthRotation
        };
      });
      
      setMoon(prev => {
        const moonAngle = -((prev.angle || 0) + speed * 0.1 / 29.5) * 2 * Math.PI;
        const moonOrbitRadius = viewMode === 'solar-system' ? 50 : 80;
        const earthAngle = -((earth.angle || 0) + speed * 0.1 / 365) * 2 * Math.PI;
        const earthOrbitRadius = viewMode === 'solar-system' ? 200 : 150;
        
        return {
          ...prev,
          x: center.x + Math.cos(earthAngle) * earthOrbitRadius + Math.cos(moonAngle) * moonOrbitRadius,
          y: center.y + Math.sin(earthAngle) * earthOrbitRadius + Math.sin(moonAngle) * moonOrbitRadius,
          angle: moonAngle
        };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, speed, viewMode]);



  const drawSpaceBackground = (ctx: CanvasRenderingContext2D) => {
    // Space gradient
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 400);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f23');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const size = Math.random() * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawOrbits = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    if (viewMode === 'solar-system') {
      // Earth orbit around sun
      ctx.beginPath();
      ctx.arc(center.x, center.y, 200, 0, Math.PI * 2);
      ctx.stroke();
      
      // Moon orbit around earth
      ctx.beginPath();
      ctx.arc(earth.x, earth.y, 50, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Moon orbit around earth (closer view)
      ctx.beginPath();
      ctx.arc(center.x, center.y, 80, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawCelestialBodies = (ctx: CanvasRenderingContext2D) => {
    // Draw sun
    if (viewMode === 'solar-system') {
      ctx.fillStyle = sun.color;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun glow
      const sunGlow = ctx.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.radius + 20);
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sun.radius + 20, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Draw earth
    ctx.fillStyle = earth.color;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Earth rotation indicator
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(earth.x, earth.y);
    ctx.lineTo(
      earth.x + Math.cos(earth.angle) * earth.radius,
      earth.y + Math.sin(earth.angle) * earth.radius
    );
    ctx.stroke();
    
    // Draw moon
    ctx.fillStyle = moon.color;
    ctx.beginPath();
    ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon phase effect
    if (showPhases) {
      drawMoonPhase(ctx, moon.x, moon.y, moon.radius);
    }
  };

  const drawMoonPhase = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
    const moonAngle = (currentDay / 29.5) * 2 * Math.PI;
    const phase = (moonAngle % (2 * Math.PI)) / (2 * Math.PI);
    
    ctx.save();
    ctx.translate(x, y);
    
    // Shadow part
    ctx.fillStyle = '#4a5568';
    ctx.beginPath();
    
    if (phase < 0.5) {
      // Waxing phases
      ctx.arc(0, 0, radius, -Math.PI/2, Math.PI/2);
      ctx.ellipse(0, 0, Math.abs(radius * Math.cos(phase * Math.PI)), radius, 0, -Math.PI/2, Math.PI/2);
    } else {
      // Waning phases
      ctx.arc(0, 0, radius, Math.PI/2, -Math.PI/2);
      ctx.ellipse(0, 0, Math.abs(radius * Math.cos(phase * Math.PI)), radius, 0, Math.PI/2, -Math.PI/2);
    }
    
    ctx.fill();
    ctx.restore();
  };

  const drawMoonPhases = (ctx: CanvasRenderingContext2D) => {
    const phaseNames = ['신월', '초승달', '상현달', '보름달', '하현달', '그믐달'];
    const phaseAngles = [0, Math.PI/3, Math.PI/2, Math.PI, 3*Math.PI/2, 5*Math.PI/3];
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    
    phaseAngles.forEach((angle, index) => {
      const phaseX = center.x + Math.cos(angle) * 120;
      const phaseY = center.y + Math.sin(angle) * 120;
      
      // Draw small moon phase
      ctx.fillStyle = '#d1d5db';
      ctx.beginPath();
      ctx.arc(phaseX, phaseY, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw phase shadow
      ctx.fillStyle = '#4a5568';
      ctx.beginPath();
      
      const phaseRatio = index / phaseAngles.length;
      if (phaseRatio < 0.5) {
        ctx.arc(phaseX, phaseY, 12, -Math.PI/2, Math.PI/2);
        ctx.ellipse(phaseX, phaseY, Math.abs(12 * Math.cos(phaseRatio * Math.PI)), 12, 0, -Math.PI/2, Math.PI/2);
      } else {
        ctx.arc(phaseX, phaseY, 12, Math.PI/2, -Math.PI/2);
        ctx.ellipse(phaseX, phaseY, Math.abs(12 * Math.cos(phaseRatio * Math.PI)), 12, 0, Math.PI/2, -Math.PI/2);
      }
      
      ctx.fill();
      
      // Phase name
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(phaseNames[index], phaseX, phaseY + 25);
    });
  };

  const drawInformation = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    
    const currentPhase = Math.floor(((currentDay / 29.5) % 1) * 8);
    const phaseNames = ['신월', '초승달', '상현달', '보름달', '하현달', '그믐달'];
    
    ctx.fillText(`현재 날짜: ${Math.floor(currentDay)}일`, 10, 30);
    ctx.fillText(`달의 위상: ${phaseNames[currentPhase] || '변화 중'}`, 10, 50);
    ctx.fillText(`지구 공전 각도: ${Math.floor((currentDay / 365) * 360) % 360}°`, 10, 70);
    ctx.fillText(`달 공전 각도: ${Math.floor((currentDay / 29.5) * 360) % 360}°`, 10, 90);
  };

  const resetSimulation = () => {
    setCurrentDay(0);
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <MainLayout title="달의 움직임과 일주/연주운동">
      <div className="moon-motion-page">
        <div className="controls">
        <div className="control-group">
          <label>보기 모드</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as 'solar-system' | 'earth-moon')}
          >
            <option value="solar-system">태양계 전체</option>
            <option value="earth-moon">지구-달 시스템</option>
          </select>
        </div>

        <div className="control-group">
          <label>속도: {speed}x</label>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
            />
            궤도 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showPhases}
              onChange={(e) => setShowPhases(e.target.checked)}
            />
            달의 위상 표시
          </label>
        </div>

        <div className="button-group">
          <button 
            className={`simulate-button ${isRunning ? 'running' : ''}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '일시정지' : '시뮬레이션 시작'}
          </button>
          
          <button 
            className="reset-button"
            onClick={resetSimulation}
          >
            초기화
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
        <h3>천체 운동의 이해</h3>
        <div className="explanation-content">
          <div className="explanation-section">
            <h4>일주운동 (지구 자전)</h4>
            <p>지구가 자신의 축을 중심으로 하루에 한 번 회전하는 운동입니다. 이로 인해 낮과 밤이 생기며, 별들이 동쪽에서 서쪽으로 움직이는 것처럼 보입니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>연주운동 (지구 공전)</h4>
            <p>지구가 태양 주위를 1년에 한 번 공전하는 운동입니다. 이로 인해 계절이 바뀌고, 별자리가 계절에 따라 다르게 관찰됩니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>달의 위상 변화</h4>
            <p>달이 지구 주위를 공전하면서 태양빛을 받는 면적이 변하여 보름달, 반달, 초승달 등의 모양이 보입니다. 약 29.5일 주기로 변화합니다.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .moon-motion-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin: 20px 20px 30px 20px;
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

        .simulate-button, .reset-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .simulate-button {
          background: #3b82f6;
          color: white;
        }

        .simulate-button:hover {
          background: #2563eb;
        }

        .simulate-button.running {
          background: #ef4444;
        }

        .simulate-button.running:hover {
          background: #dc2626;
        }

        .reset-button {
          background: #6b7280;
          color: white;
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
          background: #000;
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
    </MainLayout>
  );
} 