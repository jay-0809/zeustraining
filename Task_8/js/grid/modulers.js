// Event handlers for interaction with canvas
import { Canvas } from "./canvas.js";

export function handleClick(e) {
    // console.log(this, "mmm");
    const cell_input = document.createElement("input");
    cell_input.setAttribute("class", "cell-input")
    // this.wrapper.appendChild(cell_input);
    // console.log(cell_input);
    const x = e.pageX;
    const y = e.pageY;
    const globalCol = Math.floor(x / this.cellWidth);
    const globalRow = Math.floor(y / this.cellHeight);
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

    this.editor.style.display = "block";
    this.editor.style.left = `${globalCol * this.cellWidth - window.scrollX}px`;
    this.editor.style.top = `${globalRow * this.cellHeight - window.scrollY + 56}px`;
    this.editor.style.width = `${this.cellWidth}px`;
    this.editor.style.height = `${this.cellHeight}px`;
    this.editor.focus();

    this.resizer.style.display = "block";
    this.resizer.style.left = `${globalCol * this.cellWidth + this.cellWidth - 5 - window.scrollX}px`;
    this.resizer.style.top = `${globalRow * this.cellHeight + this.cellHeight - 5 - window.scrollY + 56}px`;
}

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

export function initResize() {
    let startX, startY;
    this.resizer.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.isResizing = true;
        startX = e.pageX;
        startY = e.pageY;
    })
}