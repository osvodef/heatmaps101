export interface Point {
    value: number;
    x: number;
    y: number;
}

export interface DrawOptions {
    showNumbers: boolean;
    highlightDataPoints: boolean;
    fillType: FillType;
    cutoff: number;
}

export type FillType = 'none' | 'grayscale' | 'colorscale';

export type RGB = [number, number, number];
