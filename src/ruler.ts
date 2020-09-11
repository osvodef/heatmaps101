import * as d3 from 'd3-scale-chromatic';
import { d3ColorToRgb } from './utils';
import { DrawOptions } from './types';

export class Ruler {
    private ctx: CanvasRenderingContext2D;

    private width: number;
    private height: number;

    constructor(container: HTMLElement) {
        this.width = container.clientWidth * window.devicePixelRatio;
        this.height = 75 * window.devicePixelRatio;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        canvas.style.width = `${this.width / window.devicePixelRatio}px`;
        canvas.style.height = `${this.height / window.devicePixelRatio}px`;

        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ctx.imageSmoothingEnabled = false;

        container.appendChild(canvas);
    }

    public draw(drawOptions: DrawOptions, maxValue: number): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.beginPath();

        if (drawOptions.fillType !== 'none' && maxValue > 0) {
            this.drawColors(drawOptions, maxValue);
            this.drawAxis(drawOptions, maxValue);
        }
    }

    private drawColors(drawOptions: DrawOptions, maxValue: number): void {
        const { cutoff, fillType } = drawOptions;

        if (fillType === 'none') {
            return;
        }

        const width = this.width;
        const axisHeight = 20 * window.devicePixelRatio;
        const height = this.height - axisHeight;

        const imageData = new ImageData(width, height);
        const pixels = imageData.data;

        for (let i = 0; i < width; i++) {
            const value = (i / width) * maxValue;
            const ratio = Math.min(value / cutoff, 1);
            const level = Math.round(ratio * 255);

            const color =
                fillType === 'grayscale'
                    ? [level, level, level]
                    : d3ColorToRgb(d3[fillType](ratio));

            for (let j = 0; j < height; j++) {
                const baseIndex = (j * width + i) * 4;

                pixels[baseIndex + 0] = color[0];
                pixels[baseIndex + 1] = color[1];
                pixels[baseIndex + 2] = color[2];
                pixels[baseIndex + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, axisHeight);
    }

    private drawAxis(drawOptions: DrawOptions, maxValue: number): void {
        const { ctx, width, height } = this;
        const dpr = window.devicePixelRatio;
        const halfPx = 0.5 * dpr;

        const left = halfPx;
        const right = width - halfPx;
        const bottom = height - halfPx;
        const axisHeight = 20 * dpr + halfPx;
        const textHeight = 10 * dpr;
        const tickHeightBig = 8 * dpr;
        const tickHeightSmall = 4 * dpr;
        const minTickDistance = 30 * dpr;
        const tickCount = width / minTickDistance;
        const tickStep = Math.ceil(maxValue / tickCount / 10) * 10;
        const tickStepPx = (tickStep / maxValue) * width;

        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 1 * dpr;

        ctx.moveTo(left, axisHeight);
        ctx.lineTo(right, axisHeight);

        ctx.moveTo(left, axisHeight - tickHeightBig);
        ctx.lineTo(left, axisHeight);

        ctx.moveTo(right, axisHeight - tickHeightBig);
        ctx.lineTo(right, axisHeight);

        ctx.stroke();

        ctx.font = `${12 * dpr}px monospace`;

        ctx.textAlign = 'left';
        ctx.fillText('0', left, textHeight);

        ctx.textAlign = 'right';
        ctx.fillText(String(Math.ceil(maxValue)), right, textHeight);

        ctx.textAlign = 'center';

        let value = tickStep;
        let x = left + tickStepPx;
        while (x < right - 35 * dpr) {
            ctx.moveTo(Math.round(x) + halfPx, axisHeight - tickHeightSmall);
            ctx.lineTo(Math.round(x) + halfPx, axisHeight);
            ctx.stroke();

            ctx.fillText(String(Math.round(value)), x, textHeight);

            value += tickStep;
            x += tickStepPx;
        }

        const cutoffPosition = Math.round((drawOptions.cutoff / maxValue) * width) + halfPx;
        ctx.beginPath();
        ctx.strokeStyle = '#ff5c5c';
        ctx.fillStyle = '#ff5c5c';

        ctx.moveTo(cutoffPosition, axisHeight);
        ctx.lineTo(cutoffPosition, bottom);
        ctx.stroke();

        ctx.moveTo(cutoffPosition, axisHeight);
        ctx.lineTo(cutoffPosition - tickHeightBig / 2, axisHeight - tickHeightBig);
        ctx.lineTo(cutoffPosition + tickHeightBig / 2, axisHeight - tickHeightBig);
        ctx.lineTo(cutoffPosition, axisHeight);
        ctx.stroke();
        ctx.fill();
    }
}
