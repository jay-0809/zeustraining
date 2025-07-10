/**
 * Handles column and row resizing for the Excel-like grid.
 * It updates the correct index in grid.colWidths or grid.rowHeights arrays.
 * The new size takes effect after the mouse drag, and the grid re-renders automatically.
 */
export class GridResizeHandler {
    /**
     * Initializes the resize handler for a grid instance.
     * @param {Grid} grid Grid instance to attach resizing logic to.
     */
    constructor(grid) {
        /** @type {Grid} Reference to the grid instance */
        this.grid = grid;
        /** @type {?number} The column index being resized, or null */
        this.resizingCol = null;
        /** @type {?number} The row index being resized, or null */
        this.resizingRow = null;
        /** @type {number} Initial mouse X position for column resize */
        this.startX = 0;
        /** @type {number} Initial mouse Y position for row resize */
        this.startY = 0;
        /** @type {number} Initial width of the column being resized */
        this.startColWidth = 0;
        /** @type {number} Initial height of the row being resized */
        this.startRowHeight = 0;

        this.hCanvas = document.querySelector(".h-canvas");
        this.vCanvas = document.querySelector(".v-canvas");
    }

    /**
     * Mouse move: check if we're near a resizable border and set the cursor.
     * @param {MouseEvent} e
     */
    onMouseMove(e) {
        const { colEdge, rowEdge } = this.edge(e);
        if (colEdge) {
            this.hCanvas.style.cursor = 'col-resize';
        } else if (rowEdge) {
            this.vCanvas.style.cursor = 'row-resize';
        } else {
            this.grid.wrapper.style.cursor = '';
        }
    }

    /**
     * Mouse down: start the resize if at a column or row edge.
     * @param {MouseEvent} e
     */
    onMouseDown(e) {
        const { colIndex, colEdge, rowIndex, rowEdge } = this.edge(e);

        if (colEdge) {
            // Start column resize
            this.resizingCol = colIndex;
            // console.log(`Resizing column: ${colIndex}`);

            this.startX = e.clientX;
            this.startColWidth = this.grid.colWidths[colIndex];
            this.grid.wrapper.addEventListener('pointermove', this.onColResize);
            this.grid.wrapper.addEventListener('pointerup', this.onColResizeEnd);
        } else if (rowEdge) {
            // Start row resize
            this.resizingRow = rowIndex;
            // console.log(`Resizing row: ${rowIndex}`);
            this.startY = e.clientY;
            this.startRowHeight = this.grid.rowHeights[rowIndex];
            this.grid.wrapper.addEventListener('pointermove', this.onRowResize);
            this.grid.wrapper.addEventListener('pointerup', this.onRowResizeEnd);
        }
    }

    /**
     * Calculate if mouse is close to a column or row edge (for resizing).
     * @param {MouseEvent} e
     * @returns {object} {colIndex, colEdge, rowIndex, rowEdge}
     */
    edge(e) {
        const rect = this.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;

        // Which column line is the mouse close to?
        let xPos = 0, colIndex = -1, colEdge = false;
        for (let i = 0; i < this.grid.colWidths.length; i++) {
            xPos += this.grid.colWidths[i];
            if (Math.abs(x - xPos) < 5) {
                colIndex = i;
                colEdge = true;
                break;
            }
        }
        // Which row line is the mouse close to?
        let yPos = 0, rowIndex = -1, rowEdge = false;
        for (let j = 0; j < this.grid.rowHeights.length; j++) {
            yPos += this.grid.rowHeights[j];
            if (Math.abs(y - yPos) < 5) {
                rowIndex = j;
                rowEdge = true;
                break;
            }
        }
        // Only allow col resize if mouse is in the column header (top area)
        if (colEdge && y > 0 && y < this.grid.rowHeights[0]) {
            // Don't allow resizing row header column (col 0)
            if (colIndex === 0) colEdge = false;
        } else {
            colEdge = false;
        }
        // Only allow row resize if mouse is in the row header (left area)
        if (rowEdge && x > 0 && x < this.grid.colWidths[0]) {
            // Don't allow resizing column header row (row 0)
            if (rowIndex === 0) rowEdge = false;
        } else {
            rowEdge = false;
        }
        return { colIndex, colEdge, rowIndex, rowEdge };
    }

    /**
     * Mouse move while resizing column.
     */
    onColResize = (e) => {
        if (this.resizingCol != null) {
            const dx = e.clientX - this.startX;
            // Update only the target column width
            let newWidth = Math.max(30, this.startColWidth + dx);
            this.grid.grid.colWidths[this.resizingCol] = newWidth;

            this.grid.grid.renderHeaders(0, 0);
        }
    }

    /**
     * Mouse up: finish resizing column.
    */
    onColResizeEnd = (e) => {
        this.canvasDragLine = false;
        this.resizingCol = null;
        this.grid.grid.renderCanvases();
        this.grid.grid.wrapper.removeEventListener('pointermove', this.onColResize);
        this.grid.grid.wrapper.removeEventListener('pointerup', this.onColResizeEnd);
        this.grid.grid.wrapper.style.cursor = '';
    }

    /**
     * Mouse move while resizing row.
     */
    onRowResize = (e) => {
        if (this.resizingRow != null) {
            const dy = e.clientY - this.startY;
            // Update only the target row height
            let newHeight = Math.max(15, this.startRowHeight + dy);
            this.grid.grid.rowHeights[this.resizingRow] = newHeight;
            this.grid.grid.renderHeaders();
        }
    }

    /**
     * Mouse up: finish resizing row.
    */
    onRowResizeEnd = (e) => {
        this.resizingRow = null;
        this.grid.grid.renderCanvases();
        this.grid.grid.wrapper.removeEventListener('pointermove', this.onRowResize);
        this.grid.grid.wrapper.removeEventListener('pointerup', this.onRowResizeEnd);
        this.grid.grid.wrapper.style.cursor = '';
    }
}