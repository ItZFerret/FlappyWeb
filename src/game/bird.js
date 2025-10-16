import { BIRD_RADIUS, FLAP_IMPULSE, GAME_HEIGHT, GRAVITY, MAX_DROP_SPEED } from './constants.js';
import { clamp } from './utils.js';

export class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.flapAnimation = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = 0;
    this.rotation = 0;
    this.flapAnimation = 0;
  }

  flap() {
    this.velocity = FLAP_IMPULSE;
  }

  update(delta) {
    this.velocity = clamp(this.velocity + GRAVITY * delta, -1.2, MAX_DROP_SPEED);
    this.y += this.velocity * delta;
    this.y = clamp(this.y, BIRD_RADIUS, GAME_HEIGHT - BIRD_RADIUS);
    this.rotation = clamp((this.velocity / MAX_DROP_SPEED) * 0.6, -0.5, 0.8);
    this.flapAnimation = (this.flapAnimation + delta * 0.02) % (Math.PI * 2);
  }

  getBounds() {
    return {
      x: this.x - BIRD_RADIUS,
      y: this.y - BIRD_RADIUS,
      width: BIRD_RADIUS * 2,
      height: BIRD_RADIUS * 2,
    };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_RADIUS + 4, BIRD_RADIUS, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.ellipse(6, -6, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(4, -4, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.arc(6, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffab00';
    ctx.beginPath();
    ctx.moveTo(-BIRD_RADIUS - 2, 0);
    ctx.lineTo(-BIRD_RADIUS - 16, -6);
    ctx.lineTo(-BIRD_RADIUS - 16, 6);
    ctx.closePath();
    ctx.fill();

    const wingOffset = Math.sin(this.flapAnimation) * 8;
    ctx.fillStyle = '#ffa726';
    ctx.beginPath();
    ctx.ellipse(-2, wingOffset, 18, 10, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
