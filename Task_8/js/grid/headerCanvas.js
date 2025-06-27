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

// Function to create the horizontal canvas for column headers
export function horizontalCanvas(grid) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Style horizontal canvas
    canvas.style.position = "absolute"; 
    canvas.style.top = "0"; 
    canvas.style.left = `${grid.cellWidth}px`; 
    canvas.style.zIndex = "1000";
    canvas.style.cursor = "col-resize";
    canvas.width = grid.colsPerCanvas * grid.cellWidth;
    canvas.height = grid.cellHeight;

    // Draw column headers
    for (let c = 0; c < 2 * grid.colsPerCanvas; c++) {
        const x = c * grid.cellWidth; // Calculate x-position for each column
        const y = 0 * grid.cellHeight; // Set y-position to 0 (first row)

        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(x, 0, grid.cellWidth, grid.cellHeight);

        // Right line 
        ctx.beginPath();
        ctx.strokeStyle = "rgba(33, 62, 64, 0.1)"; 
        ctx.lineWidth = 1; // Set line width for the right border
        ctx.moveTo(x + grid.cellWidth, y);
        ctx.lineTo(x + grid.cellWidth, y + grid.cellHeight);
        ctx.stroke();

        // Generate the label for the column headers (A, B, C, ...)
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
        ctx.fillText(label, x + grid.cellWidth / 2, grid.cellHeight / 2);
    }

    return canvas; // Return horizontal canvas
}

// Function to create the vertical canvas for row headers
export function verticalCanvas(grid) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Style the vertical canvas
    canvas.style.position = "sticky";
    canvas.style.left = "0"; 
    canvas.style.top = `${grid.cellHeight}px`; 
    canvas.style.zIndex = "1000";
    canvas.style.cursor = "row-resize";
    canvas.width = grid.cellWidth;
    canvas.height = grid.rowsPerCanvas * grid.cellHeight;

    // Draw row numbers
    for (let r = 0; r < 2 * grid.rowsPerCanvas; r++) {
        const y = r * grid.cellHeight; // Calculate y-position for each row
        const x = 0; // Set x-position to 0 (first column)

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
        ctx.lineWidth = 1; // Set line width for the right border
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

    return canvas; // Return vertical canvas
}
