"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function Stars({ count = 10000 }) {
  const ref = useRef<THREE.Points>(null!);
  
  // Create stars positions and randomness
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const pha = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Sphere distribution for depth
      const r = 500 + Math.random() * 500;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      pha[i] = Math.random() * Math.PI * 2;
    }
    return [pos, pha];
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    // Slow rotation
    ref.current.rotation.x -= 0.0001;
    ref.current.rotation.y -= 0.0001;
    
    // Shimmer effect (opacity/size can be handled in fragment shader if custom, 
    // but for simple Points we can just rotate)
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={1.5}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export function StarBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={["#000000"]} />
        <Stars />
        {/* Subtle fog for depth */}
        <fog attach="fog" args={["#000000", 1, 1500]} />
      </Canvas>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#000000]/40 backdrop-blur-[1px]" />
    </div>
  );
}
