"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
    RotateCcw, 
    Play, 
    Rocket, 
    Volume2, 
    VolumeX, 
    Shield, 
    Zap, 
    Award, 
    Flame, 
    Activity, 
    Target, 
    Compass 
} from "lucide-react";
import confetti from "canvas-confetti";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// --- WEB AUDIO API PROCEDURAL SYNTHESIZER ---
class SoundSynth {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
    private thrusterNoise: AudioBufferSourceNode | null = null;
    private thrusterGain: GainNode | null = null;

    constructor() {}

    private init() {
        if (typeof window === 'undefined') return;
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle(state?: boolean) {
        this.enabled = state !== undefined ? state : !this.enabled;
        if (!this.enabled) {
            this.stopThruster();
        }
    }

    isEnabled() {
        return this.enabled;
    }

    playLaser() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
        
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playEnemyLaser() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.2);
        
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }

    playExplosion() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Generate noise buffer
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(10, now + 0.4);
        
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        noise.start(now);
        noise.stop(now + 0.4);
    }

    playCollect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [293.66, 369.99, 440.00, 587.33]; // D4, F#4, A4, D5 (Vibrant D Major)
        
        notes.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            
            gain.gain.setValueAtTime(0.0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
            
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.2);
        });
    }

    playHurt() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(30, now + 0.15);
        
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playWarning() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        osc.start(now);
        osc.stop(now + 0.08);
    }

    setThruster(active: boolean) {
        if (!this.enabled) {
            this.stopThruster();
            return;
        }
        this.init();
        if (!this.ctx) return;

        if (active) {
            if (!this.thrusterNoise) {
                const bufferSize = this.ctx.sampleRate * 2;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                this.thrusterNoise = this.ctx.createBufferSource();
                this.thrusterNoise.buffer = buffer;
                this.thrusterNoise.loop = true;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.value = 90;

                this.thrusterGain = this.ctx.createGain();
                this.thrusterGain.gain.setValueAtTime(0, this.ctx.currentTime);
                this.thrusterGain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);

                this.thrusterNoise.connect(filter);
                filter.connect(this.thrusterGain);
                this.thrusterGain.connect(this.ctx.destination);
                
                this.thrusterNoise.start(0);
            } else if (this.thrusterGain) {
                this.thrusterGain.gain.setTargetAtTime(0.1, this.ctx.currentTime, 0.03);
            }
        } else {
            this.stopThruster();
        }
    }

    private stopThruster() {
        if (this.thrusterGain && this.ctx) {
            this.thrusterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        }
    }

    cleanup() {
        this.stopThruster();
        if (this.thrusterNoise) {
            try {
                this.thrusterNoise.stop();
            } catch {}
            this.thrusterNoise = null;
        }
        if (this.ctx) {
            this.ctx.close();
            this.ctx = null;
        }
    }
}

// --- GAME CONFIG & INTERFACES ---
const SHIP_SIZE = 15;
const DRAG = 0.985; // Snappier momentum for easier control

interface Vector2D {
    x: number;
    y: number;
}

interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    mesh?: THREE.Mesh | THREE.Points;
}

interface Bullet {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    isEnemy: boolean;
    mesh: THREE.Mesh;
}

interface Enemy {
    id: number;
    x: number;
    y: number;
    type: 'turret' | 'floater';
    health: number;
    maxHealth: number;
    active: boolean;
    lastFire: number;
    fireCooldown: number;
    mesh: THREE.Group;
    targetAngle?: number;
}

interface FuelCrystal {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
    mesh: THREE.Mesh;
}

// Level configurations
const LEVELS = [
    {
        name: "Horizon Cavern",
        gravity: 0.045,
        thrustPower: 0.14,
        rotationSpeed: 0.065,
        enemyCount: 6,
        description: "GÖREV AYRINTISI: Nevbara keşif gemisi, kararsız X-7 sektörünün dış çeperlerinde sıkıştı. Çevredeki yerçekimi çıpalarını yok ederek güvenli çıkış portalını aktive edin. İniş yaparken zırh bütünlüğünü korumaya özen gösterin."
    },
    {
        name: "The Core Vault",
        gravity: 0.065,
        thrustPower: 0.16,
        rotationSpeed: 0.07,
        enemyCount: 10,
        description: "GÖREV AYRINTISI: Yüksek yerçekimli nükleer güvenlik mahzenine girdiniz. Güç savunma dronları aktif. Yakıt tüketimi aşırı yüksek. Düşman ünitelerini imha ederek açığa çıkan enerji kristallerini hasat etmelisiniz."
    },
    {
        name: "Oblivion Maw",
        gravity: 0.085,
        thrustPower: 0.18,
        rotationSpeed: 0.075,
        enemyCount: 15,
        description: "GÖREV AYRINTISI: Kılcal yerçekimi kuyusunun tam merkezindesiniz. Kaçış için son 15 koruyucu kuleyi yok etmelisiniz. Muazzam bir çekim kuvveti gemiyi zemine çekiyor. İtkileri sürekli canlı tutun!"
    }
];

