// import { Canvas } from './canvas.js';
// import { GridEventHandler } from './gridEventHandler.js';
// import { topDiv, HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js';
// // import { handleSelectionClick } from './modulers.js';

// /**
//  * Grid class for rendering canvases.
//  * It handles the rendering and removing canvases, loading data.
//  */
// export class Grid {
//     /**
//      * Initializes the Grid object.
//      * @param {HTMLElement} wrapper Wrapper element to hold the grid.
//      * @param {HTMLElement} cellNum cellNum element to hold the cell number(column row).
//      * @param {HTMLElement} cellValue cellValue element to hold cell value.
//      * @param {number} rowsPerCanvas The number of rows per canvas.
//      * @param {number} colsPerCanvas The number of columns per canvas.
//      * @param {number} maxRows The maximum number of rows in the grid.
//      * @param {number} maxCols The maximum number of columns in the grid.
//      * @param {Array} dataset The dataset that contains the values for the grid.
//      */
//     constructor(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
//         /** @type {HTMLElement} Wrapper element to hold the grid */
//         this.wrapper = wrapper;
//         /** @type {HTMLElement} cellNum element to hold the cell number(column row) */
//         this.cellNum = cellNum;
//         /** @type {HTMLElement} cellValue element to hold cell value */
//         this.cellValue = cellValue;
//         /** @type {number} The number of rows per canvas */
//         this.rowsPerCanvas = rowsPerCanvas;
//         /** @type {number} The number of columns per canvas */
//         this.colsPerCanvas = colsPerCanvas;
//         /** @type {number} The maximum number of rows in the grid */
//         this.maxRows = maxRows;
//         /** @type {number} The maximum number of columns in the grid */
//         this.maxCols = maxCols;
//         /** @type {Array} The dataset that contains the values for the grid*/
//         this.dataset = dataset || [];
//         /** @type {number} Width of each grid cell */
//         this.cellWidth = 80;
//         /** @type {number} Height of each grid cell */
//         this.cellHeight = 25;
//         /** @type {Object} An object holding all the canvas instances */
//         this.canvases = {};

//         this.dpr = window.devicePixelRatio || 1;
//         // console.log("dpr", this.dpr);

//         topDiv(this);

//         // Initialize horizontal and vertical header canvases
//         this.hCanvases = {};
//         this.vCanvases = {};
//         // this.hCanvas = new HorizontalCanvas(this);
//         // this.vCanvas = new VerticalCanvas(this);

//         // scroll, click, keyDown - All EventListeners
//         this.GridEventHandler = new GridEventHandler(this);
//         this.GridEventHandler.eventLisners();

//         this.renderHeaders();
//         this.renderCanvases();
//         // this.wrapper.handleSelectionClick();
//     }

//     /**
//      * Gets the coordinates of the canvase based on the current scroll position.
//      * @returns {Array} An array of canvas coordinates [x, y].
//      */
//     getCanvasCoords() {
//         const scrollX = window.scrollX;   // Current horizontal scroll position
//         const scrollY = window.scrollY;   // Current vertical scroll position
//         const vw = window.innerWidth;     // Viewport width
//         const vh = window.innerHeight;    // Viewport height

//         // Calculate the starting and ending columns and rows that are visible
//         const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.cellWidth));
//         const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.cellWidth));
//         const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.cellHeight));
//         const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.cellHeight));

//         const coords = [];
//         // Loop through the rows and columns and store the visible coordinates
//         for (let y = startRow; y <= endRow; y++) {
//             for (let x = startCol; x <= endCol; x++) {
//                 if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
//                     coords.push([x, y]);
//                 }
//             }
//         }
//         return coords;
//     }

//     /**
//      * Renders the visible headers based on Coordinates.
//      */
//     renderHeaders(globalCol = 1, globalRow = 1) {
//         const visible = this.getCanvasCoords();
//         const visibleSet = new Set(visible);

//         // set header cellNum
//         let index = globalCol === 0 ? 1 : globalCol, label = "";
//         while (index > 0) {
//             label = String.fromCharCode(((index - 1) % 26) + 65) + label;
//             index = Math.floor((index - 1) / 26);
//         }
//         this.cellNum.value = `${label}${globalRow === 0 ? 1 : globalRow}`;

//         // set header cellValue
//         const row = this.dataset[globalRow-1];
//         let cellData = "";
//         // Check if the Row and Cell exist, then fetch the cell value
//         if (row && typeof row.getCell === "function") {
//             const cell = row.getCell(globalCol-1);
//             if (cell && typeof cell.getValue === "function") {
//                 cellData = cell.getValue();
//             }
//         }
//         this.cellValue.value = cellData;

//         // Remove non-visible horizontal canvas
//         for (let key in this.hCanvases) {
//             if (!visibleSet.has(key)) {
//                 this.hCanvases[key].removeCanvas();
//                 delete this.hCanvases[key];
//             }
//         }

//         // Render visible horizontal canvas
//         visible.forEach(key => {
//             if (!this.hCanvases[key]) {
//                 this.hCanvases[key] = new HorizontalCanvas(this, key[0], key[1], globalCol, globalRow);
//             }
//         });

//         // Remove non-visible vertical canvas
//         for (let key in this.vCanvases) {
//             if (!visibleSet.has(key)) {
//                 this.vCanvases[key].removeCanvas();
//                 delete this.vCanvases[key];
//             }
//         }

