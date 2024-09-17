import { Canvas } from "./Canvas";

export const SQUARE_SIZE: number = 24;
export const overlay = <HTMLElement>document.querySelector(".chromium-issue-1092080-workaround__overlay");
export const GRAVITY: number = 0.3;
export const TOTAL_COLS: number = 16;
export const TOTAL_ROWS: number = 26;
export const LEFT_KEY = "a"
export const RIGHT_KEY = "d"
export const DOWN_KEY = "s"
export const LEFT_KEY_VIM = "h"
export const RIGHT_KEY_VIM = "l"
export const DOWN_KEY_VIM = "j"


export const SHAPE_ROW_ORIGIN = 0;
export const SHAPE_COL_ORIGIN = TOTAL_COLS / 2;
export const GAME_SPEED = 0;
export const player = {
  LEFT: false,
  ENTER: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  DOWNa: false,
  ROTATE: false,
  PAUSE: false,
  MOVING: false,
  HOLD: false,
  LOAD_HOLD: false,
  LOSER: false,
  START_GAME: false,
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





export const TEXTURES: string[] = [
  "#29062e", // nil 0
  "block_texture_18.png", // bg 1
  "block_texture_1.png", // 2
  "block_texture_2.png", // 3
  "block_texture_3.png",// 4
  "block_texture_4.png",// 5
  "block_texture_5.png",// 6
  "block_texture_6.png",// 7
  "block_texture_7.png",// 8
  "",// 9
  "", // shadow 9
]


export const htmlCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
const htmlContext: CanvasRenderingContext2D = htmlCanvas.getContext("2d");
export const canvas: Canvas = new Canvas(htmlCanvas, htmlContext);
