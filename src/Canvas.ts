import { c_is_better2 } from "./Functions";
import { COLORS, SQUARE_SIZE } from "./Globals";
import { TetrisShape } from "./TetrisShape";

export class Canvas {
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public width: number;
  public height: number;
  public worldOriginX: number;
  public worldOriginY: number;
  public totalRows: number;
  public totalCols: number;
  public map: number[][];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    if (!canvas || !context) {
      return;
    }
    this.canvas = canvas;
    this.context = context;
    this.context.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.totalRows = 24;
    this.totalCols = 16;
    this.worldOriginX = this.width / 2 + this.totalCols / 2 * SQUARE_SIZE;
    this.worldOriginY = this.height / 2 + this.totalRows / 2 * SQUARE_SIZE;
    this.map = [];
    this.initMap();
  }

  initMap() {
    for (let row = 0; row < this.totalRows; row++) {
      const cols = []
      for (let col = 0; col < this.totalCols; col++) {
        if (row == this.totalRows - 1) {
          cols.push(1)
        } else {
          cols.push(0);
        }
      }
      this.map.push(cols)
    }

    const asdf = this.map.length - 2
    for (let i = 0; i < this.map[0].length - 2; i++) {
      this.map[asdf][i] = 2;
      this.map[asdf - 1][i] = 2;
      this.map[asdf - 2][i] = 2;
      this.map[asdf - 3][i] = 2;
      this.map[asdf - 4][i] = 2;
    }
  }

  drawRect(x: number, y: number, width: number, height: number, color: string) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, width, height);
  }

  drawRectRotated(x: number, y: number, width: number, height: number, color: string) {
    const ctx = this.context;
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width, height);
    ctx.rotate((90 * Math.PI) / 180)
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  clearScreen() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
  }

  drawMap() {
    const map = this.map
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        const color = ((row + (c_is_better2(col % 2 == 0))) % 2 == 0) ? "gray" : "black"
        this.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, color);
        const squareInScreen = map[row][col];
        if (squareInScreen > 0) {
          this.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, COLORS[squareInScreen]);
        }
      }
    }
  }

  drawFallingPieceAndShadow(currentShape: TetrisShape) {
    if (!currentShape) {
      return;
    }
    const map = this.map
    const shadow: TetrisShape = { ...currentShape } as TetrisShape
    shadow.color = COLORS[7]
    this.drawTetrisShape(currentShape);
    shadow.worldRow = currentShape.getLowestRow(map) - 1
    this.drawTetrisShape(shadow);
  }


  drawTetrisShape(tetrisShape: TetrisShape) {
    const matrix = tetrisShape.shapeMatrix;
    for (let row = 0, wRow = 0; row < + matrix.length; row++, wRow++) {
      for (let col = 0, wCol = 0; col < + matrix[0].length; col++, wCol++) {
        if (matrix[row][col] == 1) {
          this.drawRect(wCol * SQUARE_SIZE + (tetrisShape.worldCol * SQUARE_SIZE), wRow * SQUARE_SIZE + (tetrisShape.worldRow * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE, tetrisShape.color)
        }

      }
    }
  }
  debug() {
    const map = this.map
    for (let col = 0; col < map[0].length; col++) {
      this.drawTextWhere(`c:${col}`, col * SQUARE_SIZE, 10)
    }
    for (let row = 0; row < map.length; row++) {
      this.drawTextWhere(`r:${row}`, 1, row * SQUARE_SIZE + 20)
    }
  }

  placeInWorld(tetrisShape: TetrisShape, blockValue: number = 1) {
    const matrix = tetrisShape.shapeMatrix;
    for (let row = 0, wRow = 0; row < matrix.length; row++, wRow++) {
      for (let col = 0, wCol = 0; col < matrix[0].length; col++, wCol++) {
        if (matrix[row][col] == 1) {
          this.map[tetrisShape.worldRow + wRow][tetrisShape.worldCol + wCol] = blockValue;
        }
      }
    }
  }

  testCollision(tetrisShape: TetrisShape) {
    const matrix = tetrisShape.shapeMatrix;
    let mstr = ""
    for (let row = 0, wRow = 0; row < matrix.length; row++, wRow++) {
      for (let col = 0, wCol = 0; col < matrix[0].length; col++, wCol++) {
        if (matrix[row][col] == 1) {
          console.log(this.map[tetrisShape.worldRow + wRow][tetrisShape.worldCol + wCol]);
          mstr += `[${this.map[row][col]}]`
        }
      }
      mstr += `\n`
    }
    console.log(mstr)
  }

  drawCircle(x: number, y: number, radius: number, color: string) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0 * Math.PI, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();
  }

  drawText(text: string) {
    this.drawRect(0, 0, 100, 40, "red")
    this.context.strokeText(text, 0, 40);
  }

  drawTextWhere(text: string, x: number, y: number) {
    this.context.strokeStyle = 'white'
    this.context.strokeText(text, x, y);
  }
}
