"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { P5Wrapper } from "./P5Wrapper";
import p5 from "p5";

interface ParticleCollisionSimProps {
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    radius: number;
    color: string;
    id: number;
}

export function ParticleCollisionSim({ className = "" }: ParticleCollisionSimProps) {
    const [particleCount, setParticleCount] = useState(6);
    const [showMomentum, setShowMomentum] = useState(true);
    const [showTrails, setShowTrails] = useState(true);
    const [elasticity, setElasticity] = useState(1.0);

    const [stats, setStats] = useState({ momentum: { x: 0, y: 0 }, ke: 0, collisions: 0 });
    const statsRef = useRef(stats);
    statsRef.current = stats;

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let particles: Particle[] = [];
        let trails: Map<number, { x: number; y: number }[]> = new Map();
        let collisionCount = 0;
        let lastCollisionTime = 0;

        const colors = ['#FFC800', '#3B82F6', '#EF4444', '#22C55E', '#A855F7', '#F97316', '#EC4899', '#14B8A6'];

        const createParticles = () => {
            particles = [];
            trails.clear();
            collisionCount = 0;

            for (let i = 0; i < particleCount; i++) {
                const radius = 20 + Math.random() * 20;
                const particle: Particle = {
                    x: p.random(radius + 50, p.width - radius - 50),
                    y: p.random(radius + 50, p.height - radius - 50),
                    vx: p.random(-4, 4),
                    vy: p.random(-4, 4),
                    mass: radius * 0.5,
                    radius: radius,
                    color: colors[i % colors.length],
                    id: i
                };
                particles.push(particle);
                trails.set(i, []);
            }
        };

        p.setup = () => {
            const canvas = p.createCanvas(parentRef.clientWidth, 400);
            canvas.parent(parentRef);
            createParticles();
        };

        const checkCollision = (p1: Particle, p2: Particle): boolean => {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy) < p1.radius + p2.radius;
        };

        const resolveCollision = (p1: Particle, p2: Particle) => {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return;

            const nx = dx / dist;
            const ny = dy / dist;

            const dvx = p1.vx - p2.vx;
            const dvy = p1.vy - p2.vy;
            const dvn = dvx * nx + dvy * ny;

            if (dvn > 0) return;

            const j = -(1 + elasticity) * dvn / (1 / p1.mass + 1 / p2.mass);

            p1.vx += (j / p1.mass) * nx;
            p1.vy += (j / p1.mass) * ny;
            p2.vx -= (j / p2.mass) * nx;
            p2.vy -= (j / p2.mass) * ny;

            const overlap = (p1.radius + p2.radius - dist) / 2 + 1;
            p1.x -= overlap * nx;
            p1.y -= overlap * ny;
            p2.x += overlap * nx;
            p2.y += overlap * ny;

            if (p.millis() - lastCollisionTime > 100) {
                collisionCount++;
                lastCollisionTime = p.millis();
            }
        };

        p.draw = () => {
            p.background(15, 15, 20);

            // Grid
            p.stroke(30, 30, 40);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 50) p.line(x, 0, x, p.height);
            for (let y = 0; y < p.height; y += 50) p.line(0, y, p.width, y);

            // Border box
            p.noFill();
            p.stroke(60, 60, 80);
            p.strokeWeight(4);
            p.rect(2, 2, p.width - 4, p.height - 4);

            // Calculate totals
            let totalMomentumX = 0;
            let totalMomentumY = 0;
            let totalKE = 0;

            // Update particles
            for (const particle of particles) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wall collisions
                if (particle.x - particle.radius < 0) {
                    particle.x = particle.radius;
                    particle.vx *= -elasticity;
                }
                if (particle.x + particle.radius > p.width) {
                    particle.x = p.width - particle.radius;
                    particle.vx *= -elasticity;
                }
                if (particle.y - particle.radius < 0) {
                    particle.y = particle.radius;
                    particle.vy *= -elasticity;
                }
                if (particle.y + particle.radius > p.height) {
                    particle.y = p.height - particle.radius;
                    particle.vy *= -elasticity;
                }

                // Add to trail
                if (showTrails) {
                    const trail = trails.get(particle.id) || [];
                    trail.push({ x: particle.x, y: particle.y });
                    if (trail.length > 30) trail.shift();
                    trails.set(particle.id, trail);
                }

                // Calculate momentum and KE
                totalMomentumX += particle.mass * particle.vx;
                totalMomentumY += particle.mass * particle.vy;
                const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
                totalKE += 0.5 * particle.mass * speed ** 2;
            }

            // Particle-particle collisions
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    if (checkCollision(particles[i], particles[j])) {
                        resolveCollision(particles[i], particles[j]);
                    }
                }
            }

            // Draw trails
            if (showTrails) {
                for (const particle of particles) {
                    const trail = trails.get(particle.id) || [];
                    if (trail.length > 1) {
                        p.noFill();
                        for (let i = 1; i < trail.length; i++) {
                            const alpha = (i / trail.length) * 100;
                            p.stroke(particle.color + Math.floor(alpha).toString(16).padStart(2, '0'));
                            p.strokeWeight(particle.radius * 0.3 * (i / trail.length));
                            p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
                        }
                    }
                }
            }

            // Draw particles
            for (const particle of particles) {
                // Shadow
                p.noStroke();
                p.fill(0, 0, 0, 50);
                p.ellipse(particle.x + 4, particle.y + 4, particle.radius * 2, particle.radius * 2);

                // Particle with gradient
                const gradient = p.drawingContext as CanvasRenderingContext2D;
                const grad = gradient.createRadialGradient(
                    particle.x - particle.radius / 3, particle.y - particle.radius / 3, 0,
                    particle.x, particle.y, particle.radius
                );

                const baseColor = p.color(particle.color);
                grad.addColorStop(0, `rgba(255,255,255,0.8)`);
                grad.addColorStop(0.3, particle.color);
                grad.addColorStop(1, p.lerpColor(baseColor, p.color(0), 0.3).toString());

                gradient.fillStyle = grad;
                p.stroke(0);
                p.strokeWeight(2);
                p.ellipse(particle.x, particle.y, particle.radius * 2, particle.radius * 2);

                // Mass label
                p.fill(255);
                p.noStroke();
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(10);
                p.text(`${particle.mass.toFixed(0)}`, particle.x, particle.y);

                // Velocity vector
                if (showMomentum) {
                    const velScale = 8;
                    p.stroke(255, 255, 255, 180);
                    p.strokeWeight(2);
                    p.line(particle.x, particle.y,
                        particle.x + particle.vx * velScale,
                        particle.y + particle.vy * velScale);

                    // Arrow head
                    p.push();
                    p.translate(particle.x + particle.vx * velScale, particle.y + particle.vy * velScale);
                    p.rotate(Math.atan2(particle.vy, particle.vx));
                    p.fill(255);
                    p.noStroke();
                    p.triangle(0, 0, -6, -3, -6, 3);
                    p.pop();
                }
            }

            p.textAlign(p.LEFT, p.BASELINE);

            // Info panel
            p.fill(20, 20, 30, 240);
            p.stroke(60, 60, 80);
            p.strokeWeight(2);
            p.rect(15, 15, 280, 130, 8);

            p.fill(247, 151, 22);
            p.noStroke();
            p.textSize(14);
            p.text('⚛️ MOMENTUM KORUNUMU', 25, 38);

            p.textSize(11);
            p.fill(255);
            p.text(`Σp = m₁v₁ + m₂v₂ + ...`, 25, 58);

            p.fill(100, 200, 255);
            p.text(`Σpₓ = ${totalMomentumX.toFixed(1)} kg·m/s`, 25, 80);
            p.text(`Σpᵧ = ${totalMomentumY.toFixed(1)} kg·m/s`, 25, 98);

            p.fill(100, 255, 150);
            p.text(`KE = Σ½mv² = ${totalKE.toFixed(1)} J`, 25, 118);

            p.fill(255, 200, 0);
            p.text(`Çarpışma sayısı: ${collisionCount}`, 25, 138);

            // Momentum conservation indicator
            const totalMomentum = Math.sqrt(totalMomentumX ** 2 + totalMomentumY ** 2);
            p.fill(totalMomentum < 100 ? p.color(100, 255, 100) : p.color(255, 200, 100));
            p.textSize(10);
            p.text(`|Σp| = ${totalMomentum.toFixed(1)} (korunmalı!)`, 150, 80);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                createParticles();
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
        };
    }, [particleCount, showMomentum, showTrails, elasticity]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 space-y-4">
                <div className="bg-neutral-900 border-2 border-orange-400/30 rounded-lg p-3">
                    <p className="text-orange-400 font-mono text-sm font-bold mb-2">⚛️ Korunum Yasaları</p>
                    <div className="text-xs font-mono space-y-1">
                        <p className="text-white">Σp<sub>önce</sub> = Σp<sub>sonra</sub> (Momentum)</p>
                        <p className="text-neutral-400">Esnek çarpışma: KE korunur</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Parçacık Sayısı</span>
                            <span className="text-orange-400">{particleCount}</span>
                        </div>
                        <input
                            type="range" min="2" max="12" value={particleCount}
                            onChange={(e) => setParticleCount(Number(e.target.value))}
                            className="w-full accent-orange-400"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between text-white text-xs font-bold uppercase mb-1">
                            <span>Esneklik Katsayısı (e)</span>
                            <span className="text-orange-400">{elasticity.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="0.5" max="1" step="0.05" value={elasticity}
                            onChange={(e) => setElasticity(Number(e.target.value))}
                            className="w-full accent-orange-400"
                        />
                        <div className="flex justify-between text-neutral-500 text-[10px] mt-1">
                            <span>Esnek olmayan (0.5)</span>
                            <span>Tam esnek (1.0)</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showMomentum} onChange={(e) => setShowMomentum(e.target.checked)} className="accent-yellow-500" />
                        Hız Vektörleri
                    </label>
                    <label className="flex items-center gap-2 text-white text-xs font-bold cursor-pointer">
                        <input type="checkbox" checked={showTrails} onChange={(e) => setShowTrails(e.target.checked)} className="accent-purple-500" />
                        İzler
                    </label>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                        💡 <strong>Gözlem:</strong> Toplam momentum (Σp) hep sabit kalır! Esnek çarpışmada kinetik enerji de korunur.
                        e&lt;1 ise enerji kaybı olur.
                    </p>
                </div>
            </div>
        </div>
    );
}
