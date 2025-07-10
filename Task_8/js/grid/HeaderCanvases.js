// Function to create and append the top-left sticky corner, horizontal, and vertical canvases
export function topDiv(grid) {
  const wrapper = grid.wrapper;

  //  Top-left corner 
  const topDiv = document.createElement("div"); // Create top-left div 
  topDiv.style.position = "sticky";
  topDiv.style.top = "0";
  topDiv.style.left = "0";
  topDiv.style.backgroundColor = "#f5f5f5";
  topDiv.style.borderRight = "2px solid #bdbdbd";
  topDiv.style.borderBottom = "2px solid #bdbdbd";
  topDiv.style.zIndex = "100000";
  topDiv.style.width = `${grid.colWidths[0] - 2}px`;
  topDiv.style.height = `${grid.rowHeights[0] - 2}px`;
  topDiv.style.cursor = `cell`;

  const topRect = document.createElement("div");
  topRect.setAttribute("class", "top-rect");
  topDiv.appendChild(topRect);
  wrapper.appendChild(topDiv); // Append the created topDiv to the grid wrapper
}

// Class for creating the horizontal canvas (column headers)
export class HorizontalCanvas {
  /**
* Constructor for the HorizontalCanvas instance
* @param {*} grid - Reference to the Grid instance
* @param {*} xIndex - The x-index (column) for the canvas block
* @param {*} yIndex - The y-index (row) for the canvas block
*/
  constructor(grid, xIndex, yIndex, globalCol, globalRow) {
    // Store grid reference and indexes for canvas positioning
    this.grid = grid;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.globalCol = globalCol;
    this.globalRow = globalRow;

    const { colWidths, colsPerCanvas, rowHeights } = grid;
    // console.log(globalCol, globalRow);

    // compute tile width
    let tileW = 0;
    for (let c = 0; c < colsPerCanvas; c++) {
      tileW += colWidths[xIndex * colsPerCanvas + c] || 0;
    }

    // make the canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = tileW;
    this.canvas.height = rowHeights[0];
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.zIndex = "1000";
    this.canvas.style.cursor = "cell";

    // mark it for resize‐hit
    this.canvas.classList.add("h-canvas");
    this.canvas.dataset.xIndex = xIndex;
    this.canvas.dataset.yIndex = yIndex;

    // correct left offset: row-header width + all preceding data-col widths
    let leftOffset = grid.colWidths[0];
    for (let i = 0; i < xIndex * colsPerCanvas; i++) {
      leftOffset += colWidths[i] || 0;
    }
    this.canvas.style.left = `${leftOffset}px`;

    // Append the canvas element to the wrapper
    grid.wrapper.appendChild(this.canvas);

    // Initial drawing of the horizontal header
    this.createHCanvas();
  }

