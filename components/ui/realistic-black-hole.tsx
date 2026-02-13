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
                iCameraZoom: { value: 1.0 },
                iVerticalOffset: { value: 0.0 },
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
        uniform float iCameraZoom;
        uniform float iVerticalOffset;
        varying vec2 vUv;

        // Constants
        #define PI 3.14159265359

        // --- NOISE FUNCTIONS ---
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
            
            // Apply Vertical Offset
            uv.y -= iVerticalOffset; 
            
            // Zoom adjustment
            uv *= iCameraZoom;
            
            // Camera Setup
            vec3 ro = vec3(0.0, 1.5, -8.0);
            vec3 rd = normalize(vec3(uv, 1.5));
            
            float tiltAngle = -0.15;
            mat2 tilt = mat2(cos(tiltAngle), -sin(tiltAngle), sin(tiltAngle), cos(tiltAngle));
            ro.yz *= tilt;
            rd.yz *= tilt;

            // --- RAY MARCHING SETUP ---
            vec3 p = ro;
            vec3 dir = rd;
            
            float bhRadius = 1.0; 
            float diskInner = 2.6; 
            float diskOuter = 9.0;
            
            float accumulatedAlpha = 0.0;
            vec3 accumulatedColor = vec3(0.0);
            
            float stepSize = 0.1;
            const int MAX_STEPS = 100;
            
            for(int i = 0; i < MAX_STEPS; i++) {
                float r = length(p);
                
                // EVENT HORIZON
                if(r < bhRadius) {
                    accumulatedColor = vec3(0.0);
                    accumulatedAlpha = 1.0; 
                    break; 
                }
                
                // GRAVITATIONAL BENDING
                vec3 forceDir = normalize(-p);
                float force = 0.45 / (r * r);
                dir = normalize(dir + forceDir * force * stepSize);
                
                // MOVE RAY
                vec3 prevP = p;
                p += dir * stepSize;
                
                // DISK INTERSECTION
                if(prevP.y * p.y < 0.0) {
                    float t = -prevP.y / dir.y; 
                    vec3 hitPos = prevP + dir * t;
                    float dist = length(hitPos);
                    
                    if(dist > diskInner && dist < diskOuter) {
                        float angle = atan(hitPos.z, hitPos.x);
                        float radius = dist;
                        
                        // Texture
                        float speed = 6.0 * pow(radius, -1.5);
                        vec3 noisePos = vec3(angle * 3.0 + iTime * speed * 0.5, radius * 1.5, iTime * 0.3);
                        float dust = fbm(noisePos);
                        
                        // Color Ramp (White-Hot -> Salmon -> Red)
                        vec3 diskCol;
                        float nRadius = (radius - diskInner) / (diskOuter - diskInner);
                        
                        if(nRadius < 0.15) {
                             diskCol = mix(vec3(1.0), vec3(1.0, 0.9, 0.8), nRadius * 6.0);
                        } else if (nRadius < 0.4) {
                             diskCol = mix(vec3(1.0, 0.9, 0.8), vec3(1.0, 0.6, 0.4), (nRadius - 0.15) * 4.0);
                        } else {
                             diskCol = mix(vec3(1.0, 0.6, 0.4), vec3(0.4, 0.05, 0.02), (nRadius - 0.4) * 1.6);
                        }
                        
                        diskCol += dust * 0.4;
                        
                        // Doppler
                        vec3 velocity = normalize(vec3(-hitPos.z, 0.0, hitPos.x));
                        float doppler = dot(velocity, normalize(ro - hitPos)); 
                        float beamInv = 1.0 + doppler * 0.5;
                        diskCol *= beamInv;
                        
                        // Alpha
                        float alpha = smoothstep(diskOuter, diskOuter - 2.0, radius) * smoothstep(diskInner, diskInner + 0.5, radius);
                        alpha *= (0.4 + 0.6 * dust);
                        
                        accumulatedColor += diskCol * alpha * 0.6;
                        accumulatedAlpha += alpha * 0.4;
                        
                        if(accumulatedAlpha > 1.0) break;
                    }
                }
                
                if(r > 25.0) break;
            }
            
            // Stars
            if(accumulatedAlpha < 1.0) {
                float stars = pow(hash(dot(dir, vec3(12.3, 45.6, 78.9))), 80.0) * 0.8;
                accumulatedColor += vec3(stars) * (1.0 - accumulatedAlpha);
            }
            
            // Final Glow
            float centerDist = length(uv);
            accumulatedColor += vec3(1.0, 0.8, 0.6) * 0.005 / (centerDist * centerDist + 0.001);
            accumulatedColor += vec3(1.0, 0.9, 0.8) * 0.01 / (centerDist * centerDist * centerDist + 0.01);

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

            // --- RESPONSIVE LOGIC (REFINED v10) ---
            const aspect = w / h;

            if (aspect < 1.0) { // PORTRAIT (Mobile)
                // v10: "Shrink Completely".
                // Zoom Out factor increased to 1.5. This will make the Black Hole much smaller.

                material.uniforms.iCameraZoom.value = (1.0 / aspect) * 1.5;

                // Vertical Offset: 0.25
                // Centered nicely above the card with the new size.
                material.uniforms.iVerticalOffset.value = 0.25;

            } else { // LANDSCAPE (Desktop)
                material.uniforms.iCameraZoom.value = 0.9;
                material.uniforms.iVerticalOffset.value = 0.0;
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            container.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 z-0 bg-black" />;
};
