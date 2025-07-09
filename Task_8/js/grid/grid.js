import { Canvas } from './canvas.js';
import { handleSelectionClick } from './modulers.js';
import { topDiv, HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js';
import { PointerHandler } from './pointerHandler.js';
import { GridResizeHandler } from './resize.js';
import { CellSelector } from './selection.js';


/**
 * Grid class for rendering canvases.
 * It handles the rendering and removing canvases, loading data.
 */
export class Grid {
    /**
     * Initializes the Grid object.
     * @param {HTMLElement} wrapper Wrapper element to hold the grid.
     * @param {HTMLElement} cellNum cellNum element to hold the cell number(column row).
     * @param {HTMLElement} cellValue cellValue element to hold cell value.
     * @param {number} rowsPerCanvas The number of rows per canvas.
     * @param {number} colsPerCanvas The number of columns per canvas.
     * @param {number} maxRows The maximum number of rows in the grid.
     * @param {number} maxCols The maximum number of columns in the grid.
     * @param {Array} dataset The dataset that contains the values for the grid.
     */
    constructor(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, cellWidth, cellHeight, maxRows, maxCols, dataset) {
        /** @type {HTMLElement} Wrapper element to hold the grid */
        this.wrapper = wrapper;
        /** @type {HTMLElement} cellNum element to hold the cell number(column row) */
        this.cellNum = cellNum;
        /** @type {HTMLElement} cellValue element to hold cell value */
        this.cellValue = cellValue;
        /** @type {number} The number of rows per canvas */
        this.rowsPerCanvas = rowsPerCanvas;
        /** @type {number} The number of columns per canvas */
        this.colsPerCanvas = colsPerCanvas;
        /** @type {number} The maximum number of rows in the grid */
        this.maxRows = maxRows;
        /** @type {number} The maximum number of columns in the grid */
        this.maxCols = maxCols;
        /** @type {Array} The dataset that contains the values for the grid*/
        this.dataset = dataset || new Map();
        /** @type {Object} An object holding all the canvas instances */
        this.canvases = {};
        /** @type {Object} An object Initialize horizontal and vertical header canvases */
        this.hCanvases = {};
        this.vCanvases = {};

        this.multiSelect = {};
        this.multiCursor = {};
        this.multiEditing = false;

        this.colWidths = Array(maxCols).fill(cellWidth);
        this.rowHeights = Array(maxRows).fill(cellHeight);

        this.dpr = window.devicePixelRatio || 1;

        topDiv(this);

        this.renderHeaders();
        this.renderCanvases();
        
        // scroll, click, keyDown - All EventListeners        
        this.cellSelector = new CellSelector(this);
        this.resizeHandler  = new GridResizeHandler(this);
        this.pointer = new PointerHandler(this);
        // console.log(this.pointer);
        
        this.pointer.registerHandlers();
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
        const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.colWidths[0]));
        const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.colWidths[0]));
        const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.rowHeights[0]));
        const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.rowHeights[0]));

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
    renderHeaders(globalCol = 1, globalRow = 1) {
        const visible = this.getCanvasCoords();
        const visibleSet = new Set(visible);
        // set header cellNum
        let index = globalCol === 0 ? 1 : globalCol, label = "";
        while (index > 0) {
            label = String.fromCharCode(((index - 1) % 26) + 65) + label;
            index = Math.floor((index - 1) / 26);
        }
        this.cellNum.value = `${label}${globalRow === 0 ? 1 : globalRow}`;

        // get cell value from Map
        let cellData = "";
        const rowMap = this.multiEditing ? this.dataset.get(globalRow - 1) : this.dataset.get(globalRow - 1);
        if (rowMap instanceof Map) {
            const value = this.multiEditing ? rowMap.get(globalCol - 1) : rowMap.get(globalCol - 1);
            if (value !== undefined) {
                cellData = value;
            }
        }
        this.cellValue.value = cellData;

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
                this.hCanvases[key] = new HorizontalCanvas(this, key[0], key[1], globalCol, globalRow);
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
                this.vCanvases[key] = new VerticalCanvas(this, key[0], key[1], globalCol, globalRow);
            }
        });
    }
    /**
     * Renders the visible canvases based on Coordinates.
     * It will remove non-visible canvases and create new ones for the visible areas.
     */
    renderCanvases(globalCol = 0, globalRow = 0) {
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
                this.canvases[key] = new Canvas(this, key[0], key[1], globalCol, globalRow);
            }
            
            if (this.pointer?.cellSelector?.cellRange?.isValid() && this.pointer?.cellSelector?.dragged) {
                // console.log(this.cellSelector?.cellRange?.isValid() && this.cellSelector?.dragged);
                this.canvases[key].drawMultiSelection(this.pointer?.cellSelector.cellRange);
            } 
            // else {
            //     this.canvases[key].drawSelection(this.pointer?.cellSelector.cellRange);
            // }
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