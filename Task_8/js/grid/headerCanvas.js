
// Horizontal header canvas 
/**
 * 
 * @param {*} grid 
 * @returns 
 */
export function horizontalCanvas(grid){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000"
    for (let c = 0; c < grid.colsPerCanvas; c++) {
    }
    // console.log("canvas", canvas, "grid.cellHeight", grid.cellHeight, "grid.cellWidth", grid.cellWidth, "colsPerCanvas", grid.colsPerCanvas, "rowsPerCanvas", grid.rowsPerCanvas);
    return `im horizontal`;
}

/**
 * 
 * @param {*} grid 
 * @returns 
 */
// Vertical header canvas 
export function verticalCanvas(grid){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000"
    for (let r = 0; r < grid.rowsPerCanvas; r++) {
    }
    // console.log(grid);    
    return `im vertical`; 
}
