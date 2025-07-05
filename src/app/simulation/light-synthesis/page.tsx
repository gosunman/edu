'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface LightRay {
  x: number;
  y: number;
  angle: number;
  color: string;
  intensity: number;
  wavelength: number;
}

interface RefractedRay {
  x: number;
  y: number;
  angle: number;
  color: string;
  intensity: number;
}

export default function LightSynthesisPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectType, setObjectType] = useState<'prism' | 'apple' | 'water' | 'leaf' | 'banana' | 'sky'>('prism');
  const [lightType, setLightType] = useState<'white' | 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'black'>('white');
  const [incidentAngle, setIncidentAngle] = useState(30);
  const [showSpectrum, setShowSpectrum] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  // 색상 스펙트럼 (가시광선)
  const spectrum = [
    { color: '#8B00FF', wavelength: 380, name: '보라' },
    { color: '#4B0082', wavelength: 430, name: '남' },
    { color: '#0000FF', wavelength: 470, name: '파랑' },
    { color: '#00FF00', wavelength: 520, name: '초록' },
    { color: '#FFFF00', wavelength: 570, name: '노랑' },
    { color: '#FF7F00', wavelength: 590, name: '주황' },
    { color: '#FF0000', wavelength: 650, name: '빨강' }
  ];

  useEffect(() => {
    draw();
  }, [objectType, lightType, incidentAngle, showSpectrum, isRunning]);

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
    
    setAnimationTime(prev => prev + 0.05);
    animationRef.current = requestAnimationFrame(animate);
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
    
    // Draw object
    drawObject(ctx);
    
    // Draw incident light
    drawIncidentLight(ctx);
    
    // Draw refracted/reflected light
    drawRefractedLight(ctx);
    
    // Draw spectrum
    if (showSpectrum) {
      drawSpectrum(ctx);
    }
    
    // Draw information
    drawInformation(ctx);
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const drawObject = (ctx: CanvasRenderingContext2D) => {
    if (objectType === 'prism') {
      drawPrism(ctx);
    } else if (objectType === 'apple') {
      drawApple(ctx);
    } else if (objectType === 'water') {
      drawWaterDroplet(ctx);
    } else if (objectType === 'leaf') {
      drawLeaf(ctx);
    } else if (objectType === 'banana') {
      drawBanana(ctx);
    } else if (objectType === 'sky') {
      drawSky(ctx);
    }
  };

  const drawPrism = (ctx: CanvasRenderingContext2D) => {
    const prismSize = 150;
    const prismX = center.x;
    const prismY = center.y;
    
    // Prism shape (triangle)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(prismX - prismSize / 2, prismY + prismSize / 2);
    ctx.lineTo(prismX + prismSize / 2, prismY + prismSize / 2);
    ctx.lineTo(prismX, prismY - prismSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Prism highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.moveTo(prismX - prismSize / 4, prismY + prismSize / 4);
    ctx.lineTo(prismX, prismY + prismSize / 4);
    ctx.lineTo(prismX - prismSize / 8, prismY);
    ctx.closePath();
    ctx.fill();
  };

  const drawApple = (ctx: CanvasRenderingContext2D) => {
    const appleRadius = 80;
    const appleX = center.x;
    const appleY = center.y;
    
    // Apple body
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(appleX, appleY, appleRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Apple highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(appleX - 20, appleY - 20, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Apple stem
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(appleX - 3, appleY - appleRadius - 15, 6, 15);
    
    // Apple leaf
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(appleX + 10, appleY - appleRadius - 10, 8, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawWaterDroplet = (ctx: CanvasRenderingContext2D) => {
    const dropletX = center.x;
    const dropletY = center.y;
    
    // Water droplet shape
    ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(dropletX, dropletY + 20, 60, 0, Math.PI * 2);
    ctx.arc(dropletX, dropletY - 20, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Water droplet highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(dropletX - 15, dropletY - 10, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D) => {
    const leafX = center.x;
    const leafY = center.y;
    
    // Leaf shape
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.ellipse(leafX, leafY, 80, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Leaf veins
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leafX - 60, leafY);
    ctx.lineTo(leafX + 60, leafY);
    ctx.stroke();
    
    // Leaf highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(leafX - 20, leafY - 10, 20, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawBanana = (ctx: CanvasRenderingContext2D) => {
    const bananaX = center.x;
    const bananaY = center.y;
    
    // Banana shape
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(bananaX, bananaY, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Banana spots
    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.arc(bananaX - 30, bananaY - 20, 8, 0, Math.PI * 2);
    ctx.arc(bananaX + 20, bananaY - 30, 6, 0, Math.PI * 2);
    ctx.arc(bananaX - 10, bananaY + 30, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Banana highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(bananaX - 20, bananaY - 20, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawSky = (ctx: CanvasRenderingContext2D) => {
    const skyX = center.x;
    const skyY = center.y;
    
    // Sky background
    const gradient = ctx.createLinearGradient(skyX - 100, skyY - 100, skyX + 100, skyY + 100);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#4682b4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(skyX - 100, skyY - 100, 200, 200);
    
    // Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(skyX - 30, skyY - 40, 20, 0, Math.PI * 2);
    ctx.arc(skyX - 10, skyY - 45, 25, 0, Math.PI * 2);
    ctx.arc(skyX + 15, skyY - 40, 18, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(skyX + 20, skyY + 30, 15, 0, Math.PI * 2);
    ctx.arc(skyX + 35, skyY + 25, 20, 0, Math.PI * 2);
    ctx.arc(skyX + 50, skyY + 30, 12, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawIncidentLight = (ctx: CanvasRenderingContext2D) => {
    const lightStartX = center.x - 300;
    const lightStartY = center.y - Math.tan(incidentAngle * Math.PI / 180) * 300;
    
    if (lightType === 'white') {
      // White light beam
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(lightStartX, lightStartY);
      ctx.lineTo(center.x - 75, center.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    } else {
      // Colored light
      const lightColors = {
        'red': '#ff0000',
        'green': '#00ff00',
        'blue': '#0000ff',
        'yellow': '#ffff00',
        'magenta': '#ff00ff',
        'cyan': '#00ffff',
        'black': '#000000'
      };
      
      ctx.strokeStyle = lightColors[lightType as keyof typeof lightColors];
      ctx.lineWidth = 4;
      ctx.shadowColor = lightColors[lightType as keyof typeof lightColors];
      ctx.shadowBlur = 15;
      
      ctx.beginPath();
      ctx.moveTo(lightStartX, lightStartY);
      ctx.lineTo(center.x - 75, center.y);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
    
    // Light source
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(lightStartX - 20, lightStartY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Light source glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.beginPath();
    ctx.arc(lightStartX - 20, lightStartY, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRefractedLight = (ctx: CanvasRenderingContext2D) => {
    if (!isRunning) return;
    
    const exitX = center.x + 75;
    const exitY = center.y;
    
    if (objectType === 'prism' && lightType === 'white') {
      // Dispersion - separate colors (red bends least, violet bends most)
      spectrum.forEach((color, index) => {
        // 굴절각은 입사각보다 작아지고, 보라색이 가장 많이 꺾임
        const refractionFactor = 0.6 - (index * 0.05); // 보라색(첫번째)이 가장 많이 굴절
        const refractedAngle = incidentAngle * refractionFactor;
        
        const endX = exitX + Math.cos(refractedAngle * Math.PI / 180) * 200;
        const endY = exitY + Math.sin(refractedAngle * Math.PI / 180) * 200;
        
        ctx.strokeStyle = color.color;
        ctx.lineWidth = 6;
        ctx.shadowColor = color.color;
        ctx.shadowBlur = 8;
        
        ctx.beginPath();
        ctx.moveTo(exitX, exitY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });
      
      ctx.shadowBlur = 0;
    } else if (objectType === 'apple') {
      // Absorption and reflection
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#ff4444';
      ctx.shadowBlur = 10;
      
      // Reflected red light
      const reflectedAngle = -incidentAngle;
      const endX = exitX + Math.cos(reflectedAngle * Math.PI / 180) * 150;
      const endY = exitY + Math.sin(reflectedAngle * Math.PI / 180) * 150;
      
      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    } else {
      // Regular refraction
      const refractedAngle = incidentAngle * 0.7; // Simplified refraction
      const endX = exitX + Math.cos(refractedAngle * Math.PI / 180) * 200;
      const endY = exitY + Math.sin(refractedAngle * Math.PI / 180) * 200;
      
      const lightColors = {
        'red': '#ff0000',
        'green': '#00ff00',
        'blue': '#0000ff',
        'yellow': '#ffff00',
        'magenta': '#ff00ff',
        'cyan': '#00ffff',
        'black': '#000000'
      };
      
      ctx.strokeStyle = lightType === 'white' ? '#ffffff' : lightColors[lightType as keyof typeof lightColors];
      ctx.lineWidth = 6;
      ctx.shadowColor = lightType === 'white' ? '#ffffff' : lightColors[lightType as keyof typeof lightColors];
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(exitX, exitY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
  };

  const drawSpectrum = (ctx: CanvasRenderingContext2D) => {
    if (!isRunning || objectType !== 'prism' || lightType !== 'white') return;
    
    // Spectrum on screen
    const spectrumX = 650;
    const spectrumY = 200;
    const spectrumWidth = 120;
    const spectrumHeight = 200;
    
    // Create rainbow gradient
    const gradient = ctx.createLinearGradient(spectrumX, spectrumY, spectrumX, spectrumY + spectrumHeight);
    spectrum.forEach((color, index) => {
      gradient.addColorStop(index / (spectrum.length - 1), color.color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(spectrumX, spectrumY, spectrumWidth, spectrumHeight);
    
    // Spectrum border
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(spectrumX, spectrumY, spectrumWidth, spectrumHeight);
    
    // Spectrum labels
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    spectrum.forEach((color, index) => {
      const y = spectrumY + (index * spectrumHeight / (spectrum.length - 1));
      ctx.fillText(color.name, spectrumX + spectrumWidth + 10, y + 5);
      ctx.fillText(`${color.wavelength}nm`, spectrumX + spectrumWidth + 10, y + 18);
    });
  };

  const drawInformation = (ctx: CanvasRenderingContext2D) => {
    // Information panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 200, 140);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 140);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('빛의 합성 시뮬레이션', 20, 30);
    ctx.fillText(`입사각: ${incidentAngle}°`, 20, 50);
    ctx.fillText(`물체: ${getObjectName(objectType)}`, 20, 70);
    ctx.fillText(`빛: ${getLightName(lightType)}`, 20, 90);
    
    if (objectType === 'prism') {
      ctx.fillText('현상: 빛의 분산', 20, 110);
    } else if (objectType === 'apple') {
      ctx.fillText('현상: 선택적 반사', 20, 110);
    } else {
      ctx.fillText('현상: 굴절', 20, 110);
    }
    
    ctx.fillText(`굴절률: ${getRefractiveIndex(objectType)}`, 20, 130);
  };

  const getObjectName = (type: string): string => {
    switch (type) {
      case 'prism': return '프리즘';
      case 'apple': return '사과';
      case 'water': return '물방울';
      case 'leaf': return '나뭇잎';
      case 'banana': return '바나나';
      case 'sky': return '하늘';
      default: return '';
    }
  };

  const getLightName = (type: string): string => {
    switch (type) {
      case 'white': return '백색광';
      case 'red': return '빨간색';
      case 'green': return '초록색';
      case 'blue': return '파란색';
      case 'yellow': return '노란색';
      case 'magenta': return '자홍색';
      case 'cyan': return '청록색';
      case 'black': return '검은색';
      default: return '';
    }
  };

  const getRefractiveIndex = (type: string): string => {
    switch (type) {
      case 'prism': return '1.5';
      case 'apple': return '1.3';
      case 'water': return '1.33';
      case 'leaf': return '1.4';
      case 'banana': return '1.35';
      case 'sky': return '1.0';
      default: return '';
    }
  };

  return (
    <div className="light-synthesis-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>빛의 합성 시뮬레이션</h1>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>물체 유형</label>
          <select 
            value={objectType} 
            onChange={(e) => setObjectType(e.target.value as 'prism' | 'apple' | 'water' | 'leaf' | 'banana' | 'sky')}
          >
            <option value="prism">프리즘</option>
            <option value="apple">사과</option>
            <option value="water">물방울</option>
            <option value="leaf">나뭇잎</option>
            <option value="banana">바나나</option>
            <option value="sky">하늘</option>
          </select>
        </div>

        <div className="control-group">
          <label>빛의 종류</label>
          <select 
            value={lightType} 
            onChange={(e) => setLightType(e.target.value as 'white' | 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'black')}
          >
            <option value="white">백색광</option>
            <option value="red">빨간색</option>
            <option value="green">초록색</option>
            <option value="blue">파란색</option>
            <option value="yellow">노란색</option>
            <option value="magenta">자홍색</option>
            <option value="cyan">청록색</option>
            <option value="black">검은색</option>
          </select>
        </div>

        <div className="control-group">
          <label>입사각: {incidentAngle}°</label>
          <input
            type="range"
            min="0"
            max="60"
            value={incidentAngle}
            onChange={(e) => setIncidentAngle(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showSpectrum}
              onChange={(e) => setShowSpectrum(e.target.checked)}
            />
            스펙트럼 표시
          </label>
        </div>

        <button 
          className={`simulate-button ${isRunning ? 'running' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '조명 끄기' : '조명 켜기'}
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
        <h3>빛의 성질과 현상</h3>
        <div className="explanation-content">
          <div className="explanation-section">
            <h4>빛의 분산</h4>
            <p>백색광이 프리즘을 통과할 때 파장에 따라 굴절각이 달라져 무지개색으로 분리되는 현상입니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>선택적 반사</h4>
            <p>사과가 빨간색으로 보이는 이유는 빨간색 빛만 반사하고 다른 색은 흡수하기 때문입니다.</p>
          </div>
          
          <div className="explanation-section">
            <h4>굴절 현상</h4>
            <p>빛이 서로 다른 매질을 통과할 때 속도가 변하면서 진행 방향이 바뀌는 현상입니다.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .light-synthesis-page {
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
          background: #fbbf24;
          color: #1f2937;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .simulate-button:hover {
          background: #f59e0b;
        }

        .simulate-button.running {
          background: #ef4444;
          color: white;
        }

        .simulate-button.running:hover {
          background: #dc2626;
        }

        .simulation-area {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .simulation-canvas {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #1f2937;
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