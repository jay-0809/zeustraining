import { CellRange } from '../structure/cellRange.js';
import { handleSelectionClick } from './modulers.js';
/**
 * Handles multi-selection of cells by dragging on the canvas.
 */
export class CellSelector {
    /**
     * Initializes the cell selector for multi cell selection.
     * @param {Grid} grid Grid instance to attach resizing logic to.
     */
    constructor(grid) {
        this.grid = grid;
        this.cellRange = new CellRange();
        this.isSelecting = false;
        this.dragged = false;
        this.canvas = document.querySelector(".canvas-div");
    }

    /**
     * Called on pointer down to begin cell selection.
     */
    onMouseDown(e) {
        if (e.button !== 0 || !this.hitTest(e)) return;

        this.startX = e.clientX;
        this.startY = e.clientY;

        console.log("this in down", this);
        const cell = this.locateCell(e);
        if (!cell) return;

        this.cellRange.startRow = cell.row;
        this.cellRange.startCol = cell.col;
        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;

        this.isSelecting = true;
        this.dragged = false;

        if (this.cellRange.isValid()) {
            this.grid.grid.multiEditing = false;
        }

        handleSelectionClick.bind(this.grid.grid?.pointer)(e);
    }

    /**
     * Called on pointer move while selecting.
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;

        if (Math.abs(e.clientX - this.startX) > 5 || Math.abs(e.clientY - this.startY) > 5) {
            this.dragged = true;
        }

        const cell = this.locateCell(e);
        if (!cell) return;
        
        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;
        
        if (this.cellRange.isValid()) {
            const { startRow, startCol, endRow, endCol } = this.cellRange;
            this.grid.grid.multiSelect = { startRow, startCol, endRow, endCol };
            this.grid.grid.multiCursor = { row: startRow, col: startCol };
            this.grid.grid.multiEditing = true;
        }
        
        if (!this.dragged || !this.cellRange.isValid()) return;
        
        this.grid.grid.renderHeaders(0, 0);
        this.grid.grid.renderCanvases();
        // console.log("this in move", this);
    }

    /**
     * Called on pointer up to finalize selection.
     */
    onMouseUp(e) {
        this.isSelecting = false;
        if (!this.dragged) return;
    }

    /**
     * Locate the cell under the pointer.
     */
    locateCell(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid.grid;

        let col = -1, xAcc = 0;
        for (let i = 0; i < this.grid.grid.maxCols; i++) {
            xAcc += colWidths[i];
            if (x < xAcc) {
                col = i;
                break;
            }
        }

        let row = -1, yAcc = 0;
        for (let j = 0; j < this.grid.grid.maxRows; j++) {
            yAcc += rowHeights[j];
            if (y < yAcc) {
                row = j;
                break;
            }
        }

        if (row === -1 || col === -1) return null;
        return { row, col };
    }

    /**
     * Returns true if the pointer is inside the grid canvas area (excluding headers).
     */
    hitTest(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid.grid;

        // Ignore clicks inside headers
        if (x <= colWidths[0] || y <= rowHeights[0]) return false;

        return true;
    }
}


export class HeaderColSelector {
    /**
     * Initializes the HeaderSelector.
     * @param {object} grid - Reference to the pointer handler/grid.
     */
    constructor(grid) {
        /** @type {object} Grid or pointer instance */
        this.grid = grid;

        /** @type {boolean} Whether the user is currently dragging */
        this.isSelecting = false;

        /** @type {?number} Starting index of selection */
        this.startIndex = null;

        /** @type {?number} Ending index of selection */
        this.endIndex = null;
    }

    colIndex(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { colWidths, rowHeights } = this.grid.grid;
        const colHeaderHeight = rowHeights[0];

        if (y <= colHeaderHeight) {
            let xSum = 0;
            for (let i = 0; i < colWidths.length; i++) {
                xSum += colWidths[i];
                if (x < xSum) {
                    return i;
                };
            }
        }
    }
    /**
     * Called on pointer down – begins row or column selection.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const index = this.colIndex(e);

        this.startIndex = index;
        this.endIndex = index;
        this.isSelecting = true;

        this.grid.grid.multiHeaderSelection = { colstart: index, colend: index, rowStart: null, rowEnd: null };
        // console.log(this.grid.grid.multiHeaderSelection);

        this.grid.grid.renderHeaders(0, 0);
        this.grid.grid.renderCanvases();
    }

    /**
     * Called on pointer move – updates the highlight range.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;

        const index = this.colIndex(e);
        if (index != null) {
            this.endIndex = index;

            this.grid.grid.multiHeaderSelection = {
                colstart: this.startIndex, colend: index, rowStart: null, rowEnd: null
            };

            this.grid.grid.renderHeaders(0, 0);
            this.grid.grid.renderCanvases();
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
    }

    /**
     * Hit test to determine if the pointer is on a header cell.
     * @param {MouseEvent} e 
     * @param {'col' | null} [forceType=null] Force row/col detection
     * @returns {type: 'col' | null} 
     */
    hitTest(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const y = e.clientY - rect.top + window.scrollY;

        const { rowHeights } = this.grid.grid;
        const colHeaderHeight = rowHeights[0];

        if (y <= colHeaderHeight) {
            return true;
        }
        return false;
    }
}

export class HeaderRowSelector {
    /**
     * Initializes the HeaderSelector.
     * @param {object} grid - Reference to the pointer handler/grid.
     */
    constructor(grid) {
        /** @type {object} Grid or pointer instance */
        this.grid = grid;

        /** @type {boolean} Whether the user is currently dragging */
        this.isSelecting = false;

        /** @type {?number} Starting index of selection */
        this.startIndex = null;

        /** @type {?number} Ending index of selection */
        this.endIndex = null;
    }

    rowIndex(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { colWidths, rowHeights } = this.grid.grid;
        const rowHeaderWidth = colWidths[0];

        if (x <= rowHeaderWidth) {
            let ySum = 0;
            for (let j = 0; j < rowHeights.length; j++) {
                ySum += rowHeights[j];
                if (y < ySum) {
                    return j;
                };
            }
        }
    }
    /**
     * Called on pointer down – begins row or column selection.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const index = this.rowIndex(e);

        this.startIndex = index;
        this.endIndex = index;
        this.isSelecting = true;

        this.grid.grid.multiHeaderSelection = { colstart: null, colend: null, rowStart: index, rowEnd: index };
        // console.log(this.grid.grid.multiHeaderSelection);

        this.grid.grid.renderHeaders(0, 0);
        this.grid.grid.renderCanvases();
    }

    /**
     * Called on pointer move – updates the highlight range.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;

        const index = this.rowIndex(e);
        if (index != null) {
            this.endIndex = index;

            this.grid.grid.multiHeaderSelection = {
                colstart: null, colend: null, rowStart: this.startIndex, rowEnd: index
            };

            this.grid.grid.renderHeaders(0, 0);
            this.grid.grid.renderCanvases();
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
    }

    /**
     * Hit test to determine if the pointer is on a header cell.
     * @param {MouseEvent} e 
     * @param {'row' | null} [forceType=null] Force row/col detection
     * @returns {type: 'row' | null} 
     */
    hitTest(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;

        const { colWidths, } = this.grid.grid;
        const rowHeaderWidth = colWidths[0];

        if (x <= rowHeaderWidth) {
            return true;
        }
        return false;
    }
}