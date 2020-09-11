import { Scope } from './scope';
import { Ruler } from './ruler';
import { DrawOptions, FillType, HeatmapType } from './types';
import { cellSize, maxValue, cellCountX, cellCountY } from './constants';

const drawOptions: DrawOptions = {
    showNumbers: true,
    highlightDataPoints: true,
    fillType: 'interpolateSpectral',
    cutoff: 100,
};

let heatmapType: HeatmapType = 'regular';
let radius = 8;

const addButton = document.querySelector('.button.add') as HTMLDivElement;
const clearButton = document.querySelector('.button.clear') as HTMLDivElement;
const radiusSlider = document.querySelector('#radius-slider') as HTMLInputElement;
const cutoffSlider = document.querySelector('#cutoff-slider') as HTMLInputElement;
const radiusIndicator = document.querySelector('#radius-indicator') as HTMLSpanElement;
const cutoffIndicator = document.querySelector('#cutoff-indicator') as HTMLSpanElement;
const numbersCheckbox = document.querySelector('.checkbox.numbers') as HTMLInputElement;
const pointsCheckbox = document.querySelector('.checkbox.points') as HTMLInputElement;
const colorSelect = document.querySelector('.select.color') as HTMLSelectElement;
const typeSelect = document.querySelector('.select.type') as HTMLSelectElement;
const display = document.querySelector('#display') as HTMLElement;

const scope = new Scope(display);
const ruler = new Ruler(document.querySelector('#ruler') as HTMLElement);

display.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / cellSize);
    const y = Math.floor(e.offsetY / cellSize);
    scope.addPoint(Math.floor(Math.random() * maxValue), x, y);

    recalc();
    redraw();
});

addButton.addEventListener('click', () => {
    addTenPoints();
    recalc();
    redraw();
});

clearButton.addEventListener('click', () => {
    scope.clear();
    recalc();
    redraw();
});

radiusSlider.addEventListener('input', () => {
    radius = Number(radiusSlider.value);
    radiusIndicator.innerText = radius.toFixed(2);

    recalc();
    redraw();
});

cutoffSlider.addEventListener('input', () => {
    drawOptions.cutoff = Number(cutoffSlider.value);
    cutoffIndicator.innerText = String(Math.round(drawOptions.cutoff));

    redraw();
});

numbersCheckbox.addEventListener('input', () => {
    drawOptions.showNumbers = numbersCheckbox.checked;
    redraw();
});

pointsCheckbox.addEventListener('input', () => {
    drawOptions.highlightDataPoints = pointsCheckbox.checked;
    redraw();
});

colorSelect.addEventListener('input', () => {
    drawOptions.fillType = colorSelect.value as FillType;
    redraw();
});

typeSelect.addEventListener('input', () => {
    heatmapType = typeSelect.value as HeatmapType;
    recalc();
    redraw();
});

addTenPoints();
recalc();
redraw();

function addTenPoints() {
    for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * cellCountX);
        const y = Math.floor(Math.random() * cellCountY);
        const value = Math.floor(Math.random() * maxValue);

        scope.addPoint(value, x, y);
    }
}

function recalc() {
    scope.calculateValues(radius, heatmapType);
}

function redraw() {
    scope.draw(drawOptions);
    ruler.draw(drawOptions, scope.getMaxValue());
}
