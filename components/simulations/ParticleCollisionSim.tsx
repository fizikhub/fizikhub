"use client";

import { useCallback, useState } from "react";
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
}

export function ParticleCollisionSim({ className = "" }: ParticleCollisionSimProps) {
    const [particleCount, setParticleCount] = useState(8);
    const [showMomentum, setShowMomentum] = useState(true);

    const sketch = useCallback((p: p5, parentRef: HTMLDivElement) => {
        let particles: Particle[] = [];
        const colors = ['#FFC800', '#3B82F6', '#EF4444', '#22C55E', '#A855F7', '#F97316'];

        const createParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const radius = p.random(15, 30);
                particles.push({
                    x: p.random(radius, p.width - radius),
                    y: p.random(radius, p.height - radius),
                    vx: p.random(-3, 3),
                    vy: p.random(-3, 3),
                    mass: radius,
                    radius: radius,
                    color: colors[i % colors.length]
                });
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
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < p1.radius + p2.radius;
        };

        const resolveCollision = (p1: Particle, p2: Particle) => {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist === 0) return;

            // Normal vector
            const nx = dx / dist;
            const ny = dy / dist;

            // Relative velocity
            const dvx = p1.vx - p2.vx;
            const dvy = p1.vy - p2.vy;

            // Relative velocity in collision normal
            const dvn = dvx * nx + dvy * ny;

            // Do not resolve if velocities are separating
            if (dvn > 0) return;

            // Coefficient of restitution
            const e = 0.95;

            // Impulse scalar
            const j = -(1 + e) * dvn / (1 / p1.mass + 1 / p2.mass);

            // Apply impulse
            p1.vx += (j / p1.mass) * nx;
            p1.vy += (j / p1.mass) * ny;
            p2.vx -= (j / p2.mass) * nx;
            p2.vy -= (j / p2.mass) * ny;

            // Separate particles
            const overlap = (p1.radius + p2.radius - dist) / 2;
            p1.x -= overlap * nx;
            p1.y -= overlap * ny;
            p2.x += overlap * nx;
            p2.y += overlap * ny;
        };

        p.draw = () => {
            p.background(23, 23, 23);

            // Update and draw particles
            let totalMomentumX = 0;
            let totalMomentumY = 0;
            let totalKE = 0;

            for (const particle of particles) {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Bounce off walls
                if (particle.x - particle.radius < 0) {
                    particle.x = particle.radius;
                    particle.vx *= -0.95;
                }
                if (particle.x + particle.radius > p.width) {
                    particle.x = p.width - particle.radius;
                    particle.vx *= -0.95;
                }
                if (particle.y - particle.radius < 0) {
                    particle.y = particle.radius;
                    particle.vy *= -0.95;
                }
                if (particle.y + particle.radius > p.height) {
                    particle.y = p.height - particle.radius;
                    particle.vy *= -0.95;
                }

                // Calculate momentum and KE
                totalMomentumX += particle.mass * particle.vx;
                totalMomentumY += particle.mass * particle.vy;
                const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
                totalKE += 0.5 * particle.mass * speed ** 2;
            }

            // Check collisions
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    if (checkCollision(particles[i], particles[j])) {
                        resolveCollision(particles[i], particles[j]);
                    }
                }
            }

            // Draw particles
            for (const particle of particles) {
                // Shadow
                p.noStroke();
                p.fill(0, 50);
                p.ellipse(particle.x + 3, particle.y + 3, particle.radius * 2, particle.radius * 2);

                // Main circle
                p.fill(particle.color);
                p.stroke(0);
                p.strokeWeight(3);
                p.ellipse(particle.x, particle.y, particle.radius * 2, particle.radius * 2);

                // Velocity vector
                if (showMomentum) {
                    p.stroke(255, 255, 255, 150);
                    p.strokeWeight(2);
                    p.line(particle.x, particle.y,
                        particle.x + particle.vx * 10,
                        particle.y + particle.vy * 10);
                }
            }

            // Info
            p.fill(255);
            p.noStroke();
            p.textSize(12);
            p.textFont('monospace');
            p.text(`Parçacık: ${particles.length}`, 20, 25);
            p.text(`Toplam Momentum: (${totalMomentumX.toFixed(1)}, ${totalMomentumY.toFixed(1)})`, 20, 45);
            p.text(`Kinetik Enerji: ${totalKE.toFixed(1)}`, 20, 65);
            p.text('p = mv (Momentum Korunumu)', 20, 85);
        };

        p.mousePressed = () => {
            if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                createParticles();
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(parentRef.clientWidth, 400);
            createParticles();
        };
    }, [particleCount, showMomentum]);

    return (
        <div className={className}>
            <P5Wrapper sketch={sketch} className="w-full h-[400px] rounded-none border-b-[3px] border-black" />

            <div className="p-4 bg-neutral-800 space-y-3">
                <div>
                    <label className="text-white text-xs font-bold uppercase mb-1 block">
                        Parçacık Sayısı: {particleCount}
                    </label>
                    <input
                        type="range"
                        min="2"
                        max="15"
                        value={particleCount}
                        onChange={(e) => setParticleCount(Number(e.target.value))}
                        className="w-full accent-yellow-400"
                    />
                </div>
                <label className="flex items-center gap-2 text-white text-xs font-bold uppercase cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showMomentum}
                        onChange={(e) => setShowMomentum(e.target.checked)}
                        className="accent-yellow-400"
                    />
                    Hız Vektörlerini Göster
                </label>
                <p className="text-neutral-400 text-xs">Sıfırlamak için tıklayın</p>
            </div>
        </div>
    );
}
