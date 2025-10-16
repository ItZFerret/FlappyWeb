import './style.css';
import { GameEngine } from './game/engine.js';
import { InputManager } from './game/input-manager.js';
import { UIController } from './game/ui.js';
import { PLAYING_STATE } from './game/constants.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="app-shell">
    <header class="top-bar">
      <h1>FlappyWeb</h1>
      <div class="scoreboard">
        <span>Score</span>
        <span class="score-value" data-score>0</span>
        <span>Best</span>
        <span class="score-value" data-best>0</span>
      </div>
      <div class="top-actions">
        <span class="badge" data-state>Ready</span>
        <button type="button" data-pause>Pause</button>
      </div>
    </header>

    <section class="game-stage" aria-label="Flappy bird playfield">
      <canvas id="game-canvas" width="480" height="720" role="img" aria-label="Game canvas"></canvas>
      <div class="hud" data-hud>
        <div class="hud-top">
          <div class="hud-score" data-score>0</div>
          <div class="instructions">Space / tap to flap</div>
        </div>
      </div>
      <div class="overlay" data-overlay>
        <div class="overlay-card" role="dialog" aria-modal="true">
          <h2 data-overlay-title>Ready?</h2>
          <p data-overlay-body>Tap or press space to flap. Avoid the pipes!</p>
          <button type="button" data-overlay-action>Let's play</button>
        </div>
      </div>
    </section>
  </main>
`;

const canvas = document.querySelector('#game-canvas');
const ui = new UIController(app);

const game = new GameEngine(canvas, {
  onScoreChange: (scores) => {
    ui.updateScores(scores);
  },
  onStateChange: (state) => {
    ui.updateState(state);
  },
  onGameOver: (score, best) => {
    ui.presentGameOver(score, best);
  },
});

ui.bindControls({
  onPlay: () => game.handleStartRequest(),
  onPauseToggle: () => game.handleTogglePause(),
});

const input = new InputManager({
  onFlap: () => game.handleFlap(),
  onTogglePause: () => game.handleTogglePause(),
  onStart: () => game.handleStartRequest(),
});

game.start();

document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state === PLAYING_STATE) {
    game.handleTogglePause();
  }
});

window.addEventListener('beforeunload', () => {
  input.destroy();
  game.destroy();
});
