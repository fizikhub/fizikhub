"use client";

import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { P5Wrapper } from '../P5Wrapper';
import { BlobGenome } from './BlobGenome';
import { BlobCreature } from './BlobCreature';

export function BlobEvolutionSim() {
    const simulationRef = useRef<{
        engine: Matter.Engine;
        population: BlobCreature[];
        generation: number;
        timer: number;
        totalBestFitness: number;
        bestGenome: BlobGenome | null;
    }>({
        engine: Matter.Engine.create(),
        population: [],
        generation: 1,
        timer: 0,
        totalBestFitness: 0,
        bestGenome: null
    });

    const [stats, setStats] = useState({
        gen: 1,
        time: 0,
        best: 0,
        overallBest: 0
    });

    const POP_SIZE = 15;
    const SIM_DURATION = 600; // 10 seconds at 60fps

    const sketch = (p: p5) => {
        let engine = simulationRef.current.engine;
        let ground: Matter.Body;
        let cameraX = 0;

        p.setup = () => {
            p.createCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);
            engine.gravity.y = 1.0;

            // Ground
            ground = Matter.Bodies.rectangle(10000, p.height - 25, 20000, 50, {
                isStatic: true,
                friction: 1.0,
                render: { visible: false }
            });
            Matter.World.add(engine.world, ground);

            spawnPopulation();
        };

        const spawnPopulation = (genomes?: BlobGenome[]) => {
            simulationRef.current.population.forEach(c => c.remove());
            simulationRef.current.population = [];

            const colors = [
                '#00F5FF', // Neon Cyan
                '#FF00FF', // Neon Pink
                '#39FF14', // Neon Green
                '#FFD700', // Gold
                '#FF4500'  // OrangeRed
            ];

            for (let i = 0; i < POP_SIZE; i++) {
                const genome = genomes ? genomes[i] : new BlobGenome();
                const creature = new BlobCreature(
                    genome,
                    engine,
                    150,
                    p.height - 150,
                    colors[i % colors.length]
                );
                simulationRef.current.population.push(creature);
            }
        };

        const evolve = () => {
            const pop = [...simulationRef.current.population];
            pop.sort((a, b) => b.fitness - a.fitness);

            if (pop[0].fitness > simulationRef.current.totalBestFitness) {
                simulationRef.current.totalBestFitness = pop[0].fitness;
                simulationRef.current.bestGenome = pop[0].genome;
            }

            const nextGenGenomes: BlobGenome[] = [];

            // Elitism: Keep top 2
            nextGenGenomes.push(new BlobGenome(JSON.parse(JSON.stringify(pop[0].genome.data))));
            nextGenGenomes.push(new BlobGenome(JSON.parse(JSON.stringify(pop[1].genome.data))));

            // Fill rest with crossover and mutation
            while (nextGenGenomes.length < POP_SIZE) {
                const p1 = pop[Math.floor(p.random() * 5)].genome;
                const p2 = pop[Math.floor(p.random() * 8)].genome;
                let child = BlobGenome.crossover(p1, p2);
                child = BlobGenome.mutate(child, 0.1);
                nextGenGenomes.push(child);
            }

            simulationRef.current.generation++;
            simulationRef.current.timer = 0;
            spawnPopulation(nextGenGenomes);
        };

        p.draw = () => {
            // Dark Void Background
            p.background(10, 10, 20);

            // Update Physics
            Matter.Engine.update(engine, 1000 / 60);
            simulationRef.current.timer++;

            if (simulationRef.current.timer >= SIM_DURATION) {
                evolve();
            }

            // Stats Update
            if (p.frameCount % 15 === 0) {
                const currentBest = Math.max(...simulationRef.current.population.map(c => c.fitness));
                setStats({
                    gen: simulationRef.current.generation,
                    time: Math.ceil((SIM_DURATION - simulationRef.current.timer) / 60),
                    best: Math.floor(currentBest / 10),
                    overallBest: Math.floor(simulationRef.current.totalBestFitness / 10)
                });
            }

            // Camera Tracking
            const alphaCreature = simulationRef.current.population.reduce((prev, curr) =>
                (prev.fitness > curr.fitness) ? prev : curr
            );
            const targetX = alphaCreature.getCenterPosition().x;
            cameraX = p.lerp(cameraX, targetX - p.width / 4, 0.05);

            p.push();
            p.translate(-cameraX, 0);

            // Draw Grid Floor (Cyberpunk style)
            p.stroke(40, 40, 80, 100);
            p.strokeWeight(1);
            for (let x = Math.floor(cameraX / 50) * 50; x < cameraX + p.width + 50; x += 50) {
                p.line(x, 0, x, p.height);
            }
            for (let y = 0; y < p.height; y += 50) {
                p.line(cameraX, y, cameraX + p.width, y);
            }

            // Draw Ground Surface
            p.noFill();
            p.stroke(0, 245, 255); // Neon Cyan line
            p.strokeWeight(4);
            p.line(cameraX, ground.position.y - 25, cameraX + p.width, ground.position.y - 25);

            // Draw Distance Markers
            p.fill(255, 100);
            p.noStroke();
            p.textSize(12);
            for (let d = 0; d < 20000; d += 500) {
                if (d > cameraX - 100 && d < cameraX + p.width + 100) {
                    p.text(`${d / 10}m`, d + 10, ground.position.y - 35);
                }
            }

            // Draw Creatures
            simulationRef.current.population.forEach(creature => {
                creature.update(p.frameCount);
                const isAlpha = creature === alphaCreature;
                const pos = creature.getCenterPosition();
                const bodies = Matter.Composite.allBodies(creature.composite);

                // Draw Trail
                p.noFill();
                p.strokeWeight(2);
                p.beginShape();
                creature.trail.forEach((t, idx) => {
                    const alpha = p.map(idx, 0, creature.trail.length, 150, 0);
                    p.stroke(creature.color + Math.floor(alpha).toString(16).padStart(2, '0'));
                    p.vertex(t.x, t.y);
                });
                p.endShape();

                // Draw Soft Body Mesh
                p.fill(creature.color + (isAlpha ? '66' : '33')); // Translucent
                p.stroke(creature.color);
                p.strokeWeight(isAlpha ? 3 : 1);

                // Simple polygon drawing from bodies
                p.beginShape();
                // To make a smooth blob, we'd need to order these, 
                // but for a grid softbody, we can draw connections or a hull.
                // Let's draw it as a connected mesh.
                bodies.forEach((b, idx) => {
                    // Just draw nodes for now
                    p.circle(b.position.x, b.position.y, 6);
                });
                p.endShape();

                // Draw Connections (Muscles)
                p.strokeWeight(0.5);
                const constraints = Matter.Composite.allConstraints(creature.composite);
                constraints.forEach(c => {
                    if (c.bodyA && c.bodyB) {
                        p.line(c.bodyA.position.x, c.bodyA.position.y, c.bodyB.position.x, c.bodyB.position.y);
                    }
                });

                if (isAlpha) {
                    p.noFill();
                    p.stroke(255, 255, 255, 150);
                    p.circle(pos.x, pos.y, 80); // Glow ring for alpha
                }
            });

            p.pop();
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#0a0a14] font-mono select-none overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            {/* Header / Stats Overlay */}
            <div className="flex justify-between items-center p-4 bg-black/40 backdrop-blur-md border-b border-white/10">
                <div className="flex gap-6">
                    <div>
                        <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Generation</p>
                        <p className="text-2xl font-black text-white">{stats.gen}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-pink-400 font-bold tracking-widest uppercase">Next Cycle</p>
                        <p className="text-2xl font-black text-white">{stats.time}s</p>
                    </div>
                </div>
                <div className="flex gap-6 text-right">
                    <div>
                        <p className="text-[10px] text-lime-400 font-bold tracking-widest uppercase">Alpha Dist</p>
                        <p className="text-2xl font-black text-white">{stats.best}m</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">Record</p>
                        <p className="text-2xl font-black text-white">{stats.overallBest}m</p>
                    </div>
                </div>
            </div>

            <div className="relative w-full h-[500px]">
                <P5Wrapper sketch={sketch} className="w-full h-full" />

                {/* Floating Info */}
                <div className="absolute bottom-6 left-6 p-4 bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg max-w-xs">
                    <p className="text-xs text-white/80 leading-relaxed italic">
                        <span className="text-cyan-400 font-bold">Blob-Evolution v3.0:</span> Canlılar kas liflerini (springs) titreterek kendilerini ileri itmeyi öğreniyorlar. En uzağa gidenin genleri bir sonraki nesle aktarılır.
                    </p>
                </div>
            </div>
        </div>
    );
}
