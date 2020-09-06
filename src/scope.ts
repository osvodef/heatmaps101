import { distance } from './utils';
import { cellSize, cellCountX, cellCountY, maxValue } from './constants';
import { Point, DrawOptions } from './types';

export class Scope {
    private points: number[][];
    private values: number[][];

    private pointList: Point[];

    private width: number;
    private height: number;

    private ctx: CanvasRenderingContext2D;

    constructor(container: HTMLElement) {
        this.width = cellCountX * cellSize;
        this.height = cellCountY * cellSize;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.pointList = [];
        this.points = [];
        this.values = [];

        for (let i = 0; i < cellCountX; i++) {
            this.points.push(Array(cellCountY).fill(0));
            this.values.push(Array(cellCountY).fill(0));
        }

        container.appendChild(canvas);
    }

    public addPoint(value: number, x: number, y: number): void {
        this.pointList.push({ x, y, value });
        this.points[x][y] = value;
    }

    public addRandomPoint(): void {
        const x = Math.floor(Math.random() * cellCountX);
        const y = Math.floor(Math.random() * cellCountY);
        const value = Math.floor(Math.random() * maxValue);

        this.addPoint(value, x, y);
    }

    public calculateValues(radius: number): void {
        const { values, pointList } = this;

        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                values[i][j] = 0;

                for (const { x, y, value } of pointList) {
                    const dst = distance(x, y, i, j);

                    if (dst > radius) {
                        continue;
                    }

                    const delta = i === x && j === y ? value : value * (1 - dst / radius);

                    values[i][j] = Math.round(values[i][j] + delta);
                }
            }
        }
    }

    public draw(options: DrawOptions): void {
        const { ctx, points, values } = this;
        const { cutoff, highlightDataPoints, fillType, showNumbers } = options;

        ctx.imageSmoothingEnabled = false;

        for (let i = 0; i < cellCountX; i++) {
            for (let j = 0; j < cellCountY; j++) {
                if (highlightDataPoints && points[i][j] !== 0) {
                    ctx.fillStyle = '#ff5c5c';
                } else if (fillType === 'none') {
                    ctx.fillStyle = '#000';
                } else if (fillType === 'grayscale') {
                    const level = Math.round(Math.min(values[i][j] / cutoff, 1) * 255);
                    ctx.fillStyle = `rgb(${level}, ${level}, ${level})`;
                }

                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }

        if (showNumbers) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '15px monospace';
            ctx.fillStyle = '#fff';

            for (let i = 0; i < values.length; i++) {
                for (let j = 0; j < values[i].length; j++) {
                    ctx.fillText(
                        String(values[i][j]),
                        cellSize * i + cellSize / 2,
                        cellSize * j + cellSize / 2 + 1,
                    );
                }
            }
        }
    }

    public clear(): void {
        this.pointList = [];
        this.points = [];
        this.values = [];

        for (let i = 0; i < cellCountX; i++) {
            this.points.push(Array(cellCountY).fill(0));
            this.values.push(Array(cellCountY).fill(0));
        }
    }
}
