import * as CANNON from 'cannon-es';
import { Genome } from './GenomeV3';

export class Creature3D {
    genome: Genome;
    world: CANNON.World;
    nodes: CANNON.Body[] = [];
    springs: { spring: CANNON.Spring, meta: any }[] = [];
    fitness: number = 0;
    isAlive: boolean = true;

    constructor(genome: Genome, world: CANNON.World) {
        this.genome = genome;
        this.world = world;
        this.init();
    }

    private init() {
        const { nodePositions, springConnections } = this.genome.data;

        // Create Nodes
        nodePositions.forEach(pos => {
            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(pos.x, pos.y, pos.z),
                shape: new CANNON.Sphere(0.2),
                linearDamping: 0.1,
                angularDamping: 0.1
            });
            this.world.addBody(body);
            this.nodes.push(body);
        });

        // Create Springs (Muscles)
        springConnections.forEach(meta => {
            const spring = new CANNON.Spring(this.nodes[meta.a], this.nodes[meta.b], {
                restLength: meta.restLength,
                stiffness: meta.stiffness,
                damping: 1
            });
            this.springs.push({ spring, meta });
        });
    }

    update(time: number) {
        if (!this.isAlive) return;

        this.springs.forEach(({ spring, meta }) => {
            // Muscle Contraction Logic
            const wave = Math.sin(time * 0.002 * meta.frequency + meta.phase);
            spring.restLength = meta.restLength + (wave * meta.amplitude);
            spring.applyForce();
        });

        this.fitness = this.nodes[0].position.x;
    }

    remove() {
        this.isAlive = false;
        this.nodes.forEach(n => this.world.removeBody(n));
    }
}
