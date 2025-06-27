// Class for createing a single canvas block
export class Canvas {
    /**
     * Constructor for the Canvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex) {
        // Store grid reference and indexes for canvas positioning
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        // Create the canvas element
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("class", "canvas-div");
        this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
        this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${xIndex * this.canvas.width + 80}px`;  // Offset by {80px} for positioning
        this.canvas.style.top = `${yIndex * this.canvas.height + 25}px`;  // Offset by {25px} for positioning

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initialize canvas by drawing the grid cells and content
        this.craeteCanvas();
    }

    /**
     * Method to create and render the canvas cells
     */
    craeteCanvas() {
        const { ctx, grid } = this;  // Destructure grid and context
        const { cellWidth, cellHeight, dataset } = grid;  // Destructure cell width, height, and dataset

        // const columnNames = dataset.length > 0 ? dataset[0] : [];  // Get column names from dataset
        const columnNames = dataset.length > 0 ? Object.keys(dataset[0]) : [];  // Get column names from dataset
        // console.log(columnNames);

        // Draw cells within a canvas block
        for (let r = 0; r < grid.rowsPerCanvas; r++) {
            for (let c = 0; c < grid.colsPerCanvas; c++) {
                // Calculate the global row and column index for data mapping
                const globalRow = this.yIndex * grid.rowsPerCanvas + r;
                const globalCol = this.xIndex * grid.colsPerCanvas + c;

                // Calculate the X and Y position for the current cell
                const x = c * cellWidth;
                const y = r * cellHeight;

                // Draw top line
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.moveTo(x + 0.5, y + 0.5);
                ctx.lineTo(x + grid.cellWidth + 0.5, y + 0.5);
                ctx.stroke();

                // Draw right line
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.moveTo(x + grid.cellWidth + 0.5, y + 0.5);
                ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight + 0.5);
                ctx.stroke();

                // Draw column names (first row)
                if (globalRow === 0) {
                    // const dataColIndex = globalCol;

                    // if (columnNames[dataColIndex]) {
                    //     ctx.fillStyle = "#000";
                    //     ctx.font = "bold 14px Arial";
                    //     ctx.textAlign = "left";
                    //     ctx.textBaseline = "middle";
                    //     ctx.fillText(String(columnNames[dataColIndex]).toUpperCase().slice(0, 8), x + 4, y + cellHeight / 2);
                    // }
                } else {
                    // Draw cell data for all other rows (excluding header)
                    const dataRowIndex = globalRow-1;  // row 0 = header, 1 = column names
                    const dataColIndex = globalCol;  // col 0 = row number header
                    // console.log("dataRowIndex", dataRowIndex, "dataColIndex", dataColIndex);
                    // If there's data available 
                    if (dataset[dataRowIndex] && columnNames[dataColIndex]) {
                        const cellValue = dataset[dataRowIndex][dataColIndex];
                        // console.log("cellValue", cellValue);
                        if (cellValue !== undefined && cellValue !== null) {
                            ctx.fillStyle = "#000";
                            ctx.font = "14px Arial";
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            ctx.fillText(String(cellValue).slice(0, 8), x + 4, y + cellHeight / 2);  // Render the cell value
                        }
                    }
                }

                // // Draw cell data for all other rows (excluding header)
                // const dataRowIndex = globalRow;  // row 0 = header, 1 = column names
                // const dataColIndex = globalCol;  // col 0 = row number header
                // // console.log("dataRowIndex", dataRowIndex, "dataColIndex", dataColIndex);
                // // If there's data available 
                // if (dataset[dataRowIndex] && columnNames[dataColIndex]) {
                //     const cellValue = dataset[dataRowIndex][dataColIndex];
                //     console.log("cellValue", cellValue);
                //     if (cellValue !== undefined && cellValue !== null) {
                //         ctx.fillStyle = "#000";
                //         if (globalRow === 0) {
                //             ctx.font = "bold 14px Arial";
                //         }
                //         ctx.font = "14px Arial";
                //         ctx.textAlign = "left";
                //         ctx.textBaseline = "middle";
                //         ctx.fillText(String(cellValue).slice(0, 8), x + 4, y + cellHeight / 2);  // Render the cell value
                //     }
                // }
            }
        }
    }

    /**
     * Method to remove the canvas element from the DOM 
     */
    removeCanvas() {
        this.canvas.remove();
    }
}
