import { Canvas } from './canvas.js';
import {handleSelectionClick, handleInputClick, handleEditorBlur, initResize } from './modulers.js';
import { horizontalCanvas, verticalCanvas } from './headerCanvas.js';

export class Grid {
    /**
     * 
     * @param {*} wrapper 
     * @param {*} rowsPerCanvas 
     * @param {*} colsPerCanvas 
     * @param {*} maxRows 
     * @param {*} maxCols 
     * @param {*} dataset 
     */
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
        // console.log(this.canvases);

        // this.editor = document.querySelector(".cell-input");
        this.resizer = document.querySelector(".resizer");

        window.addEventListener("scroll", () => this.renderCanvases());
        window.addEventListener("click", (e) => handleSelectionClick.call(this, e));
        // window.addEventListener("dblclick", (e) => handleInputClick.call(this, e));
        // this.editor.addEventListener("blur", () => handleEditorBlur.call(this));
        window.addEventListener("blur", () => handleEditorBlur.call(this));

        this.isResizing = false;
        initResize.call(this);

        const horizontalHeader = horizontalCanvas(this);
        const verticalHeader = verticalCanvas(this);
        // console.log(horizontalHeader);
        // console.log(verticalHeader);

        this.renderCanvases();
    }

    /**
     * 
     * @returns 
     */
    getCanvasCoords() {
        // determine which canvases are in view
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
        // console.log("coords:", coords);
        return coords;
    }

    /**
     * 
     */
    renderCanvases() {
        // requestAnimationFrame(this.renderCanvases());
        const visible = this.getCanvasCoords();
        const visibleSet = new Set(visible);

        // Remove not visible canvases
        for (let key in this.canvases) {
            if (!visibleSet.has(key)) {
                this.canvases[key].removeCanvas();
                delete this.canvases[key];
            }
        }
        
        // Render visible canvases
        visible.forEach(key => {
            // console.log("key:",key,"canvases:", this.canvases);
            if (!this.canvases[key]) {
                // console.log(key[0] - 1, ":", key[1] - 1 , "<--", key[0], ":", key[1] - 1, "-->", key[0] + 1, ":", key[1] - 1);
                // console.log(key[0] - 1, ":", key[1], "<==", key[0], ":", key[1], "==>", key[0] + 1, ":", key[1]);
                // console.log(key[0] - 1, ":", key[1] + 1, "<--", key[0], ":", key[1] + 1, "-->", key[0] + 1, ":", key[1] + 1);
                this.canvases[key] = new Canvas(this, key[0], key[1]);
            }
        });
    }

    /**
     * 
     * @param {*} dataset 
     */
    loadData(dataset) {
        this.dataset = dataset;
        this.renderCanvases();
    }

    /**
     * 
     * @param {*} key 
     */
    invalidCanvas(key) {
        const canvas = this.canvases[key];
        if (canvas) {
            canvas.removeCanvas();
            delete this.canvases[key];
            this.canvases[key] = new Canvas(this, key[0], key[1]);
        }
    }
}