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
  DOWNa: false,
  ROTATE: false,
  speed: 1,
}

export const COLORS: string[] = [
  "#29062e", // nil
  "#302f2d", // bg
  "#1586e5", // stupid shape 0
  "#5528e3", // gods shape 1
  "#f736dd", // penis shape 2
  "#fcb716", // square shape 3
  "#97fd6a", // L shape 4
]

export const square_test = [
  [
    1, 1
  ],
  [
    1, 1
  ]
]
