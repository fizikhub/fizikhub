"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Activity, Shield, Flame, Target, Volume2, VolumeX, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

// --- Types ---
interface Vector3D { x: number; y: number; z: number; }

interface Particle {
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    life: number; color: string; size: number;
    mesh: THREE.Mesh;
}

interface Bullet {
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    life: number;
    isEnemy: boolean;
    isBeam?: boolean;
    mesh: THREE.Mesh;
}

interface Enemy {
    id: number;
    x: number; y: number; z: number;
    type: 'turret' | 'floater' | 'boss';
    health: number;
    maxHealth: number;
    active: boolean;
    lastFire: number;
    fireCooldown: number;
    mesh: THREE.Group;
    targetQuaternion?: THREE.Quaternion;
}

interface FuelCrystal {
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    active: boolean;
    mesh: THREE.Mesh;
}

interface PowerUp {
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    type: 'multi' | 'beam';
    active: boolean;
    mesh: THREE.Mesh;
}

interface FloatingText {
    id: number; text: string;
    x: number; y: number; z: number;
    life: number; color: string;
}

// --- Sound Synth Manager ---
class SoundSynth {
    ctx: AudioContext;
    masterGain: GainNode;
    enabled: boolean = true;

    constructor() {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.4;
        this.masterGain.connect(this.ctx.destination);
    }
    
    setEnabled(val: boolean) {
        this.enabled = val;
        this.masterGain.gain.value = val ? 0.4 : 0;
    }

    playShoot(isBeam = false) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        if (isBeam) {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } else {
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.1);
        }
    }

    playExplosion() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playCollect() {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }
}

// Global Consts
const MAX_SPEED = 6.0;
const MIN_SPEED = 0.5;

