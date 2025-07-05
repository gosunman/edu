'use client';

import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';

interface CircuitElement {
  id: string;
  type: 'resistor' | 'battery' | 'wire';
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  color: string;
}

interface ElectronParticle {
  x: number;
  y: number;
  path: number;
  speed: number;
}

export default function ElectricCircuitPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [voltage, setVoltage] = useState(9); // 전압 (V)
  const [resistance, setResistance] = useState(3); // 저항 (Ω)
  const [current, setCurrent] = useState(0); // 전류 (A)
  const [power, setPower] = useState(0); // 전력 (W)
  const [isRunning, setIsRunning] = useState(false);
  const [showElectrons, setShowElectrons] = useState(true);
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'complex'>('series');
  const [resistance2, setResistance2] = useState(6); // 두 번째 저항
  const [resistance3, setResistance3] = useState(4); // 세 번째 저항 (복합 회로용)
  const [electronParticles, setElectronParticles] = useState<ElectronParticle[]>([]);
  const animationRef = useRef<number | null>(null);

  const canvasWidth = 800;
  const canvasHeight = 600;

  // 옴의 법칙 계산
  useEffect(() => {
    let totalResistance = 0;
    
    if (circuitType === 'series') {
      totalResistance = resistance + resistance2;
    } else if (circuitType === 'parallel') {
      totalResistance = (resistance * resistance2) / (resistance + resistance2);
    } else if (circuitType === 'complex') {
      // 복합 회로: R1과 R2가 병렬로 연결되고, 그것이 R3와 직렬로 연결
      const parallelResistance = (resistance * resistance2) / (resistance + resistance2);
      totalResistance = parallelResistance + resistance3;
    }
    
    const calculatedCurrent = voltage / totalResistance;
    const calculatedPower = voltage * calculatedCurrent;
    
    setCurrent(calculatedCurrent);
    setPower(calculatedPower);
    
    // 전자 입자 초기화
    initializeElectrons();
  }, [voltage, resistance, resistance2, resistance3, circuitType]);

  useEffect(() => {
    draw();
  }, [current, voltage, resistance, resistance2, circuitType, showElectrons, isRunning]);

  useEffect(() => {
    if (isRunning && showElectrons) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, showElectrons]);

  const initializeElectrons = () => {
    const electrons: ElectronParticle[] = [];
    const numElectrons = Math.max(5, Math.floor(current * 10));
    
    for (let i = 0; i < numElectrons; i++) {
      electrons.push({
        x: 100 + (i * 600 / numElectrons),
        y: 150,
        path: i * (600 / numElectrons),
        speed: current * 2 + 0.5
      });
    }
    
    setElectronParticles(electrons);
  };

  const animate = () => {
    if (!isRunning) return;
    
    setElectronParticles(prev => 
      prev.map(electron => {
        let newPath = electron.path + electron.speed;
        if (newPath > 600) newPath = 0;
        
        const { x, y } = getElectronPosition(newPath);
        
        return {
          ...electron,
          x,
          y,
          path: newPath
        };
      })
    );
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const getElectronPosition = (path: number): { x: number; y: number } => {
    const circuitPerimeter = 600;
    const section = path / circuitPerimeter;
    
    if (section < 0.25) {
      // 상단 가로
      return { x: 100 + (section * 4 * 600), y: 150 };
    } else if (section < 0.5) {
      // 우측 세로
      return { x: 700, y: 150 + ((section - 0.25) * 4 * 300) };
    } else if (section < 0.75) {
      // 하단 가로
      return { x: 700 - ((section - 0.5) * 4 * 600), y: 450 };
    } else {
      // 좌측 세로
      return { x: 100, y: 450 - ((section - 0.75) * 4 * 300) };
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw circuit
    drawCircuit(ctx);
    
    // Draw electrons
    if (showElectrons && isRunning) {
      drawElectrons(ctx);
    }
    
    // Draw measurements
    drawMeasurements(ctx);
    
    // Draw current flow indicators
    if (isRunning) {
      drawCurrentFlow(ctx);
    }
  };

  const drawCircuit = (ctx: CanvasRenderingContext2D) => {
    // Circuit wire
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Main circuit path
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(700, 150);
    ctx.lineTo(700, 450);
    ctx.lineTo(100, 450);
    ctx.lineTo(100, 150);
    ctx.stroke();
    
    // Draw battery
    drawBattery(ctx, 50, 280, voltage);
    
    // Draw resistors based on circuit type
    if (circuitType === 'series') {
      drawResistor(ctx, 300, 130, resistance, 'R1');
      drawResistor(ctx, 500, 130, resistance2, 'R2');
    } else if (circuitType === 'parallel') {
      // Parallel circuit
      drawParallelBranch(ctx);
      drawResistor(ctx, 300, 100, resistance, 'R1');
      drawResistor(ctx, 300, 200, resistance2, 'R2');
    } else if (circuitType === 'complex') {
      // Complex circuit: R1 and R2 in parallel, then in series with R3
      drawComplexCircuit(ctx);
    }
    
    // Draw switch
    drawSwitch(ctx, 600, 130, isRunning);
  };

  const drawBattery = (ctx: CanvasRenderingContext2D, x: number, y: number, voltage: number) => {
    // Battery symbol
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 6;
    
    // Positive terminal
    ctx.beginPath();
    ctx.moveTo(x, y - 30);
    ctx.lineTo(x, y + 30);
    ctx.stroke();
    
    // Negative terminal
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 20, y - 20);
    ctx.lineTo(x + 20, y + 20);
    ctx.stroke();
    
    // Voltage label
    ctx.fillStyle = '#1f2937';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${voltage}V`, x + 10, y + 50);
    
    // Plus/minus signs
    ctx.font = '20px Arial';
    ctx.fillText('+', x - 15, y - 40);
    ctx.fillText('-', x + 35, y - 40);
  };

  const drawResistor = (ctx: CanvasRenderingContext2D, x: number, y: number, resistance: number, label: string) => {
    // Resistor body
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 30, y - 10, 60, 20);
    
    // Resistor stripes
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x - 20 + i * 10, y - 10);
      ctx.lineTo(x - 20 + i * 10, y + 10);
      ctx.stroke();
    }
    
    // Resistance value
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${label}: ${resistance}Ω`, x, y + 35);
    
    // Heat effect based on power
    if (isRunning) {
      const heat = (voltage * voltage / resistance) / 10;
      ctx.fillStyle = `rgba(255, 0, 0, ${Math.min(heat, 0.5)})`;
      ctx.fillRect(x - 35, y - 15, 70, 30);
    }
  };

  const drawParallelBranch = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Branch connections - direct to resistors only
    ctx.beginPath();
    ctx.moveTo(250, 150);
    ctx.lineTo(250, 100);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(250, 150);
    ctx.lineTo(250, 200);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(350, 100);
    ctx.lineTo(400, 100);
    ctx.lineTo(400, 150);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(350, 200);
    ctx.lineTo(400, 200);
    ctx.lineTo(400, 150);
    ctx.stroke();
  };

  const drawComplexCircuit = (ctx: CanvasRenderingContext2D) => {
    // Complex circuit: R1||R2 in series with R3
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    
    // Parallel section (R1 and R2)
    // Upper branch for R1
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(200, 100);
    ctx.lineTo(350, 100);
    ctx.stroke();
    
    // Lower branch for R2
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(200, 200);
    ctx.lineTo(350, 200);
    ctx.stroke();
    
    // Connect parallel branches
    ctx.beginPath();
    ctx.moveTo(350, 100);
    ctx.lineTo(400, 100);
    ctx.lineTo(400, 150);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(350, 200);
    ctx.lineTo(400, 200);
    ctx.lineTo(400, 150);
    ctx.stroke();
    
    // Junction points for parallel section
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(200, 150, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(400, 150, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw resistors
    drawResistor(ctx, 250, 80, resistance, 'R1');
    drawResistor(ctx, 250, 180, resistance2, 'R2');
    drawResistor(ctx, 500, 130, resistance3, 'R3');
    
    // Current and voltage annotations
    const parallelResistance = (resistance * resistance2) / (resistance + resistance2);
    const totalCurrent = voltage / (parallelResistance + resistance3);
    const voltage_parallel = totalCurrent * parallelResistance;
    const voltage_r3 = totalCurrent * resistance3;
    
    const i1 = voltage_parallel / resistance;
    const i2 = voltage_parallel / resistance2;
    
    // Current labels
    ctx.fillStyle = '#ef4444';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    ctx.fillText(`I1=${i1.toFixed(2)}A`, 280, 70);
    ctx.fillText(`I2=${i2.toFixed(2)}A`, 280, 220);
    ctx.fillText(`I총=${totalCurrent.toFixed(2)}A`, 520, 115);
    
    // Voltage labels
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`V병렬=${voltage_parallel.toFixed(1)}V`, 300, 250);
    ctx.fillText(`V3=${voltage_r3.toFixed(1)}V`, 520, 170);
    
    // Circuit analysis info
    ctx.fillStyle = '#1f2937';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`R병렬=${parallelResistance.toFixed(1)}Ω`, 150, 270);
    ctx.fillText(`R총=${(parallelResistance + resistance3).toFixed(1)}Ω`, 150, 285);
  };

  const drawSwitch = (ctx: CanvasRenderingContext2D, x: number, y: number, isClosed: boolean) => {
    // Switch base
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(x - 15, y - 5, 30, 10);
    
    // Switch lever
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    
    if (isClosed) {
      ctx.lineTo(x + 10, y);
    } else {
      ctx.lineTo(x + 10, y - 15);
    }
    
    ctx.stroke();
    
    // Switch label
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isClosed ? 'ON' : 'OFF', x, y + 25);
  };

  const drawElectrons = (ctx: CanvasRenderingContext2D) => {
    electronParticles.forEach(electron => {
      // Electron glow
      const gradient = ctx.createRadialGradient(electron.x, electron.y, 0, electron.x, electron.y, 8);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Electron core
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Electron trail
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 12, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const drawCurrentFlow = (ctx: CanvasRenderingContext2D) => {
    // Current flow arrows
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    
    const arrowPositions = [
      { x: 200, y: 150, angle: 0 },
      { x: 700, y: 250, angle: Math.PI / 2 },
      { x: 500, y: 450, angle: Math.PI },
      { x: 100, y: 350, angle: -Math.PI / 2 }
    ];
    
    arrowPositions.forEach(pos => {
      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(pos.angle);
      
      // Arrow body
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(5, -5);
      ctx.lineTo(5, 5);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    // Measurement panel
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 200, 150);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 200, 150);
    
    // Measurements text
    ctx.fillStyle = '#1f2937';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText('전기회로 측정값', 20, 30);
    ctx.fillText(`전압(V): ${voltage.toFixed(1)}V`, 20, 50);
    ctx.fillText(`전류(I): ${current.toFixed(2)}A`, 20, 70);
    
    if (circuitType === 'series') {
      ctx.fillText(`총 저항: ${(resistance + resistance2).toFixed(1)}Ω`, 20, 90);
    } else if (circuitType === 'parallel') {
      const totalR = (resistance * resistance2) / (resistance + resistance2);
      ctx.fillText(`총 저항: ${totalR.toFixed(1)}Ω`, 20, 90);
    } else if (circuitType === 'complex') {
      const parallelR = (resistance * resistance2) / (resistance + resistance2);
      const totalR = parallelR + resistance3;
      ctx.fillText(`병렬 저항: ${parallelR.toFixed(1)}Ω`, 20, 90);
      ctx.fillText(`총 저항: ${totalR.toFixed(1)}Ω`, 20, 110);
    }
    
    const yOffset = circuitType === 'complex' ? 20 : 0;
    ctx.fillText(`전력(P): ${power.toFixed(2)}W`, 20, 110 + yOffset);
    
    let circuitLabel = '';
    if (circuitType === 'series') circuitLabel = '직렬';
    else if (circuitType === 'parallel') circuitLabel = '병렬';
    else if (circuitType === 'complex') circuitLabel = '복합';
    
    ctx.fillText(`회로 유형: ${circuitLabel}`, 20, 130 + yOffset);
    ctx.fillText(`옴의 법칙: V = I × R`, 20, 150 + yOffset);
  };

  return (
    <MainLayout title="전압, 전류, 저항 시뮬레이터">
      <div className="electric-circuit-page">
        <div className="controls">
        <div className="control-group">
          <label>회로 유형</label>
          <select 
            value={circuitType} 
            onChange={(e) => setCircuitType(e.target.value as 'series' | 'parallel' | 'complex')}
          >
            <option value="series">직렬 회로</option>
            <option value="parallel">병렬 회로</option>
            <option value="complex">복합 회로</option>
          </select>
        </div>

        <div className="control-group">
          <label>전압: {voltage}V</label>
          <input
            type="range"
            min="1"
            max="20"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>저항1: {resistance}Ω</label>
          <input
            type="range"
            min="1"
            max="20"
            value={resistance}
            onChange={(e) => setResistance(Number(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>저항2: {resistance2}Ω</label>
          <input
            type="range"
            min="1"
            max="20"
            value={resistance2}
            onChange={(e) => setResistance2(Number(e.target.value))}
          />
        </div>

        {circuitType === 'complex' && (
          <div className="control-group">
            <label>저항3: {resistance3}Ω</label>
            <input
              type="range"
              min="1"
              max="20"
              value={resistance3}
              onChange={(e) => setResistance3(Number(e.target.value))}
            />
          </div>
        )}

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showElectrons}
              onChange={(e) => setShowElectrons(e.target.checked)}
            />
            전자 흐름 표시
          </label>
        </div>

        <button 
          className={`simulate-button ${isRunning ? 'running' : ''}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '전원 OFF' : '전원 ON'}
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
        <h3>옴의 법칙과 전기 회로</h3>
        <div className="explanation-content">
          <div className="explanation-section">
            <h4>옴의 법칙 (Ohm's Law)</h4>
            <p><strong>V = I × R</strong></p>
            <p>전압(V)은 전류(I)와 저항(R)의 곱과 같습니다.</p>
            <ul>
              <li>전압(V): 볼트(V) 단위</li>
              <li>전류(I): 암페어(A) 단위</li>
              <li>저항(R): 옴(Ω) 단위</li>
            </ul>
          </div>
          
          <div className="explanation-section">
            <h4>직렬 회로</h4>
            <p>저항들이 일렬로 연결된 회로입니다.</p>
            <ul>
              <li>총 저항 = R1 + R2 + R3 + ...</li>
              <li>전류는 모든 저항에서 동일</li>
              <li>전압은 저항에 비례하여 분배</li>
            </ul>
          </div>
          
          <div className="explanation-section">
            <h4>병렬 회로</h4>
            <p>저항들이 병렬로 연결된 회로입니다.</p>
            <ul>
              <li>1/총저항 = 1/R1 + 1/R2 + 1/R3 + ...</li>
              <li>전압은 모든 저항에서 동일</li>
              <li>전류는 저항에 반비례하여 분배</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .electric-circuit-page {
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
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .simulate-button:hover {
          background: #059669;
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
          margin-bottom: 10px;
        }

        .explanation-section ul {
          color: #374151;
          line-height: 1.6;
          margin-left: 20px;
        }

        .explanation-section li {
          margin-bottom: 5px;
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