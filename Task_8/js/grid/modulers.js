import { Canvas } from "./canvas.js";

/**
 * Handles selection click events on the grid for selecting cell.
 * When a user clicks on a cell, it creates an input box for editing the cell value.
 * @param {*} e - event.
 */
export function handleSelectionClick(e) {
    let slct = document.getElementsByClassName("selection");
    let block = document.getElementsByClassName("selection-block");
    // let Cellinput = document.getElementsByClassName("cell-input");
    console.log(slct);
    console.log(block);
    // console.log(Cellinput);

    if (slct.length !== 0 || block.length !== 0) {
        this.wrapper.removeChild(slct[0]);
        this.wrapper.removeChild(block[0]);
    }
    // if(Cellinput.length!==0){
    //     this.wrapper.removeChild(Cellinput[0]);
    // }

    // Create a selection box div
    const select = document.createElement("div");
    select.setAttribute("class", "selection");
    // Create the input block div
    const cib = document.createElement("div");
    cib.setAttribute("class", "selection-block");

    // Calculate the x and y position of the click
    const x = e.pageX + window.screenX;
    const y = e.pageY - 56 + window.scrollY;

    // Determine the global column and row based on click position
    const globalCol = Math.floor(x / this.cellWidth);
    const globalRow = Math.floor(y / this.cellHeight);

    // Prevent selecting cells in the header row or column
    if (globalRow === 0 || globalCol === 0) return;

    // Position and display the selection box
    select.style.display = "block";
    select.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;
    select.style.top = `${globalRow * this.cellHeight - window.scrollY}px`;
    select.style.width = `${this.cellWidth}px`;
    select.style.height = `${this.cellHeight}px`;
    select.style.cursor = `cell`;
    select.focus();

    // Set the position and style for the input block
    cib.style.display = "block";
    cib.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5 - window.scrollX}px`;
    cib.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5 - window.scrollY}px`;

    // Append the selection box to the grid wrapper
    this.wrapper.appendChild(select);
    this.wrapper.appendChild(cib);

    // Add an event listener for double-click to show the cell editor
    select.addEventListener("dblclick", (e) => {
        e.stopPropagation(); // prevent bubbling up
        // Create the input field for editing
        const cell_input = document.createElement("input");
        cell_input.setAttribute("class", "cell-input");

        // // Get the position of the click
        // const x = e.pageX + window.screenX;
        // const y = e.pageY - 56 + window.scrollY;

        // // Calculate the global column and row from the position
        // const globalCol = Math.floor(x / this.cellWidth);
        // const globalRow = Math.floor(y / this.cellHeight);

        // // Skip editing in header row/column
        // if (globalRow === 0 || globalCol === 0) return;

        // // Determine the canvas block index and local position within the cell
        // const xIndex = Math.floor(globalCol / this.colsPerCanvas);
        // const yIndex = Math.floor(globalRow / this.rowsPerCanvas);
        // const localCol = globalCol % this.colsPerCanvas;
        // const localRow = globalRow % this.rowsPerCanvas;
        // const key = `${xIndex}_${yIndex}`;

        // // Set data attributes on the input field for identification
        // cell_input.dataset.key = key;
        // cell_input.dataset.localRow = localRow;
        // cell_input.dataset.localCol = localCol;

        // Get the column name from the dataset and set the initial value of the input field
        const dataRowIndex = globalRow - 2;
        const dataColIndex = globalCol - 1;
        const colName = Object.keys(this.dataset[0])[dataColIndex];
        const value = this.dataset[dataRowIndex]?.[colName] || "";

        // Set the input field's value and position it correctly on the grid
        cell_input.value = value;
        cell_input.style.display = "block";
        cell_input.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;
        cell_input.style.top = `${globalRow * this.cellHeight - window.scrollY}px`;
        cell_input.style.width = `${this.cellWidth}px`;
        cell_input.style.height = `${this.cellHeight}px`;
        cell_input.style.cursor = "text";

        // Append the input element
        this.wrapper.appendChild(cell_input);

        // Ensure focus happens after DOM insertion
        setTimeout(() => {
            cell_input.focus();
            cell_input.select(); // Select all content for editing
        }, 0);

        // Handle click outside to remove input
        const handleClickOutside = (event) => {
            if (!cell_input.contains(event.target)) {
                if (this.wrapper.contains(cell_input)) {
                    this.wrapper.removeChild(cell_input);
                }
                document.removeEventListener("mousedown", handleClickOutside);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
    });
    console.log(select);
}

/**
 * Handles the blur event of the input editor.
 * This function is triggered when the user finishes editing a cell and clicks outside of it.
 */
// export function handleEditorBlur() {
//     // Get data from the editor input element
//     const key = this.editor.dataset.key;
//     const row = Number(this.editor.dataset.localRow);
//     const col = Number(this.editor.dataset.localCol);
//     const val = this.editor.value;

//     // Calculate the global row and column based on the canvas index
//     const [xIndex, yIndex] = key.split("_").map(Number);
//     const globalRow = yIndex * this.rowsPerCanvas + row;
//     const globalCol = xIndex * this.colsPerCanvas + col;

//     // Find the corresponding row and column in the dataset
//     const dataRowIndex = globalRow - 2;
//     const dataColIndex = globalCol - 1;

//     // Get the column names from the dataset and update the value
//     const columnNames = Object.keys(this.dataset[0]);
//     const columnKey = columnNames[dataColIndex];
//     if (this.dataset[dataRowIndex] && columnKey) {
//         this.dataset[dataRowIndex][columnKey] = val;
//     }

//     // Hide the input editor and resizer
//     this.editor.style.display = "none";
//     this.resizer.style.display = "none";

//     // Refresh the canvas to reflect changes
//     this.invalidCanvas(key);
// }

/**
 * Initializes resizing functionality for the grid's cells.
 * This is triggered when the user starts dragging the resizer.
 */
// export function initResize() {
//     let startX, startY;

//     // Event listener for the resizer's mousedown event
//     this.resizer.addEventListener("mousedown", (e) => {
//         e.preventDefault(); // Prevent default behavior for the mousedown event
//         this.isResizing = true; // Indicate that resizing has started
//         startX = e.pageX; // Store the starting x-position of the mouse
//         startY = e.pageY; // Store the starting y-position of the mouse
//     });
// }
