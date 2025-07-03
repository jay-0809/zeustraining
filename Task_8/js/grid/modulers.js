import { Row } from "../structure/row.js";
import { Cell } from "../structure/cell.js";

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
    const rect = this.wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left + this.wrapper.scrollLeft;
    const y = e.clientY - rect.top + this.wrapper.scrollTop;

    // Determine the global column and row based on click position
    let globalCol = Math.floor(x / this.cellWidth);
    let globalRow = Math.floor(y / this.cellHeight);
    // console.log("GlobalCol:", globalCol, "GlobalRow:", globalRow);

    // Remove selection and input divs
    const clearSelection = () => {
        document.querySelectorAll(".selection, .selection-block, .cell-input").forEach(el => {
            if (this.wrapper.contains(el)) this.wrapper.removeChild(el);
        });
    };

    const selection = (globalCol, globalRow) => {
        // e.preventDefault();
        clearSelection();

        // console.log(globalCol, globalRow);
        this.renderCanvases(globalCol, globalRow);
        this.renderHeaders(globalCol, globalRow);

        // Prevent selecting cells with negative indices (outside grid)
        if (globalRow <= 0 || globalCol <= 0) return;

        // Position and display the selection box
        select.style.display = "block";
        select.style.left = `${globalCol * this.cellWidth}px`;
        select.style.top = `${globalRow * this.cellHeight}px`;
        select.style.width = `${this.cellWidth}px`;
        select.style.height = `${this.cellHeight}px`;
        select.style.cursor = "cell";
        select.focus();

        // Set the position and style for the selection block
        sblock.style.display = "block";
        sblock.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5}px`;
        sblock.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5}px`;

        // Append the selection box and input block to the grid wrapper
        this.wrapper.appendChild(select);
        this.wrapper.appendChild(sblock);
    };

    selection(globalCol, globalRow);

    function inputField(grid, val="") {
        console.log("click");
        // Create the input field for editing
        const cell_input = document.createElement("input");
        cell_input.setAttribute("class", "cell-input");

        // Determine the canvas block index and local position within the cell
        const xIndex = Math.floor(globalCol / grid.colsPerCanvas);
        const yIndex = Math.floor(globalRow / grid.rowsPerCanvas);
        const localCol = globalCol % grid.colsPerCanvas;
        const localRow = globalRow % grid.rowsPerCanvas;
        const canvasKey = `${xIndex}_${yIndex}`;

        // Set data attributes on the input field for identification
        cell_input.dataset.canvasKey = canvasKey;
        cell_input.dataset.localRow = localRow;
        cell_input.dataset.localCol = localCol;

        // Adjust data row/col indexes relative to dataset structure
        const dataRowIndex = globalRow - 1;
        const dataColIndex = globalCol - 1;

        // Check if row exists, create if not
        let row = grid.dataset[dataRowIndex];
        if (!row) {
            row = new Row(dataRowIndex);
            grid.dataset[dataRowIndex] = row;
        }

        // Check if cell exists in the row, create if not
        let cell = row.getCell(dataColIndex);
        if (!cell) {
            cell = new Cell(dataRowIndex, dataColIndex, "");
            row.addCell(cell);
        }

        // Set the value of the input field
        let value = cell.getValue();
        cell_input.value = value || val;

        // Position the input field
        cell_input.style.display = "block";
        cell_input.style.left = `${globalCol * grid.cellWidth}px`;
        cell_input.style.top = `${globalRow * grid.cellHeight}px`;
        cell_input.style.width = `${grid.cellWidth}px`;
        cell_input.style.height = `${grid.cellHeight}px`;

        clearSelection();
        // Append the input element to the wrapper
        grid.wrapper.appendChild(cell_input);

        // Focus the input field after it has been inserted
        setTimeout(() => {
            cell_input.focus();
            // cell_input.select();  // Select all content for editing
        }, 0);

        let inputRemoved = false;
        // save value to cell and remove input field
        const saveValue = () => {
            if (inputRemoved) return; // Prevent duplicate remove
            inputRemoved = true;

            // Set the value of the cell when the user presses Enter or clicks outside
            cell.setValue(cell_input.value);

            // Remove the input field after saving the value
            if (grid.wrapper.contains(cell_input)) {
                grid.wrapper.removeChild(cell_input);
            }
        };

        // Update input value by Enter click and discard update by Escape
        cell_input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveValue();
            } else if (e.key === "Escape") {
                if (inputRemoved) return; // Prevent duplicate remove
                inputRemoved = true;

                cell_input.value = "";
                // Remove the input field after saving the value
                if (grid.wrapper.contains(cell_input)) {
                    grid.wrapper.removeChild(cell_input);
                    selection(globalCol, globalRow);
                }
                // clearSelection();
            }
        });

        // Handle click outside to remove input and save value
        cell_input.addEventListener("blur", (e) => {
            saveValue();
        })
    }

    document.addEventListener("keydown", (e) => {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

        if (!isInputFocused) {
            keyNavigation(e);
        }
    });

    const keyNavigation = (e) => {
        let handled = true;

        switch (e.key) {
            case "ArrowUp":
                globalRow = Math.max(1, globalRow - 1);
                break;
            case "ArrowDown":
                globalRow = Math.min(this.maxRows, globalRow + 1);
                break;
            case "ArrowLeft":
                globalCol = Math.max(1, globalCol - 1);
                break;
            case "ArrowRight":
                globalCol = Math.min(this.maxCols, globalCol + 1);
                break;
            case "Home":
                if (e.ctrlKey) {
                    globalCol = 1;
                    globalRow = 1;
                } else {
                    globalCol = 1;
                }
                break;
            case "Tab":
                if (e.shiftKey) {
                    globalCol = globalCol - 1;
                    if (globalCol <= 0) globalCol = 1;
                } else {
                    globalCol = globalCol + 1;
                    if (globalCol >= this.totalColumns) {
                        globalCol = 1;
                        globalRow = Math.min(this.maxRows - 1, globalRow + 1);
                    }
                }
                break;
            case "Enter":
                globalRow = Math.min(this.maxRows, globalRow + 1);
                break;
            case "c":
                if (e.ctrlKey) {
                    handled = false;
                }
                break;
            case "v":
                if (e.ctrlKey) {
                    handled = false;
                }
                break;
            default:
                // Detect alphanumeric input
                if (/^[a-zA-Z0-9]$/.test(e.key)) {
                    handled = false;
                    inputField(this, e.key);
                    // console.log("Alphanumeric key:", e.key);
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
    select.addEventListener('dblclick', (e)=>{inputField(this)});
}
