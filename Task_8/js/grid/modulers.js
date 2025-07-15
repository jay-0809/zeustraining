import { EditCellCommand } from "../commands/editCommand.js";

/**
 * Handles selection click events on the grid for selecting a cell.
 * When a user clicks on a cell, it creates an input box for editing the cell value.
 * @param {*} e - event.
 */
export function handleSelectionClick(e) {
    // Create a selection box div
    const select = document.createElement("div");
    select.setAttribute("class", "selection");
    // Create the select block div
    const sblock = document.createElement("div");
    sblock.setAttribute("class", "selection-block");

    // Calculate the x and y position of the click relative to the wrapper and Use getBoundingClientRect for accurate positioning within the wrapper
    const rect = this.grid.wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left + window.scrollX;
    const y = e.clientY - rect.top + window.scrollY;

    let globalCol = -1, globalRow = -1;
    let xCursor = 0, yCursor = 0;

    for (let i = 0; i < this.grid.colWidths.length; i++) {
        xCursor += this.grid.colWidths[i];
        if (x < xCursor) {
            globalCol = i;
            break;
        }
    }

    for (let j = 0; j < this.grid.rowHeights.length; j++) {
        yCursor += this.grid.rowHeights[j];
        if (y < yCursor) {
            globalRow = j;
            break;
        }
    }

    // Remove selection and input divs
    const clearSelection = () => {
        document.querySelectorAll(".selection, .selection-block, .cell-input").forEach(el => {
            if (this.grid.wrapper.contains(el)) this.grid.wrapper.removeChild(el);
        });
        if (this.grid.multiHeaderSelection) {
            this.grid.multiHeaderSelection = null;
        }

    };
    // get selection and input divs position
    const getCellPosition = (colIndex, rowIndex) => {
        const left = this.grid.colWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0);
        const top = this.grid.rowHeights.slice(0, rowIndex).reduce((sum, h) => sum + h, 0);
        return {
            left,
            top,
            width: this.grid.colWidths[colIndex],
            height: this.grid.rowHeights[rowIndex],
        };
    };
    /**
     * append single selection block at position in canvas
     * @param {*} col at which column block generated
     * @param {*} row at which row block generated
     * @returns selected block at position
     */
    const selection = (col, row) => {
        clearSelection();
        this.grid.renderHeaders(col, row);
        this.grid.renderCanvases(col, row);
        // console.log(this.grid.multiEditing);

        if (this.grid.multiEditing) {
            // Prevent selecting cells with negative indices (outside grid)
            if (col === 0 || row === 0) return;

            // console.log('multi');
            // Position and display the selection box
            const pos = getCellPosition(col, row);
            select.style.display = `block`;
            select.style.left = `${pos.left}px`;
            select.style.top = `${pos.top}px`;
            select.style.width = `${pos.width}px`;
            select.style.height = `${pos.height}px`;
            select.style.border = `none`;
            select.style.cursor = "cell";

            this.grid.wrapper.appendChild(select);
        } else {
            // Prevent selecting cells with negative indices (outside grid)
            if (col === 0 || row === 0) return;

            // console.log('single');
            // Position and display the selection box
            const pos = getCellPosition(col, row);
            select.style.display = `block`;
            select.style.left = `${pos.left}px`;
            select.style.top = `${pos.top}px`;
            select.style.width = `${pos.width}px`;
            select.style.height = `${pos.height}px`;
            select.style.cursor = "cell";
            // Set the position and style for the selection block
            sblock.style.display = `block`;
            sblock.style.left = `${pos.left + pos.width - 5}px`;
            sblock.style.top = `${pos.top + pos.height - 5}px`;

            this.grid.wrapper.appendChild(select);
            this.grid.wrapper.appendChild(sblock);
        }
    };

    selection(globalCol, globalRow);

    /**
     * append input on selection to change value in map
     * @param {*} grid
     * @param {*} val if any keydown then it will append to cellValue
     */
    function inputField(grid, val = "") {
        // Create the input field for editing
        const cell_input = document.createElement("input");
        cell_input.setAttribute("class", "cell-input");

        if (globalCol === 0 || globalRow === 0) return;

        let dataRowIndex = globalRow - 1;
        let dataColIndex = globalCol - 1;
        // console.log("globalCol", globalCol, "globalRow", globalRow);
        // console.log("dataColIndex", dataColIndex, "dataRowIndex", dataRowIndex);

        if (!grid.dataset.has(dataRowIndex)) {
            grid.dataset.set(dataRowIndex, new Map());
        }
        const rowMap = grid.dataset.get(dataRowIndex);
        // Set the value of the input field
        // const value = rowMap.has(dataColIndex) ? rowMap.get(dataColIndex) : val;
        const oldValue = rowMap.has(dataColIndex) ? rowMap.get(dataColIndex) : "";; // Store the old value for undo functionality
        cell_input.value = val;

        // Position the input field
        const pos = getCellPosition(dataColIndex + 1, dataRowIndex + 1);
        cell_input.style.display = `block`;
        cell_input.style.left = `${pos.left}px`;
        cell_input.style.top = `${pos.top}px`;
        cell_input.style.width = `${pos.width}px`;
        cell_input.style.height = `${pos.height}px`;

        clearSelection();
        // Append the input element to the wrapper
        grid.wrapper.appendChild(cell_input);

        // Focus the input field after it has been inserted
        setTimeout(() => cell_input.focus(), 0);

        // save value to cell and remove input field
        const saveValue = () => {
            const cmd = new EditCellCommand(grid, dataColIndex, dataRowIndex, cell_input.value, oldValue);
            // rowMap.set(dataColIndex, cell_input.value);
            grid.commandManager.executeCommand(cmd);
        };

        // Update input value by Enter click and discard update by Escape
        cell_input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { cell_input.blur(); selection(globalCol, globalRow); }
            else if (e.key === "Escape") {
                cell_input.value = oldValue;
                if (grid.wrapper.contains(cell_input)) {
                    grid.wrapper.removeChild(cell_input);
                    selection(globalCol, globalRow);
                }
            }
        });

        // Handle click outside to remove input and save value
        cell_input.addEventListener("blur", () => {
            saveValue()
        });
    }

    const keyNavigation = (e) => {
        // console.log("key",e.key);
        if (e.ctrlKey) {
            return;
        }
        let handled = true;

        if (this.grid.multiEditing) {
            
            const range = this.grid.multiSelect;
            
            let { row, col } = this.grid.multiCursor;
            // console.log(row, range.endRow, col, range.endRow);
            if (e.key === "Tab") {
                col++;
                if (col > range.endCol) {
                    col = range.startCol;
                    row++;
                    if (row > range.endRow) row = range.startRow;
                }
            } else if (e.key === "Enter") {
                row++;
                // console.log("row", row);
                
                if (row > range.endRow) {
                    row = range.startRow;
                    col++;
                    // console.log("col", col);
                    if (col > range.endCol) col = range.startCol;
                }
            } else if (e.key == "=") {
                // console.log(e.key);
                inputField(this.grid, e.key);
                return;
            } else if (e.key === "ArrowUp") {
                this.grid.multiEditing = false;
            } else if (e.key === "ArrowDown") {
                this.grid.multiEditing = false;
            } else if (e.key === "ArrowLeft") {
                this.grid.multiEditing = false;
            } else if (e.key === "ArrowRight") {
                this.grid.multiEditing = false;
            } else {
                // Alphanumeric input
                if (/^[a-zA-Z0-9]$/.test(e.key)) {
                    inputField(this.grid, e.key);
                }
                return;
            }
            if (this.grid.multiEditing) {
                e.preventDefault();
                this.grid.multiCursor = { row, col };
                globalCol = col;
                globalRow = row;
                selection(col, row);
                // inputField(this);
                return;
            }
        }
        // console.log("globalCol", globalCol, "globalRow", globalRow);

        this.grid.multiEditing = false;
        switch (e.key) {
            case "ArrowUp":
                globalRow = Math.max(1, globalRow - 1);
                break;
            case "ArrowDown":
                globalRow = Math.min(this.grid.maxRows, globalRow + 1);
                break;
            case "ArrowLeft":
                globalCol = Math.max(1, globalCol - 1);
                break;
            case "ArrowRight":
                globalCol = Math.min(this.grid.maxCols, globalCol + 1);
                // console.log("globalCol", globalCol, "globalRow", globalRow);
                break;
            case "Home":
                if (e.ctrlKey) { globalCol = 1; globalRow = 1; }
                else globalCol = 1;
                break;
            case "Tab":
                globalCol += e.shiftKey ? -1 : 1;
                if (globalCol <= 0) globalCol = 1;
                if (globalCol >= this.grid.maxCols) {
                    globalCol = 1;
                    globalRow = Math.min(this.grid.maxRows - 1, globalRow + 1);
                }
                break;
            case "Enter": globalRow = Math.min(this.grid.maxRows, globalRow + 1); break;
            case "=":
                handled = false;
                inputField(this.grid, e.key);
                break;
            default:
                if (/^[a-zA-Z0-9]$/.test(e.key)) {
                    handled = false;
                    inputField(this.grid, e.key);
                } else {
                    handled = false;
                }
                break;
        }

        if (handled) {
            e.preventDefault();
            selection(globalCol, globalRow);
        }
    };

    document.addEventListener("keydown", (e) => {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement &&
            (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

        if (!isInputFocused) keyNavigation(e);
    });
    // if event is not attached then new event create 
    // if (!this.keydownListenerAttached) {
    //     console.log("keydown.......");

    //     document.addEventListener("keydown", (e) => {
    //         const activeElement = document.activeElement;
    //         const isInputFocused = activeElement &&
    //             (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

    //         if (!isInputFocused) keyNavigation(e);
    //     });

    //     this.keydownListenerAttached = true;
    // }

    select.addEventListener("dblclick", () => inputField(this.grid));
}