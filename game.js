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
function setup() {
  createCanvas(windowWidth, windowHeight);
  numOfCols = floor(width / cellWidth);
  numOfRows = floor(height / cellWidth);
  for(let rowNum = 0; rowNum < numOfRows; rowNum++) {
    for (let colNum = 0; colNum < numOfCols;colNum++) {
      let cell = new Cell(colNum, rowNum);
      cellsArray.push(cell);
      console.log(cell);
    }
  }
}
function draw() {
  background (255,215,0);
  for (let cellNum = 0; cellNum < cellsArray.length; cellNum++) {
    cellsArray[cellNum].show();
  }
}
function getIndex(rowNum, colNum) {
  return colNum + rowNum * numOfCols;
}
class Cell {
  constructor(cellRowNum, cellColNum){
    this.rowNum = cellRowNum;
    this.colNum = cellColNum;
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  checkNeighbors() {
    let neighbors = [];
    let top = cellsArray[getIndex(this.rowNum, this.colNum - 1)];
    let right = cellsArray[getIndex(this.rowNum + 1 , this.colNum)];
    let bottom = cellsArray[getIndex(this.rowNum, this.colNum - 1)];
    let left = cellsArray[getIndex(this.rowNum - 1, this.colNum)];
  }
  show() {
    let xPos = this.rowNum * cellWidth;
    let yPos = this.colNum * cellWidth;
    stroke (255);
    if (walls[0] == true) {
      line(xPos, yPos, xPos + cellWidth, yPos);
    }
    if (walls[2] == true) {
      line(xPos, yPos + cellWidth, xPos + cellWidth, yPos + cellWidth);
    }
    if (walls[3] == true) {
      line(xPos, yPos, xPos, yPos + cellWidth);
    }
    if (walls[1] == true) {
      line(xPos + cellWidth, yPos, xPos + cellWidth, yPos + cellWidth);
    }
  }
}