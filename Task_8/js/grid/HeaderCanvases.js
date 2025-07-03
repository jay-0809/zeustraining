// Function to create and append the top-left sticky corner, horizontal, and vertical canvases
export function topDiv(grid) {
    const wrapper = grid.wrapper;

    //  Top-left corner 
    const topDiv = document.createElement("div"); // Create top-left div 
    topDiv.style.position = "sticky";
    topDiv.style.top = "0";
    topDiv.style.left = "0";
    topDiv.style.backgroundColor = "#f5f5f5";
    topDiv.style.borderRight = "2px solid #bdbdbd";
    topDiv.style.borderBottom = "2px solid #bdbdbd";
    topDiv.style.zIndex = "100000";
    topDiv.style.width = `${grid.cellWidth - 2}px`;
    topDiv.style.height = `${grid.cellHeight - 2}px`;
    topDiv.style.cursor = `cell`;

    const topRect = document.createElement("div");
    topRect.setAttribute("class", "top-rect");
    topDiv.appendChild(topRect);
    wrapper.appendChild(topDiv); // Append the created topDiv to the grid wrapper
}

// // Class for creating the horizontal canvas (column headers) 
// export class HorizontalCanvas {
//     /**
//      * Constructor for the HorizontalCanvas instance
//      * @param {*} grid - Reference to the Grid instance
//      * @param {*} xIndex - The x-index (column) for the canvas block
//      * @param {*} yIndex - The y-index (row) for the canvas block
//      */
//     constructor(grid, xIndex, yIndex, globalCol, globalRow) {
//         // Store grid reference and indexes for canvas positioning
//         this.grid = grid;
//         this.xIndex = xIndex;
//         this.yIndex = yIndex;
//         this.globalCol = globalCol || null;
//         this.globalRow = globalRow || null;
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
//         //   grid.colsPerCanvas * grid.cellWidth;
//         // `${window.innerWidth - grid.cellWidth}`;
//         this.canvas.height = grid.cellHeight;

//         // Set up the canvas styles
//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = "0";
//         this.canvas.style.left = `${this.xIndex * this.canvas.width + grid.cellWidth}px`;
//         this.canvas.style.zIndex = "1000";
//         this.canvas.style.cursor = "col-resize";

//         // Append the canvas element to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         // Initial drawing of the horizontal header
//         this.createHCanvas();
//     }

//     /**
//      * Method to create and render the horizontal header
//      */
//     createHCanvas() {
//         const { ctx, grid, globalCol, globalRow } = this;
//         const { cellWidth, cellHeight } = grid;

//         // Draw the horizontal header columns (A, B, C, ...)
//         for (let c = 0; c < grid.colsPerCanvas; c++) {
//             // Calculate the X and Y position for the current cell
//             const x = c * cellWidth;
//             const y = 0;

//             // Draw the header cell
//             if (((c + 1) + (this.xIndex * grid.colsPerCanvas)) === globalCol && globalRow === null) {
//                 ctx.fillStyle = "#107c41";
//                 ctx.fillRect(x, y, cellWidth, cellHeight);
//             } else if (globalRow !== null && globalCol === null) {
//                 ctx.fillStyle = "#caead8";
//                 ctx.fillRect(x, y, cellWidth, cellHeight);

//                 // Draw right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.moveTo(x + cellWidth, y + 2);
//                 ctx.lineTo(x + cellWidth, y + cellHeight + 2);
//                 ctx.stroke();

//                 // Draw bottom line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.lineWidth = 5;
//                 ctx.moveTo(x, y + cellHeight + 0.5);
//                 ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//                 ctx.stroke();
//                 ctx.lineWidth = 0.5;
//             }
//             else if (((c + 1) + (this.xIndex * grid.colsPerCanvas)) === globalCol) {
//                 // console.log((globalCol % 26), c);
//                 ctx.fillStyle = "#caead8";
//                 ctx.fillRect(x, y, cellWidth, cellHeight);

//                 // Draw bottom line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.lineWidth = 5;
//                 ctx.moveTo(x, y + cellHeight + 0.5);
//                 ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//                 ctx.stroke();
//                 ctx.lineWidth = 0.5;
//             } else {
//                 ctx.fillStyle = "#f5f5f5";
//                 ctx.fillRect(x, y, cellWidth, cellHeight);

