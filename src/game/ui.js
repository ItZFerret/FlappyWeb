import { GAME_OVER_STATE, INTRO_STATE, PAUSED_STATE, PLAYING_STATE } from './constants.js';

export class UIController {
  constructor(root) {
    this.root = root;
    this.scoreValues = Array.from(root.querySelectorAll('[data-score]'));
    this.bestValue = root.querySelector('[data-best]');
    this.stateBadge = root.querySelector('[data-state]');
    this.overlay = root.querySelector('[data-overlay]');
    this.overlayTitle = root.querySelector('[data-overlay-title]');
    this.overlayBody = root.querySelector('[data-overlay-body]');
    this.overlayAction = root.querySelector('[data-overlay-action]');
    this.pauseButton = root.querySelector('[data-pause]');
    this.hud = root.querySelector('[data-hud]');
    this.lastScore = 0;
  }

  bindControls({ onPlay, onPauseToggle }) {
    this.overlayAction?.addEventListener('click', (event) => {
      event.stopPropagation();
      onPlay?.();
    });

    this.pauseButton?.addEventListener('click', (event) => {
      event.preventDefault();
      onPauseToggle?.();
    });
  }

  updateScores({ score, best }) {
    this.lastScore = score;
    this.scoreValues.forEach((element) => {
      element.textContent = score.toString();
    });
    if (this.bestValue) this.bestValue.textContent = best.toString();
  }

  updateState(state) {
    const badge = this.stateBadge;
    if (!badge) return;
    badge.textContent = this.getStateLabel(state);

    if (state === PLAYING_STATE) {
      this.hideOverlay();
    } else if (state === INTRO_STATE) {
      this.showOverlay('Ready?', 'Tap or press space to flap. Avoid the pipes!', 'Let\'s play');
    } else if (state === PAUSED_STATE) {
      this.showOverlay('Paused', 'Take a breather. Tap resume to continue.', 'Resume');
    } else if (state === GAME_OVER_STATE) {
      this.showOverlay(
        'Game over',
        `You scored ${this.lastScore}. Tap play again to try once more.`,
        'Play again',
      );
    }
  }

  presentGameOver(score, best) {
    this.lastScore = score;
    this.showOverlay(
      'Game over',
      `You scored ${score}. Best score: ${best}. Tap play again to try once more.`,
      'Play again',
    );
  }

  showOverlay(title, body, action) {
    if (!this.overlay) return;
    this.overlay.classList.add('is-visible');
    this.overlayTitle.textContent = title;
    this.overlayBody.textContent = body;
    this.overlayAction.textContent = action;
  }

  hideOverlay() {
    if (!this.overlay) return;
    this.overlay.classList.remove('is-visible');
  }

  getStateLabel(state) {
    switch (state) {
      case PLAYING_STATE:
        return 'Playing';
      case PAUSED_STATE:
        return 'Paused';
      case GAME_OVER_STATE:
        return 'Game over';
      default:
        return 'Ready';
    }
  }
}
