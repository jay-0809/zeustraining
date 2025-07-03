// // Class for creating a single canvas block
// export class Canvas {
//     /**
//      * Constructor for the Canvas instance
//      * @param {*} grid - Reference to the Grid instance
//      * @param {*} xIndex - The x-index (column) for the canvas block
//      * @param {*} yIndex - The y-index (row) for the canvas block
//      */
//     constructor(grid, xIndex, yIndex, selectCol, selectRow) {
//         // Store grid reference and indexes for canvas positioning
//         this.grid = grid;
//         this.xIndex = xIndex;
//         this.yIndex = yIndex;
//         this.selectCol = selectCol || null;
//         this.selectRow = selectRow || null;

//         // console.log("globalCol", globalCol, "globalRow", globalRow);
//         // Create the canvas element
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");
//         this.canvas.setAttribute("class", "canvas-div");

//         this.canvas.width = (grid.colsPerCanvas * grid.cellWidth);
//         this.canvas.height = (grid.rowsPerCanvas * grid.cellHeight);

//         this.canvas.style.position = "absolute";
//         this.canvas.style.left = `${xIndex * this.canvas.width + grid.cellWidth}px`;  // Offset by 80px for positioning

//         this.canvas.style.top = `${yIndex * this.canvas.height + grid.cellHeight}px`;  // Offset by 25px for positioning

//         // Append the canvas element to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         // Initialize canvas by drawing the grid cells and content
//         this.createCanvas();
//     }

//     /**
//      * Method to create and render the canvas cells
//     */
//     createCanvas() {
//         const { ctx, grid, selectCol, selectRow } = this;  // Destructure grid and context
//         const { cellWidth, cellHeight, dataset } = grid;  // Destructure cell width, height, and dataset

//         // console.log("data:", dataset);
//         // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

//         // Draw cells within a canvas block
//         for (let r = 0; r < grid.rowsPerCanvas; r++) {
//             for (let c = 0; c < grid.colsPerCanvas; c++) {
//                 // Calculate the global row and column index for data mapping
//                 const globalRow = this.yIndex * grid.rowsPerCanvas + r;
//                 const globalCol = this.xIndex * grid.colsPerCanvas + c;

//                 // Calculate the X and Y position for the current cell
//                 const x = Math.floor(c * cellWidth);
//                 const y = Math.floor(r * cellHeight);

//                 if (selectRow === null && selectCol === globalCol + 1) {
//                     // console.log("selectCol", selectCol, "globalCol", globalCol);
//                     if (globalRow !== 0) {
//                         ctx.fillStyle = "#caead8";
//                         ctx.fillRect(x, y, cellWidth, cellHeight);
//                     }

//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw left line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x + 0.5, y);
//                     ctx.lineTo(x + 0.5, y + cellHeight);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x + cellWidth + 0.5, y);
//                     ctx.lineTo(x + cellWidth + 0.5, y + cellHeight);
//                     ctx.stroke();
//                 } else if (selectCol === null && selectRow === globalRow + 1) {
//                     // console.log("selectRow", selectRow, "globalRow", globalRow);
//                     if (globalCol !== 0) {
//                         ctx.fillStyle = "#caead8";
//                         ctx.fillRect(x, y, cellWidth, cellHeight);
//                     }
//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "#107c41";
//                     ctx.moveTo(x, y + cellHeight + 0.5);
//                     ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.3)";
//                     ctx.moveTo(x + cellWidth + 0.3, y);
//                     ctx.lineTo(x + cellWidth + 0.3, y + cellHeight);
//                     ctx.stroke();
//                 } else {
//                     // Draw top line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x, y + 0.5);
//                     ctx.lineTo(x + cellWidth, y + 0.5);
//                     ctx.stroke();

//                     // Draw right line
//                     ctx.beginPath();
//                     ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//                     ctx.moveTo(x + cellWidth + 0.5, y);
//                     ctx.lineTo(x + cellWidth + 0.5, y + cellHeight);
//                     ctx.stroke();
//                 }
//                 // Draw cell data for all rows (including header)
//                 if (dataset.length > 0) {
//                     let cellData = "";
//                     // Get the Row object for the globalRow
//                     const row = dataset[globalRow];
                    
//                     // Check if the Row and Cell exist, then fetch the cell value
//                     if (row && typeof row.getCell === "function") {
//                         const cell = row.getCell(globalCol);
//                         if (cell && typeof cell.getValue === "function") {
//                             cellData = cell.getValue();
//                             // console.log(globalRow, globalCol, cellData);
//                         }
//                     }

//                     // Set text style (bold for header row)
//                     ctx.fillStyle = "#000";
//                     ctx.font = (globalRow === 0) ? "bold 14px Arial" : "14px Arial";
//                     ctx.textBaseline = "middle";
//                     if (Number(cellData)) {
//                         ctx.textAlign = "left";
//                     } else {
//                         ctx.textAlign = "left";
//                     }

//                     // Limit text to 8 characters and render it
//                     const text = (globalRow === 0)
//                         ? String(cellData).toUpperCase().slice(0, 8)
//                         : String(cellData).slice(0, 8);

//                     // Draw the text inside the cell
//                     ctx.fillText(text, x + 4, y + cellHeight / 2);
//                 }
//             }
//         }
//     }

//     /**
//      * Method to remove the canvas element from the DOM 
//      */
//     removeCanvas() {
//         this.canvas.remove();
//     }
// }
export class Canvas {
    constructor(grid, xIndex, yIndex) {
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
        this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${this.xIndex * this.canvas.width + grid.cellWidth}px`;
        this.canvas.style.top = `${this.yIndex * this.canvas.height + grid.cellHeight}px`;

        grid.wrapper.appendChild(this.canvas);

        this.createCanvas();
    }

    createCanvas() {
        const { ctx, grid, canvas, xIndex, yIndex } = this;

        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < grid.rowsPerCanvas; r++) {
            for (let c = 0; c < grid.colsPerCanvas; c++) {
                const globalRow = yIndex * grid.rowsPerCanvas + r + 1;
                const globalCol = xIndex * grid.colsPerCanvas + c + 1;

                const x = c * grid.cellWidth;
                const y = r * grid.cellHeight;

                // Highlight if selected column or row
                if (grid.selectedCols.has(globalCol) || grid.selectedRows.has(globalRow)) {
                    ctx.fillStyle = "#D0F0D8"; // light green highlight
                    ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);
                } else {
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);
                }

                ctx.strokeStyle = "#ccc";
                ctx.strokeRect(x+0.5, y+0.5, grid.cellWidth + 0.5, grid.cellHeight + 0.5);

                // Draw cell text if available
                const rowData = grid.dataset[globalRow - 1];
                let text = "";
                if (rowData && typeof rowData.getCell === "function") {
                    const cell = rowData.getCell(globalCol - 1);
                    if (cell && typeof cell.getValue === "function") {
                        text = cell.getValue();
                    }
                }

                ctx.fillStyle = "#000";
                ctx.font = "10pt Segoe UI, sans-serif";
                ctx.textBaseline = "middle";
                ctx.textAlign = "left";

                ctx.fillText(text, x + 5, y + grid.cellHeight / 2);
            }
        }
    }

    removeCanvas() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}
