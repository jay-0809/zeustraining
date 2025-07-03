import { Grid } from "./grid/grid.js";  
import { generateData } from "./data.js";

const wrapper = document.getElementById("wrapper-div");
const cellNum = document.querySelector(".cellNum");
const cellValue = document.querySelector(".cellValue");

// Controls how many cells per canvas
const rowsPerCanvas = 50;
const colsPerCanvas = 26;

// Max row & col limits
const maxRows = 100000;
const maxCols = 500;

// Generate dataset for the grid
const myData = generateData(10);
// console.log("myData:",myData);

// Initializing grid
new Grid(wrapper, cellNum, cellValue, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);
// new Grid(wrapper, rowsPerCanvas, colsPerCanvas, maxRows, maxCols, myData);
