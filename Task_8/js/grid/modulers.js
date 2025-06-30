// import { Canvas } from "./canvas.js";

// /**
//  * Handles selection click events on the grid for selecting cell.
//  * When a user clicks on a cell, it creates an input box for editing the cell value.
//  * @param {*} e - event.
//  */
// export function handleSelectionClick(e) {
//     // Remove any existing selection or input blocks
//     let slct = document.getElementsByClassName("selection");
//     let block = document.getElementsByClassName("selection-block");

//     if (slct.length !== 0 || block.length !== 0) {
//         if (this.wrapper.contains(slct[0])) this.wrapper.removeChild(slct[0]);
//         if (this.wrapper.contains(block[0])) this.wrapper.removeChild(block[0]);
//     }

//     // Create a selection box div
//     const select = document.createElement("div");
//     select.setAttribute("class", "selection");
//     // Create the input block div
//     const sblock = document.createElement("div");
//     sblock.setAttribute("class", "selection-block");

//     // Calculate the x and y position of the click relative to the wrapper and Use getBoundingClientRect for accurate positioning within the wrapper
//     const rect = this.wrapper.getBoundingClientRect();
//     const x = e.clientX - rect.left + this.wrapper.scrollLeft;
//     const y = e.clientY - rect.top + this.wrapper.scrollTop;

//     // Determine the global column and row based on click position
//     const globalCol = Math.floor(x / this.cellWidth);
//     const globalRow = Math.floor(y / this.cellHeight);

//     console.log("X:", x, "Y:", y, "GlobalCol:", globalCol, "GlobalRow:", globalRow);

//     const selection = (globalCol, globalRow) => {
//         // Prevent selecting cells with negative indices (outside grid)
//         if (globalRow < 0 || globalCol < 0) return;

//         // Position and display the selection box
//         select.style.display = "block";
//         select.style.left = `${globalCol * this.cellWidth}px`;
//         select.style.top = `${globalRow * this.cellHeight}px`;
//         select.style.width = `${this.cellWidth}px`;
//         select.style.height = `${this.cellHeight}px`;
//         select.style.cursor = "cell";
//         select.focus();

//         // Set the position and style for the selection block
//         sblock.style.display = "block";
//         sblock.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5}px`;
//         sblock.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5}px`;

//         // Append the selection box and input block to the grid wrapper
//         this.wrapper.appendChild(select);
//         this.wrapper.appendChild(sblock);
//     }

//     selection(globalCol, globalRow);
//     select.addEventListener("keydown", (e) => {
//         if (e.key === "Arrow-up" && globalRow>=0) {
//             selection(globalCol, globalRow-1);
//         } 
//         else if (e.key === "Arrow-down" && globalRow<=100000) {
//             selection(globalCol, globalRow+1);
//         }
//         else if (e.key === "Arrow-left" && globalCol>=0) {
//             selection(globalCol-1, globalRow);
//         } 
//         else if (e.key === "Arrow-right" && globalCol<=500) {
//             selection(globalCol+1, globalRow);            
//         }
//     });

//     // Add an event listener for double-click to show the cell editor
//     select.addEventListener("dblclick", (e) => {
//         // e.stopPropagation(); // prevent bubbling up

//         // Create the input field for editing
//         const cell_input = document.createElement("input");
//         cell_input.setAttribute("class", "cell-input");
//         // cell_input.type = "text";

//         // Determine the canvas block index and local position within the cell
//         const xIndex = Math.floor(globalCol / this.colsPerCanvas);
//         const yIndex = Math.floor(globalRow / this.rowsPerCanvas);
//         const localCol = globalCol % this.colsPerCanvas;
//         const localRow = globalRow % this.rowsPerCanvas;
//         const canvasKey = `${xIndex}_${yIndex}`;

//         // Set data attributes on the input field for identification
//         cell_input.dataset.canvasKey = canvasKey;
//         cell_input.dataset.localRow = localRow;
//         cell_input.dataset.localCol = localCol;

//         // Adjust data row/col indexes relative to dataset structure
//         // Assuming dataset[0] is header row, data starts from row 1
//         const dataRowIndex = globalRow - 1;
//         const dataColIndex = globalCol - 1;

//         // Defensive: check dataRowIndex and dataColIndex bounds
//         let value = "";
//         if (this.dataset.length > dataRowIndex && this.dataset[dataRowIndex]) {
//             value = this.dataset[dataRowIndex][Object.keys(this.dataset[dataRowIndex])[dataColIndex]] || "";
//         }

//         // console.log("xIndex:", xIndex, "yIndex:", yIndex, "globalCol:", globalCol, "globalRow:", globalRow, "localCol:", localCol, "localRow:", localRow, "canvasKey:", canvasKey);
//         // console.log("cell_input.dataset:", cell_input.dataset, "dataRowIndex:", dataRowIndex, "dataColIndex:", dataColIndex, "value:", value);

//         // Set the input field's value and position it correctly on the grid
//         cell_input.value = value;
//         cell_input.style.display = "block";
//         cell_input.style.left = `${globalCol * this.cellWidth}px`;
//         cell_input.style.top = `${globalRow * this.cellHeight}px`;
//         cell_input.style.width = `${this.cellWidth}px`;
//         cell_input.style.height = `${this.cellHeight}px`;

