type Game = {
  start: () => void;
  update: () => void;
};

const game: Game = {
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
  const a = () => {
    game.update();
    requestAnimationFrame(a);
  };
  a();
}

export const code = "setStart(() => console.log('Hello'));";
