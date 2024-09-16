import { Game } from './Game'
import { canvas, player } from './Globals'
import './index.css'

const game: Game = new Game(canvas);

document.addEventListener("keydown", (e) => {
  var currentdate = new Date();
  if (player.LAST_PRESSED_TIME == -Infinity) {
    player.LAST_PRESSED_TIME = currentdate.getTime()
  }
  switch (e.key) {
    case "w":
    case "k":
      player.UP = true;
      break;
    case "j":
      player.DOWNa = true;
      player.MOVING = true;
      break;
    case "l":
    case "d":
      player.RIGHT = true;
      player.MOVING = true;
      player.MS_SINCE_LAST_PRESSED = currentdate.getTime() - player.LAST_PRESSED_TIME
      player.LAST_PRESSED_TIME = currentdate.getTime()
      break;
    case "a":
    case "h":
      player.MOVING = true;
      player.LEFT = true;

      player.MS_SINCE_LAST_PRESSED = currentdate.getTime() - player.LAST_PRESSED_TIME
      player.LAST_PRESSED_TIME = currentdate.getTime()
      break;
    case "r":
      player.ROTATE = true;
      player.MOVING = true;
      player.MS_SINCE_LAST_PRESSED = currentdate.getTime() - player.LAST_PRESSED_TIME
      player.LAST_PRESSED_TIME = currentdate.getTime()
      break;
    case " ":
      player.DOWN = true;
      break;
    case "q":
      player.HOLD = true;
      break;
    case "e":
      player.LOAD_HOLD = true;
      break;
    case "Escape":
      player.PAUSE = !player.PAUSE;
      break;
  }
  // console.log(player.MS_SINCE_LAST_PRESSED)
});

document.addEventListener("keyup", (e) => {
  var currentdate = new Date();
  player.MS_SINCE_REALESED = currentdate.getTime()
  switch (e.key) {
    case "q":
      player.HOLD = false;
      break;
    case "e":
      player.LOAD_HOLD = false;
      break;
    case "w":
    case "k":
      player.UP = false;
      break;
    case "j":
      player.DOWNa = false;
      break;
    case "l":
    case "d":
      player.RIGHT = false;
      break;
    case "a":
    case "h":
      player.LEFT = false;
      break;
    case "r":
      player.ROTATE = false;
      break;
    case " ":
      player.DOWN = false;
      break;
  }
});

requestAnimationFrame(game.paint)
