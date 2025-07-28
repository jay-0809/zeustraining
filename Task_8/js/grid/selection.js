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
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid.grid;

        let col = -1, xAcc = 0;
        // console.log(this.grid.grid.maxCols);
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
        if (row === -1 || col === -1) return;
        this.grid.cellColIndex = col;
        this.grid.cellRowIndex = row;
        // return { row, col };
    }

    /**
     * Called on pointer down to begin cell selection.
     */
    onMouseDown(e) {
        if (e.button !== 0 || !this.hitTest(e)) return;

        this.startX = e.clientX;
        this.startY = e.clientY;

        this.grid.grid.multiHeaderSelectionCols = [];
        this.grid.grid.multiHeaderSelectionRows = [];

        this.locateCell(e);
        if (!this.grid.cellColIndex && !this.grid.cellRowIndex) return;

        this.cellRange.startRow = this.grid.cellRowIndex;
        this.cellRange.startCol = this.grid.cellColIndex;
        this.cellRange.endRow = this.grid.cellRowIndex;
        this.cellRange.endCol = this.grid.cellColIndex;

        this.isSelecting = true;
        this.dragged = false;

        if (this.cellRange.isValid()) {
            const { startRow, startCol, endRow, endCol } = this.cellRange;
            this.grid.grid.multiSelect = { startRow, startCol, endRow, endCol };
            this.grid.grid.multiCursor = { row: startRow, col: startCol };
            this.grid.grid.multiEditing = false;
        }

        this.grid.statsCalculator.deBounceCount();
        // console.log(this.grid.grid.result);
        
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

        this.locateCell(e);
        if (!this.grid.cellColIndex && !this.grid.cellRowIndex) return;

        this.cellRange.endRow = this.grid.cellRowIndex;
        this.cellRange.endCol = this.grid.cellColIndex;

        if (this.cellRange.isValid()) {
            const { startRow, startCol, endRow, endCol } = this.cellRange;
            this.grid.grid.multiSelect = { startRow, startCol, endRow, endCol };
            this.grid.grid.multiCursor = { row: startRow, col: startCol };
            this.grid.grid.multiEditing = true;
        }

        if (!this.dragged || !this.cellRange.isValid()) return;

        this.grid.statsCalculator.deBounceCount();
        // console.log(this.grid.grid.multiSelect);
        
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
        // console.log("get colIndex", this.grid.grid.multiCursor.col, "rowIndex", this.grid.grid.multiCursor.row);
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
        const cellColIndex = this.grid.grid.multiCursor.col;
        const cellRowIndex = this.grid.grid.multiCursor.row;
        // console.log("cellColIndex", this.grid.cellColIndex, "cellRowIndex", this.grid.cellRowIndex);
        this.clearSelection();

        this.grid.grid.updateVisibleCanvases(cellColIndex, cellRowIndex);

        // Create a selection box div
        const select = document.createElement("div");
        select.setAttribute("class", "selection");
        // Create the select block div
        const sblock = document.createElement("div");
        sblock.setAttribute("class", "selection-block");

        if (this.grid.grid.multiEditing) {
            // Prevent selecting cells with negative indices (outside grid)
            if (cellColIndex === 0 || cellRowIndex === 0) return;

            // console.log('multi');
            // Position and display the selection box
            const pos = this.getCellPosition(cellColIndex, cellRowIndex);
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
            if (cellColIndex === 0 || cellRowIndex === 0) return;

            // console.log('single');
            // Position and display the selection box
            const pos = this.getCellPosition(cellColIndex, cellRowIndex);
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
            // console.log("cellll");

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

        if (e.ctrlKey) {
            this.grid.grid.ctrlSelectActive = true;
            const existingIndex = this.grid.grid.multiHeaderSelectionCols.indexOf(index);
            if (existingIndex > -1) {
                this.grid.grid.multiHeaderSelectionCols.splice(existingIndex, 1); // Deselect
            } else {
                this.grid.grid.multiHeaderSelectionCols.push(index); // Select
            }
            this.grid.grid.multiHeaderSelection = null;
        } else {
            this.grid.grid.ctrlSelectActive = false;
            this.startIndex = index;
            this.grid.grid.multiHeaderSelectionCols = [index];
            this.grid.grid.multiHeaderSelectionRows = [];
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = { colstart: null, colend: null, rowStart: index, rowEnd: index };
        }

        if (e.ctrlKey) {
            this.grid.grid.ctrlSelectActive = true;
            this.startIndex = index;
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = null;
        } else {
            this.grid.grid.multiHeaderSelectionCols = [index];
            this.grid.grid.multiHeaderSelectionRows = [];
            this.grid.grid.ctrlSelectActive = false;
            this.startIndex = index;
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = { colstart: index, colend: index, rowStart: null, rowEnd: null };
        }

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

        if (this.isSelecting && this.grid.grid.ctrlSelectActive) {
            this.endIndex = this.colIndex(e);
            const [start, end] = [this.startIndex, this.endIndex].sort((a, b) => a - b);
            for (let i = start; i <= end; i++) {
                if (!this.grid.grid.multiHeaderSelectionCols.includes(i)) {
                    this.grid.grid.multiHeaderSelectionCols.push(i);
                }
            }
            this.grid.grid.updateVisibleCanvases();
        }

        const index = this.colIndex(e);
        if (index != null) {
            this.endIndex = index;
            // console.log("ending: ",this.endIndex);

            this.grid.grid.multiHeaderSelection = {
                colstart: this.startIndex, colend: index, rowStart: null, rowEnd: null
            };

            this.grid.statsCalculator.deBounceCount();
            this.grid.grid.updateVisibleCanvases(0, 0);
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
        this.autoScroller.cancel();
        if (this.grid.grid.ctrlSelectActive) {
            this.grid.grid.ctrlSelectActive = false;
            this.isSelecting = false;
        }
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

        if (e.ctrlKey) {
            const existingIndex = this.grid.grid.multiHeaderSelectionRows.indexOf(index);
            if (existingIndex > -1) {
                this.grid.grid.multiHeaderSelectionRows.splice(existingIndex, 1); // Deselect
            } else {
                this.grid.grid.multiHeaderSelectionRows.push(index); // Select
            }
            this.grid.grid.multiHeaderSelection = null;
        } else {
            this.grid.grid.multiHeaderSelectionCols = [];
            this.grid.grid.multiHeaderSelectionRows = [index];
            this.startIndex = index;
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = { colstart: null, colend: null, rowStart: index, rowEnd: index };
        }

        if (e.ctrlKey) {
            this.grid.grid.ctrlSelectActive = true;
            this.startIndex = index;
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = null;
        } else {
            this.grid.grid.ctrlSelectActive = false;
            this.grid.grid.multiHeaderSelectionCols = [];
            this.grid.grid.multiHeaderSelectionRows = [index];
            this.startIndex = index;
            this.endIndex = index;
            this.isSelecting = true;
            this.grid.grid.multiHeaderSelection = { colstart: null, colend: null, rowStart: index, rowEnd: index };
        }

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

        if (this.isSelecting && this.grid.grid.ctrlSelectActive) {
            this.endIndex = this.rowIndex(e);
            const [start, end] = [this.startIndex, this.endIndex].sort((a, b) => a - b);
            for (let i = start; i <= end; i++) {
                if (!this.grid.grid.multiHeaderSelectionRows.includes(i)) {
                    this.grid.grid.multiHeaderSelectionRows.push(i);
                }
            }
            this.grid.grid.updateVisibleCanvases();
        }

        const index = this.rowIndex(e);
        if (index != null) {
            this.endIndex = index;

            this.grid.grid.multiHeaderSelection = {
                colstart: null, colend: null, rowStart: this.startIndex, rowEnd: index
            };

            this.grid.statsCalculator.deBounceCount();
            this.grid.grid.updateVisibleCanvases(0, 0);
        }
    }

    /**
     * Called on pointer up – finalizes the header selection.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.isSelecting = false;
        this.autoScroller.cancel();
        if (this.grid.grid.ctrlSelectActive) {
            this.grid.grid.ctrlSelectActive = false;
            this.isSelecting = false;
        }
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