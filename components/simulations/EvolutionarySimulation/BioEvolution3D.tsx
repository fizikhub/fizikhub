"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Genome } from './GenomeV3';
import { Creature3D } from './Creature3D';
import { ViewTransitionLink } from '@/components/ui/view-transition-link';
import { ArrowLeft } from 'lucide-react';

export function BioEvolution3D() {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<{
        world: CANNON.World;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        population: { creature: Creature3D, group: THREE.Group, visualSprings: THREE.Line[], nodes: THREE.Mesh[] }[];
        startTime: number;
        generation: number;
        record: number;
    } | null>(null);

    const [stats, setStats] = useState({ gen: 1, time: 4.0, record: 0 });

    const POP_SIZE = 25;
    const LIFESPAN = 4000;

    useEffect(() => {
        if (!containerRef.current) return;

        // --- INIT THREE & CANNON ---
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.08);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(8, 8, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const world = new CANNON.World();
        world.gravity.set(0, -9.81, 0);
        world.broadphase = new CANNON.SAPBroadphase(world);

        // Ground
        const groundMat = new CANNON.Material("ground");
        const groundBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: groundMat });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        world.addBody(groundBody);

        const grid = new THREE.GridHelper(200, 100, 0x00ff00, 0x111111);
        scene.add(grid);

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);

        engineRef.current = {
            world, scene, camera, renderer,
            population: [],
            startTime: Date.now(),
            generation: 1,
            record: 0
        };

        const spawn = (genomes?: Genome[]) => {
            if (!engineRef.current) return;
            const { world, scene, population } = engineRef.current;

            population.forEach(p => {
                p.creature.remove();
                scene.remove(p.group);
            });
            engineRef.current.population = [];

            const nodeGeo = new THREE.SphereGeometry(0.2, 12, 12);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });

            for (let i = 0; i < POP_SIZE; i++) {
                const genome = genomes ? genomes[i] : new Genome();
                const creature = new Creature3D(genome, world);
                const group = new THREE.Group();
                const nodes: THREE.Mesh[] = [];
                const visualSprings: THREE.Line[] = [];

                creature.nodes.forEach(b => {
                    const mesh = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff }));
                    group.add(mesh);
                    nodes.push(mesh);
                });

                creature.springs.forEach(() => {
                    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
                    const line = new THREE.Line(geometry, lineMat.clone());
                    group.add(line);
                    visualSprings.push(line);
                });

                scene.add(group);
                engineRef.current.population.push({ creature, group, visualSprings, nodes });
            }
            engineRef.current.startTime = Date.now();
        };

        const evolve = () => {
            if (!engineRef.current) return;
            const pop = [...engineRef.current.population];
            pop.sort((a, b) => b.creature.fitness - a.creature.fitness);

            const bestF = pop[0].creature.fitness;
            if (bestF > engineRef.current.record) engineRef.current.record = bestF;

            const nextGen: Genome[] = [];
            nextGen.push(new Genome(JSON.parse(JSON.stringify(pop[0].creature.genome.data))));
            nextGen.push(new Genome(JSON.parse(JSON.stringify(pop[1].creature.genome.data))));

            while (nextGen.length < POP_SIZE) {
                const p1 = pop[Math.floor(Math.random() * 5)].creature.genome;
                const p2 = pop[Math.floor(Math.random() * 10)].creature.genome;
                let child = Genome.crossover(p1, p2);
                if (Math.random() < 0.2) child = Genome.mutate(child);
                nextGen.push(child);
            }

            engineRef.current.generation++;
            setStats(s => ({ ...s, gen: engineRef.current!.generation, record: Math.max(s.record, Math.floor(bestF)) }));
            spawn(nextGen);
        };

        spawn();

        let reqId: number;
        const animate = () => {
            if (!engineRef.current) return;
            const { world, renderer, scene, camera, population, startTime } = engineRef.current;
            const elapsed = Date.now() - startTime;

            world.fixedStep();
            population.forEach(p => {
                p.creature.update(Date.now());
                p.creature.nodes.forEach((body, i) => p.nodes[i].position.copy(body.position as any));
                p.creature.springs.forEach((s, i) => {
                    const posA = s.spring.bodyA.position;
                    const posB = s.spring.bodyB.position;
                    const att = p.visualSprings[i].geometry.attributes.position;
                    (att.array as any)[0] = posA.x; (att.array as any)[1] = posA.y; (att.array as any)[2] = posA.z;
                    (att.array as any)[3] = posB.x; (att.array as any)[4] = posB.y; (att.array as any)[5] = posB.z;
                    att.needsUpdate = true;

                    // Muscle Color
                    const phaseVal = Math.sin(Date.now() * 0.002 * s.meta.frequency + s.meta.phase);
                    const mat = (p.visualSprings[i].material as THREE.LineBasicMaterial);
                    if (phaseVal > 0) mat.color.setRGB(0, 1, 0.5); // Extend
                    else mat.color.setRGB(1, 0.2, 0.2); // Contract
                });
            });

            // Camera follow best
            const alpha = population.reduce((prev, curr) => curr.creature.fitness > prev.creature.fitness ? curr : prev);
            const target = alpha.creature.nodes[0].position;
            camera.lookAt(target.x, target.y, target.z);
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.x + 8, 0.05);

            setStats(s => ({ ...s, time: Math.max(0, (LIFESPAN - elapsed) / 1000) }));

            if (elapsed > LIFESPAN) evolve();

            renderer.render(scene, camera);
            reqId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(reqId);
            if (engineRef.current) {
                engineRef.current.renderer.dispose();
                // Clean up world
            }
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-black font-mono overflow-hidden select-none">
            {/* HUD V3 Cyber */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <div className="bg-black/80 border-2 border-[#0f0] p-3 shadow-[4px_4px_0px_#0f0]">
                    <div className="text-[10px] text-[#0f0]/60 uppercase font-black">Generation</div>
                    <div className="text-2xl text-[#0ff] font-black italic">{stats.gen}</div>
                </div>
                <div className="bg-black/80 border-2 border-[#0f0] p-3 shadow-[4px_4px_0px_#0f0]">
                    <div className="text-[10px] text-[#0f0]/60 uppercase font-black">Record</div>
                    <div className="text-2xl text-[#f0f] font-black italic">{stats.record}m</div>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-20 pointer-events-none">
                <div className="bg-black/80 border-2 border-[#0f0] p-3 shadow-[-4px_4px_0px_#0f0]">
                    <div className="text-[10px] text-[#0f0]/60 uppercase font-black">Next Cycle</div>
                    <div className="text-2xl text-white font-black italic">{stats.time.toFixed(1)}s</div>
                </div>
            </div>

            <div ref={containerRef} className="w-full h-full" />

            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                    <p className="text-[10px] text-white/50 uppercase tracking-widest leading-relaxed">
                        Bio-Organic V3 Motor <br />
                        Nodes: Spring-Mass Logic <br />
                        Evolution: Elite Selection
                    </p>
                </div>

                <ViewTransitionLink href="/simulasyonlar" className="pointer-events-auto">
                    <div className="w-12 h-12 bg-[#FACC15] border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                        <ArrowLeft className="w-6 h-6 text-black" />
                    </div>
                </ViewTransitionLink>
            </div>
        </div>
    );
}
