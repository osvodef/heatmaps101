import { DrawOptions, RGB } from './types';
import * as d3 from 'd3-scale-chromatic';
import { d3ColorToRgb } from './utils';

export class Ruler {
    private ctx: CanvasRenderingContext2D;

    private width: number;
    private height: number;

    constructor(container: HTMLElement) {
        this.width = container.clientWidth;
        this.height = 75;

        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

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

        const width = this.width;
        const height = this.height - 20;

        const imageData = new ImageData(width, height);
        const pixels = imageData.data;

        for (let i = 0; i < width; i++) {
            const value = (i / width) * maxValue;
            const ratio = Math.min(value / cutoff, 1);

            let color: RGB;

            if (fillType === 'grayscale') {
                const level = Math.round(ratio * 255);
                color = [level, level, level];
            } else {
                color = d3ColorToRgb(d3[fillType](ratio));
            }

            for (let j = 0; j < height; j++) {
                const baseIndex = (j * width + i) * 4;

                pixels[baseIndex + 0] = color[0];
                pixels[baseIndex + 1] = color[1];
                pixels[baseIndex + 2] = color[2];
                pixels[baseIndex + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 20);
    }

    private drawAxis(drawOptions: DrawOptions, maxValue: number): void {
        const { ctx } = this;

        const width = this.width;
        const left = 0.5;
        const right = width - 0.5;
        const barHeight = 20 + 0.5;
        const tickHeightBig = 8;
        const tickHeightSmall = 4;
        const minTickDistance = 30;
        const tickCount = width / minTickDistance;
        const tickStep = Math.ceil(maxValue / tickCount / 10) * 10;
        const tickStepPx = (tickStep / maxValue) * width;

        ctx.lineWidth = 1;

        ctx.moveTo(left, barHeight);
        ctx.lineTo(right, barHeight);

        ctx.moveTo(left, barHeight - tickHeightBig);
        ctx.lineTo(left, barHeight);

        ctx.moveTo(right, barHeight - tickHeightBig);
        ctx.lineTo(right, barHeight);

        ctx.stroke();

        ctx.font = '12px monospace';

        ctx.textAlign = 'left';
        ctx.fillText('0', left, 10);

        ctx.textAlign = 'right';
        ctx.fillText(String(Math.ceil(maxValue)), right, 10);

        ctx.textAlign = 'center';

        let value = tickStep;
        let x = left + tickStepPx;
        while (x < right - 35) {
            ctx.moveTo(Math.round(x) + 0.5, barHeight - tickHeightSmall);
            ctx.lineTo(Math.round(x) + 0.5, barHeight);
            ctx.stroke();

            ctx.fillText(String(Math.round(value)), x, 10);

            value += tickStep;
            x += tickStepPx;
        }
    }
}
