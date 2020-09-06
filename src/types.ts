export interface Point {
    value: number;
    x: number;
    y: number;
}

export interface DrawOptions {
    showNumbers: boolean;
    highlightDataPoints: boolean;
    fillType: 'none' | 'grayscale' | 'colorscale';
    cutoff: number;
}
