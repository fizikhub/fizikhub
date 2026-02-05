import Matter from "matter-js";
import { Genome } from "./Genome";

export class Creature {
    genome: Genome;
    engine: Matter.Engine;
    world: Matter.World;

    body: Matter.Body;
    legs: {
        upper: Matter.Body;
        lower: Matter.Body;
        hipJoint: Matter.Constraint;
        kneeJoint: Matter.Constraint;
    }[] = [];

    composite: Matter.Composite;
    startX: number;
    fitness: number = 0;
    color: string;
    isAlive: boolean = true;

    constructor(genome: Genome, engine: Matter.Engine, x: number, y: number, color: string) {
        this.genome = genome;
        this.engine = engine;
        this.world = engine.world;
        this.startX = x;
        this.color = color;
        this.composite = Matter.Composite.create();

        // 1. Create Body
        this.body = Matter.Bodies.rectangle(x, y, genome.data.bodyWidth, genome.data.bodyHeight, {
            collisionFilter: { group: Matter.Body.nextGroup(true) },
            friction: 0.5,
            render: { fillStyle: color, strokeStyle: '#000', lineWidth: 3 }
        });
        Matter.Composite.add(this.composite, this.body);

        // 2. Create Legs
        const legSpacing = genome.data.bodyWidth / (genome.data.legCount + 1);
        for (let i = 0; i < genome.data.legCount; i++) {
            this.createLeg(x - genome.data.bodyWidth / 2 + legSpacing * (i + 1), y + genome.data.bodyHeight / 2, i);
        }

        Matter.World.add(this.world, this.composite);
    }

    private createLeg(x: number, y: number, index: number) {
        const legW = 6;
        const upperH = 35;
        const lowerH = 35;
        const group = Matter.Body.nextGroup(true);

        // Upper Leg
        const upper = Matter.Bodies.rectangle(x, y + upperH / 2, legW, upperH, {
            collisionFilter: { group },
            friction: 0.8,
            render: { fillStyle: this.color }
        });

        // Lower Leg
        const lower = Matter.Bodies.rectangle(x, y + upperH + lowerH / 2, legW, lowerH, {
            collisionFilter: { group },
            friction: 1.0,
            render: { fillStyle: this.color }
        });

        // Hip Joint (Constraint)
        const hipJoint = Matter.Constraint.create({
            bodyA: this.body,
            pointA: { x: x - this.body.position.x, y: this.body.position.y - this.body.position.y + this.genome.data.bodyHeight / 2 },
            bodyB: upper,
            pointB: { x: 0, y: -upperH / 2 },
            stiffness: 0.6,
            length: 0,
            render: { strokeStyle: '#000', lineWidth: 2 }
        });

        // Knee Joint
        const kneeJoint = Matter.Constraint.create({
            bodyA: upper,
            pointA: { x: 0, y: upperH / 2 },
            bodyB: lower,
            pointB: { x: 0, y: -lowerH / 2 },
            stiffness: 0.6,
            length: 0,
            render: { strokeStyle: '#000', lineWidth: 2 }
        });

        this.legs.push({ upper, lower, hipJoint, kneeJoint });
        Matter.Composite.add(this.composite, [upper, lower, hipJoint, kneeJoint]);
    }

    update(time: number) {
        if (!this.isAlive) return;

        this.legs.forEach((leg, i) => {
            const gene = this.genome.data.legs[i];

            // Oscillator for Hip
            const hipAngle = gene.hip.offset + Math.sin(time * gene.hip.frequency + gene.hip.phase) * gene.hip.amplitude;
            this.applyAngle(leg.upper, this.body, hipAngle, 0.05);

            // Oscillator for Knee
            const kneeAngle = gene.knee.offset + Math.sin(time * gene.knee.frequency + gene.knee.phase) * gene.knee.amplitude;
            this.applyAngle(leg.lower, leg.upper, kneeAngle, 0.05);
        });

        this.fitness = Math.max(0, this.body.position.x - this.startX);
    }

    private applyAngle(body: Matter.Body, parent: Matter.Body, targetAngle: number, strength: number) {
        const currentAngle = body.angle - parent.angle;
        const angleDiff = targetAngle - currentAngle;
        Matter.Body.setAngularVelocity(body, body.angularVelocity + angleDiff * strength);
    }

    getCenterPosition() {
        return this.body.position;
    }

    remove() {
        Matter.World.remove(this.world, this.composite);
    }
}