export function SpaceBomberGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sound manager ref
    const soundRef = useRef<SoundSynth | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Game states
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover' | 'victory'>('idle');
    const [score, setScore] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [shield, setShield] = useState(100);
    const [armor, setArmor] = useState(100);
    const [level, setLevel] = useState(1);
    
    // Telemetry and speed states for HUD
    const [speedVal, setSpeedVal] = useState(0);
    const [altitudeVal, setAltitudeVal] = useState(0);
    const [logMessages, setLogMessages] = useState<string[]>(["Sistemler Hazır.", "Uçuş Bilgisayarı Çevrimiçi."]);

    const fuelRef = useRef(100);
    const shieldRef = useRef(100);
    const armorRef = useRef(100);
    const lastHitTime = useRef(0);

    // Three.js instances
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef3D = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    // 3D Objects
    const playerShipGroup = useRef<THREE.Group | null>(null);
    const thrusterFlameMesh = useRef<THREE.Mesh | null>(null);
    const shieldBubbleMesh = useRef<THREE.Mesh | null>(null);
    const terrainMesh = useRef<THREE.Mesh | null>(null);
    const terrainWireframe = useRef<THREE.LineSegments | null>(null);
    const backgroundStars = useRef<THREE.Points | null>(null);
    const lightFollower = useRef<THREE.PointLight | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const screenShakeRef = useRef<number>(0);

    // Physics state refs
    const shipPos = useRef<Vector2D>({ x: 100, y: 350 });
    const shipVel = useRef<Vector2D>({ x: 0, y: 0 });
    const shipAngle = useRef<number>(-Math.PI / 2); // Pointing straight up initially
    const shipAngularVel = useRef<number>(0);
    
    const particles = useRef<Particle[]>([]);
    const bullets = useRef<Bullet[]>([]);
    const enemies = useRef<Enemy[]>([]);
    const crystals = useRef<FuelCrystal[]>([]);
    
    const keys = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const tickRef = useRef<(time: number) => void>(() => {});

    // Radar points
    const [radarEntities, setRadarEntities] = useState<{ x: number, y: number, type: string }[]>([]);

    // Log writer helper
    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
        setLogMessages(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 4)]);
    };

    // Toggle sound helper
    const toggleSound = () => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        if (soundRef.current) {
            soundRef.current.toggle(next);
        }
    };

    // Terrain parameters & height calculations
    const terrainWidth = 4500;
    const terrainSegments = 120;

    const getGroundHeight = (x: number): number => {
        // Simple height function used for both physics collisions and rendering
        const clampedX = Math.max(0, Math.min(terrainWidth, x));
        const base = 150;
        const hills = Math.sin(clampedX * 0.007) * 45 + Math.sin(clampedX * 0.02) * 20 + Math.cos(clampedX * 0.003) * 35;
        const obstacles = Math.sin(clampedX * 0.09) * (clampedX > 1500 && clampedX < 3000 ? 15 : 4);
        return base + hills + obstacles;
    };

    // Explosion Creator (3D Particles & Screen Shake)
    const createExplosion = useCallback((x: number, y: number, color: string, count: number, velocityScale = 1.0) => {
        if (!sceneRef.current) return;
        
        // Trigger screen shake proportional to explosion size
        screenShakeRef.current = Math.min(20, screenShakeRef.current + (count * 0.1 * velocityScale));

        const particleCount = count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const threeColor = new THREE.Color(color).multiplyScalar(2.0); // Multiply to trigger Bloom Pass

        for (let i = 0; i < particleCount; i++) {
            const px = x + (Math.random() - 0.5) * 5;
            const py = y + (Math.random() - 0.5) * 5;
            const pz = (Math.random() - 0.5) * 10;

            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = pz;

            colors[i * 3] = threeColor.r;
            colors[i * 3 + 1] = threeColor.g;
            colors[i * 3 + 2] = threeColor.b;

            // Save velocity/life info to metadata list
            particles.current.push({
                x: px,
                y: py,
                z: pz,
                vx: (Math.random() - 0.5) * 6 * velocityScale,
                vy: (Math.random() - 0.5) * 6 * velocityScale,
                vz: (Math.random() - 0.5) * 4 * velocityScale,
                life: 35 + Math.random() * 20,
                maxLife: 55,
                color,
                size: Math.random() * 2.5 + 1
            });
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 1.8,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const pPoints = new THREE.Points(geo, mat);
        sceneRef.current.add(pPoints);

        // Keep a reference to the mesh on the last particle spawned so we can update and clean it up
        if (particles.current.length > 0) {
            particles.current[particles.current.length - 1].mesh = pPoints;
        }
    }, []);

    // Set resource bars
    const setFuelLevel = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));
        fuelRef.current = clamped;
        setFuel(Math.round(clamped));
    }, []);

    const setShieldLevel = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));
        shieldRef.current = clamped;
        setShield(Math.round(clamped));
    }, []);

    const setArmorLevel = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));
        armorRef.current = clamped;
        setArmor(Math.round(clamped));
        if (clamped <= 0) {
            soundRef.current?.playExplosion();
            createExplosion(shipPos.current.x, shipPos.current.y, '#ff4a11', 120, 2.5);
            createExplosion(shipPos.current.x, shipPos.current.y, '#ffffff', 40, 1.2);
            setGameState('gameover');
            if (playerShipGroup.current) playerShipGroup.current.visible = false;
        }
    }, [createExplosion]);

    // Cleanup 3D objects helper
    const clearAllEntities = useCallback(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        // Clear bullets
        bullets.current.forEach(b => scene.remove(b.mesh));
        bullets.current = [];

        // Clear enemies
        enemies.current.forEach(e => scene.remove(e.mesh));
        enemies.current = [];

        // Clear crystals
        crystals.current.forEach(c => scene.remove(c.mesh));
        crystals.current = [];

        // Clear particle nodes remaining
        particles.current.forEach(p => {
            if (p.mesh) scene.remove(p.mesh);
        });
        particles.current = [];
    }, []);

    // Setup 3D Scene structures
    const initThreeWorld = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Clear previous renderer if any
        if (rendererRef.current) {
            rendererRef.current.dispose();
        }

        const width = canvas.clientWidth || 800;
        const height = canvas.clientHeight || 550;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2('#09090e', 0.0018);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1800);
        camera.position.set(100, 350, 220);
        cameraRef3D.current = camera;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setClearColor('#050508', 1.0);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;

        // Post-Processing
        const renderScene = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.0, 0.4, 0.85);
        // strength, radius, threshold
        
        const composer = new EffectComposer(renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);
        composerRef.current = composer;

        // Add Lights
        const amb = new THREE.AmbientLight('#181822', 0.8);
        scene.add(amb);

        const dir = new THREE.DirectionalLight('#a29bfe', 1.2);
        dir.position.set(200, 600, 300);
        scene.add(dir);

        // Flame point light following ship
        const followLight = new THREE.PointLight('#ff6b08', 0, 150);
        scene.add(followLight);
        lightFollower.current = followLight;

        // Decorative background starry planet grid
        const planetGeo = new THREE.SphereGeometry(150, 16, 16);
        const planetMat = new THREE.MeshBasicMaterial({ color: '#2d1b54', wireframe: true, transparent: true, opacity: 0.15 });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        planet.position.set(800, 600, -400);
        scene.add(planet);

        // Background Starfield
        const starCount = 800;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 3500;
            starPos[i * 3 + 1] = Math.random() * 800 + 100;
            starPos[i * 3 + 2] = -400 - Math.random() * 300;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: '#ffffff', size: 1.2, transparent: true, opacity: 0.8 });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);
        backgroundStars.current = stars;

        // Build Player Spaceship Model (Advanced 3D Geometry)
        const shipGroup = new THREE.Group();
        
        // 1. Main Fuselage
        const fuseGeo = new THREE.CylinderGeometry(2.5, 3.2, 16, 12);
        fuseGeo.rotateZ(Math.PI / 2); // Make it face along X-axis
        const fuseMat = new THREE.MeshStandardMaterial({ 
            color: '#dcdde1', 
            metalness: 0.9, 
            roughness: 0.2,
            envMapIntensity: 1.5 
        });
        const fuselage = new THREE.Mesh(fuseGeo, fuseMat);
        shipGroup.add(fuselage);

        // 2. Cockpit Nose Cone (Glassy)
        const noseGeo = new THREE.ConeGeometry(2.5, 8, 12);
        noseGeo.rotateZ(-Math.PI / 2); // Face forward (+X)
        noseGeo.translate(12, 0, 0); // Put at front
        const noseMat = new THREE.MeshPhysicalMaterial({ 
            color: '#00d2d3', 
            emissive: '#003040',
            transmission: 0.9,
            opacity: 1,
            metalness: 0.1,
            roughness: 0.05,
            ior: 1.5,
            thickness: 0.5
        });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        shipGroup.add(nose);

        // 3. Side Wings (Swept back delta wings)
        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.lineTo(-6, 8);
        wingShape.lineTo(-10, 8);
        wingShape.lineTo(-4, 0);
        wingShape.lineTo(-10, -8);
        wingShape.lineTo(-6, -8);
        wingShape.lineTo(0, 0);

        const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
        const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
        wingGeo.rotateX(Math.PI / 2);
        wingGeo.translate(-2, -0.4, 0);
        const wingMat = new THREE.MeshStandardMaterial({ color: '#2f3640', metalness: 0.8, roughness: 0.4 });
        const wings = new THREE.Mesh(wingGeo, wingMat);
        shipGroup.add(wings);
        
        // 4. Vertical Stabilizer (Tail Fin)
        const finShape = new THREE.Shape();
        finShape.moveTo(0,0);
        finShape.lineTo(-4, 6);
        finShape.lineTo(-7, 6);
        finShape.lineTo(-2, 0);
        const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.4, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 });
        finGeo.translate(-4, 2.5, -0.2);
        const finMat = new THREE.MeshStandardMaterial({ color: '#c23616', metalness: 0.6, roughness: 0.3 });
        const fin = new THREE.Mesh(finGeo, finMat);
        shipGroup.add(fin);

        // 5. Exhaust Nozzle (Engine block)
        const nozzleGeo = new THREE.CylinderGeometry(2.0, 1.4, 4.0, 12);
        nozzleGeo.rotateZ(Math.PI / 2);
        nozzleGeo.translate(-9, 0, 0);
        const nozzleMat = new THREE.MeshStandardMaterial({ color: '#192a56', metalness: 1.0, roughness: 0.2 });
        const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
        shipGroup.add(nozzle);

        // 6. Thruster Flame Cone (Dynamic Plume)
        const flameGeo = new THREE.ConeGeometry(1.6, 7, 12);
        flameGeo.rotateZ(Math.PI / 2);
        flameGeo.translate(-14.5, 0, 0);
        const flameMat = new THREE.MeshBasicMaterial({ 
            color: '#ff9f43', 
            transparent: true, 
            opacity: 0.0,
            blending: THREE.AdditiveBlending 
        });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        
        // Add inner core to flame
        const coreGeo = new THREE.ConeGeometry(0.8, 5, 8);
        coreGeo.rotateZ(Math.PI / 2);
        coreGeo.translate(-12.5, 0, 0);
        const coreMat = new THREE.MeshBasicMaterial({ color: '#feca57', transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
        const coreFlame = new THREE.Mesh(coreGeo, coreMat);
        
        flame.add(coreFlame); // attach core to outer flame so they scale together
        
        shipGroup.add(flame);
        thrusterFlameMesh.current = flame;

        // 7. Shield bubble indicator surrounding ship
        const shieldGeo = new THREE.SphereGeometry(14, 32, 32);
        const shieldMat = new THREE.MeshPhysicalMaterial({
            color: '#00d2d3',
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
            transmission: 0.9,
            roughness: 0.1,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const shieldBubble = new THREE.Mesh(shieldGeo, shieldMat);
        shipGroup.add(shieldBubble);
        shieldBubbleMesh.current = shieldBubble;

        scene.add(shipGroup);
        playerShipGroup.current = shipGroup;

        // Build Terrain Geometries
        const terrainGeo = new THREE.PlaneGeometry(terrainWidth, 320, terrainSegments, 12);
        terrainGeo.rotateX(-Math.PI / 2); // Make it horizontal

        const posAttr = terrainGeo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const tx = posAttr.getX(i);
            const tz = posAttr.getZ(i);

            // Compute ground height
            const gy = getGroundHeight(tx);
            // Add a little valley slope on the sides (Z offset)
            const edgeEffect = (tz * tz) * 0.0012;
            posAttr.setY(i, gy + edgeEffect);
        }
        terrainGeo.computeVertexNormals();

        // Terrain styling: Synthwave Grid Terrain
        const terrMat = new THREE.MeshStandardMaterial({
            color: '#080512', // Very dark purple/black
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true
        });
        const terr = new THREE.Mesh(terrainGeo, terrMat);
        scene.add(terr);
        terrainMesh.current = terr;

        const wireGeo = new THREE.WireframeGeometry(terrainGeo);
        const wireMat = new THREE.LineBasicMaterial({ 
            color: '#ff007f', // Cyberpunk pink neon
            transparent: true, 
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        scene.add(wire);
        terrainWireframe.current = wire;
    }, []);

    // World Initialization & Enemies placement
    const buildLevelWorld = useCallback((lvl: number) => {
        clearAllEntities();
        
        // Reset ship kinematics
        shipPos.current = { x: 120, y: 350 };
        shipVel.current = { x: 0, y: 0 };
        shipAngle.current = -Math.PI / 2;
        shipAngularVel.current = 0;

        setFuelLevel(100);
        setShieldLevel(100);
        setArmorLevel(100);
        
        if (playerShipGroup.current) {
            playerShipGroup.current.position.set(120, 350, 0);
            playerShipGroup.current.rotation.set(0, 0, 0);
            playerShipGroup.current.visible = true;
        }

        const scene = sceneRef.current;
        if (!scene) return;

        // Fetch configs
        const config = LEVELS[lvl - 1] || LEVELS[0];
        
        // Populate enemies
        enemies.current = [];
        const count = config.enemyCount;
        for (let i = 0; i < count; i++) {
            // Distribute enemies across level
            const ex = 400 + (i / count) * (terrainWidth - 700) + Math.random() * 120;
            const ey = getGroundHeight(ex) + 40 + Math.random() * 80;
            const type = Math.random() > 0.45 ? 'floater' : 'turret';

            const enemyGroup = new THREE.Group();
            
            if (type === 'floater') {
                // Drone: Spinning ball + Gyro wire ring
                const bodyGeo = new THREE.SphereGeometry(5, 8, 8);
                const bodyMat = new THREE.MeshStandardMaterial({ color: '#e84118', emissive: '#3c0000', metalness: 0.7 });
                const body = new THREE.Mesh(bodyGeo, bodyMat);
                enemyGroup.add(body);

                const ringGeo = new THREE.TorusGeometry(8, 0.7, 4, 16);
                const ringMat = new THREE.MeshBasicMaterial({ color: '#fbc531', wireframe: true });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                enemyGroup.add(ring);
            } else {
                // Ground Turret: Cylindrical stand + pivot capsule
                const baseGeo = new THREE.CylinderGeometry(5, 8, 8, 8);
                baseGeo.translate(0, -4, 0);
                const baseMat = new THREE.MeshStandardMaterial({ color: '#44bd32', metalness: 0.5 });
                const base = new THREE.Mesh(baseGeo, baseMat);
                enemyGroup.add(base);

                const headGeo = new THREE.SphereGeometry(4.5, 8, 8);
                const headMat = new THREE.MeshStandardMaterial({ color: '#2f3640', emissive: '#1c0000' });
                const head = new THREE.Mesh(headGeo, headMat);
                head.name = "head";
                enemyGroup.add(head);

                const barrelGeo = new THREE.CylinderGeometry(1.0, 1.0, 7, 8);
                barrelGeo.rotateZ(Math.PI / 2);
                barrelGeo.translate(3.5, 0, 0);
                const barrel = new THREE.Mesh(barrelGeo, headMat);
                barrel.name = "barrel";
                head.add(barrel);
            }

            enemyGroup.position.set(ex, type === 'turret' ? getGroundHeight(ex) + 8 : ey, 0);
            scene.add(enemyGroup);

            enemies.current.push({
                id: i,
                x: ex,
                y: type === 'turret' ? getGroundHeight(ex) + 8 : ey,
                type,
                health: type === 'turret' ? 4 : 2,
                maxHealth: type === 'turret' ? 4 : 2,
                active: true,
                lastFire: 0,
                fireCooldown: 1200 + Math.random() * 1000, // randomized firing interval
                mesh: enemyGroup
            });
        }

        addLog(`${config.name} Bölgesi Yüklendi. Sürüm: 3.0.0.`);
    }, [clearAllEntities, setFuelLevel, setShieldLevel, setArmorLevel]);

    // Game loop tick logic
    const tick = useCallback((time: number) => {
        if (gameState !== 'playing') return;

        const dt = Math.min(2.5, (time - lastTime.current) / 16.67); // Clamp delta to avoid warp physics on tab focus change
        lastTime.current = time;

        const config = LEVELS[level - 1] || LEVELS[0];
        const scene = sceneRef.current;
        const camera = cameraRef3D.current;
        const renderer = rendererRef.current;

        if (!scene || !camera || !renderer) return;

        // --- SHIP CONTROLS & PHYSICS ---
        // Rotational inertia (Snappier for better control)
        if (keys.current['ArrowLeft'] || keys.current['a'] || keys.current['A']) {
            shipAngularVel.current += config.rotationSpeed * 0.15 * dt; // Faster acceleration
        }
        if (keys.current['ArrowRight'] || keys.current['d'] || keys.current['D']) {
            shipAngularVel.current -= config.rotationSpeed * 0.15 * dt; // Faster acceleration
        }
        
        // Clamp angular velocity so it doesn't spin wildly
        shipAngularVel.current = Math.max(-0.15, Math.min(0.15, shipAngularVel.current));

        // Apply angular damping (friction in rotation) - High damping stops it instantly
        shipAngularVel.current *= 0.82;
        
        // Apply angular velocity to angle
        shipAngle.current += shipAngularVel.current * dt;


        const isThrusting = keys.current['ArrowUp'] || keys.current['w'] || keys.current['W'];
        soundRef.current?.setThruster(isThrusting && fuelRef.current > 0);

        if (isThrusting && fuelRef.current > 0) {
            shipVel.current.x += Math.cos(shipAngle.current) * config.thrustPower * dt;
            shipVel.current.y += Math.sin(shipAngle.current) * config.thrustPower * dt;
            setFuelLevel(fuelRef.current - 0.12 * dt);

            // Update flame mesh scale & opacity
            if (thrusterFlameMesh.current) {
                const flMat = thrusterFlameMesh.current.material as THREE.MeshBasicMaterial;
                flMat.opacity = 0.6 + Math.sin(time * 0.05) * 0.2;
                thrusterFlameMesh.current.scale.set(1.5 + Math.random() * 0.5, 1.0, 1.0);
                
                const innerFlame = thrusterFlameMesh.current.children[0] as THREE.Mesh;
                if (innerFlame) {
                    (innerFlame.material as THREE.MeshBasicMaterial).opacity = 0.8 + Math.random() * 0.2;
                }
            }

            // Spawn engine trail particles
            if (Math.random() < 0.45 * dt) {
                const rx = shipPos.current.x - Math.cos(shipAngle.current) * 11;
                const ry = shipPos.current.y - Math.sin(shipAngle.current) * 11;
                createExplosion(rx, ry, '#ff8a00', 3, 0.4);
            }
        } else {
            if (thrusterFlameMesh.current) {
                const flMat = thrusterFlameMesh.current.material as THREE.MeshBasicMaterial;
                flMat.opacity = 0.0;
                const innerFlame = thrusterFlameMesh.current.children[0] as THREE.Mesh;
                if (innerFlame) {
                    (innerFlame.material as THREE.MeshBasicMaterial).opacity = 0.0;
                }
            }
        }

        // Apply environment physics
        shipVel.current.y -= config.gravity * dt; // gravity pulls downward (-Y)
        
        // Space Brakes: if not thrusting, add extra drag so you don't drift endlessly
        const currentDrag = isThrusting ? DRAG : DRAG * 0.98;
        
        shipVel.current.x *= currentDrag;
        shipVel.current.y *= currentDrag;

        shipPos.current.x += shipVel.current.x * dt;
        shipPos.current.y += shipVel.current.y * dt;

        // Enforce boundaries
        if (shipPos.current.x < 30) {
            shipPos.current.x = 30;
            shipVel.current.x = 0;
        }
        if (shipPos.current.x > terrainWidth - 30) {
            shipPos.current.x = terrainWidth - 30;
            shipVel.current.x = 0;
        }
        if (shipPos.current.y > 650) {
            shipPos.current.y = 650;
            shipVel.current.y = 0;
        }

        // Calculate altitude
        const terrainHeight = getGroundHeight(shipPos.current.x);
        setAltitudeVal(Math.max(0, Math.round(shipPos.current.y - terrainHeight)));
        setSpeedVal(Math.round(Math.sqrt(shipVel.current.x ** 2 + shipVel.current.y ** 2) * 10));

        // --- GROUND COLLISION ---
        if (shipPos.current.y - SHIP_SIZE < terrainHeight) {
            const impactSpeed = Math.sqrt(shipVel.current.x ** 2 + shipVel.current.y ** 2);
            
            if (impactSpeed > 4.2) {
                // Crash collision
                soundRef.current?.playExplosion();
                createExplosion(shipPos.current.x, shipPos.current.y, '#e84118', 90, 2.0);
                createExplosion(shipPos.current.x, shipPos.current.y, '#fbc531', 40, 1.2);
                setArmorLevel(0);
                setShieldLevel(0);
            } else {
                // Bounce / Soft Landing
                shipPos.current.y = terrainHeight + SHIP_SIZE;
                shipVel.current.y = Math.abs(shipVel.current.y) * 0.35; // Bounce up slightly
                shipVel.current.x *= 0.75; // Ground friction

                if (impactSpeed > 1.5) {
                    soundRef.current?.playHurt();
                    const damage = Math.round(impactSpeed * 6);
                    if (shieldRef.current > 0) {
                        setShieldLevel(shieldRef.current - damage * 0.7);
                        setArmorLevel(armorRef.current - damage * 0.3);
                    } else {
                        setArmorLevel(armorRef.current - damage);
                    }
                    lastHitTime.current = time;
                    addLog(`Zemin Darbesi Alındı: -${damage} HP`);
                    createExplosion(shipPos.current.x, shipPos.current.y - SHIP_SIZE, '#dcdde1', 8, 0.5);
                }
            }
        }

        // Slowly regenerate shields if not hit recently (3.5 seconds)
        if (time - lastHitTime.current > 3500 && shieldRef.current < 100) {
            setShieldLevel(shieldRef.current + 0.08 * dt);
        }

        // Move 3D Ship Mesh to physical coordinates
        if (playerShipGroup.current) {
            playerShipGroup.current.position.set(shipPos.current.x, shipPos.current.y, 0);
            playerShipGroup.current.rotation.z = shipAngle.current;

            // Tilt the ship slightly along X (yaw) to feel alive in 3D flight
            playerShipGroup.current.rotation.x = shipVel.current.y * 0.04;
            playerShipGroup.current.rotation.y = -shipVel.current.x * 0.03;
        }

        // Pulse the shield bubble glow
        if (shieldBubbleMesh.current) {
            const shMat = shieldBubbleMesh.current.material as THREE.MeshBasicMaterial;
            const hitPulse = Math.max(0, 1 - (time - lastHitTime.current) / 800);
            shMat.opacity = 0.04 + hitPulse * 0.45 + Math.sin(time * 0.008) * 0.02;
            
            // Render shield bubble size dynamically on hit
            const scale = 1.0 + hitPulse * 0.08;
            shieldBubbleMesh.current.scale.set(scale, scale, scale);
        }

        // Update thruster light intensity
        if (lightFollower.current) {
            lightFollower.current.position.set(shipPos.current.x - Math.cos(shipAngle.current) * 12, shipPos.current.y - Math.sin(shipAngle.current) * 12, 5);
            lightFollower.current.intensity = isThrusting && fuelRef.current > 0 ? 3.0 + Math.random() * 1.5 : 0;
        }

        // --- FIRING PLAYER BULLET ---
        const isFiring = keys.current[' '] || keys.current['p'] || keys.current['P'];
        if (isFiring && !keys.current['fired']) {
            soundRef.current?.playLaser();
            
            const bx = shipPos.current.x + Math.cos(shipAngle.current) * 16;
            const by = shipPos.current.y + Math.sin(shipAngle.current) * 16;
            const bvx = shipVel.current.x + Math.cos(shipAngle.current) * 14;
            const bvy = shipVel.current.y + Math.sin(shipAngle.current) * 14;

            const bGeo = new THREE.CylinderGeometry(0.6, 0.6, 6.0, 4);
            bGeo.rotateZ(shipAngle.current + Math.PI / 2);
            
            // Glowing neon material for bullets
            const bColor = new THREE.Color('#ff007f').multiplyScalar(2.5);
            const bMat = new THREE.MeshBasicMaterial({ color: bColor });
            const bMesh = new THREE.Mesh(bGeo, bMat);
            bMesh.position.set(bx, by, 0);
            scene.add(bMesh);
            
            // Recoil screen shake
            screenShakeRef.current = Math.min(10, screenShakeRef.current + 2.0);

            bullets.current.push({
                x: bx,
                y: by,
                vx: bvx,
                vy: bvy,
                life: 50,
                isEnemy: false,
                mesh: bMesh
            });
            keys.current['fired'] = true;
        }
        if (!isFiring) keys.current['fired'] = false;

        // --- BULLET PHYSICS ---
        bullets.current.forEach(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.life -= dt;
            b.mesh.position.set(b.x, b.y, 0);

            // Check ground hit
            if (b.y < getGroundHeight(b.x)) {
                b.life = 0;
                createExplosion(b.x, b.y, b.isEnemy ? '#badc58' : '#ff7675', 4, 0.4);
            }
        });

        // Clear spent bullets
        const expired = bullets.current.filter(b => b.life <= 0);
        expired.forEach(b => scene.remove(b.mesh));
        bullets.current = bullets.current.filter(b => b.life > 0);

        // --- ENEMY LOGIC & FIRE ---
        enemies.current.forEach(enemy => {
            if (!enemy.active) return;

            const dx = shipPos.current.x - enemy.x;
            const dy = shipPos.current.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Animate floating drones
            if (enemy.type === 'floater') {
                enemy.mesh.position.y = enemy.y + Math.sin(time * 0.003 + enemy.id) * 6;
                // Spin rings
                const ring = enemy.mesh.children[1];
                if (ring) {
                    ring.rotation.x += 0.02 * dt;
                    ring.rotation.y += 0.03 * dt;
                }
            }

            // Tracking and Shooting
            if (dist < 420) {
                const angle = Math.atan2(dy, dx);
                enemy.targetAngle = angle;

                // Aim barrel for Turret
                if (enemy.type === 'turret') {
                    const head = enemy.mesh.getObjectByName("head");
                    if (head) {
                        head.rotation.z = angle;
                    }
                }

                // Shoot back
                if (time - enemy.lastFire > enemy.fireCooldown) {
                    soundRef.current?.playEnemyLaser();
                    enemy.lastFire = time;

                    const bGeo = new THREE.SphereGeometry(1.2, 6, 6);
                    const bMat = new THREE.MeshBasicMaterial({ color: '#fbc531' });
                    const bMesh = new THREE.Mesh(bGeo, bMat);
                    bMesh.position.set(enemy.x, enemy.y + (enemy.type === 'turret' ? 6 : 0), 0);
                    scene.add(bMesh);

                    bullets.current.push({
                        x: enemy.x,
                        y: enemy.y + (enemy.type === 'turret' ? 6 : 0),
                        vx: Math.cos(angle) * 7.5,
                        vy: Math.sin(angle) * 7.5,
                        life: 75,
                        isEnemy: true,
                        mesh: bMesh
                    });
                }
            }
        });

        // --- BULLET HIT DETECTIONS ---
        bullets.current.forEach(b => {
            if (b.life <= 0) return;

            if (b.isEnemy) {
                // Bullet hit Player?
                const dx = b.x - shipPos.current.x;
                const dy = b.y - shipPos.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < SHIP_SIZE * 0.75) {
                    b.life = 0;
                    soundRef.current?.playHurt();
                    lastHitTime.current = time;
                    createExplosion(shipPos.current.x, shipPos.current.y, '#fbc531', 12, 0.8);
                    
                    const dmg = 12;
                    if (shieldRef.current > 0) {
                        setShieldLevel(shieldRef.current - dmg * 0.7);
                        setArmorLevel(armorRef.current - dmg * 0.3);
                    } else {
                        setArmorLevel(armorRef.current - dmg);
                    }
                    addLog(`Mermi Darbesi: -${dmg} Güç`);
                }
            } else {
                // Bullet hit Enemy?
                enemies.current.forEach(enemy => {
                    if (!enemy.active) return;
                    const dx = b.x - enemy.x;
                    const dy = b.y - enemy.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const radius = enemy.type === 'turret' ? 12 : 9;

                    if (dist < radius) {
                        b.life = 0;
                        enemy.health--;
                        createExplosion(enemy.x, enemy.y, '#e84118', 6, 0.6);

                        if (enemy.health <= 0) {
                            enemy.active = false;
                            scene.remove(enemy.mesh);
                            soundRef.current?.playExplosion();
                            createExplosion(enemy.x, enemy.y, '#00d2d3', 25, 1.4);
                            setScore(s => s + 150);
                            addLog(`Düşman Ünitesi İmha Edildi. +150 Sk`);

                            // Drop energy crystal
                            const crystalGeo = new THREE.OctahedronGeometry(2.2);
                            const crystalMat = new THREE.MeshStandardMaterial({
                                color: '#44bd32',
                                emissive: '#1b4d14',
                                roughness: 0.1
                            });
                            const cMesh = new THREE.Mesh(crystalGeo, crystalMat);
                            cMesh.position.set(enemy.x, enemy.y, 0);
                            scene.add(cMesh);

                            crystals.current.push({
                                id: Math.random(),
                                x: enemy.x,
                                y: enemy.y,
                                vx: (Math.random() - 0.5) * 2,
                                vy: 3 + Math.random() * 2, // Pop up slightly
                                active: true,
                                mesh: cMesh
                            });

                            // Check Victory
                            const remaining = enemies.current.filter(e => e.active).length;
                            if (remaining === 0) {
                                confetti({
                                    particleCount: 120,
                                    spread: 70,
                                    origin: { y: 0.6 }
                                });
                                setGameState('victory');
                            }
                        }
                    }
                });
            }
        });

        // --- FUEL CRYSTAL PHYSICS & COLLECTION ---
        crystals.current.forEach(c => {
            if (!c.active) return;

            // Spin crystal in 3D
            c.mesh.rotation.y += 0.04 * dt;
            c.mesh.rotation.x += 0.02 * dt;

            // Gravity & air resistance on dropped crystals
            c.vy -= 0.06 * dt;
            c.vx *= 0.98;
            c.vy *= 0.98;

            c.x += c.vx * dt;
            c.y += c.vy * dt;

            // Collision with terrain
            const gHeight = getGroundHeight(c.x);
            if (c.y < gHeight + 2) {
                c.y = gHeight + 2;
                c.vy = 0;
                c.vx = 0;
            }

            // Magnetic attraction to player ship
            const pdx = shipPos.current.x - c.x;
            const pdy = shipPos.current.y - c.y;
            const dist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (dist < 100) {
                // Homing physics
                const pullSpeed = 0.28 * dt;
                c.vx += (pdx / dist) * pullSpeed;
                c.vy += (pdy / dist) * pullSpeed;
                
                // Cap speed
                const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
                if (speed > 8) {
                    c.vx = (c.vx / speed) * 8;
                    c.vy = (c.vy / speed) * 8;
                }
            }

            c.mesh.position.set(c.x, c.y, 0);

            // Pickup detection
            if (dist < SHIP_SIZE + 4) {
                c.active = false;
                scene.remove(c.mesh);
                soundRef.current?.playCollect();
                setFuelLevel(Math.min(100, fuelRef.current + 50)); // Major fuel boost
                setShieldLevel(Math.min(100, shieldRef.current + 20));
                setScore(s => s + 75);
                createExplosion(c.x, c.y, '#00d8d6', 15, 1.2);
                addLog("Enerji Çekirdeği Eşitlendi: +50 Yakıt, +20 Kalkan");
            }
        });

        // Filter out inactive crystals
        crystals.current = crystals.current.filter(c => c.active);

        // --- 3D PARTICLE SYSTEMS METADATA UPDATE ---
        particles.current.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.z += p.vz * dt;
            p.life -= dt;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.vz *= 0.95;
        });

        // Update positions inside particle system meshes directly
        particles.current.forEach(p => {
            if (p.mesh && p.mesh instanceof THREE.Points) {
                const geo = p.mesh.geometry;
                const posAttr = geo.attributes.position;
                if (posAttr) {
                    // Find all particles matching this points mesh and update coordinates
                    // Since it's simpler, we can rebuild or offset their positions
                    // To avoid full overhead, we simply offset the whole mesh or let the system draw
                    // In our current setup, we update the position buffer for the Points geometry:
                    const array = posAttr.array as Float32Array;
                    for (let i = 0; i < array.length / 3; i++) {
                        array[i * 3] += p.vx * dt;
                        array[i * 3 + 1] += p.vy * dt;
                        array[i * 3 + 2] += p.vz * dt;
                    }
                    posAttr.needsUpdate = true;
                    
                    // Fade opacity based on life
                    const mat = p.mesh.material as THREE.PointsMaterial;
                    mat.opacity = Math.max(0, p.life / p.maxLife);
                }
            }
        });

        // Remove dead particles
        const deadParticles = particles.current.filter(p => p.life <= 0);
        deadParticles.forEach(p => {
            if (p.mesh) scene.remove(p.mesh);
        });
        particles.current = particles.current.filter(p => p.life > 0);

        // --- CAMERA CINEMATICS (SMOOTH FOLLOW + ZOOM + TILT) ---
        // Position camera behind and above the ship, slightly lagging for smoothness
        const targetCamX = shipPos.current.x + shipVel.current.x * 1.5;
        const targetCamY = Math.max(200, shipPos.current.y + 20 + shipVel.current.y * 0.8);
        
        // Dynamically zoom camera out massively at high velocities for a hyperspeed feel
        const speed = Math.sqrt(shipVel.current.x ** 2 + shipVel.current.y ** 2);
        const targetCamZ = 180 + Math.min(180, speed * 12.0);

        camera.position.x += (targetCamX - camera.position.x) * 0.1 * dt;
        camera.position.y += (targetCamY - camera.position.y) * 0.1 * dt;
        camera.position.z += (targetCamZ - camera.position.z) * 0.06 * dt;

        // Camera looks slightly ahead of the ship
        camera.lookAt(new THREE.Vector3(shipPos.current.x + 30, shipPos.current.y - 10, 0));

        // Background planet and star updates (make them scroll slowly to give parallax depth)
        if (backgroundStars.current) {
            backgroundStars.current.position.x = camera.position.x * 0.75;
        }

        // --- RADAR DATA ---
        // Compile radar entries (Drones, Turrets, Crystals) relative to player
        const radarList: { x: number, y: number, type: string }[] = [];
        enemies.current.forEach(e => {
            if (e.active) {
                radarList.push({ x: e.x - shipPos.current.x, y: e.y - shipPos.current.y, type: e.type });
            }
        });
        crystals.current.forEach(c => {
            if (c.active) {
                radarList.push({ x: c.x - shipPos.current.x, y: c.y - shipPos.current.y, type: 'crystal' });
            }
        });
        setRadarEntities(radarList);

        // Trigger alarm beep if fuel or health is critically low
        if ((fuelRef.current < 20 || armorRef.current < 25) && Math.floor(time / 800) % 2 === 0) {
            soundRef.current?.playWarning();
        }

        // Screen shake logic
        if (screenShakeRef.current > 0) {
            camera.position.x += (Math.random() - 0.5) * screenShakeRef.current;
            camera.position.y += (Math.random() - 0.5) * screenShakeRef.current;
            screenShakeRef.current *= 0.9; // decay
            if (screenShakeRef.current < 0.1) screenShakeRef.current = 0;
        }

        // Render Frame with Post-Processing
        if (composerRef.current) {
            composerRef.current.render();
        } else {
            renderer.render(scene, camera);
        }

        animationFrameId.current = requestAnimationFrame((nextTime) => tickRef.current(nextTime));
    }, [gameState, level, createExplosion, setFuelLevel, setShieldLevel, setArmorLevel]);

    useEffect(() => {
        tickRef.current = tick;
    }, [tick]);

    // Handle game state start
    const startGame = (nextLevel = level, preserveScore = false) => {
        if (!preserveScore) setScore(0);
        
        // Initialize sound manager on user action to satisfy browser requirements
        if (!soundRef.current) {
            soundRef.current = new SoundSynth();
            soundRef.current.toggle(soundEnabled);
        }

        setLevel(nextLevel);
        buildLevelWorld(nextLevel);
        setGameState('playing');
        lastTime.current = performance.now();
    };

    // Keyboard handlers
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "KeyP", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
                e.preventDefault();
            }
            keys.current[e.key] = true;
            keys.current[e.code] = true; // Support WASD codes
        };
        const handleUp = (e: KeyboardEvent) => {
            keys.current[e.key] = false;
            keys.current[e.code] = false;
        };

        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    // Setup active game loops
    useEffect(() => {
        if (gameState !== 'playing') {
            soundRef.current?.setThruster(false);
            return;
        }

        lastTime.current = performance.now();
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [gameState, tick]);

    // Initialize 3D elements on canvas mount
    useEffect(() => {
        initThreeWorld();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        buildLevelWorld(1);

        const handleResize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (canvas && container && rendererRef.current && cameraRef3D.current && composerRef.current) {
                const w = container.clientWidth || 800;
                const h = 550;
                rendererRef.current.setSize(w, h);
                composerRef.current.setSize(w, h);
                cameraRef3D.current.aspect = w / h;
                cameraRef3D.current.updateProjectionMatrix();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId.current);
            clearAllEntities();
            if (soundRef.current) {
                soundRef.current.cleanup();
            }
        };
    }, [initThreeWorld, buildLevelWorld, clearAllEntities]);

    const activeConfig = LEVELS[level - 1] || LEVELS[0];

    return (
        <Card className="p-4 border-2 border-primary/20 bg-background overflow-hidden relative select-none" ref={containerRef}>
            
            {/* Top HUD: Glassmorphic Panel */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4 p-3 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md z-20 relative text-xs">
                
                {/* Telemetry Stats */}
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Hız</span>
                        <div className="flex items-baseline gap-1 font-mono">
                            <span className="text-lg font-bold text-cyan-400">{speedVal}</span>
                            <span className="text-[8px] text-muted-foreground">km/h</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">İrtifa</span>
                        <div className="flex items-baseline gap-1 font-mono">
                            <span className="text-lg font-bold text-purple-400">{altitudeVal}</span>
                            <span className="text-[8px] text-muted-foreground">m</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Skor</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">{score}</span>
                    </div>
                </div>

                {/* Energy Bars */}
                <div className="flex gap-4 flex-1 max-w-sm justify-center md:justify-end">
                    
                    {/* Shield Bar */}
                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Shield className="w-2.5 h-2.5 text-cyan-400" /> Kalkan</span>
                            <span className="font-mono text-cyan-400">{shield}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-cyan-400 transition-all duration-150 relative shadow-[0_0_8px_#22d3ee]" 
                                style={{ width: `${shield}%` }} 
                            />
                        </div>
                    </div>

                    {/* Armor Bar */}
                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Activity className="w-2.5 h-2.5 text-rose-500" /> Zırh</span>
                            <span className="font-mono text-rose-500">{armor}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-rose-500 transition-all duration-150 shadow-[0_0_8px_#f43f5e]" 
                                style={{ width: `${armor}%` }} 
                            />
                        </div>
                    </div>

                    {/* Fuel Bar */}
                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-amber-500" /> Yakıt</span>
                            <span className="font-mono text-amber-500">{fuel}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className={`h-full transition-all duration-150 shadow-[0_0_8px_#f59e0b] ${fuel < 20 ? 'bg-amber-600 animate-pulse' : 'bg-amber-500'}`} 
                                style={{ width: `${fuel}%` }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Level / Sound controls */}
                <div className="flex gap-2 items-center">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg border border-white/10" 
                        onClick={toggleSound}
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                    </Button>
                    <div className="px-2 py-1 bg-primary/20 rounded border border-primary/40 font-bold text-primary tracking-wider uppercase text-[10px]">
                        SEKTÖR {level}
                    </div>
                </div>
            </div>

            {/* Game Screen Canvas Container */}
            <div className="relative rounded-lg overflow-hidden border border-border shadow-2xl">
                <canvas
                    ref={canvasRef}
                    className="w-full bg-black block focus:outline-none"
                    style={{ height: '550px' }}
                    width={800}
                    height={550}
                    tabIndex={0}
                />

                {/* Cyber HUD Overlay: Console Logs */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-4 left-4 p-3 rounded-lg border border-white/5 bg-black/55 backdrop-blur-sm max-w-xs text-[10px] text-emerald-400 font-mono tracking-wide pointer-events-none z-10 flex flex-col gap-1 shadow-md">
                        <div className="text-[8px] text-muted-foreground border-b border-white/10 pb-0.5 mb-1 uppercase font-bold flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5" /> Uçuş Günlüğü
                        </div>
                        {logMessages.map((log, idx) => (
                            <div key={idx} className={`${idx === 0 ? 'text-emerald-300 font-bold opacity-100' : 'opacity-65'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}

                {/* Cyber HUD Overlay: Circular Radar */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-4 right-4 p-2 rounded-full border border-cyan-500/25 bg-black/60 backdrop-blur-sm w-28 h-28 pointer-events-none z-10 flex items-center justify-center shadow-lg">
                        <div className="relative w-full h-full rounded-full border border-cyan-500/15 overflow-hidden flex items-center justify-center">
                            {/* Scanning Sweep Effect */}
                            <div className="absolute inset-0 border-t border-cyan-500/40 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                            
                            {/* Center Player Marker */}
                            <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_4px_#22d3ee] z-20" />
                            
                            {/* Radar Targets */}
                            {radarEntities.map((ent, idx) => {
                                // Map positions into radar size (radar diameter: 112px, half-width: 56px)
                                // Scale down map coordinates to fit radar circle
                                const scale = 0.12; 
                                const rx = 56 + ent.x * scale;
                                const ry = 56 - ent.y * scale; // invert Y for HUD coordinates

                                // Clamp within circle
                                const distFromCenter = Math.sqrt((rx - 56) ** 2 + (ry - 56) ** 2);
                                if (distFromCenter > 50) return null;

                                let color = "bg-rose-500 shadow-[0_0_3px_#ef4444]"; // floater
                                if (ent.type === 'turret') color = "bg-red-600 shadow-[0_0_3px_#dc2626]";
                                if (ent.type === 'crystal') color = "bg-emerald-400 shadow-[0_0_3px_#10b981]";

                                return (
                                    <div 
                                        key={idx}
                                        className={`absolute w-1.5 h-1.5 rounded-full ${color}`} 
                                        style={{ left: `${rx}px`, top: `${ry}px` }}
                                    />
                                );
                            })}
                            
                            {/* Radar Grid Circles */}
                            <div className="absolute w-2/3 h-2/3 border border-cyan-500/10 rounded-full" />
                            <div className="absolute w-1/3 h-1/3 border border-cyan-500/10 rounded-full" />
                            
                            {/* Compass ticks */}
                            <div className="absolute top-0 text-[7px] text-cyan-400/40 font-mono">N</div>
                            <div className="absolute right-1 text-[7px] text-cyan-400/40 font-mono">E</div>
                        </div>
                    </div>
                )}

                {/* Overlays: Start / Story Screen */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 p-6 text-center backdrop-blur-sm">
                        <div className="p-1 rounded-full border border-primary/40 bg-primary/10 mb-3 animate-pulse">
                            <Rocket className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-white tracking-wider mb-1">
                            NEVBARA: GRAVITY WARRIOR
                        </h2>
                        <span className="text-[10px] text-primary uppercase font-bold tracking-widest mb-6">
                            3D WebGL Uzay Savaş Simülasyonu
                        </span>
                        
                        <div className="max-w-xl p-4 mb-8 rounded-lg border border-white/5 bg-white/5 backdrop-blur-md text-gray-300 text-xs text-left leading-relaxed flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px] border-b border-white/10 pb-1">
                                <Compass className="w-3.5 h-3.5" /> GÖREV TANITIMI: {activeConfig.name}
                            </div>
                            <p>{activeConfig.description}</p>
                            <div className="grid grid-cols-2 gap-3 mt-1 text-[11px]">
                                <div className="p-2 rounded border border-white/5 bg-black/20">
                                    <span className="text-muted-foreground block text-[9px] uppercase font-semibold mb-0.5">Yerçekimi Katsayısı</span>
                                    <span className="font-mono text-white font-bold">{activeConfig.gravity}G (Aşırı Çekim)</span>
                                </div>
                                <div className="p-2 rounded border border-white/5 bg-black/20">
                                    <span className="text-muted-foreground block text-[9px] uppercase font-semibold mb-0.5">Tehlike Faktörü</span>
                                    <span className="font-mono text-rose-400 font-bold">{activeConfig.enemyCount} Yerçekimi Çıpası</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-64">
                            <Button size="lg" className="text-sm font-bold brutalist-button text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]" onClick={() => startGame()}>
                                <Play className="mr-2 w-4 h-4 fill-black" /> GÖREVİ BAŞLAT
                            </Button>
                        </div>
                    </div>
                )}

                {/* Overlays: Game Over Screen */}
                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-950/85 z-30 p-6 text-center backdrop-blur-md">
                        <div className="mb-4 text-rose-500 font-bold border border-rose-500/40 bg-rose-950/40 px-3 py-1 rounded text-xs animate-pulse font-mono tracking-widest uppercase">
                            KRİTİK HATA // HULL BREACHED
                        </div>
                        <h2 className="text-5xl font-black text-white mb-2 tracking-wide">GÖREV BAŞARISIZ</h2>
                        <p className="text-gray-300 mb-8 text-sm max-w-sm">
                            Gövde bütünlüğü sıfıra indi. Nevbara ağır yerçekimi alanı tarafından yutuldu.
                        </p>
                        <Button size="lg" variant="destructive" className="text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => startGame()}>
                            <RotateCcw className="mr-2 w-4 h-4" /> RE-START SİMÜLASYON
                        </Button>
                    </div>
                )}

                {/* Overlays: Victory Screen */}
                {gameState === 'victory' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/85 z-30 p-6 text-center backdrop-blur-md">
                        <div className="mb-4 text-emerald-400 font-bold border border-emerald-400/40 bg-emerald-950/40 px-4 py-1.5 rounded-full text-xs animate-bounce font-mono tracking-widest uppercase flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> SEKTÖR TEMİZLENDİ!
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-2 tracking-wide">MÜKEMMEL OPERASYON</h2>
                        <p className="text-gray-300 mb-6 text-xs max-w-md">
                            Tüm yerçekimi çıpaları başarıyla imha edildi. İtki sistemleri dengelendi. Bir sonraki sektöre portal açıldı.
                        </p>
                        
                        <div className="flex gap-4">
                            {level < LEVELS.length ? (
                                <Button 
                                    size="lg" 
                                    className="bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                                    onClick={() => startGame(level + 1, true)}
                                >
                                    SONRAKİ SEVİYEYE GEÇ
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase">
                                        🏆 SİMÜLASYON TAMAMLANDI - EN BÜYÜK PİLOT 🏆
                                    </div>
                                    <Button 
                                        size="lg" 
                                        className="bg-white hover:bg-gray-200 text-black font-bold text-sm" 
                                        onClick={() => startGame(1, false)}
                                    >
                                        İLK SEKTÖRDEN TEKRARLA
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls Help Guide */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] text-muted-foreground">
                <div className="p-2.5 border rounded-lg bg-card/40 border-white/5 flex flex-col gap-0.5">
                    <strong className="text-foreground flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Motor İtkisi</strong>
                    <span className="text-[10px]">W / YUKARI tuşları ile yönünüze doğru itki uygulayın. Sınırlı yakıta dikkat edin.</span>
                </div>
                <div className="p-2.5 border rounded-lg bg-card/40 border-white/5 flex flex-col gap-0.5">
                    <strong className="text-foreground flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-cyan-400" /> Manevra</strong>
                    <span className="text-[10px]">A-D / SOL-SAĞ yön tuşları ile aracı döndürün. Eylemsizlik/momentum mevcuttur.</span>
                </div>
                <div className="p-2.5 border rounded-lg bg-card/40 border-white/5 flex flex-col gap-0.5">
                    <strong className="text-foreground flex items-center gap-1"><Target className="w-3.5 h-3.5 text-rose-400" /> Lazer Silahı</strong>
                    <span className="text-[10px]">SPACE (Boşluk) veya P tuşuna basarak ateş edin. Çıpaları ve düşmanları yok edin.</span>
                </div>
                <div className="p-2.5 border rounded-lg bg-card/40 border-white/5 flex flex-col gap-0.5">
                    <strong className="text-foreground flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-purple-400" /> Enerji Hasadı</strong>
                    <span className="text-[10px]">İmha olan ünitelerden düşen yeşil kristallere yaklaşarak yakıt ve kalkan doldurun.</span>
                </div>
            </div>
        </Card>
    );
}
