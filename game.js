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
let currentCellBeingVisited;
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
  currentCellBeingVisited = cellsArray[0];
}
function draw() {
  background (255,215,0);
  for (let cellNum = 0; cellNum < cellsArray.length; cellNum++) {
    cellsArray[cellNum].show();
  }
  currentCellBeingVisited.visited = true;
  currentCellBeingVisited.highlight();
  let nextCellToVisit = currentCellBeingVisited.checkNeighbors();
  nextCellToVisit.highlight();
  if (nextCellToVisit) {
    nextCellToVisit.visited = true;
    removeWalls(currentCellBeingVisited, nextCellToVisit);
    currenctCellBeingVisited = nextCellToVisit;
  }
}
function getIndex(colNum, rowNum) {
  if (colNum < 0 || rowNum < 0 || colNum > numOfCols - 1 || rowNum > numOfRows - 1) {
     return -1;
  }else {
    return colNum + rowNum * numOfCols;
  }
}
function removeWalls(cellA, cellB) {
  let horizontalDifference = cellA.rowNum - cellB.rowNum;
  if (horizontalDifference === 1) {
    cellA.walls[3] = false;
    cellB.walls[1] = false;
  }else if (horizontalDifference === -1) {
    cellA.walls[1] = false;
    cellB.walls[3] = false;
  }
  let verticalDifference = cellA.colNum - cellB.colNum;
  if (verticalDifference == 1) {
    cellA.walls[0] = false;
    cellB.walls[2] = false;
  }else if (verticalDifference === -1) {
    cellA.walls[2] = false;
    cellB.walls[0] = false;
  }
}
class Cell {
  constructor(cellColNum, cellRowNum){
    this.rowNum = cellRowNum;
    this.colNum = cellColNum;
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  highlight() {
    let xPos = this.colNum*cellWidth;
    let yPos = this.rowNum*cellWidth;
    noStroke();
    fill(0, 0, 255, 100);
    rect(xPos, yPos, cellWidth, cellWidth);
  }
  checkNeighbors() {
    let neighbors = [];
    let top = cellsArray[getIndex(this.colNum, this.rowNum - 1)];
    let right = cellsArray[getIndex(this.colNum + 1 , this.rowNum)];
    let bottom = cellsArray[getIndex(this.colNum, this.rowNum - 1)];
    let left = cellsArray[getIndex(this.colNum - 1, this.rowNum)];
    if (top && top.visited == false) {
      neighbors.push(top);
    }
    if (right && right.visited == false) {
      neighbors.push(right);
    }
    if (bottom && bottom.visited == false) {
      neighbors.push(bottom);
    }
    if (left && left.visited == false) {
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      let randomNeighborIndex = floor(random(0, neighbors.length));
      return neighbors[randomNeighborIndex];
    }else {
      return undefined;
    }
  }
  show() {
    let xPos = this.colNum * cellWidth;
    let yPos = this.rowNum * cellWidth;
    stroke (255);
    if (this.walls[0] == true) {
      line(xPos, yPos, xPos + cellWidth, yPos);
    }
    if (this.walls[2] == true) {
      line(xPos, yPos + cellWidth, xPos + cellWidth, yPos + cellWidth);
    }
    if (this.walls[3] == true) {
      line(xPos, yPos, xPos, yPos + cellWidth);
    }
    if (this.walls[1] == true) {
      line(xPos + cellWidth, yPos, xPos + cellWidth, yPos + cellWidth);
    }
  }
}