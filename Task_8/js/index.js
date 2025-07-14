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

document.querySelector('.scroll-thumb-horizontal').addEventListener('mousedown', startHorizontalDrag);
document.querySelector('.scroll-thumb-vertical').addEventListener('mousedown', startVerticalDrag);
const maxScrollY = maxRows * cellHeight - window.innerHeight;
const maxScrollX = maxCols * cellWidth - window.innerWidth;
function startHorizontalDrag(e) {
    const startX = e.clientX;
    const initialScrollX = scrollX;
    document.onmousemove = (ev) => {
        scrollX = Math.min(Math.max(0, initialScrollX + (ev.clientX - startX)), maxScrollX); 
        updateScroll();
    };
    document.onmouseup = () => document.onmousemove = null;
}

function startVerticalDrag(e) {
    const startY = e.clientY;
    const initialScrollY = scrollY;
    document.onmousemove = (ev) => {
        scrollY = Math.min(Math.max(0, initialScrollY + (ev.clientY - startY)) * 5, maxScrollY);
        updateScroll();
    };
    document.onmouseup = () => document.onmousemove = null;
}

// Add a mouse wheel listener for vertical custom scroll only
document.addEventListener("wheel", (e) => {
    // Scroll vertically with mouse wheel
    scrollY = Math.min(Math.max(0, scrollY + e.deltaY), maxScrollY); // or clamp if needed with max height

    updateScroll(); // Update the grid view
    e.preventDefault(); // Prevent default page scroll
});

const pointerHandler = new PointerHandler(grid);
function updateScroll() {
    // Adjust the position of the thumb based on scroll position
    document.querySelector('.scroll-thumb-horizontal').style.left = `${(scrollX / document.body.scrollWidth) * 100}%`;
    document.querySelector('.scroll-thumb-vertical').style.top = `${(scrollY / document.body.scrollHeight) * 10}%`;

    // Trigger custom grid render update
    pointerHandler.handleCustomScroll(scrollX, scrollY);
}