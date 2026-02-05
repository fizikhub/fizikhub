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
        time: 0,
        best: 0,
        overallBest: 0
    });

    const POP_SIZE = 12;
    const SIM_DURATION = 900; // ~15 seconds

    const sketch = (p: p5) => {
        let engine = simulationRef.current.engine;
        let ground: Matter.Body;
        let cameraX = 0;

        p.setup = () => {
            p.createCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);

            engine.gravity.y = 1.0;

            // Infinity Ground
            ground = Matter.Bodies.rectangle(10000, p.height - 25, 20000, 50, {
                isStatic: true,
                friction: 1.0
            });
            Matter.World.add(engine.world, ground);

            spawnPopulation();
        };

        const spawnPopulation = (genomes?: Genome[]) => {
            simulationRef.current.population.forEach(c => c.remove());
            simulationRef.current.population = [];

            const colors = ['#FACC15', '#3B82F6', '#EF4444', '#10B981', '#A855F7', '#F97316'];

            for (let i = 0; i < POP_SIZE; i++) {
                const genome = genomes ? genomes[i] : new Genome();
                const creature = new Creature(
                    genome,
                    engine,
                    150,
                    p.height - 200,
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

            const nextGenGenomes: Genome[] = [];

            // Elite (Top 2 survive)
            nextGenGenomes.push(new Genome(JSON.parse(JSON.stringify(pop[0].genome.data))));
            nextGenGenomes.push(new Genome(JSON.parse(JSON.stringify(pop[1].genome.data))));

            while (nextGenGenomes.length < POP_SIZE) {
                const p1 = pop[p.floor(p.random() * 4)].genome;
                const p2 = pop[p.floor(p.random() * 6)].genome;
                let child = Genome.crossover(p1, p2);
                child = Genome.mutate(child, 0.1);
                nextGenGenomes.push(child);
            }

            simulationRef.current.generation++;
            simulationRef.current.timer = 0;
            spawnPopulation(nextGenGenomes);
        };

        p.draw = () => {
            p.background(255);

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

            // Draw Ground (Neo-Brutalist)
            p.fill(0);
            p.noStroke();
            p.rect(0, ground.position.y - 25, 20000, 50);

            // Distance Markers
            p.stroke(0, 15);
            p.strokeWeight(1);
            for (let d = 0; d < 20000; d += 200) {
                if (d > cameraX - 100 && d < cameraX + p.width + 100) {
                    p.line(d, 0, d, p.height);
                    p.noStroke();
                    p.fill(0, 40);
                    p.textSize(10);
                    p.text(`${d / 10}m`, d + 5, ground.position.y - 30);
                    p.stroke(0, 15);
                }
            }

            // Draw Creatures
            simulationRef.current.population.forEach(creature => {
                const isAlpha = creature === alphaCreature;

                // Draw Body
                p.fill(creature.color);
                p.stroke(0);
                p.strokeWeight(isAlpha ? 4 : 2.5);

                const b = creature.body;
                p.push();
                p.translate(b.position.x, b.position.y);
                p.rotate(b.angle);
                p.rectMode(p.CENTER);
                p.rect(0, 0, creature.genome.data.bodyWidth, creature.genome.data.bodyHeight, 4);
                p.pop();

                // Draw Legs
                creature.legs.forEach(leg => {
                    // Upper
                    p.push();
                    p.translate(leg.upper.position.x, leg.upper.position.y);
                    p.rotate(leg.upper.angle);
                    p.rectMode(p.CENTER);
                    p.rect(0, 0, 6, 35, 3);
                    p.pop();

                    // Lower
                    p.push();
                    p.translate(leg.lower.position.x, leg.lower.position.y);
                    p.rotate(leg.lower.angle);
                    p.rectMode(p.CENTER);
                    p.rect(0, 0, 6, 35, 3);
                    p.pop();

                    // Joints (Visual Circles)
                    p.fill(0);
                    if (leg.hipJoint.bodyB && leg.kneeJoint.bodyB) {
                        p.circle(leg.hipJoint.bodyB.position.x, leg.hipJoint.bodyB.position.y - 17, 4);
                        p.circle(leg.kneeJoint.bodyB.position.x, leg.kneeJoint.bodyB.position.y - 17, 3);
                    }
                });

                creature.update(p.frameCount);
            });

            p.pop();
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth > 1200 ? 1100 : p.windowWidth, 500);
        };
    };

    return (
        <div className="flex flex-col w-full h-full bg-white font-mono select-none">
            {/* HUD V2 - Neo Brutalist */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-b-[3px] border-black">
                <div className="bg-[#FACC15] p-3 border-r-[3px] border-black">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-black/60">GENES</div>
                    <div className="text-2xl font-black italic">GEN-{stats.gen}</div>
                </div>
                <div className="bg-white p-3 border-r-[3px] border-black">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-black/60">NEXT CYCLE</div>
                    <div className="text-2xl font-black italic">{stats.time}s</div>
                </div>
                <div className="bg-[#4169E1] p-3 border-r-[3px] border-black text-white">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-white/60">ALPHA RECORD</div>
                    <div className="text-2xl font-black italic">{stats.overallBest}m</div>
                </div>
                <div className="bg-black p-3 text-white">
                    <div className="text-[10px] font-black uppercase tracking-tighter text-[#FACC15]">CURRENT BEST</div>
                    <div className="text-2xl font-black italic">{stats.best}m</div>
                </div>
            </div>

            <div className="relative w-full h-[500px] bg-white overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <P5Wrapper sketch={sketch} className="w-full h-full" />
            </div>

            <div className="p-4 bg-white border-t-[3px] border-black">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#FACC15] animate-pulse border-2 border-black" />
                    <p className="text-xs font-black uppercase italic tracking-tight">
                        V2 Motor: Bacaklı anatomi ve osilatör tabanlı kas kontrolü devrede.
                    </p>
                </div>
            </div>
        </div>
    );
}
