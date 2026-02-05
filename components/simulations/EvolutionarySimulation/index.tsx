"use client";

import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { P5Wrapper } from '../P5Wrapper';
import { Genome } from './Genome';
import { Creature } from './Creature';

export function EvolutionarySimulation() {
    const simulationRef = useRef<{
        engine: Matter.Engine;
        population: Creature[];
        generation: number;
        timer: number;
        bestFitness: number;
        totalBestFitness: number;
    }>({
        engine: Matter.Engine.create(),
        population: [],
        generation: 1,
        timer: 0,
        bestFitness: 0,
        totalBestFitness: 0
    });

    const [stats, setStats] = useState({
        gen: 1,
        time: 0,
        best: 0,
        overallBest: 0
    });

    const POP_SIZE = 12;
    const SIM_DURATION = 900; // ~15 seconds at 60fps

    const sketch = (p: p5) => {
        let engine = simulationRef.current.engine;
        let world = engine.world;
        let ground: Matter.Body;
        let cameraX = 0;
        let zoom = 0.8;

        p.setup = () => {
            const container = p.select('body')?.elt; // Fallback, but P5Wrapper handles this
            p.createCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);

            // Physics Init
            engine.gravity.y = 1.2;

            ground = Matter.Bodies.rectangle(5000, p.height - 20, 20000, 40, {
                isStatic: true,
                friction: 1.0
            });
            Matter.World.add(world, ground);

            spawnPopulation();
        };

        const spawnPopulation = (genomes?: Genome[]) => {
            simulationRef.current.population.forEach(c => c.remove());
            simulationRef.current.population = [];

            const colors = ['#FACC15', '#4169E1', '#F43F5E', '#10B981', '#8B5CF6'];

            for (let i = 0; i < POP_SIZE; i++) {
                const genome = genomes ? genomes[i] : new Genome();
                const creature = new Creature(
                    genome,
                    engine,
                    100,
                    p.height - 150,
                    colors[i % colors.length]
                );
                simulationRef.current.population.push(creature);
            }
        };

        const evolve = () => {
            const pop = simulationRef.current.population;
            pop.sort((a, b) => b.fitness - a.fitness);

            const best = pop[0].fitness;
            if (best > simulationRef.current.totalBestFitness) {
                simulationRef.current.totalBestFitness = best;
            }

            // Selection & Crossover
            const nextGenGenomes: Genome[] = [];

            // Keep the best (Elitism)
            nextGenGenomes.push(pop[0].genome);
            nextGenGenomes.push(pop[1].genome);

            // Create offspring
            while (nextGenGenomes.length < POP_SIZE) {
                const parentA = pop[Math.floor(Math.random() * 3)].genome; // Top 3
                const parentB = pop[Math.floor(Math.random() * 6)].genome; // Top 6
                let child = Genome.crossover(parentA, parentB);
                child = Genome.mutate(child, 0.15);
                nextGenGenomes.push(child);
            }

            simulationRef.current.generation++;
            simulationRef.current.timer = 0;
            spawnPopulation(nextGenGenomes);
        };

        p.draw = () => {
            p.background(250);

            // UI Update
            if (p.frameCount % 10 === 0) {
                const currentBest = Math.max(...simulationRef.current.population.map(c => c.fitness));
                setStats({
                    gen: simulationRef.current.generation,
                    time: Math.floor((SIM_DURATION - simulationRef.current.timer) / 60),
                    best: Math.floor(currentBest / 10),
                    overallBest: Math.floor(simulationRef.current.totalBestFitness / 10)
                });
            }

            // Evolutionary Cycle
            simulationRef.current.timer++;
            if (simulationRef.current.timer >= SIM_DURATION) {
                evolve();
            }

            // Physics Step
            Matter.Engine.update(engine, 1000 / 60);

            // Follow best creature
            const bestCreature = simulationRef.current.population.reduce((prev, current) =>
                (prev.fitness > current.fitness) ? prev : current
            );
            const targetX = bestCreature.getCenterPosition().x;
            cameraX = p.lerp(cameraX, targetX - p.width / 3, 0.1);

            p.push();
            p.translate(-cameraX, p.height - 100);
            p.scale(zoom);
            p.translate(0, -p.height + 100);

            // Draw Ground (Neo-Brutalist)
            p.fill(0);
            p.noStroke();
            p.rect(ground.position.x - 10000, ground.position.y - 20, 20000, 40);

            // Grid for distance
            p.stroke(0, 20);
            p.strokeWeight(1);
            for (let x = 0; x < 15000; x += 100) {
                p.line(x, 0, x, p.height);
                if (x % 500 === 0) {
                    p.fill(0, 50);
                    p.noStroke();
                    p.textSize(12);
                    p.text(`${x / 10}m`, x + 5, ground.position.y - 25);
                }
            }

            // Draw Creatures
            simulationRef.current.population.forEach(creature => {
                const isBest = creature === bestCreature;

                // Draw Muscles (Constraints)
                p.stroke(0);
                p.strokeWeight(isBest ? 4 : 2);
                creature.constraints.forEach(c => {
                    // @ts-ignore
                    p.line(c.bodyA.position.x, c.bodyA.position.y, c.bodyB.position.x, c.bodyB.position.y);
                });

                // Draw Nodes
                creature.bodies.forEach((b, i) => {
                    p.fill(creature.color);
                    p.stroke(0);
                    p.strokeWeight(2);
                    p.ellipse(b.position.x, b.position.y, b.circleRadius! * 2);

                    // Shadow effect
                    p.noFill();
                    p.stroke(0, 50);
                    p.ellipse(b.position.x + 2, b.position.y + 2, b.circleRadius! * 2);
                });

                creature.update(p.frameCount);
            });

            p.pop();

            // Mobile HUD Overlay (Neo-Brutalist)
            drawHUD(p);
        };

        const drawHUD = (p: p5) => {
            p.resetMatrix();
            // HUD logic could go here, but we use React for HUD better
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-white font-mono">
            {/* HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-[#FACC15] border-b-4 border-black z-10">
                <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
                    <span className="block text-[10px] uppercase font-black">NESİL</span>
                    <span className="text-xl font-black italic">{stats.gen}</span>
                </div>
                <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
                    <span className="block text-[10px] uppercase font-black">SÜRE (S)</span>
                    <span className="text-xl font-black italic">{stats.time}</span>
                </div>
                <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
                    <span className="block text-[10px] uppercase font-black">REKOR (M)</span>
                    <span className="text-xl font-black italic">{stats.overallBest}</span>
                </div>
                <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_#000]">
                    <span className="block text-[10px] uppercase font-black">ŞU ANKİ (M)</span>
                    <span className="text-xl font-black italic text-[#4169E1]">{stats.best}</span>
                </div>
            </div>

            <div className="relative w-full h-[500px] bg-white border-y-2 border-black overflow-hidden">
                <P5Wrapper sketch={sketch} className="w-full h-full" />
            </div>

            <div className="p-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest text-center border-t-2 border-black">
                Yaratıklar rastgele genlerle başlar ve yürümeyi evrimle öğrenir.
            </div>
        </div>
    );
}
