export interface GenomeData {
    nodes: Array<{ x: number, y: number, radius: number }>;
    muscles: Array<{
        nodeA: number,
        nodeB: number,
        amplitude: number,
        phase: number,
        frequency: number,
        stiffness: number
    }>;
}

export class Genome {
    data: GenomeData;

    constructor(data?: GenomeData) {
        if (data) {
            this.data = data;
        } else {
            this.data = this.createRandom();
        }
    }

    private createRandom(): GenomeData {
        const nodeCount = Math.floor(Math.random() * 3) + 4; // 4-6 nodes
        const nodes = [];
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
                radius: Math.random() * 8 + 4
            });
        }

        const muscles = [];
        // Connect each node to at least one other to ensure a connected graph
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (Math.random() > 0.4) {
                    muscles.push({
                        nodeA: i,
                        nodeB: j,
                        amplitude: Math.random() * 30 + 5,
                        phase: Math.random() * Math.PI * 2,
                        frequency: 0.05 + Math.random() * 0.1,
                        stiffness: 0.1 + Math.random() * 0.4
                    });
                }
            }
        }
        return { nodes, muscles };
    }

    static mutate(genome: Genome, rate: number = 0.1): Genome {
        const newData = JSON.parse(JSON.stringify(genome.data));

        // Mutate nodes
        newData.nodes.forEach((node: any) => {
            if (Math.random() < rate) {
                node.x += (Math.random() - 0.5) * 20;
                node.y += (Math.random() - 0.5) * 20;
            }
        });

        // Mutate muscles
        newData.muscles.forEach((muscle: any) => {
            if (Math.random() < rate) {
                muscle.amplitude += (Math.random() - 0.5) * 10;
                muscle.phase += (Math.random() - 0.5) * 0.5;
                muscle.frequency += (Math.random() - 0.5) * 0.02;
            }
        });

        return new Genome(newData);
    }

    static crossover(parentA: Genome, parentB: Genome): Genome {
        // Simple one-point crossover on nodes and muscles
        const midNodes = Math.floor(parentA.data.nodes.length / 2);
        const nodes = [
            ...parentA.data.nodes.slice(0, midNodes),
            ...parentB.data.nodes.slice(midNodes)
        ];

        const midMuscles = Math.floor(parentA.data.muscles.length / 2);
        const muscles = [
            ...parentA.data.muscles.slice(0, midMuscles),
            ...parentB.data.muscles.slice(midMuscles)
        ];

        return new Genome({ nodes, muscles });
    }
}
