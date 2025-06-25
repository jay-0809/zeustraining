import { Grid } from "./grid/grid.js";  
import { generateData } from "./data.js";

const wrapper = document.getElementById("canvas-wrapper");
// console.log("wr: ", wrapper);

// Controls how many cells per canvas
const rowsPerCanvas = 28;
const colsPerCanvas = 30;

// Max row & col limits
const maxRows = 1000;
const maxCols = 500;

// Generate dataset for the grid
const myData = generateData(100);

// Initializing grid
new Grid(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);
