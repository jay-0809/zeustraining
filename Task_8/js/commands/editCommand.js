/**
 * Represents a command for editing a cell in the grid. 
*/
export class EditCellCommand {
    /**
     * @param row Row index of the cell
     * @param col Column index of the cell
     * @param newValue New value of the cell
     * @param oldValue - The old value of the cell before editing. 
     */
    constructor(grid, col, row, newValue, value) {
        this.grid = grid;
        this.row = row;
        this.col = col;
        this.newValue = newValue || "";
        this.oldValue = value || "";
    }

    execute() {
        console.log(this);
        
        const rowMap = this.grid.dataset.get(this.row);
        rowMap.set(this.col, this.newValue);
        this.grid.renderHeaders(0, 0);
        this.grid.renderCanvases();
    }

    undo() {
        const rowMap = this.grid.dataset.get(this.row);
        rowMap.set(this.col, this.oldValue);
        this.grid.renderHeaders(0, 0);
        this.grid.renderCanvases();
    }
}