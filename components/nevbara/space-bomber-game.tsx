"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { Activity, Shield, Flame, Target, Volume2, VolumeX, Crosshair, Zap, Navigation, Sparkles, ZapOff, AlertTriangle, ShoppingBag, Sliders, Cpu, ArrowUpRight } from 'lucide-react';
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
    isMissile?: boolean;
    mesh: THREE.Mesh;
}

interface SpaceMine {
    id: number;
    x: number; y: number; z: number;
    active: boolean;
    mesh: THREE.Group;
    light: THREE.PointLight | THREE.Mesh;
    beepTimer: number;
}

interface ScrapDrop {
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    active: boolean;
    mesh: THREE.Mesh;
}

interface LensFlare {
    group: THREE.Group;
    life: number;
    initialScale: number;
    mesh: THREE.Sprite;
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
    bossWarningMesh?: THREE.Line | null;
    bossSweepMesh?: THREE.Mesh | null;
}

interface DebrisAsteroid {
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    rx: number; ry: number; rz: number;
    size: number;
    health: number;
    active: boolean;
    mesh: THREE.Mesh;
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
    type: 'multi' | 'beam' | 'slowmo' | 'missile';
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

    playEMPWave() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const osc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 1.2);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.2);
            
            gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 1.2);
        } catch (e) {}
    }

    playMineWarning() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
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

    playTeslaLightning() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.linearRampToValueAtTime(120, now + 0.08);
            osc.frequency.setValueAtTime(400, now + 0.04);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, now);
            filter.Q.setValueAtTime(4.0, now);
            
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            osc.stop(now + 0.1);
        } catch (e) {}
    }

    playContinuousBeam() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(150, now);
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(152, now);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(500, now);
            filter.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
            
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            
            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            osc1.start();
            osc2.start();
            osc1.stop(now + 0.2);
            osc2.stop(now + 0.2);
        } catch (e) {}
    }

    playFlakExplosion() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSource = this.ctx.createBufferSource();
            bufferSource.buffer = this.noiseBuffer;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, now);
            filter.frequency.exponentialRampToValueAtTime(20, now + 0.45);
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.9, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
            
            bufferSource.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            bufferSource.start();
            bufferSource.stop(now + 0.45);
        } catch (e) {}
    }

    playShieldRipple() {
        if (!this.enabled || !this.ctx || !this.masterGain) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start();
            osc.stop(now + 0.18);
        } catch (e) {}
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

// --- v5.0 Quantum Interfaces ---
interface GalaxyNode {
    id: string;
    name: string;
    type: 'combat' | 'asteroid' | 'anomaly' | 'boss';
    description: string;
    threat: number;
    hazard: 'solar_storm' | 'mine_field' | 'magnetic_dust' | 'none';
    x: number;
    y: number;
    completed: boolean;
    adjacent: string[];
}

interface DefenseDrone {
    id: number;
    mesh: THREE.Group;
    orbitAngle: number;
    fireCooldown: number;
    droneType: 'laser' | 'shield' | 'missile';
    targetId: number | null;
}

const CRTShader = {
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 0.0 },
        aberrationScale: { value: 0.0 },
        noiseScale: { value: 0.04 },
        scanlineStrength: { value: 0.06 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float aberrationScale;
        uniform float noiseScale;
        uniform float scanlineStrength;
        varying vec2 vUv;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            vec2 centered = uv - 0.5;
            float dist = dot(centered, centered);
            uv = 0.5 + centered * (1.0 + dist * 0.04);

            if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                return;
            }

            float shift = 0.0025 + aberrationScale * 0.012;
            vec4 col;
            col.r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
            col.g = texture2D(tDiffuse, uv).g;
            col.b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
            col.a = 1.0;

            float scanline = sin(uv.y * 700.0 + time * 4.0) * scanlineStrength;
            col.rgb -= vec3(scanline);

            float flicker = sin(time * 24.0) * 0.004;
            col.rgb += vec3(flicker);

            float vig = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
            col.rgb *= clamp(15.0 * vig, 0.65, 1.0);

            float n = hash(uv + time) * noiseScale;
            col.rgb += vec3(n);

            gl_FragColor = col;
        }
    `
};

const LensingShader = {
    uniforms: {
        tDiffuse: { value: null },
        uBlackHoleScreen: { value: new THREE.Vector2(0.5, 0.5) },
        uActive: { value: 0.0 },
        uRadius: { value: 0.055 },
        uLensScale: { value: 0.08 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uBlackHoleScreen;
        uniform float uActive;
        uniform float uRadius;
        uniform float uLensScale;
        varying vec2 vUv;
        void main() {
            if (uActive < 0.5) {
                gl_FragColor = texture2D(tDiffuse, vUv);
                return;
            }
            vec2 uv = vUv;
            vec2 diff = uv - uBlackHoleScreen;
            float dist = length(diff);
            if (dist < uRadius) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
                float distortion = uLensScale * uRadius / (dist - uRadius * 0.94);
                vec2 lensUv = uBlackHoleScreen + diff * (1.0 + distortion);
                vec4 col = texture2D(tDiffuse, lensUv);
                float redShift = smoothstep(uRadius * 1.25, uRadius, dist);
                col.rgb = mix(col.rgb, vec3(col.r * 1.6, col.g * 0.2, col.b * 0.05), redShift * 0.6);
                gl_FragColor = col;
            }
        }
    `
};

const PlanetSurfaceShader = {
    uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Color('#2c3e50') },
        color2: { value: new THREE.Color('#e74c3c') },
        color3: { value: new THREE.Color('#f39c12') }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f*f*(3.0-2.0*f);
            return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                       mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < 4; ++i) {
                v += a * noise(p);
                p = rot * p * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 p = vUv * 8.0;
            p.y += sin(vUv.x * 2.0) * 0.15;
            float speed = 0.08 * time;
            if (vUv.y > 0.4 && vUv.y < 0.6) speed = -0.12 * time;
            p.x += speed;

            float n = fbm(p);
            vec3 col = mix(color1, color2, n);
            col = mix(col, color3, fbm(p + vec2(n * 2.0, time * 0.02)));

            vec2 spotCenter = vec2(0.3, 0.35);
            float d = distance(vUv, spotCenter);
            if (d < 0.075) {
                float spotFactor = smoothstep(0.075, 0.0, d);
                col = mix(col, vec3(0.58, 0.11, 0.11), spotFactor * 0.85);
            }

            vec3 normal = normalize(vNormal);
            vec3 lightDir = normalize(vec3(1.0, 1.0, 0.8));
            float diff = max(0.12, dot(normal, lightDir));
            
            vec3 viewDir = normalize(vViewPosition);
            float rim = 1.0 - max(0.0, dot(normal, viewDir));
            rim = pow(rim, 4.0) * 0.35;
            
            gl_FragColor = vec4(col * diff + vec3(0.3, 0.45, 0.6) * rim, 1.0);
        }
    `
};

const AtmosphereShader = {
    uniforms: {
        color: { value: new THREE.Color('#3498db') }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(vViewPosition);
            float intensity = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
            gl_FragColor = vec4(color * intensity, intensity * 0.8);
        }
    `
};

