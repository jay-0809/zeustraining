import { GridResizeHandler } from './resize.js';
import { CellSelector } from './selection.js';

export class PointerHandler {
    constructor(grid) {
        this.grid = grid;
        this.cellSelector = new CellSelector(this);
        // console.log("grid.cellSelector", grid.cellSelector);
        this.resizeHandler = new GridResizeHandler(this);
        // console.log("grid.resizeHandler", grid.resizeHandler);

        this.hCanvas = document.querySelector(".h-canvas");
        this.vCanvas = document.querySelector(".v-canvas");

        this.activeMode = null; // 'select', 'resize-col', 'resize-row'
    }

    registerHandlers() {
        const wrap = this.grid.wrapper;
        wrap.addEventListener("pointerdown", this.onPointerDown.bind(this));
        wrap.addEventListener("pointermove", this.onPointerMove.bind(this));
        wrap.addEventListener("pointerup", this.onPointerUp.bind(this));
        window.addEventListener("scroll", this.onScroll.bind(this));
    }

    onScroll() {
        this.grid.renderHeaders(0,0);
        this.grid.renderCanvases();

        const cs = this.cellSelector;
        if (cs.cellRange.isValid() && cs.dragged) {
            const coords = this.grid.getCanvasCoords();
            coords.forEach(([x, y]) => {
                const key = JSON.stringify([x, y]);
                const canvas = this.grid.canvases[key];
                if (canvas) canvas.drawMultiSelection(cs.cellRange);
            });
        }
    }

    onPointerDown(e) {
        const { colEdge, rowEdge, colIndex, rowIndex } = this.resizeHandler.edge.bind(this)(e);

        if (colEdge) {
            this.activeMode = "resize-col";
            this.resizeHandler.resizingCol = colIndex;
            this.resizeHandler.startX = e.clientX;
            this.resizeHandler.startColWidth = this.grid.colWidths[colIndex];
            return;
        }

        if (rowEdge) {
            this.activeMode = "resize-row";
            this.resizeHandler.resizingRow = rowIndex;
            this.resizeHandler.startY = e.clientY;
            this.resizeHandler.startRowHeight = this.grid.rowHeights[rowIndex];
            return;
        }

        // If not resizing, start cell selection
        this.activeMode = "select";
        this.cellSelector.onMouseDown(e);
    }

    onPointerMove(e) {
        // Handle resize mode
        if (this.activeMode === "resize-col") {
            this.resizeHandler.onColResize(e);
            return;
        }
        if (this.activeMode === "resize-row") {
            this.resizeHandler.onRowResize(e);
            return;
        }

        // Cursor logic only when not actively resizing
        // console.log(this.grid.wrapper);
        const { colEdge, rowEdge } = this.resizeHandler.edge.bind(this)(e);
        if (colEdge) {
            this.hCanvas.style.cursor = "col-resize";
        } else if (rowEdge) {
            this.vCanvas.style.cursor = "row-resize";
        } else {
            this.grid.wrapper.style.cursor = "";
        }
        
        if (this.activeMode === "select") {
            // this.cellSelector.isSelecting = true;
        //     if (Math.abs(e.clientX - this.cellSelector.startX) > 5 || Math.abs(e.clientY - this.cellSelector.startY) > 5) {
        //     // console.log(Math.abs(e.clientX - this.startX), 5, Math.abs(e.clientY - this.startY));
        //     this.cellSelector.dragged = true;
        // }
            this.cellSelector.onMouseMove(e);
        }
    }

    onPointerUp(e) {
        if (this.activeMode === "resize-col") {
            this.resizeHandler.onColResizeEnd(e);
        } else if (this.activeMode === "resize-row") {
            this.resizeHandler.onRowResizeEnd(e);
        } else if (this.activeMode === "select") {
            this.cellSelector.onMouseUp(e);
        }

        this.activeMode = null;
    }
}
