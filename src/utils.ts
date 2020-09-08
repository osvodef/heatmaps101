import { RGB } from './types';

export function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function d3ColorToRgb(color: string): RGB {
    return color[0] === '#' ? hexToRgb(color) : stringToRgb(color);
}

export function hexToRgb(hex: string): RGB {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

export function stringToRgb(color: string): RGB {
    const split = color.slice(4, -1).split(',');
    return [Number(split[0]), Number(split[1]), Number(split[2])];
}
