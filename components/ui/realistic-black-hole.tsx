"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export const RealisticBlackHole = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false
        });

        const container = mountRef.current;
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- SHADER ---
        const material = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
                iMouse: { value: new THREE.Vector2(0.5, 0.5) },
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 iMouse;
        varying vec2 vUv;

        // Constants
        #define PI 3.14159265359

        // --- NOISE FUNCTIONS ---
        // 3D Noise for disk texture
        float hash(float n) { return fract(sin(n) * 43758.5453123); }
        float noise(vec3 x) {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            float n = p.x + p.y * 57.0 + 113.0 * p.z;
            return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                           mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                       mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                           mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
        }
        
        float fbm(vec3 p) {
            float f = 0.0;
            float w = 0.5;
            for(int i = 0; i < 5; i++) {
                f += w * noise(p);
                p *= 2.0;
                w *= 0.5;
            }
            return f;
        }

        // --- BLACK HOLE RENDERING ---

        void main() {
            vec2 uv = (vUv - 0.5) * iResolution / iResolution.y;
            
            // Camera Setup
            vec3 ro = vec3(0.0, 2.0, -8.0); // Camera position
            vec3 rd = normalize(vec3(uv, 1.5)); // Ray direction
            
            // Camera Rotation (Tilt)
            float tiltAngle = -0.2; // Look down slightly
            mat2 tilt = mat2(cos(tiltAngle), -sin(tiltAngle), sin(tiltAngle), cos(tiltAngle));
            ro.yz *= tilt;
            rd.yz *= tilt;

            vec3 col = vec3(0.0);
            
            // Ray Marching / Tracing Variables
            vec3 p = ro;
            vec3 dir = rd;
            
            // Black Hole Params
            float bhRadius = 1.0;     // Event Horizon Radius (Schwarzschild radius)
            float diskInner = 2.6;    // ISCO (Innermost Stable Circular Orbit) ~3Rg usually, 1.5 for rotating
            float diskOuter = 8.0;    // Disk extent
            
            float accumulatedAlpha = 0.0;
            vec3 accumulatedColor = vec3(0.0);
            
            // --- RAY MARCHING LOOP ---
            // Simulating curved space-time
            
            float stepSize = 0.1;
            const int MAX_STEPS = 100;
            
            for(int i = 0; i < MAX_STEPS; i++) {
                float r = length(p);
                
                // 1. EVENT HORIZON CHECK
                if(r < bhRadius) {
                    accumulatedColor = vec3(0.0); // Black hole core
                    accumulatedAlpha = 1.0; 
                    break; 
                }
                
                // 2. GRAVITATIONAL BENDING (Newtonian approx direction change)
                // Force ~ 1/r^2 directed to center
                // This simulates the lensing effect
                
                vec3 forceDir = normalize(-p);
                float force = 0.3 / (r * r); // Bending strength constant
                dir = normalize(dir + forceDir * force * stepSize);
                
                // 3. MOVE RAY
                vec3 prevP = p;
                p += dir * stepSize;
                
                // 4. ACCRETION DISK INTERSECTION
                // Check if we crossed the Y=0 plane
                if(prevP.y * p.y < 0.0) {
                    // Exact intersection point
                    float t = -prevP.y / dir.y; 
                    vec3 hitPos = prevP + dir * t;
                    float dist = length(hitPos);
                    
                    if(dist > diskInner && dist < diskOuter) {
                        // We hit the disk!
                        
                        // Disk Coordinates
                        float angle = atan(hitPos.z, hitPos.x);
                        float radius = dist;
                        
                        // TEXTURE / NOISE GENERATION
                        // Animated rotation based on radius (Keplerian velocity: v ~ 1/sqrt(r))
                        float speed = 5.0 * pow(radius, -1.5);
                        vec3 noisePos = vec3(angle * 3.0 + iTime * speed, radius * 2.0, iTime * 0.5);
                        float dust = fbm(noisePos);
                        
                        // Color Ramp (Temperature)
                        // Hotter inner -> White/Blue
                        // Cooler outer -> Orange/Red
                        vec3 diskCol;
                        if(radius < diskInner + 0.5) {
                             diskCol = vec3(1.0, 0.9, 0.8); // White hot
                        } else if (radius < diskInner + 2.0) {
                             diskCol = vec3(1.0, 0.6, 0.1); // Bright Orange
                        } else {
                             diskCol = vec3(0.8, 0.2, 0.05); // Reddish/Brown
                        }
                        
                        // Variations
                        diskCol += dust * 0.8;
                        
                        // DOPPLER BEAMING (Asymmetry)
                        // Approaching side (left) is brighter/bluer
                        // Receding side (right) is dimmer/redder
                        // Simple logic: dot product of disk velocity and view direction
                        // Velocity is tangent to circle. At (x,0,z), velocity dir is (-z, 0, x) (CCW)
                        vec3 velocity = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
                        float doppler = dot(velocity, normalize(ro - hitPos)); 
                        float beamInv = 1.0 + doppler * 0.6; // Beaming factor
                        
                        diskCol *= beamInv;
                        
                        // Alpha/Density falloff
                        float alpha = smoothstep(diskOuter, diskOuter - 1.0, radius) * smoothstep(diskInner, diskInner + 0.2, radius);
                        alpha *= (0.5 + 0.5 * dust); // Cloudiness
                        
                        // Add to buffer (Additive blending ideal for glowing matter)
                        accumulatedColor += diskCol * alpha * 0.8;
                        accumulatedAlpha += alpha * 0.5;
                        
                        if(accumulatedAlpha > 1.0) break;
                    }
                }
                
                // Escape condition
                if(r > 20.0) break;
            }
            
            // Background Stars
            if(accumulatedAlpha < 1.0) {
                float stars = pow(hash(dot(dir, vec3(12.3, 45.6, 78.9))), 50.0);
                accumulatedColor += vec3(stars) * (1.0 - accumulatedAlpha);
            }
            
            // Final adjustments
            // Glow / Bloom fake
            float centerDist = length(uv);
            accumulatedColor += vec3(1.0, 0.5, 0.1) * 0.01 / (centerDist * centerDist + 0.01);

            gl_FragColor = vec4(accumulatedColor, 1.0);
        }
      `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // --- ANIMATION ---
        let frameId: number;
        const animate = (time: number) => {
            material.uniforms.iTime.value = time * 0.001;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        // --- RESIZE ---
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h);
            material.uniforms.iResolution.value.set(w, h);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0 bg-black" />;
};