//                 // Draw right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "rgba(33, 62, 64, 0.2)";
//                 ctx.moveTo(x + cellWidth, y + 2);
//                 ctx.lineTo(x + cellWidth, y + cellHeight + 2);
//                 ctx.stroke();
//             }

//             // Generate the label for the column header (A, B, C, ...)
//             let label = "", index = c + 1 + (this.xIndex * grid.colsPerCanvas);
//             // console.log(index);

//             while (index > 0) {
//                 label = String.fromCharCode(((index - 1) % 26) + 65) + label;
//                 index = Math.floor((index - 1) / 26);
//             }

//             // Draw the label in the center of each header cell
//             if (globalRow !== null && globalCol === null) {
//                 ctx.fillStyle = "#107c41";
//             } else {
//                 ctx.fillStyle = c + 1 === (globalCol % grid.colsPerCanvas) && globalRow === null ? "#fff" : "#333";
//             }
//             if (globalRow !== null && globalCol === null) {
//                 ctx.font = "bold 11pt Segoe UI, sans-serif";
//             } else {
//                 ctx.font = c + 1 === (globalCol % grid.colsPerCanvas) && globalRow === null ? "bold 11pt Segoe UI, sans-serif" : "11pt Segoe UI, sans-serif";
//             }
//             ctx.textAlign = "center";
//             ctx.textBaseline = "middle";
//             ctx.fillText(label, x + cellWidth / 2, cellHeight / 2);
//         }
//     }

//     /**
//     * Method to remove the horizontal canvas from the DOM
//     */
//     removeCanvas() {
//         this.canvas.remove();
//     }
// }

// // Class for creating the vertical canvas (row headers)
// export class VerticalCanvas {
//     /**
//      * Constructor for the HorizontalCanvas instance
//      * @param {*} grid - Reference to the Grid instance
//      */
//     constructor(grid, xIndex, yIndex, globalCol, globalRow) {
//         // Store grid reference and indexes for canvas positioning
//         this.grid = grid;
//         this.xIndex = xIndex;
//         this.yIndex = yIndex;
//         this.globalCol = globalCol || null;
//         this.globalRow = globalRow || null;

//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.canvas.width = grid.cellWidth;
//         this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;
//         // `${this.clientHeight - grid.cellHeight}`;
//         // grid.rowsPerCanvas * grid.cellHeight;

//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = `${this.yIndex * this.canvas.height + grid.cellHeight}px`;
//         // console.log(yIndex * this.canvas.height + grid.cellHeight);
//         this.canvas.style.left = "0";
//         this.canvas.style.zIndex = "1000";
//         this.canvas.style.cursor = "row-resize";

//         // Append the canvas element to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         // Initial drawing of the vertical header
//         this.createVCanvas();
//     }
//     /**
//      * Method to create and render the horizontal header
//      */
//     createVCanvas() {
//         const { ctx, grid, globalCol, globalRow } = this;

//         // Draw the vertical header rows (1, 2, 3, ...)
//         for (let r = 0; r < grid.rowsPerCanvas; r++) {
//             // Calculate the X and Y position for the current cell
//             const y = r * grid.cellHeight;
//             const x = 0;

//             // console.log(((r + 1) + (this.yIndex * grid.rowsPerCanvas)), globalRow);

//             // Draw the header cell
//             if (((r + 1) + (this.yIndex * grid.rowsPerCanvas)) === globalRow && globalCol === null) {
//                 ctx.fillStyle = "#107c41";
//                 ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);
//             } else if (globalRow === null && globalCol !== null) {
//                 ctx.fillStyle = "#caead8";
//                 ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//                 // Top line (except the first row)
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 // ctx.lineWidth = 0.5;
//                 ctx.moveTo(x, y + 0.5);
//                 ctx.lineTo(x + grid.cellWidth, y + 0.5);
//                 ctx.stroke();

//                 // Right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.lineWidth = 3;
//                 ctx.moveTo(x + grid.cellWidth + 0.5, y);
//                 ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
//                 ctx.stroke();
//                 ctx.lineWidth = 0.5;
//             }
//             else if (((r + 1) + (this.yIndex * grid.rowsPerCanvas)) === globalRow) {
//                 // console.log((globalRow%50), r);
//                 ctx.fillStyle = "#caead8";
//                 ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//                 // Right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "#107c41";
//                 ctx.lineWidth = 5;
//                 ctx.moveTo(x + grid.cellWidth + 0.5, y);
//                 ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
//                 ctx.stroke();
//                 ctx.lineWidth = 1;

