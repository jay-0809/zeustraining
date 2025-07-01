import { Canvas } from './canvas.js';
import { GridEventHandler } from './gridEventHandler.js';
import { topDiv, HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js';
// import { handleSelectionClick } from './modulers.js';

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

        this.dpr = window.devicePixelRatio || 1;
        // console.log("dpr", this.dpr);

        topDiv(this);

        // Initialize horizontal and vertical header canvases
        this.hCanvases = {};
        this.vCanvases = {};
        // this.hCanvas = new HorizontalCanvas(this);
        // this.vCanvas = new VerticalCanvas(this);

        // scroll, click, keyDown - All EventListeners
        this.GridEventHandler = new GridEventHandler(this);
        this.GridEventHandler.eventLisners();

        this.renderHeaders();
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
                if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
                    coords.push([x, y]);
                }
            }
        }
        return coords;
    }
    /**
     * Renders the visible headers based on Coordinates.
     */
    renderHeaders() {
        const visible = this.getCanvasCoords();
        const visibleSet = new Set(visible);

        // Remove non-visible horizontal canvas
        for (let key in this.hCanvases) {
            if (!visibleSet.has(key)) {
                this.hCanvases[key].removeCanvas();
                delete this.hCanvases[key];
            }
        }

        // Render visible horizontal canvas
        visible.forEach(key => {
            if (!this.hCanvases[key]) {
                this.hCanvases[key] = new HorizontalCanvas(this, key[0], key[1]);
            }
        });

        // Remove non-visible vertical canvas
        for (let key in this.vCanvases) {
            if (!visibleSet.has(key)) {
                this.vCanvases[key].removeCanvas();
                delete this.vCanvases[key];
            }
        }

        // Render visible vertical canvas
        visible.forEach(key => {
            if (!this.vCanvases[key]) {
                this.vCanvases[key] = new VerticalCanvas(this, key[0], key[1]);
            }
        });
    }
    /**
     * Renders headers when selection active for header color change.
     */
    renderUpdatedHeaders(globalCol, globalRow) {
        const visible = this.getCanvasCoords();
        const visibleSet = new Set(visible);        

        // Remove non-visible horizontal canvas
        for (let key in this.hCanvases) {
            if (!visibleSet.has(key)) {
                this.hCanvases[key].removeCanvas();
                delete this.hCanvases[key];
            }
        }

        // Render visible horizontal canvas
        visible.forEach(key => {
            if (!this.hCanvases[key]) {
                this.hCanvases[key] = new HorizontalCanvas(this, key[0], key[1], globalCol);
            }
        });

        // Remove non-visible vertical canvas
        for (let key in this.vCanvases) {
            if (!visibleSet.has(key)) {
                this.vCanvases[key].removeCanvas();
                delete this.vCanvases[key];
            }
        }

        // Render visible vertical canvas
        visible.forEach(key => {
            if (!this.vCanvases[key]) {
                this.vCanvases[key] = new VerticalCanvas(this, key[0], key[1], globalRow);
            }
        });
    }
    /**
     * Renders the visible canvases based on Coordinates.
     * It will remove non-visible canvases and create new ones for the visible areas.
     */
    renderCanvases() {
        const visible = this.getCanvasCoords();
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