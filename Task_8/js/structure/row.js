export class Row {
  constructor(index, height = 25) {
    this.index = index;
    this.height = height;
    this.cells = new Map(); // Initialize cells as a Map
  }

  resize(newHeight) {
    this.height = newHeight;
  }

  addCell(cell) {
    this.cells.set(cell.colIndex, cell);
  }

  getCell(colIndex) {
    return this.cells.get(colIndex);
  }
}