import Matter from 'matter-js';
import { BlobGenome } from './BlobGenome';

export class BlobCreature {
    genome: BlobGenome;
    engine: Matter.Engine;
    world: Matter.World;
    composite: Matter.Composite;
    startX: number;
    fitness: number = 0;
    color: string;
    isAlive: boolean = true;

    // High quality rendering props
    trail: { x: number, y: number }[] = [];
    maxTrailLength: number = 10;

    constructor(genome: BlobGenome, engine: Matter.Engine, x: number, y: number, color: string) {
        this.genome = genome;
        this.engine = engine;
        this.world = engine.world;
        this.startX = x;
        this.color = color;

        // Create Soft Body Grid (e.g., 4x4)
        // Matter.Composites.softBody(x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)
        this.composite = Matter.Composites.softBody(x, y, 4, 4, 0, 0, true, 8, {
            friction: 0.6,
            frictionStatic: 0.2,
            render: { visible: false },
            collisionFilter: { group: Matter.Body.nextGroup(true) }
        }, {
            stiffness: genome.data.stiffness,
            render: { visible: false }
        });

        Matter.World.add(this.world, this.composite);
    }

    update(frameCount: number) {
        if (!this.isAlive) return;

        const constraints = Matter.Composite.allConstraints(this.composite);
        const { frequencies, amplitudes, phases } = this.genome.data;

        // Apply "Muscle" forces by oscillating constraint lengths
        constraints.forEach((c, i) => {
            if (i < frequencies.length) {
                const freq = frequencies[i];
                const amp = amplitudes[i];
                const phase = phases[i];

                // Target length oscillates
                // Original length is stored in c.length
                if (!(c as any).originalLength) {
                    (c as any).originalLength = c.length;
                }

                const targetOffset = Math.sin(frameCount * freq + phase) * amp * 10;
                c.length = Math.max(1, (c as any).originalLength + targetOffset);
            }
        });

        // Update Fitness based on progress in X direction
        const center = this.getCenterPosition();
        this.fitness = Math.max(0, center.x - this.startX);

        // Update Trail for visual polish
        if (frameCount % 3 === 0) {
            this.trail.unshift({ x: center.x, y: center.y });
            if (this.trail.length > this.maxTrailLength) this.trail.pop();
        }
    }

    getCenterPosition() {
        const bodies = Matter.Composite.allBodies(this.composite);
        if (bodies.length === 0) return { x: 0, y: 0 };

        let sumX = 0, sumY = 0;
        bodies.forEach(b => {
            sumX += b.position.x;
            sumY += b.position.y;
        });
        return { x: sumX / bodies.length, y: sumY / bodies.length };
    }

    remove() {
        this.isAlive = false;
        Matter.World.remove(this.world, this.composite);
    }
}
