import { Game } from './Game'
import { canvas, DOWN_KEY, DOWN_KEY_VIM, LEFT_KEY, LEFT_KEY_VIM, player, RIGHT_KEY, RIGHT_KEY_VIM } from './Globals'
import './index.css'

const game: Game = new Game(canvas);

export var music = new Audio('bob.mp3');
music.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case game.downKey:
    case DOWN_KEY_VIM:
      player.DOWNa = true;
      player.MOVING = true;
      break;
    case game.rightKey:
    case RIGHT_KEY_VIM:
      player.RIGHT = true;
      player.MOVING = true;
      break;
    case game.leftKey:
    case LEFT_KEY_VIM:
      player.MOVING = true;
      player.LEFT = true;

      break;
    case "r":
      player.ROTATE = true;
      player.MOVING = true;
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
      music.pause();
      music.play();
      player.PAUSE = !player.PAUSE;
      break;
    case "Enter":
      player.ENTER = true;
      music.volume = 0.2;
      music.pause();
      music.play();
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
    case game.downKey:
    case DOWN_KEY_VIM:
      player.DOWNa = false;
      break;
    case game.rightKey:
    case RIGHT_KEY_VIM:
      player.RIGHT = false;
      break;
    case game.leftKey:
    case LEFT_KEY_VIM:
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

