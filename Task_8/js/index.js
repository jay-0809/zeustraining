import { Grid } from "./grid/grid.js";  
import { generateData } from "./data.js";

const wrapper = document.getElementById("wrapper-div");
// console.log("wr: ", wrapper);

// Controls how many cells per canvas
const rowsPerCanvas = 28;
const colsPerCanvas = 30;

// Max row & col limits
const maxRows = 100000;
const maxCols = 50;

// Generate dataset for the grid
const myData = generateData(100000);

// Initializing grid
new Grid(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);
