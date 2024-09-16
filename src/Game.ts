import { Canvas } from "./Canvas";
import { c_is_better, c_is_better2, deltaTime, localToWorld, localToWorldle } from "./Functions";
import { canvas, COLORS, GRAVITY, player, SHAPE_COL_ORIGIN, SHAPE_ROW_ORIGIN, SQUARE_SIZE } from "./Globals";
import { TetrisShape, L_SHAPE, SQUARE_SHAPE, STUPID_SHAPE, PENIS_SHAPE, GODS_SHAPE, SHAPES } from "./TetrisShape";
export class Game {

  public canvas: Canvas;
  public deltaTime: number;
  public isPlacing: boolean;
  public tetrisShapes: TetrisShape[];
  public holdedShapes: TetrisShape[];
  public shapes: TetrisShape[];
  public isShapeDown: boolean;
  public currentShape: TetrisShape;
  public timer: number;
  public date: Date;
  public hasHoldedThisTurn: boolean;
  public hasLoadedHoldThisTurn: boolean;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.tetrisShapes = []
    this.holdedShapes = []
    this.isShapeDown = true;
    this.hasLoadedHoldThisTurn = false;
    this.currentShape = null;
    this.timer = -Infinity;
    this.date = new Date();
  }


  paint = () => {
    const canvas = this.canvas;
    const map = this.canvas.map;
    canvas.clearScreen();
    canvas.drawTextWhere(`pountso${player.points}`, canvas.width - 100, 10)
    canvas.drawMap()
    canvas.drawTetrisShape(this.peekShape())
    canvas.drawFallingPieceAndShadow(this.currentShape)
    canvas.debug()
    if (!player.PAUSE) {
      this.update()
    }
    requestAnimationFrame(this.paint)
  }

  update = () => {

    if (this.currentShape === null) {
      this.currentShape = this.popShape();
      this.hasHoldedThisTurn = false;
      this.hasLoadedHoldThisTurn = false;
    }

    const map = this.canvas.map
    const { shapeMatrix, worldRow, worldCol } = this.currentShape;

    if (player.LEFT) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow, worldCol - 1)
      if (!collides) {
        this.currentShape.worldCol -= 1;
      }
      if (this.deltaTime < 15) {
        player.LEFT = false
      }
    }

    if (player.RIGHT) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow, worldCol + 1)
      if (!collides) {
        this.currentShape.worldCol += 1;
      }
      if (this.deltaTime < 15) {
        player.RIGHT = false
      }
    }

    if (player.HOLD && !this.hasHoldedThisTurn) {
      this.pushHoldedShape(this.currentShape)
      this.hasHoldedThisTurn = true;
      this.currentShape = this.popShape();
      player.HOLD = false;
    }

    if (player.LOAD_HOLD && !this.hasHoldedThisTurn) {
      this.currentShape = this.popHoldedShape()
      this.hasHoldedThisTurn = false;
      this.hasLoadedHoldThisTurn = true;
      player.LOAD_HOLD = false;
    }

    if (player.UP) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow - 1, worldCol)
      if (!collides) {
        this.currentShape.worldRow -= 1;
      }
      player.UP = false
    }

    if (player.DOWNa) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow + 1, worldCol)
      if (!collides) {
        this.currentShape.worldRow += 1;
      }
      player.DOWNa = false
    }

    if (player.ROTATE) {
      this.currentShape.rotate(map)
      player.ROTATE = false
    }

    if (this.currentShape) {
      this.goDown()
    }

    this.deltaTime = deltaTime(this.deltaTime);

    if (player.DOWN) {
      player.DOWN = false;
      this.instantDown()
      this.updateWorld()
      this.currentShape = null;
    }
  }

  // we leave this here because he is a friend :D
  instantDown() {
    const vertices = this.currentShape.vertices;
    const map = this.canvas.map
    const currRow = this.currentShape.worldRow;
    let rowsToMove: number = 0;
    if (map[currRow + 1] == undefined) {
      return;
    }

    let { worldRow, worldCol } = this.currentShape;

    for (let mRow = currRow; mRow < map.length; mRow++) {
      for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i]
        const { wRow, wCol } = localToWorldle(worldRow, worldCol, vertex.row, vertex.col)
        if (map[wRow + 1][wCol] != 0) {
          mRow = Infinity;
          break;
        }
      }
      worldRow++;
      rowsToMove++;
    }
    this.currentShape.worldRow += rowsToMove - 1
  }

  goDown() {
    const date = new Date();
    if (this.timer == -Infinity) {
      this.timer = date.getTime()
    }

    const vertices = this.currentShape.vertices;
    const map = this.canvas.map
    const currRow = this.currentShape.worldRow;
    if (map[currRow + 1] == undefined) {
      return map.length - 2;
    }
    let increment = true;
    for (let i = 0; i < vertices.length; i++) {
      const vect = vertices[i]
      const { wRow, wCol } = localToWorld(this.currentShape, vect.row, vect.col)

      if (map[wRow][wCol] != 0) {
        increment = false;
        break;
      }
      if (map[wRow + 1][wCol] != 0) {
        increment = false;
        break;
      }
    }

    // CAVEMAN
    if (!increment) {
      const time = date.getTime() - this.timer
      if (time < 1500) {
        return;
      }
      this.timer = -Infinity
      this.updateWorld()
      this.currentShape = null;
      return;
    } else if (this.deltaTime == 0) {
      this.timer = -Infinity
      this.currentShape.worldRow++
    }

  }



  popShape(): TetrisShape {
    if (!this.tetrisShapes.length) {
      this.fillShapesArray();
    }
    const poppedShape = this.tetrisShapes.pop()
    poppedShape.worldRow = SHAPE_ROW_ORIGIN
    poppedShape.worldCol = (SHAPE_COL_ORIGIN - poppedShape.startCol)
    return poppedShape
  }

  peekShape(): TetrisShape {
    if (!this.tetrisShapes.length) {
      this.fillShapesArray();
    }
    return this.tetrisShapes[this.tetrisShapes.length - 1]
  }

  pushHoldedShape(holdingShape: TetrisShape): void {
    console.log(this.hasHoldedThisTurn)
    if (this.hasHoldedThisTurn || this.holdedShapes.length > 10) {
      return
    }
    this.holdedShapes.push(holdingShape)
  }

  popHoldedShape(): TetrisShape {
    if (!this.holdedShapes.length) {
      return this.currentShape;
    }
    const poppedShape = this.holdedShapes.pop()
    poppedShape.worldRow = SHAPE_ROW_ORIGIN
    poppedShape.worldCol = (SHAPE_COL_ORIGIN - poppedShape.startCol)
    return poppedShape;
  }

  // caveman afff
  generateRandomShape(): TetrisShape {
    // const whichShape = 4;
    const whichShape = this.nRandom(SHAPES.length);
    const color = COLORS[whichShape + 2]
    return new TetrisShape(0, 0, SHAPES[whichShape], color, whichShape + 2)
  }

  fillShapesArray(): void {
    for (let i = 0; i < 5; i++) {
      const newShape = this.generateRandomShape()
      newShape.worldCol = 17 - newShape.startCol + newShape.shapeMatrix.length / 2
      newShape.worldRow = 3;
      this.tetrisShapes.unshift(newShape);
    }
  }




  updateWorld() {
    const currentShape = this.currentShape;
    const { worldRow, worldCol } = currentShape;
    const worldMap = this.canvas.map
    const matrix = currentShape.shapeMatrix;
    for (let row = 0, wRow = 0; row < matrix.length; row++, wRow++) {
      for (let col = 0, wCol = 0; col < matrix[0].length; col++, wCol++) {
        if (matrix[row][col] == 1) {
          worldMap[worldRow + wRow][worldCol + wCol] = currentShape.shapeNumber;
        }
      }
    }

    let rowsFilled = 0;
    let colsFilled = 0;
    const rowsToRemove = []
    for (let row = 0; row < worldMap.length - 1; row++) {
      colsFilled = 0
      for (let col = 0; col < worldMap[0].length; col++) {
        if (worldMap[row][col] > 1) {
          colsFilled++
        }
      }

      if (colsFilled < worldMap[0].length) {
        colsFilled = 0;
        continue;
      }

      if (colsFilled >= worldMap[0].length) {
        worldMap[row].fill(0);
      }
      rowsFilled++;
      rowsToRemove.push(row)
    }


    if (!rowsToRemove.length) {
      return;
    }


    const lowestRow = rowsToRemove.reduce((p, c) => c_is_better2(p > c) * p + c_is_better2(c > p) * c)

    for (let row = lowestRow; row > 10; row--) {
      const highestRow = this.getHighestRowPossible(worldMap, row)
      for (let col = 0; col < worldMap[0].length; col++) {
        worldMap[highestRow][col] = worldMap[row][col];
        worldMap[row][col] = 0
      }
    }

    for (let p = 1; p <= rowsFilled; p++) {
      player.points += 100 * p
    }

    for (let row = 0; row < worldMap.length - 1; row++) {
      for (let col = 0; col < worldMap[0].length; col++) {
        if (worldMap[row][col] > 1) {
          colsFilled++
        }
      }
    }
  }


  nRandom(n: number) {
    return Math.trunc(Math.random() * n)
  }

  random() {
    return Math.trunc(Math.random() * 30)
  }

  getHighestRowPossible(map: number[][], pivotRow: number) {
    let row = pivotRow + 1;
    for (; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] > 0) {
          return row - 1;
        }
      }
    }
    return row - 1
  }

}