//         // Render visible vertical canvas
//         visible.forEach(key => {
//             if (!this.vCanvases[key]) {
//                 this.vCanvases[key] = new VerticalCanvas(this, key[0], key[1], globalCol, globalRow);
//             }
//         });
//     }

//     /**
//      * Renders the visible canvases based on Coordinates.
//      * It will remove non-visible canvases and create new ones for the visible areas.
//      */
//     renderCanvases(globalCol = 0, globalRow = 0) {
//         const visible = this.getCanvasCoords();
//         const visibleSet = new Set(visible);

//         // console.log(visible);


//         // Remove non-visible canvases
//         for (let key in this.canvases) {
//             if (!visibleSet.has(key)) {
//                 this.canvases[key].removeCanvas();
//                 delete this.canvases[key];
//             }
//         }

//         // Render visible canvases
//         visible.forEach(key => {
//             if (!this.canvases[key]) {
//                 this.canvases[key] = new Canvas(this, key[0], key[1], globalCol, globalRow);
//             }
//         });
//     }

//     loadData(dataset) {
//         this.dataset = dataset;
//         this.renderCanvases();
//     }

//     invalidCanvas([x, y]) {
//         const key = JSON.stringify([x, y]);
//         if (this.canvases[key]) {
//             this.canvases[key].removeCanvas();
//             this.canvases[key] = new Canvas(this, x, y);
//         }
//     }
// }

import { Canvas } from './canvas.js';
import { GridEventHandler } from './gridEventHandler.js';
import { topDiv, HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js';

/**
 * Grid class for rendering canvases and handling selection.
 */
export class Grid {
    constructor(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
        this.wrapper = wrapper;
        this.cellNum = cellNum;
        this.cellValue = cellValue;
        this.rowsPerCanvas = rowsPerCanvas;
        this.colsPerCanvas = colsPerCanvas;
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.dataset = dataset || [];

        this.cellWidth = 80;
        this.cellHeight = 25;
        this.canvases = {};
        this.hCanvases = {};
        this.vCanvases = {};

        this.selectedCols = new Set();
        this.selectedRows = new Set();

        this.dpr = window.devicePixelRatio || 1;

        topDiv(this);

        this.GridEventHandler = new GridEventHandler(this);
        this.GridEventHandler.eventListeners();

        this.renderHeaders();
        this.renderCanvases();
    }

    getCanvasCoords() {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.cellWidth));
        const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.cellWidth));
        const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.cellHeight));
        const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.cellHeight));

        const coords = [];
        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
                    coords.push([x, y]);
                }
            }
        }
        return coords;
    }

    renderHeaders(globalCol = 1, globalRow = 1) {
        const visible = this.getCanvasCoords();
        const visibleKeys = new Set(visible.map(c => JSON.stringify(c)));

        // Update header cellNum value (like "A1", "B2")
        let index = globalCol === 0 ? 1 : globalCol, label = "";
        while (index > 0) {
            label = String.fromCharCode(((index - 1) % 26) + 65) + label;
            index = Math.floor((index - 1) / 26);
        }
        this.cellNum.value = `${label}${globalRow === 0 ? 1 : globalRow}`;

        // Update header cellValue from dataset if available
        const row = this.dataset[globalRow - 1];
        let cellData = "";
        if (row && typeof row.getCell === "function") {
            const cell = row.getCell(globalCol - 1);
            if (cell && typeof cell.getValue === "function") {
                cellData = cell.getValue();
            }
        }
        this.cellValue.value = cellData;

        // Remove non-visible horizontal canvases
        for (let key in this.hCanvases) {
            if (!visibleKeys.has(key)) {
                this.hCanvases[key].removeCanvas();
                delete this.hCanvases[key];
            }
        }

        // Render visible horizontal canvases
        visible.forEach(key => {
            const keyStr = JSON.stringify(key);
            if (!this.hCanvases[keyStr]) {
                this.hCanvases[keyStr] = new HorizontalCanvas(this, key[0], key[1]);
            }
        });

        // Remove non-visible vertical canvases
        for (let key in this.vCanvases) {
            if (!visibleKeys.has(key)) {
                this.vCanvases[key].removeCanvas();
                delete this.vCanvases[key];
            }
        }

        // Render visible vertical canvases
        visible.forEach(key => {
            const keyStr = JSON.stringify(key);
            if (!this.vCanvases[keyStr]) {
                this.vCanvases[keyStr] = new VerticalCanvas(this, key[0], key[1]);
            }
        });
    }

    renderCanvases(globalCol = 0, globalRow = 0) {
        const visible = this.getCanvasCoords();
        const visibleKeys = new Set(visible.map(c => JSON.stringify(c)));

        // Remove non-visible canvases
        for (let key in this.canvases) {
            if (!visibleKeys.has(key)) {
                this.canvases[key].removeCanvas();
                delete this.canvases[key];
            }
        }

        // Render visible canvases
        visible.forEach(key => {
            const keyStr = JSON.stringify(key);
            if (!this.canvases[keyStr]) {
                this.canvases[keyStr] = new Canvas(this, key[0], key[1]);
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

    // New method to redraw all headers and canvases after selection changes
    redrawAll() {
        for (let key in this.hCanvases) {
            this.hCanvases[key].createHCanvas();
        }
        for (let key in this.vCanvases) {
            this.vCanvases[key].createVCanvas();
        }
        for (let key in this.canvases) {
            this.canvases[key].createCanvas();
        }
    }
}
