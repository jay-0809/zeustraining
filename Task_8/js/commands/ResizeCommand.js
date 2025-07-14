/**
 * Represents a command for resizing a row or column in the grid.
 */
export class ResizeCommand {
    /**
     * Constructor
     * @param grid : Reference to the grid 
     * @param type : Type of the row or column
     * @param index : Index of the row or column
     * @param newSize : New size of the row or column
     * @param oldValue : Previous size of the row or column
     */
    constructor(grid, type = 'row' | 'column', index, newSize, oldValue) {
        this.grid = grid;
        this.type = type;
        this.index = index;
        this.newSize = newSize;
        this.previousSize = oldValue;
    }

    /**
     * Executes the resize command
     */
    execute() {
        if (this.type === 'row') {
            this.grid.rowHeights[this.index] = this.newSize;
        } else {
            this.grid.colWidths[this.index] = this.newSize;
        }

        this.grid.renderHeaders(0, 0);
        this.grid.renderCanvases();
    }

    /**
     * Executes the undo command
     */
    undo() {
        if (this.type === 'row') {
            this.grid.rowHeights[this.index] = this.previousSize;
        } else {
            this.grid.colWidths[this.index] = this.previousSize;
        }

        this.grid.renderHeaders(0, 0);
        this.grid.renderCanvases();
    }
}