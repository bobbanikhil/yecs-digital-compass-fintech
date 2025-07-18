import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  speed?: number;
  color?: string;
}

const ParticleSystem = ({ count = 1000, speed = 0.1, color = '#6366f1' }: ParticleSystemProps) => {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Color with slight variations
      const baseColor = new THREE.Color(color);
      const hue = baseColor.getHSL({ h: 0, s: 0, l: 0 }).h;
      const saturation = Math.random() * 0.3 + 0.7;
      const lightness = Math.random() * 0.3 + 0.5;
      
      baseColor.setHSL(hue, saturation, lightness);
      colors[i3] = baseColor.r;
      colors[i3 + 1] = baseColor.g;
      colors[i3 + 2] = baseColor.b;
    }
    
    return { positions, colors };
  }, [count, color]);
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

export const ParticleBackground = () => {
  return (
    <div className="particle-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ParticleSystem count={1500} speed={0.05} color="#6366f1" />
        <ParticleSystem count={800} speed={0.1} color="#8b5cf6" />
        <ParticleSystem count={400} speed={0.15} color="#06b6d4" />
      </Canvas>
    </div>
  );
};