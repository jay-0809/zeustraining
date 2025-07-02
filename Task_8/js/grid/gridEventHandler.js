import { handleSelectionClick } from "./modulers.js";

export class GridEventHandler {
    constructor(grid) {
        this.grid = grid;
    }

    eventLisners() {
        window.addEventListener('scroll', (e) => {
            // e.preventDefault();
            this.grid.renderCanvases();
            this.grid.renderHeaders();
        });

        this.grid.wrapper.addEventListener('click', (e) => handleSelectionClick.call(this.grid, e));
    }

    display() {
        return (this.grid);
    }
}