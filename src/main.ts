import { Game } from './Game'
import { canvas, player } from './Globals'
import './index.css'

const game: Game = new Game(canvas);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "l":
      player.RIGHT = true;
      break;
    case "h":
      player.LEFT = true;
      break;
    case "k":
      player.UP = true;
      break;
    case "j":
      player.DOWNa = true;
      break;
    case "d":
      player.RIGHT = true;
      break;
    case "a":
      player.LEFT = true;
      break;
    case "w":
      player.UP = true;
      break;
    case " ":
      player.DOWN = true;
      break;
    case "r":
      player.ROTATE = true;
      break;
    case "Escape":
      player.PAUSE = !player.PAUSE;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "l":
      player.RIGHT = false;
      break;
    case "h":
      player.LEFT = false;
      break;
    case "k":
      player.UP = false;
      break;
    case "j":
      player.DOWNa = false;
      break;
    case "d":
      player.RIGHT = false;
      break;
    case "a":
      player.LEFT = false;
      break;
    case "w":
      player.UP = false;
      break;
    case " ":
      player.DOWN = false;
      break;
    case "r":
      player.ROTATE = false;
      break;
  }
});

requestAnimationFrame(game.paint)
