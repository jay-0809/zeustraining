import { Grid } from "./grid.js";
import {generateData} from "./data.js";

const wrapper = document.getElementById("canvas-wrapper");
// console.log("wr: ", wrapper);
// Controls how many cells per canvas
const CANVAS_ROWS = 50;
const CANVAS_COLS = 26;

// Max row & col limits
const MAX_ROWS = 100;
const MAX_COLS = 50;


const myData = generateData(1000); // generates records for MAX_ROWS
new Grid(wrapper, CANVAS_ROWS, CANVAS_COLS, MAX_ROWS, MAX_COLS, myData);
// console.log(myData);