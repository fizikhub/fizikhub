"use client";

import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { P5Wrapper } from '../P5Wrapper';
import { GenomeV4 } from './GenomeV4';
import { NeuroCreature } from './NeuroCreature';

export function NeuroEvolutionSim() {
    const simulationRef = useRef<{
        engine: Matter.Engine;
        population: NeuroCreature[];
        generation: number;
        timer: number;
        totalBestFitness: number;
    }>({
        engine: Matter.Engine.create(),
        population: [],
        generation: 1,
        timer: 0,
        totalBestFitness: 0
    });

    const [stats, setStats] = useState({
        gen: 1,
        time: 12,
        best: 0,
        overallBest: 0
    });

    const POP_SIZE = 15;
    const SIM_DURATION = 720; // 12 seconds @ 60fps

    const sketch = (p: p5) => {
        let engine = simulationRef.current.engine;
        let ground: Matter.Body;
        let cameraX = 0;

        p.setup = () => {
            p.createCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);

            engine.gravity.y = 1.2;

            // Infinity Neon Ground
            ground = Matter.Bodies.rectangle(10000, p.height - 25, 20000, 50, {
                isStatic: true,
                friction: 1.0,
                label: 'ground'
            });
            Matter.World.add(engine.world, ground);

            spawnPopulation();
        };

        const spawnPopulation = (genomes?: GenomeV4[]) => {
            simulationRef.current.population.forEach(c => c.remove());
            simulationRef.current.population = [];

            const colors = ['#A855F7', '#3B82F6', '#EF4444', '#F97316', '#6366F1'];

            for (let i = 0; i < POP_SIZE; i++) {
                const genome = genomes ? genomes[i] : new GenomeV4();
                const creature = new NeuroCreature(
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
            }

            const nextGenGenomes: GenomeV4[] = [];

            // Elitism (Top 3)
            nextGenGenomes.push(new GenomeV4(JSON.parse(JSON.stringify(pop[0].genome.data))));
            nextGenGenomes.push(new GenomeV4(JSON.parse(JSON.stringify(pop[1].genome.data))));
            nextGenGenomes.push(new GenomeV4(JSON.parse(JSON.stringify(pop[2].genome.data))));

            while (nextGenGenomes.length < POP_SIZE) {
                const p1 = pop[p.floor(p.random() * 5)].genome;
                const p2 = pop[p.floor(p.random() * 8)].genome;
                let child = GenomeV4.crossover(p1, p2);
                child = GenomeV4.mutate(child, 0.15);
                nextGenGenomes.push(child);
            }

            simulationRef.current.generation++;
            simulationRef.current.timer = 0;
            spawnPopulation(nextGenGenomes);
        };

        p.draw = () => {
            // Cyber Background
            p.background(5, 5, 10);

            // Draw Background Grid
            p.stroke(40, 40, 60, 100);
            p.strokeWeight(1);
            for (let x = 0; x < p.width; x += 40) p.line(x, 0, x, p.height);
            for (let y = 0; y < p.height; y += 40) p.line(0, y, p.width, y);

            // Physics Update
            Matter.Engine.update(engine, 1000 / 60);
            simulationRef.current.timer++;

            if (simulationRef.current.timer >= SIM_DURATION) {
                evolve();
            }

            // Stats Update
            if (p.frameCount % 20 === 0) {
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
            cameraX = p.lerp(cameraX, targetX - p.width / 4, 0.1);

            p.push();
            p.translate(-cameraX, 0);

            // Draw Neon Ground
            p.noStroke();
            p.fill(20, 20, 30);
            p.rect(cameraX, p.height - 50, p.width, 50);
            p.stroke(0, 255, 255, 150);
            p.strokeWeight(3);
            p.line(cameraX, p.height - 50, cameraX + p.width, p.height - 50);

            // Distance Markers
            p.noStroke();
            p.fill(255, 50);
            p.textSize(12);
            for (let d = 0; d < 20000; d += 500) {
                if (d > cameraX - 100 && d < cameraX + p.width + 100) {
                    p.text(`${d / 10}m`, d, p.height - 65);
                }
            }

            // Draw Creatures
            simulationRef.current.population.forEach(creature => {
                const isAlpha = creature === alphaCreature;

                creature.segments.forEach((seg, i) => {
                    p.push();
                    p.translate(seg.position.x, seg.position.y);
                    p.rotate(seg.angle);

                    p.fill(creature.color);
                    p.stroke(isAlpha ? '#00ffff' : '#000');
                    p.strokeWeight(isAlpha ? 2 : 1);

                    p.rectMode(p.CENTER);
                    p.rect(0, 0, 30, 12, 4);

                    // Eyes for Head
                    if (i === 0) {
                        p.fill(0);
                        p.noStroke();
                        p.circle(10, -2, 3);
                    }
                    p.pop();
                });

                creature.update(ground.position.y - 25);
            });

            p.pop();

            // Brain Visualization (Mini Map)
            drawBrain(p, alphaCreature);
        };

        const drawBrain = (p: p5, creature: NeuroCreature) => {
            p.push();
            p.translate(p.width - 220, 20);
            p.fill(0, 150);
            p.stroke(0, 255, 255, 50);
            p.rect(0, 0, 200, 120, 8);

            p.noStroke();
            p.fill(0, 255, 255);
            p.textSize(9);
            p.text("ALPHA BRAIN ACTIVITY", 10, 15);

            // Nodes Visualization
            const nodes = creature.brain.hiddenNodes;
            for (let i = 0; i < nodes; i++) {
                const val = creature.brain.biases1[i]; // Placeholder for activity
                p.fill(0, 255, 255, p.map(val, -1, 1, 50, 255));
                p.circle(20 + (i % 6) * 30, 40 + p.floor(i / 6) * 30, 10);
            }
            p.pop();
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-[#05050a] font-mono select-none overflow-hidden">
            {/* HUD V4 - Cyber Lab */}
            <div className="flex flex-wrap border-b border-cyan-500/30">
                <div className="flex-1 min-w-[120px] p-4 border-r border-cyan-500/30 bg-cyan-950/20">
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Generation</div>
                    <div className="text-2xl font-black text-white italic">#{stats.gen}</div>
                </div>
                <div className="flex-1 min-w-[120px] p-4 border-r border-cyan-500/30">
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Epoch Timer</div>
                    <div className="text-2xl font-black text-cyan-300 italic">{stats.time}s</div>
                </div>
                <div className="flex-1 min-w-[140px] p-4 border-r border-cyan-500/30 bg-purple-950/20">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400/60">Global Mark</div>
                    <div className="text-2xl font-black text-white italic">{stats.overallBest}m</div>
                </div>
                <div className="flex-1 min-w-[140px] p-4 bg-black/40">
                    <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Lider Score</div>
                    <div className="text-2xl font-black text-cyan-400 italic">{stats.best}m</div>
                </div>
            </div>

            <div className="relative w-full h-[500px] overflow-hidden border-b border-cyan-500/50">
                <P5Wrapper sketch={sketch} className="w-full h-full" />
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-[9px] text-cyan-300 font-bold tracking-tighter">NEURO-EVOL V4</div>
                    <div className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded text-[9px] text-red-300 font-bold tracking-tighter">LIVE INFERENCE</div>
                </div>
            </div>

            <div className="p-4 bg-black/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    <p className="text-[10px] font-bold text-cyan-300/80 uppercase tracking-widest">
                        Neural Network controls segmented spinal motor functions.
                    </p>
                </div>
                <div className="flex gap-2 text-[9px] font-bold text-white/30 uppercase">
                    <span>Weights: 101</span>
                    <span>/</span>
                    <span>Layers: 3</span>
                </div>
            </div>
        </div>
    );
}
