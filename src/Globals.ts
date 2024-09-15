import { Canvas } from "./Canvas";

export const SQUARE_SIZE: number = 24;
export const GRAVITY: number = 0.3;
export const player = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  DOWNa: false,
  ROTATE: false,
  PAUSE: false,
  speed: 1,
  points: 0,
}

export const COLORS: string[] = [
  "#29062e", // nil 0
  "#302f2d", // bg 1
  "#1586e5", // stupid shape 2
  "#5528e3", // gods shape 3
  "#f736dd", // penis shape 4
  "#fcb716", // square shape 5
  "#97fd6a", // L shape 6
  "rgba(247, 31, 168, 0.50)", // shadow 7
]

const htmlCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
const htmlContext: CanvasRenderingContext2D = htmlCanvas.getContext("2d");
export const canvas: Canvas = new Canvas(htmlCanvas, htmlContext);
