"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { Activity, Shield, Flame, Target, Volume2, VolumeX, Crosshair, Zap, Navigation, Sparkles, ZapOff } from 'lucide-react';
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

interface Shockwave {
    life: number;
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
    headMesh?: THREE.Group | THREE.Mesh;
    bossRing1?: THREE.Mesh;
    bossRing2?: THREE.Mesh;
    warningFlare?: THREE.Mesh | null;
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
    type: 'multi' | 'beam' | 'slowmo';
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
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;
    enabled: boolean = true;
    
    // Ambient engine sound
    ambientOsc: OscillatorNode | null = null;
    ambientFilter: BiquadFilterNode | null = null;
    ambientGain: GainNode | null = null;

    // Sequencer properties
    sequencerTimer: any = null;
    isPlayingMusic: boolean = false;
    bossActive: boolean = false;
    currentStep: number = 0;
    noiseBuffer: AudioBuffer | null = null;

    constructor() {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.4;
                this.masterGain.connect(this.ctx.destination);

                // Pre-generate noise buffer for hi-hats
                const bufferSize = this.ctx.sampleRate * 2;
                this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = this.noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
            }
        } catch (e) {
            console.error("SoundSynth AudioContext failed to initialize:", e);
        }
    }
    
    setEnabled(val: boolean) {
        this.enabled = val;
        if (this.masterGain) {
            this.masterGain.gain.value = val ? 0.4 : 0;
        }
    }

    startAmbient() {
        if (!this.enabled || !this.ctx || !this.masterGain || this.ambientOsc) return;
        try {
            const osc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low pitch rumble

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, this.ctx.currentTime);
            filter.Q.setValueAtTime(3.0, this.ctx.currentTime); 

            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc.start();

            this.ambientOsc = osc;
            this.ambientFilter = filter;
            this.ambientGain = gain;
        } catch (e) {
            console.warn("Failed to start ambient audio:", e);
        }
    }

    updateAmbient(speedRatio: number) {
        if (!this.enabled || !this.ctx || !this.ambientOsc || !this.ambientFilter) return;
        try {
            const targetPitch = 45 + speedRatio * 35; // 45Hz to 80Hz
            const targetCutoff = 150 + speedRatio * 400; // 150Hz to 550Hz
            
            this.ambientOsc.frequency.setTargetAtTime(targetPitch, this.ctx.currentTime, 0.1);
            this.ambientFilter.frequency.setTargetAtTime(targetCutoff, this.ctx.currentTime, 0.1);
        } catch (e) {}
    }

    stopAmbient() {
        if (this.ambientOsc) {
            try {
                this.ambientOsc.stop();
                this.ambientOsc.disconnect();
            } catch (e) {}
            this.ambientOsc = null;
        }
        if (this.ambientFilter) {
            try {
                this.ambientFilter.disconnect();
            } catch (e) {}
            this.ambientFilter = null;
        }
        if (this.ambientGain) {
            try {
                this.ambientGain.disconnect();
            } catch (e) {}
            this.ambientGain = null;
        }
    }

    playShoot(isBeam = false) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
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
        } catch (e) {}
    }

    playExplosion() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
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
        } catch (e) {}
    }

    playCollect() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
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
        } catch (e) {}
    }

    playWarning() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, this.ctx.currentTime); // High alert tone
            gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }

    playHyperspace() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 1.5);
            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 1.0);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2.0);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 2.0);
        } catch (e) {}
    }

    playNote(freq: number, type: 'sawtooth' | 'triangle' | 'square' | 'sine', duration: number, volume: number) {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            const filterNode = this.ctx.createBiquadFilter();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(freq * 3, this.ctx.currentTime);
            filterNode.Q.setValueAtTime(1, this.ctx.currentTime);

            gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.masterGain);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch(e){}
    }

    playNoise(duration: number, volume: number) {
        if (!this.enabled || !this.ctx || !this.masterGain || !this.noiseBuffer) return;
        try {
            const source = this.ctx.createBufferSource();
            source.buffer = this.noiseBuffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(6000, this.ctx.currentTime);
            filter.Q.setValueAtTime(2, this.ctx.currentTime);

            const gainNode = this.ctx.createGain();
            gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            source.start();
            source.stop(this.ctx.currentTime + duration);
        } catch(e){}
    }

    startSequencer(isBoss = false) {
        if (!this.ctx) return;
        
        this.stopSequencer();
        this.isPlayingMusic = true;
        this.bossActive = isBoss;

        const bpm = isBoss ? 140 : 110;
        const stepTime = 60 / bpm / 2;
        
        const tick = () => {
            if (!this.isPlayingMusic || !this.ctx) return;

            const bass = [55, 55, 65.4, 55, 73.4, 55, 82.4, 98];
            const bossBass = [55, 55, 48.99, 48.99, 43.65, 43.65, 48.99, 55];

            const melody = [0, 220, 0, 261.6, 293.7, 0, 329.6, 392.0];
            const bossMelody = [0, 220, 233.08, 0, 277.18, 293.66, 0, 311.13];

            const step = this.currentStep % 8;
            
            const bNote = this.bossActive ? bossBass[step] : bass[step];
            if (bNote > 0) {
                this.playNote(bNote, 'sawtooth', stepTime * 0.9, 0.12);
            }

            const mNote = this.bossActive ? bossMelody[step] : melody[step];
            if (mNote > 0 && Math.random() > 0.3) {
                this.playNote(mNote, 'triangle', stepTime * 1.5, 0.08);
            }

            if (step % 2 === 1) {
                this.playNoise(0.04, 0.05);
            } else if (step === 4 && Math.random() > 0.5) {
                this.playNoise(0.15, 0.03);
            }

            this.currentStep++;
            this.sequencerTimer = setTimeout(tick, stepTime * 1000);
        };

        tick();
    }

    stopSequencer() {
        this.isPlayingMusic = false;
        if (this.sequencerTimer) {
            clearTimeout(this.sequencerTimer);
            this.sequencerTimer = null;
        }
    }
}

// Global Consts & Ship Specs
const MIN_SPEED = 0.5;

interface ShipClass {
    id: 'vanguard' | 'interceptor' | 'dreadnought';
    name: string;
    description: string;
    maxSpeed: number;
    maxShield: number;
    maxArmor: number;
    laserColor: string;
    weaponPattern: 'normal' | 'multi' | 'beam';
    turnSensitivity: number;
    modelColor: number;
}

const SHIP_CLASSES: ShipClass[] = [
    {
        id: 'vanguard',
        name: 'Void Vanguard',
        description: 'Dengeli uçuş modülü ve standart çift yeşil lazer silahı ile donatılmış standart zırhlı kruvazör.',
        maxSpeed: 8.0,
        maxShield: 100,
        maxArmor: 100,
        laserColor: '#0be881',
        weaponPattern: 'normal',
        turnSensitivity: 0.02,
        modelColor: 0x222222
    },
    {
        id: 'interceptor',
        name: 'Nevbara Interceptor',
        description: 'Yüksek manevra kabiliyeti, artırılmış maksimum hız ve seri ateşlenen turuncu plazma lazerleri. Düşük kalkan.',
        maxSpeed: 11.5,
        maxShield: 70,
        maxArmor: 80,
        laserColor: '#ff9f43',
        weaponPattern: 'multi',
        turnSensitivity: 0.027,
        modelColor: 0xe67e22
    },
    {
        id: 'dreadnought',
        name: 'Titan Dreadnought',
        description: 'Güçlendirilmiş titanyum zırh ve aşırı yüklenmiş kalkan jeneratörleri. Yavaş hız, yıkıcı mavi dalga lazeri.',
        maxSpeed: 6.0,
        maxShield: 150,
        maxArmor: 150,
        laserColor: '#00d2d3',
        weaponPattern: 'beam',
        turnSensitivity: 0.015,
        modelColor: 0x2c3e50
    }
];

const createCosmicCruiser = (colorStr: string) => {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ 
        color: colorStr, 
        metalness: 0.9, 
        roughness: 0.1, 
        emissive: colorStr, 
        emissiveIntensity: 0.15 
    });
    
    // Main Hull (sleek star destroyer shape)
    const hullGeo = new THREE.ConeGeometry(15, 60, 4);
    const hull = new THREE.Mesh(hullGeo, mat);
    hull.rotation.x = Math.PI / 2;
    group.add(hull);
    
    // Command Bridge
    const bridgeGeo = new THREE.BoxGeometry(10, 5, 8);
    const bridge = new THREE.Mesh(bridgeGeo, mat);
    bridge.position.set(0, 5, 10);
    group.add(bridge);
    
    // Left Wing
    const leftWingGeo = new THREE.BoxGeometry(25, 2, 20);
    const leftWing = new THREE.Mesh(leftWingGeo, mat);
    leftWing.position.set(-18, -2, 5);
    leftWing.rotation.y = 0.2;
    group.add(leftWing);
    
    // Right Wing
    const rightWingGeo = new THREE.BoxGeometry(25, 2, 20);
    const rightWing = new THREE.Mesh(rightWingGeo, mat);
    rightWing.position.set(18, -2, 5);
    rightWing.rotation.y = -0.2;
    group.add(rightWing);
    
    // Engines
    const engGeo = new THREE.CylinderGeometry(4, 4, 10, 8);
    const engMat = new THREE.MeshBasicMaterial({ color: '#00d2d3' });
    
    const engLeft = new THREE.Mesh(engGeo, engMat);
    engLeft.rotation.x = Math.PI / 2;
    engLeft.position.set(-6, 0, 30);
    group.add(engLeft);
    
    const engRight = new THREE.Mesh(engGeo, engMat);
    engRight.rotation.x = Math.PI / 2;
    engRight.position.set(6, 0, 30);
    group.add(engRight);
    
    return group;
};

