// Createing a single canvas block
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
        this.canvas.style.left = `${xIndex * this.canvas.width}px`;
        this.canvas.style.top = `${yIndex * this.canvas.height}px`;

        grid.wrapper.appendChild(this.canvas);

        this.craeteCanvas();
    }

    craeteCanvas() {
        const { ctx, grid } = this;
        const { cellWidth, cellHeight, dataset } = grid; // destructuring dataset
        // console.log(dataset);
        const columnNames = dataset.length > 0 ? Object.keys(dataset[0]) : [];
        // console.log(columnNames);

        // Draw cells within a canvas block
        for (let r = 0; r < grid.rowsPerCanvas; r++) {
            for (let c = 0; c < grid.colsPerCanvas; c++) {
                const globalRow = this.yIndex * grid.rowsPerCanvas + r;
                const globalCol = this.xIndex * grid.colsPerCanvas + c;

                const x = c * cellWidth;
                const y = r * cellHeight;

                ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                ctx.strokeRect(x + 0.5, y + 0.5, cellWidth, cellHeight);

                // Header cell (row 0 or column 0)
                if (globalRow === 0 || globalCol === 0) {
                    ctx.fillStyle = "#e7e7e7";
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    ctx.font = "11pt Aptos Narrow, Segoe UI, Calibri, Thonburi, Arial, Verdana, sans-serif, Mongolian Baiti, Microsoft Yi Baiti, Javanese Text";
                    ctx.textAlign = globalCol === 0 ? "right" : "center";
                    ctx.fillStyle = "#5e5e5e";
                    ctx.textBaseline = "middle";
                    // ctx.style.cursor = "ew-resize";
                    ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";

                    // Skip top border for header row
                    if (globalRow !== 0) {
                        ctx.beginPath();
                        // ctx.lineWidth = 0.5;
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + cellWidth + 0.5, y + 0.5);
                        ctx.stroke();
                    }

                    if (globalCol !== 0) {
                        // Left border
                        ctx.beginPath();
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + 0.5, y + cellHeight + 0.5);
                        ctx.stroke();
                    }

                    // Row0 header labels (A, B, C...)
                    if (globalRow === 0 && globalCol > 0) {
                        let label = "", index = globalCol;
                        while (index > 0) {
                            label = String.fromCharCode(((index - 1) % 26) + 65) + label;
                            index = Math.floor((index - 1) / 26);
                        }
                        ctx.fillText(label, x + cellWidth / 2, y + cellHeight / 2);
                    }
                    // Col0 header labels (1, 2, 3...)
                    if (globalCol === 0 && globalRow > 0) {
                        ctx.fillText(globalRow.toString(), x + cellWidth / 2, y + cellHeight / 2);
                    }
                } else if (globalRow === 1) {
                    const dataColIndex = globalCol - 1;  // col 0 = row number header
                    // ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                    // ctx.strokeRect(x + 0.4, y + 0.4, cellWidth, cellHeight);

                    if (columnNames[dataColIndex]) {
                        ctx.fillStyle = "#000";
                        ctx.font = "bold 14px Arial";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "middle";
                        ctx.fillText(String(columnNames[dataColIndex]).toUpperCase().slice(0, 8), x + 4, y + cellHeight / 2);
                    }
                } else {
                    // Regular cell
                    // ctx.strokeStyle = "rgba(33, 62, 64, 0.1)";
                    // ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth, this.cellHeight);

                    const dataRowIndex = globalRow - 2;  // row 0 = header, 1 = column names
                    const dataColIndex = globalCol - 1;  // col 0 = row number header

                    if (dataset[dataRowIndex] && columnNames[dataColIndex]) {
                        const cellValue = dataset[dataRowIndex][columnNames[dataColIndex]];
                        // console.log(cellValue);
                        if (cellValue !== undefined && cellValue !== null) {
                            ctx.fillStyle = "#000";
                            ctx.font = "14px Arial";
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            ctx.fillText(String(cellValue).slice(0, 8), x + 4, y + cellHeight / 2);
                        }
                    }
                }
            }
        }
    }

    remove() {
        this.canvas.remove();
    }
}
