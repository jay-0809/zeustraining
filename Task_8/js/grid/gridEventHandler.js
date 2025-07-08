// import { handleSelectionClick } from "./modulers.js";

// export class GridEventHandler {
//     constructor(grid) {
//         this.grid = grid;
//     }

//     eventListeners() {
//         window.addEventListener('scroll', (e) => {
//             this.grid.renderCanvases();
//             this.grid.renderHeaders();

//             if (this.grid.cellSelector?.cellRange?.isValid() && this.grid.cellSelector?.dragged) {
//                 const range = this.grid.cellSelector.cellRange;
//                 const coords = this.grid.getCanvasCoords();
//                 coords.forEach(([x, y]) => {
//                     const key = JSON.stringify([x, y]);
//                     const canvas = this.grid.canvases[key];
//                     if (canvas) {
//                         canvas.drawMultiSelection(range);
//                     }
//                 });
//             }
//         });

//         this.grid.wrapper.addEventListener('pointerdown', (e) => handleSelectionClick.call(this.grid, e));
//     }

//     display() {
//         return (this.grid);
//     }
// }

export class GridEventHandler {
  constructor(grid) {
    this.grid = grid;
  }
  display() { return this.grid; }
}