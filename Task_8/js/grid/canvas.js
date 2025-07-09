// import { GridResizeHandler } from "./resize.js";

// Class for creating a single canvas block
export class Canvas {
    /**
     * Constructor for the Canvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex, selectCol, selectRow) {
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.selectCol = selectCol || null;
        this.selectRow = selectRow || null;

        // this.gridResizeHandler = new GridResizeHandler(grid);
        // console.log(this.gridResizeHandler.canvasDragLine);


        const { colWidths, rowHeights, colsPerCanvas, rowsPerCanvas } = grid;

        // Calculate dynamic width
        let width = 0;
        for (let c = 0; c < colsPerCanvas; c++) {
            width += colWidths[xIndex * colsPerCanvas + c] || 0;
        }
        // Calculate dynamic height
        let height = 0;
        for (let r = 0; r < rowsPerCanvas; r++) {
            height += rowHeights[yIndex * rowsPerCanvas + r] || 0;
        }
        // console.log("globalCol", globalCol, "globalRow", globalRow);
        // Create the canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("class", "canvas-div");

        this.canvas.width = width;
        this.canvas.height = height;

        // Calculate position offsets
        let leftOffset = grid.colWidths[0]; // Space for row header
        for (let i = 0; i < xIndex * colsPerCanvas; i++) {
            leftOffset += colWidths[i] || 0;
        }

        let topOffset = grid.rowHeights[0]; // Space for column header
        for (let i = 0; i < yIndex * rowsPerCanvas; i++) {
            topOffset += rowHeights[i] || 0;
        }

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${leftOffset}px`;
        this.canvas.style.top = `${topOffset}px`;

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initialize canvas by drawing the grid cells and content
        this.createCanvas();
    }
    /**
     * Method to create and render the canvas cells
     */
    createCanvas() {
        const { ctx, grid, selectCol, selectRow } = this;  // Destructure grid and context
        const { dataset, rowsPerCanvas, colsPerCanvas, colWidths, rowHeights } = grid;  // Destructure cell width, height, and dataset
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const startRow = this.yIndex * rowsPerCanvas;
        const startCol = this.xIndex * colsPerCanvas;

        if (grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) {
            // console.log(grid.pointer?.cellSelector?.cellRange?.isValid(), grid.pointer?.cellSelector?.dragged, grid.multiEditing);
            this.drawMultiSelection(grid.pointer?.cellSelector?.cellRange);
        }

        // console.log(selectCol, selectRow);

        // Draw cells within a canvas block
        let y = 0;
        for (let r = 0; r < rowsPerCanvas; r++) {
            let rowHeight = rowHeights[startRow + 1 + r];
            let x = 0;
            for (let c = 0; c < colsPerCanvas; c++) {
                // Calculate the global row and column index for data mapping
                let colWidth = colWidths[startCol + 1 + c];
                const globalRow = startRow + r;
                const globalCol = startCol + c;

                const isColSelected = selectRow === null && selectCol === globalCol + 1;
                const isRowSelected = selectCol === null && selectRow === globalRow + 1;

                // console.log(selectRow, selectCol ,globalCol + 1);


                if (isColSelected || isRowSelected) {
                    ctx.fillStyle = "#caead8";
                    ctx.fillRect(x, y, colWidth, rowHeight);
                }

                // Get the Row object for the globalRow
                const rowMap = dataset.get(globalRow);
                let cellData = rowMap instanceof Map ? rowMap.get(globalCol) || "" : "";

                ctx.fillStyle = "#000";
                ctx.font = globalRow === 0 ? "bold 14px Arial" : "14px Arial";
                ctx.textBaseline = "middle";
                ctx.textAlign = Number(cellData) ? "right" : "left";
                const text = globalRow === 0 ? String(cellData).slice(0, 8).toUpperCase() : String(cellData).slice(0, 8);
                const textX = Number(cellData) ? x + colWidth - 5 : x + 4;
                ctx.fillText(text, textX, y + rowHeight / 2);

                x += colWidth;
            }
            y += rowHeight;
        }

        // Horizontal lines
        y = 0;
        for (let r = 0; r <= rowsPerCanvas; r++) {
            ctx.beginPath();
            const globalRowIndex = r + startRow;
            ctx.strokeStyle = (selectCol === null && selectRow !== null &&
                (selectRow === globalRowIndex || selectRow === globalRowIndex + 1))
                ? "#107c41" : "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(0, y + 0.5);
            ctx.lineTo(this.canvas.width, y + 0.5);
            ctx.stroke();
            y += rowHeights[startRow + 1 + r] || 0;
        }

        // Vertical lines
        let x = 0;
        for (let c = 0; c <= colsPerCanvas; c++) {
            ctx.beginPath();
            const globalColIndex = c + startCol;
            ctx.strokeStyle = (selectCol !== null && selectRow === null &&
                (selectCol === globalColIndex || selectCol === globalColIndex + 1))
                ? "#107c41" : "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(x + 0.5, 0);
            ctx.lineTo(x + 0.5, this.canvas.height);
            ctx.stroke();
            x += colWidths[startCol + 1 + c] || 0;
        }


    }
    /**
    * Method to select multiple cells in the canvas
    */
    drawSelection(cellRange) {
        const { ctx } = this;
        const startRow = this.yIndex * this.grid.rowsPerCanvas;
        const startCol = this.xIndex * this.grid.colsPerCanvas;
        const { colWidths, rowHeights } = this.grid;
        console.log(cellRange);
        
        let y = 0;
        let x = 0;
    }
    /**
    * Method to select multiple cells in the canvas
    */
    drawMultiSelection(cellRange) {
        const { ctx } = this;
        const startRow = this.yIndex * this.grid.rowsPerCanvas;
        const startCol = this.xIndex * this.grid.colsPerCanvas;
        const { colWidths, rowHeights } = this.grid;

        // console.log("cellRange", cellRange, "this.selectCol", this.selectCol, "this.selectRow", this.selectRow);

        let y = 0;
        let x = 0;
        for (let r = 0; r < this.grid.rowsPerCanvas; r++) {
            let row = startRow + r;
            let rowHeight = rowHeights[row + 1];
            x = 0;
            for (let c = 0; c < this.grid.colsPerCanvas; c++) {
                let col = startCol + c;
                let colWidth = colWidths[col + 1];

                // if (cellRange.contains(row + 1, col + 1) && ((r + 1) !== this.selectRow || (c + 1) !== this.selectCol || this.selectRow!==null || this.selectCol!==null)) {
                if (cellRange.contains(row + 1, col + 1) && ((r + 1) !== this.selectRow || (c + 1) !== this.selectCol) && ((r + 1) !== cellRange.startRow || this.selectRow!==null || (c + 1) !== cellRange.startCol || this.selectCol!==null)) {
                    ctx.fillStyle = "rgba(16, 124, 65, 0.12)";
                    ctx.fillRect(x, y, colWidth, rowHeight);
                }
                x += colWidth;
            }
            y += rowHeight;
        }

        let startX = 0;
        for (let i = startCol; i < cellRange.getStartCol() - 1; i++) {
            startX += colWidths[i + 1]; // skip header
        }

        let startY = 0;
        for (let i = startRow; i < cellRange.getStartRow() - 1; i++) {
            startY += rowHeights[i + 1]; // skip header
        }

        let width = 0;
        for (let i = cellRange.getStartCol() - 1; i < cellRange.getEndCol(); i++) {
            if (i >= startCol && i < startCol + this.grid.colsPerCanvas) {
                width += colWidths[i + 1];
            }
        }

        let height = 0;
        for (let i = cellRange.getStartRow() - 1; i < cellRange.getEndRow(); i++) {
            if (i >= startRow && i < startRow + this.grid.rowsPerCanvas) {
                height += rowHeights[i + 1];
            }
        }

        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(startX, startY, width, height);
        ctx.lineWidth = 1;
    }

    /**
     * Method to remove the canvas element from the DOM 
     */
    removeCanvas() {
        this.canvas.remove();
    }
}
