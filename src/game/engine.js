import {
  BASE_SCROLL_SPEED,
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_HEIGHT,
  INTRO_STATE,
  PLAYING_STATE,
  PAUSED_STATE,
  GAME_OVER_STATE,
  SCROLL_ACCELERATION,
} from './constants.js';
import { Background } from './background.js';
import { Bird } from './bird.js';
import { PipeManager } from './pipe-manager.js';
import { ScoreManager } from './score-manager.js';

const INITIAL_BIRD_X = GAME_WIDTH * 0.28;
const INITIAL_BIRD_Y = GAME_HEIGHT * 0.45;

export class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.callbacks = callbacks;

    this.background = new Background();
    this.bird = new Bird(INITIAL_BIRD_X, INITIAL_BIRD_Y);
    this.pipeManager = new PipeManager();
    this.scoreManager = new ScoreManager(callbacks.onScoreChange);

    this.state = INTRO_STATE;
    this.lastTimestamp = 0;
    this.elapsed = 0;
    this.animationFrame = null;

    this.loop = this.loop.bind(this);
  }

  start() {
    this.lastTimestamp = performance.now();
    this.animationFrame = requestAnimationFrame(this.loop);
    this.emitStateChange();
  }

  loop(timestamp) {
    const delta = Math.min(timestamp - this.lastTimestamp, 32);
    this.lastTimestamp = timestamp;

    if (this.state === PLAYING_STATE) {
      this.update(delta);
    }

    this.render();
    this.animationFrame = requestAnimationFrame(this.loop);
  }

  update(delta) {
    this.elapsed += delta;
    const dynamicSpeed = BASE_SCROLL_SPEED + this.elapsed * SCROLL_ACCELERATION;

    this.background.update(delta, dynamicSpeed);
    this.pipeManager.update(delta, dynamicSpeed);
    this.pipeManager.collectScore(this.bird.x, () => this.scoreManager.addPoint());

    this.bird.update(delta);

    const birdGround = GAME_HEIGHT - GROUND_HEIGHT;
    if (this.bird.y >= birdGround) {
      this.triggerGameOver();
      return;
    }

    if (this.pipeManager.detectCollision(this.bird.getBounds())) {
      this.triggerGameOver();
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.background.draw(ctx);
    this.pipeManager.draw(ctx);
    this.bird.draw(ctx);

    if (this.state === INTRO_STATE) {
      this.drawBanner('Tap to start');
    } else if (this.state === PAUSED_STATE) {
      this.drawBanner('Paused');
    } else if (this.state === GAME_OVER_STATE) {
      this.drawBanner('Game Over');
    }
  }

  drawBanner(message) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(38, 50, 56, 0.6)';
    ctx.fillRect(GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 70, 360, 140);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 4;
    ctx.strokeRect(GAME_WIDTH / 2 - 180, GAME_HEIGHT / 2 - 70, 360, 140);

    ctx.fillStyle = '#fff';
    ctx.font = '28px "Press Start 2P", system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(message, GAME_WIDTH / 2, GAME_HEIGHT / 2);
    ctx.restore();
  }

  emitStateChange() {
    this.callbacks.onStateChange?.(this.state);
  }

  resetGame() {
    this.background.reset();
    this.pipeManager.reset();
    this.bird.reset(INITIAL_BIRD_X, INITIAL_BIRD_Y);
    this.scoreManager.reset();
    this.elapsed = 0;
  }

  startGame() {
    this.resetGame();
    this.state = PLAYING_STATE;
    this.emitStateChange();
  }

  triggerGameOver() {
    if (this.state === GAME_OVER_STATE) return;
    this.state = GAME_OVER_STATE;
    this.emitStateChange();
    this.callbacks.onGameOver?.(this.scoreManager.score, this.scoreManager.best);
  }

  handleFlap() {
    if (this.state === INTRO_STATE) {
      this.startGame();
    }

    if (this.state === PLAYING_STATE) {
      this.bird.flap();
    } else if (this.state === GAME_OVER_STATE) {
      this.startGame();
      this.bird.flap();
    }
  }

  handleStartRequest() {
    if (this.state === INTRO_STATE) {
      this.startGame();
    } else if (this.state === GAME_OVER_STATE) {
      this.startGame();
    }
  }

  handleTogglePause() {
    if (this.state === PLAYING_STATE) {
      this.state = PAUSED_STATE;
    } else if (this.state === PAUSED_STATE) {
      this.state = PLAYING_STATE;
      this.lastTimestamp = performance.now();
    }
    this.emitStateChange();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
  }
}