const PlanetRingsShader = {
    uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color('#95a5a6') }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vLocalPosition;
        void main() {
            vUv = uv;
            vLocalPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vLocalPosition;

        void main() {
            float dist = length(vLocalPosition.xy);
            float inner = 320.0;
            float outer = 580.0;
            
            if (dist < inner || dist > outer) {
                discard;
            }

            float ringLines = sin(dist * 0.8) * cos(dist * 0.35) * 0.5 + 0.5;
            ringLines += sin(dist * 3.5) * 0.15;
            
            float alpha = smoothstep(inner, inner + 25.0, dist) * smoothstep(outer, outer - 25.0, dist);
            alpha *= (0.2 + ringLines * 0.8) * 0.65;
            
            gl_FragColor = vec4(color * (0.85 + ringLines * 0.15), alpha);
        }
    `
};

const ShieldRippleShader = {
    uniforms: {
        time: { value: 0.0 },
        color: { value: new THREE.Color(0.0, 0.8, 1.0) },
        uHitPositions: { value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
        uHitTimes: { value: [-9999.0, -9999.0, -9999.0, -9999.0] },
        uHitStrengths: { value: [0.0, 0.0, 0.0, 0.0] },
        shieldStrength: { value: 1.0 }
    },
    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 uHitPositions[4];
        uniform float uHitTimes[4];
        uniform float uHitStrengths[4];
        uniform float shieldStrength;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
            float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
            rim = pow(rim, 3.5) * 0.45;
            
            float grid = sin(vPosition.x * 2.5) * sin(vPosition.y * 2.5) * sin(vPosition.z * 2.5);
            grid = step(0.92, grid) * 0.14;
            
            float totalRipple = 0.0;
            for (int i = 0; i < 4; i++) {
                float timeSinceHit = time - uHitTimes[i];
                if (timeSinceHit > 0.0 && timeSinceHit < 2.0 && uHitStrengths[i] > 0.0) {
                    float distToHit = distance(vPosition, uHitPositions[i]);
                    float rippleSpeed = 18.0;
                    float rippleWidth = 1.6;
                    float waveFront = timeSinceHit * rippleSpeed;
                    if (distToHit < waveFront) {
                        float w = sin((distToHit - waveFront) * 3.0) * 0.5 + 0.5;
                        w *= smoothstep(0.0, -rippleWidth, distToHit - waveFront);
                        w *= (1.0 - (timeSinceHit / 2.0)) * uHitStrengths[i];
                        totalRipple += w;
                    }
                }
            }
            
            float alpha = (rim + totalRipple * 0.98 + grid) * shieldStrength * 0.8;
            gl_FragColor = vec4(color + vec3(totalRipple * 0.35), alpha);
        }
    `
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

    // New v4.0 Direct DOM refs
    const hudScrapTextRef = useRef<HTMLSpanElement>(null);
    const hudWeaponsSliderRef = useRef<HTMLInputElement>(null);
    const hudShieldsSliderRef = useRef<HTMLInputElement>(null);
    const hudEnginesSliderRef = useRef<HTMLInputElement>(null);
    const hudWeaponsValRef = useRef<HTMLSpanElement>(null);
    const hudShieldsValRef = useRef<HTMLSpanElement>(null);
    const hudEnginesValRef = useRef<HTMLSpanElement>(null);
    const hudSolarStormAlertRef = useRef<HTMLDivElement>(null);

    // New v5.0 instrument panel & radar refs
    const oscilloscopeCanvasRef = useRef<HTMLCanvasElement>(null);
    const hudCoreTempTextRef = useRef<HTMLSpanElement>(null);
    const hudCoreTempBarRef = useRef<HTMLDivElement>(null);
    const hudGForceTextRef = useRef<HTMLSpanElement>(null);
    const hudRollYawTextRef = useRef<HTMLSpanElement>(null);
    
    // v6.0 Weapon telemetry refs
    const hudWeaponHeatTextRef = useRef<HTMLSpanElement>(null);
    const hudWeaponHeatBarRef = useRef<HTMLDivElement>(null);
    
    // v5.0 State Refs
    const crtPassRef = useRef<any>(null);
    const quantumDustPointsRef = useRef<THREE.Points | null>(null);
    const dronesRef = useRef<DefenseDrone[]>([]);
    const galaxyNodesRef = useRef<GalaxyNode[]>([]);
    const activeSectorHazardRef = useRef<'solar_storm' | 'mine_field' | 'magnetic_dust' | 'anomaly_field' | 'none'>('none');
    
    const hangarUpgradesRef = useRef<{
        weapons: number;
        shields: number;
        engines: number;
        maxDrones: number;
    }>({
        weapons: 0,
        shields: 0,
        engines: 0,
        maxDrones: 1
    });
    
    const coreTemperatureRef = useRef<number>(40);

    // v6.0 Singularity Edition Refs and States
    const activeWeaponTypeRef = useRef<'laser' | 'beam' | 'tesla' | 'flak'>('laser');
    const [activeWeaponType, setActiveWeaponType] = useState<'laser' | 'beam' | 'tesla' | 'flak'>('laser');
    const weaponHeatRef = useRef<number>(0);
    
    // Planet refs
    const planetGroupRef = useRef<THREE.Group | null>(null);
    const planetMeshRef = useRef<THREE.Mesh | null>(null);
    const planetAtmosphereRef = useRef<THREE.Mesh | null>(null);
    const planetRingsRef = useRef<THREE.Mesh | null>(null);
    
    // Black Hole refs
    const blackHolePosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -1000));
    const blackHoleMeshRef = useRef<THREE.Group | null>(null);
    const accretionDiskMeshRef = useRef<THREE.Points | null>(null);
    const lensingPassRef = useRef<any>(null);
    
    // Ship Wing tilt groups
    const wingLGroupRef = useRef<THREE.Group | null>(null);
    const wingRGroupRef = useRef<THREE.Group | null>(null);
    
    // Shield Hits ripples (multi-impact)
    const shieldHitsRef = useRef<Array<{ position: THREE.Vector3; time: number; strength: number }>>([]);
    const lightningLinesRef = useRef<THREE.Line[]>([]);
    const flakShellsRef = useRef<any[]>([]);

    // v5.0 React States for pausetime overlays
    const [selectedMapNodeId, setSelectedMapNodeId] = useState<string>('');
    const [hangarWeapons, setHangarWeapons] = useState(0);
    const [hangarShields, setHangarShields] = useState(0);
    const [hangarEngines, setHangarEngines] = useState(0);
    const [hangarMaxDrones, setHangarMaxDrones] = useState(1);
    const [ownedDrones, setOwnedDrones] = useState<string[]>([]);

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

    // Scrap & Module Refs
    const scrapCountRef = useRef<number>(0);
    const activeModulesRef = useRef<{
        empShock: boolean;
        nanobots: boolean;
        magnetizer: boolean;
        reactorOvercharge: boolean;
    }>({
        empShock: false,
        nanobots: false,
        magnetizer: false,
        reactorOvercharge: false
    });
    
    // Energy Settings Refs (Total = 10 allocated)
    const energyWeaponsRef = useRef<number>(3);
    const energyShieldsRef = useRef<number>(3);
    const energyEnginesRef = useRef<number>(4);
    
    // Solar Storm Refs
    const solarStormActiveRef = useRef<boolean>(false);
    const solarStormTimerRef = useRef<number>(800); 
    const solarStormDurationRef = useRef<number>(0); 
    const solarStormWarningRef = useRef<number>(0); 
    
    // Space Hazards & Scrap Refs
    const spaceMines = useRef<SpaceMine[]>([]);
    const scrapDrops = useRef<ScrapDrop[]>([]);
    const lensFlares = useRef<LensFlare[]>([]);
    
    const [shopUpdateTrigger, setShopUpdateTrigger] = useState(0);
    const [marketOpen, setMarketOpen] = useState(false);

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
    const [gameState, setGameState] = useState<'idle' | 'hyperspace' | 'playing' | 'paused' | 'gameover' | 'victory' | 'galaxymap'>('idle');
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
    const debrisAsteroids = useRef<DebrisAsteroid[]>([]);
    const nebulaPoints = useRef<THREE.Points | null>(null);
    
    const comboMultiplier = useRef<number>(1);
    const comboTimer = useRef<number>(0);
    const weaponType = useRef<'normal' | 'multi' | 'beam' | 'missile'>('normal');
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

    const setShieldLevel = useCallback((value: number, relativeHitPos?: THREE.Vector3) => {
        const maxShieldCapacity = currentShipClass.maxShield * (activeModulesRef.current.reactorOvercharge ? 0.7 : 1.0);
        if (value < shieldRef.current) {
            shieldHitLife.current = 1.0;
            soundRef.current?.playShieldRipple();
            
            const hitPos = relativeHitPos ? relativeHitPos.clone() : new THREE.Vector3(0, 0, -5);
            shieldHitsRef.current.push({
                position: hitPos,
                time: performance.now() * 0.001,
                strength: Math.min(1.0, (shieldRef.current - value) / 10.0 + 0.3)
            });
            if (shieldHitsRef.current.length > 4) {
                shieldHitsRef.current.shift();
            }
            
            // EMP Shock Module Check: trigger when shield collapses to zero
            if (activeModulesRef.current.empShock && value <= 0 && shieldRef.current > 0) {
                addLog("SİSTEM KORUMASI: EMP ŞOKU ATEŞLENDİ!");
                soundRef.current?.playEMPWave();
                createShockwave(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#a855f7');
                createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#a855f7', 35, 1.5);
                screenShakeRef.current = Math.max(screenShakeRef.current, 6.0);
                
                // Destroy enemy bullets nearby
                bullets.current.forEach(b => {
                    if (b.isEnemy) {
                        const dist = new THREE.Vector3(b.x, b.y, b.z).distanceTo(shipPos.current);
                        if (dist < 280) {
                            b.life = 0;
                            createExplosion(b.x, b.y, b.z, '#a855f7', 3, 0.3);
                        }
                    }
                });
            }
        }
        const clamped = Math.max(0, Math.min(maxShieldCapacity, value));
        shieldRef.current = clamped;
        const pct = Math.round((clamped / maxShieldCapacity) * 100);
        if (hudShieldBarRef.current) {
            hudShieldBarRef.current.style.width = `${pct}%`;
        }
        if (hudShieldTextRef.current) {
            hudShieldTextRef.current.textContent = `${pct}%`;
        }
        if (shieldBubbleMesh.current && shieldBubbleMesh.current.material instanceof THREE.ShaderMaterial) {
            shieldBubbleMesh.current.material.uniforms.shieldStrength.value = clamped / maxShieldCapacity;
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
        if (lightningLinesRef.current) {
            lightningLinesRef.current.forEach(l => scene.remove(l));
            lightningLinesRef.current = [];
        }
        if (flakShellsRef.current) {
            flakShellsRef.current.forEach(fs => {
                if (fs.mesh) scene.remove(fs.mesh);
            });
            flakShellsRef.current = [];
        }
        enemies.current.forEach(e => {
            scene.remove(e.mesh);
            if (e.warningFlare) scene.remove(e.warningFlare);
            if (e.bossWarningMesh) scene.remove(e.bossWarningMesh);
            if (e.bossSweepMesh) scene.remove(e.bossSweepMesh);
        });
        enemies.current = [];
        crystals.current.forEach(c => scene.remove(c.mesh)); crystals.current = [];
        powerUps.current.forEach(p => scene.remove(p.mesh)); powerUps.current = [];
        particles.current.forEach(p => scene.remove(p.mesh)); particles.current = [];
        shockwaves.current.forEach(s => scene.remove(s.mesh)); shockwaves.current = [];
        cosmicFleet.current.forEach(f => scene.remove(f.mesh)); cosmicFleet.current = [];
        cosmicLasers.current.forEach(l => scene.remove(l.mesh)); cosmicLasers.current = [];
        debrisAsteroids.current.forEach(a => scene.remove(a.mesh)); debrisAsteroids.current = [];
        spaceMines.current.forEach(m => {
            scene.remove(m.mesh);
            if (m.light) scene.remove(m.light);
        });
        spaceMines.current = [];
        scrapDrops.current.forEach(s => scene.remove(s.mesh)); scrapDrops.current = [];
        lensFlares.current.forEach(lf => scene.remove(lf.group)); lensFlares.current = [];
        if (nebulaPoints.current) {
            scene.remove(nebulaPoints.current);
            nebulaPoints.current = null;
        }
    }, []);

    // --- HELPER FUNCTIONS FOR V4.0 (Energy, Modules, Hazards) ---
    const updateEnergyHUD = useCallback(() => {
        if (hudWeaponsSliderRef.current) hudWeaponsSliderRef.current.value = energyWeaponsRef.current.toString();
        if (hudShieldsSliderRef.current) hudShieldsSliderRef.current.value = energyShieldsRef.current.toString();
        if (hudEnginesSliderRef.current) hudEnginesSliderRef.current.value = energyEnginesRef.current.toString();
        
        if (hudWeaponsValRef.current) hudWeaponsValRef.current.textContent = energyWeaponsRef.current.toString();
        if (hudShieldsValRef.current) hudShieldsValRef.current.textContent = energyShieldsRef.current.toString();
        if (hudEnginesValRef.current) hudEnginesValRef.current.textContent = energyEnginesRef.current.toString();
    }, []);

    const setEnergyAllocation = useCallback((type: 'weapons' | 'shields' | 'engines', val: number) => {
        const target = Math.max(0, Math.min(10, val));
        let currentVal = 0;
        if (type === 'weapons') currentVal = energyWeaponsRef.current;
        else if (type === 'shields') currentVal = energyShieldsRef.current;
        else currentVal = energyEnginesRef.current;
        
        const diff = target - currentVal;
        if (diff === 0) return;
        
        const otherTypes = (['weapons', 'shields', 'engines'] as const).filter(t => t !== type);
        const other1 = otherTypes[0];
        const other2 = otherTypes[1];
        
        let otherVal1 = other1 === 'weapons' ? energyWeaponsRef.current : (other1 === 'shields' ? energyShieldsRef.current : energyEnginesRef.current);
        let otherVal2 = other2 === 'weapons' ? energyWeaponsRef.current : (other2 === 'shields' ? energyShieldsRef.current : energyEnginesRef.current);
        
        const steps = Math.abs(diff);
        const sign = Math.sign(diff);
        
        for (let i = 0; i < steps; i++) {
            if (sign > 0) {
                if (otherVal1 > otherVal2 && otherVal1 > 0) {
                    otherVal1--;
                } else if (otherVal2 > 0) {
                    otherVal2--;
                } else if (otherVal1 > 0) {
                    otherVal1--;
                }
            } else {
                if (otherVal1 < otherVal2 && otherVal1 < 10) {
                    otherVal1++;
                } else if (otherVal2 < 10) {
                    otherVal2++;
                } else if (otherVal1 < 10) {
                    otherVal1++;
                }
            }
        }
        
        if (type === 'weapons') energyWeaponsRef.current = target;
        else if (type === 'shields') energyShieldsRef.current = target;
        else energyEnginesRef.current = target;
        
        if (other1 === 'weapons') energyWeaponsRef.current = otherVal1;
        else if (other1 === 'shields') energyShieldsRef.current = otherVal1;
        else energyEnginesRef.current = otherVal1;
        
        if (other2 === 'weapons') energyWeaponsRef.current = otherVal2;
        else if (other2 === 'shields') energyShieldsRef.current = otherVal2;
        else energyEnginesRef.current = otherVal2;
        
        updateEnergyHUD();
        
        // Force React update for UI sync
        setShopUpdateTrigger(prev => prev + 1);
    }, [updateEnergyHUD]);

    const toggleMarket = useCallback(() => {
        setGameState(prev => {
            if (prev === 'playing') {
                soundRef.current?.stopAmbient();
                setMarketOpen(true);
                return 'paused';
            } else if (prev === 'paused') {
                soundRef.current?.startAmbient();
                lastTime.current = performance.now();
                setMarketOpen(false);
                return 'playing';
            }
            return prev;
        });
    }, []);

    const buyModule = useCallback((moduleKey: 'empShock' | 'nanobots' | 'magnetizer' | 'reactorOvercharge') => {
        const prices = {
            empShock: 20,
            nanobots: 25,
            magnetizer: 15,
            reactorOvercharge: 30
        };
        const price = prices[moduleKey];
        if (scrapCountRef.current >= price && !activeModulesRef.current[moduleKey]) {
            scrapCountRef.current -= price;
            activeModulesRef.current[moduleKey] = true;
            
            if (hudScrapTextRef.current) {
                hudScrapTextRef.current.textContent = scrapCountRef.current.toString();
            }
            
            if (moduleKey === 'reactorOvercharge') {
                const maxShieldVal = currentShipClass.maxShield * 0.7;
                setShieldLevel(Math.min(shieldRef.current, maxShieldVal));
            }
            
            addLog(`MODÜL SATIN ALINDI: ${moduleKey.toUpperCase()}`);
            soundRef.current?.playCollect();
            
            setShopUpdateTrigger(prev => prev + 1);
        } else {
            soundRef.current?.playWarning();
        }
    }, [currentShipClass, setShieldLevel, addLog]);

    const buyHangarDrone = useCallback((type: 'laser' | 'shield' | 'missile') => {
        const prices = { laser: 20, shield: 25, missile: 30 };
        const price = prices[type];
        
        if (scrapCountRef.current >= price && dronesRef.current.length < hangarUpgradesRef.current.maxDrones) {
            scrapCountRef.current -= price;
            if (hudScrapTextRef.current) {
                hudScrapTextRef.current.textContent = scrapCountRef.current.toString();
            }
            
            const droneGroup = new THREE.Group();
            let dGeo;
            let dCol;
            if (type === 'laser') {
                dGeo = new THREE.SphereGeometry(1.0, 8, 8);
                dCol = 0xffa500;
                const wing = new THREE.Mesh(new THREE.BoxGeometry(3, 0.2, 0.8), new THREE.MeshStandardMaterial({ color: 0x333333 }));
                droneGroup.add(wing);
            } else if (type === 'shield') {
                dGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 8);
                dCol = 0x3b82f6;
            } else {
                dGeo = new THREE.ConeGeometry(0.8, 2.0, 8);
                dCol = 0xef4444;
            }
            
            const dMat = new THREE.MeshStandardMaterial({ color: dCol, emissive: dCol, emissiveIntensity: 0.8 });
            const dMesh = new THREE.Mesh(dGeo, dMat);
            droneGroup.add(dMesh);
            
            sceneRef.current?.add(droneGroup);
            
            dronesRef.current.push({
                id: Math.random(),
                mesh: droneGroup,
                orbitAngle: Math.random() * Math.PI * 2,
                fireCooldown: 0,
                droneType: type,
                targetId: null
            });
            
            setOwnedDrones(dronesRef.current.map(d => d.droneType));
            addLog(`SAVUNMA DRONU AKTİFLEŞTİRİLDİ: ${type.toUpperCase()}`);
            soundRef.current?.playCollect();
            setShopUpdateTrigger(prev => prev + 1);
        } else {
            soundRef.current?.playWarning();
        }
    }, [addLog]);

    const upgradeHangarSystem = useCallback((sys: 'weapons' | 'shields' | 'engines' | 'maxDrones') => {
        const currentLvl = hangarUpgradesRef.current[sys];
        if (currentLvl >= 3) {
            soundRef.current?.playWarning();
            return;
        }
        
        const price = (currentLvl + 1) * 15;
        if (scrapCountRef.current >= price) {
            scrapCountRef.current -= price;
            hangarUpgradesRef.current[sys]++;
            
            if (hudScrapTextRef.current) {
                hudScrapTextRef.current.textContent = scrapCountRef.current.toString();
            }
            
            if (sys === 'weapons') setHangarWeapons(hangarUpgradesRef.current.weapons);
            else if (sys === 'shields') {
                setHangarShields(hangarUpgradesRef.current.shields);
                currentShipClass.maxShield += 25;
                setShieldLevel(shieldRef.current + 25);
            }
            else if (sys === 'engines') setHangarEngines(hangarUpgradesRef.current.engines);
            else if (sys === 'maxDrones') setHangarMaxDrones(hangarUpgradesRef.current.maxDrones);
            
            addLog(`GEMİ YÜKSELTMESİ: ${sys.toUpperCase()} +${hangarUpgradesRef.current[sys]}`);
            soundRef.current?.playCollect();
            setShopUpdateTrigger(prev => prev + 1);
        } else {
            soundRef.current?.playWarning();
        }
    }, [currentShipClass, setShieldLevel, addLog]);

    const generateGalaxyMap = useCallback((currentLevel: number) => {
        const nodes: GalaxyNode[] = [];
        
        nodes.push({
            id: 'node_start',
            name: `Mevcut Sektör (Sektör ${currentLevel})`,
            type: 'combat',
            description: 'Güvenli bölgeye geçiş tamamlandı.',
            threat: 1,
            hazard: 'none',
            x: 10,
            y: 50,
            completed: true,
            adjacent: ['node_opt1', 'node_opt2']
        });
        
        const nextLvl = currentLevel + 1;
        if (nextLvl % 3 === 0) {
            nodes.push({
                id: 'node_opt1',
                name: `X-X1 Sektör Merceği (BOSS)`,
                type: 'boss',
                description: 'Yüksek tehdit içeren anormal yerçekimi imzası.',
                threat: 5,
                hazard: 'none',
                x: 80,
                y: 50,
                completed: false,
                adjacent: []
            });
            nodes[0].adjacent = ['node_opt1'];
        } else {
            const names1 = ['Nötron Yıldızı Koronası', 'Karanlık Madde Bulutu', 'Korsan Savaş Ağı', 'Kuvars Asteroid Kemeri'];
            const name1 = names1[Math.floor(Math.random() * names1.length)];
            const hazard1: GalaxyNode['hazard'] = Math.random() > 0.5 ? 'solar_storm' : 'none';
            nodes.push({
                id: 'node_opt1',
                name: name1,
                type: 'asteroid',
                description: hazard1 === 'solar_storm' ? 'Yoğun güneş fırtınaları kalkanı aşındırır. Asteroidlerin arkasına saklanın!' : 'Zengin kristal yatakları ve bol miktarda metal hurda.',
                threat: Math.min(5, Math.max(1, Math.floor(Math.random() * 2) + currentLevel)),
                hazard: hazard1,
                x: 50,
                y: 25,
                completed: false,
                adjacent: ['node_final']
            });
            
            const names2 = ['Anomali Sıfır Noktası', 'Kritik Mayın Alanı', 'EMP Nebula Çekirdeği'];
            const name2 = names2[Math.floor(Math.random() * names2.length)];
            const hazard2: GalaxyNode['hazard'] = Math.random() > 0.5 ? 'mine_field' : 'none';
            nodes.push({
                id: 'node_opt2',
                name: name2,
                type: 'anomaly',
                description: hazard2 === 'mine_field' ? 'Yoğun aktif uzay mayınları tespit edildi. Yakınlık sensörlerine dikkat edin!' : 'Düşük görünürlük ve anormal radyo dalgaları.',
                threat: Math.min(5, Math.max(1, Math.floor(Math.random() * 2) + currentLevel)),
                hazard: hazard2,
                x: 50,
                y: 75,
                completed: false,
                adjacent: ['node_final']
            });
            
            nodes.push({
                id: 'node_final',
                name: `Sektör Kapısı ${nextLvl}`,
                type: 'combat',
                description: 'Sektörden çıkış kapısı öncesi son engeller.',
                threat: currentLevel + 1,
                hazard: 'none',
                x: 90,
                y: 50,
                completed: false,
                adjacent: []
            });
        }
        
        galaxyNodesRef.current = nodes;
        setSelectedMapNodeId('node_opt1');
        setShopUpdateTrigger(prev => prev + 1);
    }, []);

    const jumpToSector = useCallback((node: GalaxyNode) => {
        activeSectorHazardRef.current = node.hazard;
        setLevel(prev => prev + 1);
        setGameState('hyperspace');
        
        if (hudSolarStormAlertRef.current) {
            hudSolarStormAlertRef.current.style.display = 'none';
        }
        
        if (soundRef.current) {
            if (soundRef.current.ctx && soundRef.current.ctx.state === 'suspended') {
                soundRef.current.ctx.resume();
            }
            soundRef.current.playHyperspace();
            soundRef.current.startAmbient();
        }
        
        hyperspaceTimer.current = 100;
        addLog(`HİPER UZAY ATLAYIŞI BAŞLATILDI: ${node.name.toUpperCase()}`);
    }, [addLog]);

    const updateDefenseDrones = useCallback((dt: number) => {
        const scene = sceneRef.current;
        const ship = playerShipGroup.current;
        if (!scene || !ship) return;
        
        const numDrones = dronesRef.current.length;
        if (numDrones === 0) return;
        
        const time = performance.now() * 0.0015;
        
        dronesRef.current.forEach((drone, idx) => {
            const orbitRadius = 13 + Math.sin(time * 2.5 + idx) * 1.5;
            const speed = 2.0 + idx * 0.3;
            const angle = time * speed + (idx * Math.PI * 2) / numDrones;
            
            const dx = Math.cos(angle) * orbitRadius;
            const dy = Math.sin(angle * 0.6) * 3.5;
            const dz = Math.sin(angle) * orbitRadius;
            
            const droneTargetPos = new THREE.Vector3(dx, dy, dz);
            droneTargetPos.applyQuaternion(shipQuaternion.current);
            droneTargetPos.add(shipPos.current);
            
            drone.mesh.position.lerp(droneTargetPos, 0.18);
            drone.mesh.rotation.y += 0.04;
            
            drone.fireCooldown -= dt;
            
            if (drone.droneType === 'laser') {
                let nearestEnemy: Enemy | null = null;
                let minDist = 350;
                enemies.current.forEach(e => {
                    if (e.active && e.z < shipPos.current.z) {
                        const dist = new THREE.Vector3(e.x, e.y, e.z).distanceTo(drone.mesh.position);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestEnemy = e;
                        }
                    }
                });
                
                if (nearestEnemy && drone.fireCooldown <= 0) {
                    drone.fireCooldown = 65;
                    
                    const points = [
                        drone.mesh.position.clone(),
                        new THREE.Vector3((nearestEnemy as Enemy).x, (nearestEnemy as Enemy).y, (nearestEnemy as Enemy).z)
                    ];
                    const beamGeo = new THREE.BufferGeometry().setFromPoints(points);
                    const beamMat = new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.8 });
                    const beamLine = new THREE.Line(beamGeo, beamMat);
                    scene.add(beamLine);
                    
                    setTimeout(() => { scene.remove(beamLine); }, 80);
                    
                    const damage = 3 + hangarUpgradesRef.current.weapons * 1.5;
                    (nearestEnemy as Enemy).health -= damage;
                    createExplosion((nearestEnemy as Enemy).x, (nearestEnemy as Enemy).y, (nearestEnemy as Enemy).z, '#22c55e', 4, 0.4);
                    soundRef.current?.playShoot();
                }
            } else if (drone.droneType === 'shield') {
                const maxShieldVal = currentShipClass.maxShield * (activeModulesRef.current.reactorOvercharge ? 0.7 : 1.0);
                if (shieldRef.current < maxShieldVal) {
                    const regen = 0.06 * (1 + hangarUpgradesRef.current.shields * 0.5) * dt;
                    setShieldLevel(Math.min(maxShieldVal, shieldRef.current + regen));
                    
                    if (Math.random() < 0.1) {
                        const points = [drone.mesh.position.clone(), shipPos.current.clone()];
                        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                        const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.3 });
                        const line = new THREE.Line(lineGeo, lineMat);
                        scene.add(line);
                        setTimeout(() => { scene.remove(line); }, 50);
                    }
                }
            } else if (drone.droneType === 'missile') {
                let nearestAsteroid: DebrisAsteroid | null = null;
                let minDist = 300;
                debrisAsteroids.current.forEach(a => {
                    if (a.active && a.z < shipPos.current.z) {
                        const dist = new THREE.Vector3(a.x, a.y, a.z).distanceTo(drone.mesh.position);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestAsteroid = a;
                        }
                    }
                });
                
                if (nearestAsteroid && drone.fireCooldown <= 0) {
                    drone.fireCooldown = 180;
                    
                    const mGeo = new THREE.ConeGeometry(0.5, 1.8, 8);
                    mGeo.rotateX(Math.PI / 2);
                    const mMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
                    const mMesh = new THREE.Mesh(mGeo, mMat);
                    mMesh.position.copy(drone.mesh.position);
                    scene.add(mMesh);
                    
                    const direction = new THREE.Vector3((nearestAsteroid as DebrisAsteroid).x, (nearestAsteroid as DebrisAsteroid).y, (nearestAsteroid as DebrisAsteroid).z)
                        .sub(drone.mesh.position).normalize();
                    const missileSpeed = 15;
                    
                    bullets.current.push({
                        id: Math.random(),
                        x: drone.mesh.position.x,
                        y: drone.mesh.position.y,
                        z: drone.mesh.position.z,
                        vx: direction.x * missileSpeed,
                        vy: direction.y * missileSpeed,
                        vz: direction.z * missileSpeed,
                        life: 120,
                        isEnemy: false,
                        isMissile: true,
                        mesh: mMesh
                    });
                }
            }
        });
    }, [currentShipClass, setShieldLevel, createExplosion]);

    const updateOscilloscope = useCallback(() => {
        const canvas = oscilloscopeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 4;
        
        ctx.beginPath();
        const width = canvas.width;
        const height = canvas.height;
        const stepCount = soundRef.current?.currentStep || 0;
        
        for (let x = 0; x < width; x++) {
            const stepFactor = Math.sin(x * 0.05 + stepCount * 0.5) * 12.0;
            const noiseFactor = (Math.random() - 0.5) * (soundRef.current?.isPlayingMusic ? 6.0 : 1.0);
            const y = height / 2 + stepFactor + noiseFactor;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }, []);

    const fractureAsteroid = useCallback((asteroid: DebrisAsteroid) => {
        const scene = sceneRef.current;
        if (!scene) return;
        
        const numPieces = 3;
        const newSize = asteroid.size * 0.45;
        
        if (asteroid.size < 4.0) {
            return;
        }
        
        for (let i = 0; i < numPieces; i++) {
            const size = newSize * (0.8 + Math.random() * 0.4);
            const aGeo = new THREE.DodecahedronGeometry(size, 0);
            const aMat = new THREE.MeshStandardMaterial({ 
                color: 0x5a5a6a, 
                roughness: 0.95, 
                metalness: 0.05 
            });
            const aMesh = new THREE.Mesh(aGeo, aMat);
            aMesh.castShadow = true;
            aMesh.receiveShadow = true;
            
            const scatterDir = new THREE.Vector3(
                (Math.random() - 0.5) * 8.0,
                (Math.random() - 0.5) * 8.0,
                (Math.random() - 0.5) * 8.0
            );
            
            const px = asteroid.x + (Math.random() - 0.5) * size * 2.0;
            const py = asteroid.y + (Math.random() - 0.5) * size * 2.0;
            const pz = asteroid.z + (Math.random() - 0.5) * size * 2.0;
            
            aMesh.position.set(px, py, pz);
            scene.add(aMesh);
            
            debrisAsteroids.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                vx: asteroid.vx + scatterDir.x,
                vy: asteroid.vy + scatterDir.y,
                vz: asteroid.vz + scatterDir.z,
                rx: (Math.random() - 0.5) * 0.05,
                ry: (Math.random() - 0.5) * 0.05,
                rz: (Math.random() - 0.5) * 0.05,
                size,
                health: 5 + level * 1.5,
                active: true,
                mesh: aMesh
            });
        }
    }, [level]);

    const spawnScrap = useCallback((x: number, y: number, z: number) => {
        if (!sceneRef.current) return;
        const sGeo = new THREE.OctahedronGeometry(1.2);
        const sMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            emissive: 0xb58900,
            emissiveIntensity: 0.8,
            metalness: 0.9,
            roughness: 0.1
        });
        const mesh = new THREE.Mesh(sGeo, sMat);
        mesh.position.set(x, y, z);
        sceneRef.current.add(mesh);
        
        scrapDrops.current.push({
            id: Math.random(),
            x, y, z,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            vz: (Math.random() - 0.5) * 6,
            active: true,
            mesh
        });
    }, []);

    const createLensFlare = useCallback((x: number, y: number, z: number, colorStr: string, size: number = 30) => {
        if (!sceneRef.current) return;
        const group = new THREE.Group();
        group.position.set(x, y, z);
        
        const col = new THREE.Color(colorStr);
        
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            grad.addColorStop(0.2, `rgba(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)}, 0.6)`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 64, 64);
        }
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(size, size, 1);
        group.add(sprite);
        
        const streakCanvas = document.createElement('canvas');
        streakCanvas.width = 128;
        streakCanvas.height = 16;
        const sCtx = streakCanvas.getContext('2d');
        if (sCtx) {
            const grad = sCtx.createRadialGradient(64, 8, 0, 64, 8, 64);
            grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
            grad.addColorStop(0.3, `rgba(${Math.floor(col.r * 255)}, ${Math.floor(col.g * 255)}, ${Math.floor(col.b * 255)}, 0.4)`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            sCtx.fillStyle = grad;
            sCtx.fillRect(0, 0, 128, 16);
        }
        const streakTex = new THREE.CanvasTexture(streakCanvas);
        const streakMat = new THREE.SpriteMaterial({ map: streakTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
        const streakSprite = new THREE.Sprite(streakMat);
        streakSprite.scale.set(size * 4.5, size * 0.35, 1);
        group.add(streakSprite);
        
        sceneRef.current.add(group);
        
        lensFlares.current.push({
            group,
            life: 1.0,
            initialScale: 1.0,
            mesh: sprite
        });
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
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
            
            // Custom CRT scanline & Chromatic Aberration Shader Pass
            const crtPass = new ShaderPass(CRTShader);
            composer.addPass(crtPass);
            crtPassRef.current = crtPass;

            // Custom Lensing Shader Pass
            const lensingPass = new ShaderPass(LensingShader);
            composer.addPass(lensingPass);
            lensingPassRef.current = lensingPass;
            
            composerRef.current = composer;
            glitchPassRef.current = glitchPass;

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
            scene.add(ambientLight);
            
            const dirLight = new THREE.DirectionalLight(0xa29bfe, 2.5);
            dirLight.position.set(120, 200, 60);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 1024;
            dirLight.shadow.mapSize.height = 1024;
            dirLight.shadow.camera.near = 0.5;
            dirLight.shadow.camera.far = 1000;
            const d = 150;
            dirLight.shadow.camera.left = -d;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = -d;
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
            
            // Wingtips Glow
            const wingTipGeo = new THREE.BoxGeometry(0.4, 1.5, 3);
            const tipColor = new THREE.Color(currentShipClass.laserColor);
            const wingTipMat = new THREE.MeshStandardMaterial({ color: tipColor, emissive: tipColor, emissiveIntensity: 1.5 });
            const tipX = currentShipClass.id === 'interceptor' ? -9 : (currentShipClass.id === 'dreadnought' ? -7 : -8);

            // Left Wing Group
            const wingLGroup = new THREE.Group();
            wingLGroupRef.current = wingLGroup;
            shipGroup.add(wingLGroup);

            const wingL = new THREE.Mesh(wingGeoL, wingMat);
            wingL.rotation.x = Math.PI / 2;
            wingL.position.set(0, -0.2, 2);
            wingLGroup.add(wingL);

            const wingTipL = new THREE.Mesh(wingTipGeo, wingTipMat);
            wingTipL.position.set(tipX, 0.2, 5);
            wingLGroup.add(wingTipL);

            // Right Wing Group
            const wingRGroup = new THREE.Group();
            wingRGroupRef.current = wingRGroup;
            shipGroup.add(wingRGroup);

            const wingGeoR = wingGeoL.clone();
            wingGeoR.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
            const wingR = new THREE.Mesh(wingGeoR, wingMat);
            wingR.rotation.x = Math.PI / 2;
            wingR.position.set(0, -0.2, 2);
            wingRGroup.add(wingR);

            const wingTipR = new THREE.Mesh(wingTipGeo, wingTipMat);
            wingTipR.position.set(-tipX, 0.2, 5);
            wingRGroup.add(wingTipR);

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

            // Flames (Exhaust Plume Shaders)
            const flameGeo = new THREE.CylinderGeometry(0.1, 0.7, 4.0, 16, 16, true);
            flameGeo.rotateX(Math.PI / 2);
            
            const flameMatL = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    color: { value: tipColor },
                    thrust: { value: 1.0 }
                },
                vertexShader: `
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        vUv = uv;
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    uniform vec3 color;
                    uniform float thrust;
                    varying vec2 vUv;
                    varying vec3 vPosition;
                    void main() {
                        float flameNoise = sin(vUv.x * 12.0 + time * 25.0) * cos(vUv.y * 8.0 - time * 20.0) * 0.22;
                        float centerDist = abs(vUv.x - 0.5) * 2.0;
                        float shape = 1.0 - smoothstep(0.0, 1.0 - flameNoise, centerDist);
                        float lengthFade = smoothstep(1.0, 0.0, vUv.y);
                        vec3 flameColor = mix(color, vec3(1.0, 0.35, 0.0), thrust * 0.45);
                        float intensity = shape * lengthFade * thrust * 1.8;
                        gl_FragColor = vec4(flameColor * intensity, intensity * 0.6);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            const flameMatR = flameMatL.clone();
            
            const flameL = new THREE.Mesh(flameGeo, flameMatL);
            flameL.position.set(-1.5, 0, 5.0);
            shipGroup.add(flameL);
            thrusterFlameMeshL.current = flameL;

            const flameR = new THREE.Mesh(flameGeo, flameMatR);
            flameR.position.set(1.5, 0, 5.0);
            shipGroup.add(flameR);
            thrusterFlameMeshR.current = flameR;

            // Shield Bubble (Advanced Multi-Impact Ripple Shader)
            const shieldGeo = new THREE.SphereGeometry(currentShipClass.id === 'dreadnought' ? 8.5 : 7, 32, 32);
            const sMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(ShieldRippleShader.uniforms),
                vertexShader: ShieldRippleShader.vertexShader,
                fragmentShader: ShieldRippleShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            sMat.uniforms.color.value.copy(tipColor);
            const shieldBubble = new THREE.Mesh(shieldGeo, sMat);
            shipGroup.add(shieldBubble);
            shieldBubbleMesh.current = shieldBubble;

            shipGroup.traverse(child => {
                if (child instanceof THREE.Mesh && child !== shieldBubble) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(shipGroup);
            playerShipGroup.current = shipGroup;

            // --- v6.0 BACKGROUND PROCEDURAL PLANET & ATMO & RINGS ---
            const planetGroup = new THREE.Group();
            planetGroup.position.set(-450, 250, -3200);
            scene.add(planetGroup);
            planetGroupRef.current = planetGroup;

            const planetGeo = new THREE.SphereGeometry(250, 64, 64);
            const planetMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(PlanetSurfaceShader.uniforms),
                vertexShader: PlanetSurfaceShader.vertexShader,
                fragmentShader: PlanetSurfaceShader.fragmentShader
            });
            planetMat.uniforms.color1.value.set('#0f2027');
            planetMat.uniforms.color2.value.set('#203a43');
            planetMat.uniforms.color3.value.set('#2c5364');
            const planetMesh = new THREE.Mesh(planetGeo, planetMat);
            planetMesh.castShadow = true;
            planetMesh.receiveShadow = true;
            planetGroup.add(planetMesh);
            planetMeshRef.current = planetMesh;

            const atmoGeo = new THREE.SphereGeometry(260, 32, 32);
            const atmoMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(AtmosphereShader.uniforms),
                vertexShader: AtmosphereShader.vertexShader,
                fragmentShader: AtmosphereShader.fragmentShader,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true
            });
            atmoMat.uniforms.color.value.set('#00bfff');
            const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
            planetGroup.add(atmoMesh);
            planetAtmosphereRef.current = atmoMesh;

            const ringGeo = new THREE.RingGeometry(320, 580, 64);
            ringGeo.rotateX(Math.PI / 2.3);
            const ringMat = new THREE.ShaderMaterial({
                uniforms: THREE.UniformsUtils.clone(PlanetRingsShader.uniforms),
                vertexShader: PlanetRingsShader.vertexShader,
                fragmentShader: PlanetRingsShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            ringMat.uniforms.color.value.set('#bdc3c7');
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            planetGroup.add(ringMesh);
            planetRingsRef.current = ringMesh;

            // --- v6.0 BLACK HOLE SINGULARITY ---
            const blackHoleGroup = new THREE.Group();
            blackHoleGroup.position.copy(blackHolePosRef.current);
            scene.add(blackHoleGroup);
            blackHoleMeshRef.current = blackHoleGroup;

            const bhLight = new THREE.PointLight('#a855f7', 8, 400);
            blackHoleGroup.add(bhLight);

            const horizonGeo = new THREE.SphereGeometry(24, 32, 32);
            const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const horizon = new THREE.Mesh(horizonGeo, horizonMat);
            blackHoleGroup.add(horizon);

            const discGeo = new THREE.BufferGeometry();
            const discParticleCount = 2000;
            const discPos = new Float32Array(discParticleCount * 3);
            const discColors = new Float32Array(discParticleCount * 3);
            const discSpeeds = new Float32Array(discParticleCount);
            const discRadii = new Float32Array(discParticleCount);
            
            for (let i = 0; i < discParticleCount; i++) {
                const r = 38.0 + Math.random() * 110.0;
                const theta = Math.random() * Math.PI * 2.0;
                discPos[i * 3] = Math.cos(theta) * r;
                discPos[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
                discPos[i * 3 + 2] = Math.sin(theta) * r;

                const t = (r - 38.0) / 110.0;
                const c = new THREE.Color().lerpColors(new THREE.Color('#ffffff'), new THREE.Color('#a855f7'), t);
                if (Math.random() > 0.6) c.lerp(new THREE.Color('#ff3f34'), 0.5);
                
                discColors[i * 3] = c.r;
                discColors[i * 3 + 1] = c.g;
                discColors[i * 3 + 2] = c.b;
                
                discSpeeds[i] = 1.2 + (1.0 / Math.sqrt(r)) * 15.0;
                discRadii[i] = r;
            }
            discGeo.setAttribute('position', new THREE.BufferAttribute(discPos, 3));
            discGeo.setAttribute('color', new THREE.BufferAttribute(discColors, 3));
            
            const discMat = new THREE.PointsMaterial({
                size: 2.8,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const accretionDisk = new THREE.Points(discGeo, discMat);
            blackHoleGroup.add(accretionDisk);
            accretionDiskMeshRef.current = accretionDisk;
            
            (accretionDisk as any).speeds = discSpeeds;
            (accretionDisk as any).radii = discRadii;
            (accretionDisk as any).angles = new Float32Array(discParticleCount);

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

            // --- VOLUMETRIC NEBULA CLOUDS ---
            const nGeo = new THREE.BufferGeometry();
            const nebulaCount = 150;
            const nPos = new Float32Array(nebulaCount * 3);
            const nColors = new Float32Array(nebulaCount * 3);
            const nSizes = new Float32Array(nebulaCount);
            const nebColors = [
                new THREE.Color('#3c40c6'),
                new THREE.Color('#05c46b'),
                new THREE.Color('#00d2d3'),
                new THREE.Color('#ef5777'),
                new THREE.Color('#575fcf')
            ];
            for (let i = 0; i < nebulaCount; i++) {
                nPos[i * 3] = (Math.random() - 0.5) * 800;
                nPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
                nPos[i * 3 + 2] = -Math.random() * 4000;
                const col = nebColors[Math.floor(Math.random() * nebColors.length)];
                nColors[i * 3] = col.r;
                nColors[i * 3 + 1] = col.g;
                nColors[i * 3 + 2] = col.b;
                nSizes[i] = 40 + Math.random() * 120;
            }
            nGeo.setAttribute('position', new THREE.BufferAttribute(nPos, 3));
            nGeo.setAttribute('color', new THREE.BufferAttribute(nColors, 3));
            nGeo.setAttribute('size', new THREE.BufferAttribute(nSizes, 1));
            
            const nCanvas = document.createElement('canvas');
            nCanvas.width = 64;
            nCanvas.height = 64;
            const nCtx = nCanvas.getContext('2d');
            if (nCtx) {
                const grad = nCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
                grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                nCtx.fillStyle = grad;
                nCtx.fillRect(0, 0, 64, 64);
            }
            const nebTex = new THREE.CanvasTexture(nCanvas);
            const nMat = new THREE.PointsMaterial({
                size: 80,
                map: nebTex,
                vertexColors: true,
                transparent: true,
                opacity: 0.25,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const nebCloud = new THREE.Points(nGeo, nMat);
            scene.add(nebCloud);
            nebulaPoints.current = nebCloud;

            // --- QUANTUM SPACE DUST ---
            const dustGeo = new THREE.BufferGeometry();
            const dustCount = 1200;
            const dustPositions = new Float32Array(dustCount * 3);
            const dustSpeeds = new Float32Array(dustCount);
            
            for (let i = 0; i < dustCount; i++) {
                dustPositions[i * 3] = (Math.random() - 0.5) * 600;
                dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 300;
                dustPositions[i * 3 + 2] = -Math.random() * 2000;
                dustSpeeds[i] = 2.0 + Math.random() * 5.0;
            }
            
            dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
            dustGeo.setAttribute('speed', new THREE.BufferAttribute(dustSpeeds, 1));
            
            const dustMat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    shipPos: { value: new THREE.Vector3(0, 0, 0) },
                    magnetActive: { value: 0.0 },
                    color: { value: tipColor }
                },
                vertexShader: `
                    uniform float time;
                    uniform vec3 shipPos;
                    uniform float magnetActive;
                    attribute float speed;
                    varying vec3 vColor;
                    varying float vAlpha;
                    
                    void main() {
                        vec3 pos = position;
                        pos.z = mod(pos.z - time * speed * 12.0, 2000.0) - 1000.0 + shipPos.z;
                        
                        vec3 toShip = shipPos - pos;
                        float dist = length(toShip);
                        if (dist < 350.0 && magnetActive > 0.5) {
                            float strength = (1.0 - (dist / 350.0)) * magnetActive * 30.0;
                            pos += normalize(toShip) * strength;
                        }
                        
                        vAlpha = smoothstep(1000.0, 200.0, abs(pos.z - shipPos.z)) * 0.5;
                        vColor = mix(vec3(0.5, 0.8, 1.0), vec3(1.0, 0.9, 0.5), magnetActive * 0.5);
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = (15.0 / -mvPosition.z) * (1.0 + magnetActive * 1.5);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    varying float vAlpha;
                    void main() {
                        float dist = length(gl_PointCoord - vec2(0.5));
                        if (dist > 0.5) discard;
                        float intensity = 1.0 - (dist * 2.0);
                        gl_FragColor = vec4(vColor, intensity * vAlpha);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const dustPoints = new THREE.Points(dustGeo, dustMat);
            scene.add(dustPoints);
            quantumDustPointsRef.current = dustPoints;

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

        // Reset Modules, Drones & Hangar upgrades on sector 1 restart
        if (level === 1 && gameState === 'playing' && scoreRef.current === 0) {
            scrapCountRef.current = 0;
            activeModulesRef.current = {
                empShock: false,
                nanobots: false,
                magnetizer: false,
                reactorOvercharge: false
            };
            energyWeaponsRef.current = 3;
            energyShieldsRef.current = 3;
            energyEnginesRef.current = 4;
            updateEnergyHUD();
            if (hudScrapTextRef.current) hudScrapTextRef.current.textContent = '0';
            
            // Clear defense drones
            dronesRef.current.forEach(d => sceneRef.current?.remove(d.mesh));
            dronesRef.current = [];
            setOwnedDrones([]);
            
            // Reset hangar
            hangarUpgradesRef.current = { weapons: 0, shields: 0, engines: 0, maxDrones: 1 };
            setHangarWeapons(0);
            setHangarShields(0);
            setHangarEngines(0);
            setHangarMaxDrones(1);
        }

        // Configure Sector Hazard
        if (activeSectorHazardRef.current === 'solar_storm') {
            solarStormActiveRef.current = true;
            solarStormTimerRef.current = 150; // Warning triggers in 2.5s
            addLog("UYARI: BU SEKTÖRDE ANOMALİ GÜNEŞ FIRTINASI AKTİF!");
        }

        setFuelLevel(100);
        setShieldLevel(currentShipClass.maxShield * (activeModulesRef.current.reactorOvercharge ? 0.7 : 1.0));
        setArmorLevel(currentShipClass.maxArmor);
        setBossHealth(40);
        
        shipPos.current = new THREE.Vector3(0, 0, 0);
        shipVel.current = new THREE.Vector3(0, 0, 0);
        shipQuaternion.current = new THREE.Quaternion();
        targetSpeed.current = MIN_SPEED;

        // Reset Solar Storms & Space Hazards
        solarStormActiveRef.current = false;
        solarStormTimerRef.current = 800 + Math.random() * 600; 
        solarStormDurationRef.current = 0;
        solarStormWarningRef.current = 0;
        if (hudSolarStormAlertRef.current) {
            hudSolarStormAlertRef.current.style.display = 'none';
        }
        if (hudDamageVignetteRef.current) {
            hudDamageVignetteRef.current.style.display = 'none';
            hudDamageVignetteRef.current.style.opacity = '0';
        }
        
        // Remove space mines & scrap drops
        spaceMines.current.forEach(m => {
            sceneRef.current?.remove(m.mesh);
            if (m.light) sceneRef.current?.remove(m.light);
        });
        spaceMines.current = [];
        
        scrapDrops.current.forEach(s => sceneRef.current?.remove(s.mesh));
        scrapDrops.current = [];
        
        lensFlares.current.forEach(lf => sceneRef.current?.remove(lf.group));
        lensFlares.current = [];

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
            fMesh.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } });
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
            tMesh.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } });
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
        const numPowerups = 4;
        const stepP = (zEnd - zStart) / numPowerups;
        for (let i = 0; i < numPowerups; i++) {
            const pType = i % 4 === 0 ? 'multi' : (i % 4 === 1 ? 'beam' : (i % 4 === 2 ? 'slowmo' : 'missile'));
            const pGeo = new THREE.BoxGeometry(4, 4, 4);
            const pColor = pType === 'slowmo' ? '#00bfff' : (pType === 'multi' ? '#00d2d3' : (pType === 'beam' ? '#ff4757' : '#ff9f43'));
            const pEmissive = pType === 'slowmo' ? '#00008b' : (pType === 'multi' ? '#008b8b' : (pType === 'beam' ? '#8b0000' : '#8b4f00'));
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
            bossMesh.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } });
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

        // 7. Spawn Destructible Asteroids in the corridor path
        debrisAsteroids.current.forEach(a => scene.remove(a.mesh));
        debrisAsteroids.current = [];
        
        const numAsteroids = 12 + level * 2;
        const stepA = (zEnd - zStart) / numAsteroids;
        for (let i = 0; i < numAsteroids; i++) {
            const size = 6 + Math.random() * 8;
            const aGeo = new THREE.DodecahedronGeometry(size, 1);
            
            const posAttr = aGeo.attributes.position;
            for (let j = 0; j < posAttr.count; j++) {
                const vx = posAttr.getX(j);
                const vy = posAttr.getY(j);
                const vz = posAttr.getZ(j);
                const noise = 1.0 + (Math.random() - 0.5) * 0.25;
                posAttr.setXYZ(j, vx * noise, vy * noise, vz * noise);
            }
            aGeo.computeVertexNormals();
            
            const aMat = new THREE.MeshStandardMaterial({ 
                color: 0x4a4a5a, 
                roughness: 0.9, 
                metalness: 0.1 
            });
            const aMesh = new THREE.Mesh(aGeo, aMat);
            
            const pz = zStart + (i + 0.4) * stepA + (Math.random() - 0.5) * 50;
            const px = (Math.random() - 0.5) * 110;
            const py = (Math.random() - 0.5) * 50;
            
            aMesh.position.set(px, py, pz);
            aMesh.castShadow = true;
            aMesh.receiveShadow = true;
            scene.add(aMesh);
            
            debrisAsteroids.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
                rx: (Math.random() - 0.5) * 0.02,
                ry: (Math.random() - 0.5) * 0.02,
                rz: (Math.random() - 0.5) * 0.02,
                size,
                health: 15 + level * 3,
                active: true,
                mesh: aMesh
            });
        }

        // Spawn Space Mines
        const numMines = 8 + level * 2;
        const stepM = (zEnd - zStart) / numMines;
        for (let i = 0; i < numMines; i++) {
            const mineGroup = new THREE.Group();
            
            // Central core mine geometry - spikey dodecahedron
            const mineGeo = new THREE.DodecahedronGeometry(2.5, 1);
            const posAttr = mineGeo.attributes.position;
            for (let j = 0; j < posAttr.count; j++) {
                if (j % 3 === 0) {
                    posAttr.setXYZ(j, posAttr.getX(j) * 1.5, posAttr.getY(j) * 1.5, posAttr.getZ(j) * 1.5);
                }
            }
            mineGeo.computeVertexNormals();
            
            const mineMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
            const mineMesh = new THREE.Mesh(mineGeo, mineMat);
            mineGroup.add(mineMesh);
            
            // Blinking light sphere
            const lightGeo = new THREE.SphereGeometry(0.8, 8, 8);
            const lightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const lightMesh = new THREE.Mesh(lightGeo, lightMat);
            lightMesh.position.set(0, 0, 0);
            mineGroup.add(lightMesh);
            
            const px = (Math.random() - 0.5) * 130;
            const py = (Math.random() - 0.5) * 60;
            const pz = zStart + i * stepM + (Math.random() - 0.5) * 50;
            
            mineGroup.position.set(px, py, pz);
            mineGroup.traverse(c => { if (c instanceof THREE.Mesh) { c.castShadow = true; c.receiveShadow = true; } });
            scene.add(mineGroup);
            
            const minePointLight = new THREE.PointLight(0xff0000, 0, 25);
            minePointLight.position.copy(mineGroup.position);
            scene.add(minePointLight);
            
            spaceMines.current.push({
                id: Math.random(),
                x: px, y: py, z: pz,
                active: true,
                mesh: mineGroup,
                light: minePointLight,
                beepTimer: 0
            });
        }

        // Initialize enemy counter refs and DOM element
        const total = enemies.current.length;
        totalEnemiesRef.current = total;
        enemiesRemainingRef.current = total;
        if (hudEnemiesRef.current) {
            hudEnemiesRef.current.textContent = `${total} / ${total}`;
        }
    }, [clearAllEntities, level, setFuelLevel, setShieldLevel, setArmorLevel, addLog, currentShipClass, createTurretMesh, createFloaterMesh, createBossMesh, gameState]);

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

    const spawnMissile = useCallback((offsetX: number, offsetY: number) => {
        if (!sceneRef.current || !playerShipGroup.current) return;
        
        const geo = new THREE.CylinderGeometry(0.1, 0.8, 6, 8);
        geo.rotateX(Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({ color: '#ff9f43', transparent: true, opacity: 0.9 });
        const mesh = new THREE.Mesh(geo, mat);
        
        const spawnPos = new THREE.Vector3(offsetX, offsetY, -6);
        spawnPos.applyQuaternion(shipQuaternion.current);
        spawnPos.add(shipPos.current);
        
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
        const speed = 25;
        const vx = forward.x * speed;
        const vy = forward.y * speed;
        const vz = forward.z * speed;
        
        mesh.position.copy(spawnPos);
        mesh.quaternion.copy(shipQuaternion.current);
        sceneRef.current.add(mesh);
        
        createExplosion(spawnPos.x, spawnPos.y, spawnPos.z, '#ff9f43', 3, 0.3);
        
        bullets.current.push({
            id: Math.random(),
            x: spawnPos.x, y: spawnPos.y, z: spawnPos.z,
            vx, vy, vz,
            life: 120,
            isEnemy: false,
            isMissile: true,
            mesh
        });
    }, []);

    const drawTeslaLightning = useCallback((start: THREE.Vector3, end: THREE.Vector3) => {
        const scene = sceneRef.current;
        if (!scene) return null;
        
        const points = [];
        points.push(start);
        
        const segments = 8;
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const step = len / segments;
        dir.normalize();
        
        const perp = new THREE.Vector3(1, 0, 0).cross(dir).normalize();
        if (perp.lengthSq() < 0.01) {
            perp.copy(new THREE.Vector3(0, 1, 0).cross(dir).normalize());
        }
        
        for (let i = 1; i < segments; i++) {
            const pt = start.clone().addScaledVector(dir, step * i);
            const displacementStrength = 4.5 + Math.random() * 6.0;
            const angle = Math.random() * Math.PI * 2;
            const disp = perp.clone()
                .applyAxisAngle(dir, angle)
                .multiplyScalar((Math.random() - 0.5) * displacementStrength);
            
            pt.add(disp);
            points.push(pt);
        }
        points.push(end);
        
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
            color: '#00e5ff',
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        if (lightningLinesRef.current) {
            lightningLinesRef.current.push(line);
        }
        
        createExplosion(end.x, end.y, end.z, '#00e5ff', 4, 0.4);
        return line;
    }, [createExplosion]);

    const fireWeapon = useCallback(() => {
        if (gameState !== 'playing' || fuelRef.current <= 0) return;
        
        const activeLaserColor = weaponTimer.current > 0 
            ? (weaponType.current === 'beam' ? '#ff4757' : (weaponType.current === 'missile' ? '#ff9f43' : '#00d2d3')) 
            : currentShipClass.laserColor;

        const weaponMode = activeWeaponTypeRef.current;
        
        if (weaponMode === 'beam') {
            if (weaponHeatRef.current > 95) {
                soundRef.current?.playWarning();
                addLog("UYARI: SİLAH AŞIRI ISINDI! SOĞUMA BEKLENİYOR.");
                return;
            }
            
            weaponHeatRef.current = Math.min(100, weaponHeatRef.current + 3.2);
            spawnBullet(0, 0, '#ff4757', 2.8, true);
            soundRef.current?.playContinuousBeam();
            screenShakeRef.current = Math.max(screenShakeRef.current, 1.2);
            setFuelLevel(fuelRef.current - 0.09);
            
        } else if (weaponMode === 'tesla') {
            if (!sceneRef.current || !playerShipGroup.current) return;
            
            const nosePos = new THREE.Vector3(0, 0, -6.5);
            nosePos.applyQuaternion(shipQuaternion.current);
            nosePos.add(shipPos.current);
            
            let nearestEnemy: Enemy | null = null;
            let minDist = 350;
            enemies.current.forEach(e => {
                if (e.active) {
                    const eVec = e.mesh.position;
                    const d = nosePos.distanceTo(eVec);
                    if (d < minDist) {
                        minDist = d;
                        nearestEnemy = e;
                    }
                }
            });
            
            if (nearestEnemy) {
                const targetPos = (nearestEnemy as Enemy).mesh.position;
                drawTeslaLightning(nosePos, targetPos);
                
                (nearestEnemy as Enemy).health = Math.max(0, (nearestEnemy as Enemy).health - 0.4);
                if ((nearestEnemy as Enemy).health <= 0) {
                    handleEnemyDefeat(nearestEnemy);
                }
                
                let chainEnemy: Enemy | null = null;
                let minChainDist = 150;
                enemies.current.forEach(e => {
                    if (e.active && e !== nearestEnemy) {
                        const d = targetPos.distanceTo(e.mesh.position);
                        if (d < minChainDist) {
                            minChainDist = d;
                            chainEnemy = e;
                        }
                    }
                });
                
                if (chainEnemy) {
                    drawTeslaLightning(targetPos, (chainEnemy as Enemy).mesh.position);
                    (chainEnemy as Enemy).health = Math.max(0, (chainEnemy as Enemy).health - 0.2);
                    if ((chainEnemy as Enemy).health <= 0) {
                        handleEnemyDefeat(chainEnemy);
                    }
                }
            } else {
                const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
                const spacePoint = nosePos.clone().addScaledVector(forward, 250);
                spacePoint.x += (Math.random() - 0.5) * 80;
                spacePoint.y += (Math.random() - 0.5) * 80;
                
                drawTeslaLightning(nosePos, spacePoint);
            }
            
            soundRef.current?.playTeslaLightning();
            setFuelLevel(fuelRef.current - 0.08);
            
        } else if (weaponMode === 'flak') {
            if (!sceneRef.current || !playerShipGroup.current) return;
            
            if (weaponHeatRef.current > 90) {
                soundRef.current?.playWarning();
                addLog("UYARI: ŞARAPNEL YÜKLEME HAZNESİ DOLUYOR!");
                return;
            }
            weaponHeatRef.current = Math.min(100, weaponHeatRef.current + 20.0);
            
            const spawnPos = new THREE.Vector3(0, 0, -6.5);
            spawnPos.applyQuaternion(shipQuaternion.current);
            spawnPos.add(shipPos.current);
            
            const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(shipQuaternion.current);
            const flakSpeed = 22;
            const bVx = forward.x * flakSpeed;
            const bVy = forward.y * flakSpeed;
            const bVz = forward.z * flakSpeed;
            
            const geo = new THREE.CylinderGeometry(0.9, 0.9, 4, 8);
            geo.rotateX(Math.PI / 2);
            const mat = new THREE.MeshBasicMaterial({ color: '#ff9f43', transparent: true, opacity: 0.9 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(spawnPos);
            mesh.quaternion.copy(shipQuaternion.current);
            sceneRef.current.add(mesh);
            
            createExplosion(spawnPos.x, spawnPos.y, spawnPos.z, '#ff9f43', 5, 0.4);
            
            if (flakShellsRef.current) {
                flakShellsRef.current.push({
                    id: Math.random(),
                    position: spawnPos,
                    vx: bVx, vy: bVy, vz: bVz,
                    life: 45,
                    mesh
                });
            }
            
            soundRef.current?.playShoot();
            setFuelLevel(fuelRef.current - 0.25);
            
        } else {
            const activeWeaponPattern = weaponTimer.current > 0 ? weaponType.current : currentShipClass.weaponPattern;
            if (activeWeaponPattern === 'beam') {
                spawnBullet(0, 0, activeLaserColor, 3.0, true);
                soundRef.current?.playShoot(true);
                screenShakeRef.current = Math.max(screenShakeRef.current, 1.2);
            } else if (activeWeaponPattern === 'multi') {
                spawnBullet(-4, 0, activeLaserColor, 1.0);
                spawnBullet(4, 0, activeLaserColor, 1.0);
                spawnBullet(0, 3, activeLaserColor, 1.0);
                soundRef.current?.playShoot();
            } else if (activeWeaponPattern === 'missile') {
                spawnMissile(-5, -2);
                spawnMissile(5, -2);
                soundRef.current?.playShoot();
                screenShakeRef.current = Math.max(screenShakeRef.current, 2.0);
            } else {
                spawnBullet(-2, 0, activeLaserColor);
                spawnBullet(2, 0, activeLaserColor);
                soundRef.current?.playShoot();
            }
        }
    }, [gameState, spawnBullet, spawnMissile, currentShipClass, drawTeslaLightning, addLog]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const k = e.key.toLowerCase();
            keys.current[k] = true;
            if (k === ' ' || k === 'p') {
                e.preventDefault();
            }
            if (k === 'm') {
                e.preventDefault();
                toggleMarket();
            }
            if (k === '1') {
                activeWeaponTypeRef.current = 'laser';
                setActiveWeaponType('laser');
                addLog("SİLAH: COLAZ PLAZMA AKTİF.");
            }
            if (k === '2') {
                activeWeaponTypeRef.current = 'beam';
                setActiveWeaponType('beam');
                addLog("SİLAH: KONTİNU PLAZMA LAZERİ AKTİF.");
            }
            if (k === '3') {
                activeWeaponTypeRef.current = 'tesla';
                setActiveWeaponType('tesla');
                addLog("SİLAH: TESLA ELEKTRİK AKIMI AKTİF.");
            }
            if (k === '4') {
                activeWeaponTypeRef.current = 'flak';
                setActiveWeaponType('flak');
                addLog("SİLAH: FLAK ŞARAPNEL TOPU AKTİF.");
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [fireWeapon, toggleMarket]);

    const launchBossHomingProbe = useCallback((boss: Enemy) => {
        const scene = sceneRef.current;
        if (!scene) return;
        const colorStr = '#ff3f34';
        const dMesh = createFloaterMesh(colorStr);
        dMesh.scale.set(0.4, 0.4, 0.4);
        const px = boss.x + (Math.random() - 0.5) * 50;
        const py = boss.y + (Math.random() - 0.5) * 50;
        const pz = boss.z + 50;
        dMesh.position.set(px, py, pz);
        scene.add(dMesh);
        enemies.current.push({
            id: Math.random(),
            x: px, y: py, z: pz,
            type: 'floater',
            health: 1,
            maxHealth: 1,
            active: true,
            lastFire: 0,
            fireCooldown: 9999,
            mesh: dMesh,
            targetQuaternion: new THREE.Quaternion()
        });
        addLog("UYARI: BOSS KAMİKAZE DİKENİ FIRLATTI!");
    }, [createFloaterMesh, addLog]);

    const fireBossPattern = useCallback((e: Enemy, phase: number) => {
        const scene = sceneRef.current;
        if (!scene) return;
        const eVec = new THREE.Vector3(e.x, e.y, e.z);
        if (phase === 1) {
            const centerDir = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
            const angles = [-0.15, 0, 0.15];
            angles.forEach(angle => {
                const fireDir = centerDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).normalize();
                const bGeo = new THREE.SphereGeometry(1.5, 8, 8);
                const bMat = new THREE.MeshBasicMaterial({ color: '#8c7ae6', transparent: true, opacity: 0.9 });
                const bMesh = new THREE.Mesh(bGeo, bMat);
                bMesh.position.copy(eVec);
                scene.add(bMesh);
                bullets.current.push({
                    id: Math.random(),
                    x: e.x, y: e.y, z: e.z,
                    vx: fireDir.x * 8, vy: fireDir.y * 8, vz: fireDir.z * 8,
                    life: 140, isEnemy: true, mesh: bMesh
                });
            });
            soundRef.current?.playShoot();
        } else if (phase === 3) {
            const bulletCount = 6;
            const baseAngle = (performance.now() * 0.003) % (Math.PI * 2);
            for (let i = 0; i < bulletCount; i++) {
                const angle = baseAngle + (i / bulletCount) * Math.PI * 2;
                const dirX = Math.cos(angle) * 0.3;
                const dirY = Math.sin(angle) * 0.3;
                const toPlayer = new THREE.Vector3().subVectors(shipPos.current, eVec).normalize();
                const finalVx = toPlayer.x * 6 + dirX * 12;
                const finalVy = toPlayer.y * 6 + dirY * 12;
                const finalVz = toPlayer.z * 8;
                const bGeo = new THREE.SphereGeometry(1.2, 8, 8);
                const bMat = new THREE.MeshBasicMaterial({ color: '#ff4757', transparent: true, opacity: 0.9 });
                const bMesh = new THREE.Mesh(bGeo, bMat);
                bMesh.position.copy(eVec);
                scene.add(bMesh);
                bullets.current.push({
                    id: Math.random(),
                    x: e.x, y: e.y, z: e.z,
                    vx: finalVx, vy: finalVy, vz: finalVz,
                    life: 150, isEnemy: true, mesh: bMesh
                });
            }
            soundRef.current?.playShoot();
            if (Math.random() < 0.20) {
                launchBossHomingProbe(e);
            }
        }
    }, [launchBossHomingProbe]);

    const showBossWarningLine = useCallback((e: Enemy, isHorizontal: boolean, progress: number) => {
        const scene = sceneRef.current;
        if (!scene) return;
        if (e.bossSweepMesh) {
            scene.remove(e.bossSweepMesh);
            e.bossSweepMesh = null;
        }
        const sweepCoord = -60 + progress * 120;
        const p1 = new THREE.Vector3(isHorizontal ? sweepCoord : 0, isHorizontal ? 0 : sweepCoord, e.z);
        const p2 = new THREE.Vector3(isHorizontal ? sweepCoord : 0, isHorizontal ? 0 : sweepCoord, 200);
        if (!e.bossWarningMesh) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
            const lineMat = new THREE.LineBasicMaterial({ color: '#ff4d4d', transparent: true, opacity: 0.9 });
            e.bossWarningMesh = new THREE.Line(lineGeo, lineMat);
            scene.add(e.bossWarningMesh);
        } else {
            const posAttr = e.bossWarningMesh.geometry.attributes.position;
            posAttr.setXYZ(0, p1.x, p1.y, p1.z);
            posAttr.setXYZ(1, p2.x, p2.y, p2.z);
            posAttr.needsUpdate = true;
        }
        const mat = e.bossWarningMesh.material as THREE.LineBasicMaterial;
        mat.opacity = 0.4 + Math.sin(performance.now() * 0.05) * 0.4;
    }, []);

    const fireBossSweepBeam = useCallback((e: Enemy, isHorizontal: boolean, progress: number, dt: number, time: number) => {
        const scene = sceneRef.current;
        if (!scene) return;
        if (e.bossWarningMesh) {
            scene.remove(e.bossWarningMesh);
            e.bossWarningMesh = null;
        }
        const sweepCoord = -60 + progress * 120;
        const beamRadius = 12;
        const beamLength = 2800;
        if (!e.bossSweepMesh) {
            const beamGeo = new THREE.CylinderGeometry(beamRadius, beamRadius, beamLength, 12);
            beamGeo.rotateX(Math.PI / 2);
            const beamMat = new THREE.MeshBasicMaterial({ color: '#ff3838', transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending });
            e.bossSweepMesh = new THREE.Mesh(beamGeo, beamMat);
            scene.add(e.bossSweepMesh);
        }
        const beamZ = (e.z + 100) / 2;
        e.bossSweepMesh.position.set(isHorizontal ? sweepCoord : 0, isHorizontal ? 0 : sweepCoord, beamZ);
        const scale = 0.9 + Math.sin(time * 0.08) * 0.15;
        e.bossSweepMesh.scale.set(scale, scale, 1.0);
        const beamX = isHorizontal ? sweepCoord : 0;
        const beamY = isHorizontal ? 0 : sweepCoord;
        let isHit = false;
        if (isHorizontal) {
            if (Math.abs(shipPos.current.x - beamX) < beamRadius + 6 && shipPos.current.z > e.z) {
                isHit = true;
            }
        } else {
            if (Math.abs(shipPos.current.y - beamY) < beamRadius + 6 && shipPos.current.z > e.z) {
                isHit = true;
            }
        }
        if (isHit) {
            shieldRegenTimer.current = 0;
            damageVignetteRef.current = 1.0;
            screenShakeRef.current = Math.max(screenShakeRef.current, 2.5);
            const dmg = 1.2 * dt;
            if (shieldRef.current > 0) {
                shieldHitLife.current = 1.0;
                setShieldLevel(shieldRef.current - dmg * 0.7);
                setArmorLevel(armorRef.current - dmg * 0.3);
            } else {
                setArmorLevel(armorRef.current - dmg);
            }
            if (Math.random() < 0.08) {
                addLog("UYARI: MEGA LAZER SÜPÜRMESİNDEN HASAR ALINIYOR!");
                soundRef.current?.playExplosion();
            }
        }
    }, [addLog, setShieldLevel, setArmorLevel]);

    const clearBossSweepMeshes = useCallback((e: Enemy) => {
        const scene = sceneRef.current;
        if (!scene) return;
        if (e.bossWarningMesh) {
            scene.remove(e.bossWarningMesh);
            e.bossWarningMesh = null;
        }
        if (e.bossSweepMesh) {
            scene.remove(e.bossSweepMesh);
            e.bossSweepMesh = null;
        }
    }, []);

    const handleEnemyDefeat = useCallback((e: Enemy) => {
        const scene = sceneRef.current;
        if (!scene) return;
        
        e.active = false;
        scene.remove(e.mesh);
        if (e.warningFlare) {
            scene.remove(e.warningFlare);
            e.warningFlare = null;
        }
        if (e.type === 'boss') {
            clearBossSweepMeshes(e);
        }
        hitFlashMap.current.delete(e.id);
        soundRef.current?.playExplosion();
        
        const isBoss = e.type === 'boss';
        const expColor1 = isBoss ? '#ff6b6b' : '#ff9f43';
        const expColor2 = isBoss ? '#8c7ae6' : '#00ffff';
        
        createShockwave(e.x, e.y, e.z, expColor2);
        createExplosion(e.x, e.y, e.z, expColor1, isBoss ? 60 : 20, isBoss ? 4.0 : 1.5);
        createExplosion(e.x, e.y, e.z, '#ffffff', isBoss ? 30 : 8, isBoss ? 2.0 : 0.8);
        createLensFlare(e.x, e.y, e.z, expColor1, isBoss ? 75 : 30);
        
        // Drop scrap drops
        const numScrap = e.type === 'boss' ? 10 + Math.floor(Math.random() * 5) : 2 + Math.floor(Math.random() * 3);
        for (let s = 0; s < numScrap; s++) {
            spawnScrap(e.x, e.y, e.z);
        }
        
        if (isBoss) {
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
        
        const randVal = Math.random();
        if (randVal < 0.15) { 
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
        } else if (randVal > 0.80) { 
            const roll = Math.random();
            const pType = roll < 0.33 ? 'multi' : (roll < 0.66 ? 'beam' : 'missile');
            const pGeo = new THREE.BoxGeometry(5, 5, 5);
            const pColor = pType === 'multi' ? '#00d2d3' : (pType === 'beam' ? '#ff4757' : '#ff9f43');
            const pMat = new THREE.MeshBasicMaterial({ color: pColor, wireframe: true });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            pMesh.position.set(e.x, e.y, e.z);
            scene.add(pMesh);
            powerUps.current.push({
                id: Math.random(), x: e.x, y: e.y, z: e.z,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: (Math.random() - 0.5) * 4,
                type: pType, active: true, mesh: pMesh
            });
        } else { 
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
        
        if (enemies.current.filter(en => en.active).length === 0) {
            setScore(scoreRef.current);
            setGameState('victory');
            soundRef.current?.stopSequencer();
            soundRef.current?.stopAmbient();
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
    }, [clearBossSweepMeshes, createExplosion, createShockwave, createLensFlare, spawnScrap, addLog, setScore, setGameState]);

    // Main 6-DOF Loop
    tickRef.current = (time: number) => {
        if (gameState !== 'playing' && gameState !== 'hyperspace') {
            lastTime.current = time;
            animationFrameId.current = requestAnimationFrame((t) => tickRef.current(t));
            return;
        }

        // v6.0 CLEAN UP LIGHTNING LINES (brief 1-frame electric arcs)
        if (lightningLinesRef.current) {
            lightningLinesRef.current.forEach(l => sceneRef.current?.remove(l));
            lightningLinesRef.current = [];
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

        // --- CRT & Chromatic Aberration Shader pass update ---
        if (crtPassRef.current) {
            crtPassRef.current.uniforms.time.value = time * 0.0015;
            crtPassRef.current.uniforms.aberrationScale.value = damageVignetteRef.current;
        }

        // --- v6.0 BACKGROUND PLANET PARALLAX AND ROTATION ---
        if (planetMeshRef.current && planetMeshRef.current.material instanceof THREE.ShaderMaterial) {
            planetMeshRef.current.material.uniforms.time.value = time * 0.001;
            planetMeshRef.current.rotation.y += 0.00015 * dt;
        }
        if (planetRingsRef.current) {
            planetRingsRef.current.rotation.z -= 0.00008 * dt;
        }
        if (planetGroupRef.current) {
            planetGroupRef.current.position.z = -3200 + shipPos.current.z * 0.15;
            planetGroupRef.current.position.x = -450 + shipPos.current.x * 0.15;
            planetGroupRef.current.position.y = 250 + shipPos.current.y * 0.15;
        }

        // --- v6.0 BLACK HOLE SINGULARITY & GRAVITATIONAL LENSING ---
        const isAnomalyField = activeSectorHazardRef.current === 'anomaly_field';
        if (blackHoleMeshRef.current) {
            blackHoleMeshRef.current.visible = isAnomalyField;
            if (isAnomalyField) {
                if (accretionDiskMeshRef.current) {
                    const speeds = (accretionDiskMeshRef.current as any).speeds;
                    const radii = (accretionDiskMeshRef.current as any).radii;
                    const angles = (accretionDiskMeshRef.current as any).angles;
                    const posAttr = accretionDiskMeshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
                    const count = posAttr.count;
                    for (let i = 0; i < count; i++) {
                        angles[i] += speeds[i] * 0.003 * dt;
                        const r = radii[i];
                        const x = Math.cos(angles[i]) * r;
                        const z = Math.sin(angles[i]) * r;
                        posAttr.setXYZ(i, x, posAttr.getY(i), z);
                    }
                    posAttr.needsUpdate = true;
                }
                
                const bhPos = blackHolePosRef.current;
                const dist = shipPos.current.distanceTo(bhPos);
                if (dist < 320) {
                    const forceDir = new THREE.Vector3().subVectors(bhPos, shipPos.current).normalize();
                    const pullStrength = (350 / (dist + 30)) * dt * 0.65;
                    shipPos.current.addScaledVector(forceDir, pullStrength);
                    
                    if (dist < 32) {
                        setShieldLevel(shieldRef.current - 1.2 * dt);
                        setArmorLevel(armorRef.current - 0.8 * dt);
                        screenShakeRef.current = Math.max(screenShakeRef.current, 3.5);
                        if (Math.random() > 0.96) addLog("TEHLİKE: KARA DELİK OLAY UFUKU! ZIRH ERİYOR!");
                    }
                }

                debrisAsteroids.current.forEach(a => {
                    if (a.active) {
                        const aPos = new THREE.Vector3(a.x, a.y, a.z);
                        const d = aPos.distanceTo(bhPos);
                        if (d < 350) {
                            const force = new THREE.Vector3().subVectors(bhPos, aPos).normalize();
                            const pull = (180 / (d + 20)) * dt;
                            a.vx += force.x * pull * 0.04;
                            a.vy += force.y * pull * 0.04;
                            a.vz += force.z * pull * 0.04;
                            
                            if (d < 35) {
                                a.health = 0;
                                fractureAsteroid(a);
                                createExplosion(a.x, a.y, a.z, '#a855f7', 15, 1.0);
                            }
                        }
                    }
                });

                if (lensingPassRef.current && cameraRef3D.current) {
                    const p2d = bhPos.clone().project(cameraRef3D.current);
                    const inFront = p2d.z < 1.0;
                    lensingPassRef.current.uniforms.uBlackHoleScreen.value.set((p2d.x + 1) / 2, (p2d.y + 1) / 2);
                    lensingPassRef.current.uniforms.uActive.value = inFront ? 1.0 : 0.0;
                }
            } else {
                if (lensingPassRef.current) {
                    lensingPassRef.current.uniforms.uActive.value = 0.0;
                }
            }
        }

        // --- v6.0 SHIELD MULTI-IMPACT RIPPLE DECAY ---
        if (shieldBubbleMesh.current && shieldBubbleMesh.current.material instanceof THREE.ShaderMaterial) {
            const mat = shieldBubbleMesh.current.material;
            const now = time * 0.001;
            mat.uniforms.time.value = now;
            
            shieldHitsRef.current = shieldHitsRef.current.filter(h => now - h.time < 2.0);
            
            const positions = mat.uniforms.uHitPositions.value;
            const times = mat.uniforms.uHitTimes.value;
            const strengths = mat.uniforms.uHitStrengths.value;
            
            for (let i = 0; i < 4; i++) {
                positions[i].set(0, 0, 0);
                times[i] = -9999.0;
                strengths[i] = 0.0;
            }
            
            shieldHitsRef.current.forEach((hit, idx) => {
                if (idx < 4) {
                    positions[idx].copy(hit.position);
                    times[idx] = hit.time;
                    strengths[idx] = hit.strength;
                }
            });
        }

        // --- v6.0 WING TILT MANEUVER ARTICULATION ---
        if (wingLGroupRef.current && wingRGroupRef.current) {
            let targetL = 0;
            let targetR = 0;
            if (keys.current['a']) {
                targetL = -0.32;
                targetR = -0.32;
            } else if (keys.current['d']) {
                targetL = 0.32;
                targetR = 0.32;
            }
            
            wingLGroupRef.current.rotation.z += (targetL - wingLGroupRef.current.rotation.z) * 0.12 * dt;
            wingRGroupRef.current.rotation.z += (targetR - wingRGroupRef.current.rotation.z) * 0.12 * dt;
            
            let targetPitch = 0;
            if (keys.current['w']) targetPitch = -0.15;
            else if (keys.current['s']) targetPitch = 0.15;
            
            wingLGroupRef.current.rotation.x += (targetPitch - wingLGroupRef.current.rotation.x) * 0.12 * dt;
            wingRGroupRef.current.rotation.x += (targetPitch - wingRGroupRef.current.rotation.x) * 0.12 * dt;
        }

        // --- v6.0 WEAPON HEAT DISCHARGE ---
        if (weaponHeatRef.current > 0) {
            weaponHeatRef.current = Math.max(0, weaponHeatRef.current - 15.0 * dt / 60);
        }

        // --- Quantum Space Dust Drift ---
        if (quantumDustPointsRef.current && quantumDustPointsRef.current.material instanceof THREE.ShaderMaterial) {
            const mat = quantumDustPointsRef.current.material;
            mat.uniforms.time.value = time * 0.001;
            mat.uniforms.shipPos.value.copy(shipPos.current);
            mat.uniforms.magnetActive.value = activeModulesRef.current.magnetizer ? 1.0 : 0.0;
        }

        // --- Defense Drones update ---
        updateDefenseDrones(dt);

        // --- Sound Scope instrument drawing ---
        updateOscilloscope();

        // --- Cockpit Instrument Dashboard values updates ---
        if (hudCoreTempTextRef.current) {
            hudCoreTempTextRef.current.textContent = `${Math.round(coreTemperatureRef.current)}°C`;
            if (coreTemperatureRef.current > 85) {
                hudCoreTempTextRef.current.classList.add('text-rose-500', 'animate-pulse');
            } else {
                hudCoreTempTextRef.current.classList.remove('text-rose-500', 'animate-pulse');
            }
        }
        if (hudCoreTempBarRef.current) {
            hudCoreTempBarRef.current.style.width = `${Math.round(coreTemperatureRef.current)}%`;
            if (coreTemperatureRef.current > 85) {
                hudCoreTempBarRef.current.style.backgroundColor = '#f43f5e';
            } else {
                hudCoreTempBarRef.current.style.backgroundColor = '#22d3ee';
            }
        }
        
        // Weapon Heat DOM update
        if (hudWeaponHeatTextRef.current) {
            hudWeaponHeatTextRef.current.textContent = `${Math.round(weaponHeatRef.current)}%`;
            if (weaponHeatRef.current > 75) {
                hudWeaponHeatTextRef.current.classList.add('text-rose-500', 'animate-pulse');
            } else {
                hudWeaponHeatTextRef.current.classList.remove('text-rose-500', 'animate-pulse');
            }
        }
        if (hudWeaponHeatBarRef.current) {
            hudWeaponHeatBarRef.current.style.width = `${Math.round(weaponHeatRef.current)}%`;
            if (weaponHeatRef.current > 75) {
                hudWeaponHeatBarRef.current.style.backgroundColor = '#f43f5e';
            } else {
                hudWeaponHeatBarRef.current.style.backgroundColor = '#f97316';
            }
        }

        // G-Force computation
        const acc = shipVel.current.length();
        const gForce = 1.0 + (acc / 10) + (Math.random() - 0.5) * 0.04;
        if (hudGForceTextRef.current) {
            hudGForceTextRef.current.textContent = `${gForce.toFixed(2)} G`;
        }
        
        // Roll & Pitch angles
        const euler = new THREE.Euler().setFromQuaternion(shipQuaternion.current, 'YXZ');
        const pitchDeg = Math.round(euler.x * (180 / Math.PI));
        const rollDeg = Math.round(euler.z * (180 / Math.PI));
        if (hudRollYawTextRef.current) {
            hudRollYawTextRef.current.textContent = `P: ${pitchDeg}° R: ${rollDeg}°`;
        }

        // Core temperature cooldown
        if (keys.current['p'] || keys.current['P']) {
            coreTemperatureRef.current = Math.min(100, coreTemperatureRef.current + 0.20 * dt);
        } else {
            coreTemperatureRef.current = Math.max(35, coreTemperatureRef.current - 0.35 * dt);
        }

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
        const levelDistance = level % 3 === 0 ? -2200 : -1800;
        const hasReachedEnd = shipPos.current.z <= levelDistance;
        
        const energyEngines = energyEnginesRef.current;
        const engineSpeedFactor = 0.5 + (energyEngines / 10) * 1.0; 
        
        let forwardSpeed = 0;
        if (!hasReachedEnd) {
            const speedMultiplier = fuelRef.current > 0 ? 0.45 : 0.08; 
            forwardSpeed = (currentShipClass.maxSpeed * speedMultiplier * engineSpeedFactor) * dt;
            shipPos.current.z -= forwardSpeed;
            targetSpeed.current = currentShipClass.maxSpeed * speedMultiplier * engineSpeedFactor;
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

        // Auto-fire weapons scale
        const fireInterval = currentShipClass.weaponPattern === 'beam' ? 18 : (currentShipClass.weaponPattern === 'multi' ? 10 : 8);
        const energyWeapons = energyWeaponsRef.current;
        // Weapons energy modifier: 0 -> slow, 10 -> extremely fast
        const weaponsFireRateFactor = 1.6 - (energyWeapons / 10) * 1.1; 
        const adjustedFireInterval = fireInterval * weaponsFireRateFactor;
        
        if (keys.current['p'] || keys.current[' ']) {
            autoFireTimer.current += dt;
            if (autoFireTimer.current >= adjustedFireInterval) {
                autoFireTimer.current = 0;
                fireWeapon();
            }
        } else {
            autoFireTimer.current = adjustedFireInterval;
        }

        // Fuel consumption: slowly decrease fuel, faster if boosting/firing
        let fuelDepletion = 0.04 * dt; 
        if (keys.current['p'] || keys.current[' ']) {
            fuelDepletion = 0.09 * dt; 
        }
        setFuelLevel(fuelRef.current - fuelDepletion);

        // Shield slow regen
        shieldRegenTimer.current += dt;
        const energyShields = energyShieldsRef.current;
        // Shields energy multiplier: 0 -> 0x regen, 10 -> 2.5x regen
        const shieldRegenMultiplier = (energyShields / 10) * 2.5;
        const maxShieldCapacity = currentShipClass.maxShield * (activeModulesRef.current.reactorOvercharge ? 0.7 : 1.0);
        if (shieldRegenTimer.current > 300 && shieldRef.current < maxShieldCapacity) {
            setShieldLevel(shieldRef.current + 0.08 * dt * shieldRegenMultiplier);
        }
        
        // Nanobots module slow zırh yenileme
        if (activeModulesRef.current.nanobots && shieldRegenTimer.current > 300 && armorRef.current < currentShipClass.maxArmor) {
            setArmorLevel(armorRef.current + 0.05 * dt);
        }

        // Steer left/right (A/D) and up/down (W/S)
        const steerSpeedMultiplier = 0.4 + (energyEngines / 10) * 1.4;
        const steerSpeed = 2.8 * playerDt * steerSpeedMultiplier;
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

        // Thruster visual (Exhaust Plume Shaders)
        const thrustScale = hasReachedEnd ? 0.3 : 1.2;
        const currentThrust = thrustScale * (0.5 + (energyEnginesRef.current / 10) * 1.5);
        if (thrusterFlameMeshL.current && thrusterFlameMeshL.current.material instanceof THREE.ShaderMaterial) {
            const mat = thrusterFlameMeshL.current.material;
            mat.uniforms.time.value = time * 0.001;
            mat.uniforms.thrust.value = currentThrust;
            thrusterFlameMeshL.current.scale.set(1.0 + energyEnginesRef.current * 0.05, currentThrust, 1.0 + energyEnginesRef.current * 0.05);
        }
        if (thrusterFlameMeshR.current && thrusterFlameMeshR.current.material instanceof THREE.ShaderMaterial) {
            const mat = thrusterFlameMeshR.current.material;
            mat.uniforms.time.value = time * 0.001;
            mat.uniforms.thrust.value = currentThrust;
            thrusterFlameMeshR.current.scale.set(1.0 + energyEnginesRef.current * 0.05, currentThrust, 1.0 + energyEnginesRef.current * 0.05);
        }

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

        // Shield Ripple Shader animation
        if (shieldBubbleMesh.current) {
            const mat = shieldBubbleMesh.current.material;
            if (mat instanceof THREE.ShaderMaterial) {
                mat.uniforms.time.value = time * 0.001;
            }
            if (shieldHitLife.current > 0) {
                shieldHitLife.current -= 0.08 * dt;
                shieldBubbleMesh.current.visible = true;
                const bubbleScale = 1.0 + (1.0 - shieldHitLife.current) * 0.04;
                shieldBubbleMesh.current.scale.set(bubbleScale, bubbleScale, bubbleScale);
            } else {
                if (shieldRef.current > 0) {
                    shieldBubbleMesh.current.visible = true;
                    shieldBubbleMesh.current.scale.set(1.0, 1.0, 1.0);
                } else {
                    shieldBubbleMesh.current.visible = false;
                }
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
            
            if (b.isMissile && !b.isEnemy) {
                let targetEnemy: Enemy | null = null;
                let minDist = 1500;
                
                for (let i = 0; i < enemies.current.length; i++) {
                    const e = enemies.current[i];
                    if (!e.active) continue;
                    if (e.z > b.z) continue;
                    const dist = new THREE.Vector3(e.x, e.y, e.z).distanceTo(new THREE.Vector3(b.x, b.y, b.z));
                    if (dist < minDist) {
                        minDist = dist;
                        targetEnemy = e;
                    }
                }
                
                if (targetEnemy) {
                    const targetDir = new THREE.Vector3(targetEnemy.x - b.x, targetEnemy.y - b.y, targetEnemy.z - b.z).normalize();
                    const currentVel = new THREE.Vector3(b.vx, b.vy, b.vz);
                    const currentSpeed = currentVel.length();
                    const currentDir = currentVel.normalize();
                    
                    const newDir = new THREE.Vector3().lerpVectors(currentDir, targetDir, 0.08 * dt).normalize();
                    b.vx = newDir.x * currentSpeed;
                    b.vy = newDir.y * currentSpeed;
                    b.vz = newDir.z * currentSpeed;
                    
                    const mx = new THREE.Matrix4().lookAt(new THREE.Vector3(0,0,0), newDir, new THREE.Vector3(0,1,0));
                    b.mesh.quaternion.setFromRotationMatrix(mx);
                }
                
                if (Math.random() < 0.4) {
                    const tGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                    const tMat = new THREE.MeshBasicMaterial({ color: '#ff9f43', transparent: true, opacity: 0.6 });
                    const tMesh = new THREE.Mesh(tGeo, tMat);
                    tMesh.position.set(b.x, b.y, b.z);
                    scene.add(tMesh);
                    particles.current.push({
                        x: b.x, y: b.y, z: b.z,
                        vx: -b.vx * 0.1, vy: -b.vy * 0.1, vz: -b.vz * 0.1,
                        life: 15, color: '#ff9f43', size: 0.3, mesh: tMesh
                    });
                }
            }

            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.z += b.vz * dt;
            b.life -= dt;
            b.mesh.position.set(b.x, b.y, b.z);
        });
        bullets.current.filter(b => b.life <= 0).forEach(b => scene.remove(b.mesh));
        bullets.current = bullets.current.filter(b => b.life > 0);

        // --- 3.5 FLAK SHELLS ---
        if (flakShellsRef.current) {
            flakShellsRef.current.forEach(fs => {
                if (fs.life <= 0) return;
                
                // Update position
                fs.position.x += fs.vx * dt;
                fs.position.y += fs.vy * dt;
                fs.position.z += fs.vz * dt;
                fs.life -= dt;
                fs.mesh.position.copy(fs.position);
                
                // Check if near any active enemy
                let nearEnemy = false;
                for (let i = 0; i < enemies.current.length; i++) {
                    const e = enemies.current[i];
                    if (!e.active) continue;
                    
                    const dist = fs.position.distanceTo(e.mesh.position);
                    const detonateRadius = e.type === 'boss' ? 70 : 35;
                    if (dist < detonateRadius) {
                        nearEnemy = true;
                        break;
                    }
                }
                
                // Detonate if lifetime expired or near an enemy
                if (fs.life <= 0 || nearEnemy) {
                    fs.life = 0; // mark for removal
                    
                    // Detonation effects
                    soundRef.current?.playFlakExplosion();
                    createExplosion(fs.position.x, fs.position.y, fs.position.z, '#ff9f43', 25, 2.0);
                    createShockwave(fs.position.x, fs.position.y, fs.position.z, '#ff5500');
                    createLensFlare(fs.position.x, fs.position.y, fs.position.z, '#ff9f43', 45);
                    
                    // Radial splash damage to all active enemies
                    enemies.current.forEach(e => {
                        if (!e.active) return;
                        
                        const dist = new THREE.Vector3(e.x, e.y, e.z).distanceTo(fs.position);
                        const splashRadius = 140; // radial splash radius
                        if (dist < splashRadius) {
                            const isOvercharge = activeModulesRef.current.reactorOvercharge;
                            const dmgMultiplier = (0.5 + (energyWeaponsRef.current / 10) * 1.5) * (isOvercharge ? 1.5 : 1.0);
                            
                            // Linear damage falloff
                            const falloff = 1.0 - (dist / splashRadius);
                            const splashDmg = 35 * falloff * dmgMultiplier;
                            e.health -= splashDmg;
                            
                            // Hit flash effect
                            const currentFlash = hitFlashMap.current.get(e.id) || 0;
                            hitFlashMap.current.set(e.id, Math.max(currentFlash, 1.0));
                            
                            if (e.type === 'boss') {
                                setBossHealth(Math.max(0, e.health));
                                const ratio = e.health / e.maxHealth;
                                if (ratio < 0.35 && bossPhase.current < 3) {
                                    bossPhase.current = 3;
                                    addLog("BOSS SİSTEM AŞAMASI 3: KRİTİK SEVİYE! SÜREKLİ YÜKSEK ATEŞ GÜCÜ!");
                                    e.fireCooldown = 45; 
                                } else if (ratio < 0.7 && bossPhase.current < 2) {
                                    bossPhase.current = 2;
                                    addLog("BOSS SİSTEM AŞAMASI 2: ZIRH KIRILDI! HIZLI ATEŞ MODU AKTİF!");
                                    e.fireCooldown = 80; 
                                }
                            }
                            
                            if (e.health <= 0) {
                                handleEnemyDefeat(e);
                            }
                        }
                    });

                    // Radial splash damage to debris asteroids
                    debrisAsteroids.current.forEach(a => {
                        if (!a.active) return;
                        
                        const dist = new THREE.Vector3(a.x, a.y, a.z).distanceTo(fs.position);
                        const splashRadius = 140;
                        if (dist < splashRadius) {
                            const isOvercharge = activeModulesRef.current.reactorOvercharge;
                            const dmgMultiplier = (0.5 + (energyWeaponsRef.current / 10) * 1.5) * (isOvercharge ? 1.5 : 1.0);
                            
                            const falloff = 1.0 - (dist / splashRadius);
                            const splashDmg = 45 * falloff * dmgMultiplier;
                            a.health -= splashDmg;
                            
                            if (a.health <= 0) {
                                a.active = false;
                                scene.remove(a.mesh);
                                fractureAsteroid(a);
                                soundRef.current?.playExplosion();
                                createExplosion(a.x, a.y, a.z, '#a5b1c2', 20, 1.8);
                                createShockwave(a.x, a.y, a.z, '#778ca3');
                                createLensFlare(a.x, a.y, a.z, '#ffffff', 25);
                                
                                const numScrap = 1 + Math.floor(Math.random() * 2);
                                for (let s = 0; s < numScrap; s++) {
                                    spawnScrap(a.x, a.y, a.z);
                                }
                                
                                scoreRef.current += 150 * comboMultiplier.current;
                                if (hudScoreRef.current) {
                                    hudScoreRef.current.textContent = scoreRef.current.toString();
                                }
                                addLog("ASTEROİD FLAŞ PATLAMASIYLA PARÇALANDI!");
                            }
                        }
                    });
                    
                    // Trigger shrapnel bullets flying in radial directions
                    const shrapnelCount = 10;
                    const shrapnelGeo = new THREE.SphereGeometry(0.4, 4, 4);
                    const shrapnelMat = new THREE.MeshBasicMaterial({ color: '#ffcc80', transparent: true, opacity: 0.85 });
                    
                    for (let i = 0; i < shrapnelCount; i++) {
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos((Math.random() * 2) - 1);
                        const dir = new THREE.Vector3(
                            Math.sin(phi) * Math.cos(theta),
                            Math.sin(phi) * Math.sin(theta),
                            Math.cos(phi)
                        ).normalize();
                        
                        const speed = 12 + Math.random() * 8;
                        const vx = dir.x * speed;
                        const vy = dir.y * speed;
                        const vz = dir.z * speed;
                        
                        const mesh = new THREE.Mesh(shrapnelGeo, shrapnelMat);
                        mesh.position.copy(fs.position);
                        scene.add(mesh);
                        
                        bullets.current.push({
                            id: Math.random(),
                            x: fs.position.x, y: fs.position.y, z: fs.position.z,
                            vx, vy, vz,
                            life: 35 + Math.random() * 15,
                            isEnemy: false,
                            mesh
                        });
                    }
                }
            });
            
            // Clean up detonated shells from scene
            flakShellsRef.current.filter(fs => fs.life <= 0).forEach(fs => scene.remove(fs.mesh));
            flakShellsRef.current = flakShellsRef.current.filter(fs => fs.life > 0);
        }

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
                // Wave bobbing
                const bobTime = (time * 0.001) + e.id * 100;

                // Boids flocking forces
                const cohesion = new THREE.Vector3(0, 0, 0);
                const separation = new THREE.Vector3(0, 0, 0);
                const alignment = new THREE.Vector3(0, 0, 0);
                let swarmCount = 0;
                
                enemies.current.forEach(other => {
                    if (other.active && other.id !== e.id && other.type === 'floater') {
                        const otherVec = new THREE.Vector3(other.x, other.y, other.z);
                        const d = eVec.distanceTo(otherVec);
                        if (d < 120) {
                            cohesion.add(otherVec);
                            
                            if (d < 35) {
                                const diff = new THREE.Vector3().subVectors(eVec, otherVec).normalize().divideScalar(d);
                                separation.add(diff);
                            }
                            
                            const otherForward = new THREE.Vector3(0, 0, -1).applyQuaternion(other.mesh.quaternion);
                            alignment.add(otherForward);
                            
                            swarmCount++;
                        }
                    }
                });
                
                const force = new THREE.Vector3(0, 0, 0);
                if (swarmCount > 0) {
                    cohesion.divideScalar(swarmCount).sub(eVec).normalize().multiplyScalar(0.15);
                    separation.normalize().multiplyScalar(0.45);
                    alignment.divideScalar(swarmCount).normalize().multiplyScalar(0.1);
                    
                    force.add(cohesion).add(separation).add(alignment);
                }
                
                // Avoidance: push away from nearby asteroids
                debrisAsteroids.current.forEach(a => {
                    if (a.active) {
                        const aPos = new THREE.Vector3(a.x, a.y, a.z);
                        const distToAsteroid = eVec.distanceTo(aPos);
                        if (distToAsteroid < a.size + 45) {
                            const avoid = new THREE.Vector3().subVectors(eVec, aPos).normalize().multiplyScalar((a.size + 45 - distToAsteroid) * 0.12);
                            force.add(avoid);
                        }
                    }
                });

                // Seek: drift towards player flanking offset target ahead of the ship
                const targetPos = shipPos.current.clone();
                const indexOffset = Math.sin(e.id) * 70;
                targetPos.x += Math.cos(bobTime) * 45 + indexOffset;
                targetPos.y += Math.sin(bobTime) * 25 + Math.cos(e.id) * 20;
                targetPos.z -= 180 + Math.sin(bobTime * 0.4) * 80;
                
                const seek = new THREE.Vector3().subVectors(targetPos, eVec).normalize().multiplyScalar(0.32);
                force.add(seek);
                
                // Update floater velocities inside the enemy object
                e.targetQuaternion = e.targetQuaternion || new THREE.Quaternion();
                
                e.x += force.x * dt * 2.0;
                e.y += force.y * dt * 2.0;
                e.z += (force.z * dt * 1.5) + (Math.sign(targetPos.z - e.z) * 0.15 * dt); // slow matching forward Z
                
                // Rotate floater to look at player
                const targetRotationMatrix = new THREE.Matrix4().lookAt(eVec, shipPos.current, new THREE.Vector3(0, 1, 0));
                const targetQuat = new THREE.Quaternion().setFromRotationMatrix(targetRotationMatrix);
                e.mesh.quaternion.slerp(targetQuat, 0.06 * dt);

                // Add small engine trails occasionally (subtle)
                if (Math.random() < 0.1) {
                    const tGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                    const tMat = new THREE.MeshBasicMaterial({ color: '#ff3f34', transparent: true, opacity: 0.2 });
                    const tMesh = new THREE.Mesh(tGeo, tMat);
                    tMesh.position.copy(eVec);
                    scene.add(tMesh);
                    particles.current.push({
                        x: e.x, y: e.y, z: e.z,
                        vx: 0, vy: 0, vz: 2.0,
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
                e.z += dir.z * 0.05 * dt;

                if (e.bossRing1) e.bossRing1.rotation.y += 0.02 * dt;
                if (e.bossRing2) e.bossRing2.rotation.x -= 0.03 * dt;
                e.mesh.rotation.z += 0.005 * dt;

                const bossRatio = e.health / e.maxHealth;
                let currentPhase = 1;
                if (bossRatio <= 0.35) {
                    currentPhase = 3;
                } else if (bossRatio <= 0.70) {
                    currentPhase = 2;
                }

                if (currentPhase === 1) {
                    e.lastFire += dt;
                    if (e.lastFire > e.fireCooldown && e.z < shipPos.current.z && distToPlayer < 1200) {
                        e.lastFire = 0;
                        fireBossPattern(e, 1);
                    }
                } else if (currentPhase === 2) {
                    e.lastFire += dt;
                    const sweepChargeTime = 60;
                    const sweepDuration = 90;
                    const cyclePeriod = 240;
                    
                    const timeInCycle = e.lastFire % cyclePeriod;
                    const activeStart = cyclePeriod - sweepChargeTime - sweepDuration;
                    
                    if (timeInCycle > activeStart) {
                        const elapsed = timeInCycle - activeStart;
                        const isHorizontal = Math.floor(time / 8000) % 2 === 0;
                        if (elapsed < sweepChargeTime) {
                            showBossWarningLine(e, isHorizontal, elapsed / sweepChargeTime);
                        } else {
                            fireBossSweepBeam(e, isHorizontal, (elapsed - sweepChargeTime) / sweepDuration, dt, time);
                        }
                    } else {
                        clearBossSweepMeshes(e);
                    }
                } else if (currentPhase === 3) {
                    clearBossSweepMeshes(e);
                    e.lastFire += dt;
                    if (e.lastFire > 55) {
                        e.lastFire = 0;
                        fireBossPattern(e, 3);
                    }
                }
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
                if (distToPlayer < 35 && distToPlayer > 12) {
                    proximityDangerRef.current = Math.max(proximityDangerRef.current, (35 - distToPlayer) / 35);
                }
                if (distToPlayer < 12) {
                    b.life = 0;
                    screenShakeRef.current = 3.5;
                    soundRef.current?.playExplosion();
                    createExplosion(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#fbc531', 20, 1.5);
                    createShockwave(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#ff3f34');
                    createLensFlare(shipPos.current.x, shipPos.current.y, shipPos.current.z, '#fbc531', 25);
                    
                    comboMultiplier.current = 1;
                    shieldRegenTimer.current = 0; 
                    damageVignetteRef.current = 1.0; 
                    
                    const dmg = 20;
                    const relativeHitDir = bVec.clone().sub(shipPos.current).normalize().multiplyScalar(7);
                    if (shieldRef.current > 0) {
                        shieldHitLife.current = 1.0;
                        setShieldLevel(shieldRef.current - dmg * 0.7, relativeHitDir);
                        setArmorLevel(armorRef.current - dmg * 0.3);
                        addLog(`KALKAN HASARI! Kalkan: %${Math.round(shieldRef.current)}`);
                    } else {
                        setArmorLevel(armorRef.current - dmg);
                        addLog(`KRİTİK HASAR! Zırh: %${Math.round(armorRef.current)}`);
                    }
                }
            } else {
                debrisAsteroids.current.forEach(a => {
                    if (!a.active) return;
                    const dist = bVec.distanceTo(new THREE.Vector3(a.x, a.y, a.z));
                    if (dist < a.size + 2) {
                        b.life = 0;
                        const isOvercharge = activeModulesRef.current.reactorOvercharge;
                        const dmgMultiplier = (0.5 + (energyWeaponsRef.current / 10) * 1.5) * (isOvercharge ? 1.5 : 1.0);
                        a.health -= (b.isBeam ? 25 : 8) * dmgMultiplier;
                        createExplosion(bVec.x, bVec.y, bVec.z, '#ffffff', 4, 0.4);
                        
                        if (a.health <= 0) {
                            a.active = false;
                            scene.remove(a.mesh);
                            fractureAsteroid(a);
                            soundRef.current?.playExplosion();
                            createExplosion(a.x, a.y, a.z, '#a5b1c2', 20, 1.8);
                            createShockwave(a.x, a.y, a.z, '#778ca3');
                            createLensFlare(a.x, a.y, a.z, '#ffffff', 25);
                            
                            // Drop metal scrap drops
                            const numScrap = 1 + Math.floor(Math.random() * 2);
                            for (let s = 0; s < numScrap; s++) {
                                spawnScrap(a.x, a.y, a.z);
                            }
                            
                            const fragmentCount = 5 + Math.floor(Math.random() * 4);
                            for (let f = 0; f < fragmentCount; f++) {
                                const fragGeo = new THREE.BoxGeometry(2, 2, 2);
                                const fragMat = new THREE.MeshStandardMaterial({ color: 0x4a4a5a, roughness: 0.9 });
                                const fragMesh = new THREE.Mesh(fragGeo, fragMat);
                                fragMesh.position.set(a.x, a.y, a.z);
                                scene.add(fragMesh);
                                
                                particles.current.push({
                                    x: a.x, y: a.y, z: a.z,
                                    vx: (Math.random() - 0.5) * 8,
                                    vy: (Math.random() - 0.5) * 8,
                                    vz: (Math.random() - 0.5) * 8,
                                    life: 40,
                                    color: '#778ca3',
                                    size: 2,
                                    mesh: fragMesh
                                });
                            }
                            scoreRef.current += 150 * comboMultiplier.current;
                            if (hudScoreRef.current) {
                                hudScoreRef.current.textContent = scoreRef.current.toString();
                            }
                            addLog("ASTEROİD PARÇALANDI! +150 SKOR");
                        }
                    }
                });

                enemies.current.forEach(e => {
                    if (!e.active) return;
                    const eVec = new THREE.Vector3(e.x, e.y, e.z);
                    const radius = e.type === 'boss' ? 40 : 12;
                    
                    if (bVec.distanceTo(eVec) < radius) {
                        if (!b.isBeam) b.life = 0;
                        const isOvercharge = activeModulesRef.current.reactorOvercharge;
                        const dmgMultiplier = (0.5 + (energyWeaponsRef.current / 10) * 1.5) * (isOvercharge ? 1.5 : 1.0);
                        const dmgAmt = (b.isBeam ? 2 : 1) * dmgMultiplier;
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
                                e.fireCooldown = 45; 
                            } else if (ratio < 0.7 && bossPhase.current < 2) {
                                bossPhase.current = 2;
                                addLog("BOSS SİSTEM AŞAMASI 2: ZIRH KIRILDI! HIZLI ATEŞ MODU AKTİF!");
                                e.fireCooldown = 80; 
                            }
                        }
                        
                        createExplosion(bVec.x, bVec.y, bVec.z, '#ffffff', 4, 0.4);

                        if (e.health <= 0) {
                            handleEnemyDefeat(e);
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

        // --- 9. DEBRIS ASTEROIDS ---
        debrisAsteroids.current.forEach(a => {
            if (!a.active) return;
            
            a.x += a.vx * dt;
            a.y += a.vy * dt;
            a.z += a.vz * dt;
            
            a.mesh.position.set(a.x, a.y, a.z);
            a.mesh.rotation.x += a.rx * dt;
            a.mesh.rotation.y += a.ry * dt;
            a.mesh.rotation.z += a.rz * dt;
            
            const aVec = new THREE.Vector3(a.x, a.y, a.z);
            const distToPlayer = aVec.distanceTo(shipPos.current);
            if (distToPlayer < a.size + 10) {
                a.active = false;
                scene.remove(a.mesh);
                
                screenShakeRef.current = 6.0;
                soundRef.current?.playExplosion();
                createExplosion(a.x, a.y, a.z, '#ff4757', 30, 2.5);
                createShockwave(a.x, a.y, a.z, '#ff4a11');
                
                comboMultiplier.current = 1;
                shieldRegenTimer.current = 0;
                damageVignetteRef.current = 1.0;
                
                const dmg = 35;
                if (shieldRef.current > 0) {
                    shieldHitLife.current = 1.0;
                    setShieldLevel(shieldRef.current - dmg * 0.7);
                    setArmorLevel(armorRef.current - dmg * 0.3);
                    addLog("ASTEROİD ÇARPIŞMASI! KALKAN HASARI!");
                } else {
                    setArmorLevel(armorRef.current - dmg);
                    addLog("ASTEROİD ÇARPIŞMASI! AĞIR ZIRH HASARI!");
                }
            }
        });
        debrisAsteroids.current = debrisAsteroids.current.filter(a => a.active);

        // --- 10. NEBULA DRIFT ---
        if (nebulaPoints.current) {
            nebulaPoints.current.rotation.z += 0.0003 * dt;
        }

        // --- 11. LENS FLARES UPDATES ---
        lensFlares.current.forEach(lf => {
            lf.life -= 0.03 * dt;
            const currentScale = lf.initialScale * lf.life;
            lf.group.scale.set(currentScale, currentScale, currentScale);
            lf.group.children.forEach(child => {
                if (child instanceof THREE.Sprite) {
                    child.material.opacity = lf.life;
                }
            });
        });
        lensFlares.current.filter(lf => lf.life <= 0).forEach(lf => scene.remove(lf.group));
        lensFlares.current = lensFlares.current.filter(lf => lf.life > 0);

        // --- 12. SPACE MINES LOOP ---
        spaceMines.current.forEach(m => {
            if (!m.active) return;
            m.mesh.rotation.x += 0.015 * dt;
            m.mesh.rotation.y += 0.02 * dt;
            
            const mVec = new THREE.Vector3(m.x, m.y, m.z);
            const dist = mVec.distanceTo(shipPos.current);
            
            const blinkFreq = dist < 120 ? (dist < 50 ? 6 : 16) : 36;
            const isBlinkOn = Math.floor(time / blinkFreq) % 2 === 0;
            const lightColor = isBlinkOn ? 0xff0000 : 0x000000;
            
            if (m.light instanceof THREE.PointLight) {
                m.light.intensity = isBlinkOn ? 1.5 : 0.0;
            }
            const lightMesh = m.mesh.children[1];
            if (lightMesh instanceof THREE.Mesh && lightMesh.material instanceof THREE.MeshBasicMaterial) {
                lightMesh.material.color.setHex(lightColor);
            }
            
            if (dist < 150) {
                m.beepTimer += dt;
                const beepRate = dist < 70 ? (dist < 35 ? 10 : 25) : 55;
                if (m.beepTimer >= beepRate) {
                    m.beepTimer = 0;
                    soundRef.current?.playMineWarning();
                }
            }
            
            if (dist < 20) {
                m.active = false;
                scene.remove(m.mesh);
                if (m.light) scene.remove(m.light);
                
                soundRef.current?.playExplosion();
                createExplosion(m.x, m.y, m.z, '#ff3300', 45, 2.5);
                createExplosion(m.x, m.y, m.z, '#ffcc00', 20, 1.2);
                createShockwave(m.x, m.y, m.z, '#ff5500');
                createLensFlare(m.x, m.y, m.z, '#ff3300', 60);
                
                screenShakeRef.current = Math.max(screenShakeRef.current, 7.0);
                damageVignetteRef.current = 1.0;
                shieldRegenTimer.current = 0;
                
                const dmg = 45;
                if (shieldRef.current > 0) {
                    shieldHitLife.current = 1.0;
                    setShieldLevel(shieldRef.current - dmg * 0.7, new THREE.Vector3(0, 0, -5));
                    setArmorLevel(armorRef.current - dmg * 0.3);
                    addLog("MAYIN PATLADI! KALKAN HASARI!");
                } else {
                    setArmorLevel(armorRef.current - dmg);
                    addLog("MAYIN PATLADI! KRİTİK ZIRH HASARI!");
                }
            }
        });
        spaceMines.current = spaceMines.current.filter(m => m.active);

        // --- 13. SOLAR STORM SYSTEM ---
        if (!solarStormActiveRef.current) {
            solarStormTimerRef.current -= dt;
            if (solarStormTimerRef.current <= 180) {
                solarStormWarningRef.current = 180;
                solarStormActiveRef.current = true;
                addLog("TEHLİKE: GÜNEŞ FIRTINASI RÜZGARI YAKLAŞIYOR!");
            }
        } else {
            if (solarStormWarningRef.current > 0) {
                solarStormWarningRef.current -= dt;
                if (hudSolarStormAlertRef.current) {
                    hudSolarStormAlertRef.current.style.display = 'block';
                    hudSolarStormAlertRef.current.style.opacity = (Math.sin(time * 0.02) * 0.3 + 0.7).toString();
                    hudSolarStormAlertRef.current.textContent = `UYARI: GÜNEŞ FIRTINASI ATLAYIŞI - ${Math.ceil(solarStormWarningRef.current / 60)}s`;
                }
                if (solarStormWarningRef.current <= 0) {
                    solarStormDurationRef.current = 360; 
                    addLog("GÜNEŞ FIRTINASI ETKİN! ZIRH SÜPÜRÜLÜYOR!");
                    soundRef.current?.playWarning();
                    screenShakeRef.current = Math.max(screenShakeRef.current, 3.5);
                }
            } else if (solarStormDurationRef.current > 0) {
                solarStormDurationRef.current -= dt;
                if (hudSolarStormAlertRef.current) {
                    hudSolarStormAlertRef.current.style.display = 'block';
                    hudSolarStormAlertRef.current.style.opacity = '0.9';
                    hudSolarStormAlertRef.current.textContent = `FIRTIÑA ETKİN: DEVRİM HASARI!`;
                }
                if (hudDamageVignetteRef.current) {
                    hudDamageVignetteRef.current.style.display = 'block';
                    hudDamageVignetteRef.current.style.opacity = '0.5';
                    hudDamageVignetteRef.current.style.background = 'radial-gradient(circle, rgba(249,115,22,0) 30%, rgba(249,115,22,0.65) 100%)';
                }
                
                if (Math.random() < 0.4) {
                    const pGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
                    const pMat = new THREE.MeshBasicMaterial({ color: '#f97316', transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
                    for (let i = 0; i < 4; i++) {
                        const px = shipPos.current.x + (Math.random() - 0.5) * 200;
                        const py = shipPos.current.y + (Math.random() - 0.5) * 120;
                        const pz = shipPos.current.z - 250 - Math.random() * 200;
                        const mesh = new THREE.Mesh(pGeo, pMat);
                        mesh.position.set(px, py, pz);
                        scene.add(mesh);
                        particles.current.push({
                            x: px, y: py, z: pz,
                            vx: (Math.random() - 0.5) * 3,
                            vy: (Math.random() - 0.5) * 3,
                            vz: 28 + Math.random() * 12,
                            life: 25,
                            color: '#f97316',
                            size: 1.2,
                            mesh
                        });
                    }
                }
                
                let isPlayerProtected = false;
                let nearestAsteroidName = "";
                for (let i = 0; i < debrisAsteroids.current.length; i++) {
                    const a = debrisAsteroids.current[i];
                    if (!a.active) continue;
                    if (a.z < shipPos.current.z && a.z > shipPos.current.z - 120) {
                        const dx = Math.abs(shipPos.current.x - a.x);
                        const dy = Math.abs(shipPos.current.y - a.y);
                        if (dx < a.size * 1.5 && dy < a.size * 1.5) {
                            isPlayerProtected = true;
                            nearestAsteroidName = `Asteroid-${Math.round(a.id * 100)}`;
                            break;
                        }
                    }
                }
                
                if (isPlayerProtected) {
                    if (Math.random() < 0.05) {
                        addLog(`GÜVENLİ: ${nearestAsteroidName} Arkasında Korunuyorsunuz.`);
                    }
                } else {
                    const stormDmg = 0.18 * dt;
                    shieldRegenTimer.current = 0;
                    if (shieldRef.current > 0) {
                        shieldHitLife.current = 1.0;
                        setShieldLevel(shieldRef.current - stormDmg * 0.7, new THREE.Vector3(0, 0, -5));
                        setArmorLevel(armorRef.current - stormDmg * 0.3);
                    } else {
                        setArmorLevel(armorRef.current - stormDmg);
                    }
                    if (Math.random() < 0.05) {
                        addLog("TEHLİKE: RADYASYON HASARI ALINIYOR! ASTEROİD ARKASINA KORUNUN!");
                        soundRef.current?.playWarning();
                        screenShakeRef.current = Math.max(screenShakeRef.current, 1.0);
                    }
                }
                
                if (solarStormDurationRef.current <= 0) {
                    solarStormActiveRef.current = false;
                    solarStormTimerRef.current = 1500 + Math.random() * 800; 
                    addLog("GÜNEŞ FIRTINASI GEÇTİ. SİSTEMLER YENİDEN DENGELENDİ.");
                    if (hudSolarStormAlertRef.current) hudSolarStormAlertRef.current.style.display = 'none';
                    if (hudDamageVignetteRef.current) {
                        hudDamageVignetteRef.current.style.display = 'none';
                        hudDamageVignetteRef.current.style.opacity = '0';
                    }
                }
            }
        }

        // --- 14. SCRAP DROPS LOOP ---
        scrapDrops.current.forEach(item => {
            if (!item.active) return;
            item.vx *= 0.95; item.vy *= 0.95; item.vz *= 0.95;
            item.x += item.vx * dt; item.y += item.vy * dt; item.z += item.vz * dt;
            item.mesh.position.set(item.x, item.y, item.z);
            item.mesh.rotation.x += 0.05 * dt;
            item.mesh.rotation.y += 0.03 * dt;
            
            const dVec = new THREE.Vector3(item.x, item.y, item.z);
            const dist = dVec.distanceTo(shipPos.current);
            const magnetRadius = activeModulesRef.current.magnetizer ? 350 : 100;
            if (dist < magnetRadius) {
                const dir = new THREE.Vector3().subVectors(shipPos.current, dVec).normalize();
                const pullForce = activeModulesRef.current.magnetizer ? 4.5 : 2.0;
                item.vx += dir.x * pullForce * dt;
                item.vy += dir.y * pullForce * dt;
                item.vz += dir.z * pullForce * dt;
            }
            
            if (dist < 18) {
                item.active = false;
                scene.remove(item.mesh);
                soundRef.current?.playCollect();
                scrapCountRef.current += 1;
                if (hudScrapTextRef.current) {
                    hudScrapTextRef.current.textContent = scrapCountRef.current.toString();
                }
                createExplosion(item.x, item.y, item.z, '#ffd700', 5, 0.4);
            }
        });
        scrapDrops.current = scrapDrops.current.filter(item => item.active);

        // --- 15. ASTEROID-TO-ASTEROID COLLISION PHYSICS ---
        const asterList = debrisAsteroids.current;
        for (let i = 0; i < asterList.length; i++) {
            const a = asterList[i];
            if (!a.active) continue;
            for (let j = i + 1; j < asterList.length; j++) {
                const b = asterList[j];
                if (!b.active) continue;
                
                const posA = new THREE.Vector3(a.x, a.y, a.z);
                const posB = new THREE.Vector3(b.x, b.y, b.z);
                const dist = posA.distanceTo(posB);
                const minDist = a.size + b.size;
                
                if (dist < minDist) {
                    const normal = new THREE.Vector3().subVectors(posB, posA).normalize();
                    const velA = new THREE.Vector3(a.vx, a.vy, a.vz);
                    const velB = new THREE.Vector3(b.vx, b.vy, b.vz);
                    const relVel = new THREE.Vector3().subVectors(velA, velB);
                    const velAlongNormal = relVel.dot(normal);
                    
                    if (velAlongNormal < 0) {
                        const restitution = 0.75;
                        const impulseScalar = -(1 + restitution) * velAlongNormal / 2;
                        const impulse = normal.clone().multiplyScalar(impulseScalar);
                        a.vx += impulse.x; a.vy += impulse.y; a.vz += impulse.z;
                        b.vx -= impulse.x; b.vy -= impulse.y; b.vz -= impulse.z;
                        
                        const overlap = minDist - dist;
                        const separation = normal.clone().multiplyScalar(overlap * 0.51);
                        a.x -= separation.x; a.y -= separation.y; a.z -= separation.z;
                        b.x += separation.x; b.y += separation.y; b.z += separation.z;
                        
                        if (Math.random() < 0.3) {
                            const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
                            createExplosion(midPoint.x, midPoint.y, midPoint.z, '#a5b1c2', 8, 0.5);
                            const dmg = Math.abs(velAlongNormal) * 4;
                            a.health -= dmg;
                            b.health -= dmg;
                            
                            if (a.health <= 0 && a.active) {
                                a.active = false;
                                scene.remove(a.mesh);
                                fractureAsteroid(a);
                            }
                            if (b.health <= 0 && b.active) {
                                b.active = false;
                                scene.remove(b.mesh);
                                fractureAsteroid(b);
                            }
                        }
                    }
                }
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
        generateGalaxyMap(level);
        setGameState('galaxymap');
    };

    if (webglError) {
        return (
            <div className="w-full max-w-[1400px] mx-auto p-8 flex flex-col items-center justify-center min-h-[600px] bg-[#030109] text-center border border-rose-500/30 rounded-xl font-sans text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500 via-transparent to-transparent"></div>
                <h2 className="text-3xl font-black text-rose-500 mb-4 tracking-tighter drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">SİMÜLASYON BAŞLATILAMIYOR</h2>
                <p className="text-cyan-100/70 max-w-md mb-8 leading-relaxed font-light">{webglError}</p>
                <div className="p-4 border border-white/10 rounded-xl bg-white/5 text-xs text-cyan-200/50 max-w-lg leading-relaxed">
                    Sisteminiz veya tarayıcınız WebGL / Donanım İvmesini desteklemiyor olabilir. Lütfen tarayıcı ayarlarından <b>"Kullanılabilir olduğunda donanım ivmesini kullan"</b> seçeneğini etkinleştirin.
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
                        <span className="text-[10px] text-yellow-500/70 uppercase font-black tracking-[0.2em] mb-1"><ShoppingBag className="inline w-3 h-3 mr-1" />Hurda</span>
                        <span className="text-2xl font-black text-yellow-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"><span ref={hudScrapTextRef}>0</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zap-500/70 uppercase font-black tracking-[0.2em] mb-1"><Zap className="inline w-3 h-3 mr-1" />Skor</span>
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
                    <Button size="icon" variant="ghost" className={`h-10 w-10 bg-black/40 hover:bg-white/10 text-muted-foreground rounded-full border border-white/5 transition-all ${marketOpen ? 'ring-2 ring-yellow-400 text-yellow-400' : ''}`} onClick={toggleMarket} title="Holografik Market [M]">
                        <ShoppingBag className={`w-5 h-5 ${marketOpen ? 'text-yellow-400' : 'text-cyan-400'}`} />
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

                {/* Solar Storm Alert */}
                <div 
                    ref={hudSolarStormAlertRef}
                    className="absolute top-36 left-1/2 transform -translate-x-1/2 p-4 rounded-xl border border-orange-500/50 bg-orange-950/80 backdrop-blur-md text-center pointer-events-none z-20 shadow-[0_0_35px_rgba(249,115,22,0.5)] transition-all duration-300 animate-pulse"
                    style={{
                        display: 'none',
                        opacity: 0
                    }}
                >
                    <div className="flex flex-col items-center gap-1.5">
                        <AlertTriangle className="w-6 h-6 text-orange-400 animate-bounce" />
                        <div className="text-orange-400 text-sm font-black tracking-[0.25em] uppercase">
                            UYARI: RADYASYON FIRTINASI
                        </div>
                        <div className="text-xs text-orange-200/70 font-light">
                            Hasar almamak için derhal bir astreoid arkasına saklanın!
                        </div>
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
                            <Activity className="w-3.5 h-3.5" /> Sistem Kayıtları (v4.0)
                        </div>
                        {logMessages.map((log, idx) => (
                            <div key={idx} className={`transition-all duration-300 ${idx === 0 ? 'text-emerald-300 font-bold scale-100 opacity-100' : 'text-emerald-500/70 scale-95 origin-left opacity-70'}`}>
                                {log}
                            </div>
                        ))}
                    </div>
                )}

                {/* Energy Allocation Panel */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="absolute bottom-6 left-[25rem] p-4 rounded-xl border border-cyan-500/20 bg-black/75 backdrop-blur-md max-w-xs w-full text-xs text-cyan-400 font-sans pointer-events-auto z-10 flex flex-col gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] select-none hidden md:flex">
                        <div className="text-[10px] text-cyan-400/80 border-b border-cyan-500/20 pb-1 mb-1 font-black uppercase tracking-widest flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5" /> REAKTÖR ENERJİ DAĞILIMI (10 TOPLAM)
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between font-mono text-[10px] font-bold">
                                <span>SİLAH SİSTEMLERİ</span>
                                <span className="text-cyan-300"><span ref={hudWeaponsValRef}>3</span> / 10</span>
                            </div>
                            <input 
                                ref={hudWeaponsSliderRef}
                                type="range" 
                                min="0" 
                                max="10" 
                                defaultValue="3"
                                className="w-full accent-cyan-400 h-1.5 bg-black rounded-lg cursor-pointer appearance-none"
                                onChange={(e) => setEnergyAllocation('weapons', parseInt(e.target.value))}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between font-mono text-[10px] font-bold">
                                <span>KALKAN HÜCRELERİ</span>
                                <span className="text-cyan-300"><span ref={hudShieldsValRef}>3</span> / 10</span>
                            </div>
                            <input 
                                ref={hudShieldsSliderRef}
                                type="range" 
                                min="0" 
                                max="10" 
                                defaultValue="3"
                                className="w-full accent-cyan-400 h-1.5 bg-black rounded-lg cursor-pointer appearance-none"
                                onChange={(e) => setEnergyAllocation('shields', parseInt(e.target.value))}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between font-mono text-[10px] font-bold">
                                <span>İTİCİ MOTORLAR</span>
                                <span className="text-cyan-300"><span ref={hudEnginesValRef}>4</span> / 10</span>
                            </div>
                            <input 
                                ref={hudEnginesSliderRef}
                                type="range" 
                                min="0" 
                                max="10" 
                                defaultValue="4"
                                className="w-full accent-cyan-400 h-1.5 bg-black rounded-lg cursor-pointer appearance-none"
                                onChange={(e) => setEnergyAllocation('engines', parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                )}

                {/* Cockpit Instrument Dashboard Panel */}
                {(gameState === 'playing' || gameState === 'paused') && (
                    <div className="absolute bottom-6 left-[46rem] p-4 rounded-xl border border-cyan-500/20 bg-black/75 backdrop-blur-md max-w-xs w-full text-xs text-cyan-400 font-sans pointer-events-none z-10 flex flex-col gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] select-none hidden lg:flex">
                        <div className="text-[10px] text-cyan-400/80 border-b border-cyan-500/20 pb-1 mb-1 font-black uppercase tracking-widest flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5" /> KOKPİT TELEMETRİ GÖSTERGELERİ
                        </div>
                        
                        {/* canvas oscilloscope */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-mono font-bold tracking-widest text-cyan-500">REAKTÖR DALGA ANALİZİ</span>
                            <canvas ref={oscilloscopeCanvasRef} width={250} height={45} className="w-full h-11 bg-black/50 rounded border border-cyan-950/60" />
                        </div>
                        
                        {/* Core temperature and G-force */}
                        <div className="grid grid-cols-2 gap-3 mt-1 font-mono text-[9px] font-bold">
                            <div className="flex flex-col gap-1 bg-black/40 p-2 rounded border border-cyan-950/30">
                                <span className="text-[7px] text-cyan-500/60">GÖVDE SICAKLIĞI</span>
                                <span ref={hudCoreTempTextRef} className="text-sm font-black tracking-tighter text-cyan-300">40°C</span>
                                <div className="w-full h-1 bg-cyan-950/50 rounded overflow-hidden mt-1">
                                    <div ref={hudCoreTempBarRef} className="h-full bg-cyan-400 transition-all duration-150" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 bg-black/40 p-2 rounded border border-cyan-950/30">
                                <span className="text-[7px] text-cyan-500/60">G-KUVVETİ İVMESİ</span>
                                <span ref={hudGForceTextRef} className="text-sm font-black tracking-tighter text-amber-400">1.00 G</span>
                                <span ref={hudRollYawTextRef} className="text-[8px] text-cyan-500/40 mt-1">P: 0° R: 0°</span>
                            </div>
                        </div>

                        {/* Weapon systems and Heat bar */}
                        <div className="grid grid-cols-2 gap-3 mt-1 font-mono text-[9px] font-bold">
                            <div className="flex flex-col gap-1 bg-black/40 p-2 rounded border border-cyan-950/30">
                                <span className="text-[7px] text-cyan-500/60">AKTİF SİLAH [1-4]</span>
                                <span className="text-[11px] font-black uppercase tracking-tighter text-cyan-300">
                                    {activeWeaponType === 'laser' && 'COLAZ PLAZMA'}
                                    {activeWeaponType === 'beam' && 'KONTİNU BEAM'}
                                    {activeWeaponType === 'tesla' && 'TESLA YILDIRIM'}
                                    {activeWeaponType === 'flak' && 'FLAK ŞARAPNEL'}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-1 bg-black/40 p-2 rounded border border-cyan-950/30">
                                <span className="text-[7px] text-cyan-500/60">SİLAH SICAKLIĞI</span>
                                <span ref={hudWeaponHeatTextRef} className="text-sm font-black tracking-tighter text-orange-400">0%</span>
                                <div className="w-full h-1 bg-cyan-950/50 rounded overflow-hidden mt-1">
                                    <div ref={hudWeaponHeatBarRef} className="h-full bg-orange-500 transition-all duration-150" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Holographic Market Overlay */}
                {marketOpen && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-30 pointer-events-auto cursor-default p-6 select-none animate-in fade-in zoom-in duration-200">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent"></div>
                        
                        <div className="max-w-4xl w-full flex flex-col gap-6 bg-gradient-to-b from-[#0e0e18] to-black border border-yellow-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-40"></div>
                            
                            <button 
                                onClick={toggleMarket}
                                className="absolute top-4 right-4 text-cyan-400/60 hover:text-cyan-400 font-mono text-sm tracking-widest hover:scale-105 transition-all p-2 rounded-lg border border-white/5 bg-white/5"
                            >
                                [ X ] KAPAT
                            </button>
                            
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-black text-yellow-400 tracking-tighter flex items-center gap-3 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                                        <ShoppingBag className="w-8 h-8 animate-pulse text-yellow-400" /> HOLOGRAFİK MODÜL MARKETİ
                                    </h2>
                                    <p className="text-[11px] text-cyan-100/50 uppercase tracking-widest font-bold mt-1">Sektör arası taktik takviye ünitesi</p>
                                </div>
                                <div className="flex items-center gap-3 bg-yellow-950/30 border border-yellow-500/20 px-5 py-3 rounded-2xl">
                                    <span className="text-[10px] text-yellow-500/80 font-black tracking-widest uppercase">MEVCUT HURDA:</span>
                                    <span className="text-3xl font-black text-yellow-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] text-center">
                                        {scrapCountRef.current}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${activeModulesRef.current.empShock ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'bg-black/40 border-white/5 hover:border-yellow-500/30'}`}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-wider text-purple-400">EMP Şok Koruması</span>
                                            <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">20 Hurda</span>
                                        </div>
                                        <p className="text-[11px] text-cyan-100/50 leading-relaxed font-light">
                                            Kalkanınız tamamen çöktüğünde (sıfıra ulaştığında) otomatik olarak tetiklenerek 280 metre yarıçapındaki tüm düşman mermilerini anında siler.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {activeModulesRef.current.empShock ? (
                                            <div className="w-full text-center text-xs text-purple-400 font-black uppercase tracking-widest py-2 bg-purple-500/10 rounded-xl border border-purple-500/30">ETKİN / SATIN ALINDI</div>
                                        ) : (
                                            <Button 
                                                onClick={() => buyModule('empShock')}
                                                disabled={scrapCountRef.current < 20}
                                                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black text-xs uppercase tracking-widest py-2 rounded-xl transition-all"
                                            >
                                                SATIN AL
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${activeModulesRef.current.nanobots ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-black/40 border-white/5 hover:border-yellow-500/30'}`}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Nanobot Bakım Kiti</span>
                                            <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">25 Hurda</span>
                                        </div>
                                        <p className="text-[11px] text-cyan-100/50 leading-relaxed font-light">
                                            Savaş dışındayken (5 saniye hasar alınmadığında) geminizin zırhını saniyede 3 zırh puanı hızında yavaşça tamir eder.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {activeModulesRef.current.nanobots ? (
                                            <div className="w-full text-center text-xs text-emerald-400 font-black uppercase tracking-widest py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">ETKİN / SATIN ALINDI</div>
                                        ) : (
                                            <Button 
                                                onClick={() => buyModule('nanobots')}
                                                disabled={scrapCountRef.current < 25}
                                                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black text-xs uppercase tracking-widest py-2 rounded-xl transition-all"
                                            >
                                                SATIN AL
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${activeModulesRef.current.magnetizer ? 'bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]' : 'bg-black/40 border-white/5 hover:border-yellow-500/30'}`}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-wider text-cyan-400">Mıknatıs Alanı</span>
                                            <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">15 Hurda</span>
                                        </div>
                                        <p className="text-[11px] text-cyan-100/50 leading-relaxed font-light">
                                            Kristal, hurda ve güçlendiricileri çekme menzilini 3 katından fazlaya (350 metreye) çıkartır ve çekim hızını artırır.
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {activeModulesRef.current.magnetizer ? (
                                            <div className="w-full text-center text-xs text-cyan-400 font-black uppercase tracking-widest py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">ETKİN / SATIN ALINDI</div>
                                        ) : (
                                            <Button 
                                                onClick={() => buyModule('magnetizer')}
                                                disabled={scrapCountRef.current < 15}
                                                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black text-xs uppercase tracking-widest py-2 rounded-xl transition-all"
                                            >
                                                SATIN AL
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${activeModulesRef.current.reactorOvercharge ? 'bg-orange-950/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.25)]' : 'bg-black/40 border-white/5 hover:border-yellow-500/30'}`}>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black uppercase tracking-wider text-orange-400">Aşırı Yükleme Reaktörü</span>
                                            <span className="text-xs font-mono text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded">30 Hurda</span>
                                        </div>
                                        <p className="text-[11px] text-cyan-100/50 leading-relaxed font-light">
                                            Kalkan azami kapasitesini %30 düşürür, fakat silahlarınızın hasarını %50 artırır (hem asteroidler hem düşmanlar üzerinde etkilidir).
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        {activeModulesRef.current.reactorOvercharge ? (
                                            <div className="w-full text-center text-xs text-orange-400 font-black uppercase tracking-widest py-2 bg-orange-500/10 rounded-xl border border-orange-500/30">ETKİN / SATIN ALINDI</div>
                                        ) : (
                                            <Button 
                                                onClick={() => buyModule('reactorOvercharge')}
                                                disabled={scrapCountRef.current < 30}
                                                className="w-full bg-yellow-500 text-black hover:bg-yellow-400 font-black text-xs uppercase tracking-widest py-2 rounded-xl transition-all"
                                            >
                                                SATIN AL
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-center border-t border-white/5 pt-4">
                                <Button 
                                    onClick={toggleMarket} 
                                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-12 py-5 rounded-xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(234,179,8,0.3)]"
                                >
                                    MARKETİ KAPAT VE SEKTÖRE GİR
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Galaxy Navigator Map & Hangar Overlay */}
                {gameState === 'galaxymap' && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-30 pointer-events-auto cursor-default p-6 select-none animate-in fade-in duration-300">
                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950 via-transparent to-transparent"></div>
                        
                        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-[#0b0b14] to-black border border-cyan-500/20 p-8 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-35"></div>
                            
                            {/* Title banner */}
                            <div className="lg:col-span-12 flex justify-between items-center border-b border-white/5 pb-4 mb-2">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tighter flex items-center gap-3 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)] font-mono">
                                        SEKTÖR GEÇİŞ TERMİNALİ
                                    </h2>
                                    <p className="text-[10px] text-cyan-100/50 uppercase tracking-widest font-bold mt-1">Gemi bakımı ve seyrüsefer yönlendirmesi</p>
                                </div>
                                <div className="flex items-center gap-3 bg-cyan-950/20 border border-cyan-500/20 px-5 py-3 rounded-2xl">
                                    <span className="text-[10px] text-cyan-400/80 font-black tracking-widest uppercase">MEVCUT HURDA:</span>
                                    <span className="text-3xl font-black text-yellow-400 font-mono tracking-tighter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                                        {scrapCountRef.current}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Left Column: Hangar Upgrades */}
                            <div className="lg:col-span-5 flex flex-col gap-4 bg-black/45 p-5 rounded-2xl border border-white/5">
                                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase pb-2 border-b border-white/5 flex items-center gap-2 font-mono">
                                    <Cpu className="w-4 h-4" /> QUANTUM HANGAR Geliştirmeleri
                                </h3>
                                
                                <div className="flex flex-col gap-3">
                                    {/* Upgrade System stats */}
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-white font-bold">Aşırı Yüklenmiş Lazerler</span>
                                            <span className="text-[9px] text-cyan-400/60 font-mono">Silah Hasarı ve Hızı +%20 / Seviye</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-cyan-300">SEV {hangarWeapons}</span>
                                            <Button 
                                                onClick={() => upgradeHangarSystem('weapons')}
                                                disabled={hangarWeapons >= 3 || scrapCountRef.current < (hangarWeapons + 1) * 15}
                                                size="sm"
                                                className="bg-cyan-500 text-black hover:bg-cyan-400 text-[9px] font-black py-1 px-2.5 rounded-lg"
                                            >
                                                {hangarWeapons >= 3 ? 'MAX' : `${(hangarWeapons + 1) * 15} H`}
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-white font-bold">Kalkan Güçlendirici</span>
                                            <span className="text-[9px] text-cyan-400/60 font-mono">Azami Kalkan Kapasitesi +25</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-cyan-300">SEV {hangarShields}</span>
                                            <Button 
                                                onClick={() => upgradeHangarSystem('shields')}
                                                disabled={hangarShields >= 3 || scrapCountRef.current < (hangarShields + 1) * 15}
                                                size="sm"
                                                className="bg-cyan-500 text-black hover:bg-cyan-400 text-[9px] font-black py-1 px-2.5 rounded-lg"
                                            >
                                                {hangarShields >= 3 ? 'MAX' : `${(hangarShields + 1) * 15} H`}
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-white font-bold">İtici Ayarı</span>
                                            <span className="text-[9px] text-cyan-400/60 font-mono">Manevra ve Azami Hız Katsayısı</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-cyan-300">SEV {hangarEngines}</span>
                                            <Button 
                                                onClick={() => upgradeHangarSystem('engines')}
                                                disabled={hangarEngines >= 3 || scrapCountRef.current < (hangarEngines + 1) * 15}
                                                size="sm"
                                                className="bg-cyan-500 text-black hover:bg-cyan-400 text-[9px] font-black py-1 px-2.5 rounded-lg"
                                            >
                                                {hangarEngines >= 3 ? 'MAX' : `${(hangarEngines + 1) * 15} H`}
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-white font-bold">Dron Yuvası</span>
                                            <span className="text-[9px] text-cyan-400/60 font-mono">Maksimum Savunma Dronu Sınırı</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold text-cyan-300">MAX {hangarMaxDrones}</span>
                                            <Button 
                                                onClick={() => upgradeHangarSystem('maxDrones')}
                                                disabled={hangarMaxDrones >= 3 || scrapCountRef.current < (hangarMaxDrones + 1) * 15}
                                                size="sm"
                                                className="bg-cyan-500 text-black hover:bg-cyan-400 text-[9px] font-black py-1 px-2.5 rounded-lg"
                                            >
                                                {hangarMaxDrones >= 3 ? 'MAX' : `${(hangarMaxDrones + 1) * 15} H`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                
                                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase pb-2 border-b border-white/5 mt-2 font-mono">
                                    SAVUNMA DRONLARI ({ownedDrones.length} / {hangarMaxDrones})
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                                    <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-white/5 bg-white/5">
                                        <span className="font-bold text-orange-400">Lazer Dronu</span>
                                        <span className="text-[8px] text-zinc-500">20 Hurda</span>
                                        <Button 
                                            onClick={() => buyHangarDrone('laser')}
                                            disabled={ownedDrones.length >= hangarMaxDrones || scrapCountRef.current < 20}
                                            className="w-full bg-cyan-500 text-black hover:bg-cyan-400 text-[8px] font-bold py-1 px-1.5 rounded-md"
                                        >
                                            AKTİF ET
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-white/5 bg-white/5">
                                        <span className="font-bold text-blue-400">Kalkan Dronu</span>
                                        <span className="text-[8px] text-zinc-500">25 Hurda</span>
                                        <Button 
                                            onClick={() => buyHangarDrone('shield')}
                                            disabled={ownedDrones.length >= hangarMaxDrones || scrapCountRef.current < 25}
                                            className="w-full bg-cyan-500 text-black hover:bg-cyan-400 text-[8px] font-bold py-1 px-1.5 rounded-md"
                                        >
                                            AKTİF ET
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-white/5 bg-white/5">
                                        <span className="font-bold text-red-400">Füze Dronu</span>
                                        <span className="text-[8px] text-zinc-500">30 Hurda</span>
                                        <Button 
                                            onClick={() => buyHangarDrone('missile')}
                                            disabled={ownedDrones.length >= hangarMaxDrones || scrapCountRef.current < 30}
                                            className="w-full bg-cyan-500 text-black hover:bg-cyan-400 text-[8px] font-bold py-1 px-1.5 rounded-md"
                                        >
                                            AKTİF ET
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column: Galaxy Navigation Map */}
                            <div className="lg:col-span-7 flex flex-col gap-4 bg-black/45 p-5 rounded-2xl border border-white/5 min-h-[350px] justify-between">
                                <h3 className="text-xs font-bold text-cyan-400 tracking-widest uppercase pb-2 border-b border-white/5 flex items-center gap-2 font-mono">
                                    <ArrowUpRight className="w-4 h-4" /> KARTOGRAFİK SEYRÜSEFER HARİTASI
                                </h3>
                                
                                {/* map visualizer area */}
                                <div className="relative w-full h-[220px] bg-black/50 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,100,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(18,100,128,0.08)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                                    
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                        {/* Draw connecting paths */}
                                        {galaxyNodesRef.current.map((n) => {
                                            return n.adjacent.map((adjId) => {
                                                const target = galaxyNodesRef.current.find(o => o.id === adjId);
                                                if (!target) return null;
                                                return (
                                                    <line 
                                                        key={`${n.id}-${adjId}`}
                                                        x1={`${n.x}%`} 
                                                        y1={`${n.y}%`} 
                                                        x2={`${target.x}%`} 
                                                        y2={`${target.y}%`} 
                                                        stroke="#0ea5e9" 
                                                        strokeWidth="1.5" 
                                                        strokeDasharray="4 4" 
                                                        opacity="0.45"
                                                    />
                                                );
                                            });
                                        })}
                                    </svg>
                                    
                                    {/* Draw nodes */}
                                    {galaxyNodesRef.current.map((node) => {
                                        const isSelected = selectedMapNodeId === node.id;
                                        const isStart = node.id === 'node_start';
                                        
                                        return (
                                            <button
                                                key={node.id}
                                                disabled={isStart || node.completed}
                                                onClick={() => {
                                                    setSelectedMapNodeId(node.id);
                                                }}
                                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border transition-all duration-300 z-10 flex flex-col items-center group cursor-pointer focus:outline-none ${
                                                    isStart 
                                                        ? 'bg-zinc-800 border-zinc-700 cursor-default scale-95 opacity-60' 
                                                        : (node.completed 
                                                            ? 'bg-emerald-950/40 border-emerald-500/50 cursor-default scale-90' 
                                                            : (isSelected 
                                                                ? 'bg-cyan-950/80 border-cyan-400 scale-125 shadow-[0_0_15px_#06b6d4]' 
                                                                : 'bg-black/80 border-cyan-800/40 hover:border-cyan-500 hover:scale-110'))
                                                }`}
                                            >
                                                <div className={`w-2.5 h-2.5 rounded-full ${isStart ? 'bg-zinc-500' : (node.completed ? 'bg-emerald-400' : (node.type === 'boss' ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'))}`} />
                                                <span className="absolute top-7 bg-black/90 px-1.5 py-0.5 rounded border border-white/5 text-[8px] font-bold text-white whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {node.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Selected node details */}
                                {(() => {
                                    const node = galaxyNodesRef.current.find(n => n.id === selectedMapNodeId);
                                    if (!node) return <div className="text-center text-zinc-500 text-[10px]">Seyrüsefer için haritadan bir hedef seçin.</div>;
                                    return (
                                        <div className="bg-[#10101f]/80 p-4 rounded-xl border border-cyan-800/20 flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center border-b border-white/5 pb-1">
                                                <span className="font-bold text-cyan-400 uppercase tracking-widest text-[11px] flex items-center gap-1.5 font-mono">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> {node.name}
                                                </span>
                                                <span className="font-mono text-[9px] text-zinc-400 font-semibold bg-white/5 px-2 py-0.5 rounded uppercase">Tehlike Derecesi: {node.threat} / 5</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-300 font-light leading-relaxed">{node.description}</p>
                                            {node.hazard !== 'none' && (
                                                <div className="text-[9px] text-orange-400 font-bold bg-orange-950/20 border border-orange-500/20 rounded px-2 py-1 flex items-center gap-1.5">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> KRİTİK SEKTÖR TEHLİKESİ: {node.hazard.replace('_', ' ').toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                                
                                {/* Jump Action Button */}
                                <div className="flex justify-center mt-2 border-t border-white/5 pt-4">
                                    <Button 
                                        onClick={() => {
                                            const node = galaxyNodesRef.current.find(n => n.id === selectedMapNodeId);
                                            if (node) jumpToSector(node);
                                        }}
                                        disabled={!selectedMapNodeId}
                                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-12 py-5 rounded-xl transition-all hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.3)] text-xs uppercase tracking-widest font-mono"
                                    >
                                        HİPER UZAY ATLAYIŞINI BAŞLAT
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlays */}
                {gameState === 'idle' && (
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-30 pointer-events-auto cursor-default p-4 select-none animate-in fade-in duration-300">
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent"></div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-cyan-300 to-emerald-400 mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] text-center select-none">
                            GRAVITY WARRIOR <br/> <span className="text-rose-500 text-3xl md:text-4xl">v4.0: UNREAL ASCENSION</span>
                        </h1>
                        <p className="text-cyan-100/60 max-w-xl text-center mb-6 text-xs md:text-sm font-light leading-relaxed px-4 select-none">
                            Hiper gerçekçi shader ve efekte sahip uzay simülasyonu. Reaktör enerjini dağıt, hurda topla, modüller satın al, mayın alanlarından ve güneş fırtınalarından sağ kurtul!
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
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3 max-w-3xl w-full px-4 text-center select-none">
                            {[{key:'W', desc:'Yukarı'},{key:'S', desc:'Aşağı'},{key:'A', desc:'Sol'},{key:'D', desc:'Sağ'},{key:'P', desc:'Ateş / Hız'},{key:'M', desc:'Market'}].map(({key,desc}) => (
                                <div key={key} className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-lg border border-cyan-500/40 bg-cyan-950/40 flex items-center justify-center text-cyan-300 font-black text-base shadow-[0_0_10px_rgba(34,211,238,0.2)] backdrop-blur-sm">{key}</div>
                                    <span className="text-[10px] text-cyan-100/50 font-mono uppercase tracking-wider">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'hyperspace' && (
                    <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center z-30 pointer-events-none animate-pulse">
                        <h2 className="text-5xl font-black text-white tracking-[0.5em] drop-shadow-[0_0_20px_#00ffff]">HİPER UZAY ATLAYIŞI</h2>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-rose-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-30 animate-in fade-in duration-300">
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
                    <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-30 animate-in fade-in duration-300">
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
                    <p className="text-xs text-muted-foreground leading-relaxed">Geminiz otomatik olarak ileriye doğru uçar. Klavye kontrolleri laptop ve trackpadlerde en rahat oynanışı sunar. 'M' tuşu marketi açar.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-emerald-900/50 shadow-lg hover:border-emerald-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Activity className="w-4 h-4" /> Reaktör Ayarı</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Kokpit altındaki reaktör panelinden 10 enerjiyi dağıtın. Silah atış hızını, kalkan yenilemesini veya motor manevra kabiliyetini optimize edin.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-rose-900/50 shadow-lg hover:border-rose-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Crosshair className="w-4 h-4" /> Modüller & Market</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Asteroidlerden ve düşmanlardan düşen altın hurda parçalarını toplayın. Marketten EMP, Nanobot zırh tamiri veya mıknatıs alanları satın alın.</p>
                </div>
                <div className="bg-[#0a0a1a] p-5 rounded-xl border border-amber-900/50 shadow-lg hover:border-amber-500/50 transition-colors">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> Uzay Tehlikeleri</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">Güneş Fırtınası sırasında radyoaktif dalgalardan kaçınmak için bir asteroid arkasına saklanın. Kırmızı yanıp sönen uzay mayınlarından uzak durun.</p>
                </div>
            </div>
        </div>
    );
}
