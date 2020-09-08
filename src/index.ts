import { Scope } from './scope';
import { Ruler } from './ruler';
import { DrawOptions, FillType } from './types';

const drawOptions: DrawOptions = {
    showNumbers: true,
    highlightDataPoints: true,
    fillType: 'none',
    cutoff: 100,
};

let radius = 0;

const addButton = document.querySelector('.button.add') as HTMLDivElement;
const clearButton = document.querySelector('.button.clear') as HTMLDivElement;
const radiusSlider = document.querySelector('#radius-slider') as HTMLInputElement;
const cutoffSlider = document.querySelector('#cutoff-slider') as HTMLInputElement;
const radiusIndicator = document.querySelector('#radius-indicator') as HTMLSpanElement;
const cutoffIndicator = document.querySelector('#cutoff-indicator') as HTMLSpanElement;
const numbersCheckbox = document.querySelector('.checkbox.numbers') as HTMLInputElement;
const pointsCheckbox = document.querySelector('.checkbox.points') as HTMLInputElement;
const colorSelect = document.querySelector('.select.color') as HTMLSelectElement;

const scope = new Scope(document.querySelector('#display') as HTMLElement);
const ruler = new Ruler(document.querySelector('#ruler') as HTMLElement);

addButton.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        scope.addRandomPoint();
    }

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

recalc();
redraw();

function recalc() {
    scope.calculateValues(radius);
}

function redraw() {
    scope.draw(drawOptions);
    ruler.draw(drawOptions, scope.getMaxValue());
}
