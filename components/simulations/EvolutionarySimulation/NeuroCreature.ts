import Matter from "matter-js";
import { GenomeV4 } from "./GenomeV4";
import { NeuralNetwork } from "./NeuralNetwork";

export class NeuroCreature {
    genome: GenomeV4;
    brain: NeuralNetwork;
    engine: Matter.Engine;
    world: Matter.World;

    segments: Matter.Body[] = [];
    joints: Matter.Constraint[] = [];
    composite: Matter.Composite;

    startX: number;
    fitness: number = 0;
    color: string;
    isAlive: boolean = true;

    constructor(genome: GenomeV4, engine: Matter.Engine, x: number, y: number, color: string) {
        this.genome = genome;
        this.engine = engine;
        this.world = engine.world;
        this.startX = x;
        this.color = color;
        this.composite = Matter.Composite.create();

        // 1. Brain Setup
        this.brain = new NeuralNetwork(
            8, // Girdiler: velX, velY, headHeight, angle1, angle2, angle3, angle4, groundContact
            12,
            5,  // Çıktılar: Torque for head + 4 joints
            {
                w1: genome.data.weights1,
                w2: genome.data.weights2,
                b1: genome.data.biases1,
                b2: genome.data.biases2
            }
        );

        // 2. Physical Layout (Segmented Centennial)
        const segmentW = 30;
        const segmentH = 12;
        const group = Matter.Body.nextGroup(true);

        for (let i = 0; i < genome.data.segmentCount; i++) {
            const isHead = i === 0;
            const segment = Matter.Bodies.rectangle(x - (i * segmentW), y, segmentW, segmentH, {
                collisionFilter: { group },
                friction: 1.0,
                frictionAir: 0.01,
                density: 0.002,
                label: `segment-${i}`,
                render: {
                    fillStyle: isHead ? '#4ADE80' : color, // Head is bright green
                    strokeStyle: '#000',
                    lineWidth: 2
                }
            });
            this.segments.push(segment);
            Matter.Composite.add(this.composite, segment);

            if (i > 0) {
                const joint = Matter.Constraint.create({
                    bodyA: this.segments[i - 1],
                    pointA: { x: -segmentW / 2, y: 0 },
                    bodyB: segment,
                    pointB: { x: segmentW / 2, y: 0 },
                    stiffness: 0.8,
                    length: 2,
                    render: { strokeStyle: '#000', lineWidth: 1, visible: false }
                });
                this.joints.push(joint);
                Matter.Composite.add(this.composite, joint);
            }
        }

        Matter.World.add(this.world, this.composite);
    }

    update(groundY: number) {
        if (!this.isAlive) return;

        const head = this.segments[0];

        // --- SENSORS (Inputs) ---
        const inputValues: number[] = [
            head.velocity.x,
            head.velocity.y,
            (groundY - head.position.y) / 200,
            (this.joints[0]?.bodyA?.angle ?? 0) - (this.joints[0]?.bodyB?.angle ?? 0),
            (this.joints[1]?.bodyA?.angle ?? 0) - (this.joints[1]?.bodyB?.angle ?? 0),
            (this.joints[2]?.bodyA?.angle ?? 0) - (this.joints[2]?.bodyB?.angle ?? 0),
            (this.joints[3]?.bodyA?.angle ?? 0) - (this.joints[3]?.bodyB?.angle ?? 0),
            this.getGroundContact() ? 1 : 0
        ];

        // --- BRAIN (Processing) ---
        const outputs = this.brain.predict(inputValues);

        // --- ACTUATORS (Outputs) ---
        // Apply torque to move segments
        this.segments.forEach((seg, i) => {
            const torque = outputs[i] * 0.15; // Increased strength
            Matter.Body.setAngularVelocity(seg, seg.angularVelocity + torque);
        });

        // 3. Update Fitness
        this.fitness = Math.max(0, head.position.x - this.startX);

        // Early Death Logic: If flipping over or not moving
        if (head.position.y > groundY + 50 || (head.position.x < this.startX - 50)) {
            // this.isAlive = false; // Optional, let them struggle
        }
    }

    getGroundContact() {
        // Simple heuristic: if any segment is very low
        return this.segments.some(s => s.position.y > 450);
    }

    getCenterPosition() {
        return this.segments[0].position;
    }

    remove() {
        this.isAlive = false;
        Matter.World.remove(this.world, this.composite);
    }
}