//         // Append the input element to the wrapper
//         this.wrapper.appendChild(cell_input);

//         // Ensure focus happens after DOM insertion
//         setTimeout(() => {
//             cell_input.focus();
//             cell_input.select(); // Select all content for editing
//         }, 0);

//         const saveValue = () => {
//             // Calculate the global row and column based on the canvas index and local pos
//             const [xIdx, yIdx] = canvasKey.split("_").map(Number);
//             const gRow = yIdx * this.rowsPerCanvas + localRow;
//             const gCol = xIdx * this.colsPerCanvas + localCol;

//             // Calculate dataset indexes (adjust these according to your dataset structure)
//             const dataRowIdx = gRow - 1;
//             const dataColIdx = gCol - 1;

//             console.log("COL", this.dataset[0].length, "dataRowIndex", dataRowIdx, "dataColIndex", dataColIdx);
//             if (dataColIdx >= this.dataset[0].length) {
//                 for (let i = this.dataset[0].length; i <= dataColIdx; i++) {
//                     this.dataset[0].push("");
//                 }
//                 // console.log(this.dataset[0]);
//             }

//             // Get the column names from the dataset and update the value
//             const columnNames = Object.keys(this.dataset[0]);
//             const columnKey = columnNames[dataColIndex];
//             if (this.dataset[dataRowIndex] && columnKey) {
//                 this.dataset[dataRowIndex][columnKey] = cell_input.value;
//             }

//             // Update dataset safely
//             if (this.dataset.length > dataRowIdx) {
//                 const dataRow = this.dataset[dataRowIdx];
//                 if (dataRow) {
//                     const colKey = Object.keys(dataRow)[dataColIdx];
//                     console.log("this.dataset.length", this.dataset.length, "dataRowIndex", dataRowIdx, "dataRow", dataRow, "ColKey", Object.keys(dataRow)[dataColIdx]);
//                     if (colKey) {
//                         dataRow[colKey] = cell_input.value;
//                     }
//                 }
//             }
//             this.renderCanvases();

//             // Remove input field
//             if (this.wrapper.contains(cell_input)) {
//                 this.wrapper.removeChild(cell_input);
//             }
//         }

//         // Update input value by Enter click and discard update by Escape
//         cell_input.addEventListener("keydown", (e) => {
//             if (e.key === "Enter") {
//                 saveValue();
//             } else if (e.key === "Escape") {
//                 this.wrapper.removeChild(cell_input);
//             }
//         });

//         // Handle click outside to remove input and save value
//         const handleClickOutside = (event) => {
//             if (!cell_input.contains(event.target)) {
//                 saveValue();
//                 // Cleanup event listener
//                 document.removeEventListener("mousedown", handleClickOutside);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//     });
// }


import { Canvas } from "./canvas.js";

/**
 * Handles selection click events on the grid for selecting a cell.
 * When a user clicks on a cell, it creates an input box for editing the cell value.
 * @param {*} e - event.
 */
export function handleSelectionClick(e) {
    // Remove any existing selection or input blocks
    let slct = document.getElementsByClassName("selection");
    let block = document.getElementsByClassName("selection-block");

    if (slct.length !== 0 || block.length !== 0) {
        if (this.wrapper.contains(slct[0])) this.wrapper.removeChild(slct[0]);
        if (this.wrapper.contains(block[0])) this.wrapper.removeChild(block[0]);
    }

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

    console.log("X:", x, "Y:", y, "GlobalCol:", globalCol, "GlobalRow:", globalRow);

    const selection = (globalCol, globalRow) => {
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
        e.preventDefault();

        switch (e.key) {
            case "ArrowUp":
                console.log("ArrowUp");
                globalRow = Math.max(0, globalRow - 1);
                break;
            case "ArrowDown":
                console.log("ArrowDown");
                globalRow = Math.min(this.maxRows - 1, globalRow + 1);
                break;
            case "ArrowLeft":
                console.log("ArrowLeft");
                globalCol = Math.max(0, globalCol - 1);
                break;
            case "ArrowRight":
                console.log("ArrowRight");
                globalCol = Math.min(this.maxCols - 1, globalCol + 1);
                break;
            case "Tab":
                if (e.shiftKey) {
                    // Shift+Tab: Move to previous cell
                    globalCol = globalCol - 1;
                    if (globalCol < 0) {
                        globalCol = this.maxCols - 1;
                        globalRow = Math.max(0, globalRow - 1);
                    }
                } else {
                    // Tab: Move to next cell
                    globalCol = globalCol + 1;
                    if (globalCol >= this.totalColumns) {
                        globalCol = 0;
                        globalRow = Math.min(this.maxRows - 1, globalRow + 1);
                    }
                }
                break;
            case "Enter":
                // Enter: Move to cell below
                globalRow = Math.min(this.maxRows - 1, globalRow + 1);
                break;
            default:
                return;
        }

        // console.log("globalRow",globalRow, "globalCol", globalCol);
        selection(globalCol, globalRow);
    });

    // Add an event listener for double-click to show the cell editor
    select.addEventListener("dblclick", (e) => {
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
