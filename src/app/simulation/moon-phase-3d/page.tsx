"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import MainLayout from "@/components/MainLayout";

export default function MoonPhase3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  
  // 상태 관리
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showSunlight, setShowSunlight] = useState(true);
  const [cameraMode, setCameraMode] = useState<'free' | 'earth' | 'moon'>('free');
  const [manualMode, setManualMode] = useState(false);
  const [moonAngle, setMoonAngle] = useState(0);
  const [cameraRotationX, setCameraRotationX] = useState(0);
  const [cameraRotationY, setCameraRotationY] = useState(0);
  const [cameraDistance, setCameraDistance] = useState(200);

  useEffect(() => {
    if (!mountRef.current) return;

    // 씬, 카메라, 렌더러 생성
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000011");
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    camera.position.set(0, 100, 200);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // 조명 설정
    const ambient = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambient);
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(500, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // 태양 (자체 발광)
    const sunGeo = new THREE.SphereGeometry(30, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ 
      color: 0xffe066
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(400, 0, 0);
    sun.castShadow = true;
    scene.add(sun);

    // 지구 (텍스처 없이 색상으로 대륙/바다 표현)
    const earthGeo = new THREE.SphereGeometry(15, 32, 32);
    const earthMat = new THREE.MeshPhongMaterial({ 
      color: 0x3399ff,
      shininess: 30
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(0, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);

    // 달
    const moonGeo = new THREE.SphereGeometry(6, 32, 32);
    const moonMat = new THREE.MeshPhongMaterial({ 
      color: 0xf0f0f0,
      shininess: 10
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(60, 0, 0);
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);

    // 궤도 표시 (선으로)
    if (showOrbits) {
      const moonOrbitGeometry = new THREE.BufferGeometry();
      const moonOrbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        moonOrbitPoints.push(
          new THREE.Vector3(60 * Math.cos(angle), 0, 60 * Math.sin(angle))
        );
      }
      moonOrbitGeometry.setFromPoints(moonOrbitPoints);
      const moonOrbitMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
      const moonOrbitLine = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
      scene.add(moonOrbitLine);
    }

    // 햇빛 방향 표시 (선으로)
    if (showSunlight) {
      const sunlightGeometry = new THREE.BufferGeometry();
      const sunlightPoints = [
        new THREE.Vector3(400, 0, 0),
        new THREE.Vector3(100, 0, 0)
      ];
      sunlightGeometry.setFromPoints(sunlightPoints);
      const sunlightMaterial = new THREE.LineBasicMaterial({ 
        color: 0xffff00,
        opacity: 0.5,
        transparent: true
      });
      const sunlightLine = new THREE.Line(sunlightGeometry, sunlightMaterial);
      scene.add(sunlightLine);
    }

    // 별들 (배경)
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 마우스 컨트롤 (회전 + 확대/축소)
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = cameraRotationX;
    let targetRotationY = cameraRotationY;
    let targetDistance = cameraDistance;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.01;
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomSpeed = 0.1;
      targetDistance += event.deltaY * zoomSpeed;
      // 최소/최대 거리 제한
      targetDistance = Math.max(50, Math.min(500, targetDistance));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // 애니메이션
    let currentMoonAngle = moonAngle;
    let earthRotation = 0;
    let moonRotation = 0;
    
    function animate() {
      if (isRunning && !manualMode) {
        // 자동 모드: 달 공전
        currentMoonAngle += 0.005 * speed;
        setMoonAngle(currentMoonAngle);
      }
      
      // 달 위치 업데이트 (자동 또는 수동)
      moon.position.x = 60 * Math.cos(currentMoonAngle);
      moon.position.z = 60 * Math.sin(currentMoonAngle);
      
      if (isRunning) {
        // 달 자전
        moonRotation += 0.01 * speed;
        moon.rotation.y = moonRotation;
        
        // 지구 자전
        earthRotation += 0.02 * speed;
        earth.rotation.y = earthRotation;
      }

      // 카메라 회전 + 확대/축소
      camera.position.x = targetDistance * Math.cos(targetRotationY) * Math.cos(targetRotationX);
      camera.position.y = targetDistance * Math.sin(targetRotationX);
      camera.position.z = targetDistance * Math.sin(targetRotationY) * Math.cos(targetRotationX);
      camera.lookAt(0, 0, 0);
      
      // 상태 업데이트 (애니메이션 루프에서 한 번만)
      setCameraRotationX(targetRotationX);
      setCameraRotationY(targetRotationY);
      setCameraDistance(targetDistance);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    }
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 클린업
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    
    return () => {
      cancelAnimationFrame(animationIdRef.current!);
      renderer.dispose();
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
      }, [isRunning, speed, showOrbits, showSunlight, manualMode, moonAngle]);

  return (
    <MainLayout title="달의 위상변화 3D 시뮬레이션">
      <div style={{ 
        width: "100%", 
        maxWidth: "1200px", 
        minWidth: "344px", 
        margin: "0 auto",
        padding: "20px"
      }}>
        {/* 컨트롤 패널 */}
        <div style={{
          background: "#f9fafb",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
              시뮬레이션 {isRunning ? "실행 중" : "일시정지"}
            </label>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: "10px 20px",
                background: isRunning ? "#ef4444" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              {isRunning ? "일시정지" : "시작"}
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
              속도: {speed}x
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: "150px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={showOrbits}
                onChange={(e) => setShowOrbits(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              궤도 표시
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={showSunlight}
                onChange={(e) => setShowSunlight(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              햇빛 방향
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={manualMode}
                onChange={(e) => setManualMode(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              수동 모드
            </label>
          </div>

          {manualMode && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
                달 위치: {Math.round((moonAngle * 180 / Math.PI) % 360)}°
              </label>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step={0.01}
                value={moonAngle}
                onChange={(e) => setMoonAngle(Number(e.target.value))}
                style={{ width: "150px" }}
              />
            </div>
          )}
        </div>

        {/* 3D 시뮬레이션 영역 */}
        <div 
          ref={mountRef} 
          style={{ 
            width: "100%", 
            height: "60dvh", 
            minHeight: "400px", 
            background: "#000",
            borderRadius: "12px",
            border: "2px solid #e5e7eb"
          }} 
        />

        {/* 설명 */}
        <div style={{ 
          background: "#f0f9ff", 
          padding: "20px", 
          borderRadius: "12px", 
          marginTop: "20px", 
          borderLeft: "4px solid #3b82f6" 
        }}>
                     <h3 style={{ color: "#1f2937", marginBottom: "12px" }}>3D 시뮬레이션 조작법</h3>
           <ul style={{ color: "#374151", lineHeight: "1.7" }}>
             <li><strong>마우스 드래그:</strong> 화면을 드래그하여 시점을 자유롭게 회전할 수 있습니다.</li>
             <li><strong>마우스 휠:</strong> 휠을 위아래로 스크롤하여 확대/축소할 수 있습니다.</li>
             <li><strong>수동 모드:</strong> 체크박스를 활성화하면 달을 직접 조작할 수 있습니다.</li>
             <li><strong>달 위치 조절:</strong> 수동 모드에서 슬라이더로 달의 위치를 0°~360° 범위에서 조절할 수 있습니다.</li>
             <li><strong>달의 공전:</strong> 달이 지구 주위를 공전하는 모습을 3D로 관찰할 수 있습니다.</li>
             <li><strong>자전:</strong> 지구와 달이 각각 자전하는 모습을 볼 수 있습니다.</li>
             <li><strong>햇빛 방향:</strong> 노란색 선으로 태양에서 오는 빛의 방향을 표시합니다.</li>
             <li><strong>궤도:</strong> 달의 공전 궤도를 회색 선으로 표시합니다.</li>
             <li><strong>속도 조절:</strong> 슬라이더로 시뮬레이션 속도를 조절할 수 있습니다.</li>
           </ul>
        </div>
      </div>
    </MainLayout>
  );
} 