export function SpaceBomberGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const floatingTextContainerRef = useRef<HTMLDivElement>(null);

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
    
    // Boss health states
    const [bossHealth, setBossHealth] = useState(0);
    const [bossMaxHealth, setBossMaxHealth] = useState(40);
    
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
    const composerRef = useRef<EffectComposer | null>(null);
    const screenShakeRef = useRef<number>(0);
    
    // 3D Objects
    const playerShipGroup = useRef<THREE.Group | null>(null);
    const thrusterFlameMeshL = useRef<THREE.Mesh | null>(null);
    const thrusterFlameMeshR = useRef<THREE.Mesh | null>(null);
    const shieldBubbleMesh = useRef<THREE.Mesh | null>(null);
    const asteroidMesh = useRef<THREE.InstancedMesh | null>(null);

    // Physics state refs (6-DOF)
    const shipPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const shipVel = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const shipQuaternion = useRef<THREE.Quaternion>(new THREE.Quaternion());
    const targetSpeed = useRef<number>(MIN_SPEED);
    const mouseDelta = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    
    const particles = useRef<Particle[]>([]);
    const bullets = useRef<Bullet[]>([]);
    const enemies = useRef<Enemy[]>([]);
    const crystals = useRef<FuelCrystal[]>([]);
    const powerUps = useRef<PowerUp[]>([]);
    const floatingTexts = useRef<FloatingText[]>([]);
    
    const comboMultiplier = useRef<number>(1);
    const comboTimer = useRef<number>(0);
    const weaponType = useRef<'normal' | 'multi' | 'beam'>('normal');
    const weaponTimer = useRef<number>(0);
    
    const keys = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const tickRef = useRef<(time: number) => void>(() => {});

    // Radar points
    const [radarEntities, setRadarEntities] = useState<{ x: number, y: number, z: number, type: string }[]>([]);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
        setLogMessages(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 4)]);
    };

    const toggleSound = () => {
        if (soundRef.current) {
            soundRef.current.setEnabled(!soundEnabled);
            setSoundEnabled(!soundEnabled);
        }
    };

    const createExplosion = useCallback((x: number, y: number, z: number, color: string, count: number, sizeScale: number) => {
        if (!sceneRef.current) return;
        const pGeo = new THREE.BoxGeometry(sizeScale, sizeScale, sizeScale);
        const pMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
        
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(pGeo, pMat);
            mesh.position.set(x, y, z);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sceneRef.current.add(mesh);
            
            particles.current.push({
                x, y, z,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                vz: (Math.random() - 0.5) * 4,
                life: 15 + Math.random() * 20,
                color,
                size: sizeScale,
                mesh
            });
        }
    }, []);

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
            createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#ff4a11', 120, 2.5);
            setGameState('gameover');
            if (playerShipGroup.current) playerShipGroup.current.visible = false;
        }
    }, [createExplosion]);

    const clearAllEntities = useCallback(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        bullets.current.forEach(b => scene.remove(b.mesh)); bullets.current = [];
        enemies.current.forEach(e => scene.remove(e.mesh)); enemies.current = [];
        crystals.current.forEach(c => scene.remove(c.mesh)); crystals.current = [];
        powerUps.current.forEach(p => scene.remove(p.mesh)); powerUps.current = [];
        particles.current.forEach(p => scene.remove(p.mesh)); particles.current = [];
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
        scene.background = new THREE.Color('#030109');
        scene.fog = new THREE.FogExp2('#030109', 0.0015);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
        camera.position.set(0, 10, 30);
        cameraRef3D.current = camera;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        // Post-processing
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.2, 0.4, 0.85);
        composer.addPass(bloomPass);
        composerRef.current = composer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xa29bfe, 1.5);
        dirLight.position.set(100, 200, 50);
        scene.add(dirLight);

        // --- SHIP MESH (Starfighter) ---
        const shipGroup = new THREE.Group();
        
        // Fuselage
        const fuselageGeo = new THREE.BoxGeometry(2, 1.5, 8);
        const fuselageMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.8 });
        const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
        shipGroup.add(fuselage);

        // Nose
        const noseGeo = new THREE.ConeGeometry(1, 4, 4);
        const noseMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.3, metalness: 0.8 });
        const nose = new THREE.Mesh(noseGeo, noseMat);
        nose.position.set(0, 0, -6);
        nose.rotation.x = -Math.PI / 2;
        nose.rotation.y = Math.PI / 4;
        shipGroup.add(nose);

        // Cockpit
        const cockpitGeo = new THREE.BoxGeometry(1.4, 1.0, 3);
        const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x00d2d3, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.9, emissive: 0x005555 });
        const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
        cockpit.position.set(0, 1.0, -1);
        shipGroup.add(cockpit);

        // Wings
        const wingGeo = new THREE.BoxGeometry(12, 0.3, 3);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.7 });
        const wings = new THREE.Mesh(wingGeo, wingMat);
        wings.position.set(0, -0.2, 1);
        shipGroup.add(wings);
        
        // Wingtips
        const wingTipGeo = new THREE.BoxGeometry(0.4, 2, 3);
        const wingTipMat = new THREE.MeshStandardMaterial({ color: 0x0984e3, emissive: 0x0984e3, emissiveIntensity: 0.5 });
        const wingTipL = new THREE.Mesh(wingTipGeo, wingTipMat);
        wingTipL.position.set(-6, 0.8, 1);
        shipGroup.add(wingTipL);
        const wingTipR = new THREE.Mesh(wingTipGeo, wingTipMat);
        wingTipR.position.set(6, 0.8, 1);
        shipGroup.add(wingTipR);

        // Thrusters
        const thrusterGeo = new THREE.CylinderGeometry(0.6, 0.8, 2, 8);
        const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.9 });
        const thrusterL = new THREE.Mesh(thrusterGeo, thrusterMat);
        thrusterL.rotation.x = Math.PI / 2;
        thrusterL.position.set(-1.5, 0, 4);
        shipGroup.add(thrusterL);
        
        const thrusterR = new THREE.Mesh(thrusterGeo, thrusterMat);
        thrusterR.rotation.x = Math.PI / 2;
        thrusterR.position.set(1.5, 0, 4);
        shipGroup.add(thrusterR);

        // Flames
        const flameGeo = new THREE.ConeGeometry(0.5, 3, 8);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9f43, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
        const flameL = new THREE.Mesh(flameGeo, flameMat);
        flameL.rotation.x = -Math.PI / 2;
        flameL.position.set(-1.5, 0, 6);
        shipGroup.add(flameL);
        thrusterFlameMeshL.current = flameL;

        const flameR = new THREE.Mesh(flameGeo, flameMat);
        flameR.rotation.x = -Math.PI / 2;
        flameR.position.set(1.5, 0, 6);
        shipGroup.add(flameR);
        thrusterFlameMeshR.current = flameR;

        // Shield Bubble
        const shieldGeo = new THREE.SphereGeometry(6, 16, 16);
        const shieldMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
        const shieldBubble = new THREE.Mesh(shieldGeo, shieldMat);
        shipGroup.add(shieldBubble);
        shieldBubbleMesh.current = shieldBubble;

        scene.add(shipGroup);
        playerShipGroup.current = shipGroup;

        // --- STARFIELD ---
        const starGeo = new THREE.BufferGeometry();
        const starCount = 3000;
        const starPos = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const c1 = new THREE.Color('#ffffff');
        const c2 = new THREE.Color('#74b9ff');
        const c3 = new THREE.Color('#fdcb6e');

        for (let i = 0; i < starCount; i++) {
            // Spherical distribution
            const r = 200 + Math.random() * 2000;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            
            starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            starPos[i * 3 + 2] = r * Math.cos(phi);

            const rnd = Math.random();
            const col = rnd > 0.8 ? c2 : (rnd > 0.6 ? c3 : c1);
            starColors[i * 3] = col.r;
            starColors[i * 3 + 1] = col.g;
            starColors[i * 3 + 2] = col.b;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        const starMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, sizeAttenuation: true });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // --- 3D ASTEROID FIELD ---
        const astGeo = new THREE.DodecahedronGeometry(10, 1);
        const astMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8, metalness: 0.2 });
        const astCount = 400;
        const instancedAst = new THREE.InstancedMesh(astGeo, astMat, astCount);
        
        const dummy = new THREE.Object3D();
        for (let i = 0; i < astCount; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );
            const scale = Math.random() * 3 + 0.5;
            dummy.scale.set(scale, scale, scale);
            dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            dummy.updateMatrix();
            instancedAst.setMatrixAt(i, dummy.matrix);
        }
        scene.add(instancedAst);
        asteroidMesh.current = instancedAst;

    }, []);

    const buildLevelWorld = useCallback(() => {
        clearAllEntities();
        setFuelLevel(100);
        setShieldLevel(100);
        setArmorLevel(100);
        setBossHealth(40);
        
        shipPos.current = new THREE.Vector3(0, 0, 0);
        shipVel.current = new THREE.Vector3(0, 0, 0);
        shipQuaternion.current = new THREE.Quaternion();
        targetSpeed.current = MIN_SPEED;

        if (playerShipGroup.current) {
            playerShipGroup.current.position.set(0, 0, 0);
            playerShipGroup.current.quaternion.copy(shipQuaternion.current);
            playerShipGroup.current.visible = true;
        }

        const scene = sceneRef.current;
        if (!scene) return;

        // Spawn Enemies in 3D Space (Ahead of player)
        for (let i = 0; i < 20 + level * 5; i++) {
            const eGeo = new THREE.IcosahedronGeometry(4, 0);
            const eMat = new THREE.MeshStandardMaterial({ color: '#e84118', emissive: '#c23616', emissiveIntensity: 0.5, wireframe: true });
            const eMesh = new THREE.Group();
            const core = new THREE.Mesh(eGeo, eMat);
            eMesh.add(core);

            // Spawn them in a wide cylinder ahead of the player
            const zDist = -300 - Math.random() * 1500;
            const radius = Math.random() * 400;
            const angle = Math.random() * Math.PI * 2;
            
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            const pz = zDist;

            eMesh.position.set(px, py, pz);
            scene.add(eMesh);

            enemies.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                type: 'floater',
                health: 4,
                maxHealth: 4,
                active: true,
                lastFire: 0,
                fireCooldown: 120 + Math.random() * 60,
                mesh: eMesh,
                targetQuaternion: new THREE.Quaternion()
            });
        }

        // Spawn Boss if level % 3 == 0
        if (level % 3 === 0) {
            const bossGeo = new THREE.OctahedronGeometry(25, 2);
            const bossMat = new THREE.MeshStandardMaterial({ color: '#8c7ae6', emissive: '#4cd137', emissiveIntensity: 0.2, wireframe: true });
            const bossMesh = new THREE.Group();
            const bCore = new THREE.Mesh(bossGeo, bossMat);
            bossMesh.add(bCore);
            
            const px = 0;
            const py = 0;
            const pz = -2000;

            bossMesh.position.set(px, py, pz);
            scene.add(bossMesh);

            enemies.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                type: 'boss',
                health: 40 + level * 10,
                maxHealth: 40 + level * 10,
                active: true,
                lastFire: 0,
                fireCooldown: 80,
                mesh: bossMesh
            });
            setBossMaxHealth(40 + level * 10);
            setBossHealth(40 + level * 10);
        }

    }, [clearAllEntities, level, setFuelLevel, setShieldLevel, setArmorLevel]);

    const spawnBullet = useCallback((offsetX: number, offsetY: number, color: string, speedScale: number = 1.0, isBeam: boolean = false) => {
        if (!sceneRef.current || !playerShipGroup.current) return;
        
        // Beam has different geometry
        const geo = isBeam ? new THREE.CylinderGeometry(0.5, 0.5, 40) : new THREE.SphereGeometry(1.2, 8, 8);
        if (isBeam) geo.rotateX(Math.PI / 2); // point beam forward

        const mat = new THREE.MeshBasicMaterial({ color, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(geo, mat);

        // Calculate spawn position
        const spawnPos = new THREE.Vector3(offsetX, offsetY, -5);
        spawnPos.applyQuaternion(shipQuaternion.current);
        spawnPos.add(shipPos.current);
        
        // Calculate velocity (forward)
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
        const bulletSpeed = 30 * speedScale;
        const bVx = forward.x * bulletSpeed;
        const bVy = forward.y * bulletSpeed;
        const bVz = forward.z * bulletSpeed;

        mesh.position.copy(spawnPos);
        mesh.quaternion.copy(shipQuaternion.current); // align bullet/beam with ship
        sceneRef.current.add(mesh);

        bullets.current.push({
            id: Math.random(),
            x: spawnPos.x, y: spawnPos.y, z: spawnPos.z,
            vx: bVx, vy: bVy, vz: bVz,
            life: 80,
            isEnemy: false,
            isBeam,
            mesh
        });
    }, []);

    const fireWeapon = useCallback(() => {
        if (gameState !== 'playing' || fuelRef.current <= 0) return;
        
        if (weaponType.current === 'beam') {
            spawnBullet(0, 0, '#ff4757', 2.0, true);
            soundRef.current?.playShoot(true);
        } else if (weaponType.current === 'multi') {
            // Wait, multi shot needs slightly angled trajectories in 3D.
            // For simplicity, just spawn them offset.
            spawnBullet(-3, 0, '#2ed573', 1.0);
            spawnBullet(3, 0, '#2ed573', 1.0);
            spawnBullet(0, 2, '#2ed573', 1.0);
            soundRef.current?.playShoot();
        } else {
            spawnBullet(-1.5, 0, '#1dd1a1');
            spawnBullet(1.5, 0, '#1dd1a1');
            soundRef.current?.playShoot();
        }
    }, [gameState, spawnBullet]);

    // Keyboard & Mouse Events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            keys.current[k] = true;
            if (k === ' ' || k === 'p') {
                e.preventDefault();
                fireWeapon();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
        
        // Mouse steering mapping: X/Y relative to center (-1 to 1)
        const handleMouseMove = (e: MouseEvent) => {
            if (gameState !== 'playing') return;
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            // Map to [-1, 1]
            let dx = (e.clientX - cx) / (rect.width / 2);
            let dy = (e.clientY - cy) / (rect.height / 2);
            
            // Deadzone
            if (Math.abs(dx) < 0.1) dx = 0;
            if (Math.abs(dy) < 0.1) dy = 0;
            
            // Clamp
            mouseDelta.current.x = Math.max(-1, Math.min(1, dx));
            mouseDelta.current.y = Math.max(-1, Math.min(1, dy));
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (gameState === 'playing' && e.button === 0) fireWeapon();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
        };
    }, [fireWeapon, gameState]);

    // Main 6-DOF Loop
    tickRef.current = (time: number) => {
        if (gameState !== 'playing') {
            lastTime.current = time;
            animationFrameId.current = requestAnimationFrame(tickRef.current);
            return;
        }

        const rawDt = (time - lastTime.current) / 1000;
        lastTime.current = time;
        const dt = Math.min(rawDt * 60, 3.0); // Normalized to 60FPS

        const scene = sceneRef.current;
        const camera = cameraRef3D.current;
        const ship = playerShipGroup.current;
        const composer = composerRef.current;

        if (!scene || !camera || !ship || !composer) {
            animationFrameId.current = requestAnimationFrame(tickRef.current);
            return;
        }

        // --- 1. SHIP MOVEMENT (6-DOF) ---
        let pitch = -mouseDelta.current.y * 0.04 * dt;
        let yaw = -mouseDelta.current.x * 0.04 * dt;
        let roll = 0;
        
        if (keys.current['a']) roll += 0.05 * dt;
        if (keys.current['d']) roll -= 0.05 * dt;

        // Thrust
        if (keys.current['w']) {
            targetSpeed.current = Math.min(targetSpeed.current + 0.2 * dt, MAX_SPEED);
            // Fuel consumption
            if (fuelRef.current > 0) setFuelLevel(fuelRef.current - 0.05 * dt);
        } else if (keys.current['s']) {
            targetSpeed.current = Math.max(targetSpeed.current - 0.3 * dt, 0); // space brakes
        } else {
            targetSpeed.current = Math.max(targetSpeed.current - 0.01 * dt, MIN_SPEED); // idle glide
        }

        // Apply Rotations to Quaternion
        const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
        const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const qRoll = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll);
        
        shipQuaternion.current.multiply(qYaw);
        shipQuaternion.current.multiply(qPitch);
        shipQuaternion.current.multiply(qRoll);
        shipQuaternion.current.normalize();

        // Calculate Forward Velocity
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
        
        // Move Ship
        shipVel.current.copy(forward).multiplyScalar(targetSpeed.current);
        shipPos.current.addScaledVector(shipVel.current, dt);

        // Update Ship Mesh
        ship.position.copy(shipPos.current);
        ship.quaternion.copy(shipQuaternion.current);
        
        // Visual effects for thrusters based on speed
        const thrustScale = Math.max(0.5, targetSpeed.current / MAX_SPEED * 2);
        if (thrusterFlameMeshL.current) thrusterFlameMeshL.current.scale.set(1, thrustScale, 1);
        if (thrusterFlameMeshR.current) thrusterFlameMeshR.current.scale.set(1, thrustScale, 1);

        // Shield logic
        if (shieldBubbleMesh.current) {
            shieldBubbleMesh.current.visible = shieldRef.current > 0;
            const sScale = 1.0 + (100 - shieldRef.current) / 200;
            shieldBubbleMesh.current.scale.set(sScale, sScale, sScale);
            shieldBubbleMesh.current.rotation.y += 0.05 * dt;
        }

        // --- 2. CAMERA UPDATE (Chase Cam) ---
        const idealOffset = new THREE.Vector3(0, 4, 15);
        idealOffset.applyQuaternion(shipQuaternion.current);
        idealOffset.add(shipPos.current);
        
        camera.position.lerp(idealOffset, 0.15 * dt);
        
        // Look ahead
        const idealLookAt = new THREE.Vector3(0, 0, -30);
        idealLookAt.applyQuaternion(shipQuaternion.current);
        idealLookAt.add(shipPos.current);
        
        // Slerp camera rotation
        const m = new THREE.Matrix4().lookAt(camera.position, idealLookAt, new THREE.Vector3(0, 1, 0).applyQuaternion(shipQuaternion.current));
        const targetCamQuat = new THREE.Quaternion().setFromRotationMatrix(m);
        camera.quaternion.slerp(targetCamQuat, 0.15 * dt);
        
        // Screen Shake
        if (screenShakeRef.current > 0) {
            camera.position.x += (Math.random() - 0.5) * screenShakeRef.current;
            camera.position.y += (Math.random() - 0.5) * screenShakeRef.current;
            camera.position.z += (Math.random() - 0.5) * screenShakeRef.current;
            screenShakeRef.current *= 0.9;
        }

        // --- 3. BULLETS ---
        bullets.current.forEach(b => {
            if (b.life <= 0) return;
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.z += b.vz * dt;
            b.life -= dt;
            b.mesh.position.set(b.x, b.y, b.z);
        });
        bullets.current.filter(b => b.life <= 0).forEach(b => scene.remove(b.mesh));
        bullets.current = bullets.current.filter(b => b.life > 0);

        // --- 4. ENEMIES & COMBAT ---
        enemies.current.forEach(e => {
            if (!e.active) return;
            
            const eVec = new THREE.Vector3(e.x, e.y, e.z);
            const distToPlayer = eVec.distanceTo(shipPos.current);
            
            // AI Movement
            if (e.type === 'floater') {
                // Fly towards player slowly
                const dir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                e.x += dir.x * 0.5 * dt;
                e.y += dir.y * 0.5 * dt;
                e.z += dir.z * 0.5 * dt;
                
                // Rotation animation
                e.mesh.rotation.x += 0.02 * dt;
                e.mesh.rotation.y += 0.03 * dt;
            } else if (e.type === 'boss') {
                // Boss stays at distance but slowly tracks
                const dir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                e.x += dir.x * 0.2 * dt;
                e.y += dir.y * 0.2 * dt;
                e.z += dir.z * 0.2 * dt;
                e.mesh.rotation.y += 0.01 * dt;
            }

            e.mesh.position.set(e.x, e.y, e.z);

            // Firing Logic
            e.lastFire += dt;
            if (e.lastFire > e.fireCooldown && distToPlayer < 800) {
                e.lastFire = 0;
                // Enemy fire bullet towards player
                const dir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                const bSpeed = 15;
                const bGeo = new THREE.SphereGeometry(1.5, 8, 8);
                const bMat = new THREE.MeshBasicMaterial({ color: '#fbc531' });
                const bMesh = new THREE.Mesh(bGeo, bMat);
                bMesh.position.set(e.x, e.y, e.z);
                scene.add(bMesh);
                
                bullets.current.push({
                    id: Math.random(),
                    x: e.x, y: e.y, z: e.z,
                    vx: dir.x * bSpeed, vy: dir.y * bSpeed, vz: dir.z * bSpeed,
                    life: 100, isEnemy: true, mesh: bMesh
                });
            }
        });

        // Bullet Hit Detections
        bullets.current.forEach(b => {
            if (b.life <= 0) return;
            const bVec = new THREE.Vector3(b.x, b.y, b.z);

            if (b.isEnemy) {
                if (bVec.distanceTo(shipPos.current) < 10) {
                    b.life = 0;
                    screenShakeRef.current = 2.0;
                    soundRef.current?.playExplosion();
                    createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#fbc531', 10, 1.0);
                    
                    comboMultiplier.current = 1;
                    const dmg = 15;
                    if (shieldRef.current > 0) {
                        setShieldLevel(shieldRef.current - dmg * 0.7);
                        setArmorLevel(armorRef.current - dmg * 0.3);
                    } else {
                        setArmorLevel(armorRef.current - dmg);
                    }
                    addLog(`GÖVDE DARBESİ! Kalkan: %${shieldRef.current}`);
                }
            } else {
                enemies.current.forEach(e => {
                    if (!e.active) return;
                    const eVec = new THREE.Vector3(e.x, e.y, e.z);
                    const radius = e.type === 'boss' ? 30 : 8;
                    
                    if (bVec.distanceTo(eVec) < radius) {
                        if (!b.isBeam) b.life = 0;
                        e.health -= b.isBeam ? 2 : 1;
                        
                        if (e.type === 'boss') setBossHealth(Math.max(0, e.health));
                        
                        createExplosion(e.x, e.y, e.z, '#e84118', 4, 0.5);

                        if (e.health <= 0) {
                            e.active = false;
                            scene.remove(e.mesh);
                            soundRef.current?.playExplosion();
                            createExplosion(e.x, e.y, e.z, '#00d2d3', e.type === 'boss' ? 80 : 15, e.type === 'boss' ? 4.0 : 1.5);
                            
                            comboMultiplier.current += 1;
                            comboTimer.current = 120; // 2 secs roughly
                            const scoreGained = (e.type === 'boss' ? 10000 : 250) * comboMultiplier.current;
                            setScore(s => s + scoreGained);
                            addLog(`DÜŞMAN İMHA EDİLDİ! +${scoreGained}`);
                            
                            // Floating Text
                            floatingTexts.current.push({
                                id: Math.random(), text: `${scoreGained}`,
                                x: e.x, y: e.y + 10, z: e.z,
                                life: 1.5, color: comboMultiplier.current > 2 ? '#ff9f43' : '#ffffff'
                            });

                            // Drops
                            if (Math.random() > 0.8) {
                                // PowerUp
                                const pType = Math.random() > 0.5 ? 'multi' : 'beam';
                                const pGeo = new THREE.BoxGeometry(4, 4, 4);
                                const pMat = new THREE.MeshBasicMaterial({ color: pType === 'multi' ? '#0984e3' : '#d63031' });
                                const pMesh = new THREE.Mesh(pGeo, pMat);
                                pMesh.position.set(e.x, e.y, e.z);
                                scene.add(pMesh);
                                powerUps.current.push({
                                    id: Math.random(), x: e.x, y: e.y, z: e.z,
                                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: (Math.random() - 0.5) * 2,
                                    type: pType, active: true, mesh: pMesh
                                });
                            } else {
                                // Crystal
                                const cGeo = new THREE.OctahedronGeometry(2);
                                const cMat = new THREE.MeshStandardMaterial({ color: '#44bd32', emissive: '#1b4d14' });
                                const cMesh = new THREE.Mesh(cGeo, cMat);
                                cMesh.position.set(e.x, e.y, e.z);
                                scene.add(cMesh);
                                crystals.current.push({
                                    id: Math.random(), x: e.x, y: e.y, z: e.z,
                                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: (Math.random() - 0.5) * 2,
                                    active: true, mesh: cMesh
                                });
                            }

                            // Victory Check
                            if (enemies.current.filter(en => en.active).length === 0) {
                                setGameState('victory');
                                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
                            }
                        }
                    }
                });
            }
        });

        // --- 5. DROPS (Crystals & PowerUps) ---
        const handleDrops = (arr: any[], handler: (item: any) => void) => {
            arr.forEach(item => {
                if (!item.active) return;
                item.x += item.vx * dt; item.y += item.vy * dt; item.z += item.vz * dt;
                item.mesh.position.set(item.x, item.y, item.z);
                item.mesh.rotation.x += 0.02 * dt;
                item.mesh.rotation.y += 0.03 * dt;
                
                const dVec = new THREE.Vector3(item.x, item.y, item.z);
                const dist = dVec.distanceTo(shipPos.current);
                
                // Magnet
                if (dist < 150) {
                    const dir = new THREE.Vector3().subVectors(shipPos.current, dVec).normalize();
                    item.vx += dir.x * 0.5 * dt;
                    item.vy += dir.y * 0.5 * dt;
                    item.vz += dir.z * 0.5 * dt;
                }
                
                if (dist < 15) handler(item);
            });
        };

        handleDrops(crystals.current, (c) => {
            c.active = false;
            scene.remove(c.mesh);
            soundRef.current?.playCollect();
            setFuelLevel(fuelRef.current + 30);
        });
        crystals.current = crystals.current.filter(c => c.active);

        handleDrops(powerUps.current, (p) => {
            p.active = false;
            scene.remove(p.mesh);
            soundRef.current?.playCollect();
            weaponType.current = p.type;
            weaponTimer.current = 300; // ~5 secs
            addLog(`SİLAH YÜKSELTİLDİ: ${p.type.toUpperCase()}`);
        });
        powerUps.current = powerUps.current.filter(p => p.active);

        // --- 6. PARTICLES ---
        particles.current.forEach(p => {
            if (p.life <= 0) return;
            p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
            p.life -= dt;
            p.mesh.position.set(p.x, p.y, p.z);
            p.mesh.scale.multiplyScalar(0.95);
        });
        particles.current.filter(p => p.life <= 0).forEach(p => scene.remove(p.mesh));
        particles.current = particles.current.filter(p => p.life > 0);

        // --- 7. FLOATING TEXTS & UI UPDATES ---
        floatingTexts.current.forEach(ft => {
            ft.y += 0.5 * dt;
            ft.life -= 0.016 * dt;
        });
        floatingTexts.current = floatingTexts.current.filter(ft => ft.life > 0);

        if (floatingTextContainerRef.current) {
            floatingTextContainerRef.current.innerHTML = '';
            floatingTexts.current.forEach(ft => {
                const vec = new THREE.Vector3(ft.x, ft.y, ft.z);
                vec.project(camera);
                
                const width = canvasRef.current?.clientWidth || 800;
                const height = canvasRef.current?.clientHeight || 550;
                
                // Only render if in front of camera
                if (vec.z < 1) {
                    const screenX = (vec.x * 0.5 + 0.5) * width;
                    const screenY = -(vec.y * 0.5 - 0.5) * height;
                    
                    const el = document.createElement('div');
                    el.innerText = ft.text;
                    el.style.position = 'absolute';
                    el.style.left = `${screenX}px`;
                    el.style.top = `${screenY}px`;
                    el.style.color = ft.color;
                    el.style.opacity = `${Math.max(0, ft.life)}`;
                    el.style.transform = 'translate(-50%, -50%)';
                    el.style.fontWeight = 'bold';
                    el.style.fontSize = '1.2rem';
                    el.style.textShadow = `0 0 10px ${ft.color}`;
                    el.style.pointerEvents = 'none';
                    floatingTextContainerRef.current?.appendChild(el);
                }
            });
        }

        if (comboTimer.current > 0) {
            comboTimer.current -= dt;
            if (comboTimer.current <= 0) comboMultiplier.current = 1;
        }

        if (weaponTimer.current > 0) {
            weaponTimer.current -= dt;
            if (weaponTimer.current <= 0) weaponType.current = 'normal';
        }

        // Radar 3D to 2D projection (relative to ship)
        // Throttle radar updates for performance
        if (Math.random() < 0.1) {
            const radarData = enemies.current.filter(e => e.active).map(e => {
                const relativePos = new THREE.Vector3(e.x, e.y, e.z).sub(shipPos.current);
                // Rotate relative pos by inverse of ship quaternion to get local coords
                relativePos.applyQuaternion(shipQuaternion.current.clone().invert());
                return { x: relativePos.x, y: relativePos.z, z: relativePos.y, type: e.type };
            });
            setRadarEntities(radarData);
        }

        setSpeedVal(Math.round(targetSpeed.current * 100));
        setAltitudeVal(Math.round(shipPos.current.length() / 10)); // Distance from origin

        composer.render();
        animationFrameId.current = requestAnimationFrame(tickRef.current);
    };

    // Initialization Effect
    useEffect(() => {
        soundRef.current = new SoundSynth();
        initThreeWorld();
        
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            clearAllEntities();
            if (rendererRef.current) rendererRef.current.dispose();
        };
    }, [initThreeWorld, clearAllEntities]);

    // Game Control Actions
    const startGame = () => {
        setGameState('playing');
        setScore(0);
        buildLevelWorld();
        lastTime.current = performance.now();
        animationFrameId.current = requestAnimationFrame(tickRef.current);
        
        if (soundRef.current && soundRef.current.ctx.state === 'suspended') {
            soundRef.current.ctx.resume();
        }
        addLog("UZAY GÖREVİ BAŞLADI.");
    };

    const nextLevel = () => {
        setLevel(l => l + 1);
        startGame();
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-4 font-sans" ref={containerRef}>
            
            {/* Header / Top HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-black/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Hız</span>
                        <span className="text-lg font-bold text-cyan-400 font-mono">{speedVal} <span className="text-xs text-cyan-700">km/s</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Mesafe</span>
                        <span className="text-lg font-bold text-emerald-400 font-mono">{altitudeVal} <span className="text-xs text-emerald-700">ly</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Skor</span>
                        <span className="text-lg font-bold text-amber-400 font-mono">{score}</span>
                    </div>
                </div>

                <div className="flex gap-4 flex-1 max-w-sm justify-center md:justify-end">
                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Shield className="w-2.5 h-2.5 text-cyan-400" /> Kalkan</span>
                            <span className="font-mono text-cyan-400">{shield}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-cyan-400 transition-all duration-150 relative shadow-[0_0_8px_#22d3ee]" style={{ width: `${shield}%` }} />
                        </div>
                    </div>

                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Activity className="w-2.5 h-2.5 text-rose-500" /> Zırh</span>
                            <span className="font-mono text-rose-500">{armor}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-rose-500 transition-all duration-150 shadow-[0_0_8px_#f43f5e]" style={{ width: `${armor}%` }} />
                        </div>
                    </div>

                    <div className="flex flex-col w-20 md:w-24">
                        <div className="flex justify-between items-center mb-0.5 text-[9px] font-semibold text-muted-foreground uppercase">
                            <span className="flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-amber-500" /> Yakıt</span>
                            <span className="font-mono text-amber-500">{fuel}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-secondary/80 rounded-full overflow-hidden border border-white/5">
                            <div className={`h-full transition-all duration-150 shadow-[0_0_8px_#f59e0b] ${fuel < 20 ? 'bg-amber-600 animate-pulse' : 'bg-amber-500'}`} style={{ width: `${fuel}%` }} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white rounded-lg border border-white/10" onClick={toggleSound}>
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                    </Button>
                    <div className="px-2 py-1 bg-primary/20 rounded border border-primary/40 font-bold text-primary tracking-wider uppercase text-[10px]">
                        SEKTÖR {level}
                    </div>
                </div>
            </div>

            {/* Game Canvas Container */}
            <div className="relative rounded-lg overflow-hidden border border-border shadow-2xl bg-black cursor-crosshair">
                <canvas ref={canvasRef} className="w-full block focus:outline-none" style={{ height: '600px' }} width={800} height={600} tabIndex={0} />
                
                <div ref={floatingTextContainerRef} className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-10 overflow-hidden" />

                {/* Cyber Crosshair */}
                {gameState === 'playing' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-10">
                        <Crosshair className="w-8 h-8 text-cyan-400" />
                    </div>
                )}

                {/* Boss Health Bar */}
                {gameState === 'playing' && bossHealth > 0 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-96 flex flex-col items-center z-20">
                        <span className="text-rose-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]">Anomali Tespit Edildi</span>
                        <div className="w-full h-3 bg-black/60 border border-rose-500/30 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className="h-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-300 shadow-[0_0_15px_#f43f5e]" style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* Radar UI */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-4 right-4 w-32 h-32 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-none flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 m-4" />
                        <div className="absolute inset-0 rounded-full border border-cyan-500/10 m-8" />
                        <div className="w-full h-full animate-[spin_4s_linear_infinite] border-t border-cyan-400/40 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }} />
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] z-10" />
                        <div className="absolute text-[8px] text-cyan-500/50 top-2 font-mono">N</div>
                        <div className="absolute text-[8px] text-cyan-500/50 right-2 font-mono">E</div>
                        
                        {radarEntities.map((e, idx) => {
                            // Map local space coords to radar scale (1 unit = 5 px, clamp to radius)
                            const scale = 0.05;
                            const rx = Math.max(-14, Math.min(14, e.x * scale));
                            const ry = Math.max(-14, Math.min(14, e.y * scale)); // use local Z as Y on radar
                            
                            return (
                                <div key={idx} className={`absolute w-1.5 h-1.5 rounded-full ${e.type === 'boss' ? 'bg-purple-500 w-2.5 h-2.5 shadow-[0_0_8px_#a855f7]' : 'bg-rose-500 shadow-[0_0_5px_#f43f5e]'}`} style={{ transform: `translate(${rx}px, ${ry}px)` }} />
                            );
                        })}
                    </div>
                )}

                {/* Flight Log */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-4 left-4 p-3 rounded-lg border border-white/5 bg-black/55 backdrop-blur-sm max-w-xs text-[10px] text-emerald-400 font-mono tracking-wide pointer-events-none z-10 flex flex-col gap-1 shadow-md">
                        <div className="text-[8px] text-muted-foreground border-b border-white/10 pb-0.5 mb-1 uppercase font-bold flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5" /> Sistem Kayıtları
                        </div>
                        {logMessages.map((log, idx) => (
                            <div key={idx} className={`${idx === 0 ? 'text-emerald-300 font-bold opacity-100' : 'opacity-65'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}

                {/* Overlays */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-300 mb-4 tracking-tighter drop-shadow-lg">
                            GRAVITY WARRIOR <span className="text-rose-500">3D</span>
                        </h1>
                        <p className="text-muted-foreground max-w-md text-center mb-8">
                            Uzay boşluğunda tam 6 eksenli (6-DOF) uçuş simülasyonu. 
                        </p>
                        <Button onClick={startGame} size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-12 py-6 text-lg rounded-full shadow-[0_0_20px_#22d3ee] transition-all hover:scale-105">
                            SİMÜLASYONU BAŞLAT
                        </Button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
                        <h2 className="text-4xl font-black text-white mb-2 tracking-widest drop-shadow-[0_0_15px_#f43f5e]">GEMİ YOK EDİLDİ</h2>
                        <p className="text-rose-200 mb-8 font-mono">Ulaşılan Sektör: {level} | Skor: {score}</p>
                        <Button onClick={startGame} className="bg-white text-rose-900 hover:bg-rose-100 font-bold">
                            SİSTEMİ YENİDEN BAŞLAT
                        </Button>
                    </div>
                )}

                {gameState === 'victory' && (
                    <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-md flex flex-col items-center justify-center z-30">
                        <h2 className="text-4xl font-black text-white mb-2 tracking-widest drop-shadow-[0_0_15px_#10b981]">SEKTÖR TEMİZLENDİ</h2>
                        <p className="text-emerald-200 mb-8 font-mono">Skor: {score}</p>
                        <Button onClick={nextLevel} className="bg-white text-emerald-900 hover:bg-emerald-100 font-bold">
                            SONRAKİ SEKTÖRE ATLA
                        </Button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="bg-secondary/40 p-4 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Uçuş Kontrolü</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Farenizi ekranda gezdirerek geminin burnunu yönlendirin (Pitch/Yaw).</p>
                </div>
                <div className="bg-secondary/40 p-4 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Manevra & İtki</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed"><kbd className="bg-black border border-white/20 px-1 py-0.5 rounded">W</kbd> / <kbd className="bg-black border border-white/20 px-1 py-0.5 rounded">S</kbd> tuşları ile itki ve fren yapın. <kbd className="bg-black border border-white/20 px-1 py-0.5 rounded">A</kbd> / <kbd className="bg-black border border-white/20 px-1 py-0.5 rounded">D</kbd> ile gemiyi ekseninde döndürün (Roll).</p>
                </div>
                <div className="bg-secondary/40 p-4 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5" /> Silahlar</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed"><kbd className="bg-black border border-white/20 px-1 py-0.5 rounded">SPACE</kbd> tuşu veya Fare Sol Tık ile nişangahın baktığı yöne ateş edin.</p>
                </div>
                <div className="bg-secondary/40 p-4 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Taktik</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Uzay boşluğunda düşmanları avlayıp güçlendiricileri (Kırmızı/Mavi) toplayarak silahlarınızı geliştirin.</p>
                </div>
            </div>
        </div>
    );
}
