import { Canvas } from "./Canvas";
import { c_is_better2 } from "./Functions";
import { GRAVITY, map, player, SQUARE_SIZE } from "./Globals";


export const L_SHAPE: number[][] = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
]

export const STUPID_SHAPE: number[][] = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
]

export const PENIS_SHAPE: number[][] = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 0, 0],
]

export const SQUARE_SHAPE: number[][] = [
  [1, 1],
  [1, 1],
]

export const GODS_SHAPE: number[][] = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
]
export class TetrisUnit {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = SQUARE_SIZE;
    this.height = SQUARE_SIZE;
    this.color = color;
  }
}

export class TetrisShape {

  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;

  public shapesForm: TetrisUnit[];
  public shapeMatrix: number[][];
  public gravity: number;
  public worldRow: number;
  public worldCol: number;
  public maxRow: number;
  public screenX: number;
  public screenY: number;
  public pivotX: number;
  public pivotY: number;

  constructor(x: number, y: number, shapeMatrix: number[][], color: string) {
    this.x = x;
    this.y = y;
    this.worldRow = 0
    this.worldCol = 3
    this.shapeMatrix = shapeMatrix;
    this.color = color;
  }
  rotate() {
    const matrix = this.shapeMatrix;
    const N = matrix.length;

    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < i; ++j) {
        let temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }

    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < N / 2; ++j) {
        let temp = matrix[i][j];
        matrix[i][j] = matrix[i][N - j - 1];
        matrix[i][N - j - 1] = temp;
      }
    }
    let maxRows = 0;
    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < matrix[0].length; ++j) {
        if (matrix[i][j] == 1) {
          maxRows++;
          break;
        }
      }
    }
    this.height = maxRows;
    console.log("maxrow", this.worldRow)
    console.log("maxrow", maxRows)
  }

  checkCollision(tetrisShapes: TetrisShape[]) {
    tetrisShapes.forEach(shape => {
      const targetShapeMatrix = shape.shapeMatrix;
      for (let row = 0; row < targetShapeMatrix.length; row++) {
        for (let col = 0; col < targetShapeMatrix[0].length; col++) {
          this.shapeMatrix[row][col]
          targetShapeMatrix[row][col]
        }
      }
    });
  }

}

export class Game {

  public canvas: Canvas;
  public tetrisShapes: TetrisShape[];
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
      }
    }
    if (this.currentShape) {
      canvas.drawTetrisShape(this.currentShape);
    }
    // this.tetrisShapes.forEach(shape => {
    //   canvas.drawTetrisShape(shape);
    // });
    this.update()
    requestAnimationFrame(this.paint)
  }

  update = () => {
    const canvas = this.canvas;
    if (player.UP) {
      this.tetrisShapes[0].y -= player.speed;
    }
    if (player.DOWN) {
      this.tetrisShapes[0].y += player.speed;
    }
    if (player.LEFT) {
      this.tetrisShapes[0].x -= player.speed;
    }
    if (player.RIGHT) {
      this.tetrisShapes[0].x += player.speed;
    }
    if (player.ROTATE) {
      this.currentShape.rotate()
      player.ROTATE = false;
    }
    const rand = Math.trunc(Math.random() * 5);
    if (this.currentShape === null) {
      this.currentShape = this.tetrisShapes[rand]
    } else {
      console.log(this.currentShape.height)
      if (this.currentShape.worldRow + this.currentShape.height < this.canvas.totalRows) {
        this.currentShape.worldRow++;
      } else {
        const shape = this.currentShape
        const currRow = this.currentShape.worldRow;
        const currCol = this.currentShape.worldCol;
        for (let row = currRow, mRow = 0; row < currRow + shape.shapeMatrix.length; row++) {
          for (let col = currCol - shape.shapeMatrix[0].length, mCol = 0; col < currCol; col++) {
            if (shape.shapeMatrix[mRow][mCol]) {
              canvas.drawRect(col * (SQUARE_SIZE), row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "blue")
            }
            mCol++;
          }
          mRow++;
        }
      }
    }
    // this.tetrisShapes.forEach(shape => {
    //   if (shape.y + 10 < 500) {
    //     shape.y += (Math.random() * 10) * GRAVITY;
    //   }
    // });
  }
}
