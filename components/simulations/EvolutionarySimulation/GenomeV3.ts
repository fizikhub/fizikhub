export interface SpringGene {
    a: number;
    b: number;
    restLength: number;
    amplitude: number;
    frequency: number;
    phase: number;
    stiffness: number;
}

export interface GenomeDataV3 {
    nodePositions: { x: number, y: number, z: number }[];
    springConnections: SpringGene[];
}

export class Genome {
    data: GenomeDataV3;

    constructor(data?: GenomeDataV3) {
        this.data = data || this.createRandom();
    }

    private createRandom(): GenomeDataV3 {
        const nodeCount = 5;
        const nodePositions = [];
        for (let i = 0; i < nodeCount; i++) {
            nodePositions.push({
                x: (Math.random() - 0.5) * 2,
                y: 1 + Math.random() * 2,
                z: (Math.random() - 0.5) * 2
            });
        }

        const springConnections: SpringGene[] = [];
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                springConnections.push({
                    a: i,
                    b: j,
                    restLength: 1.5 + Math.random(),
                    amplitude: 0.5 + Math.random(),
                    frequency: 2 + Math.random() * 5,
                    phase: Math.random() * Math.PI * 2,
                    stiffness: 150 + Math.random() * 150
                });
            }
        }

        return { nodePositions, springConnections };
    }

    static mutate(genome: Genome): Genome {
        const data = JSON.parse(JSON.stringify(genome.data));
        data.springConnections.forEach((s: any) => {
            if (Math.random() < 0.2) {
                s.amplitude += (Math.random() - 0.5) * 0.5;
                s.phase += (Math.random() - 0.5) * 1;
            }
        });
        return new Genome(data);
    }

    static crossover(g1: Genome, g2: Genome): Genome {
        const data = JSON.parse(JSON.stringify(g1.data));
        data.springConnections = g1.data.springConnections.map((s, i) => {
            return Math.random() > 0.5 ? s : g2.data.springConnections[i];
        });
        return new Genome(data);
    }
}