export function SpaceBomberGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const floatingTextContainerRef = useRef<HTMLDivElement>(null);

    // Direct DOM HUD references to eliminate React re-render overhead at 60 FPS
    const hudSpeedRef = useRef<HTMLSpanElement>(null);
    const hudDistanceRef = useRef<HTMLSpanElement>(null);
    const hudScoreRef = useRef<HTMLSpanElement>(null);
    const hudShieldBarRef = useRef<HTMLDivElement>(null);
    const hudShieldTextRef = useRef<HTMLSpanElement>(null);
    const hudArmorBarRef = useRef<HTMLDivElement>(null);
    const hudArmorTextRef = useRef<HTMLSpanElement>(null);
    const hudFuelBarRef = useRef<HTMLDivElement>(null);
    const hudFuelTextRef = useRef<HTMLSpanElement>(null);
    const hudDamageVignetteRef = useRef<HTMLDivElement>(null);
    const hudProximityDangerRef = useRef<HTMLDivElement>(null);
    const hudComboRef = useRef<HTMLDivElement>(null);
    const hudEnemiesRef = useRef<HTMLSpanElement>(null);
    const hudSlowmoVignetteRef = useRef<HTMLDivElement>(null);
    const hudLowArmorAlertRef = useRef<HTMLDivElement>(null);

    const scoreRef = useRef<number>(0);
    const totalEnemiesRef = useRef<number>(0);
    const enemiesRemainingRef = useRef<number>(0);
    const graphicsQualityRef = useRef<'high' | 'perf'>('high');
    const [graphicsQuality, setGraphicsQuality] = useState<'high' | 'perf'>('high');

    // Gameplay timers and state refs (direct updates to bypass React rerender loop)
    const autoFireTimer = useRef<number>(0);
    const shieldRegenTimer = useRef<number>(0);
    const damageVignetteRef = useRef<number>(0);
    const proximityDangerRef = useRef<number>(0);
    const bossPhase = useRef<number>(1);
    const hitFlashMap = useRef<Map<number, number>>(new Map());
    
    // Time dilation and slow-mo bullet time
    const timeDilationRef = useRef<number>(1.0);
    const bulletTimeTimerRef = useRef<number>(0);
    const lastWarningSoundTime = useRef<number>(0);

    // Sound manager ref
    const soundRef = useRef<SoundSynth | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Ship Class state
    const [selectedShipId, setSelectedShipId] = useState<'vanguard' | 'interceptor' | 'dreadnought'>('vanguard');
    const [webglError, setWebglError] = useState<string | null>(null);

    const currentShipClass = useMemo(() => {
        return SHIP_CLASSES.find(s => s.id === selectedShipId) || SHIP_CLASSES[0];
    }, [selectedShipId]);

    // Game states
    const [gameState, setGameState] = useState<'idle' | 'hyperspace' | 'playing' | 'paused' | 'gameover' | 'victory'>('idle');
    const [score, setScore] = useState(0);
    const [fuel, setFuel] = useState(100);
    const [shield, setShield] = useState(100);
    const [armor, setArmor] = useState(100);
    const [level, setLevel] = useState(1);
    const [targetLocked, setTargetLocked] = useState(false);
    
    // Mouse tracker for UI via DOM ref (fixes performance freeze from React state)
    const cursorRef = useRef<HTMLDivElement>(null);
    
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

    // Three.js instances
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef3D = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const glitchPassRef = useRef<GlitchPass | null>(null);
    const screenShakeRef = useRef<number>(0);
    const lastGamepadFire = useRef<number>(0);
    const wormholeMatRef = useRef<THREE.ShaderMaterial | null>(null);
    
    // 3D Objects
    const playerShipGroup = useRef<THREE.Group | null>(null);
    const thrusterFlameMeshL = useRef<THREE.Mesh | null>(null);
    const thrusterFlameMeshR = useRef<THREE.Mesh | null>(null);
    const shieldBubbleMesh = useRef<THREE.Mesh | null>(null);
    const speedLinesGroup = useRef<THREE.Group | null>(null);
    const shieldHitLife = useRef<number>(0);
    const asteroidMesh = useRef<THREE.InstancedMesh | null>(null);
    const starPoints = useRef<THREE.Points | null>(null);
    const starMaterial = useRef<THREE.PointsMaterial | null>(null);
    const engineParticleGeo = useRef<THREE.BoxGeometry | null>(null);
    const engineParticleMat = useRef<THREE.MeshBasicMaterial | null>(null);
    const warpTunnelMesh = useRef<THREE.Mesh | null>(null);
    const warpTunnelMat = useRef<THREE.ShaderMaterial | null>(null);

    // Physics state refs (6-DOF)
    const shipPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const shipVel = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
    const shipQuaternion = useRef<THREE.Quaternion>(new THREE.Quaternion());
    const targetSpeed = useRef<number>(MIN_SPEED);
    const mouseDelta = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
    
    const particles = useRef<Particle[]>([]);
    const shockwaves = useRef<Shockwave[]>([]);
    const bullets = useRef<Bullet[]>([]);
    const enemies = useRef<Enemy[]>([]);
    const crystals = useRef<FuelCrystal[]>([]);
    const powerUps = useRef<PowerUp[]>([]);
    const floatingTexts = useRef<FloatingText[]>([]);
    const cosmicFleet = useRef<{ mesh: THREE.Group; fireTimer: number; fireCooldown: number; }[]>([]);
    const cosmicLasers = useRef<{ mesh: THREE.Line; life: number; }[]>([]);
    
    const comboMultiplier = useRef<number>(1);
    const comboTimer = useRef<number>(0);
    const weaponType = useRef<'normal' | 'multi' | 'beam'>('normal');
    const weaponTimer = useRef<number>(0);
    const hyperspaceTimer = useRef<number>(0);
    
    const keys = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>(0);
    const lastTime = useRef<number>(0);
    const tickRef = useRef<(time: number) => void>(() => {});

    // Radar points
    const [radarEntities, setRadarEntities] = useState<{ x: number, y: number, z: number, type: string }[]>([]);

    const addLog = useCallback((msg: string) => {
        const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false });
        setLogMessages(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 4)]);
    }, []);

    const toggleSound = () => {
        if (soundRef.current) {
            soundRef.current.setEnabled(!soundEnabled);
            setSoundEnabled(!soundEnabled);
        }
    };

    const toggleQuality = () => {
        const nextQ = graphicsQualityRef.current === 'high' ? 'perf' : 'high';
        setGraphicsQuality(nextQ);
        graphicsQualityRef.current = nextQ;
        addLog(nextQ === 'high' ? "GÖRSEL: YÜKSEK (BLOOM AKTİF)" : "GÖRSEL: HIZLI (BLOOM DEVRE DIŞI)");
    };

    const createShockwave = useCallback((x: number, y: number, z: number, color: string) => {
        if (!sceneRef.current) return;
        const swGeo = new THREE.SphereGeometry(1, 16, 16);
        const swMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, wireframe: true });
        const swMesh = new THREE.Mesh(swGeo, swMat);
        swMesh.position.set(x, y, z);
        sceneRef.current.add(swMesh);
        shockwaves.current.push({ life: 1.0, mesh: swMesh });
    }, []);

    const createExplosion = useCallback((x: number, y: number, z: number, color: string, count: number, sizeScale: number) => {
        if (!sceneRef.current) return;
        const pGeo = new THREE.BoxGeometry(sizeScale, sizeScale, sizeScale);
        const pMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
        
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(pGeo, pMat);
            mesh.position.set(x, y, z);
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sceneRef.current.add(mesh);
            
            particles.current.push({
                x, y, z,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                vz: (Math.random() - 0.5) * 6,
                life: 15 + Math.random() * 25,
                color,
                size: sizeScale,
                mesh
            });
        }
    }, []);

    const setFuelLevel = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(100, value));
        fuelRef.current = clamped;
        if (hudFuelBarRef.current) {
            hudFuelBarRef.current.style.width = `${Math.round(clamped)}%`;
            if (clamped < 20) {
                hudFuelBarRef.current.classList.add('animate-pulse');
            } else {
                hudFuelBarRef.current.classList.remove('animate-pulse');
            }
        }
        if (hudFuelTextRef.current) {
            hudFuelTextRef.current.textContent = `${Math.round(clamped)}%`;
        }
    }, []);

    const setShieldLevel = useCallback((value: number) => {
        if (value < shieldRef.current) {
            shieldHitLife.current = 1.0;
        }
        const clamped = Math.max(0, Math.min(currentShipClass.maxShield, value));
        shieldRef.current = clamped;
        const pct = Math.round((clamped / currentShipClass.maxShield) * 100);
        if (hudShieldBarRef.current) {
            hudShieldBarRef.current.style.width = `${pct}%`;
        }
        if (hudShieldTextRef.current) {
            hudShieldTextRef.current.textContent = `${pct}%`;
        }
    }, [currentShipClass]);

    const setArmorLevel = useCallback((value: number) => {
        const clamped = Math.max(0, Math.min(currentShipClass.maxArmor, value));
        const prevArmor = armorRef.current;
        armorRef.current = clamped;
        const pct = Math.round((clamped / currentShipClass.maxArmor) * 100);
        if (hudArmorBarRef.current) {
            hudArmorBarRef.current.style.width = `${pct}%`;
        }
        if (hudArmorTextRef.current) {
            hudArmorTextRef.current.textContent = `${pct}%`;
        }

        if (clamped <= 0) {
            soundRef.current?.playExplosion();
            soundRef.current?.stopAmbient();
            soundRef.current?.stopSequencer();
            createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#ff4a11', 150, 3.5);
            createShockwave(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#ff4a11');
            setScore(scoreRef.current);
            setFuel(Math.round(fuelRef.current));
            setShield(Math.round(shieldRef.current));
            setArmor(Math.round(armorRef.current));
            setGameState('gameover');
            if (playerShipGroup.current) playerShipGroup.current.visible = false;
        } else if (value < prevArmor) {
            // Trigger Glitch
            if (glitchPassRef.current) {
                glitchPassRef.current.enabled = true;
                setTimeout(() => { if (glitchPassRef.current) glitchPassRef.current.enabled = false; }, 200);
            }
        }
    }, [createExplosion, createShockwave, currentShipClass]);

    const clearAllEntities = useCallback(() => {
        const scene = sceneRef.current;
        if (!scene) return;
        bullets.current.forEach(b => scene.remove(b.mesh)); bullets.current = [];
        enemies.current.forEach(e => {
            scene.remove(e.mesh);
            if (e.warningFlare) scene.remove(e.warningFlare);
        });
        enemies.current = [];
        crystals.current.forEach(c => scene.remove(c.mesh)); crystals.current = [];
        powerUps.current.forEach(p => scene.remove(p.mesh)); powerUps.current = [];
        particles.current.forEach(p => scene.remove(p.mesh)); particles.current = [];
        shockwaves.current.forEach(s => scene.remove(s.mesh)); shockwaves.current = [];
        cosmicFleet.current.forEach(f => scene.remove(f.mesh)); cosmicFleet.current = [];
        cosmicLasers.current.forEach(l => scene.remove(l.mesh)); cosmicLasers.current = [];
    }, []);

    // Setup 3D Scene structures
    const initThreeWorld = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }

            const width = canvas.clientWidth || 800;
            const height = canvas.clientHeight || 550;

            const scene = new THREE.Scene();
            scene.background = new THREE.Color('#030109');
            scene.fog = new THREE.FogExp2('#030109', 0.0010);
            sceneRef.current = scene;

            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 8000);
            camera.position.set(0, 10, 30);
            cameraRef3D.current = camera;

            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            rendererRef.current = renderer;

            const composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            const filmPass = new FilmPass(0.35, false);
            composer.addPass(filmPass);

            const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.25, 0.3, 0.9);
            composer.addPass(bloomPass);
            
            const glitchPass = new GlitchPass();
            glitchPass.enabled = false;
            glitchPass.goWild = false;
            composer.addPass(glitchPass);
            
            composerRef.current = composer;
            glitchPassRef.current = glitchPass;

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xa29bfe, 2.0);
            dirLight.position.set(100, 200, 50);
            scene.add(dirLight);

            // --- SHIP MESH (Advanced Starfighter) ---
            const shipGroup = new THREE.Group();
            
            if (currentShipClass.id === 'dreadnought') {
                shipGroup.scale.set(1.4, 1.3, 1.2);
            } else if (currentShipClass.id === 'interceptor') {
                shipGroup.scale.set(0.85, 0.85, 0.95);
            } else {
                shipGroup.scale.set(1.0, 1.0, 1.0);
            }
            
            // Fuselage
            const fuselageGeo = new THREE.BoxGeometry(2, 1.5, 8);
            const fuselageMat = new THREE.MeshStandardMaterial({ color: currentShipClass.modelColor, roughness: 0.2, metalness: 0.9 });
            const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat);
            shipGroup.add(fuselage);

            // Nose
            const noseGeo = new THREE.ConeGeometry(1, 5, 4);
            const noseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.9 });
            const nose = new THREE.Mesh(noseGeo, noseMat);
            nose.position.set(0, 0, -6.5);
            nose.rotation.x = -Math.PI / 2;
            nose.rotation.y = Math.PI / 4;
            shipGroup.add(nose);

            // Cockpit
            const cockpitGeo = new THREE.BoxGeometry(1.4, 1.2, 3);
            const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8, roughness: 0.1, metalness: 1.0, emissive: 0x005555 });
            const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
            cockpit.position.set(0, 1.2, -1);
            shipGroup.add(cockpit);

            // Wings (Swept back)
            const wingShape = new THREE.Shape();
            wingShape.moveTo(0, 0);
            if (currentShipClass.id === 'interceptor') {
                wingShape.lineTo(9, -6);
                wingShape.lineTo(9, -8);
            } else if (currentShipClass.id === 'dreadnought') {
                wingShape.lineTo(7, -3);
                wingShape.lineTo(7, -5);
            } else {
                wingShape.lineTo(8, -4);
                wingShape.lineTo(8, -6);
            }
            wingShape.lineTo(0, -2);
            
            const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
            const wingGeoL = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
            const wingMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.8 });
            
            const wingL = new THREE.Mesh(wingGeoL, wingMat);
            wingL.rotation.x = Math.PI / 2;
            wingL.position.set(0, -0.2, 2);
            shipGroup.add(wingL);

            const wingGeoR = wingGeoL.clone();
            wingGeoR.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
            const wingR = new THREE.Mesh(wingGeoR, wingMat);
            wingR.rotation.x = Math.PI / 2;
            wingR.position.set(0, -0.2, 2);
            shipGroup.add(wingR);
            
            // Wingtips Glow
            const wingTipGeo = new THREE.BoxGeometry(0.4, 1.5, 3);
            const tipColor = new THREE.Color(currentShipClass.laserColor);
            const wingTipMat = new THREE.MeshStandardMaterial({ color: tipColor, emissive: tipColor, emissiveIntensity: 1.5 });
            const wingTipL = new THREE.Mesh(wingTipGeo, wingTipMat);
            const tipX = currentShipClass.id === 'interceptor' ? -9 : (currentShipClass.id === 'dreadnought' ? -7 : -8);
            wingTipL.position.set(tipX, 0.2, 5);
            shipGroup.add(wingTipL);
            const wingTipR = new THREE.Mesh(wingTipGeo, wingTipMat);
            wingTipR.position.set(-tipX, 0.2, 5);
            shipGroup.add(wingTipR);

            // Thrusters
            const thrusterGeo = new THREE.CylinderGeometry(0.6, 0.9, 2, 8);
            const thrusterMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.9 });
            const thrusterL = new THREE.Mesh(thrusterGeo, thrusterMat);
            thrusterL.rotation.x = Math.PI / 2;
            thrusterL.position.set(-1.5, 0, 4);
            shipGroup.add(thrusterL);
            
            const thrusterR = new THREE.Mesh(thrusterGeo, thrusterMat);
            thrusterR.rotation.x = Math.PI / 2;
            thrusterR.position.set(1.5, 0, 4);
            shipGroup.add(thrusterR);

            // Flames
            const flameGeo = new THREE.ConeGeometry(0.4, 2.0, 8);
            const flameMat = new THREE.MeshBasicMaterial({ color: tipColor, transparent: true, opacity: 0.2 });
            const flameL = new THREE.Mesh(flameGeo, flameMat);
            flameL.rotation.x = -Math.PI / 2;
            flameL.position.set(-1.5, 0, 5.0);
            shipGroup.add(flameL);
            thrusterFlameMeshL.current = flameL;

            const flameR = new THREE.Mesh(flameGeo, flameMat);
            flameR.rotation.x = -Math.PI / 2;
            flameR.position.set(1.5, 0, 5.0);
            shipGroup.add(flameR);
            thrusterFlameMeshR.current = flameR;

            // Shield Bubble
            const shieldGeo = new THREE.SphereGeometry(currentShipClass.id === 'dreadnought' ? 8.5 : 7, 16, 16);
            const sMat = new THREE.MeshBasicMaterial({ 
                color: tipColor, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.0,
                blending: THREE.AdditiveBlending 
            });
            const shieldBubble = new THREE.Mesh(shieldGeo, sMat);
            shipGroup.add(shieldBubble);
            shieldBubbleMesh.current = shieldBubble;

            scene.add(shipGroup);
            playerShipGroup.current = shipGroup;

            // --- WARP / SPEED LINES ---
            const linesGroup = new THREE.Group();
            const lineMat = new THREE.LineBasicMaterial({ color: tipColor, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending });
            for (let i = 0; i < 40; i++) {
                const points = [];
                points.push(new THREE.Vector3(0, 0, 0));
                points.push(new THREE.Vector3(0, 0, -12));
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeo, lineMat);
                line.position.set(
                    (Math.random() - 0.5) * 140,
                    (Math.random() - 0.5) * 140,
                    -100 - Math.random() * 200
                );
                linesGroup.add(line);
            }
            scene.add(linesGroup);
            speedLinesGroup.current = linesGroup;

            // --- STARFIELD ---
            const sGeo = new THREE.BufferGeometry();
            const starCount = 8000;
            const sPos = new Float32Array(starCount * 3);
            const sColors = new Float32Array(starCount * 3);
            const c1 = new THREE.Color('#ffffff');
            const c2 = new THREE.Color(currentShipClass.laserColor);
            const c3 = new THREE.Color('#ff00ff');

            for (let i = 0; i < starCount; i++) {
                const r = 300 + Math.random() * 4000;
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                
                sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
                sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                sPos[i * 3 + 2] = r * Math.cos(phi);

                const rnd = Math.random();
                const col = rnd > 0.9 ? c2 : (rnd > 0.8 ? c3 : c1);
                sColors[i * 3] = col.r;
                sColors[i * 3 + 1] = col.g;
                sColors[i * 3 + 2] = col.b;
            }
            sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
            sGeo.setAttribute('color', new THREE.BufferAttribute(sColors, 3));
            const sMat2 = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true });
            starMaterial.current = sMat2;
            const stars = new THREE.Points(sGeo, sMat2);
            scene.add(stars);
            starPoints.current = stars;



            // --- GLSL WORMHOLE SHADER ---
            const portalGeo = new THREE.PlaneGeometry(6000, 6000);
            const portalMat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    color: { value: new THREE.Color(currentShipClass.laserColor) }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    varying vec2 vUv;
                    void main() {
                        vec2 p = -1.0 + 2.0 * vUv;
                        float r = length(p);
                        float a = atan(p.y, p.x);
                        float f = cos(a * 8.0 + time * 1.5) * sin(r * 15.0 - time * 3.0);
                        float glow = 0.05 / r;
                        float alpha = smoothstep(1.0, 0.0, r) * (f * 0.5 + 0.5 + glow);
                        gl_FragColor = vec4(color * glow * 2.0, alpha * 0.4);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const portalMesh = new THREE.Mesh(portalGeo, portalMat);
            portalMesh.position.set(0, 0, -4500);
            scene.add(portalMesh);
            wormholeMatRef.current = portalMat;

            // --- WARP TUNNEL CYLINDER ---
            const tunnelGeo = new THREE.CylinderGeometry(150, 150, 2000, 32, 1, true);
            tunnelGeo.rotateX(Math.PI / 2);
            
            const tunnelMat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    color: { value: new THREE.Color(currentShipClass.laserColor) },
                    opacity: { value: 0.0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float opacity;
                    varying vec2 vUv;
                    
                    void main() {
                        float stripe = sin(vUv.x * 60.0) * sin(vUv.y * 10.0 - time * 8.0);
                        stripe = step(0.1, stripe);
                        
                        float line = step(0.98, sin(vUv.y * 100.0 - time * 15.0));
                        float finalVal = clamp(stripe * 0.4 + line * 0.8, 0.0, 1.0);
                        
                        float fade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
                        gl_FragColor = vec4(color * (finalVal + 0.2), finalVal * opacity * fade);
                    }
                `,
                transparent: true,
                side: THREE.BackSide,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            
            const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
            tunnelMesh.visible = false;
            scene.add(tunnelMesh);
            
            warpTunnelMesh.current = tunnelMesh;
            warpTunnelMat.current = tunnelMat;

            // --- ENGINE PARTICLE GEOMETRY & MATERIAL ---
            const pSize = 0.15;
            engineParticleGeo.current = new THREE.BoxGeometry(pSize, pSize, pSize);
            engineParticleMat.current = new THREE.MeshBasicMaterial({ 
                color: new THREE.Color(currentShipClass.laserColor), 
                transparent: true, 
                opacity: 0.15
            });
        } catch (e: any) {
            console.error("WebGL Init failed:", e);
            setWebglError(e.message || "WebGL initialization failed. Make sure your browser has hardware acceleration enabled.");
        }
    }, [currentShipClass]);

    const triggerHyperspace = useCallback(() => {
        setGameState('hyperspace');
        hyperspaceTimer.current = 100; // frames
        soundRef.current?.playHyperspace();
        addLog("HİPER UZAY MOTORLARI AKTİF! ATLAYIŞ BAŞLIYOR.");
    }, [addLog]);

    const createTurretMesh = useCallback((color: string) => {
        const group = new THREE.Group();
        
        // Base - Heavy octagonal base cylinder
        const baseGeo = new THREE.CylinderGeometry(8, 10, 4, 8);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.8, roughness: 0.2 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = -2;
        group.add(base);
        
        // Joint - Sphere swivel
        const jointGeo = new THREE.SphereGeometry(3, 12, 12);
        const jointMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 1.0, roughness: 0.1 });
        const joint = new THREE.Mesh(jointGeo, jointMat);
        joint.position.y = 1;
        group.add(joint);
        
        // Head - Sleek cylinder head pointing forward
        const head = new THREE.Group();
        head.position.y = 1;
        group.add(head);
        
        const capGeo = new THREE.CylinderGeometry(4.5, 4.5, 6, 12);
        capGeo.rotateX(Math.PI / 2);
        const capMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 0.9, roughness: 0.1 });
        const cap = new THREE.Mesh(capGeo, capMat);
        head.add(cap);
        
        // Dual Barrels
        const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 9, 8);
        barrelGeo.rotateX(Math.PI / 2);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x34495e, metalness: 0.9, roughness: 0.2 });
        
        const barrelL = new THREE.Mesh(barrelGeo, barrelMat);
        barrelL.position.set(-2.2, 0, -4.5);
        head.add(barrelL);
        
        const barrelR = new THREE.Mesh(barrelGeo, barrelMat);
        barrelR.position.set(2.2, 0, -4.5);
        head.add(barrelR);
        
        // Emitter rings at tips
        const ringGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
        const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
        
        const ringL = new THREE.Mesh(ringGeo, ringMat);
        ringL.position.set(-2.2, 0, -9);
        head.add(ringL);
        
        const ringR = new THREE.Mesh(ringGeo, ringMat);
        ringR.position.set(2.2, 0, -9);
        head.add(ringR);
        
        return { group, head };
    }, []);

    const createFloaterMesh = useCallback((color: string) => {
        const group = new THREE.Group();
        
        // Core Sphere
        const coreGeo = new THREE.SphereGeometry(4, 16, 16);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 1.0, roughness: 0.1 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);
        
        // Side wing plates
        const wingGeo = new THREE.BoxGeometry(6, 1.2, 4);
        const wingMat = new THREE.MeshStandardMaterial({ color: 0x353b48, metalness: 0.8, roughness: 0.4 });
        
        const wingL = new THREE.Mesh(wingGeo, wingMat);
        wingL.position.set(-5, 0, 0);
        wingL.rotation.y = 0.3;
        wingL.rotation.z = 0.2;
        group.add(wingL);
        
        const wingR = new THREE.Mesh(wingGeo, wingMat);
        wingR.position.set(5, 0, 0);
        wingR.rotation.y = -0.3;
        wingR.rotation.z = -0.2;
        group.add(wingR);
        
        // Glowing front eye lens
        const lensGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.5, 12);
        lensGeo.rotateX(Math.PI / 2);
        const lensMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), emissive: new THREE.Color(color), emissiveIntensity: 1.5, roughness: 0.1 });
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.position.set(0, 0, -3.5);
        group.add(lens);
        
        // Antennae
        const antGeo = new THREE.CylinderGeometry(0.15, 0.3, 4, 8);
        antGeo.rotateX(-Math.PI / 6);
        const antMat = new THREE.MeshStandardMaterial({ color: 0x2f3640, metalness: 0.7, roughness: 0.3 });
        
        const antL = new THREE.Mesh(antGeo, antMat);
        antL.position.set(-1.8, 3, 1.5);
        group.add(antL);
        
        const antR = new THREE.Mesh(antGeo, antMat);
        antR.position.set(1.8, 3, 1.5);
        group.add(antR);
        
        return group;
    }, []);

    const createBossMesh = useCallback((color: string) => {
        const group = new THREE.Group();
        
        // Core sphere
        const coreGeo = new THREE.SphereGeometry(18, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.9, roughness: 0.2 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);
        
        // Glowing energy core inside
        const heartGeo = new THREE.SphereGeometry(12, 16, 16);
        const heartMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.8 });
        const heart = new THREE.Mesh(heartGeo, heartMat);
        group.add(heart);
        
        // Rotating Ring 1
        const ring1Geo = new THREE.TorusGeometry(26, 2, 8, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), emissive: new THREE.Color(color), emissiveIntensity: 0.8, metalness: 0.8 });
        const ring1 = new THREE.Mesh(ring1Geo, ringMat);
        group.add(ring1);
        
        // Rotating Ring 2 (rotated)
        const ring2Geo = new THREE.TorusGeometry(32, 1.5, 8, 32);
        const ring2 = new THREE.Mesh(ring2Geo, ringMat);
        ring2.rotation.x = Math.PI / 2;
        group.add(ring2);
        
        // Radial Armor Plates (6 plates)
        const plateGeo = new THREE.BoxGeometry(8, 24, 4);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 1.0, roughness: 0.3 });
        
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const plate = new THREE.Mesh(plateGeo, plateMat);
            plate.position.set(Math.cos(angle) * 22, Math.sin(angle) * 22, 0);
            plate.rotation.z = angle + Math.PI / 2;
            group.add(plate);
        }
        
        // Giant central barrel pointing forward
        const barrelGeo = new THREE.CylinderGeometry(4, 5, 20, 16);
        barrelGeo.rotateX(Math.PI / 2);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x2f3542, metalness: 0.9, roughness: 0.2 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.set(0, 0, -15);
        group.add(barrel);
        
        const tipGeo = new THREE.TorusGeometry(4, 1, 8, 16);
        const tipMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.set(0, 0, -25);
        group.add(tip);
        
        return { group, ring1, ring2 };
    }, []);

    const buildLevelWorld = useCallback(() => {
        clearAllEntities();
        if (warpTunnelMesh.current) warpTunnelMesh.current.visible = false;

        setFuelLevel(100);
        setShieldLevel(currentShipClass.maxShield);
        setArmorLevel(currentShipClass.maxArmor);
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

        // Start sequencer background music
        if (soundRef.current) {
            soundRef.current.startSequencer(level % 3 === 0);
        }

        const isBossSector = level % 3 === 0;
        const zStart = -300;
        const zEnd = isBossSector ? -2100 : -1700;

        // 1. Spawn Floaters (Sleek Drones) distributed along the corridor
        const numFloaters = 8 + level * 2;
        const stepFloater = (zEnd - zStart) / numFloaters;
        for (let i = 0; i < numFloaters; i++) {
            const floaterColor = '#ff3f34';
            const fMesh = createFloaterMesh(floaterColor);

            const pz = zStart + i * stepFloater + (Math.random() - 0.5) * 60;
            const px = (Math.random() - 0.5) * 120; // X in [-60, 60]
            const py = (Math.random() - 0.5) * 60;  // Y in [-30, 30]

            fMesh.position.set(px, py, pz);
            scene.add(fMesh);

            enemies.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                type: 'floater',
                health: 5 + level,
                maxHealth: 5 + level,
                active: true,
                lastFire: Math.random() * 120, // stagger initial fire
                // Fire cooldown: 3.5 to 6 seconds (at 60fps)
                fireCooldown: 210 + Math.random() * 150,
                mesh: fMesh,
                targetQuaternion: new THREE.Quaternion()
            });
        }

        // 2. Spawn Turrets (Dual-barrel Defense Platforms) along the walls
        const numTurrets = 4 + level;
        const stepTurret = (zEnd - zStart) / numTurrets;
        for (let i = 0; i < numTurrets; i++) {
            const turretColor = '#ff3f34';
            const { group: tMesh, head: tHead } = createTurretMesh(turretColor);

            const pz = zStart + (i + 0.5) * stepTurret + (Math.random() - 0.5) * 60;
            const side = i % 2 === 0 ? -1 : 1;
            const px = side * 85; // Fixed on left/right walls
            const py = (Math.random() - 0.5) * 40; // Y in [-20, 20]

            tMesh.position.set(px, py, pz);
            // Rotate turret to face inwards
            tMesh.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
            scene.add(tMesh);

            enemies.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                type: 'turret',
                health: 8 + level * 2,
                maxHealth: 8 + level * 2,
                active: true,
                lastFire: 0,
                // Fire cooldown: 4 to 6 seconds
                fireCooldown: 240 + Math.random() * 120,
                mesh: tMesh,
                headMesh: tHead
            });
        }

        // 3. Spawn Fuel Crystals directly in the path for the player to collect
        const numCrystals = 6;
        const stepC = (zEnd - zStart) / numCrystals;
        for (let i = 0; i < numCrystals; i++) {
            const cGeo = new THREE.OctahedronGeometry(3);
            const cMat = new THREE.MeshStandardMaterial({ color: '#2ed573', emissive: '#10ac84', emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 });
            const cMesh = new THREE.Mesh(cGeo, cMat);
            const px = (Math.random() - 0.5) * 100;
            const py = (Math.random() - 0.5) * 50;
            const pz = zStart + (i + 0.2) * stepC;
            cMesh.position.set(px, py, pz);
            scene.add(cMesh);
            crystals.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                vx: 0, vy: 0, vz: 0,
                active: true,
                mesh: cMesh
            });
        }

        // 4. Spawn Power-Ups directly in the path
        const numPowerups = 3;
        const stepP = (zEnd - zStart) / numPowerups;
        for (let i = 0; i < numPowerups; i++) {
            const pType = i % 3 === 0 ? 'multi' : (i % 3 === 1 ? 'beam' : 'slowmo');
            const pGeo = new THREE.BoxGeometry(4, 4, 4);
            const pColor = pType === 'slowmo' ? '#00bfff' : (pType === 'multi' ? '#00d2d3' : '#ff4757');
            const pEmissive = pType === 'slowmo' ? '#00008b' : (pType === 'multi' ? '#008b8b' : '#8b0000');
            const pMat = new THREE.MeshStandardMaterial({ 
                color: pColor, 
                emissive: pEmissive, 
                emissiveIntensity: 0.5, 
                metalness: 0.8, 
                roughness: 0.2 
            });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            const px = (Math.random() - 0.5) * 100;
            const py = (Math.random() - 0.5) * 50;
            const pz = zStart + (i + 0.7) * stepP;
            pMesh.position.set(px, py, pz);
            scene.add(pMesh);
            powerUps.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                vx: 0, vy: 0, vz: 0,
                type: pType,
                active: true,
                mesh: pMesh
            });
        }

        // 5. Spawn Boss
        if (isBossSector) {
            const bossColor = '#8c7ae6';
            const { group: bossMesh, ring1: bRing1, ring2: bRing2 } = createBossMesh(bossColor);
            
            const px = 0;
            const py = 0;
            const pz = -2500;

            bossMesh.position.set(px, py, pz);
            scene.add(bossMesh);

            const bossH = 60 + level * 15;
            enemies.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                type: 'boss',
                health: bossH,
                maxHealth: bossH,
                active: true,
                lastFire: 0,
                fireCooldown: 120, // 2 seconds fire rate
                mesh: bossMesh,
                bossRing1: bRing1,
                bossRing2: bRing2
            });
            setBossMaxHealth(bossH);
            setBossHealth(bossH);
            addLog("UYARI: DEVASA BİR ANOMALİ (BOSS) TESPİT EDİLDİ!");
            
            if (wormholeMatRef.current) {
                wormholeMatRef.current.uniforms.color.value = new THREE.Color('#ff00ff');
            }
        } else {
            if (wormholeMatRef.current) {
                wormholeMatRef.current.uniforms.color.value = new THREE.Color(currentShipClass.laserColor);
            }
        }
        
        // 6. Spawn Background Cosmic Fleet
        cosmicFleet.current.forEach(f => scene.remove(f.mesh));
        cosmicFleet.current = [];
        cosmicLasers.current.forEach(l => scene.remove(l.mesh));
        cosmicLasers.current = [];
        
        const numCruisers = 8;
        for (let i = 0; i < numCruisers; i++) {
            const isLeft = i % 2 === 0;
            const px = (isLeft ? -1 : 1) * (400 + Math.random() * 400);
            const py = (Math.random() - 0.5) * 400;
            const pz = -1500 - Math.random() * 2000;
            
            const colorVal = i % 2 === 0 ? '#485460' : '#3c40c6';
            const cruiser = createCosmicCruiser(colorVal);
            cruiser.position.set(px, py, pz);
            cruiser.lookAt(new THREE.Vector3(0, py, pz - 100));
            scene.add(cruiser);
            cosmicFleet.current.push({
                mesh: cruiser,
                fireTimer: Math.random() * 60,
                fireCooldown: 60 + Math.random() * 60
            });
        }

        // Initialize enemy counter refs and DOM element
        const total = enemies.current.length;
        totalEnemiesRef.current = total;
        enemiesRemainingRef.current = total;
        if (hudEnemiesRef.current) {
            hudEnemiesRef.current.textContent = `${total} / ${total}`;
        }
    }, [clearAllEntities, level, setFuelLevel, setShieldLevel, setArmorLevel, addLog, currentShipClass, createTurretMesh, createFloaterMesh, createBossMesh]);

    const spawnBullet = useCallback((offsetX: number, offsetY: number, color: string, speedScale: number = 1.0, isBeam: boolean = false) => {
        if (!sceneRef.current || !playerShipGroup.current) return;
        
        const geo = isBeam ? new THREE.CylinderGeometry(0.8, 0.8, 50) : new THREE.SphereGeometry(1.5, 12, 12);
        if (isBeam) geo.rotateX(Math.PI / 2);

        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
        const mesh = new THREE.Mesh(geo, mat);

        const spawnPos = new THREE.Vector3(offsetX, offsetY, -6);
        spawnPos.applyQuaternion(shipQuaternion.current);
        spawnPos.add(shipPos.current);
        
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
        const bulletSpeed = 35 * speedScale;
        const bVx = forward.x * bulletSpeed;
        const bVy = forward.y * bulletSpeed;
        const bVz = forward.z * bulletSpeed;

        mesh.position.copy(spawnPos);
        mesh.quaternion.copy(shipQuaternion.current);
        sceneRef.current.add(mesh);
        
        // Spawn small muzzle flash sparks at the wingtip gun barrels
        createExplosion(spawnPos.x, spawnPos.y, spawnPos.z, color, 3, 0.3);

        bullets.current.push({
            id: Math.random(),
            x: spawnPos.x, y: spawnPos.y, z: spawnPos.z,
            vx: bVx, vy: bVy, vz: bVz,
            life: 100,
            isEnemy: false,
            isBeam,
            mesh
        });
    }, []);

    const fireWeapon = useCallback(() => {
        if (gameState !== 'playing' || fuelRef.current <= 0) return;
        
        const activeWeaponPattern = weaponTimer.current > 0 ? weaponType.current : currentShipClass.weaponPattern;
        const activeLaserColor = weaponTimer.current > 0 
            ? (weaponType.current === 'beam' ? '#ff4757' : '#00d2d3') 
            : currentShipClass.laserColor;

        if (activeWeaponPattern === 'beam') {
            spawnBullet(0, 0, activeLaserColor, 3.0, true);
            soundRef.current?.playShoot(true);
        } else if (activeWeaponPattern === 'multi') {
            spawnBullet(-4, 0, activeLaserColor, 1.0);
            spawnBullet(4, 0, activeLaserColor, 1.0);
            spawnBullet(0, 3, activeLaserColor, 1.0);
            soundRef.current?.playShoot();
        } else {
            spawnBullet(-2, 0, activeLaserColor);
            spawnBullet(2, 0, activeLaserColor);
            soundRef.current?.playShoot();
        }
    }, [gameState, spawnBullet, currentShipClass]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            keys.current[k] = true;
            if (k === ' ' || k === 'p') {
                e.preventDefault();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [fireWeapon]);

    // Main 6-DOF Loop
    tickRef.current = (time: number) => {
        if (gameState !== 'playing' && gameState !== 'hyperspace') {
            lastTime.current = time;
            animationFrameId.current = requestAnimationFrame((t) => tickRef.current(t));
            return;
        }

        const rawDt = (time - lastTime.current) / 1000;
        lastTime.current = time;
        const playerDt = Math.min(rawDt * 60, 3.0);

        // Bullet time (Slow-motion) timer updates
        if (bulletTimeTimerRef.current > 0) {
            bulletTimeTimerRef.current -= playerDt;
            if (bulletTimeTimerRef.current <= 0) {
                timeDilationRef.current = 1.0;
                addLog("ZAMAN AKIŞI NORMALE DÖNDÜ.");
            }
        }
        
        // Show/hide slow-mo blue screen vignette directly in DOM
        if (hudSlowmoVignetteRef.current) {
            if (bulletTimeTimerRef.current > 0) {
                hudSlowmoVignetteRef.current.style.display = 'block';
                const wave = Math.sin(time * 0.05) * 0.05 + 0.65;
                hudSlowmoVignetteRef.current.style.opacity = wave.toString();
            } else {
                hudSlowmoVignetteRef.current.style.display = 'none';
            }
        }

        const dt = playerDt * timeDilationRef.current;

        const scene = sceneRef.current;
        const camera = cameraRef3D.current;
        const ship = playerShipGroup.current;
        const composer = composerRef.current;

        if (!scene || !camera || !ship || !composer) {
            animationFrameId.current = requestAnimationFrame(tickRef.current);
            return;
        }

        // --- HYPERSPACE ANIMATION ---
        if (gameState === 'hyperspace') {
            hyperspaceTimer.current -= dt;

            // Warp tunnel cylinder updates
            if (warpTunnelMesh.current && warpTunnelMat.current) {
                warpTunnelMesh.current.visible = true;
                warpTunnelMesh.current.position.copy(shipPos.current);
                warpTunnelMesh.current.quaternion.copy(shipQuaternion.current);
                
                warpTunnelMat.current.uniforms.time.value += dt * 0.15;
                
                let op = 0.0;
                if (hyperspaceTimer.current > 70) {
                    op = (100 - hyperspaceTimer.current) / 30; // fade in
                } else if (hyperspaceTimer.current < 30) {
                    op = hyperspaceTimer.current / 30; // fade out
                } else {
                    op = 1.0;
                }
                warpTunnelMat.current.uniforms.opacity.value = Math.max(0.0, Math.min(1.0, op));
            }

            if (starMaterial.current) {
                // Stretch stars
                starMaterial.current.size = 2.0 + (100 - hyperspaceTimer.current) * 0.25;
                starMaterial.current.needsUpdate = true;
            }
            
            // Move ship extremely fast forward
            targetSpeed.current = currentShipClass.maxSpeed * 10;
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
            shipVel.current.copy(forward).multiplyScalar(targetSpeed.current);
            shipPos.current.addScaledVector(shipVel.current, dt);
            
            ship.position.copy(shipPos.current);
            camera.position.lerp(new THREE.Vector3(0, 10, 40).applyQuaternion(shipQuaternion.current).add(shipPos.current), 0.1);

            if (hyperspaceTimer.current <= 0) {
                if (starMaterial.current) starMaterial.current.size = 1.5;
                if (warpTunnelMesh.current) warpTunnelMesh.current.visible = false;
                setGameState('playing');
                buildLevelWorld();
            }

            composer.render();
            animationFrameId.current = requestAnimationFrame((t) => tickRef.current(t));
            return;
        }

        // Hide warp tunnel mesh if in normal play
        if (gameState === 'playing' && warpTunnelMesh.current && warpTunnelMesh.current.visible) {
            warpTunnelMesh.current.visible = false;
        }

        // --- 1. SHIP MOVEMENT & KEYBOARD STEERING (Forward Flight) ---
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
        // Automatically move forward along the Z axis
        const levelDistance = level % 3 === 0 ? -2200 : -1800;
        const hasReachedEnd = shipPos.current.z <= levelDistance;
        
        let forwardSpeed = 0;
        if (!hasReachedEnd) {
            const speedMultiplier = fuelRef.current > 0 ? 0.45 : 0.08; // Heavy engine crawling if out of fuel
            forwardSpeed = (currentShipClass.maxSpeed * speedMultiplier) * dt;
            shipPos.current.z -= forwardSpeed;
            targetSpeed.current = currentShipClass.maxSpeed * speedMultiplier;
        } else {
            targetSpeed.current = 0;
            
            // Victory checks
            if (level % 3 !== 0) {
                const activeEnemies = enemies.current.filter(en => en.active).length;
                if (activeEnemies === 0 && gameState === 'playing') {
                    setScore(scoreRef.current);
                    setGameState('victory');
                    soundRef.current?.stopSequencer();
                    soundRef.current?.stopAmbient();
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                }
            } else {
                const boss = enemies.current.find(en => en.type === 'boss');
                if (boss && !boss.active && gameState === 'playing') {
                    setScore(scoreRef.current);
                    setGameState('victory');
                    soundRef.current?.stopSequencer();
                    soundRef.current?.stopAmbient();
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                }
            }
        }

        // Auto-fire when P or Space held down
        const fireInterval = currentShipClass.weaponPattern === 'beam' ? 18 : (currentShipClass.weaponPattern === 'multi' ? 10 : 8);
        if (keys.current['p'] || keys.current[' ']) {
            autoFireTimer.current += dt;
            if (autoFireTimer.current >= fireInterval) {
                autoFireTimer.current = 0;
                fireWeapon();
            }
        } else {
            autoFireTimer.current = fireInterval; // Ready to fire immediately on next press
        }

        // Fuel consumption: slowly decrease fuel, faster if boosting/firing
        let fuelDepletion = 0.04 * dt; // Base rate
        if (keys.current['p'] || keys.current[' ']) {
            fuelDepletion = 0.09 * dt; // Firing/boosting costs more fuel
        }
        setFuelLevel(fuelRef.current - fuelDepletion);

        // Shield slow regen (5 seconds without damage)
        shieldRegenTimer.current += dt;
        if (shieldRegenTimer.current > 300 && shieldRef.current < currentShipClass.maxShield * 0.3) {
            setShieldLevel(shieldRef.current + 0.08 * dt);
        }

        // Steer left/right (A/D) and up/down (W/S)
        const steerSpeed = 2.8 * playerDt;
        if (keys.current['a']) shipPos.current.x -= steerSpeed;
        if (keys.current['d']) shipPos.current.x += steerSpeed;
        if (keys.current['w']) shipPos.current.y += steerSpeed * 0.8;
        if (keys.current['s']) shipPos.current.y -= steerSpeed * 0.8;

        // Clamp positions to stay in the flight corridor
        shipPos.current.x = Math.max(-80, Math.min(80, shipPos.current.x));
        shipPos.current.y = Math.max(-45, Math.min(45, shipPos.current.y));

        // Smoothly rotate the ship based on steering keys
        let targetRoll = 0;
        let targetPitch = 0;
        let targetYaw = 0;

        if (keys.current['a']) {
            targetRoll = 0.5;
            targetYaw = 0.25;
        } else if (keys.current['d']) {
            targetRoll = -0.5;
            targetYaw = -0.25;
        }

        if (keys.current['w']) {
            targetPitch = -0.3;
        } else if (keys.current['s']) {
            targetPitch = 0.3;
        }

        ship.rotation.z = THREE.MathUtils.lerp(ship.rotation.z, targetRoll, 0.15 * playerDt);
        ship.rotation.x = THREE.MathUtils.lerp(ship.rotation.x, targetPitch, 0.15 * playerDt);
        ship.rotation.y = THREE.MathUtils.lerp(ship.rotation.y, targetYaw, 0.15 * playerDt);

        // Update quaternion reference from rotation
        ship.quaternion.setFromEuler(new THREE.Euler(ship.rotation.x, ship.rotation.y, ship.rotation.z));
        shipQuaternion.current.copy(ship.quaternion);
        ship.position.copy(shipPos.current);

        // Thruster visual
        const thrustScale = hasReachedEnd ? 0.3 : 1.2;
        if (thrusterFlameMeshL.current) thrusterFlameMeshL.current.scale.set(1, thrustScale, 1);
        if (thrusterFlameMeshR.current) thrusterFlameMeshR.current.scale.set(1, thrustScale, 1);

        // Spawn engine particles trailing behind the engines
        if (gameState === 'playing' && !hasReachedEnd) {
            let thrusterOffset = 1.5;
            let thrusterZ = 4;
            if (currentShipClass.id === 'dreadnought') {
                thrusterOffset = 1.5 * 1.4;
                thrusterZ = 4 * 1.2;
            } else if (currentShipClass.id === 'interceptor') {
                thrusterOffset = 1.5 * 0.85;
                thrusterZ = 4 * 0.95;
            }
            
            const leftThrusterPos = new THREE.Vector3(-thrusterOffset, 0, thrusterZ).applyQuaternion(shipQuaternion.current).add(shipPos.current);
            const rightThrusterPos = new THREE.Vector3(thrusterOffset, 0, thrusterZ).applyQuaternion(shipQuaternion.current).add(shipPos.current);
            
            // Spawn fewer particles to avoid clutter
            const numParticles = 1;
            for (let i = 0; i < numParticles; i++) {
                [leftThrusterPos, rightThrusterPos].forEach(pos => {
                    if (!engineParticleGeo.current || !engineParticleMat.current) return;
                    
                    const mat = engineParticleMat.current.clone();
                    const mesh = new THREE.Mesh(engineParticleGeo.current, mat);
                    mesh.position.copy(pos);
                    mesh.position.x += (Math.random() - 0.5) * 0.2;
                    mesh.position.y += (Math.random() - 0.5) * 0.2;
                    mesh.position.z += (Math.random() - 0.5) * 0.2;
                    scene.add(mesh);

                    const backward = new THREE.Vector3(0, 0, 1).applyQuaternion(shipQuaternion.current);
                    const dispersion = 0.5;
                    const pVx = backward.x * (5 + targetSpeed.current * 0.4) + (Math.random() - 0.5) * dispersion;
                    const pVy = backward.y * (5 + targetSpeed.current * 0.4) + (Math.random() - 0.5) * dispersion;
                    const pVz = backward.z * (5 + targetSpeed.current * 0.4) + (Math.random() - 0.5) * dispersion;

                    particles.current.push({
                        x: mesh.position.x,
                        y: mesh.position.y,
                        z: mesh.position.z,
                        vx: pVx,
                        vy: pVy,
                        vz: pVz,
                        life: 12 + Math.random() * 8,
                        color: currentShipClass.laserColor,
                        size: 0.15,
                        mesh
                    });
                });
            }
        }

        // Shield Bubble Flash Animation
        if (shieldBubbleMesh.current) {
            if (shieldHitLife.current > 0) {
                shieldHitLife.current -= 0.08 * dt;
                shieldBubbleMesh.current.visible = true;
                const mat = shieldBubbleMesh.current.material as THREE.MeshBasicMaterial;
                mat.opacity = shieldHitLife.current * 0.3; // more subtle
                const bubbleScale = 1.0 + (1.0 - shieldHitLife.current) * 0.03;
                shieldBubbleMesh.current.scale.set(bubbleScale, bubbleScale, bubbleScale);
            } else {
                shieldBubbleMesh.current.visible = false;
            }
        }

        // Speed lines animation
        if (speedLinesGroup.current) {
            const lines = speedLinesGroup.current.children;
            const velocity = targetSpeed.current;
            const isMovingFast = velocity > 1.0;
            
            speedLinesGroup.current.position.copy(shipPos.current);
            speedLinesGroup.current.quaternion.copy(shipQuaternion.current);
            
            lines.forEach((line: any) => {
                line.position.z += velocity * 1.5 * dt;
                
                if (line.position.z > 50) {
                    line.position.set(
                        (Math.random() - 0.5) * 200,
                        (Math.random() - 0.5) * 150,
                        -250 - Math.random() * 150
                    );
                }
                
                const mat = line.material as THREE.LineBasicMaterial;
                if (isMovingFast) {
                    mat.opacity = 0.25; // less bright
                    const stretch = 1.0 + velocity * 0.5;
                    line.scale.set(1, 1, stretch);
                } else {
                    mat.opacity = 0.0;
                }
            });
        }

        if (soundRef.current) {
            const speedRatio = Math.min(1.0, targetSpeed.current / currentShipClass.maxSpeed);
            soundRef.current.updateAmbient(speedRatio);
        }

        // --- 2. CAMERA UPDATE (Smooth Rail Chase Cam) ---
        // Stays positioned behind the ship and moves smoothly along Z-axis
        const idealCamPos = new THREE.Vector3(shipPos.current.x, shipPos.current.y + 4, shipPos.current.z + 18);
        camera.position.lerp(idealCamPos, 0.12 * dt);
        
        const idealLookAt = new THREE.Vector3(shipPos.current.x, shipPos.current.y, shipPos.current.z - 50);
        
        const m = new THREE.Matrix4().lookAt(camera.position, idealLookAt, new THREE.Vector3(0, 1, 0));
        const targetCamQuat = new THREE.Quaternion().setFromRotationMatrix(m);
        camera.quaternion.slerp(targetCamQuat, 0.12 * dt);
        
        if (screenShakeRef.current > 0) {
            camera.position.x += (Math.random() - 0.5) * screenShakeRef.current;
            camera.position.y += (Math.random() - 0.5) * screenShakeRef.current;
            camera.position.z += (Math.random() - 0.5) * screenShakeRef.current;
            screenShakeRef.current *= 0.85;
        }



        if (wormholeMatRef.current) {
            wormholeMatRef.current.uniforms.time.value += dt * 0.8;
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
        let isTargetInCrosshair = false;

        enemies.current.forEach(e => {
            if (!e.active) return;
            
            const eVec = new THREE.Vector3(e.x, e.y, e.z);
            const distToPlayer = eVec.distanceTo(shipPos.current);
            
            // Namlu Lazer Şarj Efektleri
            const chargeTime = 30; // 0.5 seconds at 60fps
            const warningThreshold = e.fireCooldown - chargeTime;
            if (e.lastFire > warningThreshold && e.z < shipPos.current.z && distToPlayer < 1200) {
                let spawnP = new THREE.Vector3(e.x, e.y, e.z);
                if (e.type === 'turret' && e.headMesh) {
                    const barrelTipLocal = new THREE.Vector3(0, 0, -9);
                    barrelTipLocal.applyQuaternion(e.headMesh.quaternion);
                    spawnP.add(barrelTipLocal);
                } else if (e.type === 'floater') {
                    const offset = new THREE.Vector3(0, 0, -4).applyQuaternion(e.mesh.quaternion);
                    spawnP.add(offset);
                } else if (e.type === 'boss') {
                    const offset = new THREE.Vector3(0, 0, -15);
                    spawnP.add(offset);
                }

                if (!e.warningFlare) {
                    const flareGeo = new THREE.TorusGeometry(0.8, 0.2, 8, 16);
                    const flareColor = e.type === 'boss' ? '#8c7ae6' : '#fbc531';
                    const flareMat = new THREE.MeshBasicMaterial({ 
                        color: flareColor, 
                        transparent: true, 
                        opacity: 0.8, 
                        blending: THREE.AdditiveBlending 
                    });
                    e.warningFlare = new THREE.Mesh(flareGeo, flareMat);
                    scene.add(e.warningFlare);
                }
                
                e.warningFlare.position.copy(spawnP);
                if (e.type === 'turret' && e.headMesh) {
                    e.warningFlare.quaternion.copy(e.headMesh.quaternion);
                } else {
                    e.warningFlare.quaternion.copy(e.mesh.quaternion);
                }
                
                const elapsedCharge = e.lastFire - warningThreshold;
                const progress = Math.min(1.0, elapsedCharge / chargeTime);
                const scale = progress * 4.0;
                e.warningFlare.scale.set(scale, scale, scale);
                e.warningFlare.rotation.z += 0.1 * dt;
            } else {
                if (e.warningFlare) {
                    scene.remove(e.warningFlare);
                    e.warningFlare = null;
                }
            }

            // Check crosshair lock (dot product) - ONLY if target is ahead of player
            const dirToEnemy = new THREE.Vector3().subVectors(eVec, shipPos.current).normalize();
            if (e.z < shipPos.current.z && forward.dot(dirToEnemy) > 0.98 && distToPlayer < 2000) {
                isTargetInCrosshair = true;
            }

            // AI Movement
            if (e.type === 'floater') {
                // Bobbing/floating motion in X/Y using sine/cosine wave
                const targetX = shipPos.current.x;
                const targetY = shipPos.current.y;
                
                // Drift slowly in X/Y to align with player but stay stationary along Z axis
                e.x += Math.sign(targetX - e.x) * 0.2 * dt;
                e.y += Math.sign(targetY - e.y) * 0.15 * dt;
                
                // Wave bobbing
                const bobTime = (time * 0.001) + e.id * 100;
                e.x += Math.sin(bobTime) * 0.1 * dt;
                e.y += Math.cos(bobTime) * 0.1 * dt;
                
                // Rotate floater to look at player
                const targetRotationMatrix = new THREE.Matrix4().lookAt(eVec, shipPos.current, new THREE.Vector3(0, 1, 0));
                const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotationMatrix);
                e.mesh.quaternion.slerp(targetQuat, 0.05 * dt);

                // Add small engine trails occasionally (subtle)
                if (Math.random() < 0.1) {
                    const tGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                    const tMat = new THREE.MeshBasicMaterial({ color: '#ff3f34', transparent: true, opacity: 0.2 });
                    const tMesh = new THREE.Mesh(tGeo, tMat);
                    tMesh.position.copy(eVec);
                    scene.add(tMesh);
                    particles.current.push({
                        x: e.x, y: e.y, z: e.z,
                        vx: 0, vy: 0, vz: 2.0, // move backwards relative to floater
                        life: 10, color: '#ff3f34', size: 0.3, mesh: tMesh
                    });
                }

            } else if (e.type === 'turret') {
                // Aim turret head at player (only if player is ahead of it)
                if (e.headMesh && e.z < shipPos.current.z) {
                    const headVec = new THREE.Vector3(e.x, e.y, e.z);
                    const dirToPlayer = new THREE.Vector3().subVectors(shipPos.current, headVec).normalize();
                    const targetRotationMatrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), dirToPlayer, new THREE.Vector3(0, 1, 0));
                    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotationMatrix);
                    e.headMesh.quaternion.slerp(targetQuat, 0.1 * dt);
                }
            } else if (e.type === 'boss') {
                const dir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                e.x += dir.x * 0.2 * dt;
                e.y += dir.y * 0.2 * dt;
                // Boss stays far ahead, drifts in Z very slowly
                e.z += dir.z * 0.05 * dt;

                // Animate rotating outer armor rings
                if (e.bossRing1) e.bossRing1.rotation.y += 0.02 * dt;
                if (e.bossRing2) e.bossRing2.rotation.x -= 0.03 * dt;
                e.mesh.rotation.z += 0.005 * dt;
            }

            e.mesh.position.set(e.x, e.y, e.z);

            // Firing Logic - ONLY if enemy is ahead of player (e.z < shipPos.current.z)
            e.lastFire += dt;
            if (e.lastFire > e.fireCooldown && e.z < shipPos.current.z && distToPlayer < 1200) {
                e.lastFire = 0;
                let fireDir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                let spawnP = new THREE.Vector3(e.x, e.y, e.z);
                
                if (e.type === 'turret' && e.headMesh) {
                    const barrelTipLocal = new THREE.Vector3(0, 0, -9);
                    barrelTipLocal.applyQuaternion(e.headMesh.quaternion);
                    spawnP.add(barrelTipLocal);
                    fireDir = new THREE.Vector3(0, 0, -1).applyQuaternion(e.headMesh.quaternion).normalize();
                }

                // Balance speeds: turret = 7, floater = 5, boss = 8 (all extremely dodgeable)
                const bSpeed = e.type === 'turret' ? 7 : (e.type === 'boss' ? 8 : 5);
                const bColor = e.type === 'turret' ? '#ff9f43' : (e.type === 'boss' ? '#8c7ae6' : '#fbc531');
                
                // Sleeker laser spheres (1.2 radius) — visible but dodgeable
                const bGeo = new THREE.SphereGeometry(1.2, 8, 8);
                const bMat = new THREE.MeshBasicMaterial({ color: bColor, transparent: true, opacity: 0.85 });
                const bMesh = new THREE.Mesh(bGeo, bMat);
                bMesh.position.copy(spawnP);
                scene.add(bMesh);
                
                bullets.current.push({
                    id: Math.random(),
                    x: spawnP.x, y: spawnP.y, z: spawnP.z,
                    vx: fireDir.x * bSpeed, vy: fireDir.y * bSpeed, vz: fireDir.z * bSpeed,
                    life: 120, isEnemy: true, mesh: bMesh
                });
            }
        });

        if (targetLocked !== isTargetInCrosshair) setTargetLocked(isTargetInCrosshair);

        // Bullet Hit Detections
        bullets.current.forEach(b => {
            if (b.life <= 0) return;
            const bVec = new THREE.Vector3(b.x, b.y, b.z);

            if (b.isEnemy) {
                const distToPlayer = bVec.distanceTo(shipPos.current);
                // Proximity warning: enemy bullet within 35 units
                if (distToPlayer < 35 && distToPlayer > 12) {
                    proximityDangerRef.current = Math.max(proximityDangerRef.current, (35 - distToPlayer) / 35);
                }
                if (distToPlayer < 12) {
                    b.life = 0;
                    screenShakeRef.current = 3.5;
                    soundRef.current?.playExplosion();
                    createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#fbc531', 20, 1.5);
                    createShockwave(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#ff3f34');
                    
                    comboMultiplier.current = 1;
                    shieldRegenTimer.current = 0; // Reset regen timer
                    damageVignetteRef.current = 1.0; // Full vignette flash
                    
                    const dmg = 20;
                    if (shieldRef.current > 0) {
                        shieldHitLife.current = 1.0;
                        setShieldLevel(shieldRef.current - dmg * 0.7);
                        setArmorLevel(armorRef.current - dmg * 0.3);
                        addLog(`KALKAN HASARI! Kalkan: %${Math.round(shieldRef.current)}`);
                    } else {
                        setArmorLevel(armorRef.current - dmg);
                        addLog(`KRİTİK HASAR! Zırh: %${Math.round(armorRef.current)}`);
                    }
                }
            } else {
                enemies.current.forEach(e => {
                    if (!e.active) return;
                    const eVec = new THREE.Vector3(e.x, e.y, e.z);
                    const radius = e.type === 'boss' ? 40 : 12;
                    
                    if (bVec.distanceTo(eVec) < radius) {
                        if (!b.isBeam) b.life = 0;
                        const dmgAmt = b.isBeam ? 2 : 1;
                        e.health -= dmgAmt;
                        
                        // Hit flash effect
                        const currentFlash = hitFlashMap.current.get(e.id) || 0;
                        hitFlashMap.current.set(e.id, Math.max(currentFlash, 1.0));
                        
                        if (e.type === 'boss') {
                            setBossHealth(Math.max(0, e.health));
                            const ratio = e.health / e.maxHealth;
                            if (ratio < 0.35 && bossPhase.current < 3) {
                                bossPhase.current = 3;
                                addLog("BOSS SİSTEM AŞAMASI 3: KRİTİK SEVİYE! SÜREKLİ YÜKSEK ATEŞ GÜCÜ!");
                                e.fireCooldown = 45; // 0.75 seconds fire rate
                            } else if (ratio < 0.7 && bossPhase.current < 2) {
                                bossPhase.current = 2;
                                addLog("BOSS SİSTEM AŞAMASI 2: ZIRH KIRILDI! HIZLI ATEŞ MODU AKTİF!");
                                e.fireCooldown = 80; // 1.33 seconds fire rate
                            }
                        }
                        
                        // Small hit sparks
                        createExplosion(bVec.x, bVec.y, bVec.z, '#ffffff', 4, 0.4);

                        if (e.health <= 0) {
                            e.active = false;
                            scene.remove(e.mesh);
                            if (e.warningFlare) {
                                scene.remove(e.warningFlare);
                                e.warningFlare = null;
                            }
                            hitFlashMap.current.delete(e.id);
                            soundRef.current?.playExplosion();
                            
                            // Multi-phase death explosion
                            const isBoss = e.type === 'boss';
                            const expColor1 = isBoss ? '#ff6b6b' : '#ff9f43';
                            const expColor2 = isBoss ? '#8c7ae6' : '#00ffff';
                            
                            createShockwave(e.x, e.y, e.z, expColor2);
                            createExplosion(e.x, e.y, e.z, expColor1, isBoss ? 60 : 20, isBoss ? 4.0 : 1.5);
                            createExplosion(e.x, e.y, e.z, '#ffffff', isBoss ? 30 : 8, isBoss ? 2.0 : 0.8);
                            
                            if (isBoss) {
                                // Second and third shockwave rings
                                setTimeout(() => createShockwave(e.x, e.y, e.z, '#ff6b6b'), 150);
                                setTimeout(() => {
                                    createShockwave(e.x, e.y, e.z, '#ffffff');
                                    createExplosion(e.x, e.y, e.z, expColor1, 40, 3.0);
                                }, 300);
                                screenShakeRef.current = 8.0;
                            }
                            
                            comboMultiplier.current = Math.min(comboMultiplier.current + 1, 10);
                            comboTimer.current = 180;
                            const scoreGained = (e.type === 'boss' ? 20000 : 500) * comboMultiplier.current;
                            scoreRef.current += scoreGained;
                            if (hudScoreRef.current) {
                                hudScoreRef.current.textContent = scoreRef.current.toString();
                            }
                            
                            const comboLabel = comboMultiplier.current > 1 ? ` ×${comboMultiplier.current} COMBO!` : '';
                            addLog(`HEDEF İMHA! +${scoreGained}${comboLabel}`);
                            
                            const floatColor = comboMultiplier.current >= 5 ? '#ff3f34' : (comboMultiplier.current >= 3 ? '#ff9f43' : '#ffffff');
                            floatingTexts.current.push({
                                id: Math.random(),
                                text: comboMultiplier.current > 1 ? `+${scoreGained} ×${comboMultiplier.current}` : `+${scoreGained}`,
                                x: e.x, y: e.y + 15, z: e.z,
                                life: 2.0, color: floatColor
                            });

                            // Drops
                            const randVal = Math.random();
                            if (randVal < 0.15) { // 15% chance for slowmo
                                const pGeo = new THREE.BoxGeometry(5, 5, 5);
                                const pMat = new THREE.MeshBasicMaterial({ color: '#00bfff', wireframe: true });
                                const pMesh = new THREE.Mesh(pGeo, pMat);
                                pMesh.position.set(e.x, e.y, e.z);
                                scene.add(pMesh);
                                powerUps.current.push({
                                    id: Math.random(), x: e.x, y: e.y, z: e.z,
                                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: (Math.random() - 0.5) * 4,
                                    type: 'slowmo', active: true, mesh: pMesh
                                });
                            } else if (randVal > 0.80) { // 20% chance for other powerups (multi or beam)
                                const pType = Math.random() > 0.5 ? 'multi' : 'beam';
                                const pGeo = new THREE.BoxGeometry(5, 5, 5);
                                const pMat = new THREE.MeshBasicMaterial({ color: pType === 'multi' ? '#00d2d3' : '#ff4757', wireframe: true });
                                const pMesh = new THREE.Mesh(pGeo, pMat);
                                pMesh.position.set(e.x, e.y, e.z);
                                scene.add(pMesh);
                                powerUps.current.push({
                                    id: Math.random(), x: e.x, y: e.y, z: e.z,
                                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: (Math.random() - 0.5) * 4,
                                    type: pType, active: true, mesh: pMesh
                                });
                            } else { // 65% chance of crystal
                                const cGeo = new THREE.OctahedronGeometry(3);
                                const cMat = new THREE.MeshStandardMaterial({ color: '#2ed573', emissive: '#10ac84' });
                                const cMesh = new THREE.Mesh(cGeo, cMat);
                                cMesh.position.set(e.x, e.y, e.z);
                                scene.add(cMesh);
                                crystals.current.push({
                                    id: Math.random(), x: e.x, y: e.y, z: e.z,
                                    vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, vz: (Math.random() - 0.5) * 3,
                                    active: true, mesh: cMesh
                                });
                            }

                            // Victory Check
                            if (enemies.current.filter(en => en.active).length === 0) {
                                setScore(scoreRef.current);
                                setGameState('victory');
                                soundRef.current?.stopSequencer();
                                soundRef.current?.stopAmbient();
                                confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
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
                item.mesh.rotation.x += 0.04 * dt;
                item.mesh.rotation.y += 0.05 * dt;
                
                const dVec = new THREE.Vector3(item.x, item.y, item.z);
                const dist = dVec.distanceTo(shipPos.current);
                
                // Magnet
                if (dist < 200) {
                    const dir = new THREE.Vector3().subVectors(shipPos.current, dVec).normalize();
                    item.vx += dir.x * 0.8 * dt;
                    item.vy += dir.y * 0.8 * dt;
                    item.vz += dir.z * 0.8 * dt;
                }
                
                if (dist < 20) handler(item);
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
            if (p.type === 'slowmo') {
                bulletTimeTimerRef.current = 300; // 5 seconds at 60fps (300 frames)
                timeDilationRef.current = 0.35;
                addLog("ZAMAN BÜKÜLDÜ!");
                floatingTexts.current.push({
                    id: Math.random(),
                    text: "ZAMAN BÜKÜLDÜ!",
                    x: p.x, y: p.y + 10, z: p.z,
                    life: 2.0, color: '#00bfff'
                });
            } else {
                weaponType.current = p.type;
                weaponTimer.current = 400; // ~6-7 secs
                addLog(`SİSTEM GÜNCELLENDİ: ${p.type.toUpperCase()}`);
            }
        });
        powerUps.current = powerUps.current.filter(p => p.active);

        // --- 6. PARTICLES & SHOCKWAVES ---
        particles.current.forEach(p => {
            if (p.life <= 0) return;
            p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
            p.life -= dt;
            p.mesh.position.set(p.x, p.y, p.z);
            p.mesh.scale.multiplyScalar(0.93); // shrink faster
            const mat = p.mesh.material as THREE.MeshBasicMaterial;
            if (mat && mat.opacity !== undefined) {
                mat.opacity = Math.max(0, p.life / 25);
            }
        });
        particles.current.filter(p => p.life <= 0).forEach(p => scene.remove(p.mesh));
        particles.current = particles.current.filter(p => p.life > 0);

        shockwaves.current.forEach(s => {
            if (s.life <= 0) return;
            s.life -= 0.02 * dt;
            const scale = 1.0 + (1.0 - s.life) * 40; // Expand to 40x size
            s.mesh.scale.set(scale, scale, scale);
            (s.mesh.material as THREE.MeshBasicMaterial).opacity = s.life * 0.5;
        });
        shockwaves.current.filter(s => s.life <= 0).forEach(s => scene.remove(s.mesh));
        shockwaves.current = shockwaves.current.filter(s => s.life > 0);

        // --- 7. FLOATING TEXTS & UI UPDATES ---
        floatingTexts.current.forEach(ft => {
            ft.y += 0.8 * dt;
            ft.life -= 0.02 * dt;
        });
        floatingTexts.current = floatingTexts.current.filter(ft => ft.life > 0);

        if (floatingTextContainerRef.current) {
            floatingTextContainerRef.current.innerHTML = '';
            floatingTexts.current.forEach(ft => {
                const vec = new THREE.Vector3(ft.x, ft.y, ft.z);
                vec.project(camera);
                
                const width = canvasRef.current?.clientWidth || 800;
                const height = canvasRef.current?.clientHeight || 550;
                
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
                    el.style.fontWeight = '900';
                    el.style.fontSize = '1.5rem';
                    el.style.textShadow = `0 0 15px ${ft.color}, 0 0 5px #000`;
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

        // Radar
        if (Math.random() < 0.15) {
            const radarData = enemies.current.filter(e => e.active).map(e => {
                const relativePos = new THREE.Vector3(e.x, e.y, e.z).sub(shipPos.current);
                relativePos.applyQuaternion(shipQuaternion.current.clone().invert());
                return { x: relativePos.x, y: relativePos.z, z: relativePos.y, type: e.type };
            });
            setRadarEntities(radarData);
        }

        // --- 7. COSMIC FLEET & LASERS ---
        cosmicFleet.current.forEach((cruiser, index) => {
            cruiser.fireTimer += dt;
            if (cruiser.fireTimer >= cruiser.fireCooldown) {
                cruiser.fireTimer = 0;
                cruiser.fireCooldown = 60 + Math.random() * 60;
                
                const targetIndex = (index + 1 + Math.floor(Math.random() * (cosmicFleet.current.length - 1))) % cosmicFleet.current.length;
                const targetCruiser = cosmicFleet.current[targetIndex];
                if (targetCruiser) {
                    const startP = new THREE.Vector3().copy(cruiser.mesh.position);
                    const endP = new THREE.Vector3().copy(targetCruiser.mesh.position);
                    
                    const points = [startP, endP];
                    const laserGeo = new THREE.BufferGeometry().setFromPoints(points);
                    
                    const colors = ['#00ffff', '#ff4757', '#ffbe0b', '#8338ec'];
                    const colorStr = colors[Math.floor(Math.random() * colors.length)];
                    const laserMat = new THREE.LineBasicMaterial({ 
                        color: colorStr, 
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const laserLine = new THREE.Line(laserGeo, laserMat);
                    scene.add(laserLine);
                    
                    cosmicLasers.current.push({
                        mesh: laserLine,
                        life: 15
                    });
                }
            }
        });
        
        cosmicLasers.current.forEach(cl => {
            cl.life -= dt;
            const mat = cl.mesh.material as THREE.LineBasicMaterial;
            if (mat) mat.opacity = Math.max(0, cl.life / 15);
        });
        cosmicLasers.current.filter(cl => cl.life <= 0).forEach(cl => scene.remove(cl.mesh));
        cosmicLasers.current = cosmicLasers.current.filter(cl => cl.life > 0);

        // --- 8. LOW ARMOR WARNING & ALARM BEEP ---
        const maxArmorVal = currentShipClass.maxArmor;
        const isLowArmor = armorRef.current < maxArmorVal * 0.3;
        
        if (isLowArmor) {
            if (hudLowArmorAlertRef.current) {
                hudLowArmorAlertRef.current.style.display = 'block';
                const alertWave = Math.sin(time * 0.01) * 0.2 + 0.8;
                hudLowArmorAlertRef.current.style.opacity = alertWave.toString();
            }
            if (time - lastWarningSoundTime.current > 1500) {
                soundRef.current?.playWarning();
                lastWarningSoundTime.current = time;
            }
        } else {
            if (hudLowArmorAlertRef.current) {
                hudLowArmorAlertRef.current.style.display = 'none';
            }
        }

        setSpeedVal(Math.round(targetSpeed.current * 100));
        setAltitudeVal(Math.round(shipPos.current.length() / 10)); 

        composer.render();
        animationFrameId.current = requestAnimationFrame((t) => tickRef.current(t));
    };

    useEffect(() => {
        soundRef.current = new SoundSynth();
        initThreeWorld();
        
        return () => {
            cancelAnimationFrame(animationFrameId.current);
            clearAllEntities();
            soundRef.current?.stopSequencer();
            soundRef.current?.stopAmbient();
            if (rendererRef.current) rendererRef.current.dispose();
        };
    }, [initThreeWorld, clearAllEntities]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        
        // Reset gameplay refs
        scoreRef.current = 0;
        damageVignetteRef.current = 0;
        proximityDangerRef.current = 0;
        shieldRegenTimer.current = 0;
        autoFireTimer.current = 0;
        hitFlashMap.current.clear();
        bossPhase.current = 1;
        
        fuelRef.current = 100;
        shieldRef.current = currentShipClass.maxShield;
        armorRef.current = currentShipClass.maxArmor;

        // Reset HUD element displays
        if (hudScoreRef.current) hudScoreRef.current.textContent = '0';
        if (hudFuelBarRef.current) hudFuelBarRef.current.style.width = '100%';
        if (hudFuelTextRef.current) hudFuelTextRef.current.textContent = '100%';
        if (hudShieldBarRef.current) hudShieldBarRef.current.style.width = '100%';
        if (hudShieldTextRef.current) hudShieldTextRef.current.textContent = '100%';
        if (hudArmorBarRef.current) hudArmorBarRef.current.style.width = '100%';
        if (hudArmorTextRef.current) hudArmorTextRef.current.textContent = '100%';
        if (hudSpeedRef.current) hudSpeedRef.current.innerHTML = `0 <span class="text-xs text-cyan-700 font-normal">km/s</span>`;
        if (hudDistanceRef.current) hudDistanceRef.current.innerHTML = `0 <span class="text-xs text-emerald-700 font-normal">ly</span>`;

        if (hudDamageVignetteRef.current) {
            hudDamageVignetteRef.current.style.opacity = '0';
            hudDamageVignetteRef.current.style.display = 'none';
        }
        if (hudProximityDangerRef.current) {
            hudProximityDangerRef.current.style.opacity = '0';
            hudProximityDangerRef.current.style.display = 'none';
        }
        if (hudComboRef.current) {
            hudComboRef.current.style.opacity = '0';
            hudComboRef.current.style.transform = 'translateX(20px)';
        }

        buildLevelWorld();
        lastTime.current = performance.now();
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = requestAnimationFrame((t) => tickRef.current(t));
        
        if (soundRef.current) {
            if (soundRef.current.ctx && soundRef.current.ctx.state === 'suspended') {
                soundRef.current.ctx.resume();
            }
            soundRef.current.startAmbient();
            soundRef.current.startSequencer(level % 3 === 0);
        }
        addLog("SİMÜLASYON AKTİF. [P] TUŞUNU BASILI TUTARAK ATEŞ ET!");
    };

    const nextLevel = () => {
        setLevel(l => l + 1);
        triggerHyperspace();
    };

    if (webglError) {
        return (
            <div className="w-full max-w-[1400px] mx-auto p-8 flex flex-col items-center justify-center min-h-[600px] bg-[#030109] text-center border border-rose-500/30 rounded-xl font-sans text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent"></div>
                <h2 className="text-3xl font-black text-rose-500 mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">SİMÜLASYON BAŞLATILAMIYOR</h2>
                <p className="text-cyan-100/70 max-w-md mb-8 leading-relaxed font-light">{webglError}</p>
                <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-xs text-cyan-200/50 max-w-lg leading-relaxed">
                    Sisteminiz veya tarayıcınız WebGL / Donanım İvmesini desteklemiyor olabilir. Lütfen tarayıcı ayarlarından <b>"Kullanılabilir olduğunda donanım ivmesini kullan"</b> (Hardware Acceleration) seçeneğinin açık olduğundan emin olun.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 flex flex-col gap-4 font-sans" ref={containerRef}>
            
            {/* Header HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gradient-to-r from-black/90 via-[#0a0a1a]/90 to-black/90 border-b border-cyan-500/30 rounded-t-xl shadow-[0_4px_30px_rgba(0,255,255,0.1)] backdrop-blur-xl gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
                
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-cyan-500/70 uppercase font-black tracking-[0.2em] mb-1"><Navigation className="inline w-3 h-3 mr-1" />Hız</span>
                        <span ref={hudSpeedRef} className="text-2xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{speedVal} <span className="text-xs text-cyan-700 font-normal">km/s</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-emerald-500/70 uppercase font-black tracking-[0.2em] mb-1"><Target className="inline w-3 h-3 mr-1" />Mesafe</span>
                        <span ref={hudDistanceRef} className="text-2xl font-black text-emerald-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{altitudeVal} <span className="text-xs text-emerald-700 font-normal">ly</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-amber-500/70 uppercase font-black tracking-[0.2em] mb-1"><Zap className="inline w-3 h-3 mr-1" />Skor</span>
                        <span ref={hudScoreRef} className="text-2xl font-black text-amber-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">{score}</span>
                    </div>
                </div>

                <div className="flex gap-6 flex-1 max-w-lg justify-center md:justify-end">
                    <div className="flex flex-col w-24 md:w-32">
                        <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Kalkan</span>
                            <span ref={hudShieldTextRef} className="font-mono">{Math.round((shield / currentShipClass.maxShield) * 100)}%</span>
                        </div>
                        <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-cyan-900/50 shadow-inner">
                            <div ref={hudShieldBarRef} className="h-full bg-gradient-to-r from-cyan-600 to-cyan-300 transition-all duration-150 shadow-[0_0_12px_#22d3ee]" style={{ width: `${(shield / currentShipClass.maxShield) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex flex-col w-24 md:w-32">
                        <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-rose-500/80 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Zırh</span>
                            <span ref={hudArmorTextRef} className="font-mono">{Math.round((armor / currentShipClass.maxArmor) * 100)}%</span>
                        </div>
                        <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-rose-900/50 shadow-inner">
                            <div ref={hudArmorBarRef} className="h-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-150 shadow-[0_0_12px_#f43f5e]" style={{ width: `${(armor / currentShipClass.maxArmor) * 100}%` }} />
                        </div>
                    </div>

                    <div className="flex flex-col w-24 md:w-32">
                        <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-amber-500/80 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Flame className="w-3 h-3" /> Yakıt</span>
                            <span ref={hudFuelTextRef} className="font-mono">{fuel}%</span>
                        </div>
                        <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-amber-900/50 shadow-inner">
                            <div ref={hudFuelBarRef} className={`h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-150 shadow-[0_0_12px_#f59e0b] ${fuel < 20 ? 'animate-pulse' : ''}`} style={{ width: `${fuel}%` }} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 items-center border-l border-white/10 pl-4 ml-2">
                    <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/40 hover:bg-white/10 text-muted-foreground rounded-full border border-white/5 transition-all" onClick={toggleSound} title="Ses">
                        {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 bg-black/40 hover:bg-white/10 text-muted-foreground rounded-full border border-white/5 transition-all" onClick={toggleQuality} title="Grafik Kalitesi">
                        {graphicsQuality === 'high' ? <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" /> : <ZapOff className="w-5 h-5 text-zinc-500" />}
                    </Button>
                    <div className="px-4 py-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-lg border border-indigo-500/30 font-black text-indigo-200 tracking-[0.2em] uppercase text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        SEKTÖR <span className="text-white text-sm">{level}</span>
                    </div>
                </div>
            </div>

            {/* Game Viewport Container (Cockpit Effect) */}
            <div className="relative rounded-b-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black cursor-crosshair border-x border-b border-white/5">
                
                {/* Red damage vignette overlay */}
                <div 
                    ref={hudDamageVignetteRef} 
                    className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-75 mix-blend-color-burn" 
                    style={{ 
                        background: 'radial-gradient(circle, rgba(244,63,94,0) 40%, rgba(244,63,94,0.65) 100%)',
                        opacity: 0,
                        display: 'none'
                    }} 
                />

                {/* Proximity warning pulsing border overlay */}
                <div 
                    ref={hudProximityDangerRef} 
                    className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-75 border-[6px] border-rose-500/80 rounded-b-xl" 
                    style={{ 
                        boxShadow: 'inset 0 0 40px rgba(239,68,68,0.5)',
                        opacity: 0,
                        display: 'none'
                    }} 
                />

                {/* Slow-mo bullet-time vignette overlay */}
                <div 
                    ref={hudSlowmoVignetteRef} 
                    className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-75 mix-blend-screen" 
                    style={{ 
                        background: 'radial-gradient(circle, rgba(0,191,255,0) 40%, rgba(0,191,255,0.4) 100%)',
                        border: '4px solid rgba(0,191,255,0.2)',
                        opacity: 0,
                        display: 'none'
                    }} 
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 text-lg font-black tracking-[0.4em] uppercase animate-pulse drop-shadow-[0_0_12px_rgba(0,191,255,0.8)] pointer-events-none select-none text-center">
                        ZAMAN BÜKÜLDÜ
                    </div>
                </div>

                {/* Low Armor warning overlay */}
                <div 
                    ref={hudLowArmorAlertRef} 
                    className="absolute top-24 left-1/2 transform -translate-x-1/2 p-3 rounded-xl border border-rose-500/50 bg-rose-950/80 backdrop-blur-md text-center pointer-events-none z-20 shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-opacity duration-300"
                    style={{ 
                        opacity: 0,
                        display: 'none'
                    }}
                >
                    <div className="text-rose-500 text-sm font-black tracking-[0.3em] uppercase animate-pulse">
                        KRİTİK DURUM: ZIRH DÜŞÜK
                    </div>
                </div>

                {/* Enemies Remaining holographic UI */}
                {(gameState === 'playing' || gameState === 'hyperspace') && (
                    <div className="absolute top-6 left-6 p-3 rounded-xl border border-cyan-500/30 bg-black/60 backdrop-blur-md pointer-events-none z-10 flex flex-col gap-0.5 shadow-lg select-none">
                        <span className="text-[9px] text-cyan-500/70 uppercase font-black tracking-[0.2em]">Kalan Hedefler</span>
                        <span ref={hudEnemiesRef} className="text-xl font-black text-cyan-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                            0 / 0
                        </span>
                    </div>
                )}

                {/* Combo Overlay */}
                <div ref={hudComboRef} className="absolute top-6 right-6 p-3 rounded-lg border border-amber-500/30 bg-black/60 backdrop-blur-md text-right pointer-events-none z-10 flex flex-col gap-1 shadow-lg transition-all duration-300 opacity-0 transform translate-x-4">
                    <div className="text-[9px] text-amber-500/60 uppercase font-black tracking-widest">Çarpan Kombo</div>
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-mono tracking-tighter" id="hud-combo-text">×1</div>
                    <div className="w-24 h-1 bg-black rounded-full overflow-hidden border border-amber-900/40">
                        <div className="h-full bg-amber-500" id="hud-combo-bar" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Cockpit Overlay SVG */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-30">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <path d="M0,0 L200,0 L250,50 Lcalc(100% - 250px),50 Lcalc(100% - 200px),0 L100%,0 L100%,100% L0,100% Z" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.3"/>
                        <path d="M0,100% L200,100% L250,calc(100% - 50px) Lcalc(100% - 250px),calc(100% - 50px) Lcalc(100% - 200px),100% L100%,100%" fill="none" stroke="#00ffff" strokeWidth="2" opacity="0.3"/>
                        
                        {/* Crosshair guidelines */}
                        <line x1="50%" y1="40%" x2="50%" y2="48%" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                        <line x1="50%" y1="52%" x2="50%" y2="60%" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                        <line x1="40%" y1="50%" x2="48%" y2="50%" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                        <line x1="52%" y1="50%" x2="60%" y2="50%" stroke="#00ffff" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    </svg>
                </div>

                <canvas ref={canvasRef} className="w-full block focus:outline-none" style={{ height: '700px' }} width={1200} height={700} tabIndex={0} />
                
                <div ref={floatingTextContainerRef} className="absolute top-0 left-0 w-full h-[700px] pointer-events-none z-10 overflow-hidden" />



                {/* Adaptive Crosshair */}
                {(gameState === 'playing' || gameState === 'hyperspace') && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-200">
                        <Crosshair className={`w-12 h-12 transition-colors duration-200 ${targetLocked ? 'text-rose-500 drop-shadow-[0_0_10px_#f43f5e] scale-110' : 'text-cyan-400 opacity-60 drop-shadow-[0_0_5px_#22d3ee]'}`} />
                        {targetLocked && (
                            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-[9px] text-rose-500 font-bold tracking-widest uppercase animate-pulse">
                                HEDEF KİLİTLENDİ
                            </div>
                        )}
                    </div>
                )}

                {/* Boss Health Bar */}
                {gameState === 'playing' && bossHealth > 0 && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-lg flex flex-col items-center z-20 bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-rose-500/20">
                        <div className="flex justify-between w-full mb-2">
                            <span className="text-rose-500 text-xs font-black uppercase tracking-[0.3em] drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">Sınıf-X Anomali</span>
                            <span className="text-rose-400 font-mono text-xs">{Math.round((bossHealth/bossMaxHealth)*100)}%</span>
                        </div>
                        <div className="w-full h-4 bg-black/80 border border-rose-500/50 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-rose-900 via-rose-500 to-rose-300 transition-all duration-300 shadow-[0_0_20px_#f43f5e]" style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }} />
                        </div>
                    </div>
                )}

                {/* Radar UI */}
                {gameState === 'playing' && (
                    <div className="absolute bottom-6 right-6 w-40 h-40 bg-black/40 backdrop-blur-xl rounded-full border-2 border-cyan-500/30 pointer-events-none flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                        <div className="absolute inset-0 rounded-full border border-cyan-400/20 m-5" />
                        <div className="absolute inset-0 rounded-full border border-cyan-400/10 m-10" />
                        <div className="absolute w-full h-[1px] bg-cyan-500/20" />
                        <div className="absolute h-full w-[1px] bg-cyan-500/20" />
                        
                        <div className="w-full h-full animate-[spin_3s_linear_infinite] border-t-2 border-cyan-400/60 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)', background: 'linear-gradient(90deg, rgba(34,211,238,0) 50%, rgba(34,211,238,0.2) 100%)' }} />
                        <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_15px_#22d3ee] z-10" />
                        
                        <div className="absolute text-[9px] text-cyan-400/70 top-2 font-mono font-bold">Z</div>
                        <div className="absolute text-[9px] text-cyan-400/70 right-2 font-mono font-bold">X</div>
                        
                        {radarEntities.map((e, idx) => {
                            const scale = 0.04;
                            const limit = 18;
                            const rx = Math.max(-limit, Math.min(limit, e.x * scale));
                            const ry = Math.max(-limit, Math.min(limit, e.y * scale)); 
                            
                            return (
                                <div key={idx} className={`absolute rounded-full transition-all duration-100 ${e.type === 'boss' ? 'bg-purple-500 w-3 h-3 shadow-[0_0_12px_#a855f7]' : 'bg-rose-500 w-2 h-2 shadow-[0_0_8px_#f43f5e]'}`} style={{ transform: `translate(${rx}px, ${ry}px)` }} />
                            );
                        })}
                    </div>
                )}

                {/* Flight Log */}
                {(gameState === 'playing' || gameState === 'hyperspace') && (
                    <div className="absolute bottom-6 left-6 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md max-w-sm w-full text-[11px] text-emerald-400 font-mono tracking-wide pointer-events-none z-10 flex flex-col gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="text-[10px] text-emerald-500/60 border-b border-emerald-500/20 pb-1 mb-1.5 uppercase font-black flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5" /> Sistem Kayıtları (v2.4)
                        </div>
                        {logMessages.map((log, idx) => (
                            <div key={idx} className={`transition-all duration-300 ${idx === 0 ? 'text-emerald-300 font-bold scale-100 opacity-100' : 'text-emerald-500/70 scale-95 origin-left opacity-70'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}

                {/* Overlays */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-30 pointer-events-auto cursor-default p-4 select-none">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent"></div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-cyan-300 to-emerald-400 mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] text-center select-none">
                            GRAVITY WARRIOR <br/> <span className="text-rose-500 text-3xl md:text-4xl">3D: ASCENSION</span>
                        </h1>
                        <p className="text-cyan-100/60 max-w-xl text-center mb-6 text-xs md:text-sm font-light leading-relaxed px-4 select-none">
                            Otomatik ilerleyen bir uzay savaş simülasyonu. Klavye ile manevra yap, düşman lazerleri'nden kaç, sektörü temizle!
                        </p>

                        {/* Ship Class Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full px-6 mb-8 z-40">
                            {SHIP_CLASSES.map((ship) => {
                                const isSelected = selectedShipId === ship.id;
                                return (
                                    <div 
                                        key={ship.id}
                                        onClick={() => setSelectedShipId(ship.id)}
                                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 relative overflow-hidden group select-none ${
                                            isSelected 
                                                ? 'bg-gradient-to-b from-cyan-950/40 to-[#0a0a20]/80 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)]' 
                                                : 'bg-[#050510]/60 border-white/10 hover:border-cyan-500/40 hover:bg-[#070718]/80'
                                        }`}
                                    >
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-300" />
                                        
                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs font-black uppercase tracking-widest ${isSelected ? 'text-cyan-400' : 'text-cyan-100/60'}`}>
                                                {ship.name}
                                            </span>
                                            {isSelected && (
                                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                                            )}
                                        </div>
                                        
                                        <p className="text-[11px] text-cyan-100/50 leading-relaxed font-light flex-grow">
                                            {ship.description}
                                        </p>
                                        
                                        <div className="border-t border-white/5 pt-1.5 flex flex-col gap-0.5 text-[9px] font-mono text-cyan-200/60">
                                            <div className="flex justify-between">
                                                <span>Maks Hız:</span>
                                                <span className="font-bold text-cyan-100">{ship.maxSpeed * 100} km/s</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Kalkan / Zırh:</span>
                                                <span className="font-bold text-cyan-100">{ship.maxShield} / {ship.maxArmor}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Birincil Silah:</span>
                                                <span className="font-bold text-cyan-100 capitalize">
                                                    {ship.weaponPattern === 'normal' ? 'Çift Lazer' : (ship.weaponPattern === 'multi' ? 'Üçlü Plazma' : 'Lazer Ağır Dalga')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <Button 
                            onClick={startGame} 
                            size="lg" 
                            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-12 py-6 text-base md:text-lg rounded-full shadow-[0_0_40px_#22d3ee] transition-all hover:scale-105 border-2 border-cyan-200 z-50 cursor-pointer pointer-events-auto"
                        >
                            SİMÜLASYONU BAŞLAT
                        </Button>

                        {/* Keyboard Controls Guide */}
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl w-full px-4 text-center select-none">
                            {[{key:'W', desc:'Yukarı'},{key:'S', desc:'Aşağı'},{key:'A', desc:'Sol'},{key:'D', desc:'Sağ'},{key:'P', desc:'Ateş / Hızlan'}].map(({key,desc}) => (
                                <div key={key} className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-lg border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center text-cyan-300 font-black text-base shadow-[0_0_10px_rgba(34,211,238,0.2)] backdrop-blur-sm">{key}</div>
                                    <span className="text-[10px] text-cyan-100/50 font-mono uppercase tracking-wider">{desc}</span>
                                </div>
            ))}
                        </div>
                    </div>
                )}

                {gameState === 'hyperspace' && (
                    <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center z-30 pointer-events-none">
                        <h2 className="text-5xl font-black text-white tracking-[0.5em] drop-shadow-[0_0_20px_#00ffff] animate-pulse">HİPER UZAY ATLAYIŞI</h2>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-rose-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-30">
                        <div className="p-10 rounded-3xl border border-rose-500/30 bg-black/50 flex flex-col items-center shadow-[0_0_100px_rgba(244,63,94,0.3)]">
                            <h2 className="text-5xl font-black text-rose-500 mb-4 tracking-widest drop-shadow-[0_0_20px_#f43f5e]">SİSTEM ÇÖKTÜ</h2>
                            <p className="text-rose-200 mb-2 font-mono text-xl">Ulaşılan Sektör: <span className="text-white font-black">{level}</span></p>
                            <p className="text-rose-200 mb-10 font-mono text-xl">Final Skor: <span className="text-white font-black">{score}</span></p>
                            <Button onClick={startGame} className="bg-rose-500 text-white hover:bg-rose-400 font-bold px-10 py-6 text-lg rounded-xl shadow-[0_0_20px_#f43f5e]">
                                SİSTEMİ YENİDEN BAŞLAT
                            </Button>
                        </div>
                    </div>
                )}

                {gameState === 'victory' && (
                    <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-30">
                        <div className="p-10 rounded-3xl border border-emerald-500/30 bg-black/50 flex flex-col items-center shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                            <h2 className="text-5xl font-black text-emerald-400 mb-4 tracking-widest drop-shadow-[0_0_20px_#10b981]">SEKTÖR TEMİZLENDİ</h2>
                            <p className="text-emerald-200 mb-10 font-mono text-xl">Mevcut Skor: <span className="text-white font-black">{score}</span></p>
                            <Button onClick={nextLevel} className="bg-emerald-500 text-black hover:bg-emerald-400 font-black px-10 py-6 text-lg rounded-xl shadow-[0_0_30px_#10b981] animate-bounce">
                                SONRAKİ SEKTÖRE ATLA
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tactical Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-cyan-900/50 shadow-lg hover:border-cyan-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> Uçuş Kontrolü</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Geminiz otomatik olarak ileriye doğru uçar. Fare kontrolleri tamamen devre dışı bırakılmıştır; böylece laptop ve trackpadlerde en rahat oynanışı sunar.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-emerald-900/50 shadow-lg hover:border-emerald-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Yönlendirme</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Manevra yapmak için klavyenizden <kbd className="bg-black text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">A</kbd> / <kbd className="bg-black text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">D</kbd> (Sol / Sağ) ve <kbd className="bg-black text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">W</kbd> / <kbd className="bg-black text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">S</kbd> (Yukarı / Aşağı) tuşlarını kullanın.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-rose-900/50 shadow-lg hover:border-rose-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Crosshair className="w-4 h-4" /> Silahlar</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Klavyenizden <kbd className="bg-black text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono">P</kbd> tuşuna veya <kbd className="bg-black text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono">SPACE</kbd> tuşuna basarak ateş edin. Lazer ağınız ile hedefleri imha edin.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-amber-900/50 shadow-lg hover:border-amber-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Taktik</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Düşmanlar ve kristaller rotanız üzerinde doğrusal olarak sıralıdır. Gelen lazerlerden kaçınmak için kıvrak manevralar yapın.</p>
                </div>
            </div>
        </div>
    );
}
