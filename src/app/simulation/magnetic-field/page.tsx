'use client';

import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';

interface MagneticFieldLine {
  points: { x: number; y: number }[];
  strength: number;
}

interface Magnet {
  x: number;
  y: number;
  type: 'bar' | 'horseshoe' | 'electromagnet';
  polarity: 'N-S' | 'S-N';
  strength: number;
}

export default function MagneticFieldPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [magnetType, setMagnetType] = useState<'bar' | 'horseshoe' | 'electromagnet' | 'straight-wire' | 'circular-wire'>('bar');
  const [fieldStrength, setFieldStrength] = useState(5);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showCompass, setShowCompass] = useState(true);
  const [showMagneticForce, setShowMagneticForce] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDirection, setCurrentDirection] = useState<'clockwise' | 'counter-clockwise'>('clockwise');
  const [wireDirection, setWireDirection] = useState<'into' | 'out-of'>('into');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [animationTime, setAnimationTime] = useState(0);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    draw();
  }, [magnetType, fieldStrength, showFieldLines, showCompass, isRunning, currentDirection, mousePos]);

  useEffect(() => {
    const animate = () => {
      if (!isRunning) return;
      
      setAnimationTime(prev => prev + 0.1);
      
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
  }, [isRunning]);

  const animate = () => {
    if (!isRunning) return;
    
    setAnimationTime(prev => prev + 0.1);
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
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
    
    // Draw magnetic field lines
    if (showFieldLines) {
      drawMagneticFieldLines(ctx);
    }
    
    // Draw magnet
    drawMagnet(ctx);
    
    // Draw compass
    if (showCompass) {
      drawCompass(ctx);
    }
    
    // Draw field strength indicator
    drawFieldStrengthIndicator(ctx);
    
    // Draw legend
    drawLegend(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Grid background
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvasWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasHeight; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  const drawMagnet = (ctx: CanvasRenderingContext2D) => {
    if (magnetType === 'bar') {
      drawBarMagnet(ctx);
    } else if (magnetType === 'horseshoe') {
      drawHorseshoeMagnet(ctx);
    } else if (magnetType === 'electromagnet') {
      drawElectromagnet(ctx);
    } else if (magnetType === 'straight-wire') {
      drawStraightWire(ctx);
    } else if (magnetType === 'circular-wire') {
      drawCircularWire(ctx);
    }
  };

  const drawBarMagnet = (ctx: CanvasRenderingContext2D) => {
    const magnetWidth = 200;
    const magnetHeight = 40;
    const magnetX = center.x - magnetWidth / 2;
    const magnetY = center.y - magnetHeight / 2;
    
    // North pole (red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(magnetX, magnetY, magnetWidth / 2, magnetHeight);
    
    // South pole (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(magnetX + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight);
    
    // Border
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(magnetX, magnetY, magnetWidth, magnetHeight);
    
    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', magnetX + magnetWidth / 4, magnetY + magnetHeight / 2 + 8);
    ctx.fillText('S', magnetX + 3 * magnetWidth / 4, magnetY + magnetHeight / 2 + 8);
  };

  const drawHorseshoeMagnet = (ctx: CanvasRenderingContext2D) => {
    const magnetWidth = 200;
    const magnetHeight = 150;
    const thickness = 30;
    
    // Draw horseshoe shape
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    
    // Left pole (North - red)
    ctx.strokeStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(center.x - magnetWidth / 2, center.y + magnetHeight / 2);
    ctx.lineTo(center.x - magnetWidth / 2, center.y - magnetHeight / 2);
    ctx.lineTo(center.x, center.y - magnetHeight / 2);
    ctx.stroke();
    
    // Right pole (South - blue)
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(center.x, center.y - magnetHeight / 2);
    ctx.lineTo(center.x + magnetWidth / 2, center.y - magnetHeight / 2);
    ctx.lineTo(center.x + magnetWidth / 2, center.y + magnetHeight / 2);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', center.x - magnetWidth / 2, center.y + magnetHeight / 2 + 40);
    ctx.fillText('S', center.x + magnetWidth / 2, center.y + magnetHeight / 2 + 40);
  };

  const drawElectromagnet = (ctx: CanvasRenderingContext2D) => {
    const coreWidth = 20;
    const coreHeight = 200;
    const coilWidth = 60;
    
    // Iron core
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(center.x - coreWidth / 2, center.y - coreHeight / 2, coreWidth, coreHeight);
    
    // Coil windings
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    
    for (let i = 0; i < 10; i++) {
      const y = center.y - coreHeight / 2 + (i * coreHeight / 10);
      
      // Animated coil effect
      const offset = Math.sin(animationTime + i * 0.5) * 2;
      
      ctx.beginPath();
      ctx.arc(center.x - coilWidth / 2 + offset, y, coilWidth / 2, 0, Math.PI);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(center.x + coilWidth / 2 - offset, y, coilWidth / 2, Math.PI, 0);
      ctx.stroke();
    }
    
    // Current direction indicator
    ctx.fillStyle = currentDirection === 'clockwise' ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(center.x - coilWidth, center.y, 10, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(currentDirection === 'clockwise' ? '⊙' : '⊗', center.x - coilWidth, center.y + 4);
    
    // Poles (determined by current direction)
    const isNorthTop = currentDirection === 'clockwise';
    
    ctx.fillStyle = isNorthTop ? '#ef4444' : '#3b82f6';
    ctx.fillRect(center.x - coreWidth / 2 - 5, center.y - coreHeight / 2 - 20, coreWidth + 10, 15);
    
    ctx.fillStyle = isNorthTop ? '#3b82f6' : '#ef4444';
    ctx.fillRect(center.x - coreWidth / 2 - 5, center.y + coreHeight / 2 + 5, coreWidth + 10, 15);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isNorthTop ? 'N' : 'S', center.x, center.y - coreHeight / 2 - 10);
    ctx.fillText(isNorthTop ? 'S' : 'N', center.x, center.y + coreHeight / 2 + 15);
  };

  const drawStraightWire = (ctx: CanvasRenderingContext2D) => {
    // 직선 도선 그리기
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // 수직 도선
    ctx.beginPath();
    ctx.moveTo(center.x, center.y - 180);
    ctx.lineTo(center.x, center.y + 180);
    ctx.stroke();
    
    // 전류 방향 표시
    ctx.fillStyle = wireDirection === 'into' ? '#ef4444' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 25, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    if (wireDirection === 'into') {
      // ⊗ 기호 (종이 안쪽으로)
      ctx.beginPath();
      ctx.moveTo(center.x - 12, center.y - 12);
      ctx.lineTo(center.x + 12, center.y + 12);
      ctx.moveTo(center.x + 12, center.y - 12);
      ctx.lineTo(center.x - 12, center.y + 12);
      ctx.stroke();
    } else {
      // ⊙ 기호 (종이 밖으로)
      ctx.beginPath();
      ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center.x, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 설명
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`전류: ${wireDirection === 'into' ? '종이 안쪽으로' : '종이 밖으로'}`, center.x, center.y + 60);
    ctx.fillText('원형 자기장 형성', center.x, center.y + 80);

    // 자기력 표시
    if (showMagneticForce) {
      drawMagneticForceOnWire(ctx);
    }
  };

  const drawCircularWire = (ctx: CanvasRenderingContext2D) => {
    const radius = 100;
    
    // 원형 도선 그리기
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.setLineDash([]);
    
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // 전류 방향 화살표들
    const numArrows = 8;
    for (let i = 0; i < numArrows; i++) {
      const angle = (i * 2 * Math.PI) / numArrows;
      const arrowX = center.x + Math.cos(angle) * radius;
      const arrowY = center.y + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(arrowX, arrowY);
      ctx.rotate(angle + (currentDirection === 'clockwise' ? Math.PI/2 : -Math.PI/2));
      
      // 화살표
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(-8, 6);
      ctx.lineTo(8, 6);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
    // 중심 자기장 방향 표시
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    if (currentDirection === 'clockwise') {
      // ⊗ 기호 (안쪽으로)
      ctx.beginPath();
      ctx.moveTo(center.x - 10, center.y - 10);
      ctx.lineTo(center.x + 10, center.y + 10);
      ctx.moveTo(center.x + 10, center.y - 10);
      ctx.lineTo(center.x - 10, center.y + 10);
      ctx.stroke();
    } else {
      // ⊙ 기호 (밖으로)
      ctx.beginPath();
      ctx.arc(center.x, center.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center.x, center.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 설명
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`전류: ${currentDirection === 'clockwise' ? '시계방향' : '반시계방향'}`, center.x, center.y + radius + 30);
    ctx.fillText(`중심 자기장: ${currentDirection === 'clockwise' ? '안쪽' : '바깥쪽'}`, center.x, center.y + radius + 50);
  };

  const drawMagneticForceOnWire = (ctx: CanvasRenderingContext2D) => {
    // F = BIL 자기력 시각화
    const forceScale = fieldStrength * 8;
    
    // 외부 자기장 표시 (가정: 수평 자기장)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      const y = center.y - 120 + (i * 60);
      ctx.beginPath();
      ctx.moveTo(center.x - 150, y);
      ctx.lineTo(center.x + 150, y);
      ctx.stroke();
      
      // 자기장 방향 화살표
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(center.x + 120, y);
      ctx.lineTo(center.x + 110, y - 5);
      ctx.lineTo(center.x + 110, y + 5);
      ctx.closePath();
      ctx.fill();
    }
    
    // 자기력 벡터들
    const forceDirection = wireDirection === 'into' ? 1 : -1;
    
    for (let i = 0; i < 6; i++) {
      const y = center.y - 125 + (i * 50);
      
      // F = BIL 힘 벡터
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(center.x + 30, y);
      ctx.lineTo(center.x + 30 + forceDirection * forceScale, y);
      ctx.stroke();
      
      // 화살표 끝
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(center.x + 30 + forceDirection * forceScale, y);
      ctx.lineTo(center.x + 30 + forceDirection * (forceScale - 10), y - 6);
      ctx.lineTo(center.x + 30 + forceDirection * (forceScale - 10), y + 6);
      ctx.closePath();
      ctx.fill();
    }
    
    // 설명
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('F = BIL', center.x + 180, center.y - 50);
    ctx.font = '12px Arial';
    ctx.fillText('자기력', center.x + 180, center.y - 30);
    ctx.fillText(`방향: ${forceDirection > 0 ? '오른쪽' : '왼쪽'}`, center.x + 180, center.y - 10);
  };

  const drawMagneticFieldLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    
    if (magnetType === 'bar') {
      drawBarMagnetFieldLines(ctx);
    } else if (magnetType === 'horseshoe') {
      drawHorseshoeMagnetFieldLines(ctx);
    } else if (magnetType === 'electromagnet') {
      drawElectromagnetFieldLines(ctx);
    } else if (magnetType === 'straight-wire') {
      drawStraightWireFieldLines(ctx);
    } else if (magnetType === 'circular-wire') {
      drawCircularWireFieldLines(ctx);
    }
    
    // Draw field line arrows
    drawFieldLineArrows(ctx);
  };

  const drawBarMagnetFieldLines = (ctx: CanvasRenderingContext2D) => {
    const magnetWidth = 200;
    const magnetHeight = 40;
    const northPole = { x: center.x - magnetWidth / 4, y: center.y };
    const southPole = { x: center.x + magnetWidth / 4, y: center.y };
    
    // External field lines
    for (let i = 0; i < 8; i++) {
      const angle = (i - 3.5) * Math.PI / 8;
      const startRadius = magnetWidth / 2 + 20;
      const endRadius = magnetWidth / 2 + 100;
      
      ctx.beginPath();
      ctx.moveTo(
        northPole.x + Math.cos(angle) * startRadius,
        northPole.y + Math.sin(angle) * startRadius
      );
      
      // Create curved field line
      for (let t = 0; t <= 1; t += 0.1) {
        const currentRadius = startRadius + (endRadius - startRadius) * t;
        const x = northPole.x + Math.cos(angle) * currentRadius;
        const y = northPole.y + Math.sin(angle) * currentRadius;
        
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    }
    
    // Internal field lines
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < 3; i++) {
      const y = center.y + (i - 1) * 15;
      
      ctx.beginPath();
      ctx.moveTo(center.x - magnetWidth / 2 + 10, y);
      ctx.lineTo(center.x + magnetWidth / 2 - 10, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawHorseshoeMagnetFieldLines = (ctx: CanvasRenderingContext2D) => {
    const magnetWidth = 200;
    const poleGap = magnetWidth;
    
    // Field lines between poles
    for (let i = 0; i < 7; i++) {
      const y = center.y + (i - 3) * 15;
      
      ctx.beginPath();
      ctx.moveTo(center.x - magnetWidth / 2 + 15, y);
      ctx.lineTo(center.x + magnetWidth / 2 - 15, y);
      ctx.stroke();
      
      // Field line curves
      ctx.beginPath();
      ctx.arc(center.x - magnetWidth / 2, y, 15, 0, Math.PI);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(center.x + magnetWidth / 2, y, 15, 0, Math.PI);
      ctx.stroke();
    }
  };

  const drawElectromagnetFieldLines = (ctx: CanvasRenderingContext2D) => {
    const coreHeight = 200;
    const radius = 100;
    
    // Circular field lines around electromagnet
    for (let i = 1; i <= 4; i++) {
      const currentRadius = radius * i / 4;
      
      ctx.beginPath();
      ctx.arc(center.x, center.y, currentRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawStraightWireFieldLines = (ctx: CanvasRenderingContext2D) => {
    // 직선 도선 주위의 원형 자기장선들
    const numCircles = 6;
    const maxRadius = 120;
    
    for (let i = 1; i <= numCircles; i++) {
      const radius = (i * maxRadius) / numCircles;
      const alpha = 1 - (i - 1) / numCircles; // 투명도 조절
      
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // 자기장 방향 화살표
      const numArrows = Math.max(6, i * 2);
      for (let j = 0; j < numArrows; j++) {
        const angle = (j * 2 * Math.PI) / numArrows;
        const arrowX = center.x + Math.cos(angle) * radius;
        const arrowY = center.y + Math.sin(angle) * radius;
        
        ctx.save();
        ctx.translate(arrowX, arrowY);
        
        // 오른손 법칙에 따른 자기장 방향
        const rotationAngle = angle + (wireDirection === 'into' ? Math.PI/2 : -Math.PI/2);
        ctx.rotate(rotationAngle);
        
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-4, 4);
        ctx.lineTo(4, 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    ctx.setLineDash([]);
  };

  const drawCircularWireFieldLines = (ctx: CanvasRenderingContext2D) => {
    // 원형 도선의 자기장선들
    const wireRadius = 100;
    
    // 중심축 자기장 (솔레노이드 같은 형태)
    for (let i = 0; i < 8; i++) {
      const x = center.x + (i - 3.5) * 30;
      const fieldStrength = 1 - Math.abs(i - 3.5) / 4;
      
      ctx.strokeStyle = `rgba(16, 185, 129, ${fieldStrength})`;
      ctx.lineWidth = 2;
      
      const startY = center.y - 80;
      const endY = center.y + 80;
      
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
      
      // 자기장 방향 화살표
      const direction = currentDirection === 'clockwise' ? -1 : 1;
      const arrowY = center.y + direction * 30;
      
      ctx.fillStyle = `rgba(16, 185, 129, ${fieldStrength})`;
      ctx.beginPath();
      ctx.moveTo(x, arrowY);
      ctx.lineTo(x - 4, arrowY - direction * 8);
      ctx.lineTo(x + 4, arrowY - direction * 8);
      ctx.closePath();
      ctx.fill();
    }
    
    // 바깥쪽 자기장선들 (타원형)
    for (let i = 0; i < 4; i++) {
      const radiusX = wireRadius + 20 + (i * 20);
      const radiusY = 60 + (i * 15);
      
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.8 - i * 0.2})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawFieldLineArrows = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#10b981';
    
    // Draw small arrows along field lines to show direction
    const arrowSize = 6;
    const arrowPositions = [
      { x: center.x - 80, y: center.y - 30, angle: Math.PI / 6 },
      { x: center.x + 80, y: center.y - 30, angle: -Math.PI / 6 },
      { x: center.x - 80, y: center.y + 30, angle: -Math.PI / 6 },
      { x: center.x + 80, y: center.y + 30, angle: Math.PI / 6 }
    ];
    
    arrowPositions.forEach(pos => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.angle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-arrowSize, -arrowSize / 2);
      ctx.lineTo(-arrowSize, arrowSize / 2);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
  };

  const drawCompass = (ctx: CanvasRenderingContext2D) => {
    // Draw compass at mouse position
    const compassRadius = 20;
    
    // Calculate magnetic field direction at mouse position
    const fieldAngle = calculateFieldAngle(mousePos.x, mousePos.y);
    
    // Compass body
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, compassRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Compass needle
    ctx.save();
    ctx.translate(mousePos.x, mousePos.y);
    ctx.rotate(fieldAngle);
    
    // North end (red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-3, -15);
    ctx.lineTo(3, -15);
    ctx.closePath();
    ctx.fill();
    
    // South end (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-3, 15);
    ctx.lineTo(3, 15);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const calculateFieldAngle = (x: number, y: number): number => {
    // Calculate magnetic field direction - N pole of compass points along field lines
    if (magnetType === 'bar') {
      const northPole = { x: center.x - 50, y: center.y };
      const southPole = { x: center.x + 50, y: center.y };
      
      // Field lines go from N to S, so compass N pole points toward S pole
      const dx = southPole.x - x;
      const dy = southPole.y - y;
      
      return Math.atan2(dy, dx);
    } else if (magnetType === 'horseshoe') {
      // Field points from N to S between poles (horizontal)
      return 0; // Compass N points toward S pole (right)
    } else if (magnetType === 'electromagnet') {
      // Electromagnet - circular field
      const dx = x - center.x;
      const dy = y - center.y;
      
      // Right hand rule - if current is clockwise, field circles counter-clockwise
      const fieldAngle = currentDirection === 'clockwise' ? 
        Math.atan2(dy, dx) - Math.PI / 2 : 
        Math.atan2(dy, dx) + Math.PI / 2;
      
      return fieldAngle;
    } else if (magnetType === 'straight-wire') {
      // 직선 도선 주위의 원형 자기장
      const dx = x - center.x;
      const dy = y - center.y;
      
      // 오른손 법칙: 전류가 안쪽으로 흐르면 자기장은 시계방향
      const fieldAngle = wireDirection === 'into' ? 
        Math.atan2(dy, dx) + Math.PI / 2 : 
        Math.atan2(dy, dx) - Math.PI / 2;
      
      return fieldAngle;
    } else if (magnetType === 'circular-wire') {
      // 원형 도선의 자기장
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        // 원형 도선 내부 - 중심 방향
        return currentDirection === 'clockwise' ? Math.PI : 0;
      } else {
        // 원형 도선 외부 - 타원형 자기장
        const angle = Math.atan2(dy, dx);
        return currentDirection === 'clockwise' ? angle + Math.PI : angle;
      }
    }
    
    return 0;
  };

  const drawFieldStrengthIndicator = (ctx: CanvasRenderingContext2D) => {
    // Field strength at mouse position
    const distance = Math.sqrt(
      Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.y - center.y, 2)
    );
    
    const strength = Math.max(0, fieldStrength * (200 / Math.max(distance, 50)));
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(mousePos.x + 30, mousePos.y - 20, 100, 40);
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    ctx.strokeRect(mousePos.x + 30, mousePos.y - 20, 100, 40);
    
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`자기장: ${strength.toFixed(1)}T`, mousePos.x + 35, mousePos.y - 5);
    ctx.fillText(`방향: ${(calculateFieldAngle(mousePos.x, mousePos.y) * 180 / Math.PI).toFixed(0)}°`, mousePos.x + 35, mousePos.y + 10);
  };

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 180, 120);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 180, 120);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('자기장 시뮬레이션', 20, 30);
    ctx.fillText('• 녹색선: 자기력선', 20, 50);
    ctx.fillText('• 빨간색: N극', 20, 70);
    ctx.fillText('• 파란색: S극', 20, 90);
    ctx.fillText('• 나침반: 자기장 방향', 20, 110);
  };

  return (
    <MainLayout title="자기장 시뮬레이터">
      <div className="magnetic-field-page">
        <div className="controls">
        <div className="control-group">
          <label>자석 유형</label>
          <select 
            value={magnetType} 
            onChange={(e) => setMagnetType(e.target.value as 'bar' | 'horseshoe' | 'electromagnet' | 'straight-wire' | 'circular-wire')}
          >
            <option value="bar">막대자석</option>
            <option value="horseshoe">U자석</option>
            <option value="electromagnet">전자석</option>
            <option value="straight-wire">직선 도선</option>
            <option value="circular-wire">원형 도선</option>
          </select>
        </div>

        <div className="control-group">
          <label>자기장 세기: {fieldStrength}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={fieldStrength}
            onChange={(e) => setFieldStrength(Number(e.target.value))}
          />
        </div>

        {magnetType === 'electromagnet' && (
          <div className="control-group">
            <label>전류 방향</label>
            <select 
              value={currentDirection} 
              onChange={(e) => setCurrentDirection(e.target.value as 'clockwise' | 'counter-clockwise')}
            >
              <option value="clockwise">시계방향</option>
              <option value="counter-clockwise">반시계방향</option>
            </select>
          </div>
        )}

        {magnetType === 'straight-wire' && (
          <div className="control-group">
            <label>전류 방향</label>
            <select 
              value={wireDirection} 
              onChange={(e) => setWireDirection(e.target.value as 'into' | 'out-of')}
            >
              <option value="into">종이 안쪽(⊗)</option>
              <option value="out-of">종이 밖(⊙)</option>
            </select>
          </div>
        )}

        {magnetType === 'circular-wire' && (
          <div className="control-group">
            <label>전류 방향</label>
            <select 
              value={currentDirection} 
              onChange={(e) => setCurrentDirection(e.target.value as 'clockwise' | 'counter-clockwise')}
            >
              <option value="clockwise">시계방향</option>
              <option value="counter-clockwise">반시계방향</option>
            </select>
          </div>
        )}

        {(magnetType === 'straight-wire' || magnetType === 'circular-wire') && (
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showMagneticForce}
                onChange={(e) => setShowMagneticForce(e.target.checked)}
              />
              자기력 표시 (F=BIL)
            </label>
          </div>
        )}

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showFieldLines}
              onChange={(e) => setShowFieldLines(e.target.checked)}
            />
            자기력선 표시
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCompass}
              onChange={(e) => setShowCompass(e.target.checked)}
            />
            나침반 표시
          </label>
        </div>

        <button 
          className={`simulate-button ${isRunning ? 'running' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '시뮬레이션 정지' : '시뮬레이션 시작'}
        </button>
      </div>

      <div className="simulation-area">
        <canvas 
          ref={canvasRef} 
          width={canvasWidth} 
          height={canvasHeight}
          className="simulation-canvas"
          onMouseMove={handleMouseMove}
        />
        <p className="instruction">마우스를 움직여 자기장을 탐색해보세요!</p>
      </div>

      <div className="explanation">
        <h3>자기장의 이해</h3>
        <div className="explanation-content">
          <div className="explanation-section">
            <h4>자기력선</h4>
            <p>자기력선은 자기장의 방향과 세기를 나타냅니다. N극에서 시작하여 S극으로 향하며, 선이 조밀할수록 자기장이 강합니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>막대자석</h4>
            <p>막대자석은 N극과 S극을 가지며, 자기력선이 N극에서 나와 S극으로 들어갑니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>전자석</h4>
            <p>전류가 흐르는 코일에 의해 생기는 자기장입니다. 전류의 방향에 따라 N극과 S극이 결정됩니다.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .magnetic-field-page {
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

        .simulate-button {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
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

        .simulation-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }

        .simulation-canvas {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          cursor: crosshair;
        }

        .instruction {
          margin-top: 10px;
          color: #6b7280;
          font-style: italic;
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