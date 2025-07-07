import { CellRange } from '../structure/cellRange.js';

export class CellSelector {
    constructor(grid) {
        this.grid = grid;
        this.cellRange = new CellRange();
        this.isSelecting = false;
        this.dragged = false;

        this.attachListeners();
    }

    attachListeners() {
        this.grid.wrapper.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.grid.wrapper.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.grid.wrapper.addEventListener('mouseup', this.onMouseUp.bind(this));
        document.addEventListener('keydown',  this.keyNavigation());
    }

    onMouseDown(e) {
        if (e.button !== 0) return;

        this.startX = e.clientX;
        this.startY = e.clientY;

        const cell = this.locateCell(e);
        if (!cell) return;

        this.cellRange.startRow = cell.row;
        this.cellRange.startCol = cell.col;
        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;

        this.isSelecting = true;
        this.dragged = false;
    }

    onMouseMove(e) {
        if (!this.isSelecting) return;

        if (Math.abs(e.clientX - this.startX) > 5 || Math.abs(e.clientY - this.startY) > 5) {
            // console.log(Math.abs(e.clientX - this.startX), 5, Math.abs(e.clientY - this.startY));
            this.dragged = true;
        }

        const cell = this.locateCell(e);
        if (!cell) return;

        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;

        if (!this.dragged) return;
        this.updateGridSelection();
    }

    onMouseUp(e) {
        this.isSelecting = false;
        if (!this.dragged) return;

        this.updateGridSelection();

        // Store multi-cell selection range in grid
        if (this.cellRange.isValid()) {

            const { startRow, startCol, endRow, endCol } = this.cellRange;
            this.grid.multiSelect = { startRow, startCol, endRow, endCol };
            this.grid.multiCursor = { row: startRow, col: startCol };
            this.grid.multiEditing = true;
        }
        // console.log(this.grid);

        let slct = document.getElementsByClassName("selection");
        let block = document.getElementsByClassName("selection-block");

        if (slct.length !== 0 || block.length !== 0) {
            // console.log(slct, block);            
            if (this.grid.wrapper.contains(slct[0])) this.grid.wrapper.removeChild(slct[0]); 
            if (this.grid.wrapper.contains(block[0])) this.grid.wrapper.removeChild(block[0]);
        }
        this.grid.renderHeaders(0,0);
    }

    locateCell(e) {
        const rect = this.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid;

        let col = -1, xAcc = colWidths[0];
        for (let i = 0; i < this.grid.maxCols; i++) {
            xAcc += colWidths[i + 1];
            if (x < xAcc) {
                col = i;
                break;
            }
        }

        let row = -1, yAcc = rowHeights[0];
        for (let j = 0; j < this.grid.maxRows; j++) {
            yAcc += rowHeights[j + 1];
            if (y < yAcc) {
                row = j;
                break;
            }
        }

        if (row === -1 || col === -1) return null;
        return { row, col };
    }

    inputField(grid, val = "") {
        // Create the input field for editing
        const cell_input = document.createElement("input");
        cell_input.setAttribute("class", "cell-input");

        if (globalCol === 0 || globalRow === 0) return;
        // Determine the canvas block index position within the cell
        const dataRowIndex = globalRow - 1;
        const dataColIndex = globalCol - 1;

        if (!grid.dataset.has(dataRowIndex)) {
            grid.dataset.set(dataRowIndex, new Map());
        }
        const rowMap = grid.dataset.get(dataRowIndex);
        // Set the value of the input field
        const value = rowMap.has(dataColIndex) ? rowMap.get(dataColIndex) : val;
        cell_input.value = value;

        // Position the input field
        const pos = getCellPosition(dataColIndex, dataRowIndex);
        cell_input.style.display = `block`;
        cell_input.style.left = `${pos.left}px`;
        cell_input.style.top = `${pos.top}px`;
        cell_input.style.width = `${pos.width}px`;
        cell_input.style.height = `${pos.height}px`;
        cell_input.style.display = "block";

        // clearSelection();
        // Append the input element to the wrapper
        grid.wrapper.appendChild(cell_input);

        // Focus the input field after it has been inserted
        setTimeout(() => cell_input.focus(), 0);

        // save value to cell and remove input field
        const saveValue = () => {
            rowMap.set(dataColIndex, cell_input.value);
            if (grid.wrapper.contains(cell_input)) {
                grid.wrapper.removeChild(cell_input);
            }
        };
        // Update input value by Enter click and discard update by Escape
        cell_input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") saveValue();
            else if (e.key === "Escape") {
                cell_input.value = "";
                if (grid.wrapper.contains(cell_input)) {
                    grid.wrapper.removeChild(cell_input);
                    selection(globalCol, globalRow);
                }
            }
        });

        // Handle click outside to remove input and save value
        cell_input.addEventListener("blur", () => {
            setTimeout(saveValue, 20);
        });
    }

    keyNavigation = (e) => {
        console.log("in");
        if (this.multiEditing) {
            
            const range = this.multiSelect;
            let { row, col } = this.multiCursor;

            if (e.key === "Tab") {
                col++;
                if (col > range.endCol) {
                    col = range.startCol;
                    row++;
                    if (row > range.endRow) row = range.startRow;
                }
            } else if (e.key === "Enter") {
                row++;
                if (row > range.endRow) {
                    row = range.startRow;
                    col++;
                    if (col > range.endCol) col = range.startCol;
                }
            } else {
                // Alphanumeric input
                if (/^[a-zA-Z0-9]$/.test(e.key)) {
                    inputField(this, e.key);
                }
                return;
            }

            e.preventDefault();
            this.multiCursor = { row, col };
            globalCol = col;
            globalRow = row;
            inputField(this);
            return;
        }
    };

    updateGridSelection() {
        if (!this.cellRange.isValid()) return;

        this.grid.renderCanvases();

        const visibleCoords = this.grid.getCanvasCoords();
        visibleCoords.forEach(([x, y]) => {
            const key = JSON.stringify([x, y]);
            const canvas = this.grid.canvases[key];
            if (canvas) {
                canvas.drawMultiSelection(this.cellRange);
            }
        });
    }
}
