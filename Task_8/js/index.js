import { Grid } from "./grid/grid.js";  
import { generateData } from "./data.js";

const wrapper = document.getElementById("canvas-wrapper");
// console.log("wr: ", wrapper);

// Controls how many cells per canvas
const rowsPerCanvas = 50;
const colsPerCanvas = 26;

// Max row & col limits
const maxRows = 70;
const maxCols = 50;

// Generate dataset for the grid
const myData = generateData(1000);

// Initializing grid
new Grid(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);
