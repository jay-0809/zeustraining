import { Canvas } from './canvas.js';
// import { Row } from "../row.js";
// import { Column } from "../column.js";
import { handleSelectionClick } from './modulers.js';
import { topDiv, horizontalCanvas, verticalCanvas } from './headerCanvas.js';

/**
 * Grid class for rendering canvases.
 * It handles the rendering and removing canvases, loading data.
 */
export class Grid {
    /**
     * Initializes the Grid object.
     * @param {HTMLElement} wrapper Wrapper element to hold the grid.
     * @param {number} rowsPerCanvas The number of rows per canvas.
     * @param {number} colsPerCanvas The number of columns per canvas.
     * @param {number} maxRows The maximum number of rows in the grid.
     * @param {number} maxCols The maximum number of columns in the grid.
     * @param {Array} dataset The dataset that contains the values for the grid.
     */
    constructor(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
        /** @type {HTMLElement} Wrapper element to hold the grid */
        this.wrapper = wrapper;
        /** @type {number} The number of rows per canvas */
        this.rowsPerCanvas = rowsPerCanvas;
        /** @type {number} The number of columns per canvas */
        this.colsPerCanvas = colsPerCanvas;
        /** @type {number} The maximum number of rows in the grid */
        this.maxRows = maxRows;
        /** @type {number} The maximum number of columns in the grid */
        this.maxCols = maxCols;
        /** @type {Array} The dataset that contains the values for the grid*/
        this.dataset = dataset || [];
        /** @type {number} Width of each grid cell */
        this.cellWidth = 80;
        /** @type {number} Height of each grid cell */
        this.cellHeight = 25;
        /** @type {Object} An object holding all the canvas instances */
        this.canvases = {};

        topDiv(this);
        this.hCanvas = horizontalCanvas(this);
        this.vCanvas = verticalCanvas(this);
        this.wrapper.appendChild(this.hCanvas);
        this.wrapper.appendChild(this.vCanvas);

        window.addEventListener('scroll', () => {
            this.renderCanvases();
            this.updateHeaders();
        });
        window.addEventListener('click', (e) => handleSelectionClick.call(this, e));

        this.renderCanvases();
    }

    /**
     * Gets the coordinates of the canvase based on the current scroll position.
     * @returns {Array} An array of canvas coordinates [x, y].
     */
    getCanvasCoords() {
        const scrollX = window.scrollX;   // Current horizontal scroll position
        const scrollY = window.scrollY;   // Current vertical scroll position
        const vw = window.innerWidth;     // Viewport width
        const vh = window.innerHeight;    // Viewport height

        // Calculate the starting and ending columns and rows that are visible
        const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.cellWidth));
        const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.cellWidth));
        const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.cellHeight));
        const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.cellHeight));

        const coords = [];

        // Loop through the rows and columns and store the visible coordinates
        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                // Ensure the coordinates are within the grid limits
                if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
                    coords.push([x, y]);
                }
            }
        }
        return coords;
    }

    /**
     * Renders the visible canvases based on Coordinates.
     * It will remove non-visible canvases and create new ones for the visible areas.
     */
    renderCanvases() {
        const visible = this.getCanvasCoords(); // Get the coordinates
        const visibleSet = new Set(visible);

        // Remove non-visible canvases
        for (let key in this.canvases) {
            if (!visibleSet.has(key)) {
                this.canvases[key].removeCanvas();
                delete this.canvases[key];
            }
        }

        // Render visible canvases
        visible.forEach(key => {
            if (!this.canvases[key]) {
                this.canvases[key] = new Canvas(this, key[0], key[1]);
            }
        });
    }

    updateHeaders() {
        const sx = window.scrollX;
        const sy = window.scrollY;
        this.hCanvas.style.transform = `translateX(${-sx}px)`;
        this.vCanvas.style.transform = `translateY(${-sy}px)`;
    }

    loadData(dataset) {
        this.dataset = dataset;
        this.renderCanvases();
    }

    invalidCanvas([x, y]) {
        const key = JSON.stringify([x, y]);
        if (this.canvases[key]) {
            this.canvases[key].removeCanvas();
            this.canvases[key] = new Canvas(this, x, y);
        }
    }
}
