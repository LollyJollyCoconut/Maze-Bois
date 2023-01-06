let playerObject;
let cellWidth = 100;
let wallWidth = 50;
let wallHeight = 50;
let offset = cellWidth/2;
let wallTexture;
let numOfCols, numOfRows;
let cellsArray = [];
let currentCellBeingVisited;
let stack = [];
let cameraXPos = 0;
let cameraYPos = 0;
let cameraZPos = 1000;
let cameraIncrement = 50;
let player;
let startingCell;
let endingCell;
let isMazeDoneDrawing = false;

function preload(){
  wallTexture = loadImage("E.png");
  playerObject = loadModel('Baller.obj');
}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  numOfCols = floor(width / cellWidth);
  numOfRows = floor(height / cellWidth);
  for(let rowNum = 0; rowNum < numOfRows; rowNum++) {
    for (let colNum = 0; colNum < numOfCols;colNum++) {
      let cell = new Cell(colNum, rowNum); 
      cellsArray.push(cell);
    }
  }
  currentCellBeingVisited = cellsArray[0];
  player = new Player();
}
function draw() {
  background (255,215,0);
  lights();
  modifyCameraSettings();
  // frustum(-1000000, 1000000, -1000000, 1000000, -1000000, 1000000);
  camera(cameraXPos, cameraYPos, cameraZPos, 0, 0, 0, 0, 1, 0);
  translate(-width/2, -height/2, 0);
  for (let cellNum = 0; cellNum < cellsArray.length; cellNum++) {
    cellsArray[cellNum].show();
  }
  if (isMazeDoneDrawing == false) {
    currentCellBeingVisited.visited = true;
    currentCellBeingVisited.highlight();
    let nextCellToVisit = currentCellBeingVisited.checkNeighbors();
    if (nextCellToVisit) {
      nextCellToVisit.visited = true;
      stack.push(currentCellBeingVisited);
      removeWalls(currentCellBeingVisited, nextCellToVisit);
      currentCellBeingVisited = nextCellToVisit;
    }
    else if (stack.length > 0){
      currentCellBeingVisited = stack.pop();
    }
    else {
      isMazeDoneDrawing = true;
      getStartAndEndPositions();
    }
  }
  else {
    endingCell.changeFloorColor(0,100,100);
    player.checkWinCondition();
    player.show();
  }
}
function modifyCameraSettings() {
  if (keyIsDown(87)) {
    cameraYPos -= cameraIncrement;
  }
  else if (keyIsDown(83)) {
    cameraYPos += cameraIncrement;
  }
  else if (keyIsDown(65)) {
    cameraXPos -= cameraIncrement;
  }
  else if (keyIsDown(68)) {
    cameraXPos += cameraIncrement;
  }
  else if (keyIsDown(81)) {
    cameraZPos -= cameraIncrement;
  }
  else if (keyIsDown(69)) {
    cameraZPos += cameraIncrement;
  }
}
function getStartAndEndPositions() {
  let topLeftCorner = cellsArray[getIndex(0,0)];
  let topRightCorner = cellsArray[getIndex(numOfCols - 1,0)];
  let bottomRightCorner = cellsArray[getIndex(numOfCols - 1, numOfRows - 1)];
  let bottomLeftCorner = cellsArray[getIndex(0,numOfRows - 1)];
  let cornerCellsArray = [topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner];
  if (!startingCell) {
    let randomIndex = floor(random(0,cornerCellsArray.length));
    startingCell = cornerCellsArray[randomIndex];
    player.rowNum = startingCell.rowNum;
    player.colNum = startingCell.colNum;
    player.getCurrentCellPosition();
    if (randomIndex == 0){
      endingCell = cornerCellsArray[2];
    }else if (randomIndex == 1){
      endingCell = cornerCellsArray[3];
    }else if (randomIndex == 2){
      endingCell = cornerCellsArray[0];
    }else if (randomIndex == 3){
      endingCell = cornerCellsArray[1];
    }
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
  let horizontalDifference = cellA.colNum - cellB.colNum;
  if (horizontalDifference === 1) {
    cellA.walls[3] = false;
    cellB.walls[1] = false;
  }else if (horizontalDifference === -1) {
    cellA.walls[1] = false;
    cellB.walls[3] = false;
  }
  let verticalDifference = cellA.rowNum - cellB.rowNum;
  if (verticalDifference == 1) {
    cellA.walls[0] = false;
    cellB.walls[2] = false;
  }else if (verticalDifference === -1) {
    cellA.walls[2] = false;
    cellB.walls[0] = false;
  }
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.move("up");
  }else if (keyCode === DOWN_ARROW) {
    player.move("down");
  }else if (keyCode === LEFT_ARROW) {
    player.move("left");
  }else if (keyCode === RIGHT_ARROW) {
    player.move("right");
  }
  return false;
}
class Cell {
  constructor(cellColNum, cellRowNum){
    this.rowNum = cellRowNum;
    this.colNum = cellColNum;
    this.walls = [true, true, true, true];
    this.visited = false;
  }
  changeFloorColor(r,g,b,a) {
    let xPos = this.colNum*cellWidth;
    let yPos = this.rowNum*cellWidth;
    noStroke();
    fill(r,g,b,a);
    rect(xPos, yPos, cellWidth, cellWidth);
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
    let bottom = cellsArray[getIndex(this.colNum, this.rowNum + 1)];
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
    noStroke();
    if (this.walls[0] == true) {
      line(xPos, yPos, xPos + cellWidth, yPos);
      translate(xPos + cellWidth/2, yPos, 0 + wallHeight/2);
      texture(wallTexture);
      box(cellWidth + offset, wallWidth, wallHeight);
      translate(-1*(xPos + cellWidth/2), -1*(yPos), -1*(0 + wallHeight/2));
    }
    if (this.walls[2] == true) {
      line(xPos, yPos + cellWidth, xPos + cellWidth, yPos + cellWidth);
      translate(xPos + cellWidth/2, yPos + cellWidth, 0 + wallHeight/2);
      texture(wallTexture);
      box(cellWidth + offset, wallWidth, wallHeight);
      translate(-1*(xPos + cellWidth/2), -1*(yPos + cellWidth), -1*(0 + wallHeight/2));
    }
    if (this.walls[3] == true) {
      line(xPos, yPos, xPos, yPos + cellWidth);
      translate(xPos, yPos + cellWidth/2, 0 + wallHeight/2);
      texture(wallTexture);
      box(wallWidth, cellWidth + offset, wallHeight);
      translate(-1*(xPos), -1*(yPos + cellWidth/2), -1*(0 + wallHeight/2));
    }
    if (this.walls[1] == true) {
      line(xPos + cellWidth, yPos, xPos + cellWidth, yPos + cellWidth);
      translate(xPos + cellWidth, yPos + cellWidth/2, 0 + wallHeight/2);
      texture(wallTexture);
      box(wallWidth, cellWidth + offset, wallHeight);
      translate(-1*(xPos + cellWidth), -1*(yPos + cellWidth/2), -1*(0 + wallHeight/2));

    }
    if (this.visited == true) {
      noStroke();
      fill(60, 279, 113, 100);
      rect(xPos, yPos, cellWidth, cellWidth);
    }
  }
}
class Player {
  constructor() {
    this.rowNum = 0;
    this.colNum = 0;
    this.modelObject = playerObject;
    this.currentCellPosition = 0;
  }
  show() {
    let xPos = this.colNum*cellWidth + cellWidth/2;
    let yPos = this.rowNum*cellWidth + cellWidth/2;
    let zPos = wallHeight/2;
    translate(xPos, yPos, zPos);
    scale(0.5);
    normalMaterial();
    model(this.modelObject);
    translate(-1*(xPos), -1*(yPos), -1*(zPos));
  }
  getCurrentCellPosition() {
    let cellIndex = getIndex(this.colNum, this.rowNum);
    this.currentCellPosition = cellsArray[cellIndex];
  }
  move(direction) {
    if(direction == "up") {
      if (this.currentCellPosition.walls[0] != true) {
        this.rowNum -= 1;
      }
    }else if (direction == "down") {
      if (this.currentCellPosition.walls[2] != true) {
        this.rowNum += 1;
      }
    }else if (direction == "left") {
      if (this.currentCellPosition.walls[3] != true) {
        this.colNum -= 1;
      }
    }else if (direction == "right") {
      if (this.currentCellPosition.walls[1] != true) {
        this.colNum += 1;
      }
    }
    this.getCurrentCellPosition();
  }
  checkWinCondition() {
    if (player.currentCellPosition == endingCell) {
      party.confetti(document.querySelector("body"));
    }
  }
}