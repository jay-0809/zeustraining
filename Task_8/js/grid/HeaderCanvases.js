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
     */
    constructor(grid) {
        this.grid = grid;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        // Set up the canvas styles
        this.canvas.style.position = "sticky";
        this.canvas.style.top = "0";
        this.canvas.style.left = `${grid.cellWidth}px`;
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "col-resize";

        this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
        //   grid.colsPerCanvas * grid.cellWidth;
        // `${window.innerWidth - grid.cellWidth}`;
        this.canvas.height = grid.cellHeight;

        // Initial drawing of the horizontal header
        this.createHCanvas();
    }

    /**
     * Method to create and render the horizontal header
     */
    createHCanvas() {
        const { ctx, grid } = this;
        const { cellWidth, cellHeight } = grid;

        // Draw the horizontal header columns (A, B, C, ...)
        for (let c = 0; c < grid.colsPerCanvas; c++) {
            const x = c * cellWidth;
            const y = 0;
            // Draw the header cell
            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(x, y, cellWidth, cellHeight);
            // Draw the right line of the header cell
            ctx.beginPath();
            ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
            ctx.lineWidth = 1;
            ctx.moveTo(x + cellWidth, y);
            ctx.lineTo(x + cellWidth, y + cellHeight);
            ctx.stroke();
            // Generate the label for the column header (A, B, C, ...)
            let label = "", index = c + 1;
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
    constructor(grid) {
        this.grid = grid;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.style.position = "sticky";
        this.canvas.style.top = `${grid.cellHeight}px`;
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "1000";
        this.canvas.style.cursor = "row-resize";

        this.canvas.width = grid.cellWidth;
        this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;
        // `${this.clientHeight - grid.cellHeight}`;
        // grid.rowsPerCanvas * grid.cellHeight;

        // Initial drawing of the vertical header
        this.createVCanvas();
    }
    /**
     * Method to create and render the horizontal header
     */
    createVCanvas() {
        const { ctx, grid } = this;

        // Draw the vertical header rows (1, 2, 3, ...)
        for (let r = 0; r < 2 * grid.rowsPerCanvas; r++) {
            const y = r * grid.cellHeight;
            const x = 0;

            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(0, y, grid.cellWidth, grid.cellHeight);
            // Top line (except the first row)
            if (r !== 0) {
                ctx.beginPath();
                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.moveTo(x + 0.5, y + 0.5);
                ctx.lineTo(x + grid.cellWidth + 0.5, y + 0.5);
                ctx.stroke();
            }
            // Right line
            ctx.beginPath();
            ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
            ctx.lineWidth = 1;
            ctx.moveTo(x + grid.cellWidth, y);
            ctx.lineTo(x + grid.cellWidth, y + grid.cellHeight);
            ctx.stroke();
            // Draw the row number in the right of each header cell
            ctx.fillStyle = "#333";
            ctx.font = "11pt Segoe UI, sans-serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText((r + 1).toString(), grid.cellWidth / 2, y + grid.cellHeight / 2);
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







// // Horizontal Header Canvas
// export class HorizontalCanvas {
//     constructor(grid, index) {
//         this.grid = grid;
//         this.index = index; // Store index for horizontal positioning
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         // Set up canvas styles
//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = "0";
//         this.canvas.style.left = `${this.index * grid.colsPerCanvas * grid.cellWidth}px`;
//         this.canvas.style.zIndex = "1000";

//         this.canvas.width = grid.colsPerCanvas * grid.cellWidth;
//         this.canvas.height = grid.cellHeight;

//         // Append canvas to the wrapper
//         grid.wrapper.appendChild(this.canvas);

//         this.createHCanvas();
//     }

//     createHCanvas() {
//         const { ctx, grid } = this;

//         // Draw columns for horizontal header
//         for (let c = 0; c < grid.colsPerCanvas; c++) {
//             const x = c * grid.cellWidth;
//             const y = 0;
//             // Draw header background
//             ctx.fillStyle = "#f5f5f5";
//             ctx.fillRect(x, y, grid.cellWidth, grid.cellHeight);
//             // Add header line
//             ctx.beginPath();
//             ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//             ctx.moveTo(x + grid.cellWidth, y);
//             ctx.lineTo(x + grid.cellWidth, y + grid.cellHeight);
//             ctx.stroke();
//             // Column header label
//             let label = "", index = c + 1 + (this.index*grid.colsPerCanvas);
//             // console.log(index);
            
//             while (index > 0) {
//                 label = String.fromCharCode(((index - 1) % 26) + 65) + label;
//                 index = Math.floor((index - 1) / 26);
//             }
//             // Draw label
//             ctx.fillStyle = "#333";
//             ctx.font = "11pt Segoe UI, sans-serif";
//             ctx.textAlign = "center";
//             ctx.textBaseline = "middle";
//             ctx.fillText(label, x + grid.cellWidth / 2, grid.cellHeight / 2);
//         }
//     }

//     removeCanvas() {
//         this.canvas.remove();
//     }
// }

// // Vertical Header Canvas
// export class VerticalCanvas {
//     constructor(grid, index) {
//         console.log(index);
        
//         this.grid = grid;
//         this.index = index; // Store index for vertical positioning
//         this.canvas = document.createElement("canvas");
//         this.ctx = this.canvas.getContext("2d");

//         this.canvas.style.position = "absolute";
//         this.canvas.style.top = `${this.index * grid.rowsPerCanvas * grid.cellHeight}px`;
//         this.canvas.style.left = "0";
//         this.canvas.style.zIndex = "1000";

//         this.canvas.width = grid.cellWidth;
//         this.canvas.height = grid.rowsPerCanvas * grid.cellHeight;

//         grid.wrapper.appendChild(this.canvas);

//         this.createVCanvas();
//     }

//     createVCanvas() {
//         const { ctx, grid } = this;

//         // Draw vertical headers
//         for (let r = 0; r < grid.rowsPerCanvas; r++) {
//             const y = r * grid.cellHeight;
//             const x = 0;

//             ctx.fillStyle = "#f5f5f5";
//             ctx.fillRect(0, y, grid.cellWidth, grid.cellHeight);
//             ctx.beginPath();
//             ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
//             ctx.moveTo(x + grid.cellWidth, y);
//             ctx.lineTo(x + grid.cellWidth, y + grid.cellHeight);
//             ctx.stroke();
//             // Row number label
//             ctx.fillStyle = "#333";
//             ctx.font = "11pt Segoe UI, sans-serif";
//             ctx.textAlign = "right";
//             ctx.textBaseline = "middle";
//             ctx.fillText((r + 1 + (this.index*grid.rowsPerCanvas)).toString(), grid.cellWidth / 2, y + grid.cellHeight / 2);
//         }
//     }

//     removeCanvas() {
//         this.canvas.remove();
//     }
// }
