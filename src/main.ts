import { Game } from './Game'
import { canvas } from './Globals'
import './index.css'

const game: Game = new Game(canvas);
requestAnimationFrame(game.paint)