//             } else {
//                 ctx.fillStyle = "#f5f5f5";
//                 ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

//                 // Top line (except the first row)
//                 ctx.beginPath();
//                 ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                 ctx.moveTo(x, y + 0.5);
//                 ctx.lineTo(x + grid.cellWidth, y + 0.5);
//                 ctx.stroke();

//                 // Right line
//                 ctx.beginPath();
//                 ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                 ctx.lineWidth = 1;
//                 ctx.moveTo(x + grid.cellWidth - 0.5, y);
//                 ctx.lineTo(x + grid.cellWidth - 0.5, y + grid.cellHeight);
//                 ctx.stroke();
//             }



//             // Draw the row number in the right of each header cell
//             if (globalRow === null && globalCol !== null) {
//                 ctx.fillStyle = "#107c41";
//             } else {
//                 ctx.fillStyle = r + 1 === (globalRow % grid.rowsPerCanvas) && globalCol === null ? "#fff" : "#333";
//             }
//             if (globalRow === null && globalCol !== null) {
//                 ctx.font = "bold 11pt Segoe UI, sans-serif";
//             } else {
//                 ctx.font = r + 1 === (globalRow % grid.rowsPerCanvas) && globalCol === null ? "bold 11pt Segoe UI, sans-serif" : "11pt Segoe UI, sans-serif";
//             }
//             ctx.textAlign = "right";
//             ctx.textBaseline = "middle";
//             ctx.fillText((r + 1 + (this.yIndex * grid.rowsPerCanvas)).toString(), grid.cellWidth / 2, y + grid.cellHeight / 2);
//         }

//         return this.canvas;
//     }
//     /**
//      * Method to remove the horizontal canvas from the DOM
//      */
//     removeCanvas() {
//         this.canvas.remove();
//     }
// }

