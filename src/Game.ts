import { Canvas } from "./Canvas";
import { c_is_better2 } from "./Functions";
import { GRAVITY, map, player, SQUARE_SIZE, square_test } from "./Globals";
import { TetrisShape, L_SHAPE, SQUARE_SHAPE, STUPID_SHAPE, PENIS_SHAPE, GODS_SHAPE } from "./TetrisShape";
export class Game {

  public canvas: Canvas;
  public isPlacing: boolean;
  public tetrisShapes: TetrisShape[];
  public shapes: TetrisShape[];
  public isShapeDown: boolean;
  public currentShape: TetrisShape;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.tetrisShapes = []
    this.tetrisShapes.push(new TetrisShape(0, 0, L_SHAPE, "blue"))
    this.tetrisShapes.push(new TetrisShape(0, 60, SQUARE_SHAPE, "pink"))
    this.tetrisShapes.push(new TetrisShape(0, 200, STUPID_SHAPE, "orange"))
    this.tetrisShapes.push(new TetrisShape(200, 200, PENIS_SHAPE, "red"))
    this.tetrisShapes.push(new TetrisShape(500, 60, GODS_SHAPE, "YELLOW"))
    this.isShapeDown = true;
    this.currentShape = null;
  }


  paint = () => {
    const canvas = this.canvas;
    const map = this.canvas.map;
    canvas.clearScreen();
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        const color = ((row + (c_is_better2(col % 2 == 0))) % 2 == 0) ? "gray" : "black"
        canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, color);
        if (row === 0) {
        }
      }
    }


    if (this.currentShape) {
      canvas.drawTetrisShape(this.currentShape);
    }

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] == 1) {
          canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "blue");
        }
      }
    }
    // this.tetrisShapes.forEach(shape => {
    //   canvas.drawTetrisShape(shape);
    // });
    this.update()
    for (let col = 0; col < map[0].length; col++) {
      canvas.drawTextWhere(`c:${col}`, col * SQUARE_SIZE, 10)
    }
    for (let row = 0; row < map.length; row++) {
      canvas.drawTextWhere(`r:${row}`, 1, row * SQUARE_SIZE + 20)
    }
    requestAnimationFrame(this.paint)
  }

  // caveman afff
  generateRandomShape(): TetrisShape {
    let shape: TetrisShape;
    const whichShape = Math.trunc(Math.random() * 5)
    switch (whichShape) {
      case 0:
        shape = new TetrisShape(0, 0, STUPID_SHAPE, "orange")
        break;
      case 1:
        shape = new TetrisShape(0, 0, L_SHAPE, "blue")
        break;
      case 2:
        shape = new TetrisShape(0, 0, SQUARE_SHAPE, "pink")
        break;
      case 3:
        shape = new TetrisShape(0, 0, PENIS_SHAPE, "red")
        break;
      case 4:
        shape = new TetrisShape(0, 0, GODS_SHAPE, "YELLOW")
        break;
    }
    return shape
  }

  updateWorld() {
    const currentShape = this.currentShape;
    const worldMap = this.canvas.map
    const maxRow = currentShape.worldRow + currentShape.height
    const maxCol = currentShape.worldCol + currentShape.shapeMatrix[0].length
    for (let wRow = currentShape.worldRow, sRow = 0; wRow < maxRow; wRow++) {
      for (let wCol = currentShape.worldCol, sCol = 0; wCol < maxCol; wCol++) {
        if (currentShape.shapeMatrix[sRow][sCol] == 1) {
          worldMap[wRow][wCol] = 1;
        }
      }
    }
  }

  getHighestRowPossible(shapeCol: number) {
    const map = this.canvas.map
    const shapeWidth = this.currentShape.width;
    let row = 0
    for (; row < this.canvas.totalRows; row++) {
      for (let col = shapeCol; col < shapeCol + this.currentShape.shapeMatrix[0].length; col++) {
        if (map[row][col] == 1) {
          return row - this.currentShape.height;
        }
      }
    }
    return row - this.currentShape.height;
  }

  random() {
    return Math.trunc(Math.random() * 30)
  }

  getHighestRowPossiblev2(shapeCol: number) {
    const map = this.canvas.map
    const shapeWidth = this.currentShape.width;
    let mstr = "";
    console.log("col", shapeCol)
    let row = 0
    let retRow = 0;
    // for (; row < this.canvas.totalRows; row++) {
    //   for (let col = shapeCol; col < shapeCol + this.currentShape.shapeMatrix[0].length; col++) {
    //     mstr += `[${map[row][col]}]`
    //   }
    //   mstr += `\n`
    // }
    console.log(mstr)
    return this.random();
  }

  update = () => {
    if (player.UP) {
      this.tetrisShapes[0].y -= player.speed;
    }
    if (player.DOWN) {
      player.DOWN = false;
      console.log(this.currentShape.worldCol)
      // this.currentShape.worldRow = this.currentShape.getLowestRowPossibleInThisColv2(this.canvas.map, this.currentShape.worldCol)
      // this.canvas.placeInWorld(this.currentShape);
      this.currentShape = null;
    }

    if (player.LEFT) {
      this.currentShape.worldCol -= player.speed;
      player.LEFT = false;
    }

    if (player.RIGHT) {
      this.currentShape.worldCol += player.speed;
      player.RIGHT = false;
    }

    if (player.ROTATE) {
      this.currentShape.rotate()
      player.ROTATE = false;
    }

    if (this.currentShape === null) {
      this.currentShape = this.generateRandomShape()
    }
  }
}

