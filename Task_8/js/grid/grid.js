// import { Canvas } from './canvas.js';
// // import { Row } from "../row.js";
// // import { Column } from "../column.js";
// import { handleSelectionClick } from './modulers.js';
// import { topDiv, horizontalCanvas, verticalCanvas } from './headerCanvas.js';

// /**
//  * Grid class for rendering canvases.
//  * It handles the rendering and removing canvases, loading data.
//  */
// export class Grid {
//     /**
//      * Initializes the Grid object.
//      * @param {HTMLElement} wrapper Wrapper element to hold the grid.
//      * @param {number} rowsPerCanvas The number of rows per canvas.
//      * @param {number} colsPerCanvas The number of columns per canvas.
//      * @param {number} maxRows The maximum number of rows in the grid.
//      * @param {number} maxCols The maximum number of columns in the grid.
//      * @param {Array} dataset The dataset that contains the values for the grid.
//      */
//     constructor(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
//         /** @type {HTMLElement} Wrapper element to hold the grid */
//         this.wrapper = wrapper;
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

//         this.selection = {};

//         topDiv(this);
//         this.hCanvas = horizontalCanvas(this);
//         this.vCanvas = verticalCanvas(this);
//         this.wrapper.appendChild(this.hCanvas);
//         this.wrapper.appendChild(this.vCanvas);

//         window.addEventListener('scroll', () => {
//             this.renderCanvases();
//             this.updateHeaders();
//         });
//         window.addEventListener('click', (e) => handleSelectionClick.call(this, e));

//         this.renderCanvases();
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
//                 // Ensure the coordinates are within the grid limits
//                 if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
//                     coords.push([x, y]);
//                 }
//             }
//         }
//         return coords;
//     }

//     /**
//      * Renders the visible canvases based on Coordinates.
//      * It will remove non-visible canvases and create new ones for the visible areas.
//      */
//     renderCanvases() {
//         const visible = this.getCanvasCoords(); // Get the coordinates
//         const visibleSet = new Set(visible);

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
//                 this.canvases[key] = new Canvas(this, key[0], key[1]);
//             }
//         });
//     }

