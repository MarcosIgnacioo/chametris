import { Canvas } from "./Canvas";

export const SQUARE_SIZE: number = 24;
export const GRAVITY: number = 0.3;
export const TOTAL_COLS: number = 16;
export const TOTAL_ROWS: number = 24;
export const SHAPE_ROW_ORIGIN = 0;
export const SHAPE_COL_ORIGIN = TOTAL_COLS / 2;
export const player = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  DOWNa: false,
  ROTATE: false,
  PAUSE: false,
  MOVING: false,
  HOLD: false,
  LOAD_HOLD: false,
  MS_SINCE_LAST_PRESSED: -Infinity,
  MS_SINCE_REALESED: -Infinity,
  LAST_PRESSED_TIME: -Infinity,
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
  "#7c63e3", // L reversed 7
  "#685e75", // stupid shape reversed 8
  "rgba(247, 31, 168, 0.50)", // shadow 9
  "rgba(247, 31, 168, 0.20)" // shadow colliding 10
]

const htmlCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
const htmlContext: CanvasRenderingContext2D = htmlCanvas.getContext("2d");
export const canvas: Canvas = new Canvas(htmlCanvas, htmlContext);
