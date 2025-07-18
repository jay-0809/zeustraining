// Class for creating a single canvas block
export class Canvas {
    /**
     * Constructor for the Canvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex, globalColOffset, globalRowOffset, selectCol, selectRow, selectCols, selectRows) {
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.selectCol = selectCol || null;
        this.selectRow = selectRow || null;
        this.selectCols = selectCols;
        this.selectRows = selectRows;
        // console.log(this.selectRows);

        const { colWidths, rowHeights, colsPerCanvas, rowsPerCanvas } = grid;
        this.startCol = globalColOffset;
        // this.startCol = globalColOffset + xIndex * colsPerCanvas;
        this.startRow = globalRowOffset;
        // this.startRow = globalRowOffset + yIndex * rowsPerCanvas;

        // console.log("grid-startCol", globalColOffset,"startRow", globalRowOffset);

        // Calculate dynamic width
        let width = 0;
        for (let c = 0; c < colsPerCanvas; c++) {
            width += colWidths[xIndex * colsPerCanvas + 1 + c] || 0;
        }
        // Calculate dynamic height
        let height = 0;
        for (let r = 0; r < rowsPerCanvas; r++) {
            height += rowHeights[yIndex * rowsPerCanvas + 1 + r] || 0;
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
        for (let i = 0; i < this.startCol; i++) {
            leftOffset += colWidths[i + 1] || 0;
        }

        let topOffset = grid.rowHeights[0]; // Space for column header
        for (let i = 0; i < this.startRow; i++) {
            topOffset += rowHeights[i + 1] || 0;
        }

        // console.log("leftOffset",leftOffset,"topOffset",topOffset);
        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${leftOffset - grid.scrollX}px`;
        this.canvas.style.top = `${topOffset - grid.scrollY}px`;

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initialize canvas by drawing the grid cells and content
        this.createCanvas();
    }
    /**
     * Method to create and render the canvas cells
     */
    createCanvas() {
        const { ctx, grid } = this;  // Destructure grid and context
        const { dataset, rowsPerCanvas, colsPerCanvas, colWidths, rowHeights } = grid;  // Destructure cell width, height, and dataset
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const startRow = this.startRow;
        const startCol = this.startCol;

        // this.clearSelection();

        if (grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) {
            // console.log(grid.pointer?.cellSelector?.cellRange?.isValid(), grid.pointer?.cellSelector?.dragged, grid.multiEditing);
            this.drawMultiSelection(grid.pointer?.cellSelector?.cellRange);
        }

        // console.log(this.selectCols, this.selectRows);
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

                const isColSelected = this.selectCols &&
                    globalCol + 1 >= this.selectCols.start && globalCol + 1 <= this.selectCols.end;

                const isRowSelected = this.selectRows &&
                    globalRow + 1 >= this.selectRows.start && globalRow + 1 <= this.selectRows.end;

                if (isColSelected || isRowSelected) {
                    ctx.fillStyle = "#caead8";
                    ctx.fillRect(x, y, colWidth, rowHeight);
                }

                // Get the Row object for the globalRow
                const rowMap = dataset.get(globalRow);
                let cellData = rowMap instanceof Map ? rowMap.get(globalCol) || "" : "";

                // add logic for if cellData stratswith = then it perform +, -, *, / arithmetic operation same as excel for ex. =d5+d9 then it will get d-columns 5th and 9th row value and it has + in between then it add two cells(if number) and output display else normal cellData  
                if (typeof cellData === "string" && cellData.startsWith("=")) {
                    try {
                        const formula = cellData.slice(1); // Remove '='
                        const result = this.evaluateFormula(formula, dataset);
                        cellData = result;
                    } catch (e) {
                        // If formula evaluation fails, keep original
                        console.warn(`Invalid formula in cell [${globalRow},${globalCol}]: ${cellData}`);
                    }
                }

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
            ctx.strokeStyle = (this.selectRows !== null && (this.selectRows.start - 1 === globalRowIndex || this.selectRows.end === globalRowIndex))
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
            ctx.strokeStyle = (this.selectCols !== null && (this.selectCols.start - 1 === globalColIndex || this.selectCols.end === globalColIndex))
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
    drawMultiSelection(cellRange) {
        const { ctx } = this;
        const startRow = this.startRow;
        const startCol = this.startCol;
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
                if (cellRange.contains(row + 1, col + 1) && ((r + 1) !== this.selectRow || (c + 1) !== this.selectCol) && ((r + 1) !== cellRange.startRow || this.selectRow !== null || (c + 1) !== cellRange.startCol || this.selectCol !== null)) {
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

    evaluateFormula(formula, dataset) {
        const refRegex = /([a-zA-Z]+)(\d+)/g;
        const replaced = formula.replace(refRegex, (_, colLetter, rowStr) => {
            const colIndex = this.colLetterToIndex(colLetter.toUpperCase());
            const rowIndex = parseInt(rowStr, 10) - 1;
            const rowMap = dataset.get(rowIndex);
            const val = rowMap instanceof Map ? rowMap.get(colIndex) : null;
            return Number(val) || 0;
        });

        try {
            // Use Function constructor to evaluate expression safely
            const safeEval = new Function(`return (${replaced})`);
            return safeEval();
        } catch (e) {
            return formula; // Fallback if evaluation fails
        }
    }

    colLetterToIndex(col) {
        let index = 0;
        for (let i = 0; i < col.length; i++) {
            index = index * 26 + (col.charCodeAt(i) - 64);
        }
        return index - 1; // 0-based index
    }

    clearSelection() {
        document.querySelectorAll(".selection, .selection-block, .cell-input").forEach(el => {
            if (this.grid.wrapper.contains(el)) this.grid.wrapper.removeChild(el);
        });
    };
    /**
     * Method to remove the canvas element from the DOM 
     */
    removeCanvas() {
        this.canvas.remove();
    }
}
