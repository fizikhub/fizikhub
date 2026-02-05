export class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;
    weights1: number[][]; // Input to Hidden
    weights2: number[][]; // Hidden to Output
    biases1: number[];
    biases2: number[];

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number, weights?: { w1: number[][], w2: number[][], b1: number[], b2: number[] }) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        if (weights) {
            this.weights1 = weights.w1;
            this.weights2 = weights.w2;
            this.biases1 = weights.b1;
            this.biases2 = weights.b2;
        } else {
            this.weights1 = this.randomMatrix(hiddenNodes, inputNodes);
            this.weights2 = this.randomMatrix(outputNodes, hiddenNodes);
            this.biases1 = this.randomArray(hiddenNodes);
            this.biases2 = this.randomArray(outputNodes);
        }
    }

    private randomMatrix(rows: number, cols: number): number[][] {
        return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (Math.random() * 2 - 1)));
    }

    private randomArray(len: number): number[] {
        return Array.from({ length: len }, () => (Math.random() * 2 - 1));
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private tanh(x: number): number {
        return Math.tanh(x);
    }

    predict(inputs: number[]): number[] {
        // Hidden Layer
        const hidden = this.biases1.map((b, i) => {
            let sum = b;
            for (let j = 0; j < inputs.length; j++) {
                sum += inputs[j] * this.weights1[i][j];
            }
            return this.tanh(sum);
        });

        // Output Layer
        const outputs = this.biases2.map((b, i) => {
            let sum = b;
            for (let j = 0; j < hidden.length; j++) {
                sum += hidden[j] * this.weights2[i][j];
            }
            return this.tanh(sum);
        });

        return outputs;
    }
}
