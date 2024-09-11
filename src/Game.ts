import { Canvas } from "./Canvas";
import { SQUARE_SIZE } from "./Globals";


export const L_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
]

export const STUPID_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
]

export const PENIS_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
]

export const SQUARE_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
]

export const GODS_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0],
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
  public worldX: number;
  public worldY: number;
  public screenX: number;
  public screenY: number;
  public pivotX: number;
  public pivotY: number;

  constructor(x: number, y: number, shapeMatrix: number[][], color: string) {
    this.x = x;
    this.y = y;
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
  }

}

export class Game {

  public canvas: Canvas;
  public tetrisShapes: TetrisShape[]

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.tetrisShapes = []
    this.tetrisShapes.push(new TetrisShape(0, 0, L_SHAPE, "blue"))
    this.tetrisShapes.push(new TetrisShape(0, 60, SQUARE_SHAPE, "pink"))
    this.tetrisShapes.push(new TetrisShape(0, 200, STUPID_SHAPE, "orange"))
    this.tetrisShapes.push(new TetrisShape(200, 200, PENIS_SHAPE, "red"))
    this.tetrisShapes.push(new TetrisShape(500, 60, GODS_SHAPE, "YELLOW"))
    this.tetrisShapes.forEach(shape => {
      this.canvas.drawTetrisShape(shape);
    });
  }


  paint = () => {
    this.update()
    this.canvas.clearScreen();

    this.tetrisShapes.forEach(shape => {
      this.canvas.drawTetrisShape(shape);
    });
    // console.log(this.tetrisShapes)
    this.canvas.drawRectRotated(this.canvas.width / 2, this.canvas.height / 2, 400, 20, "red")
    requestAnimationFrame(this.paint)
  }

  update = () => {
    this.tetrisShapes[0].y += 1;

    this.tetrisShapes.forEach(shape => {
      shape.y += 1;
    });
    console.log("foo");
  }
}
