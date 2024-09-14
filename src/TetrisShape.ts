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

export const STUPID_SHAPE: number[][] = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 1, 0],
  [0, 0, 0],
]

export const PENIS_SHAPE: number[][] = [
  [0, 1, 0],
  [0, 1, 1],
  [0, 1, 0],
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
  public pixels: number;
  public startRow: number;
  public startCol: number;
  public uwuntu: string;
  public vertices: Vertices[];

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

  constructor(x: number, y: number, shapeMatrix: number[][], color: string, uwuntu: string) {
    this.x = x;
    this.y = y;
    this.worldRow = 0
    this.worldCol = 3
    this.shapeMatrix = shapeMatrix;
    this.color = color;
    this.uwuntu = uwuntu;
    this.initShape();
  }

  initShape() {
    const matrix = this.shapeMatrix;
    const N = matrix.length;

    let maxCols = 0
    let maxRows = 0;
    let pixels = 0;
    let prevCols = 0;

    let mstr = ""
    // matrix log
    // mstr += `[${matrix[i][j]}]`;
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

    // let mstr = ""

    let maxCols = 0;

    const cols: number[] = [];
    for (let i = 0; i < matrix[0].length; i++) {
      cols.push(0)
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[0].length; j++) {
        if (matrix[i][j] == 1) {
          cols[j] = 1
        }
      }
    }

    this.width = cols.filter(n => n > 0).length;

    // matrix log
    // mstr += `[${matrix[i][j]}]`


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

  getLowestRowPossibleInThisCol(worldMap: number[][], totalRows: number): number {
    let worldRowLimit = totalRows;
    let pixelsRendered = 0;
    let worldCol = this.worldCol;
    for (let lowestRow = worldRowLimit - 1; lowestRow >= 0; lowestRow--) {
      for (let mRow = 0; mRow < this.shapeMatrix.length; mRow++) {
        for (let mCol = 0; mCol < this.shapeMatrix[0].length; mCol++) {
          if (this.shapeMatrix[mRow][mCol] == 1) {
            if (worldMap[lowestRow - mRow][worldCol] == 0) {
              pixelsRendered++;
            } else {
              break;
            }
          }
          worldCol++;
        }
        worldCol = this.worldCol;
      }
      if (pixelsRendered == this.pixels) {
        return lowestRow;
      }
      pixelsRendered = 0;
    }
    return -1;
  }

  getLowestRowPossibleInThisColv2(worldMap: number[][], totalRows: number): number {
    let worldCol = this.worldCol;
    let worldRow = totalRows - this.height;
    for (let wRow = worldRow, sRow = 0; wRow < totalRows; wRow++, sRow++) {
      for (let wCol = worldCol, sCol = 0; wCol < worldCol + this.shapeMatrix[0].length; wCol++, sCol++) {
        if (worldMap[wRow][wCol] == 1 && this.shapeMatrix[sRow][sCol] == 1) {
          return this.getLowestRowPossibleInThisColv2(worldMap, totalRows - 1);
        }
      }
    }
    return worldRow;
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

}
