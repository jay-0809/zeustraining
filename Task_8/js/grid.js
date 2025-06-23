// //Create Main Grid for rows-columns
// Grid.js: Canvas-based virtual grid like Excel
export class Grid {
    constructor(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, dataset) {
        this.wrapper = wrapper;
        this.rowsPerCanvas = rowsPerCanvas;
        this.colsPerCanvas = colsPerCanvas;
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.dataset = dataset || [];

        this.cellWidth = 100;
        this.cellHeight = 25;

        this.canvases = {};      // Stores created canvas elements by position
        this.canvasData = {};    // Optional, not used in virtual approach

        this.editor = document.getElementById("cell-editor");
        this.resizer = document.getElementById("resizer");

        // Scroll-based rendering
        window.addEventListener("scroll", () => this.renderVisibleCanvases());
        window.addEventListener("click", (e) => this.handleClick(e));
        this.editor.addEventListener("blur", () => this.handleEditorBlur());

        this.isResizing = false;
        this.initResize();

        this.loadData(this.dataset);
        // if (this.dataset.length > 0) {
        //     this.renderVisibleCanvases();
        // }
    }

    // Calculate which canvas blocks are in view
    getViewportCanvasCoords() {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const startCol = Math.floor(scrollX / (this.colsPerCanvas * this.cellWidth));
        const endCol = Math.floor((scrollX + vw) / (this.colsPerCanvas * this.cellWidth));

        const startRow = Math.floor(scrollY / (this.rowsPerCanvas * this.cellHeight));
        const endRow = Math.floor((scrollY + vh) / (this.rowsPerCanvas * this.cellHeight));

        const coords = [];
        for (let y = startRow; y <= endRow; y++) {
            for (let x = startCol; x <= endCol; x++) {
                coords.push(`${x}_${y}`);
            }
        }
        return coords;
    }

    // Create canvases only for visible blocks
    renderVisibleCanvases() {
        const visible = this.getViewportCanvasCoords();
        visible.forEach((key) => {
            if (!this.canvases[key]) {
                const [x, y] = key.split("_").map(Number);
                this.createCanvas(x, y);
            }
        });
    }