  /**
   * Method to create and render the horizontal header
   */
  createHCanvas() {
    const { ctx, grid, xIndex, globalCol, globalRow } = this;
    const { colWidths, colsPerCanvas, rowHeights } = grid;
    const headerH = rowHeights[0];
    const startCol = xIndex * colsPerCanvas;

    ctx.clearRect(0, 0, this.canvas.width, headerH);
    // console.log("globalCol", globalCol, "globalRow", globalRow);

    // Draw the horizontal header columns (A, B, C, ...)
    let x = 0, y = 0;
    for (let c = 0; c < colsPerCanvas; c++) {
      const colIdx = startCol + c;
      const w = colWidths[colIdx + 1];
      const sel = globalCol === colIdx + 1 && globalRow == null;

      ctx.fillStyle = sel ? "#107c41" : "#f5f5f5";
      ctx.fillRect(x, 0, w, headerH);

      // console.log(colIdx, globalCol);

      if (grid.multiHeaderSelection && colIdx + 1 >= Math.min(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend) &&
        colIdx + 1 <= Math.max(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend)) {
        ctx.fillStyle = "#107c41";
        ctx.fillRect(x, 0, w, headerH);
      } else if ((((c + 1) + (xIndex * colsPerCanvas)) === globalCol && globalRow !== 0) || grid.multiHeaderSelection && grid.multiHeaderSelection.colstart===null) {
        ctx.fillStyle = "#caead8";
        ctx.fillRect(x, 0, w, headerH);

        // Draw bottom line
        ctx.beginPath();
        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 5;
        ctx.moveTo(x, headerH + 0.5);
        ctx.lineTo(x + w, headerH + 0.5);
        ctx.stroke();
        ctx.lineWidth = 0.5;
      } else if ((grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) &&
        ((((c + 1) + (xIndex * colsPerCanvas)) >= grid.multiSelect.startCol && ((c + 1) + (xIndex * colsPerCanvas)) <= grid.multiSelect.endCol) ||
          (((c + 1) + (xIndex * colsPerCanvas)) <= grid.multiSelect.startCol && ((c + 1) + (xIndex * colsPerCanvas)) >= grid.multiSelect.endCol))) {
        ctx.fillStyle = "#caead8";
        ctx.fillRect(x, 0, w, headerH);

        // Draw bottom line
        ctx.beginPath();
        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 5;
        ctx.moveTo(x, headerH + 0.5);
        ctx.lineTo(x + w, headerH + 0.5);
        ctx.stroke();
        ctx.lineWidth = 0.5;
      }

      // label A, B, C...
      let label = "", idx = colIdx + 1;
      while (idx > 0) {
        label = String.fromCharCode(((idx - 1) % 26) + 65) + label;
        idx = Math.floor((idx - 1) / 26);
      }

      if ((globalRow !== 1 && globalCol === 0 && (grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) &&
        ((((c + 1) + (xIndex * colsPerCanvas)) >= grid.multiSelect.startCol && ((c + 1) + (xIndex * colsPerCanvas)) <= grid.multiSelect.endCol) ||
          (((c + 1) + (xIndex * colsPerCanvas)) <= grid.multiSelect.startCol && ((c + 1) + (xIndex * colsPerCanvas)) >= grid.multiSelect.endCol))) ||
        (((c + 1) + (xIndex * colsPerCanvas)) === globalCol && globalRow !== 0) || grid.multiHeaderSelection && grid.multiHeaderSelection.colstart===null) {
        ctx.fillStyle = "#107c41";
      } else {
        ctx.fillStyle = (grid.multiHeaderSelection && colIdx + 1 >= Math.min(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend) &&
          colIdx + 1 <= Math.max(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend)) ? "#fff" : "#333";
      }
      ctx.font = sel ? "bold 11pt Segoe UI" : "11pt Segoe UI";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x + w / 2, headerH / 2);

      x += w;
    }

    // draw the vertical grid lines
    x = 0;
    for (let c = 0; c <= colsPerCanvas; c++) {
      const colIdx = startCol + c;
      ctx.beginPath();
      ctx.strokeStyle = (grid.multiHeaderSelection && colIdx + 1 >= Math.min(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend) &&
        colIdx + 1 <= Math.max(grid.multiHeaderSelection.colstart, grid.multiHeaderSelection.colend)) ? "#fff" : "rgba(33,62,64,0.2)";
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, headerH);
      x += colWidths[startCol + 1 + c] || 0;
      ctx.stroke();
    }
  }
  /**
  * Method to remove the horizontal canvas from the DOM
  */
  removeCanvas() {
    this.canvas.remove();
  }
}

export class VerticalCanvas {
  constructor(grid, xIndex, yIndex, globalCol, globalRow) {
    this.grid = grid;
    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.globalCol = globalCol || null;
    this.globalRow = globalRow || null;

    const { rowHeights, rowsPerCanvas, colWidths } = grid;

    // compute dynamic canvas height
    let height = 0;
    for (let r = 0; r < rowsPerCanvas; r++) {
      height += rowHeights[yIndex * rowsPerCanvas + r] || 0;
    }

    // make the canvas
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = colWidths[0];
    this.canvas.height = height;
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1000";
    this.canvas.style.cursor = "cell";

    // mark it for resize‐hit
    this.canvas.classList.add("v-canvas");
    this.canvas.dataset.xIndex = xIndex;
    this.canvas.dataset.yIndex = yIndex;

    // correct top offset: col-header height + all preceding data-row heights
    let topOffset = rowHeights[0];
    for (let i = 0; i < yIndex * rowsPerCanvas; i++) {
      topOffset += rowHeights[i] || 0;
    }
    this.canvas.style.top = `${topOffset}px`;

    grid.wrapper.appendChild(this.canvas);
    this.createVCanvas();
  }

