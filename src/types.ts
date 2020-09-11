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

export type HeatmapType = 'regular' | 'idw';
export type FillType = 'none' | 'grayscale' | D3ColorScale;
export type D3ColorScale =
    | 'interpolateBlues'
    | 'interpolateBrBG'
    | 'interpolateBuGn'
    | 'interpolateBuPu'
    | 'interpolateCividis'
    | 'interpolateCool'
    | 'interpolateCubehelixDefault'
    | 'interpolateGnBu'
    | 'interpolateGreens'
    | 'interpolateGreys'
    | 'interpolateInferno'
    | 'interpolateMagma'
    | 'interpolateOrRd'
    | 'interpolateOranges'
    | 'interpolatePRGn'
    | 'interpolatePiYG'
    | 'interpolatePlasma'
    | 'interpolatePuBu'
    | 'interpolatePuBuGn'
    | 'interpolatePuOr'
    | 'interpolatePuRd'
    | 'interpolatePurples'
    | 'interpolateRainbow'
    | 'interpolateRdBu'
    | 'interpolateRdGy'
    | 'interpolateRdPu'
    | 'interpolateRdYlBu'
    | 'interpolateRdYlGn'
    | 'interpolateReds'
    | 'interpolateSinebow'
    | 'interpolateSpectral'
    | 'interpolateTurbo'
    | 'interpolateViridis'
    | 'interpolateWarm'
    | 'interpolateYlGn'
    | 'interpolateYlGnBu'
    | 'interpolateYlOrBr'
    | 'interpolateYlOrRd';

export type RGB = [number, number, number];
