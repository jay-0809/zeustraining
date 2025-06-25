// Event handlers for interaction with canvas
import { Canvas } from "./canvas.js";
/**
 * 
 * @param {*} e 
 * @returns 
 */
export function handleSelectionClick(e) {
    const sct = document.createElement("div");
    sct.setAttribute("class", "selection");

    const x = e.pageX + window.screenX;
    const y = e.pageY - 56 + window.scrollY;

    const globalCol = Math.floor(x / this.cellWidth);
    const globalRow = Math.floor(y / this.cellHeight);
    if (globalRow === 0 || globalCol === 0) return;

    sct.style.display = "block";
    sct.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;
    sct.style.top = `${globalRow * this.cellHeight - window.scrollY}px`;
    sct.style.width = `${this.cellWidth}px`;
    sct.style.height = `${this.cellHeight}px`;
    sct.focus();

    this.wrapper.appendChild(sct);
    sct.addEventListener("click", (e) => handleInputClick.call(this, e));
    console.log(sct);
} 
/**
 * 
 * @param {*} e 
 * @returns 
 */
export function handleInputClick(e) {
    const cell_input = document.createElement("input");
    cell_input.setAttribute("class", "cell-input")
    const cib = document.createElement("div");
    cib.setAttribute("class", "cell-input-block")

    const x = e.pageX + window.screenX;
    const y = e.pageY - 56 + window.scrollY;

    const globalCol = Math.floor(x / this.cellWidth);
    const globalRow = Math.floor(y / this.cellHeight);
    if (globalRow === 0 || globalCol === 0) return;

    const xIndex = Math.floor(globalCol / this.colsPerCanvas);
    const yIndex = Math.floor(globalRow / this.rowsPerCanvas);
    const localCol = globalCol % this.colsPerCanvas;
    const localRow = globalRow % this.rowsPerCanvas;
    const key = `${xIndex}_${yIndex}`;

    cell_input.dataset.key = key;
    cell_input.dataset.localRow = localRow;
    cell_input.dataset.localCol = localCol;

    const dataRowIndex = globalRow - 2;
    const dataColIndex = globalCol - 1;
    const colName = Object.keys(this.dataset[0])[dataColIndex];
    const value = this.dataset[dataRowIndex]?.[colName] || "";

    cell_input.value = value;

    cell_input.style.display = "block";
    cell_input.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;

    console.log("y-", y, "globalRow-", globalRow, "yIndex-", yIndex, "window.scrollY-", window.scrollY);
    cell_input.style.top = `${globalRow * this.cellHeight - window.scrollY}px`;
    cell_input.style.width = `${this.cellWidth}px`;
    cell_input.style.height = `${this.cellHeight}px`;
    cell_input.style.cursor = `text`;
    cell_input.focus();
    // this.editor.style.display = "block";
    // this.editor.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;
    // this.editor.style.top = `${globalRow * this.cellHeight - window.scrollY + 56}px`;
    // this.editor.style.width = `${this.cellWidth}px`;
    // this.editor.style.height = `${this.cellHeight}px`;
    // this.editor.focus();

    cib.style.display = "block";
    cib.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5 - window.scrollX}px`;
    cib.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5 - window.scrollY}px`;
    cib.style.cursor = 'text';
    // this.resizer.style.display = "block";
    // this.resizer.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5 - window.scrollX}px`;
    // this.resizer.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5 - window.scrollY}px`;

    this.wrapper.appendChild(cell_input);
    this.wrapper.appendChild(cib);
    console.log(cell_input);
    // return cell_input;
}
/**
 * 
 */
export function handleEditorBlur() {
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

    this.invalidCanvas(key);
    //  this.wrapper.removeChild(cell_input);
}
/**
 * 
 */
export function initResize() {
    let startX, startY;
    this.resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.isResizing = true;
        startX = e.pageX;
        startY = e.pageY;
    })
}