'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type MirrorType = 'plane' | 'concave' | 'convex';
type LensType = 'convex' | 'concave';
type SimulationType = 'mirror' | 'lens';

interface Point {
  x: number;
  y: number;
}

interface Ray {
  start: Point;
  end: Point;
  color: string;
  type: 'incident' | 'reflected' | 'refracted';
}

export default function MirrorLensPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simulationType, setSimulationType] = useState<SimulationType>('mirror');
  const [mirrorType, setMirrorType] = useState<MirrorType>('plane');
  const [lensType, setLensType] = useState<LensType>('convex');
  const [objectDistance, setObjectDistance] = useState(30);
  const [focalLength, setFocalLength] = useState(20);
  const [objectHeight, setObjectHeight] = useState(15);
  const [rays, setRays] = useState<Ray[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const canvasWidth = 800;
  const canvasHeight = 400;
  const center = { x: canvasWidth / 2, y: canvasHeight / 2 };

  useEffect(() => {
    draw();
  }, [simulationType, mirrorType, lensType, objectDistance, focalLength, objectHeight, isRunning]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw optical element
    if (simulationType === 'mirror') {
      drawMirror(ctx);
    } else {
      drawLens(ctx);
    }
    
    // Draw object
    drawObject(ctx);
    
    // Draw rays
    drawRays(ctx);
    
    // Draw image
    drawImage(ctx);
    
    // Draw measurements
    drawMeasurements(ctx);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    
    // Main axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, center.y);
    ctx.lineTo(canvasWidth, center.y);
    ctx.stroke();
  };

  const drawMirror = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    
    if (mirrorType === 'plane') {
      // Plane mirror
      ctx.beginPath();
      ctx.moveTo(center.x, center.y - 60);
      ctx.lineTo(center.x, center.y + 60);
      ctx.stroke();
      
      // Reflection side indicators
      for (let i = -50; i <= 50; i += 20) {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y + i);
        ctx.lineTo(center.x - 10, center.y + i - 5);
        ctx.stroke();
      }
    } else if (mirrorType === 'concave') {
      // Concave mirror
      ctx.beginPath();
      ctx.arc(center.x + 100, center.y, 100, Math.PI * 0.7, Math.PI * 1.3);
      ctx.stroke();
      
      // Focal point
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(center.x - focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText('F', center.x - focalLength - 5, center.y - 10);
    } else {
      // Convex mirror
      ctx.beginPath();
      ctx.arc(center.x - 100, center.y, 100, Math.PI * 1.7, Math.PI * 0.3);
      ctx.stroke();
      
      // Focal point (virtual)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(center.x - focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText('F', center.x - focalLength - 5, center.y - 10);
    }
  };

  const drawLens = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    
    if (lensType === 'convex') {
      // Convex lens
      ctx.beginPath();
      ctx.arc(center.x - 30, center.y, 60, -Math.PI/3, Math.PI/3);
      ctx.arc(center.x + 30, center.y, 60, Math.PI*2/3, Math.PI*4/3);
      ctx.stroke();
      
      // Focal points
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(center.x - focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center.x + focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText('F', center.x - focalLength - 5, center.y - 10);
      ctx.fillText('F', center.x + focalLength - 5, center.y - 10);
    } else {
      // Concave lens
      ctx.beginPath();
      ctx.arc(center.x + 30, center.y, 60, Math.PI/3, Math.PI*5/3);
      ctx.arc(center.x - 30, center.y, 60, -Math.PI/3, -Math.PI*5/3);
      ctx.stroke();
      
      // Virtual focal points
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(center.x - focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center.x + focalLength, center.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText('F', center.x - focalLength - 5, center.y - 10);
      ctx.fillText('F', center.x + focalLength - 5, center.y - 10);
    }
  };

  const drawObject = (ctx: CanvasRenderingContext2D) => {
    const objectX = center.x - objectDistance;
    const objectY = center.y - objectHeight;
    
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    
    // Object arrow
    ctx.beginPath();
    ctx.moveTo(objectX, center.y);
    ctx.lineTo(objectX, objectY);
    ctx.moveTo(objectX - 5, objectY + 5);
    ctx.lineTo(objectX, objectY);
    ctx.lineTo(objectX + 5, objectY + 5);
    ctx.stroke();
    
    ctx.fillStyle = '#10b981';
    ctx.font = '12px Arial';
    ctx.fillText('물체', objectX - 15, center.y + 20);
  };

  const drawRays = (ctx: CanvasRenderingContext2D) => {
    if (!isRunning) return;
    
    const objectX = center.x - objectDistance;
    const objectY = center.y - objectHeight;
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    if (simulationType === 'mirror') {
      if (mirrorType === 'plane') {
        // Ray from top of object perpendicular to mirror
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(center.x, objectY);
        ctx.stroke();
        
        // Reflected ray
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(center.x, objectY);
        ctx.lineTo(center.x + objectDistance, objectY);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (mirrorType === 'concave') {
        // Ray parallel to axis
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(center.x, objectY);
        ctx.stroke();
        
        // Ray through focal point
        ctx.beginPath();
        ctx.moveTo(center.x, objectY);
        ctx.lineTo(center.x - focalLength, center.y);
        ctx.stroke();
        
        // Ray through center
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(center.x, center.y);
        ctx.stroke();
      }
    } else {
      // Lens rays
      if (lensType === 'convex') {
        // Ray parallel to axis
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(center.x, objectY);
        ctx.stroke();
        
        // Ray through focal point
        ctx.beginPath();
        ctx.moveTo(center.x, objectY);
        ctx.lineTo(center.x + focalLength, center.y);
        ctx.stroke();
        
        // Ray through center
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(center.x, center.y);
        ctx.stroke();
      }
    }
  };

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    if (!isRunning) return;
    
    let imageDistance = 0;
    let imageHeight = 0;
    
    if (simulationType === 'mirror') {
      if (mirrorType === 'plane') {
        imageDistance = objectDistance;
        imageHeight = objectHeight;
      } else if (mirrorType === 'concave') {
        imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength);
        imageHeight = (imageDistance / objectDistance) * objectHeight;
      } else {
        imageDistance = (focalLength * objectDistance) / (objectDistance + focalLength);
        imageHeight = (imageDistance / objectDistance) * objectHeight;
      }
    } else {
      if (lensType === 'convex') {
        imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength);
        imageHeight = (imageDistance / objectDistance) * objectHeight;
      } else {
        imageDistance = (focalLength * objectDistance) / (objectDistance + focalLength);
        imageHeight = (imageDistance / objectDistance) * objectHeight;
      }
    }
    
    const imageX = center.x + (simulationType === 'mirror' && mirrorType === 'plane' ? -imageDistance : imageDistance);
    const imageY = center.y - imageHeight;
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    
    if (simulationType === 'mirror' && mirrorType === 'plane') {
      ctx.setLineDash([5, 5]);
    }
    
    // Image arrow
    ctx.beginPath();
    ctx.moveTo(imageX, center.y);
    ctx.lineTo(imageX, imageY);
    ctx.moveTo(imageX - 5, imageY + (imageHeight > 0 ? 5 : -5));
    ctx.lineTo(imageX, imageY);
    ctx.lineTo(imageX + 5, imageY + (imageHeight > 0 ? 5 : -5));
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#f59e0b';
    ctx.font = '12px Arial';
    ctx.fillText('상', imageX - 10, center.y + 20);
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    
    // Object distance
    ctx.fillText(`물체거리: ${objectDistance}cm`, 10, 30);
    
    // Focal length
    ctx.fillText(`초점거리: ${focalLength}cm`, 10, 50);
    
    // Object height
    ctx.fillText(`물체높이: ${objectHeight}cm`, 10, 70);
    
    if (isRunning) {
      let imageDistance = 0;
      let imageHeight = 0;
      
      if (simulationType === 'mirror') {
        if (mirrorType === 'plane') {
          imageDistance = objectDistance;
          imageHeight = objectHeight;
        } else if (mirrorType === 'concave') {
          imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength);
          imageHeight = (imageDistance / objectDistance) * objectHeight;
        } else {
          imageDistance = (focalLength * objectDistance) / (objectDistance + focalLength);
          imageHeight = (imageDistance / objectDistance) * objectHeight;
        }
      } else {
        if (lensType === 'convex') {
          imageDistance = (focalLength * objectDistance) / (objectDistance - focalLength);
          imageHeight = (imageDistance / objectDistance) * objectHeight;
        } else {
          imageDistance = (focalLength * objectDistance) / (objectDistance + focalLength);
          imageHeight = (imageDistance / objectDistance) * objectHeight;
        }
      }
      
      ctx.fillText(`상거리: ${imageDistance.toFixed(1)}cm`, 10, 90);
      ctx.fillText(`상높이: ${imageHeight.toFixed(1)}cm`, 10, 110);
      ctx.fillText(`배율: ${(imageHeight / objectHeight).toFixed(2)}`, 10, 130);
    }
  };

  return (
    <div className="mirror-lens-page">
      <div className="header">
        <Link href="/simulation" className="back-button">
          ← 시뮬레이션 목록
        </Link>
        <h1>거울과 렌즈 작도</h1>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>시뮬레이션 유형</label>
          <select 
            value={simulationType} 
            onChange={(e) => setSimulationType(e.target.value as SimulationType)}
          >
            <option value="mirror">거울</option>
            <option value="lens">렌즈</option>
          </select>
        </div>

        {simulationType === 'mirror' ? (
          <div className="control-group">
            <label>거울 유형</label>
            <select 
              value={mirrorType} 
              onChange={(e) => setMirrorType(e.target.value as MirrorType)}
            >
              <option value="plane">평면거울</option>
              <option value="concave">오목거울</option>
              <option value="convex">볼록거울</option>
            </select>
          </div>
        ) : (
          <div className="control-group">
            <label>렌즈 유형</label>
            <select 
              value={lensType} 
              onChange={(e) => setLensType(e.target.value as LensType)}
            >
              <option value="convex">볼록렌즈</option>
              <option value="concave">오목렌즈</option>
            </select>
          </div>
        )}

        <div className="control-group">
          <label>물체 거리: {objectDistance}cm</label>
          <input
            type="range"
            min="10"
            max="100"
            value={objectDistance}
            onChange={(e) => setObjectDistance(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>초점 거리: {focalLength}cm</label>
          <input
            type="range"
            min="10"
            max="50"
            value={focalLength}
            onChange={(e) => setFocalLength(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>물체 높이: {objectHeight}cm</label>
          <input
            type="range"
            min="5"
            max="30"
            value={objectHeight}
            onChange={(e) => setObjectHeight(Number(e.target.value))}
          />
        </div>

        <button 
          className={`simulate-button ${isRunning ? 'running' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '중지' : '시뮬레이션 시작'}
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
        <h3>작도 원리</h3>
        {simulationType === 'mirror' ? (
          <div>
            {mirrorType === 'plane' && (
              <p>평면거울: 물체와 상은 거울을 기준으로 같은 거리에 위치하며, 상의 크기는 물체와 같습니다.</p>
            )}
            {mirrorType === 'concave' && (
              <p>오목거울: 물체가 초점 밖에 있으면 실상이 형성되고, 초점 안에 있으면 확대된 허상이 형성됩니다.</p>
            )}
            {mirrorType === 'convex' && (
              <p>볼록거울: 항상 축소된 정립 허상이 형성됩니다.</p>
            )}
          </div>
        ) : (
          <div>
            {lensType === 'convex' && (
              <p>볼록렌즈: 물체가 초점 밖에 있으면 실상이 형성되고, 초점 안에 있으면 확대된 허상이 형성됩니다.</p>
            )}
            {lensType === 'concave' && (
              <p>오목렌즈: 항상 축소된 정립 허상이 형성됩니다.</p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .mirror-lens-page {
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

        .simulate-button {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-end;
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
          margin-bottom: 10px;
        }

        .explanation p {
          color: #374151;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
          }
          
          .simulation-canvas {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 