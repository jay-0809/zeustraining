export class CellRange {
  constructor(startRow = null, startCol = null, endRow = null, endCol = null) {
    this.startRow = startRow;
    this.startCol = startCol;
    this.endRow = endRow;
    this.endCol = endCol;
  }

  contains(row, col) {
    return (
      row >= Math.min(this.startRow, this.endRow) &&
      row <= Math.max(this.startRow, this.endRow) &&
      col >= Math.min(this.startCol, this.endCol) &&
      col <= Math.max(this.startCol, this.endCol)
    );
  }

  isValid() {
    return (
      this.startRow !== null &&
      this.startCol !== null &&
      this.endRow !== null &&
      this.endCol !== null
    );
  }

  clear() {
    this.startRow = null;
    this.startCol = null;
    this.endRow = null;
    this.endCol = null;
  }

  getSelectedRows() {
    const rows = [];
    for (let r = this.getStartRow(); r <= this.getEndRow(); r++) {
      rows.push(r);
    }
    return rows;
  }

  getSelectedCols() {
    const cols = [];
    for (let c = this.getStartCol(); c <= this.getEndCol(); c++) {
      cols.push(c);
    }
    return cols;
  }

  getStartRow() {
    return Math.min(this.startRow, this.endRow);
  }

  getEndRow() {
    return Math.max(this.startRow, this.endRow);
  }

  getStartCol() {
    return Math.min(this.startCol, this.endCol);
  }

  getEndCol() {
    return Math.max(this.startCol, this.endCol);
  }
}
