import { SQUARE_SIZE } from "./Globals";

export function worldToScreen(num: number) {
  return Math.round(num * SQUARE_SIZE);
}

export function screenToWorld(num: number) {
  return Math.round(num / SQUARE_SIZE);
}

export function worldToTile(num: number) {
  return Math.abs(Math.ceil(num / SQUARE_SIZE))
}

export function c_is_better2(bol: boolean) {
  return (bol) ? 1 : 0
}

export function c_is_better(num: number) {
  return (num % 2 == 0) ? 1 : 2;
}
export function rgb() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export function deltaTime(dt: number): number {
  return (dt < 15) ? dt + 1 : 0
}
