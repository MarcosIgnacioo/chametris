import { Canvas } from "./Canvas";
import { c_is_better2 } from "./Functions";
import { canvas, GRAVITY, map, player, SQUARE_SIZE, square_test } from "./Globals";
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
    // this.tetrisShapes.push(new TetrisShape(0, 0, L_SHAPE, "blue"))
    // this.tetrisShapes.push(new TetrisShape(0, 60, SQUARE_SHAPE, "pink"))
    // this.tetrisShapes.push(new TetrisShape(0, 200, STUPID_SHAPE, "orange"))
    // this.tetrisShapes.push(new TetrisShape(200, 200, PENIS_SHAPE, "red"))
    // this.tetrisShapes.push(new TetrisShape(500, 60, GODS_SHAPE, "YELLOW"))
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
        if (row === 0) {
        }
      }
    }

    if (this.currentShape) {
      canvas.drawTetrisShape(this.currentShape);
    }

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        if (map[row][col] == 1) {
          canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "blue");
        }
        // if (map[row][col] == 2) {
        //   canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "red");
        // }
      }
    }
    // this.tetrisShapes.forEach(shape => {
    //   canvas.drawTetrisShape(shape);
    // });
    this.update()
    for (let col = 0; col < map[0].length; col++) {
      canvas.drawTextWhere(`c:${col}`, col * SQUARE_SIZE, 10)
    }
    for (let row = 0; row < map.length; row++) {
      canvas.drawTextWhere(`r:${row}`, 1, row * SQUARE_SIZE + 20)
    }
    requestAnimationFrame(this.paint)
  }

  update = () => {
    if (this.deltaTime < 60) {
      this.deltaTime++
    } else {
      this.deltaTime = 0;
    }
    if (player.UP) {
      this.tetrisShapes[0].y -= player.speed;
    }
    if (player.DOWN) {
      player.DOWN = false;
      this.instantDown()
      this.canvas.placeInWorld(this.currentShape);
      this.currentShape = null;
      // this.PAIN(this.currentShape, 0)
      // console.log(this.getHighestRowPossible(this.currentShape.worldCol) + this.currentShape.height)
    }

    if (player.LEFT) {
      this.currentShape.worldCol -= player.speed;
      player.LEFT = false;
    }

    if (player.RIGHT) {
      this.currentShape.worldCol += player.speed;
      player.RIGHT = false;
    }

    if (player.ROTATE) {
      this.currentShape.rotate()
      console.log("weprotacion")
      player.ROTATE = false;
    }

    if (this.currentShape === null) {
      this.currentShape = this.generateRandomShape()
    }
    this.goDown()

  }

  instantDown() {
    const vertices = this.currentShape.vertices;
    console.log(vertices)
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
        const { wRow, wCol } = this.localToWorldle(worldRow, worldCol, vertex.row, vertex.col)
        if (map[wRow + 1][wCol] == 1) {
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
      return;
    }
    let increment = true;
    for (let i = 0; i < vertices.length; i++) {
      const vect = vertices[i]
      const { wRow, wCol } = this.localToWorld(this.currentShape, vect.row, vect.col)
      if (map[wRow + 1][wCol] == 1) {
        increment = false;
        break;
      }
    }

    if (!increment) {
      this.canvas.placeInWorld(this.currentShape);
      this.currentShape = null;
      return;
    } else if (this.deltaTime % 3 == 0 && increment) {
      this.currentShape.worldRow++
    }

  }

  localToWorldle(wRow: number, wCol: number, row: number, col: number) {
    return { wRow: wRow + row, wCol: wCol + col }
  }

  localToWorld(tetrisShape: TetrisShape, row: number, col: number) {
    return { wRow: tetrisShape.worldRow + row, wCol: tetrisShape.worldCol + col }
  }

  shadow() {
    for (let i = 0; i < this.canvas.map.length; i++) {
      for (let j = 0; j < this.canvas.map[0].length; j++) {
        if (this.canvas.map[i][j] == 2) {
          this.canvas.map[i][j] = 0
        }
      }
    }
    let shadow = { ... this.currentShape }
    shadow.worldRow = this.getHighestRowPossible(shadow.worldCol, true)
    this.canvas.placeInWorld(shadow as TetrisShape, 2);
  }

  // caveman afff
  generateRandomShape(): TetrisShape {
    let shape: TetrisShape;
    const whichShape = Math.trunc(Math.random() * 5)
    switch (whichShape) {
      case 0:
        shape = new TetrisShape(0, 0, STUPID_SHAPE, "orange", "_-")
        break;
      case 1:
        shape = new TetrisShape(0, 0, GODS_SHAPE, "YELLOW", "|")
        break;
      case 2:
        shape = new TetrisShape(0, 0, PENIS_SHAPE, "red", ".|.")
        break;
      case 3:
        shape = new TetrisShape(0, 0, SQUARE_SHAPE, "pink", "[]")
        break;
      case 4:
        shape = new TetrisShape(0, 0, L_SHAPE, "blue", "L")
        break;
    }
    return shape
  }

  updateWorld() {
    const currentShape = this.currentShape;
    const worldMap = this.canvas.map
    const maxRow = currentShape.worldRow + currentShape.height
    const maxCol = currentShape.worldCol + currentShape.shapeMatrix[0].length
    for (let wRow = currentShape.worldRow, sRow = 0; wRow < maxRow; wRow++) {
      for (let wCol = currentShape.worldCol, sCol = 0; wCol < maxCol; wCol++) {
        if (currentShape.shapeMatrix[sRow][sCol] == 1) {
          worldMap[wRow][wCol] = 1;
        }
      }
    }
  }


  random() {
    return Math.trunc(Math.random() * 30)
  }

  getHighestRowPossiblev2(shapeCol: number) {
    const map = this.canvas.map
    const shapeWidth = this.currentShape.width;
    let mstr = "";
    let row = 0
    let retRow = 0;
    // for (; row < this.canvas.totalRows; row++) {
    //   for (let col = shapeCol; col < shapeCol + this.currentShape.shapeMatrix[0].length; col++) {
    //     mstr += `[${map[row][col]}]`
    //   }
    //   mstr += `\n`
    // }
    return this.random();
  }

  getHighestRowPossible(shapeCol: number, isShadow = false) {
    const map = this.canvas.map
    const shapeWidth = this.currentShape.width;
    const shapeHeight = this.currentShape.height;
    const name = this.currentShape.uwuntu
    let row = 0
    for (; row < this.canvas.totalRows; row++) {
      for (let col = shapeCol; col < shapeCol + shapeWidth; col++) {
        if (map[row][col] == 1) {
          return row - shapeHeight;
        }
      }
    }
    return row - shapeHeight;
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
