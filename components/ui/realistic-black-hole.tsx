"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface RealisticBlackHoleProps {
    variant?: "fullscreen" | "contained";
}

export const RealisticBlackHole: React.FC<RealisticBlackHoleProps> = ({ variant = "fullscreen" }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: true, // Enable antialias for smaller contained view
            stencil: false,
            depth: false,
            alpha: true // Enable alpha for transparency
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
                iMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Normalized mouse position
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
        uniform vec2 iMouse;
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
            
            // Mouse Interaction: Subtle Parallax
            float mouseX = (iMouse.x - 0.5) * 2.0; // -1 to 1
            float mouseY = (iMouse.y - 0.5) * 2.0; // -1 to 1
            
            ro.x += mouseX * 2.0;
            ro.y += mouseY * 1.0;
            
            vec3 rd = normalize(vec3(uv, 1.5));
            
            float tiltAngle = -0.15 + (mouseY * 0.1); // Dynamic Tilt
            mat2 tilt = mat2(cos(tiltAngle), -sin(tiltAngle), sin(tiltAngle), cos(tiltAngle));
            ro.yz *= tilt;
            rd.yz *= tilt;
            
            // Rotate camera horizontally based on mouse X
            float rotX = -mouseX * 0.2;
            mat2 rot = mat2(cos(rotX), -sin(rotX), sin(rotX), cos(rotX));
            ro.xz *= rot;
            rd.xz *= rot;


            // --- RAY MARCHING SETUP ---
            vec3 p = ro;
            vec3 dir = rd;
            
            float bhRadius = 1.0; 
            float diskInner = 2.6; 
            float diskOuter = 5.0; // Keep compact
            
            float accumulatedAlpha = 0.0;
            vec3 accumulatedColor = vec3(0.0);
            
            float stepSize = 0.1;
            const int MAX_STEPS = 100;
            
            // Pre-calculation for star fading
            bool hitBH = false;

            for(int i = 0; i < MAX_STEPS; i++) {
                float r = length(p);
                
                // EVENT HORIZON
                if(r < bhRadius) {
                    accumulatedColor = vec3(0.0);
                    accumulatedAlpha = 1.0; 
                    hitBH = true;
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
            
            // Stars (Only if fullscreen or if alpha < 1.0)
            // In 'contained' mode, we might want a transparent background if not hitting the BH
            // But let's keep stars for now as it adds depth, or maybe remove them for clean logo look?
            // Let's keep stars internal to the BH viewport for 'contained'.
            
            if(accumulatedAlpha < 1.0) {
                float stars = pow(hash(dot(dir, vec3(12.3, 45.6, 78.9))), 80.0) * 0.8;
                accumulatedColor += vec3(stars) * (1.0 - accumulatedAlpha);
            }
            
            // Final Glow
            float centerDist = length(uv);
            accumulatedColor += vec3(1.0, 0.8, 0.6) * 0.005 / (centerDist * centerDist + 0.001);
            accumulatedColor += vec3(1.0, 0.9, 0.8) * 0.01 / (centerDist * centerDist * centerDist + 0.01);
            
            // For contained mode, we might want to mask the corners or keep it rectangular.
            // The container div will handle overflow hidden.

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

            // --- RESPONSIVE LOGIC ---
            const aspect = w / h;

            if (variant === 'contained') {
                // FIXED ZOOM for contained logo mode
                // We want it to be fully visible within the small box
                // Scale 3.5 means "zoom out" significant for small box
                material.uniforms.iCameraZoom.value = 3.5;
                material.uniforms.iVerticalOffset.value = 0.0;
            } else {
                // Fullscreen Logic (Fallback)
                if (aspect < 1.0) { // Portrait
                    material.uniforms.iCameraZoom.value = (1.0 / aspect) * 2.0;
                    material.uniforms.iVerticalOffset.value = 0.55;
                } else { // Landscape
                    material.uniforms.iCameraZoom.value = 0.9;
                    material.uniforms.iVerticalOffset.value = 0.0;
                }
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        // --- MOUSE & TOUCH INTERACTION ---
        const handleInteraction = (x: number, y: number) => {
            const normX = x / window.innerWidth;
            const normY = 1.0 - (y / window.innerHeight); // Invert Y
            material.uniforms.iMouse.value.set(normX, normY);
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleInteraction(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                // Prevent scrolling while interacting with the black hole
                // e.preventDefault(); 
                handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            cancelAnimationFrame(frameId);
            container.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, [variant]); // Re-run if variant changes

    return (
        <div
            ref={mountRef}
            className={variant === 'fullscreen' ? "fixed inset-0 z-0 bg-black" : "w-full h-full bg-black"} // contained: fills parent
        />
    );
};
