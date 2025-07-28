import { ColResizeHandler, RowResizeHandler } from './resize.js';
import { CellSelector, HeaderColSelector, HeaderRowSelector } from './selection.js';
import { keyNavigation } from "./modulers.js";
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

        /** @type {HTMLCanvasElement} Horizontal (column) header canvas */
        this.hCanvas = document.querySelector(".h-canvas");

        /** @type {HTMLCanvasElement} Vertical (row) header canvas */
        this.vCanvas = document.querySelector(".v-canvas");

        this.strategies = [
            new CellSelector(this),
            new ColResizeHandler(this),
            new RowResizeHandler(this),
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
        window.addEventListener("keydown", (e) => {
            const inputBlock = document.querySelector(".cell-input");
            // console.log("::::::", inputBlock);
            if (e.ctrlKey && ["z", "y"].includes(e.key)) {
                switch (e.key.toLowerCase()) {
                    case "z": this.grid.commandManager.undo(); return;
                    case "y": this.grid.commandManager.redo(); return;
                }
            } else if (e.ctrlKey && ["r"].includes(e.key)) {
                return;
            } else if (!inputBlock || e.key === "Enter") {
                e.preventDefault();
                keyNavigation(e, this.grid);
            }
        });
    }

    handleCustomScroll(scrollX, scrollY) {
        // store in grid for canvas positioning
        this.grid.scrollX = scrollX;
        this.grid.scrollY = scrollY;

        this.grid.startCol = Math.floor(scrollX / this.grid.colWidths[1]);
        this.grid.startRow = Math.floor(scrollY / this.grid.rowHeights[1]);

        // Recalculate visible canvases based on scroll
        this.grid.updateVisibleCanvases();

        // Redraw any relevant selections
        const cs = this.grid.pointer?.cellSelector;
        if (cs?.cellRange?.isValid() && cs?.dragged) {
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
        const strategy = this.findStategy(e);
        this.activeMode = strategy;
        // console.log("strategy", strategy);
        if (strategy) {
            strategy.onMouseDown(e);
            return;
        }
    }

    /**
     * Handles pointer move events based on active mode.
     * @param {PointerEvent} e 
     */
    onPointerMove(e) {
        if (this.activeMode) {
            this.activeMode.onMouseMove(e);
            return;

        }
        const strategy = this.findStategy(e);
        // console.log("strategy", strategy);
        if (strategy && strategy.isSelecting !== null) {
            this.activeMode = strategy;
            if (strategy) {
                strategy.onMouseMove(e);
            }
            return;
        }
    }

    /**
     * Handles pointer up event: finalize resizing or selection.
     * @param {PointerEvent} e 
     */
    onPointerUp(e) {
        this.grid.activeCellRange = null;
        if (this.activeMode) {
            this.activeMode.onMouseUp(e);
            return;
        }
        const strategy = this.findStategy(e);
        // console.log("strategy", strategy);
        if (strategy && strategy.isSelecting !== null) {
            this.activeMode = strategy;
            if (strategy) {
                strategy.onMouseUp(e);
            }
            return;
        }
    }

    addColumnAfterSelection() {
        const grid = this.grid;
        const selectedCols = grid.multiHeaderSelectionCols;
        if (!selectedCols || selectedCols.length === 0) return;

        const insertAt = Math.max(...selectedCols);

        grid.maxCols += 1;
        grid.colWidths.splice(insertAt, 0, 80);

        // Update header row (always exists)
        const headerRow = grid.dataset.get(0);
        for (let c = grid.maxCols - 2; c >= insertAt; c--) {
            headerRow.set(c + 1, headerRow.get(c));
        }
        headerRow.set(insertAt, "");

        // Only update rows that exist in the dataset (sparse update)
        for (let [r, rowMap] of grid.dataset.entries()) {
            if (r === 0) continue; // skip header, already done
            // Shift values to the right for existing columns only
            for (let c = grid.maxCols - 2; c >= insertAt; c--) {
                if (rowMap.has(c)) {
                    rowMap.set(c + 1, rowMap.get(c));
                } else {
                    rowMap.delete(c + 1); // keep sparse
                }
            }
            rowMap.set(insertAt, "");
        }

        // grid.multiHeaderSelectionCols = [];
        grid.updateVisibleCanvases();
    }

    // addRowAfterSelection() {
    //     const grid = this.grid;
    //     const selectedRows = grid.multiHeaderSelectionRows;
    //     if (!selectedRows || selectedRows.length === 0) return;

    //     const insertAt = Math.max(...selectedRows);

    //     grid.maxRows += 1;
    //     grid.rowHeights.splice(insertAt, 0, 25);

    //     // Shift all rows after insertAt down by 1
    //     for (let r = grid.maxRows - 2; r >= insertAt; r--) {
    //         const prevRow = grid.dataset.get(r);
    //         grid.dataset.set(r + 1, prevRow ? new Map(prevRow) : new Map());
    //     }
    //     // Insert new empty row at the correct position
    //     const newRow = new Map();
    //     for (let c = 0; c < grid.maxCols; c++) {
    //         newRow.set(c, "");
    //     }
    //     grid.dataset.set(insertAt, newRow);

    //     // grid.multiHeaderSelectionRows = [];
    //     grid.updateVisibleCanvases();
    // }
    addRowAfterSelection() {
        const grid = this.grid;
        const selectedRows = grid.multiHeaderSelectionRows;
        if (!selectedRows || selectedRows.length === 0) return;

        const insertAt = Math.max(...selectedRows);

        grid.maxRows += 1;
        grid.rowHeights.splice(insertAt, 0, 25);

        // Get all existing row indices >= insertAt, sorted descending
        const existingRows = Array.from(grid.dataset.keys())
            .filter(r => r >= insertAt && r !== 0) // skip header row 0
            .sort((a, b) => b - a);

        // Shift only existing rows down by 1
        for (let r of existingRows) {
            grid.dataset.set(r + 1, grid.dataset.get(r));
        }

        // Insert new empty row at the correct position
        const newRow = new Map();
        for (let c = 0; c < grid.maxCols; c++) {
            newRow.set(c, "");
        }
        grid.dataset.set(insertAt, newRow);

        // grid.multiHeaderSelectionRows = [];
        grid.updateVisibleCanvases();
    }
}
