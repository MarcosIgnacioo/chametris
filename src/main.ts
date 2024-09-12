import { Game } from './Game'
import { canvas, player } from './Globals'
import './index.css'

const game: Game = new Game(canvas);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      player.RIGHT = true;
      break;
    case "a":
      player.LEFT = true;
      break;
    case "w":
      player.UP = true;
      break;
    case "s":
      player.DOWN = true;
      break;
    case "r":
      player.ROTATE = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      player.RIGHT = false;
      break;
    case "a":
      player.LEFT = false;
      break;
    case "w":
      player.UP = false;
      break;
    case "s":
      player.DOWN = false;
      break;
    case "r":
      player.ROTATE = false;
      break;
  }
});

requestAnimationFrame(game.paint)
