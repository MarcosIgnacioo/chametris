import { Canvas } from "./Canvas";

const htmlCanvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
const htmlContext: CanvasRenderingContext2D = htmlCanvas.getContext("2d");
export const canvas: Canvas = new Canvas(htmlCanvas, htmlContext);
export const GRAVITY: number = 0.3;
export const SQUARE_SIZE: number = 16;
