import { Grid } from "./grid/grid.js";
import { generateData } from "./data.js";
import { PointerHandler } from "./grid/pointerHandler.js";

const wrapper = document.getElementById("wrapper-div");
const cellNum = document.querySelector(".cellNum");
const cellValue = document.querySelector(".cellValue");

// Controls how many cells per canvas
const rowsPerCanvas = 50;
const colsPerCanvas = 26;

const cellWidth = 80;
const cellHeight = 25;

// Max row & col limits
const maxRows = 100000;
const maxCols = 500;

// Generate dataset for the grid
const myData = generateData(100000);

// Initializing grid
const grid = new Grid(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, cellWidth, cellHeight, maxRows, maxCols, myData);

let scrollX = 0;
let scrollY = 0;
const maxScrollY = maxRows * cellHeight - window.innerHeight;
const maxScrollX = maxCols * cellWidth - window.innerWidth;
const thumbH = document.querySelector('.scroll-thumb-horizontal');
const thumbV = document.querySelector('.scroll-thumb-vertical');

thumbH.addEventListener('pointerdown', e => {
    e.stopPropagation(); // prevent conflict with PointerHandler
    startDrag(e, 'x');
});
thumbV.addEventListener('pointerdown', e => {
    e.stopPropagation();
    startDrag(e, 'y');
});
wrapper.addEventListener('wheel', onWheel, { passive: false });

function startDrag(e, axis) {
    const start = axis === 'x' ? e.clientX : e.clientY;
    const init = axis === 'x' ? scrollX : scrollY;

    function onMove(ev) {
        const delta = (axis === 'x' ? ev.clientX - start : ev.clientY - start);
        if (axis === 'x') {
            scrollX = clamp(init + delta, 0, maxScrollX);
        } else {
            scrollY = clamp(init + delta, 0, maxScrollY);
        }
        updateScroll();
    }

    function onUp() {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
}

function onWheel(e) {
    if (e.ctrlKey) {
        scrollX = clamp(scrollX + e.deltaY, 0, maxScrollX);
    } else {
        scrollY = clamp(scrollY + e.deltaY, 0, maxScrollY);
    }
    updateScroll();
    e.preventDefault(); // prevent browser default zoom
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

const pointerHandler = new PointerHandler(grid);

function updateScroll() {
    const xPct = maxScrollX ? (scrollX / maxScrollX) * 100 : 0;
    const yPct = maxScrollY ? (scrollY / maxScrollY) * 100 : 0;
    thumbH.style.left = `${ xPct }%`;
    thumbV.style.top = `${ yPct }%`;
    pointerHandler.handleCustomScroll(scrollX, scrollY);
}