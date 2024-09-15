// this.tetrisShapes.forEach(shape => {
//   if (shape.y + 10 < 500) {
//     shape.y += (Math.random() * 10) * GRAVITY;
//   }
// });
// 
// if (this.currentShape.worldRow + this.currentShape.height < this.canvas.totalRows) {
//   this.currentShape.worldRow++;
// } else {
//   const shape = this.currentShape
//   const currRow = this.currentShape.worldRow;
//   const currCol = this.currentShape.worldCol;
//   for (let row = currRow, mRow = 0; row < currRow + shape.shapeMatrix.length; row++) {
//     for (let col = currCol - shape.shapeMatrix[0].length, mCol = 0; col < currCol; col++) {
//       if (shape.shapeMatrix[mRow][mCol]) {
//         canvas.drawRect(col * (SQUARE_SIZE), row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "blue")
//       }
//       mCol++;
//     }
//     mRow++;
//   }
for (let mRow = 0; mRow < this.shapeMatrix.length; mRow++) {
  for (let mCol = 0; mCol < this.shapeMatrix[0].length; mCol++) {
    matrix += (worldMap[worldRow][worldCol])
    if (
      this.shapeMatrix[mRow][mCol] == 1 &&
      worldMap[worldRow][worldCol] == 0) {
      totalPixels++;
    }
    if (
      this.shapeMatrix[mRow][mCol] == 1 &&
      worldMap[worldRow][worldCol] == 1) {
      mRow = Infinity;
      break;
    }
    worldCol++;
  }
  if (totalPixels == this.pixels) {
    return worldRow;
  }
  worldRow++;
  matrix += "\n"
}

shadow() {
  for (let i = 0; i < this.canvas.map.length; i++) {
    for (let j = 0; j < this.canvas.map[0].length; j++) {
      if (this.canvas.map[i][j] == 2) {
        this.canvas.map[i][j] = 0
      }
    }
  }
  let shadow = { ... this.currentShape }
  shadow.worldRow = this.getHighestRowPossible(shadow.worldCol, true)
  this.canvas.placeInWorld(shadow as TetrisShape, 2);
}
