import { Canvas } from "./Canvas";

const htmlCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
const htmlContext: CanvasRenderingContext2D = htmlCanvas.getContext("2d");
export const canvas: Canvas = new Canvas(htmlCanvas, htmlContext);
export const GRAVITY: number = 0.3;
export const SQUARE_SIZE: number = 24;
export const player = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  ROTATE: false,
  speed: 1,
}

export const square_test = [
  [
    1, 1
  ],
  [
    1, 1
  ]
]

export const map = [[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
[
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0
],
]
