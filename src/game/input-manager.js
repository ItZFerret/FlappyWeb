export class InputManager {
  constructor({ onFlap, onTogglePause, onStart }) {
    this.handlers = { onFlap, onTogglePause, onStart };
    this.isPointerDown = false;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (event) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(event.code)) {
        event.preventDefault();
        this.handlers.onFlap?.();
      }
      if (event.code === 'KeyP') {
        event.preventDefault();
        this.handlers.onTogglePause?.();
      }
    });

    const pointerStart = (event) => {
      event.preventDefault();
      this.isPointerDown = true;
      this.handlers.onFlap?.();
    };

    const pointerEnd = (event) => {
      event.preventDefault();
      this.isPointerDown = false;
    };

    const clickStart = (event) => {
      event.preventDefault();
      this.handlers.onStart?.();
    };

    document.addEventListener('mousedown', pointerStart);
    document.addEventListener('touchstart', pointerStart, { passive: false });
    document.addEventListener('mouseup', pointerEnd);
    document.addEventListener('touchend', pointerEnd);

    document.addEventListener('click', clickStart);

    this.cleanup = () => {
      document.removeEventListener('mousedown', pointerStart);
      document.removeEventListener('touchstart', pointerStart);
      document.removeEventListener('mouseup', pointerEnd);
      document.removeEventListener('touchend', pointerEnd);
      document.removeEventListener('click', clickStart);
    };
  }

  destroy() {
    this.cleanup?.();
  }
}
