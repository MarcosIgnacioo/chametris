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
  [0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
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
  public leftVertices: Vertices[];
  public rightVertices: Vertices[];

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
    this.worldCol = 10
    this.shapeMatrix = shapeMatrix;
    this.color = color;
    this.uwuntu = uwuntu;
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
    this.shapeLeftVertices()
    // this.shapeRightVertices()
  }

  checkCollision(map: number[][], wR: number, wC: number): boolean {
    const m = this.shapeMatrix;
    for (let row = 0, wwR = wR; row < m.length; row++, wwR++) {
      for (let col = 0, wwC = wC; col < m[0].length; col++, wwC++) {
        if (m[row][col] == 1 && map[wwR][wwC] == 1) {
          return true;
        }
      }
    }
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

    // let maxRows = 0;
    // for (let i = 0; i < N; ++i) {
    //   for (let j = 0; j < matrix[0].length; ++j) {
    //     if (matrix[i][j] == 1) {
    //       maxRows++;
    //       break;
    //     }
    //   }
    // }
    //
    // this.height = maxRows;
    //
    // // let mstr = ""
    //
    // let maxCols = 0;
    //
    // const cols: number[] = [];
    // for (let i = 0; i < matrix[0].length; i++) {
    //   cols.push(0)
    // }
    //
    // for (let i = 0; i < matrix.length; i++) {
    //   for (let j = 0; j < matrix[0].length; j++) {
    //     if (matrix[i][j] == 1) {
    //       cols[j] = 1
    //     }
    //   }
    // }
    //
    // this.width = cols.filter(n => n > 0).length;
    //
    // let startRow: number = Infinity;
    // let startCol: number = Infinity;
    //
    // for (let i = 0; i < N; ++i) {
    //   for (let j = 0; j < matrix[0].length; ++j) {
    //     if (matrix[i][j] == 1) {
    //       if (i < startRow) {
    //         startRow = i
    //       }
    //       if (j < startCol) {
    //         startCol = j
    //       }
    //     }
    //   }
    // }
    //
    // this.startRow = startRow;
    // this.startCol = startCol;

    this.initShape()
  }

  shapeLeftVertices(): void {
    const vertices: Vertices[] = []
    let foundLeftMostCol = false;
    for (let r = 0; r < this.shapeMatrix.length; r++) {
      for (let c = 0; c < this.shapeMatrix[0].length; c++) {
        if (this.shapeMatrix[r][c] == 1) {
          foundLeftMostCol = true;
          vertices.push(({ row: r, col: c }) as Vertices)
        }
      }
      if (foundLeftMostCol) {
        break;
      }
    }
    this.leftVertices = vertices;
  }

  shapeRightVertices(): void {
    const vertices: Vertices[] = []
    let rightMostCol = this.shapeMatrix[0].length;
    let foundRightMostCol = false;
    for (let r = 0; r < this.shapeMatrix.length; r++) {
      for (let c = rightMostCol; c >= 0; c--) {
        if (this.shapeMatrix[r][c] == 1) {
          foundRightMostCol = true;
          vertices.push(({ row: r, col: c }) as Vertices)
        }
      }
      if (foundRightMostCol) {
        break;
      }
    }
    this.leftVertices = vertices;
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
    // console.log(vertices)
    this.printShape()
    this.vertices = vertices;
  }

  shapeGetLeftMostVertices(): Vertices[] {
    let prevCol = Infinity;
    const leftMost: Vertices[] = []
    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i].col < prevCol) {
        leftMost.pop()
      }
      if (this.vertices[i].col <= prevCol) {
        leftMost.push(this.vertices[i])
        prevCol = this.vertices[i].col;
      }
    }
    return leftMost
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