// Class for creating the horizontal canvas (column headers) 
export class HorizontalCanvas {
    /**
     * Constructor for the HorizontalCanvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex, globalCol, globalRow) {
        // Store grid reference and indexes for canvas positioning
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.globalCol = globalCol || null;
        this.globalRow = globalRow || null;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
        this.canvas.height = grid.cellHeight;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        this.canvas.style.left = `${this.xIndex * this.canvas.width + grid.cellWidth}px`;
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "col-resize";

        grid.wrapper.appendChild(this.canvas);

        this.isDragging = false;
        this.dragStartCol = null;

        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.createHCanvas();
    }

    onMouseDown(e) {
        // if (!e.ctrlKey) return;
        const colIndex = this.getColFromEvent(e);
        if (colIndex === null) return;

        this.isDragging = true;
        this.dragStartCol = colIndex;

        if (this.grid.selectedCols.has(colIndex)) {
            this.grid.selectedCols.delete(colIndex);
        } else {
            this.grid.selectedCols.add(colIndex);
        }
        this.grid.redrawAll();

        e.preventDefault();
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        // if (!e.ctrlKey) {
        //     this.isDragging = false;
        //     return;
        // }

        const colIndex = this.getColFromEvent(e);
        if (colIndex === null) return;

        const start = Math.min(this.dragStartCol, colIndex);
        const end = Math.max(this.dragStartCol, colIndex);

        this.grid.selectedCols.clear();
        for (let i = start; i <= end; i++) {
            this.grid.selectedCols.add(i);
        }
        this.grid.redrawAll();

        e.preventDefault();
    }

    onMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    getColFromEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const localCol = Math.floor(x / this.grid.cellWidth);
        if (localCol < 0 || localCol >= this.grid.colsPerCanvas) return null;

        return this.xIndex * this.grid.colsPerCanvas + localCol + 1;
    }

    createHCanvas() {
        const { ctx, grid, globalCol, globalRow } = this;
        const { cellWidth, cellHeight } = grid;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let c = 0; c < grid.colsPerCanvas; c++) {
            const x = c * cellWidth;
            const y = 0;

            const globalCol = this.xIndex * grid.colsPerCanvas + c + 1;

            if (grid.selectedCols.has(globalCol)) {
                ctx.fillStyle = "#107c41";
                ctx.fillRect(x, y, cellWidth, cellHeight);
                ctx.fillStyle = "#fff";
                ctx.font = "bold 11pt Segoe UI, sans-serif";
            } else {
                ctx.fillStyle = "#f5f5f5";
                ctx.fillRect(x, y, cellWidth, cellHeight);
                ctx.fillStyle = "#333";
                ctx.font = "11pt Segoe UI, sans-serif";
            }

            ctx.beginPath();
            ctx.strokeStyle = "rgba(33, 62, 64, 0.2)";
            ctx.lineWidth = 1;
            ctx.moveTo(x + cellWidth - 0.3, y);
            ctx.lineTo(x + cellWidth - 0.3, y + cellHeight);
            ctx.stroke();

            let label = "";
            let index = globalCol;
            while (index > 0) {
                label = String.fromCharCode(((index - 1) % 26) + 65) + label;
                index = Math.floor((index - 1) / 26);
            }

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, x + cellWidth / 2, cellHeight / 2);
        }
    }

    removeCanvas() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

export class VerticalCanvas {
    constructor(grid, xIndex, yIndex) {
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = grid.cellWidth;
        this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = `${this.yIndex * this.canvas.height + grid.cellHeight}px`;
        this.canvas.style.left = "0px";
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "row-resize";

        grid.wrapper.appendChild(this.canvas);

        this.isDragging = false;
        this.dragStartRow = null;

        this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.createVCanvas();
    }

    onMouseDown(e) {
        if (!e.ctrlKey) return;
        const rowIndex = this.getRowFromEvent(e);
        if (rowIndex === null) return;

        this.isDragging = true;
        this.dragStartRow = rowIndex;

        if (this.grid.selectedRows.has(rowIndex)) {
            this.grid.selectedRows.delete(rowIndex);
        } else {
            this.grid.selectedRows.add(rowIndex);
        }
        this.grid.redrawAll();

        e.preventDefault();
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        if (!e.ctrlKey) {
            this.isDragging = false;
            return;
        }

        const rowIndex = this.getRowFromEvent(e);
        if (rowIndex === null) return;

        const start = Math.min(this.dragStartRow, rowIndex);
        const end = Math.max(this.dragStartRow, rowIndex);

        this.grid.selectedRows.clear();
        for (let i = start; i <= end; i++) {
            this.grid.selectedRows.add(i);
        }
        this.grid.redrawAll();

        e.preventDefault();
    }

    onMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    getRowFromEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;

        const localRow = Math.floor(y / this.grid.cellHeight);
        if (localRow < 0 || localRow >= this.grid.rowsPerCanvas) return null;

        return this.yIndex * this.grid.rowsPerCanvas + localRow + 1;
    }

    createVCanvas() {
        const ctx = this.ctx;
        const grid = this.grid;
        const { cellWidth, cellHeight } = grid;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < grid.rowsPerCanvas; r++) {
            const y = r * cellHeight;
            const x = 0;

            const globalRow = this.yIndex * grid.rowsPerCanvas + r + 1;

            if (grid.selectedRows.has(globalRow)) {
                ctx.fillStyle = "#107c41";
                ctx.fillRect(x, y, cellWidth, cellHeight);
                ctx.fillStyle = "#fff";
                ctx.font = "bold 11pt Segoe UI, sans-serif";
            } else {
                ctx.fillStyle = "#f5f5f5";
                ctx.fillRect(x, y, cellWidth, cellHeight);
                ctx.fillStyle = "#333";
                ctx.font = "11pt Segoe UI, sans-serif";
            }

            ctx.beginPath();
            ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(x, y + 0.5);
            ctx.lineTo(x + cellWidth, y + 0.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
            ctx.moveTo(x + cellWidth - 0.5, y);
            ctx.lineTo(x + cellWidth - 0.5, y + cellHeight);
            ctx.stroke();

            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(globalRow.toString(), cellWidth / 2, y + cellHeight / 2);
        }
    }

    removeCanvas() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// export function topDiv(grid) {
//     const topDiv = document.createElement("div");
//     topDiv.style.position = "absolute";
//     topDiv.style.top = "0";
//     topDiv.style.left = "0";
//     topDiv.style.width = `${grid.cellWidth}px`;
//     topDiv.style.height = `${grid.cellHeight}px`;
//     topDiv.style.backgroundColor = "#107c41";
//     topDiv.style.zIndex = "1100";

//     grid.wrapper.appendChild(topDiv);
// }
