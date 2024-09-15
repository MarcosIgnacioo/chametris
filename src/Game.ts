import { Canvas } from "./Canvas";
import { c_is_better2, deltaTime, localToWorld, localToWorldle } from "./Functions";
import { canvas, COLORS, GRAVITY, player, SQUARE_SIZE, square_test } from "./Globals";
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
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        const color = ((row + (c_is_better2(col % 2 == 0))) % 2 == 0) ? "gray" : "black"
        canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, color);
        if (row === 0) {
        }
      }
    }

    if (this.currentShape) {
      const shadow: TetrisShape = { ... this.currentShape } as TetrisShape
      shadow.color = COLORS[7]
      canvas.drawTetrisShape(this.currentShape);
      shadow.worldRow = this.currentShape.getLowestRow(map) - 1
      canvas.drawTetrisShape(shadow);
    }

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[0].length; col++) {
        // if (map[row][col] == 2) {
        //   canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, "white");
        //   canvas.context.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        // }
        const squareInScreen = map[row][col];
        if (squareInScreen > 0) {
          canvas.drawRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE, COLORS[squareInScreen]);
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
    if (this.currentShape) {
      this.goDown()
    }

    this.deltaTime = deltaTime(this.deltaTime);

    const map = this.canvas.map

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

    if (player.LEFT && this.currentShape) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow, worldCol - 1)
      if (!collides) {
        this.currentShape.worldCol -= 1;
      }
      player.LEFT = false
    }

    if (player.RIGHT && this.currentShape) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow, worldCol + 1)
      if (!collides) {
        this.currentShape.worldCol += 1;
      }
      player.RIGHT = false
    }

    if (player.UP && this.currentShape) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow - 1, worldCol)
      if (!collides) {
        this.currentShape.worldRow -= 1;
      }
      player.UP = false
    }

    if (player.DOWNa && this.currentShape) {
      const collides = this.currentShape.isColliding(shapeMatrix, map, worldRow + 1, worldCol)
      if (!collides) {
        this.currentShape.worldRow += 1;
      }
      player.DOWNa = false
    }

    if (player.ROTATE && this.currentShape) {
      this.currentShape.rotate(map)
      player.ROTATE = false
    }

  }

  shadow() {
    const currentShape = this.currentShape;
    const map = this.canvas.map
    console.log(currentShape.getLowestRow(map))
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
      // this.canvas.placeInWorld(this.currentShape);
      this.currentShape = null;
      return;
    } else if (this.deltaTime == 0) {
      this.currentShape.worldRow++
    }

  }



  // caveman afff
  generateRandomShape(): TetrisShape {
    let shape: TetrisShape;
    const whichShape = Math.trunc(Math.random() * 5)
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


  placeInWorld(tetrisShape: TetrisShape, blockValue: number = 1) {

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
