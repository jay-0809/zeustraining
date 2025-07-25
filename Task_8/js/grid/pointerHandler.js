import { ColResizeHandler, RowResizeHandler } from './resize.js';
import { CellSelector, HeaderColSelector, HeaderRowSelector } from './selection.js';
import {keyNavigation} from "./modulers.js";
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
            if (e.ctrlKey && ["z", "y"].includes(e.key)) {
                switch (e.key.toLowerCase()) {
                    case "z": this.grid.commandManager.undo(); return;
                    case "y": this.grid.commandManager.redo(); return;
                }
            } else if(e.ctrlKey && ["r"].includes(e.key)){
                return;
            } else{
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
}
