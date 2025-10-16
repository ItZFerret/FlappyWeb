import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PIPE_DISTANCE,
  PIPE_GAP,
  PIPE_WIDTH,
  GROUND_HEIGHT,
} from './constants.js';
import { rectsOverlap } from './utils.js';

class PipePair {
  constructor(x, gapY) {
    this.x = x;
    this.gapY = gapY;
    this.scored = false;
  }

  update(delta, speed) {
    this.x -= speed * delta;
  }

  isOffScreen() {
    return this.x + PIPE_WIDTH < -20;
  }

  getTopRect() {
    return {
      x: this.x,
      y: 0,
      width: PIPE_WIDTH,
      height: this.gapY - PIPE_GAP / 2,
    };
  }

  getBottomRect() {
    return {
      x: this.x,
      y: this.gapY + PIPE_GAP / 2,
      width: PIPE_WIDTH,
      height: GAME_HEIGHT - GROUND_HEIGHT - (this.gapY + PIPE_GAP / 2),
    };
  }

  draw(ctx) {
    const topRect = this.getTopRect();
    const bottomRect = this.getBottomRect();

    ctx.fillStyle = '#7cb342';
    ctx.fillRect(topRect.x, topRect.y, topRect.width, topRect.height);
    ctx.fillRect(bottomRect.x, bottomRect.y, bottomRect.width, bottomRect.height);

    ctx.fillStyle = '#558b2f';
    ctx.fillRect(topRect.x - 6, topRect.height - 20, topRect.width + 12, 20);
    ctx.fillRect(bottomRect.x - 6, bottomRect.y, bottomRect.width + 12, 20);
  }
}

export class PipeManager {
  constructor() {
    this.pipes = [];
    this.spawnTimer = 0;
  }

  reset() {
    this.pipes = [];
    this.spawnTimer = 0;
  }

  update(delta, speed) {
    this.spawnTimer += delta;
    const distanceMs = PIPE_DISTANCE / speed;
    if (this.spawnTimer > distanceMs) {
      this.spawnTimer = 0;
      const padding = 120;
      const gapY = padding + Math.random() * (GAME_HEIGHT - GROUND_HEIGHT - padding * 2);
      const spawnX = GAME_WIDTH + PIPE_WIDTH;
      this.pipes.push(new PipePair(spawnX, gapY));
    }

    this.pipes.forEach((pipe) => pipe.update(delta, speed));
    this.pipes = this.pipes.filter((pipe) => !pipe.isOffScreen());
  }

  detectCollision(birdBounds) {
    return this.pipes.some((pipe) => {
      return (
        rectsOverlap(birdBounds, pipe.getTopRect()) ||
        rectsOverlap(birdBounds, pipe.getBottomRect())
      );
    });
  }

  collectScore(birdX, onScore) {
    this.pipes.forEach((pipe) => {
      if (!pipe.scored && birdX > pipe.x + PIPE_WIDTH) {
        pipe.scored = true;
        onScore();
      }
    });
  }

  draw(ctx) {
    this.pipes.forEach((pipe) => pipe.draw(ctx));
  }
}
