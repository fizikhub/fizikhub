export interface BlobGenomeData {
    frequencies: number[]; // Frequency for each spring "muscle"
    amplitudes: number[];  // Strength of oscillation
    phases: number[];      // Relative timing
    stiffness: number;     // Base structural integrity
    damping: number;       // Energy loss
}

export class BlobGenome {
    data: BlobGenomeData;

    constructor(data?: BlobGenomeData) {
        if (data) {
            this.data = data;
        } else {
            // Default / Random Genome
            this.data = {
                frequencies: Array.from({ length: 40 }, () => Math.random() * 0.2 + 0.05),
                amplitudes: Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2),
                phases: Array.from({ length: 40 }, () => Math.random() * Math.PI * 2),
                stiffness: Math.random() * 0.4 + 0.1,
                damping: Math.random() * 0.05 + 0.01,
            };
        }
    }

    static crossover(p1: BlobGenome, p2: BlobGenome): BlobGenome {
        const childData: Partial<BlobGenomeData> = {};

        // Mix individual gene arrays
        childData.frequencies = p1.data.frequencies.map((v, i) => Math.random() > 0.5 ? v : p2.data.frequencies[i]);
        childData.amplitudes = p1.data.amplitudes.map((v, i) => Math.random() > 0.5 ? v : p2.data.amplitudes[i]);
        childData.phases = p1.data.phases.map((v, i) => Math.random() > 0.5 ? v : p2.data.phases[i]);

        // Mix scalar values
        childData.stiffness = Math.random() > 0.5 ? p1.data.stiffness : p2.data.stiffness;
        childData.damping = Math.random() > 0.5 ? p1.data.damping : p2.data.damping;

        return new BlobGenome(childData as BlobGenomeData);
    }

    static mutate(genome: BlobGenome, rate: number): BlobGenome {
        const mutatedData = JSON.parse(JSON.stringify(genome.data)) as BlobGenomeData;

        if (Math.random() < rate) mutatedData.stiffness += (Math.random() - 0.5) * 0.1;
        if (Math.random() < rate) mutatedData.damping += (Math.random() - 0.5) * 0.02;

        mutatedData.frequencies = mutatedData.frequencies.map(v =>
            Math.random() < rate ? v + (Math.random() - 0.5) * 0.05 : v
        );
        mutatedData.amplitudes = mutatedData.amplitudes.map(v =>
            Math.random() < rate ? Math.min(1.5, Math.max(0.1, v + (Math.random() - 0.5) * 0.2)) : v
        );
        mutatedData.phases = mutatedData.phases.map(v =>
            Math.random() < rate ? v + (Math.random() - 0.5) * 0.5 : v
        );

        return new BlobGenome(mutatedData);
    }
}
