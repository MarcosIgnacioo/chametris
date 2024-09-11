import { TetrisShape } from "./Game";
import { SQUARE_SIZE } from "./Globals";

export class Canvas {
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public width: number;
  public height: number;
  public worldOriginX: number;
  public worldOriginY: number;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    if (!canvas || !context) {
      return;
    }
    this.canvas = canvas;
    this.context = context;
    this.context.imageSmoothingEnabled = false;
    this.width = canvas.width;
    this.height = canvas.height;
    this.worldOriginX = this.width / 2;
    this.worldOriginY = this.height / 2;

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
    this.context.clearRect(0, 0, this.width, this.height);
  }

  drawTetrisShape(tetrisShape: TetrisShape) {
    const matrix = tetrisShape.shapeMatrix;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
        if (matrix[row][col] == 1) {
          this.drawRect(col * SQUARE_SIZE + tetrisShape.x, row * SQUARE_SIZE + tetrisShape.y, SQUARE_SIZE, SQUARE_SIZE, tetrisShape.color)
        }
      }
    }
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
}
