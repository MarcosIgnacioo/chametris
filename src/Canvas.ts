import { c_is_better2 } from "./Functions";
import { COLORS, overlay, SQUARE_SIZE, TEXTURES, TOTAL_COLS, TOTAL_ROWS } from "./Globals";
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
    this.totalRows = TOTAL_ROWS;
    this.totalCols = TOTAL_COLS;
    this.worldOriginX = this.totalCols / 2 * SQUARE_SIZE;
    this.worldOriginY = this.totalRows / 2 * SQUARE_SIZE;
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

  drawTexture(textureSrc: string, row: number, col: number) {
    const img = new Image()
    img.src = textureSrc;
    const context = this.context
    context.drawImage(img, this.worldOriginX + col * SQUARE_SIZE, row * SQUARE_SIZE);
    overlay.style.transform = `scaleX(${Math.random()})`;
  }

  drawMap() {
    const map = this.map
    this.drawImage("bob.jpg", 0, -13)
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        const squareInScreen = map[row][col];
        if (squareInScreen > 0) {
          this.drawTexture(TEXTURES[squareInScreen], row, col)
        }
      }
    }
  }

  drawImage(imgSrc: string, row: number, col: number) {
    const img = new Image()
    const context = this.context
    img.src = imgSrc;
    img.onload = () => {
      context.drawImage(img, this.worldOriginX + col * SQUARE_SIZE, row * SQUARE_SIZE);
      overlay.style.transform = `scaleX(${Math.random()})`;
    }
    context.drawImage(img, this.worldOriginX + col * SQUARE_SIZE, row * SQUARE_SIZE);
    overlay.style.transform = `scaleX(${Math.random()})`;
  }

  drawImageAt(imgSrc: string, row: number, col: number) {
    const img = new Image()
    img.src = imgSrc;
    const context = this.context
    img.onload = () => {
      context.drawImage(img, row, col);
      overlay.style.transform = `scaleX(${Math.random()})`;
    }
    context.drawImage(img, row, col);
    overlay.style.transform = `scaleX(${Math.random()})`;
  }
  updateBarrier(rowToUpdate: number) {
    this.map[this.map.length - rowToUpdate].fill(1)
  }

  clearGameMap() {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[0].length; col++) {
        this.map[row][col] = 0
      }
    }
  }

  drawFallingPieceAndShadow(currentShape: TetrisShape) {
    if (!currentShape) {
      return;
    }
    const map = this.map
    const shadow: TetrisShape = { ...currentShape } as TetrisShape
    shadow.color = COLORS[COLORS.length - 2]
    shadow.textureSrc = "block_texture_8.png"
    this.drawTetrisShape(currentShape);
    shadow.worldRow = currentShape.getLowestRow(map) - 1
    this.context.globalAlpha = 0.5
    if (shadow.worldRow == currentShape.worldRow) {
      shadow.color = COLORS[COLORS.length - 1]
    }
    this.drawTetrisShape(shadow);
    this.context.globalAlpha = 1
  }

  drawTetrisTexture(tetrisShape: TetrisShape, wCol: number, wRow: number) {
    const img = new Image()
    img.src = tetrisShape.textureSrc;
    const context = this.context
    context.drawImage(img, this.worldOriginX + wCol * SQUARE_SIZE + (tetrisShape.worldCol * SQUARE_SIZE), wRow * SQUARE_SIZE + (tetrisShape.worldRow * SQUARE_SIZE))
    overlay.style.transform = `scaleX(${Math.random()})`;
  }




  drawTetrisShape(tetrisShape: TetrisShape) {
    const matrix = tetrisShape.shapeMatrix;
    for (let row = 0, wRow = 0; row < + matrix.length; row++, wRow++) {
      for (let col = 0, wCol = 0; col < + matrix[0].length; col++, wCol++) {
        if (matrix[row][col] == 1) {
          if (tetrisShape.textureSrc) {
            this.drawTetrisTexture(tetrisShape, wCol, wRow)
          } else {
            this.drawRect(this.worldOriginX + wCol * SQUARE_SIZE + (tetrisShape.worldCol * SQUARE_SIZE), wRow * SQUARE_SIZE + (tetrisShape.worldRow * SQUARE_SIZE), SQUARE_SIZE, SQUARE_SIZE, tetrisShape.color)
          }
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

  drawTextWhere(text: string, x: number, y: number, fontSize: number = 20) {
    this.context.fillStyle = '#d7a018'
    this.context.font = `bold ${fontSize}px Arial`;
    this.context.fillText(text, x, y);
  }
}
