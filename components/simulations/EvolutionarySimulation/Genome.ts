export interface JointGene {
    amplitude: number;
    phase: number;
    frequency: number;
    offset: number; // Resting angle
}

export interface LegGene {
    hip: JointGene;
    knee: JointGene;
}

export interface GenomeData {
    legCount: number;
    bodyWidth: number;
    bodyHeight: number;
    legs: LegGene[];
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
        const legCount = Math.random() > 0.5 ? 2 : 4;
        const legs: LegGene[] = [];

        for (let i = 0; i < legCount; i++) {
            legs.push({
                hip: this.randomJoint(),
                knee: this.randomJoint()
            });
        }

        return {
            legCount,
            bodyWidth: Math.random() * 40 + 40,
            bodyHeight: Math.random() * 20 + 20,
            legs
        };
    }

    private randomJoint(): JointGene {
        return {
            amplitude: Math.random() * 1.5, // 0 to 1.5 radians
            phase: Math.random() * Math.PI * 2,
            frequency: 0.05 + Math.random() * 0.1,
            offset: (Math.random() - 0.5) * 0.5
        };
    }

    static mutate(genome: Genome, rate: number = 0.1): Genome {
        const newData = JSON.parse(JSON.stringify(genome.data));

        newData.legs.forEach((leg: LegGene) => {
            this.mutateJoint(leg.hip, rate);
            this.mutateJoint(leg.knee, rate);
        });

        if (Math.random() < rate) {
            newData.bodyWidth += (Math.random() - 0.5) * 10;
            newData.bodyHeight += (Math.random() - 0.5) * 5;
        }

        return new Genome(newData);
    }

    private static mutateJoint(joint: JointGene, rate: number) {
        if (Math.random() < rate) joint.amplitude += (Math.random() - 0.5) * 0.2;
        if (Math.random() < rate) joint.phase += (Math.random() - 0.5) * 0.5;
        if (Math.random() < rate) joint.frequency += (Math.random() - 0.5) * 0.02;
        if (Math.random() < rate) joint.offset += (Math.random() - 0.5) * 0.1;
    }

    static crossover(parentA: Genome, parentB: Genome): Genome {
        const newData = JSON.parse(JSON.stringify(parentA.data));

        // Inherit leg count from parent A mostly
        // Mix leg genes
        newData.legs = parentA.data.legs.map((leg, i) => {
            if (parentB.data.legs[i] && Math.random() > 0.5) {
                return parentB.data.legs[i];
            }
            return leg;
        });

        return new Genome(newData);
    }
}
