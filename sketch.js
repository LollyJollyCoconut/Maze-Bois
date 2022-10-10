// let angleX;
// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   angleX = 0;
// }

// function draw() {
//   background(255, 0, 0)
//   rectMode(CENTER);
//   angleX += 1;
//   rotateX(radians(angleX));
//   rotateY(radians(45));
//   rotateZ(radians(45));
//   box(50, 50, 100);
// }
let cellWidth = 20;
let numOfCols, numOfRows;
let cellsArray = [];
function setup {
  createCanvas(width, height);
  numOfCols = floor(width / cellWidth);
  numOfRows = floor(height / cellWidth);
  for(let rowNum = 0; rowNum < numOfRows; rowNum++) {
    for (let colNum = 0; colNum < numOfCol;colNum++) {
      let cell = new Cell(colNum, rowNum);
      cellsArray.push(cell);
      console.log(cell);
    }
}
class Cell {
  constructor(cellRowNum, cellColNum){
    this.rowNum = cellRowNum;
    this.colNum = cellColNum;
  }
}