import { distance } from './utils';
import * as d3 from 'd3-scale-chromatic';
import { Point, DrawOptions, HeatmapType } from './types';
import { cellSize, cellCountX, cellCountY } from './constants';

export class Scope {
    private points: number[][];
    private values: number[][];

    private cellSize: number;
    private width: number;
    private height: number;

    private ctx: CanvasRenderingContext2D;

    constructor(container: HTMLElement) {
        this.cellSize = cellSize * window.devicePixelRatio;
        this.width = cellCountX * this.cellSize;
        this.height = cellCountY * this.cellSize;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        canvas.style.width = `${this.width / window.devicePixelRatio}px`;
        canvas.style.height = `${this.height / window.devicePixelRatio}px`;

        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.points = [];
        this.values = [];

        for (let i = 0; i < cellCountX; i++) {
            this.points.push(Array(cellCountY).fill(0));
            this.values.push(Array(cellCountY).fill(0));
        }

        container.appendChild(canvas);
    }

    public addPoint(value: number, x: number, y: number): void {
        this.points[x][y] = value;
    }

    public calculateValues(radius: number, type: HeatmapType): void {
        if (type === 'regular') {
            this.calculateValuesRegular(radius);
        } else {
            this.calculateValuesIdw(radius);
        }
    }

    public draw(options: DrawOptions): void {
        const { ctx, points, values, cellSize } = this;
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
                } else {
                    ctx.fillStyle = d3[fillType](Math.min(values[i][j] / cutoff, 1));
                }

                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }

        if (showNumbers) {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${15 * window.devicePixelRatio}px monospace`;
            ctx.fillStyle = '#fff';

            for (let i = 0; i < values.length; i++) {
                for (let j = 0; j < values[i].length; j++) {
                    ctx.fillText(
                        String(Math.round(values[i][j])),
                        cellSize * i + cellSize / 2,
                        cellSize * j + cellSize / 2 + 1,
                    );
                }
            }
        }
    }

    public clear(): void {
        this.points = [];
        this.values = [];

        for (let i = 0; i < cellCountX; i++) {
            this.points.push(Array(cellCountY).fill(0));
            this.values.push(Array(cellCountY).fill(0));
        }
    }

    public getMaxValue(): number {
        const { values } = this;

        let max = 0;

        for (let i = 0; i < cellCountX; i++) {
            for (let j = 0; j < cellCountY; j++) {
                if (values[i][j] > max) {
                    max = values[i][j];
                }
            }
        }

        return max;
    }

    private calculateValuesRegular(radius: number): void {
        const { values } = this;
        const pointList = this.getPointList();

        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                values[i][j] = 0;

                for (const { x, y, value } of pointList) {
                    const dst = distance(x, y, i, j);

                    if (dst > radius) {
                        continue;
                    }

                    const delta = i === x && j === y ? value : value * (1 - dst / radius);

                    values[i][j] = values[i][j] + delta;
                }
            }
        }
    }

    private calculateValuesIdw(radius: number): void {
        const { points, values } = this;
        const pointList = this.getPointList();

        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                if (points[i][j] !== 0) {
                    values[i][j] = points[i][j];
                    continue;
                }

                let numerator = 0;
                let denominator = 0;

                for (const { x, y, value } of pointList) {
                    const dst = distance(x, y, i, j);

                    if (dst > radius) {
                        continue;
                    }

                    numerator += value / (dst * dst);
                    denominator += 1 / (dst * dst);
                }

                values[i][j] = denominator !== 0 ? numerator / denominator : 0;
            }
        }
    }

    private getPointList(): Point[] {
        const { points } = this;
        const pointList: Point[] = [];

        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points[i].length; j++) {
                if (points[i][j] !== 0) {
                    pointList.push({ x: i, y: j, value: points[i][j] });
                }
            }
        }

        return pointList;
    }
}
