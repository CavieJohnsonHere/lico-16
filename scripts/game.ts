import resetCanvas from "./resetCanvas";

type Game = {
  start: () => void;
  update: () => void;
};

export const game: Game = {
  start: () => null,
  update: () => null,
};

export function setStart(start: () => void) {
  game.start = start;
}

export function setUpdate(update: () => void) {
  game.update = update;
}

export function startGame() {
  game.start();

  const frameTime = 1000 / 60; // 60fps = ~16.67ms per frame
  let lastTime = performance.now();

  const a = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;

    if (deltaTime >= frameTime) {
      game.update();
      lastTime = currentTime;
    }

    requestAnimationFrame(a);
  };

  requestAnimationFrame(a);
}