    // Create a new canvas block for a segment of the grid
    createCanvas(xIndex, yIndex) {
        const canvas = document.createElement("canvas");
        canvas.width = this.colsPerCanvas * this.cellWidth;
        canvas.height = this.rowsPerCanvas * this.cellHeight;
        canvas.style.position = "absolute";
        canvas.style.left = `${xIndex * canvas.width}px`;
        canvas.style.top = `${yIndex * canvas.height}px`;

        this.wrapper.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const columnNames = this.dataset.length > 0 ? Object.keys(this.dataset[0]) : [];
        // console.log(columnNames)

        // Draw cells within a canvas block
        for (let r = 0; r < this.rowsPerCanvas; r++) {
            for (let c = 0; c < this.colsPerCanvas; c++) {
                const globalRow = yIndex * this.rowsPerCanvas + r;
                const globalCol = xIndex * this.colsPerCanvas + c;

                const x = c * this.cellWidth;
                const y = r * this.cellHeight;

                // Header cell (row 0 or column 0)
                if (globalRow === 0 || globalCol === 0) {
                    ctx.fillStyle = "#e7e7e7";
                    ctx.fillRect(x, y, this.cellWidth, this.cellHeight);
                    ctx.fillStyle = "#000";
                    ctx.font = "12px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.strokeStyle = "#bfbfbf";

                    // Skip top border for header row (cleaner Excel look)
                    if (globalRow !== 0) {
                        ctx.beginPath();
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + this.cellWidth + 0.5, y + 0.5);
                        ctx.stroke();
                    }

                    // Left border
                    ctx.beginPath();
                    ctx.moveTo(x + 0.5, y + 0.5);
                    ctx.lineTo(x + 0.5, y + this.cellHeight + 0.5);
                    ctx.stroke();

                    // Right border
                    ctx.beginPath();
                    ctx.moveTo(x + this.cellWidth + 0.5, y + 0.5);
                    ctx.lineTo(x + this.cellWidth + 0.5, y + this.cellHeight + 0.5);
                    ctx.stroke();

                    // Row0 header labels (A, B, C...)
                    if (globalRow === 0 && globalCol > 0) {
                        let index = globalCol;
                        let label = "";
                        while (index > 0) {
                            label = String.fromCharCode(((index - 1) % 26) + 65) + label;
                            index = Math.floor((index - 1) / 26);
                        }
                        ctx.fillText(label, x + this.cellWidth / 2, y + this.cellHeight / 2);
                    }
                    // Col0 header labels (1, 2, 3...)
                    if (globalCol === 0 && globalRow > 0) {
                        ctx.fillText(globalRow.toString(), x + this.cellWidth / 2, y + this.cellHeight / 2);
                    }
                } else if (globalRow === 1) {
                    const dataColIndex = globalCol - 1;  // col 0 = row number header
                    ctx.strokeStyle = "#ccc";
                    ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth, this.cellHeight);

                    if (columnNames[dataColIndex]) {
                        ctx.fillStyle = "#000";
                        ctx.font = "bold 14px Arial";
                        ctx.textAlign = "left";
                        ctx.textBaseline = "middle";
                        ctx.fillText(String(columnNames[dataColIndex]).toUpperCase().slice(0, 10), x + 4, y + this.cellHeight / 2);
                    }

                } else {
                    // Regular cell
                    ctx.strokeStyle = "#ccc";
                    ctx.strokeRect(x + 0.5, y + 0.5, this.cellWidth, this.cellHeight);

                    const dataRowIndex = globalRow - 2;  // row 0 = header, 1 = column names
                    const dataColIndex = globalCol - 1;  // col 0 = row number header

                    if (this.dataset[dataRowIndex] && columnNames[dataColIndex]) {
                        const cellValue = this.dataset[dataRowIndex][columnNames[dataColIndex]];
                        // console.log(cellValue);
                        if (cellValue !== undefined && cellValue !== null) {
                            ctx.fillStyle = "#000";
                            ctx.font = "14px Arial";
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle";
                            ctx.fillText(String(cellValue).slice(0, 10), x + 4, y + this.cellHeight / 2);
                        }
                    }
                }
            }
        }

        const key = `${xIndex}_${yIndex}`;
        this.canvases[key] = { canvas, ctx };
    }

    // Adding random data
    loadData(dataset) {
        this.dataset = dataset;
        this.renderVisibleCanvases();  // trigger initial render
    }

    // Handle clicking on a cell to activate the editor
    handleClick(e) {
        const x = e.pageX;
        const y = e.pageY;

        const globalCol = Math.floor(x / this.cellWidth);
        const globalRow = Math.floor(y / this.cellHeight);
        // console.log("gC: ", globalCol,"cW: ", this.cellWidth, "gR: ", globalRow, "cH:", this.cellHeight);
        if (globalRow === 0 || globalCol === 0) return;

        const xIndex = Math.floor(globalCol / this.colsPerCanvas);
        const yIndex = Math.floor(globalRow / this.rowsPerCanvas);
        const localCol = globalCol % this.colsPerCanvas;
        const localRow = globalRow % this.rowsPerCanvas;
        const key = `${xIndex}_${yIndex}`;

        this.editor.dataset.key = key;
        this.editor.dataset.localRow = localRow;
        this.editor.dataset.localCol = localCol;

        const dataRowIndex = globalRow - 2;
        const dataColIndex = globalCol - 1;
        const colName = Object.keys(this.dataset[0])[dataColIndex];
        const value = this.dataset[dataRowIndex]?.[colName] || "";

        this.editor.value = value;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        // Position editor precisely on the clicked cell
        this.editor.style.display = "block";
        this.editor.style.left = `${globalCol * this.cellWidth - scrollX}px`;
        this.editor.style.top = `${globalRow * this.cellHeight - scrollY}px`;
        this.editor.style.width = `${this.cellWidth}px`;
        this.editor.style.height = `${this.cellHeight}px`;
        this.editor.style.outline = `none`;
        this.editor.focus();
        // Position cell resizer 
        this.resizer.style.display = "block";
        this.resizer.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5 - scrollX}px`;
        this.resizer.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5 - scrollY}px`;
    }

    // Save edited value to canvasData and rerender
    handleEditorBlur() {
        const key = this.editor.dataset.key;
        const row = Number(this.editor.dataset.localRow);
        const col = Number(this.editor.dataset.localCol);
        const val = this.editor.value;

        const [xIndex, yIndex] = key.split("_").map(Number);
        const globalRow = yIndex * this.rowsPerCanvas + row;
        const globalCol = xIndex * this.colsPerCanvas + col;

        const dataRowIndex = globalRow - 2;
        const dataColIndex = globalCol - 1;

        const columnNames = Object.keys(this.dataset[0]);
        const columnKey = columnNames[dataColIndex];
        if (this.dataset[dataRowIndex] && columnKey) {
            this.dataset[dataRowIndex][columnKey] = val;
        }

        this.editor.style.display = "none";
        this.resizer.style.display = "none";
        // Rerender the specific canvas block
        this.canvases[key].canvas.remove();
        delete this.canvases[key];
        this.createCanvas(xIndex, yIndex);
    }

    // Setup resizer interaction
    initResize() {
        let startX, startY;

        this.resizer.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this.isResizing = true;
            startX = e.pageX;
            startY = e.pageY;
        });
    }
}
