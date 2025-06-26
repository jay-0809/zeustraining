import { Grid } from "./grid/grid.js";  
import { generateData } from "./data.js";

const wrapper = document.getElementById("wrapper-div");

// Controls how many cells per canvas
const rowsPerCanvas = 28;
const colsPerCanvas = 30;

// Max row & col limits
const maxRows = 100;
const maxCols = 50;

// Generate dataset for the grid
const myData = generateData(100000);

// Initializing grid
const grid = new Grid(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);

// Custom scroll setup
const verticalScrollbar = document.getElementById("vertical-scrollbar");
const horizontalScrollbar = document.getElementById("horizontal-scrollbar");

function syncScrollbars() {
    const wrapperDiv = document.getElementById("wrapper-div");

    const maxScrollTop = wrapperDiv.scrollHeight - wrapperDiv.clientHeight;
    const maxScrollLeft = wrapperDiv.scrollWidth - wrapperDiv.clientWidth;

    // Update scrollbar position
    verticalScrollbar.style.height = `${(wrapperDiv.clientHeight / wrapperDiv.scrollHeight) * 100}%`;
    horizontalScrollbar.style.width = `${(wrapperDiv.clientWidth / wrapperDiv.scrollWidth) * 100}%`;

    // Sync custom scrollbar with content scroll
    verticalScrollbar.style.top = `${(wrapperDiv.scrollTop / maxScrollTop) * 100}%`;
    horizontalScrollbar.style.left = `${(wrapperDiv.scrollLeft / maxScrollLeft) * 100}%`;
}

// Adjust scroll when custom scrollbar is dragged
verticalScrollbar.addEventListener("mousedown", (e) => {
    const initialY = e.clientY;
    const initialScrollTop = wrapper.scrollTop;

    const onMouseMove = (moveEvent) => {
        const deltaY = moveEvent.clientY - initialY;
        const scrollRatio = deltaY / verticalScrollbar.offsetHeight;
        wrapper.scrollTop = initialScrollTop + scrollRatio * wrapper.scrollHeight;
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Similarly, handle horizontal scrollbar dragging
horizontalScrollbar.addEventListener("mousedown", (e) => {
    const initialX = e.clientX;
    const initialScrollLeft = wrapper.scrollLeft;

    const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - initialX;
        const scrollRatio = deltaX / horizontalScrollbar.offsetWidth;
        wrapper.scrollLeft = initialScrollLeft + scrollRatio * wrapper.scrollWidth;
    };

    const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

wrapper.addEventListener("scroll", syncScrollbars);
