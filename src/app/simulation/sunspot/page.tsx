'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './sunspot.css';

interface Sunspot {
  id: number;
  latitude: number;
  longitude: number;
  size: number;
  intensity: number;
  age: number;
  maxAge: number;
}

export default function SunspotPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [showGrid, setShowGrid] = useState(true);
  const [showEquator, setShowEquator] = useState(true);
  const [showRotation, setShowRotation] = useState(true);
  const [viewType, setViewType] = useState<'front' | 'side' | '3d'>('front');
  const [timeScale, setTimeScale] = useState(1);
  const [sunRotation, setSunRotation] = useState(0);
  const [sunspots, setSunspots] = useState<Sunspot[]>([]);
  const [observationDays, setObservationDays] = useState(0);
  const animationRef = useRef<number | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };
  const sunRadius = 150;

  useEffect(() => {
    // 초기 흑점 생성
    generateSunspots();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
  }, [sunRotation, sunspots, showGrid, showEquator, showRotation, viewType, observationDays]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        // 태양 자전 (약 25일 주기)
        setSunRotation(prev => prev + (speed * timeScale * 0.01));
        
        // 흑점 진화
        setSunspots(prev => 
          prev.map(spot => ({
            ...spot,
            age: spot.age + timeScale * 0.1,
            intensity: spot.age < spot.maxAge ? 
              Math.max(0, spot.intensity - (spot.age / spot.maxAge) * 0.002) : 0
          })).filter(spot => spot.intensity > 0.1)
        );
        
        // 관찰 일수 증가
        setObservationDays(prev => prev + timeScale * 0.1);
        
        // 새로운 흑점 생성 (확률적)
        if (Math.random() < 0.02 * timeScale) {
          generateNewSunspot();
        }
        
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
  }, [isRunning, speed, timeScale]);

  const generateSunspots = () => {
    const spots: Sunspot[] = [];
    
    for (let i = 0; i < 8; i++) {
      spots.push({
        id: i,
        latitude: (Math.random() - 0.5) * 60, // 위도 ±30도 범위
        longitude: Math.random() * 360,
        size: 5 + Math.random() * 15,
        intensity: 0.7 + Math.random() * 0.3,
        age: Math.random() * 50,
        maxAge: 100 + Math.random() * 100
      });
    }
    
    setSunspots(spots);
  };

  const generateNewSunspot = () => {
    const newSpot: Sunspot = {
      id: Date.now(),
      latitude: (Math.random() - 0.5) * 60,
      longitude: Math.random() * 360,
      size: 3 + Math.random() * 10,
      intensity: 0.8 + Math.random() * 0.2,
      age: 0,
      maxAge: 80 + Math.random() * 120
    };
    
    setSunspots(prev => [...prev, newSpot]);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    drawBackground(ctx);
    
    // Draw sun
    drawSun(ctx);
    
    // Draw coordinate system
    if (showGrid) {
      drawGrid(ctx);
    }
    
    if (showEquator) {
      drawEquator(ctx);
    }
    
    // Draw sunspots
    drawSunspots(ctx);
    
    // Draw rotation indicator
    if (showRotation) {
      drawRotationIndicator(ctx);
    }
    
    // Draw info panels
    drawInfoPanel(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // 우주 배경
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 별들
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const size = Math.random() * 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawSun = (ctx: CanvasRenderingContext2D) => {
    // 태양 본체
    const gradient = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, sunRadius);
    gradient.addColorStop(0, '#ffd700');
    gradient.addColorStop(0.7, '#ffb000');
    gradient.addColorStop(1, '#ff8c00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // 태양 경계
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 태양 표면 텍스처 (코로나 효과)
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const innerRadius = sunRadius * 0.8;
      const outerRadius = sunRadius * 1.1;
      
      ctx.beginPath();
      ctx.moveTo(
        center.x + Math.cos(angle) * innerRadius,
        center.y + Math.sin(angle) * innerRadius
      );
      ctx.lineTo(
        center.x + Math.cos(angle) * outerRadius,
        center.y + Math.sin(angle) * outerRadius
      );
      ctx.stroke();
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // 경도선 (세로줄)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + sunRotation;
      const x = center.x + Math.cos(angle) * sunRadius * 0.9;
      
      if (Math.cos(angle) > 0) { // 보이는 면만 그리기
        ctx.beginPath();
        ctx.moveTo(x, center.y - sunRadius * 0.9);
        ctx.lineTo(x, center.y + sunRadius * 0.9);
        ctx.stroke();
      }
    }
    
    // 위도선 (가로줄)
    for (let i = 1; i < 6; i++) {
      const y = center.y + ((i - 3) / 3) * sunRadius * 0.8;
      const width = Math.sqrt(sunRadius * sunRadius - Math.pow((i - 3) / 3 * sunRadius * 0.8, 2));
      
      ctx.beginPath();
      ctx.moveTo(center.x - width, y);
      ctx.lineTo(center.x + width, y);
      ctx.stroke();
    }
  };

  const drawEquator = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    ctx.moveTo(center.x - sunRadius, center.y);
    ctx.lineTo(center.x + sunRadius, center.y);
    ctx.stroke();
    
    ctx.setLineDash([]);
  };

  const drawSunspots = (ctx: CanvasRenderingContext2D) => {
    sunspots.forEach(spot => {
      // 3D 투영 계산
      const adjustedLongitude = spot.longitude + sunRotation * (180 / Math.PI);
      const x = center.x + Math.cos(adjustedLongitude * Math.PI / 180) * 
                 sunRadius * Math.cos(spot.latitude * Math.PI / 180) * 0.8;
      const y = center.y + Math.sin(spot.latitude * Math.PI / 180) * sunRadius * 0.8;
      
      // 태양 뒷면에 있는 흑점은 보이지 않음
      if (Math.cos(adjustedLongitude * Math.PI / 180) < 0) return;
      
      // 가장자리 효과 (림 다크닝)
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
      ) / sunRadius;
      const limbDarkening = Math.max(0.3, 1 - distanceFromCenter * 0.7);
      
      // 흑점 크기 (원근 효과)
      const perspective = Math.cos(adjustedLongitude * Math.PI / 180);
      const adjustedSize = spot.size * perspective * limbDarkening;
      
      // 흑점 그리기
      ctx.fillStyle = `rgba(0, 0, 0, ${spot.intensity * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, adjustedSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 흑점 테두리 (반영역)
      ctx.strokeStyle = `rgba(139, 69, 19, ${spot.intensity * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, adjustedSize + 2, 0, Math.PI * 2);
      ctx.stroke();
      
      // 흑점 ID 표시
      if (adjustedSize > 3) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(spot.id.toString().slice(-2), x, y - adjustedSize - 5);
      }
    });
  };

  const drawRotationIndicator = (ctx: CanvasRenderingContext2D) => {
    // 회전 화살표
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center.x, center.y, sunRadius + 30, 0, Math.PI * 0.7);
    ctx.stroke();
    
    // 화살표 끝
    const arrowAngle = Math.PI * 0.7;
    const arrowX = center.x + Math.cos(arrowAngle) * (sunRadius + 30);
    const arrowY = center.y + Math.sin(arrowAngle) * (sunRadius + 30);
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - 10, arrowY - 5);
    ctx.lineTo(arrowX - 10, arrowY + 5);
    ctx.closePath();
    ctx.fill();
    
    // 회전 주기 표시
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('태양 자전', center.x, center.y - sunRadius - 50);
    ctx.fillText('약 25일 주기', center.x, center.y - sunRadius - 30);
  };

  const drawInfoPanel = (ctx: CanvasRenderingContext2D) => {
    // 좌측 정보 패널
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 220);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 200, 220);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('태양 흑점 관측', 20, 30);
    ctx.font = '12px Arial';
    ctx.fillText(`관측 일수: ${observationDays.toFixed(1)}일`, 20, 50);
    ctx.fillText(`흑점 개수: ${sunspots.length}개`, 20, 70);
    ctx.fillText(`회전각: ${(sunRotation * 180 / Math.PI % 360).toFixed(1)}°`, 20, 90);
    ctx.fillText(`시간 배율: ${timeScale}x`, 20, 110);
    
    ctx.fillText('흑점 특성:', 20, 140);
    ctx.fillText('• 온도가 낮은 영역', 20, 160);
    ctx.fillText('• 강한 자기장', 20, 180);
    ctx.fillText('• 수일~수개월 지속', 20, 200);
    ctx.fillText('• 태양 활동 지표', 20, 220);
    
    // 우측 정보 패널
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(canvasWidth - 210, 10, 200, 160);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(canvasWidth - 210, 10, 200, 160);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('관측 정보', canvasWidth - 200, 30);
    ctx.font = '12px Arial';
    ctx.fillText('• 흑점은 태양 자전과 함께 이동', canvasWidth - 200, 50);
    ctx.fillText('• 동-서 방향으로 이동', canvasWidth - 200, 70);
    ctx.fillText('• 가장자리에서 작아 보임', canvasWidth - 200, 90);
    ctx.fillText('• 뒷면으로 가면 사라짐', canvasWidth - 200, 110);
    ctx.fillText('• 약 2주 후 반대편 출현', canvasWidth - 200, 130);
    ctx.fillText('• 태양 적도 근처에 집중', canvasWidth - 200, 150);
    
    // 하단 시간 스케일
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, canvasHeight - 80, canvasWidth - 20, 70);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, canvasHeight - 80, canvasWidth - 20, 70);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('관측 시간 경과', canvasWidth / 2, canvasHeight - 60);
    
    // 시간 막대
    const timeBarWidth = canvasWidth - 80;
    const timeProgress = (observationDays % 25) / 25;
    
    ctx.fillStyle = '#333333';
    ctx.fillRect(40, canvasHeight - 50, timeBarWidth, 10);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(40, canvasHeight - 50, timeBarWidth * timeProgress, 10);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('0일', 40, canvasHeight - 30);
    ctx.textAlign = 'right';
    ctx.fillText('25일 (1 자전)', 40 + timeBarWidth, canvasHeight - 30);
    ctx.textAlign = 'center';
    ctx.fillText(`${(observationDays % 25).toFixed(1)}일`, 40 + timeBarWidth * timeProgress, canvasHeight - 20);
  };

  const toggleAnimation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setSunRotation(0);
    setObservationDays(0);
    generateSunspots();
  };

  return (
    <div className="sunspot-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>태양 흑점 시뮬레이션</h1>
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
          <button 
            onClick={resetSimulation}
            className="reset-button"
          >
            초기화
          </button>
        </div>

        <div className="control-group">
          <label>관측 속도: {speed}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>시간 배율: {timeScale}x</label>
          <input
            type="range"
            min="1"
            max="10"
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            격자 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showEquator}
              onChange={(e) => setShowEquator(e.target.checked)}
            />
            적도 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showRotation}
              onChange={(e) => setShowRotation(e.target.checked)}
            />
            회전 표시
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
        <h3>태양 흑점과 태양 자전</h3>
        <p>
          태양 흑점은 태양 표면에 나타나는 어두운 영역으로, 태양의 자전을 관측할 수 있는 중요한 지표입니다.
        </p>
        <ul>
          <li><strong>흑점의 특징</strong>: 주변보다 온도가 낮아 어둡게 보이는 영역</li>
          <li><strong>자기장</strong>: 강한 자기장으로 인해 대류가 억제되어 온도가 낮음</li>
          <li><strong>태양 자전</strong>: 흑점의 이동을 통해 태양의 자전 주기(약 25일) 확인</li>
          <li><strong>관측 방법</strong>: 매일 같은 시간에 관측하여 흑점의 위치 변화 추적</li>
          <li><strong>안전 주의</strong>: 실제 태양 관측 시 반드시 안전한 필터나 망원경 사용</li>
        </ul>
      </div>
    </div>
  );
} 