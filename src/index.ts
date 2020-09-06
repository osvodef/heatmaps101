import { Scope } from './scope';
import { DrawOptions } from './types';

const drawOptions: DrawOptions = {
    showNumbers: true,
    highlightDataPoints: true,
    fillType: 'none',
    cutoff: 100,
};

let radius = 0;

const addOneButton = document.querySelector('.button.one') as HTMLDivElement;
const addTenButton = document.querySelector('.button.ten') as HTMLDivElement;
const clearButton = document.querySelector('.button.clear') as HTMLDivElement;
const radiusSlider = document.querySelector('#radius-slider') as HTMLInputElement;
const cutoffSlider = document.querySelector('#cutoff-slider') as HTMLInputElement;
const radiusIndicator = document.querySelector('#radius-indicator') as HTMLSpanElement;
const cutoffIndicator = document.querySelector('#cutoff-indicator') as HTMLSpanElement;
const scope = new Scope(document.querySelector('#display') as HTMLElement);

addOneButton.addEventListener('click', () => {
    scope.addRandomPoint();

    calcAndDraw();
});

addTenButton.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
        scope.addRandomPoint();
    }

    calcAndDraw();
});

clearButton.addEventListener('click', () => {
    scope.clear();
    calcAndDraw();
});

radiusSlider.addEventListener('input', () => {
    radius = Number(radiusSlider.value);
    radiusIndicator.innerText = radius.toFixed(2);

    calcAndDraw();
});

cutoffSlider.addEventListener('input', () => {
    drawOptions.cutoff = Number(cutoffSlider.value);
    cutoffIndicator.innerText = String(Math.round(drawOptions.cutoff));

    scope.draw(drawOptions);
});

calcAndDraw();

function calcAndDraw() {
    scope.calculateValues(radius);
    scope.draw(drawOptions);
}
