"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Play, Pause, Volume2, VolumeX, Rocket } from "lucide-react";
import confetti from "canvas-confetti";

// Game constants
const GRAVITY = 0.05;
const THRUST_POWER = 0.15;
const ROTATION_SPEED = 0.07;
const DRAG = 0.99; // Air resistance simulation
const SHIP_SIZE = 20;

// Types
interface Vector2D {
    x: number;
    y: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number; // Frames to live
}

interface Enemy {
    id: number;
    x: number;
    y: number;
    radius: number;
    type: 'turret' | 'floater';
    health: number;
    active: boolean; // Is it on screen/active?
    lastFire: number;
}

export function SpaceBomberGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Game State
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover' | 'victory'>('idle');
    const [score, setScore] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [health, setHealth] = useState(100);
    const [level, setLevel] = useState(1);

    // Physics State Refs
    const shipPos = useRef<Vector2D>({ x: 100, y: 100 });
    const shipVel = useRef<Vector2D>({ x: 0, y: 0 });
    const shipAngle = useRef<number>(-Math.PI / 2); // Pointing up originally
    const particles = useRef<Particle[]>([]);
    const bullets = useRef<Bullet[]>([]);
    const enemyBullets = useRef<Bullet[]>([]); // New: Enemies shoot back
    const enemies = useRef<Enemy[]>([]);
    const keys = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<number>(0);

    // Camera
    const camera = useRef<Vector2D>({ x: 0, y: 0 });

    // Terrain Generation (Simple heightmap for now)
    const terrainPoints = useRef<Vector2D[]>([]);

    const initLevel = useCallback((lvl: number) => {
        // Generate Terrain
        const points: Vector2D[] = [];
        const width = 5000; // Long level
        let y = 500;

        // Floor
        points.push({ x: 0, y: 1000 }); // Bottom-left anchor
        points.push({ x: 0, y: y }); // Start point

        for (let x = 0; x < width; x += 50) {
            // Perlin-ish noise
            const noise = Math.sin(x * 0.01) * 50 + Math.sin(x * 0.05) * 20;
            y = 500 + noise;
            points.push({ x, y });
        }

        points.push({ x: width, y: 1000 }); // Bottom-right anchor
        terrainPoints.current = points;

        // Generate Enemies
        enemies.current = [];
        let enemyCount = 5 + lvl * 2;
        for (let i = 0; i < enemyCount; i++) {
            const x = 500 + Math.random() * (width - 600);
            const groundY = 500 + (Math.sin(x * 0.01) * 50 + Math.sin(x * 0.05) * 20); // Rough ground position approximation

            enemies.current.push({
                id: i,
                x: x,
                y: groundY - 30 - Math.random() * 200, // Float above ground
                radius: 15,
                type: Math.random() > 0.5 ? 'turret' : 'floater',
                health: 3,
                active: true,
                lastFire: 0
            });
        }

        // Reset Ship
        shipPos.current = { x: 100, y: 300 };
        shipVel.current = { x: 0, y: 0 };
        shipAngle.current = -Math.PI / 2;
        setFuel(100);
        setHealth(100);
        bullets.current = [];
        enemyBullets.current = [];
        particles.current = [];
    }, []);

    const createExplosion = (x: number, y: number, color: string, count: number) => {
        for (let i = 0; i < count; i++) {
            particles.current.push({
                x, y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                color,
                size: Math.random() * 3 + 1
            });
        }
    };

    // Main Game Loop
    const update = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        const dt = (time - lastTime.current) / 16.67; // Normalize to ~60fps
        lastTime.current = time;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas has size (Fallback)
        if (canvas.width === 0 || canvas.height === 0) {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth || 800;
                canvas.height = 600;
            } else {
                canvas.width = 800;
                canvas.height = 600;
            }
        }

        // --- PHYSICS UPDATE ---

        // Ship Rotation
        if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A']) shipAngle.current -= ROTATION_SPEED * dt;
        if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D']) shipAngle.current += ROTATION_SPEED * dt;

        // Ship Thrust
        const thrusting = keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'];
        if (thrusting && fuel > 0) {
            shipVel.current.x += Math.cos(shipAngle.current) * THRUST_POWER * dt;
            shipVel.current.y += Math.sin(shipAngle.current) * THRUST_POWER * dt;
            setFuel(f => Math.max(0, f - 0.1 * dt));

            // Thrust Particles
            particles.current.push({
                x: shipPos.current.x - Math.cos(shipAngle.current) * 15,
                y: shipPos.current.y - Math.sin(shipAngle.current) * 15,
                vx: (Math.random() - 0.5) + shipVel.current.x * 0.5,
                vy: (Math.random() - 0.5) + shipVel.current.y * 0.5,
                life: 10,
                maxLife: 10,
                color: '#ffaa00',
                size: 2
            });
        }

        // Gravity & Drag
        shipVel.current.y += GRAVITY * dt;
        shipVel.current.x *= DRAG;
        shipVel.current.y *= DRAG;

        // Update Position
        shipPos.current.x += shipVel.current.x * dt;
        shipPos.current.y += shipVel.current.y * dt;

        // --- COLLISION DETECTION (TERRAIN) ---
        const tPoints = terrainPoints.current;
        const segmentIndex = Math.floor(shipPos.current.x / 50) + 1; // +1 because of anchor point

        if (tPoints && tPoints.length > 0 && segmentIndex >= 0 && segmentIndex < tPoints.length - 2) {
            const p1 = tPoints[segmentIndex];
            const p2 = tPoints[segmentIndex + 1];

            if (p1 && p2) {
                // Interpolate ground height at ship X
                const t = (shipPos.current.x - p1.x) / (p2.x - p1.x);
                const groundY = p1.y + t * (p2.y - p1.y);

                if (shipPos.current.y + SHIP_SIZE > groundY) {
                    // Ground Collision
                    const speed = Math.sqrt(shipVel.current.x ** 2 + shipVel.current.y ** 2);
                    if (speed > 4) {
                        // Crash
                        createExplosion(shipPos.current.x, shipPos.current.y, 'orange', 50);
                        setHealth(0);
                        setGameState('gameover');
                    } else {
                        // Land / Bounce
                        shipPos.current.y = groundY - SHIP_SIZE;
                        shipVel.current.y *= -0.3; // Bounce
                        shipVel.current.x *= 0.8; // Friction

                        // Slightly damage if bumpy landing
                        if (speed > 2) setHealth(h => Math.max(0, h - 5));
                    }
                }
            }
        }

        // Ceiling / sky collision
        if (shipPos.current.y < -500) {
            shipPos.current.y = -500;
            shipVel.current.y = 0;
        }


        // --- BULLETS ---
        if (keys.current[' '] && !keys.current['fired']) {
            bullets.current.push({
                x: shipPos.current.x + Math.cos(shipAngle.current) * 20,
                y: shipPos.current.y + Math.sin(shipAngle.current) * 20,
                vx: shipVel.current.x + Math.cos(shipAngle.current) * 15,
                vy: shipVel.current.y + Math.sin(shipAngle.current) * 15,
                life: 60
            });
            keys.current['fired'] = true; // Prevent rapid fire, require release
        }
        if (!keys.current[' ']) keys.current['fired'] = false;

        bullets.current.forEach(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.life -= dt;
        });
        bullets.current = bullets.current.filter(b => b.life > 0);


        // --- ENEMIES ---
        enemies.current.forEach(enemy => {
            if (!enemy.active) return;

            // Simple AI: Turrets shoot if player is close
            const dx = shipPos.current.x - enemy.x;
            const dy = shipPos.current.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 600 && Math.random() < 0.01) {
                // Shoot at player (Simple leading)
                const angle = Math.atan2(dy, dx);
                enemyBullets.current.push({
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(angle) * 5,
                    vy: Math.sin(angle) * 5,
                    life: 100
                });
            }

            // Check collision with Player Bullets
            bullets.current.forEach((b, bIdx) => {
                const bdx = b.x - enemy.x;
                const bdy = b.y - enemy.y;
                if (Math.sqrt(bdx * bdx + bdy * bdy) < enemy.radius + 5) {
                    // Hit enemy
                    enemy.health--;
                    b.life = 0; // Destroy bullet
                    createExplosion(enemy.x, enemy.y, '#aa00ff', 5);
                    if (enemy.health <= 0) {
                        enemy.active = false;
                        setScore(s => s + 100);
                        createExplosion(enemy.x, enemy.y, '#00ff88', 30);

                        // Victory Check
                        if (enemies.current.filter(e => e.active).length === 0) {
                            confetti({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 }
                            });
                            setGameState('victory');
                        }
                    }
                }
            });
        });

        // --- ENEMY BULLETS ---
        enemyBullets.current.forEach(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.life -= dt;

            // Hit player?
            const dx = b.x - shipPos.current.x;
            const dy = b.y - shipPos.current.y;
            if (Math.sqrt(dx * dx + dy * dy) < SHIP_SIZE) {
                setHealth(h => Math.max(0, h - 10));
                b.life = 0;
                createExplosion(shipPos.current.x, shipPos.current.y, 'red', 5);
                if (health <= 0) setGameState('gameover');
            }
        });
        enemyBullets.current = enemyBullets.current.filter(b => b.life > 0);


        // --- PARTICLES ---
        particles.current.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            p.vx *= 0.95;
            p.vy *= 0.95;
        });
        particles.current = particles.current.filter(p => p.life > 0);


        // --- CAMERA ---
        // Smoothly follow ship
        const targetCamX = shipPos.current.x - canvas.width / 2;
        const targetCamY = shipPos.current.y - canvas.height / 2;

        if (!isNaN(targetCamX) && !isNaN(targetCamY)) {
            camera.current.x += (targetCamX - camera.current.x) * 0.1;
            camera.current.y += (targetCamY - camera.current.y) * 0.1;
        }

        // --- RENDER ---
        ctx.fillStyle = '#0f0f15';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(-camera.current.x, -camera.current.y);

        // Draw Background Grid
        ctx.strokeStyle = '#1e1e2f';
        ctx.lineWidth = 1;
        const gridSize = 100;

        const offsetX = Math.floor(camera.current.x / gridSize) * gridSize;
        const offsetY = Math.floor(camera.current.y / gridSize) * gridSize;

        ctx.beginPath();
        for (let gx = offsetX; gx < offsetX + canvas.width + gridSize; gx += gridSize) {
            ctx.moveTo(gx, offsetY - gridSize);
            ctx.lineTo(gx, offsetY + canvas.height + gridSize);
        }
        for (let gy = offsetY; gy < offsetY + canvas.height + gridSize; gy += gridSize) {
            ctx.moveTo(offsetX - gridSize, gy);
            ctx.lineTo(offsetX + canvas.width + gridSize, gy);
        }
        ctx.stroke();


        // Draw Terrain
        ctx.fillStyle = '#2c2c3e';
        ctx.strokeStyle = '#6c5ce7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (tPoints.length > 0) {
            ctx.moveTo(tPoints[0].x, tPoints[0].y);
            for (let i = 1; i < tPoints.length; i++) {
                ctx.lineTo(tPoints[i].x, tPoints[i].y);
            }
        }
        ctx.fill();
        ctx.stroke();

        // Draw Player Ship
        if (health > 0) {
            ctx.save();
            ctx.translate(shipPos.current.x, shipPos.current.y);
            ctx.rotate(shipAngle.current + Math.PI / 2);

            ctx.strokeStyle = '#00d2d3';
            ctx.lineWidth = 2;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.moveTo(0, -15);
            ctx.lineTo(10, 10);
            ctx.lineTo(0, 5);
            ctx.lineTo(-10, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#54a0ff';
            ctx.beginPath();
            ctx.arc(0, -2, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        // Draw Bullets
        ctx.fillStyle = '#ff9ff3';
        bullets.current.forEach(b => {
            ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
        });

        // Draw Enemy Bullets
        ctx.fillStyle = '#ff4757';
        enemyBullets.current.forEach(b => {
            ctx.beginPath();
            ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw Enemies
        enemies.current.forEach(e => {
            if (!e.active) return;
            ctx.fillStyle = e.type === 'turret' ? '#ff6b6b' : '#feca57';
            ctx.beginPath();
            if (e.type === 'turret') {
                ctx.rect(e.x - 10, e.y - 10, 20, 20);
            } else {
                ctx.moveTo(e.x, e.y - 15);
                ctx.lineTo(e.x + 15, e.y);
                ctx.lineTo(e.x, e.y + 15);
                ctx.lineTo(e.x - 15, e.y);
            }
            ctx.fill();

            // Health bar
            ctx.fillStyle = 'red';
            ctx.fillRect(e.x - 15, e.y - 25, 30, 4);
            ctx.fillStyle = 'green';
            ctx.fillRect(e.x - 15, e.y - 25, 30 * (e.health / 3), 4);
        });

        // Draw Particles
        particles.current.forEach(p => {
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.restore();

        animationFrameId.current = requestAnimationFrame(() => update(performance.now()));
    }, [gameState]);

    // Handle Input
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            keys.current[e.key] = true;
        };
        const handleUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    // Handle Start
    const startGame = () => {
        console.log("Starting game...");
        initLevel(level);
        setGameState('playing');
        lastTime.current = performance.now();
        setTimeout(() => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
            update(performance.now());
        }, 50);
    };

    // On Mount Resize
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current && containerRef.current) {
                canvasRef.current.width = containerRef.current.clientWidth || 800;
                canvasRef.current.height = 600;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        // Initial setup for background
        initLevel(1);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId.current);
        }
    }, [initLevel]);


    return (
        <Card className="p-4 border-2 border-primary/20 bg-background overflow-hidden relative" ref={containerRef}>

            {/* HUD */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Skor</span>
                        <span className="text-xl font-mono font-bold text-primary">{score}</span>
                    </div>
                    <div className="flex flex-col w-32">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Yakıt</span>
                        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden border border-border">
                            <div className="h-full bg-orange-500 transition-all duration-100" style={{ width: `${fuel}%` }} />
                        </div>
                    </div>
                    <div className="flex flex-col w-32">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Zırh</span>
                        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden border border-border">
                            <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${health}%` }} />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xs text-muted-foreground">GRAVITY WARRIOR</div>
                    <div className="text-xs text-primary font-bold">LEVEL {level}</div>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="w-full bg-black rounded-lg border border-border shadow-inner focus:outline-none"
                style={{ height: '600px' }}
                width={800} // Explicit fallback
                height={600}
                tabIndex={0} // Ensure it can receive focus
            />

            {/* Overlays */}
            {gameState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
                    <Rocket className="w-16 h-16 text-primary mb-4 animate-bounce" />
                    <h1 className="text-4xl font-black text-white mb-2">GRAVITY WARRIOR</h1>
                    <p className="text-gray-300 mb-8 max-w-md">
                        Gerçek fizik kuralları geçerlidir.<br />
                        <span className="text-primary font-bold">W / YUKARI</span> ile motorları çalıştır.<br />
                        <span className="text-primary font-bold">A / D / YÖN</span> ile gemiyi döndür.<br />
                        <span className="text-primary font-bold">SPACE</span> ile ateş et.
                    </p>
                    <Button size="lg" className="text-lg font-bold brutalist-button" onClick={startGame}>
                        <Play className="mr-2 w-5 h-5" /> GÖREVİ BAŞLAT
                    </Button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 z-10 p-6 text-center">
                    <h2 className="text-5xl font-black text-white mb-4">GÖREV BAŞARISIZ</h2>
                    <p className="text-white mb-8 text-xl">Aracı parçaladın!</p>
                    <Button size="lg" variant="destructive" className="text-lg font-bold" onClick={startGame}>
                        <RotateCcw className="mr-2 w-5 h-5" /> TEKRAR DENE
                    </Button>
                </div>
            )}

            {gameState === 'victory' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/90 z-10 p-6 text-center">
                    <div className="mb-4 text-6xl">🏆</div>
                    <h2 className="text-4xl font-black text-white mb-2">BÖLGE TEMİZLENDİ!</h2>
                    <p className="text-white/80 mb-6">Mükemmel uçuş, pilot.</p>
                    <div className="flex gap-4">
                        <Button size="lg" className="bg-white text-green-900 hover:bg-gray-200 font-bold" onClick={() => { setLevel(l => l + 1); startGame(); }}>
                            SONRAKİ SEVİYE
                        </Button>
                    </div>
                </div>
            )}

            {/* Mobile Controls Hint */}
            <div className="absolute bottom-4 left-4 text-white/30 text-xs pointer-events-none md:block hidden">
                KLAVYE KONTROLLERİ AKTİF
            </div>
        </Card>
    );
}
