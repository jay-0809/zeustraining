import { CellRange } from '../structure/cellRange.js';
// import { handleSelectionClick } from './modulers.js';
import { setupAutoScroll } from './autoScrollDuringDragStrategy.js';
import { SelectionStats } from './selectionStats.js';
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

        this.autoScroller = setupAutoScroll(this, "both");
        this.grid.statsCalculator = new SelectionStats(this.grid.grid);
    }

    /**
     * Returns true if the pointer is inside the grid canvas area (excluding headers).
     */
    hitTest(e) {
        const target = e.target;
        return target.classList.contains("canvas-div") &&
            !target.classList.contains("h-canvas") &&
            !target.classList.contains("v-canvas");
    }

    /**
     * Locate the cell under the pointer.
     */
    locateCell(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();

        const x = e.clientX - rect.left + window.scrollX;
        // console.log(x);
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid.grid;

        let col = -1, xAcc = 0;
        console.log(this.grid.grid.maxCols);
        for (let i = this.grid?.grid?.startCol || 0; i < this.grid.grid.maxCols; i++) {
            xAcc += colWidths[i];
            
            if (x < xAcc) {
                col = i;
                break;
            }
        }


        let row = -1, yAcc = 0;
        for (let j = this.grid?.grid?.startRow || 0; j < this.grid.grid.maxRows; j++) {
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
     * Called on pointer down to begin cell selection.
     */
    onMouseDown(e) {
        if (e.button !== 0 || !this.hitTest(e)) return;

        this.startX = e.clientX;
        this.startY = e.clientY;

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

        this.grid.statsCalculator.deBounceCount();
        // handleSelectionClick.bind(this.grid.grid?.pointer)(e);
        this.singleSelection(e);
    }

    /**
     * Called on pointer move while selecting.
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;


        this.autoScroller.onMove(e);

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

        this.grid.statsCalculator.deBounceCount();
        this.grid.grid.updateVisibleCanvases(0, 0);
    }

    /**
     * Called on pointer up to finalize selection.
     */
    onMouseUp(e) {
        this.isSelecting = false;
        this.autoScroller.cancel();
        if (!this.dragged) return;
    }

    /**
     * Remove selection and input divs
     */
    clearSelection = () => {
        document.querySelectorAll(".selection, .selection-block, .cell-input").forEach(el => {
            if (this.grid.grid.wrapper.contains(el)) this.grid.grid.wrapper.removeChild(el);
        });
        if (this.grid.grid.multiHeaderSelection) {
            this.grid.grid.multiHeaderSelection = null;
        }
    };

    /**
     * get selection and input divs position
     * @param {*} colIndex column index of cell 
     * @param {*} rowIndex Row index of cell
     * @returns 
     */
    getCellPosition = (colIndex, rowIndex) => {
        // console.log("startCol:", this.grid.startCol,"startRow" ,this.grid.startRow);
        let left = this.grid.grid.colWidths.slice(this.grid.grid.startCol, colIndex).reduce((sum, w) => sum + w, 0);
        let top = this.grid.grid.rowHeights.slice(this.grid.grid.startRow, rowIndex).reduce((sum, h) => sum + h, 0);
        return {
            left,
            top,
            width: this.grid.grid.colWidths[colIndex],
            height: this.grid.grid.rowHeights[rowIndex],
        };
    };

    /**
     * append single selection block at position in canvas
     * @param {*} col at which column block generated
     * @param {*} row at which row block generated
     * @returns selected block at position
     */
    singleSelection = (e) => {
        const { row, col } = this.locateCell(e);

        this.clearSelection();

        this.grid.grid.updateVisibleCanvases(col, row);
        
        // Create a selection box div
        const select = document.createElement("div");
        select.setAttribute("class", "selection");
        // Create the select block div
        const sblock = document.createElement("div");
        sblock.setAttribute("class", "selection-block");

        if (this.grid.grid.multiEditing) {
            // Prevent selecting cells with negative indices (outside grid)
            if (col === 0 || row === 0) return;

            // console.log('multi');
            // Position and display the selection box
            const pos = this.getCellPosition(col, row);
            select.style.display = `block`;
            select.style.left = `${pos.left}px`;
            select.style.top = `${pos.top}px`;
            select.style.width = `${pos.width}px`;
            select.style.height = `${pos.height}px`;
            select.style.border = `none`;
            select.style.cursor = "cell";

            this.grid.grid.wrapper.appendChild(select);
        } else {
            // Prevent selecting cells with negative indices (outside grid)
            if (col === 0 || row === 0) return;

            // console.log('single');
            // Position and display the selection box
            const pos = this.getCellPosition(col, row);
            select.style.display = `block`;
            select.style.left = `${pos.left}px`;
            select.style.top = `${pos.top}px`;
            select.style.width = `${pos.width}px`;
            select.style.height = `${pos.height}px`;
            select.style.border = `2px solid #107c41`;
            select.style.cursor = "cell";
            // Set the position and style for the selection block
            sblock.style.display = `block`;
            sblock.style.left = `${pos.left + pos.width - 5}px`;
            sblock.style.top = `${pos.top + pos.height - 5}px`;

            this.grid.grid.wrapper.appendChild(select);
            this.grid.grid.wrapper.appendChild(sblock);
        }
    };

    
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

        this.autoScroller = setupAutoScroll(this, "x");

        this.grid.statsCalculator = new SelectionStats(this.grid.grid);
    }

    colIndex(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { colWidths, rowHeights } = this.grid.grid;
        const colHeaderHeight = rowHeights[0];

        if (y <= colHeaderHeight) {
            let xSum = 0;
            for (let i = this.grid?.grid?.startCol || 0; i < colWidths.length; i++) {
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

        this.grid.statsCalculator.deBounceCount();
        this.grid.grid.updateVisibleCanvases(0, 0);
    }

    /**
     * Called on pointer move – updates the highlight range.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;

        this.autoScroller.onMove(e); // Auto-scroll support

        const index = this.colIndex(e);
        if (index != null) {
            this.endIndex = index;
            // console.log("ending: ",this.endIndex);

            this.grid.grid.multiHeaderSelection = {
                colstart: this.startIndex, colend: index, rowStart: null, rowEnd: null
            };

            this.grid.statsCalculator.deBounceCount();
            this.grid.grid.updateVisibleCanvases(0, 0);
            // this.grid.grid.renderHeaders(0, 0);
            // this.grid.grid.renderCanvases();
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
        this.autoScroller.cancel();
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

        this.autoScroller = setupAutoScroll(this, "y");

        this.grid.statsCalculator = new SelectionStats(this.grid.grid);
    }

    rowIndex(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { colWidths, rowHeights } = this.grid.grid;
        const rowHeaderWidth = colWidths[0];

        if (x <= rowHeaderWidth) {
            let ySum = 0;
            for (let j = this.grid?.grid?.startRow || 0; j < rowHeights.length; j++) {
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

        this.grid.statsCalculator.deBounceCount();
        this.grid.grid.updateVisibleCanvases(0, 0);
    }

    /**
     * Called on pointer move – updates the highlight range.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (!this.isSelecting) return;

        this.autoScroller.onMove(e); // Auto-scroll support

        const index = this.rowIndex(e);
        if (index != null) {
            this.endIndex = index;

            this.grid.grid.multiHeaderSelection = {
                colstart: null, colend: null, rowStart: this.startIndex, rowEnd: index
            };

            this.grid.statsCalculator.deBounceCount();
            this.grid.grid.updateVisibleCanvases(0, 0);
            // this.grid.grid.renderHeaders(0, 0);
            // this.grid.grid.renderCanvases();
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
        this.autoScroller.cancel();
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