import Matter from "matter-js";
import { Genome } from "./Genome";

export class Creature {
    genome: Genome;
    engine: Matter.Engine;
    world: Matter.World;
    bodies: Matter.Body[] = [];
    constraints: Matter.Constraint[] = [];
    composite: Matter.Composite;

    startX: number;
    fitness: number = 0;
    isAlive: boolean = true;
    color: string;

    constructor(genome: Genome, engine: Matter.Engine, x: number, y: number, color: string) {
        this.genome = genome;
        this.engine = engine;
        this.world = engine.world;
        this.startX = x;
        this.color = color;
        this.composite = Matter.Composite.create();

        this.initPhysics(x, y);
    }

    private initPhysics(x: number, y: number) {
        const { nodes, muscles } = this.genome.data;

        // Create bodies (nodes)
        nodes.forEach((node, i) => {
            const body = Matter.Bodies.circle(x + node.x, y + node.y, node.radius, {
                friction: 0.8,
                restitution: 0.2,
                density: 0.001,
                collisionFilter: { group: Matter.Body.nextGroup(true) },
                label: `creature-node-${i}`
            });
            this.bodies.push(body);
            Matter.Composite.add(this.composite, body);
        });

        // Create constraints (muscles)
        muscles.forEach((muscle) => {
            if (this.bodies[muscle.nodeA] && this.bodies[muscle.nodeB]) {
                const constraint = Matter.Constraint.create({
                    bodyA: this.bodies[muscle.nodeA],
                    bodyB: this.bodies[muscle.nodeB],
                    stiffness: muscle.stiffness,
                    damping: 0.05,
                    length: Matter.Vector.magnitude(
                        Matter.Vector.sub(this.bodies[muscle.nodeA].position, this.bodies[muscle.nodeB].position)
                    ),
                    render: { visible: true, strokeStyle: '#000', lineWidth: 3 }
                });
                this.constraints.push(constraint);
                Matter.Composite.add(this.composite, constraint);
            }
        });

        Matter.World.add(this.world, this.composite);
    }

    update(time: number) {
        if (!this.isAlive) return;

        // Animate muscles
        this.genome.data.muscles.forEach((muscle, i) => {
            const constraint = this.constraints[i];
            const wave = Math.sin(time * muscle.frequency + muscle.phase);
            const targetLength = constraint.length + wave * muscle.amplitude;

            // Apply muscle-like force by changing length
            // In a real soft-body, we'd adjust the stiffness or rest length
            // @ts-ignore
            constraint.length = Math.max(5, targetLength);
        });

        // Calculate fitness (distance from start)
        const centerPos = this.getCenterPosition();
        this.fitness = Math.max(0, centerPos.x - this.startX);
    }

    getCenterPosition() {
        let x = 0, y = 0;
        this.bodies.forEach(b => {
            x += b.position.x;
            y += b.position.y;
        });
        return { x: x / this.bodies.length, y: y / this.bodies.length };
    }

    remove() {
        Matter.World.remove(this.world, this.composite);
    }
}