//     updateHeaders() {
//         const sx = window.scrollX;
//         const sy = window.scrollY;
//         this.hCanvas.style.transform = `translateX(${-sx}px)`;
//         this.vCanvas.style.transform = `translateY(${-sy}px)`;
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
import { HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js'; 
import { handleSelectionClick } from './modulers.js';

/**
 * Grid class for rendering canvases.
 * It handles the rendering and removing canvases, loading data.
 */
export class Grid {
    constructor(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
        this.wrapper = wrapper;
        this.rowsPerCanvas = rowsPerCanvas;
        this.colsPerCanvas = colsPerCanvas;
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.dataset = dataset || [];
        this.cellWidth = 80;
        this.cellHeight = 25;
        this.canvases = {};
        // topDiv(this);
        // Initialize horizontal and vertical header canvases
        this.hCanvas = new HorizontalCanvas(this);
        this.vCanvas = new VerticalCanvas(this);

        window.addEventListener('scroll', () => {
            this.renderCanvases();
        });

        window.addEventListener('click', (e) => handleSelectionClick.call(this, e));

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

    renderCanvases() {
        const visible = this.getCanvasCoords();
        const visibleSet = new Set(visible);

        // Handle horizontal canvas visibility based on scroll position
        if (!this.hCanvas.canvas.parentNode) {
            const scrollY = window.scrollY;
            const headerVisible = scrollY < this.cellHeight; 

            if (headerVisible) {
                this.wrapper.appendChild(this.hCanvas.canvas);
                this.hCanvas.createHCanvas();
            } else {
                this.hCanvas.removeCanvas();
            }
        }

        // Handle vertical canvas visibility based on scroll position
        if (!this.vCanvas.canvas.parentNode) {
            const scrollX = window.scrollX;
            const headerVisible = scrollX < this.cellWidth;

            if (headerVisible) {
                this.wrapper.appendChild(this.vCanvas.canvas);
                this.vCanvas.createVCanvas();
            } else {
                this.vCanvas.removeCanvas();
            }
        }

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



// import { Canvas } from './canvas.js';
// import { HorizontalCanvas, VerticalCanvas } from './HeaderCanvases.js'; 
// import { handleSelectionClick } from './modulers.js';

// /**
//  * Grid class for rendering canvases.
//  * It handles the rendering and removing canvases, loading data.
//  */
// export class Grid {
//     constructor(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
//         this.wrapper = wrapper;
//         this.rowsPerCanvas = rowsPerCanvas;
//         this.colsPerCanvas = colsPerCanvas;
//         this.maxRows = maxRows;
//         this.maxCols = maxCols;
//         this.dataset = dataset || [];
//         this.cellWidth = 80;
//         this.cellHeight = 25;
//         this.canvases = {};

//         // Initialize horizontal and vertical header canvases
//         this.hCanvases = [];
//         this.vCanvases = [];

//         window.addEventListener('scroll', () => {
//             this.renderCanvases();
//         });

//         window.addEventListener('click', (e) => handleSelectionClick.call(this, e));

//         this.renderCanvases();
//     }

//     // Calculate which canvas coordinates are in view based on scroll position
//     getCanvasCoords() {
//         const scrollX = window.scrollX;
//         const scrollY = window.scrollY;
//         const vw = window.innerWidth;
//         const vh = window.innerHeight;

//         const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.cellWidth));
//         const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.cellWidth));
//         const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.cellHeight));
//         const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.cellHeight));

//         const coords = [];

//         for (let y = startRow; y <= endRow; y++) {
//             for (let x = startCol; x <= endCol; x++) {
//                 if (y * this.rowsPerCanvas < this.maxRows && x * this.colsPerCanvas < this.maxCols) {
//                     coords.push([x, y]);
//                 }
//             }
//         }
//         return coords;
//     }

//     renderCanvases() {
//         const visible = this.getCanvasCoords();
//         const visibleSet = new Set(visible.map(([x, y]) => `${x},${y}`));

//         // Handle horizontal header canvases visibility based on scroll position
//         this.renderHeaderCanvases('horizontal', visibleSet);

//         // Handle vertical header canvases visibility based on scroll position
//         this.renderHeaderCanvases('vertical', visibleSet);

//         // Remove non-visible grid canvases
//         Object.keys(this.canvases).forEach((key) => {
//             if (!visibleSet.has(key)) {
//                 this.canvases[key].removeCanvas();
//                 delete this.canvases[key];
//             }
//         });

//         // Render visible grid canvases
//         visible.forEach(([x, y]) => {
//             const key = `${x},${y}`;
//             if (!this.canvases[key]) {
//                 this.canvases[key] = new Canvas(this, x, y);
//             }
//         });        
//     }

//     renderHeaderCanvases(type, visibleSet) {
//         const canvases = type === 'horizontal' ? this.hCanvases : this.vCanvases;
//         const canvasClass = type === 'horizontal' ? HorizontalCanvas : VerticalCanvas;
//         const cellSize = type === 'horizontal' ? this.cellHeight : this.cellWidth;
//         const isHeaderVisible = type === 'horizontal' ? window.scrollY < this.cellHeight : window.scrollX < this.cellWidth;
        
//         const rangeStart = Math.floor(window[type === 'horizontal' ? 'scrollY' : 'scrollX'] / (cellSize * (type === 'horizontal' ? this.colsPerCanvas : this.rowsPerCanvas)));
//         const rangeEnd = Math.floor((window[type === 'horizontal' ? 'scrollY' : 'scrollX'] + window.innerHeight) / (cellSize * (type === 'horizontal' ? this.colsPerCanvas : this.rowsPerCanvas)));

//         if (!isHeaderVisible) {
//             // Remove all canvases if header is out of view
//             canvases.forEach(canvas => canvas.removeCanvas());
//             canvases.length = 0;
//             return;
//         }

//         // Remove canvases that are out of the new range
//         canvases.forEach((canvas, i) => {
//             if (canvas.index < rangeStart || canvas.index > rangeEnd) {
//                 canvas.removeCanvas();
//                 canvases.splice(i, 1);
//             }
//         });

//         // Add new canvases if needed
//         for (let i = rangeStart; i <= rangeEnd; i++) {
//             if (!canvases.some(canvas => canvas.index === i)) {
//                 const newCanvas = new canvasClass(this, i);
//                 newCanvas.index = i;
//                 canvases.push(newCanvas);
//             }
//         }
//     }

//     loadData(dataset) {
//         this.dataset = dataset;
//         this.renderCanvases();
//     }

//     invalidCanvas([x, y]) {
//         const key = `${x},${y}`;
//         if (this.canvases[key]) {
//             this.canvases[key].removeCanvas();
//             this.canvases[key] = new Canvas(this, x, y);
//         }
//     }
// }