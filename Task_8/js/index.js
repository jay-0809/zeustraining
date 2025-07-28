import { Grid } from "./grid/grid.js";
import { generateData } from "./data.js";
import { PointerHandler } from "./grid/pointerHandler.js";

const wrapper = document.getElementById("wrapper-div");
const cellNum = document.querySelector(".cellNum");
const cellValue = document.querySelector(".cellValue");
const addColumn = document.querySelector(".addNewColumn");
const addRow = document.querySelector(".addNewRow");
const ArithmaticOps = document.getElementById("values");

// Controls how many cells per canvas
const rowsPerCanvas = 50;
const colsPerCanvas = 26;

const cellWidth = 80;
const cellHeight = 25;

// Max row & col limits
const maxRows = 100000;
const maxCols = 500;

export const colWidths = Array(maxCols).fill(cellWidth);
export const rowHeights = Array(maxRows).fill(cellHeight);

// Generate dataset for the grid
const myData = generateData(100000);

// Initializing grid
const grid = new Grid(wrapper, cellNum, cellValue, addColumn, addRow, ArithmaticOps, rowsPerCanvas, colsPerCanvas, colWidths, rowHeights, maxRows, maxCols, myData);

const pointerHandler = new PointerHandler(grid);

addColumn.addEventListener("click", () => {
    pointerHandler.addColumnAfterSelection();
});

addRow.addEventListener("click", () => {
    pointerHandler.addRowAfterSelection();
});

// console.log("scrollX: ",scrollX, "scrollY:", scrollY);
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

let isMiddleScrolling = false;
let scrollOrigin = { x: 0, y: 0 };
let scrollInterval = null;

document.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
        e.preventDefault(); // disable default middle-click scroll

        // Start middle mouse scrolling
        isMiddleScrolling = true;
        scrollOrigin = { x: e.clientX, y: e.clientY };

        setScrollCursor(true);

        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            if (!isMiddleScrolling) return;

            const dx = currentMouse.x - scrollOrigin.x;
            const dy = currentMouse.y - scrollOrigin.y;

            // Speed factor (tweak this for faster/slower scroll)
            const speed = 0.2;

            grid.scrollX = clamp(grid.scrollX + dx * speed, 0, maxScrollX);
            grid.scrollY = clamp(grid.scrollY + dy * speed, 0, maxScrollY);
            updateScroll();
        }, 16); // ~60fps
    }
});

let currentMouse = { x: 0, y: 0 };
document.addEventListener("mousemove", (e) => {
    currentMouse = { x: e.clientX, y: e.clientY };
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 1 && isMiddleScrolling) {
        isMiddleScrolling = false;
        clearInterval(scrollInterval);
        // document.body.style.cursor = "default";
        setScrollCursor(false);
    }
});


function startDrag(e, axis) {
    const isHorizontal = axis === 'x';
    const thumb = isHorizontal ? thumbH : thumbV;
    const wrapperSize = isHorizontal ? wrapper.clientWidth : wrapper.clientHeight;
    const contentSize = isHorizontal ? maxCols * cellWidth : maxRows * cellHeight;
    const scrollSize = isHorizontal ? maxScrollX : maxScrollY;

    const startPos = isHorizontal ? e.clientX : e.clientY;
    const thumbStart = parseFloat(thumb.style[isHorizontal ? 'left' : 'top']) || 0;

    function onMove(ev) {
        const delta = (isHorizontal ? ev.clientX : ev.clientY) - startPos;
        const thumbDeltaPct = (delta / wrapperSize) * 100;
        const newPct = clamp(thumbStart + thumbDeltaPct, 0, 100);
        const newScroll = (newPct / 100) * scrollSize;

        if (isHorizontal) {
            grid.scrollX = newScroll;
        } else {
            grid.scrollY = newScroll;
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
    // console.log("scrollX: ",scrollX, "scrollY:", scrollY);
    if (e.ctrlKey) {
        grid.scrollX = clamp(grid.scrollX + e.deltaY, 0, maxScrollX);
    } else {
        grid.scrollY = clamp(grid.scrollY + e.deltaY, 0, maxScrollY);
    }
    updateScroll();
    e.preventDefault(); // prevent browser default zoom
}

function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

function updateScroll() {
    const xPct = maxScrollX ? (grid.scrollX / maxScrollX) * 100 : 0;
    const yPct = maxScrollY ? (grid.scrollY / maxScrollY) * 100 : 0;

    thumbH.style.left = `${xPct}%`;
    thumbV.style.top = `${yPct}%`;

    pointerHandler.handleCustomScroll(grid.scrollX, grid.scrollY);
}


function updateThumbSizes() {
    const horizontalThumbRatio = wrapper.clientWidth / (maxCols * cellWidth);
    const verticalThumbRatio = wrapper.clientHeight / (maxRows * cellHeight);

    thumbH.style.width = `${Math.max(horizontalThumbRatio * 100, 10)}%`;
    thumbV.style.height = `${Math.max(verticalThumbRatio * 100, 10)}%`;
}

window.addEventListener('resize', updateThumbSizes);
updateThumbSizes(); // Call once on init

let previousCursor = document.body.style.cursor;

function setScrollCursor(active) {
    const canvases = wrapper.querySelectorAll(".canvas-div");

    if (active) {
        previousCursor = document.body.style.cursor;
        document.body.style.cursor = "move";
        canvases.forEach(c => c.style.cursor = "move");
    } else {
        document.body.style.cursor = previousCursor || "default";
        canvases.forEach(c => c.style.cursor = previousCursor || "cell");
    }
}


window.colWidths = colWidths;
window.rowHeights = rowHeights;