  createVCanvas() {
    const { ctx, grid, yIndex, globalCol, globalRow } = this;
    const { rowHeights, rowsPerCanvas, colWidths } = grid;
    const headerW = colWidths[0];
    const startRow = yIndex * rowsPerCanvas;

    ctx.clearRect(0, 0, headerW, this.canvas.height);

    // console.log("globalCol", globalCol, "globalRow", globalRow);

    let x = 0, y = 0;
    for (let r = 0; r < rowsPerCanvas; r++) {
      const rowIdx = startRow + r;
      const h = rowHeights[rowIdx + 1];
      const sel = globalRow === rowIdx + 1 && globalCol == null;

      ctx.fillStyle = sel ? "#107c41" : "#f5f5f5";
      ctx.fillRect(0, y, headerW, h);

      // console.log(grid.multiHeaderSelection);
      
      // Special case for mixed selection
      if (grid.multiHeaderSelection && rowIdx + 1 >= Math.min(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd) &&
        rowIdx + 1 <= Math.max(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd)) {
        ctx.fillStyle = "#107c41";
        ctx.fillRect(0, y, headerW, h);
      } else if ((((r + 1) + (yIndex * rowsPerCanvas)) === globalRow && globalCol !== null) || grid.multiHeaderSelection && grid.multiHeaderSelection.rowStart===null) {
        // console.log((globalRow%50), r);
        ctx.fillStyle = "#caead8";
        ctx.fillRect(x, y, headerW, h);

        // Right line
        ctx.beginPath();
        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 5;
        ctx.moveTo(x + headerW + 0.5, y);
        ctx.lineTo(x + headerW + 0.5, y + h);
        ctx.stroke();
        ctx.lineWidth = 1;
      } else if ((grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) &&
        ((((r + 1) + (yIndex * rowsPerCanvas)) >= grid.multiSelect.startRow && ((r + 1) + (yIndex * rowsPerCanvas)) <= grid.multiSelect.endRow) ||
          (((r + 1) + (yIndex * rowsPerCanvas)) <= grid.multiSelect.startRow && ((r + 1) + (yIndex * rowsPerCanvas)) >= grid.multiSelect.endRow))) {
        ctx.fillStyle = "#caead8";
        ctx.fillRect(x, y, headerW, h);

        // Right line
        ctx.beginPath();
        ctx.strokeStyle = "#107c41";
        ctx.lineWidth = 5;
        ctx.moveTo(x + headerW + 0.5, y);
        ctx.lineTo(x + headerW + 0.5, y + h);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      if ((globalRow === null && globalCol !== 0 && (grid.pointer?.cellSelector?.cellRange?.isValid() && grid.pointer?.cellSelector?.dragged && grid.multiEditing) &&
        ((((r + 1) + (yIndex * rowsPerCanvas)) >= grid.multiSelect.startRow && ((r + 1) + (yIndex * rowsPerCanvas)) <= grid.multiSelect.endRow) ||
        (((r + 1) + (yIndex * rowsPerCanvas)) <= grid.multiSelect.startRow && ((r + 1) + (yIndex * rowsPerCanvas)) >= grid.multiSelect.endRow))) ||
        ((((r + 1) + (yIndex * rowsPerCanvas)) === globalRow && globalCol !== null) || grid.multiHeaderSelection && grid.multiHeaderSelection.rowStart===null)) {
        ctx.fillStyle = "#107c41";
      } else {
        ctx.fillStyle = (grid.multiHeaderSelection && rowIdx + 1 >= Math.min(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd) &&
          rowIdx + 1 <= Math.max(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd)) ? "#fff" : "#333";
      }
      ctx.font = sel ? "bold 11pt Segoe UI" : "11pt Segoe UI";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(rowIdx + 1, headerW - 8, y + h / 2);

      y += h;
    }

    // draw the horizontal grid lines
    y = 0;
    for (let r = 0; r <= rowsPerCanvas; r++) {
      ctx.beginPath();
      const rowIdx = startRow + r;
      ctx.strokeStyle = (grid.multiHeaderSelection && rowIdx + 1 >= Math.min(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd) &&
        rowIdx + 1 <= Math.max(grid.multiHeaderSelection.rowStart, grid.multiHeaderSelection.rowEnd)) ? "#fff" : "rgba(33,62,64,0.2)";
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(headerW, y + 0.5);
      y += rowHeights[startRow + 1 + r] || 0;
      ctx.stroke();
    }
  }
  /**
  * Method to remove the vertical canvas from the DOM
  */
  removeCanvas() {
    this.canvas.remove();
  }
}