import { SQUARE_SIZE } from "./Globals"

export interface Vertices {
  row: number
  col: number
}

export const L_SHAPE: number[][] = [
  [0, 1, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
]

export const L_SHAPE_REVERSED: number[][] = [
  [0, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 1, 1, 0],
]

export const STUPID_SHAPE: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 0, 0],
]

export const STUPID_SHAPE_REVERSED: number[][] = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0],
]

export const PENIS_SHAPE: number[][] = [
  [0, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 0],
]

export const SQUARE_SHAPE: number[][] = [
  [0, 0, 0, 0],
  [0, 1, 1, 0],
  [0, 1, 1, 0],
  [0, 0, 0, 0],
]

export const GODS_SHAPE: number[][] = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
]

export const SHAPES: number[][][] = [];
SHAPES.push(GODS_SHAPE); // 0
SHAPES.push(L_SHAPE);//  1
SHAPES.push(L_SHAPE_REVERSED); // 2
SHAPES.push(STUPID_SHAPE); // 3
SHAPES.push(STUPID_SHAPE_REVERSED); // 4
SHAPES.push(SQUARE_SHAPE);// 5
SHAPES.push(PENIS_SHAPE);// 6

export class TetrisShape {

  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public color: string;
  public pixels: number;
  public startRow: number;
  public startCol: number;
  public shapeNumber: number;
  public textureSrc: string;
  public vertices: Vertices[];
  public leftVertices: Vertices[];
  public rightVertices: Vertices[];

  public worldRow: number;
  public worldCol: number;

  public shapeMatrix: number[][];
  public gravity: number;


  constructor(x: number, y: number, shapeMatrix: number[][], color: string, shapeNumber: number, textureSrc: string = "") {
    this.x = x;
    this.y = y;
    this.worldRow = 0
    this.worldCol = 10
    this.shapeMatrix = shapeMatrix;
    this.color = color;
    this.shapeNumber = shapeNumber
    this.textureSrc = textureSrc
    this.initShape();
  }

  initShape() {
    const matrix = this.shapeMatrix;
    const N = matrix.length;

    let maxRows = 0;
    let pixels = 0;

    const cols: number[] = [];
    for (let i = 0; i < matrix[0].length; i++) {
      cols.push(0)
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] == 1) {
          cols[j] += 1;
          pixels++;
        }
      }
    }

    this.width = cols.filter(n => n > 0).length;
    this.pixels = pixels;

    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < matrix[0].length; ++j) {
        if (matrix[i][j] == 1) {
          maxRows++;
          break;
        }
      }
    }

    this.height = maxRows;

    let startRow: number = Infinity;
    let startCol: number = Infinity;


    for (let i = 0; i < N; ++i) {
      for (let j = 0; j < matrix[0].length; ++j) {
        if (matrix[i][j] == 1) {
          if (i < startRow) {
            startRow = i
          }
          if (j < startCol) {
            startCol = j
          }
        }
      }
    }
    this.startRow = startRow;
    this.startCol = startCol;
    this.shapeVertices()
  }

  isColliding(m: number[][], map: number[][], wR: number, wC: number): boolean {
    const realCol = wC + this.startCol;

    if (realCol < 0 || realCol + this.width - 1 >= map[0].length) {
      return true;
    }

    for (let row = 0, wwR = wR; row < m.length; row++, wwR++) {
      for (let col = 0, wwC = wC; col < m[0].length; col++, wwC++) {
        if (m[row][col] > 0 && map[wwR][wwC] > 0) {
          return true;
        }
      }
    }
  }

  getLowestRow(map: number[][]) {
    const shapeMatrix = this.shapeMatrix
    if (!shapeMatrix) {
      return;
    }
    let row = this.worldRow
    for (; row < map.length; row++) {
      if (this.isColliding(shapeMatrix, map, row, this.worldCol)) {
        break;
      }
    }
    return row;
  }

  rotate(map: number[][]) {
    const matrix = this.shapeMatrix.map(function(arr) {
      return arr.slice();
    });
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
    this.shapeMatrix = matrix;
    this.initShape()
    if (this.isColliding(matrix, map, this.worldRow, this.worldCol)) {
      this.rotate(map)
      return;
    }
  }


  shapeVertices(): void {
    const vertices: Vertices[] = []
    for (let r = 0; r < this.shapeMatrix.length; r++) {
      for (let c = 0; c < this.shapeMatrix[0].length; c++) {
        if (this.shapeMatrix[r][c] == 1 && (this.shapeMatrix[r + 1] == undefined || this.shapeMatrix[r + 1][c] == 0)) {
          vertices.push(({ row: r, col: c }) as Vertices)
        }
      }
    }
    this.vertices = vertices;
  }

  printShape(): void {
    let mstr = "";
    for (let i = 0; i < this.shapeMatrix.length; i++) {
      for (let j = 0; j < this.shapeMatrix[0].length; j++) {
        mstr += `[${this.shapeMatrix[i][j]}]`
      }
      mstr += `\n`
    }
    console.log(mstr)
  }

}
