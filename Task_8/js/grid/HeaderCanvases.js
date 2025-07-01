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

// Class for creating the horizontal canvas (column headers)
export class HorizontalCanvas {
    /**
     * Constructor for the HorizontalCanvas instance
     * @param {*} grid - Reference to the Grid instance
     * @param {*} xIndex - The x-index (column) for the canvas block
     * @param {*} yIndex - The y-index (row) for the canvas block
     */
    constructor(grid, xIndex, yIndex, globalCol) {
        // Store grid reference and indexes for canvas positioning
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.globalCol = globalCol || null;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
        //   grid.colsPerCanvas * grid.cellWidth;
        // `${window.innerWidth - grid.cellWidth}`;
        this.canvas.height = grid.cellHeight;

        // Set up the canvas styles
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = `${this.xIndex * this.canvas.width + grid.cellWidth}px`;
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "col-resize";

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initial drawing of the horizontal header
        this.createHCanvas();
    }

    /**
     * Method to create and render the horizontal header
     */
    createHCanvas() {
        const { ctx, grid, globalCol } = this;
        const { cellWidth, cellHeight } = grid;

        // Draw the horizontal header columns (A, B, C, ...)
        for (let c = 0; c < grid.colsPerCanvas; c++) {
            // Calculate the X and Y position for the current cell
            const x = c * cellWidth;
            const y = 0;

            // Draw the header cell
            if (c + 1 === (globalCol % grid.colsPerCanvas)) {
                // console.log((globalCol % 26), c);
                ctx.fillStyle = "#caead8";
                ctx.fillRect(x, y, cellWidth, cellHeight);

                // Draw right line
                ctx.beginPath();
                ctx.strokeStyle = "#107c41";
                ctx.lineWidth = 5;
                ctx.moveTo(x, y + cellHeight + 0.5);
                ctx.lineTo(x + cellWidth, y + cellHeight + 0.5);
                ctx.stroke();
                ctx.lineWidth = 1;
            } else {
                ctx.fillStyle = "#f5f5f5";
                ctx.fillRect(x, y, cellWidth, cellHeight);

                // Draw right line
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.2)";
                ctx.moveTo(x + cellWidth, y + 2);
                ctx.lineTo(x + cellWidth, y + cellHeight + 2);
                ctx.stroke();
            }

            // Generate the label for the column header (A, B, C, ...)
            let label = "", index = c + 1 + (this.xIndex * grid.colsPerCanvas);
            // console.log(index);

            while (index > 0) {
                label = String.fromCharCode(((index - 1) % 26) + 65) + label;
                index = Math.floor((index - 1) / 26);
            }

            // Draw the label in the center of each header cell
            ctx.fillStyle = "#333";
            ctx.font = "11pt Segoe UI, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, x + cellWidth / 2, cellHeight / 2);
        }
    }

    /**
    * Method to remove the horizontal canvas from the DOM
    */
    removeCanvas() {
        this.canvas.remove();
    }
}

// Class for creating the vertical canvas (row headers)
export class VerticalCanvas {
    /**
     * Constructor for the HorizontalCanvas instance
     * @param {*} grid - Reference to the Grid instance
     */
    constructor(grid, xIndex, yIndex, globalRow) {
        // Store grid reference and indexes for canvas positioning
        this.grid = grid;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.globalRow = globalRow || null;

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = grid.cellWidth;
        this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;
        // `${this.clientHeight - grid.cellHeight}`;
        // grid.rowsPerCanvas * grid.cellHeight;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = `${this.yIndex * this.canvas.height + grid.cellHeight}px`;
        // console.log(yIndex * this.canvas.height + grid.cellHeight);
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "row-resize";

        // Append the canvas element to the wrapper
        grid.wrapper.appendChild(this.canvas);

        // Initial drawing of the vertical header
        this.createVCanvas();
    }
    /**
     * Method to create and render the horizontal header
     */
    createVCanvas() {
        const { ctx, grid, globalRow } = this;

        // Draw the vertical header rows (1, 2, 3, ...)
        for (let r = 0; r < grid.rowsPerCanvas; r++) {
            // Calculate the X and Y position for the current cell
            const y = r * grid.cellHeight;
            const x = 0;

            // Draw the header cell
            if (r + 1 === (globalRow % grid.rowsPerCanvas)) {
                // console.log((globalRow%50), r);
                ctx.fillStyle = "#caead8";
                ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

                // Right line
                ctx.beginPath();
                ctx.strokeStyle = "#107c41";
                ctx.lineWidth = 5;
                ctx.moveTo(x + grid.cellWidth + 0.5, y);
                ctx.lineTo(x + grid.cellWidth + 0.5, y + grid.cellHeight);
                ctx.stroke();
                ctx.lineWidth = 1;

            } else {
                ctx.fillStyle = "#f5f5f5";
                ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);

                // Top line (except the first row)
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.moveTo(x + 0.5, y + 0.5);
                ctx.lineTo(x + grid.cellWidth + 0.5, y + 0.5);
                ctx.stroke();

                // Right line
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.lineWidth = 1;
                ctx.moveTo(x + grid.cellWidth, y);
                ctx.lineTo(x + grid.cellWidth, y + grid.cellHeight);
                ctx.stroke();
            }



            // Draw the row number in the right of each header cell
            ctx.fillStyle = "#333";
            ctx.font = "11pt Segoe UI, sans-serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText((r + 1 + (this.yIndex * grid.rowsPerCanvas)).toString(), grid.cellWidth / 2, y + grid.cellHeight / 2);
        }

        return this.canvas;
    }
    /**
     * Method to remove the horizontal canvas from the DOM
     */
    removeCanvas() {
        this.canvas.remove();
    }
}