export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function loadStoredBestScore() {
  try {
    const raw = localStorage.getItem('flappyweb:bestScore');
    return raw ? Number.parseInt(raw, 10) : 0;
  } catch (error) {
    console.warn('Unable to load best score', error);
    return 0;
  }
}

export function storeBestScore(score) {
  try {
    localStorage.setItem('flappyweb:bestScore', String(score));
  } catch (error) {
    console.warn('Unable to store best score', error);
  }
}
