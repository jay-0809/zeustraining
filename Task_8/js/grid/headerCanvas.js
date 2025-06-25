
// Horizontal header canvas 
export function horizontalCanvas(grid){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000"
    // console.log("canvas", canvas, "grid.cellHeight", grid.cellHeight, "grid.cellWidth", grid.cellWidth, "colsPerCanvas", grid.colsPerCanvas, "rowsPerCanvas", grid.rowsPerCanvas);
    return `im horizontal`;
}

// Vertical header canvas 
export function verticalCanvas(grid){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000"
    // console.log(grid);    
    return `im vertical`; 
}
