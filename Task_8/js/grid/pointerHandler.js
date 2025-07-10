import { GridResizeHandler } from './resize.js';
import { CellSelector, HeaderSelector, HeaderColSelector, HeaderRowSelector } from './selection.js';

/**
 * Handles pointer events (mouse/touch) for grid interactions including:
 * - Cell selection
 * - Column/row resizing
 * - Header-based row/column selection
 */
export class PointerHandler {
    /**
     * Initializes the PointerHandler.
     * @param {object} grid - The grid instance to which this handler is attached.
     */
    constructor(grid) {
        /** @type {object} Reference to the grid instance */
        this.grid = grid;

        /** @type {CellSelector} Handles cell-based multi-selection */
        this.cellSelector = new CellSelector(this);

        /** @type {GridResizeHandler} Handles row and column resizing */
        this.resizeHandler = new GridResizeHandler(this);

        // /** @type {HeaderSelector} Handles header-based row/column selection */
        // this.headerSelector = new HeaderSelector(this);

        /** @type {HTMLCanvasElement} Horizontal (column) header canvas */
        this.hCanvas = document.querySelector(".h-canvas");

        /** @type {HTMLCanvasElement} Vertical (row) header canvas */
        this.vCanvas = document.querySelector(".v-canvas");

        this.strategies = [
            // new CellSelector(this),
            // new GridResizeHandler(this),
            new HeaderColSelector(this),
            new HeaderRowSelector(this),
        ]

        this.activeMode = null;
    }

    /**
     * Registers all pointer and scroll event listeners on the grid wrapper.
     */
    registerHandlers() {
        const wrap = this.grid.wrapper;
        wrap.addEventListener("pointerdown", this.onPointerDown.bind(this));
        window.addEventListener("pointermove", this.onPointerMove.bind(this));
        window.addEventListener("pointerup", this.onPointerUp.bind(this));
        window.addEventListener("scroll", this.onScroll.bind(this));
    }

    /**
     * Handles scroll event: re-renders grid and active selection boxes.
     */
    onScroll() {
        this.grid.renderHeaders(0, 0);
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

    findStategy(e) {
        for (const strategy of this.strategies) {
            if (strategy.hitTest(e)) {
                return strategy;
            }
        }
        return null;
    }

    /**
     * Handles pointer down events:
     * - Initiates resizing or selection mode based on hit test.
     * @param {PointerEvent} e 
     */
    onPointerDown(e) {
        const { colEdge, rowEdge, colIndex, rowIndex } = this.resizeHandler.edge.bind(this)(e);

        // Begin column resize
        if (colEdge) {
            this.activeMode = "resize-col";
            this.resizeHandler.resizingCol = colIndex;
            this.resizeHandler.startX = e.clientX;
            this.resizeHandler.startColWidth = this.grid.colWidths[colIndex];
            return;
        }

        // Begin row resize
        if (rowEdge) {
            this.activeMode = "resize-row";
            this.resizeHandler.resizingRow = rowIndex;
            this.resizeHandler.startY = e.clientY;
            this.resizeHandler.startRowHeight = this.grid.rowHeights[rowIndex];
            return;
        }

        

        const strategy = this.findStategy(e);
        this.activeMode = strategy;
        console.log("strategy", strategy);
        if (strategy) {
            strategy.onMouseDown(e);
            return;
        }

        // Default to cell selection
        this.activeMode = "select";
        this.cellSelector.onMouseDown(e);
        return;
        // Header selection (row/column)
        // const hit = this.headerSelector.hitTestHeader(e);
        // if (hit.type) {
        //     if (this.cellSelector.cellRange) {
        //         this.cellSelector.cellRange.startRow = null;
        //         this.cellSelector.cellRange.startCol = null;
        //         this.cellSelector.cellRange.endRow = null;
        //         this.cellSelector.cellRange.endCol = null;
        //     }
        //     // console.log(this.cellSelector?.cellRange);

        //     this.activeMode = "header-select";
        //     this.headerSelector.onMouseDown(e);
        //     // console.log("Header selection start");
        //     return;
        // }



    }

    /**
     * Handles pointer move events based on active mode.
     * @param {PointerEvent} e 
     */
    onPointerMove(e) {
        // Resizing columns
        if (this.activeMode === "resize-col") {
            this.resizeHandler.onColResize(e);
            return;
        }

        // Resizing rows
        if (this.activeMode === "resize-row") {
            this.resizeHandler.onRowResize(e);
            return;
        }

        // Normal cell drag-selection
        if (this.activeMode === "select") {
            this.cellSelector.onMouseMove(e);
            return;
        }

        const strategy = this.findStategy(e);
        // console.log("strategy", strategy);
        if (strategy.isSelecting !== null) {
            this.activeMode = strategy;
            if (strategy) {
                strategy.onMouseMove(e);
            }
            return;
        }
        // // Header drag-selection
        // if (this.activeMode === "header-select") {
        //     this.headerSelector.onMouseMove(e);
        //     // console.log("Header selection move");
        //     return;
        // }

        // Set cursor styles based on hover near edge
        const { colEdge, rowEdge } = this.resizeHandler.edge.bind(this)(e);
        if (colEdge) {
            this.hCanvas.style.cursor = "col-resize";
        } else if (rowEdge) {
            this.vCanvas.style.cursor = "row-resize";
        } else {
            this.grid.wrapper.style.cursor = "";
        }


    }

    /**
     * Handles pointer up event: finalize resizing or selection.
     * @param {PointerEvent} e 
     */
    onPointerUp(e) {
        if (this.activeMode === "resize-col") {
            this.resizeHandler.onColResizeEnd(e);
        } else if (this.activeMode === "resize-row") {
            this.resizeHandler.onRowResizeEnd(e);
        } else if (this.activeMode === "select") {
            this.cellSelector.onMouseUp(e);
        }
        // else if (this.activeMode === "header-select") {
        //     this.headerSelector.onMouseUp(e);
        //     // console.log("Header selection end");
        // }

        const strategy = this.findStategy(e);
        // console.log("strategy", strategy);
        if (strategy.isSelecting !== null) {
            this.activeMode = strategy;
            if (strategy) {
                strategy.onMouseUp(e);
            }
            return;
        }

        // Reset mode
        this.activeMode = null;
    }
}
