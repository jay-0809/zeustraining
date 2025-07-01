import { HorizontalCanvas } from "./HeaderCanvases.js";
// import { selection } from "./selection.js";

/**
 * Handles selection click events on the grid for selecting a cell.
 * When a user clicks on a cell, it creates an input box for editing the cell value.
 * @param {*} e - event.
 */
export function handleSelectionClick(e) {
    // Create a selection box div
    const select = document.createElement("div");
    select.setAttribute("class", "selection");

    // Create the input block div
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

    const selection = (globalCol, globalRow) => {
        // Remove any existing selection or input blocks
        let slct = document.getElementsByClassName("selection");
        let block = document.getElementsByClassName("selection-block");

        if (slct.length !== 0 || block.length !== 0) {
            this.wrapper.removeChild(slct[0]);
            this.wrapper.removeChild(block[0]);
        }

        // HorizontalCanvas.updateHCanvas(globalCol, globalRow);
        this.renderUpdatedHeaders(globalCol, globalRow)

        // Prevent selecting cells with negative indices (outside grid)
        if (globalRow < 0 || globalCol < 0) return;

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
            default:
                handled = false;
                break;
        }

        if (handled) {
            e.preventDefault();
            selection(globalCol, globalRow);
        }
    };

    select.addEventListener('dblclick', (e) => {
        // e.stopPropagation(); // prevent bubbling up

        // Create the input field for editing
        const cell_input = document.createElement("input");
        cell_input.setAttribute("class", "cell-input");

        // Determine the canvas block index and local position within the cell
        const xIndex = Math.floor(globalCol / this.colsPerCanvas);
        const yIndex = Math.floor(globalRow / this.rowsPerCanvas);
        const localCol = globalCol % this.colsPerCanvas;
        const localRow = globalRow % this.rowsPerCanvas;
        const canvasKey = `${xIndex}_${yIndex}`;

        // Set data attributes on the input field for identification
        cell_input.dataset.canvasKey = canvasKey;
        cell_input.dataset.localRow = localRow;
        cell_input.dataset.localCol = localCol;

        // Adjust data row/col indexes relative to dataset structure
        const dataRowIndex = globalRow - 1;
        const dataColIndex = globalCol - 1;

        // Defensive: check dataRowIndex and dataColIndex bounds
        let value = "";
        if (this.dataset.length > dataRowIndex && this.dataset[dataRowIndex]) {
            value = this.dataset[dataRowIndex][Object.keys(this.dataset[dataRowIndex])[dataColIndex]] || "";
        }

        // Set the input field's value and position it correctly on the grid
        cell_input.value = value;
        cell_input.style.display = "block";
        cell_input.style.left = `${globalCol * this.cellWidth}px`;
        cell_input.style.top = `${globalRow * this.cellHeight}px`;
        cell_input.style.width = `${this.cellWidth}px`;
        cell_input.style.height = `${this.cellHeight}px`;

        // Append the input element to the wrapper
        this.wrapper.appendChild(cell_input);

        // Ensure focus happens after DOM insertion
        setTimeout(() => {
            cell_input.focus();
            cell_input.select(); // Select all content for editing
        }, 0);

        const saveValue = () => {
            const [xIdx, yIdx] = canvasKey.split("_").map(Number);
            const gRow = yIdx * this.rowsPerCanvas + localRow;
            const gCol = xIdx * this.colsPerCanvas + localCol;

            const dataRowIdx = gRow - 1;
            const dataColIdx = gCol - 1;

            if (dataColIdx >= this.dataset[0].length) {
                for (let i = this.dataset[0].length; i <= dataColIdx; i++) {
                    this.dataset[0].push("");
                }
            }

            const columnNames = Object.keys(this.dataset[0]);
            const columnKey = columnNames[dataColIndex];
            if (this.dataset[dataRowIndex] && columnKey) {
                this.dataset[dataRowIndex][columnKey] = cell_input.value;
            }

            if (this.dataset.length > dataRowIdx) {
                const dataRow = this.dataset[dataRowIdx];
                if (dataRow) {
                    const colKey = Object.keys(dataRow)[dataColIdx];
                    if (colKey) {
                        dataRow[colKey] = cell_input.value;
                    }
                }
            }
            this.renderCanvases();

            // Remove input field
            if (this.wrapper.contains(cell_input)) {
                this.wrapper.removeChild(cell_input);
            }
        };

        // Update input value by Enter click and discard update by Escape
        cell_input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveValue();
            } else if (e.key === "Escape") {
                cell_input.value = "";
                this.wrapper.removeChild(cell_input);
            }
        });

        // Handle click outside to remove input and save value
        const handleClickOutside = (event) => {
            if (!cell_input.contains(event.target)) {
                saveValue();
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
    });
}