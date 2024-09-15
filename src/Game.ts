import { Canvas } from "./Canvas";
import { c_is_better, c_is_better2, deltaTime, localToWorld, localToWorldle } from "./Functions";
import { canvas, COLORS, GRAVITY, player, SQUARE_SIZE } from "./Globals";
import { TetrisShape, L_SHAPE, SQUARE_SHAPE, STUPID_SHAPE, PENIS_SHAPE, GODS_SHAPE } from "./TetrisShape";
export class Game {

  public canvas: Canvas;
  public deltaTime: number;
  public isPlacing: boolean;
  public tetrisShapes: TetrisShape[];
  public shapes: TetrisShape[];
  public isShapeDown: boolean;
  public currentShape: TetrisShape;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.tetrisShapes = []
    this.isShapeDown = true;
    this.currentShape = null;
  }


  paint = () => {
    const canvas = this.canvas;
    const map = this.canvas.map;
    canvas.clearScreen();
    canvas.drawTextWhere(`pountso${player.points}`, canvas.width - 100, 10)
    canvas.drawMap()
    canvas.drawFallingPieceAndShadow(this.currentShape)
    canvas.debug()
    if (!player.PAUSE) {
      this.update()
    }
    requestAnimationFrame(this.paint)
  }

  update = () => {
    const map = this.canvas.map

    if (this.currentShape) {
      this.goDown()
    }

    this.deltaTime = deltaTime(this.deltaTime);


    if (this.currentShape === null) {
      this.currentShape = this.generateRandomShape()
    }

    const { shapeMatrix, worldRow, worldCol } = this.currentShape;

    if (player.DOWN) {
      player.DOWN = false;
      this.instantDown()
      this.updateWorld()
      this.currentShape = null;
    }

    if (!this.currentShape) {
      return;
    }

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
    if (!increment) {
      this.updateWorld()
      this.currentShape = null;
      return;
    } else if (this.deltaTime == 0) {
      this.currentShape.worldRow++
    }

  }



  // caveman afff
  generateRandomShape(): TetrisShape {
    let shape: TetrisShape;
    const whichShape = 3;
    const color = COLORS[whichShape + 2]
    switch (whichShape) {
      case 0:
        shape = new TetrisShape(0, 0, STUPID_SHAPE, color, 2)
        break;
      case 1:
        shape = new TetrisShape(0, 0, GODS_SHAPE, color, 3)
        break;
      case 2:
        shape = new TetrisShape(0, 0, PENIS_SHAPE, color, 4)
        break;
      case 3:
        shape = new TetrisShape(0, 0, SQUARE_SHAPE, color, 5)
        break;
      case 4:
        shape = new TetrisShape(0, 0, L_SHAPE, color, 6)
        break;
    }
    return shape
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

    // la base pues la mandamos a la ergg
    let colsFilled = 0;
    let rowsFilled = 0;
    const rowsToRemove = []
    for (let row = 0; row < worldMap.length - 1; row++) {
      for (let col = 0; col < worldMap[0].length; col++) {
        if (worldMap[row][col] > 1) {
          colsFilled++
        }
        if (colsFilled >= worldMap[0].length) {
          worldMap[row].fill(0);
        }
      }
      if (colsFilled < worldMap[0].length) {
        colsFilled = 0;
        continue;
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


  PAIN(tetrisShape: TetrisShape, pivotRow: number): number {

    const map = this.canvas.map
    let mstr = ""
    let mstr2 = ""
    let possibleRows = []
    const { width, height, shapeMatrix, startRow, startCol } = this.currentShape;

    for (let ROW = 0; ROW < map.length; ROW++) {
      for (
        let localRow = startRow, worldRow = ROW;
        localRow < startRow + height;
        localRow++, worldRow++) {
        for (
          let localCol = startCol, { worldCol } = tetrisShape;
          localCol < startCol + width;
          localCol++, worldCol++
        ) {

          if ((map[worldRow] !== undefined) && map[worldRow][worldCol] == 1) {
            possibleRows.push(worldRow)
            localRow = Infinity
            localCol = Infinity
          }
        }
      }
    }

    return -1
  }

}


// shapeCol + this.currentShape.shapeMatrix[0].length
