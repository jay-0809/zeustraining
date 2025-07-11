/**
 * Handles column resize interactions.
 * It updates the correct index in grid.colWidths
 */
export class ColResizeHandler {
    /**
     * @param {object} grid - Grid or pointer instance
     */
    constructor(grid) {
        this.grid = grid;
        /** @type {?number} Index of the column being resized */
        this.resizingCol = null;

        /** @type {number} Initial mouse X position */
        this.startX = 0;

        /** @type {number} Initial column width */
        this.startColWidth = 0;

        this.hCanvas = document.querySelector(".h-canvas");
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
                if (Math.abs(x - xSum) < 5 && i !== 0) {
                    return i;
                }
            }
        }
        return null;
    }

    /**
     * Detect if cursor is near a column border (within header region).
     * @param {MouseEvent} e
     * @returns {{colEdge: boolean, colIndex: number}}
     */
    hitTest(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { rowHeights } = this.grid.grid;
        const colHeaderHeight = rowHeights[0];

        // Which column line is the mouse close to?
        let xPos = 0, colEdge = false;
        for (let i = 0; i < this.grid.grid.colWidths.length; i++) {
            xPos += this.grid.grid.colWidths[i];
            if (Math.abs(x - xPos) < 5) {
                this.hCanvas.style.cursor = "col-resize";
                colEdge = true;
                break;
            }
        } 

        if (colEdge && y > 0 && y <= colHeaderHeight) {
            return true;
        }
        return false;
    }

    /**
     * Called on pointer down to initiate resize.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const index = this.colIndex(e);
        if (index == null) return;

        this.resizingCol = index;
        this.startX = e.clientX;
        this.startColWidth = this.grid.grid.colWidths[index];
    }

    /**
     * Called on pointer move while resizing.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (this.resizingCol == null) return;

        const dx = e.clientX - this.startX;
        const newWidth = Math.max(30, this.startColWidth + dx);
        this.grid.grid.colWidths[this.resizingCol] = newWidth;

        this.grid.grid.renderHeaders(0, 0);
    }

    /**
     * Called on pointer up to end resize.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.resizingCol = null;
        // console.log("colRe", this);
        
        this.grid.grid.renderCanvases();
        this.grid.grid.wrapper.style.cursor = "";
    }
}

/**
 * Handles row resize interactions.
 * It updates the correct index in grid.rowHeights
 */
export class RowResizeHandler {
    /**
     * @param {object} grid - Grid or pointer instance
     */
    constructor(grid) {
        this.grid = grid;

        /** @type {?number} Index of the row being resized */
        this.resizingRow = null;

        /** @type {number} Initial mouse Y position */
        this.startY = 0;

        /** @type {number} Initial row height */
        this.startRowHeight = 0;

        this.vCanvas = document.querySelector(".v-canvas");
    }

    rowIndex(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { rowHeights, colWidths } = this.grid.grid;
        const rowHeaderWidth = colWidths[0];

        if (x <= rowHeaderWidth) {
            let ySum = 0;
            for (let i = 0; i < rowHeights.length; i++) {
                ySum += rowHeights[i];
                if (Math.abs(y - ySum) < 5 && i !== 0) {
                    return i;
                }
            }
            return null;
        }
    }

    /**
     * check if pointer is near a row border (within row header area).
     * @param {MouseEvent} e
     * @returns {{rowEdge: boolean, rowIndex: number}}
     */
    hitTest(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        const { colWidths } = this.grid.grid;
        const rowHeaderWidth = colWidths[0];
        // Which row line is the mouse close to?
        let yPos = 0, rowEdge = false;
        for (let j = 0; j < this.grid.grid.rowHeights.length; j++) {
            yPos += this.grid.grid.rowHeights[j];
            if (Math.abs(y - yPos) < 5) {
                this.vCanvas.style.cursor = "row-resize";
                rowEdge = true;
                break;
            }
        }

        if (rowEdge && x > 0 && x <= rowHeaderWidth) {
            return true;
        }
        return false;
    }

    /**
     * Called on pointer down to initiate row resize.
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        const index = this.rowIndex(e);
        if (index == null) return;

        this.resizingRow = index;
        this.startY = e.clientY;
        this.startRowHeight = this.grid.grid.rowHeights[index];
    }

    /**
     * Called on pointer move while resizing.
     * @param {MouseEvent} e 
     */
    onMouseMove(e) {
        if (this.resizingRow == null) return;

        const dy = e.clientY - this.startY;
        const newHeight = Math.max(15, this.startRowHeight + dy);
        this.grid.grid.rowHeights[this.resizingRow] = newHeight;

        this.grid.grid.renderHeaders(0, 0);
    }

    /**
     * Called on pointer up to finalize resize.
     * @param {MouseEvent} e 
     */
    onMouseUp(e) {
        this.resizingRow = null;
        this.grid.grid.renderCanvases();
        this.grid.grid.wrapper.style.cursor = "";
    }
}
