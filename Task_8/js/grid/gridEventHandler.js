import { handleSelectionClick } from "./modulers.js";

export class GridEventHandler {
    constructor(grid) {
        this.grid = grid;
    }

    eventLisners() {
        window.addEventListener('scroll', () => {
            this.grid.renderCanvases();
            this.grid.renderHeaders();
        });

        window.addEventListener('click', (e) => handleSelectionClick.call(this.grid, e));      
    }

    display() {
        return (this.grid);
    }
}