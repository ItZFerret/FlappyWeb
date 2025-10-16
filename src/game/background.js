import { GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT } from './constants.js';

export class Background {
  constructor() {
    this.skyGradient = null;
    this.clouds = this.createClouds();
    this.foregroundOffset = 0;
  }

  createClouds() {
    return Array.from({ length: 6 }).map(() => ({
      x: Math.random() * GAME_WIDTH,
      y: Math.random() * (GAME_HEIGHT * 0.4),
      size: 80 + Math.random() * 80,
      speed: 0.02 + Math.random() * 0.03,
    }));
  }

  reset() {
    this.clouds = this.createClouds();
    this.foregroundOffset = 0;
  }

  update(delta, speed) {
    this.clouds.forEach((cloud) => {
      cloud.x -= cloud.speed * delta;
      if (cloud.x + cloud.size < 0) {
        cloud.x = GAME_WIDTH + cloud.size;
        cloud.y = Math.random() * (GAME_HEIGHT * 0.4);
      }
    });

    this.foregroundOffset = (this.foregroundOffset + speed * delta * 0.7) % GAME_WIDTH;
  }

  draw(ctx) {
    if (!this.skyGradient) {
      this.skyGradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      this.skyGradient.addColorStop(0, '#4fc3f7');
      this.skyGradient.addColorStop(1, '#b2ebf2');
    }

    ctx.fillStyle = this.skyGradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.clouds.forEach((cloud) => {
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#26a69a';
    ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);

    ctx.fillStyle = '#2bbbad';
    ctx.save();
    ctx.translate(-this.foregroundOffset, GAME_HEIGHT - GROUND_HEIGHT + 10);
    for (let i = -1; i < Math.ceil(GAME_WIDTH / 40) + 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 40, 40);
      ctx.lineTo(i * 40 + 20, 0);
      ctx.lineTo(i * 40 + 40, 40);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}
