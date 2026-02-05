export interface GenomeDataV4 {
    weights1: number[][];
    weights2: number[][];
    biases1: number[];
    biases2: number[];
    segmentCount: number;
}

export class GenomeV4 {
    data: GenomeDataV4;

    constructor(data?: GenomeDataV4) {
        if (data) {
            this.data = data;
        } else {
            this.data = this.createRandom();
        }
    }

    private createRandom(): GenomeDataV4 {
        const inputNodes = 8; // pos, vel[2], height, angles[4]
        const hiddenNodes = 12;
        const outputNodes = 5; // Torques for each joint

        return {
            weights1: Array.from({ length: hiddenNodes }, () => Array.from({ length: inputNodes }, () => (Math.random() * 2 - 1))),
            weights2: Array.from({ length: outputNodes }, () => Array.from({ length: hiddenNodes }, () => (Math.random() * 2 - 1))),
            biases1: Array.from({ length: hiddenNodes }, () => (Math.random() * 2 - 1)),
            biases2: Array.from({ length: outputNodes }, () => (Math.random() * 2 - 1)),
            segmentCount: 5
        };
    }

    static mutate(genome: GenomeV4, rate: number = 0.1): GenomeV4 {
        const newData = JSON.parse(JSON.stringify(genome.data));

        const mutateVal = (v: number) => Math.random() < rate ? v + (Math.random() * 2 - 1) * 0.2 : v;
        const mutateArr = (arr: number[]) => arr.map(mutateVal);
        const mutateMat = (mat: number[][]) => mat.map(mutateArr);

        newData.weights1 = mutateMat(newData.weights1);
        newData.weights2 = mutateMat(newData.weights2);
        newData.biases1 = mutateArr(newData.biases1);
        newData.biases2 = mutateArr(newData.biases2);

        return new GenomeV4(newData);
    }

    static crossover(parentA: GenomeV4, parentB: GenomeV4): GenomeV4 {
        const newData = JSON.parse(JSON.stringify(parentA.data));

        // Randomly pick layers from either parent
        if (Math.random() > 0.5) newData.weights1 = JSON.parse(JSON.stringify(parentB.data.weights1));
        if (Math.random() > 0.5) newData.weights2 = JSON.parse(JSON.stringify(parentB.data.weights2));
        if (Math.random() > 0.5) newData.biases1 = [...parentB.data.biases1];
        if (Math.random() > 0.5) newData.biases2 = [...parentB.data.biases2];

        return new GenomeV4(newData);
    }
}
