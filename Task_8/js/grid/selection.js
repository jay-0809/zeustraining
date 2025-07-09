import { CellRange } from '../structure/cellRange.js';
import { handleSelectionClick } from './modulers.js';
export class CellSelector {
    /**
     * Initializes the cell selector for multi cell selection.
     * @param {Grid} grid Grid instance to attach resizing logic to.
     */
    constructor(grid) {
        this.grid = grid;
        this.cellRange = new CellRange();
        this.isSelecting = false;
        this.dragged = false;
        this.canvas = document.querySelector(".canvas-div");
    }

    /**
     * Selecting cell on left click of mouse 
     */
    onMouseDown(e) {
        if (e.button !== 0) return;

        this.startX = e.clientX;
        this.startY = e.clientY;
        // console.log("thisfsdvskhgv", this);
        const cell = this.locateCell(e);
        if (!cell) return;

        this.cellRange.startRow = cell.row;
        this.cellRange.startCol = cell.col;
        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;

        this.isSelecting = true;
        this.dragged = false;

        if (this.cellRange.isValid()) {
            this.grid.grid.multiEditing = false;
        }

        // console.log(this.cellRange.startRow, this.cellRange.startCol);
        // this.grid.grid.renderHeaders(0, 0);
        // this.grid.grid.renderCanvases();
        handleSelectionClick.bind(this.grid.grid?.pointer)(e);
    }

    /**
     * if we isSelecting then dragged is true so we get multiselected area
     */
    onMouseMove(e) {
        // console.log(e);
        if (!this.isSelecting) return;

        if (Math.abs(e.clientX - this.startX) > 5 || Math.abs(e.clientY - this.startY) > 5) {
            // console.log(Math.abs(e.clientX - this.startX), 5, Math.abs(e.clientY - this.startY));
            this.dragged = true;
        }


        // console.log("this", this);
        const cell = this.locateCell(e);
        if (!cell) return;
        // console.log("thisthing", cell);

        this.cellRange.endRow = cell.row;
        this.cellRange.endCol = cell.col;

        // Store multi-cell selection range in grid
        if (this.cellRange.isValid()) {
            // console.log("...............................");
            const { startRow, startCol, endRow, endCol } = this.cellRange;
            this.grid.grid.multiSelect = { startRow, startCol, endRow, endCol };
            this.grid.grid.multiCursor = { row: startRow, col: startCol };
            this.grid.grid.multiEditing = true;
        }

        if (!this.dragged) return;
        if (!this.cellRange.isValid()) return;
        // this.updateGridSelection();
        // console.log(this.grid.grid);

        this.grid.grid.renderHeaders(0, 0);
        this.grid.grid.renderCanvases();
    }

    /**
     * if dragged then on mouseup put selected rows and cols into grid
     */
    onMouseUp(e) {
        this.isSelecting = false;
        if (!this.dragged) return;

        // this.updateGridSelection();
        // console.log(this.grid.grid);

        // let slct = document.getElementsByClassName("selection");
        // let block = document.getElementsByClassName("selection-block");

        // if (slct.length !== 0 || block.length !== 0) {
        //     // console.log(slct, block);            
        //     if (this.grid.wrapper.contains(slct[0])) this.grid.wrapper.removeChild(slct[0]);
        //     if (this.grid.wrapper.contains(block[0])) this.grid.wrapper.removeChild(block[0]);
        // }

        // this.dragged = false;
        // if (!this.cellRange.isValid()) return;
        // this.grid.renderCanvases();
        // this.grid.wrapper.removeEventListener('mousedown', this.onMouseDown.bind(this));
        // this.grid.wrapper.removeEventListener('mousemove', this.onMouseMove.bind(this));
        // this.grid.wrapper.removeEventListener('mouseup', this.onMouseUp.bind(this));
    }

    /**
     * get which cell is selected
    */
    locateCell(e) {
        const rect = this.grid.grid.wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + window.scrollX;
        const y = e.clientY - rect.top + window.scrollY;
        const { colWidths, rowHeights } = this.grid.grid;

        // Calculate column index
        let col = -1, xAcc = 0;
        for (let i = 0; i < this.grid.grid.maxCols; i++) {
            xAcc += colWidths[i];
            if (x < xAcc) {
                col = i;
                break;
            }
        }

        // Calculate row index
        let row = -1, yAcc = 0;
        for (let j = 0; j < this.grid.grid.maxRows; j++) {
            yAcc += rowHeights[j];
            if (y < yAcc) {
                row = j;
                break;
            }
        }

        if (row === -1 || col === -1) return null;
        return { row, col };
    }


    /**
     * highlight selected cells and updated on mousemove
    */
    // updateGridSelection() {
    //     if (!this.cellRange.isValid()) return;

    //     this.grid.renderHeaders(0, 0);
    //     // this.grid.renderCanvases();

    //     const visibleCoords = this.grid.getCanvasCoords();
    //     visibleCoords.forEach(([x, y]) => {
    //         const key = JSON.stringify([x, y]);
    //         const canvas = this.grid.canvases[key];
    //         if (canvas) {
    //             // canvas.drawMultiSelection(this.cellRange);
    //         }
    //     });
    // }
}
