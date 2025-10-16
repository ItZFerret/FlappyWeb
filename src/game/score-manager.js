import { loadStoredBestScore, storeBestScore } from './utils.js';

export class ScoreManager {
  constructor(onChange) {
    this.score = 0;
    this.best = loadStoredBestScore();
    this.onChange = onChange;
    this.notify();
  }

  reset() {
    this.score = 0;
    this.notify();
  }

  addPoint() {
    this.score += 1;
    if (this.score > this.best) {
      this.best = this.score;
      storeBestScore(this.best);
    }
    this.notify();
  }

  notify() {
    if (typeof this.onChange === 'function') {
      this.onChange({ score: this.score, best: this.best });
    }
  }
}
