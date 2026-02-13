"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- CUSTOM SHADERS ---

const starVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    vColor = aColor;
    
    // Twinkle effect based on time and individual phase
    float twinkle = 0.5 + 0.5 * sin(uTime * 2.0 + aPhase);
    vOpacity = twinkle;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (500.0 / -mvPosition.z); // Boosted size multiplier
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    
    // Extra soft glow effect - Boosted strength
    float strength = pow(1.0 - r * 2.0, 1.5); 
    gl_FragColor = vec4(vColor, strength * vOpacity * 1.5); // Boosted opacity multiplier
  }
`;

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv * 1.5;
    float n = noise(uv + uTime * 0.02);
    
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.8, 0.1, dist) * 0.25;
    
    // Improved Nebula Colors: Cosmic Purple & Deep Space Blue
    vec3 color1 = vec3(0.1, 0.05, 0.2); // Purple base
    vec3 color2 = vec3(0.02, 0.08, 0.15); // Deep blue base
    vec3 color3 = vec3(0.0, 0.0, 0.02); // Darkest void
    
    vec3 mixedColor = mix(color1, color2, sin(uTime * 0.15) * 0.5 + 0.5);
    vec3 finalColor = mix(mixedColor, color3, dist * 1.2);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -150]}>
      <planeGeometry args={[2000, 2000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Stars({ count = 10000 }) {
  const ref = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, sizes, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const pha = new Float32Array(count);

    const palette = [
      new THREE.Color("#ffffff"), // Pure white
      new THREE.Color("#dbeafe"), // Soft blue
      new THREE.Color("#fef3c7"), // Soft yellow
      new THREE.Color("#fff7ed"), // Warm white
      new THREE.Color("#60a5fa"), // Brighter blue
    ];

    for (let i = 0; i < count; i++) {
      const r = 200 + Math.random() * 800; // Wider range
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sz[i] = Math.random() * 4.0 + 1.2; // Significantly larger stars
      pha[i] = Math.random() * Math.PI * 2;

      const randomColor = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = randomColor.r;
      col[i * 3 + 1] = randomColor.g;
      col[i * 3 + 2] = randomColor.b;
    }
    return { positions: pos, sizes: sz, colors: col, phases: pha };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      // Very slow complex rotation
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const shootingStarVertexShader = `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aDelay;
  attribute vec3 aDirection;
  varying float vLife;

  void main() {
    float localTime = mod(uTime + aDelay, 5.0); // 5s loop
    float progress = localTime * aSpeed;
    
    // Reset and move along direction
    vec3 pos = position + aDirection * progress;
    
    // Trail effect using point size and life
    vLife = smoothstep(0.0, 0.5, localTime) * smoothstep(2.0, 0.5, localTime);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 2.0 * (1000.0 / -mvPosition.z) * vLife;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const shootingStarFragmentShader = `
  varying float vLife;
  void main() {
    float r = distance(gl_PointCoord, vec2(0.5));
    if (r > 0.5) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, vLife * (1.0 - r * 2.0));
  }
`;

function ShootingStars({ count = 20 }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, speeds, delays, directions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const del = new Float32Array(count);
    const dir = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Start randomly in a wide box
      pos[i * 3] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      pos[i * 3 + 2] = -500;

      spd[i] = 100 + Math.random() * 200;
      del[i] = Math.random() * 5.0;

      // Random diagonal downward direction
      const d = new THREE.Vector3(
        Math.random() - 0.5,
        -0.5 - Math.random() * 0.5,
        0
      ).normalize();
      dir[i * 3] = d.x;
      dir[i * 3 + 1] = d.y;
      dir[i * 3 + 2] = d.z;
    }
    return { positions: pos, speeds: spd, delays: del, directions: dir };
  }, [count]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aDelay" args={[delays, 1]} />
        <bufferAttribute attach="attributes-aDirection" args={[directions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={shootingStarVertexShader}
        fragmentShader={shootingStarFragmentShader}
        uniforms={{ uTime: { value: 0 } } as any}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function StarBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020205] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={["#020205", 10, 1000]} />
        <Nebula />
        <Stars />
        <ShootingStars />
      </Canvas>
      {/* Visual Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
  );
}
