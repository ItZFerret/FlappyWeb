# FlappyWeb

FlappyWeb is a polished Flappy Bird-inspired game built with Vite, HTML canvas, and vanilla JavaScript.

## Getting started

```bash
npm install
npm run dev
```

The dev server opens automatically. Use the space bar, W/up arrow, or tap/click to flap. Press **P** or the pause button to pause/resume.

## Scripts

- `npm run dev` – start the Vite dev server.
- `npm run build` – create a production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint over the source files.

## Features

- Responsive canvas rendering with parallax background and animated bird sprite.
- Procedural pipe generation with increasing difficulty over time.
- Score tracking with persistent best score saved to `localStorage`.
- Keyboard, mouse, and touch input support with pause/resume controls.
- Overlay UI for intro, pause, and game-over states.

## Project structure

```
src/
├── game/
│   ├── background.js
│   ├── bird.js
│   ├── constants.js
│   ├── engine.js
│   ├── input-manager.js
│   ├── pipe-manager.js
│   ├── score-manager.js
│   └── ui.js
├── main.js
└── style.css
```
