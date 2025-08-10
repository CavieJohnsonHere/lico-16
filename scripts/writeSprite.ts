import { done, panic } from "./error";
import writePixel from "./writePixel";

export const SPRITE_SIZE = 8;

export type Color = {
  // All must be between 0 and 255
  r: number;
  b: number;
  g: number;
  a: boolean;
};

export type Coordinates = {
  x: number;
  y: number;
};

function validateSprite(sprite: Color[]) {
  return (
    sprite.every(
      (color) =>
        color.r >= 0 &&
        color.r <= 255 &&
        color.g >= 0 &&
        color.g <= 255 &&
        color.b >= 0 &&
        color.b <= 255
    ) && sprite.length == SPRITE_SIZE * SPRITE_SIZE
  );
}

export default function writeSprite(sprite: Color[], coords: Coordinates) {
  if (!validateSprite(sprite)) return panic("Invalid sprite");

  const rows: Color[][] = [];
  for (let i = 0; i < SPRITE_SIZE; i++) {
    rows.push(sprite.slice(i * SPRITE_SIZE, (i + 1) * SPRITE_SIZE));
  }

  for (let y = 0; y < SPRITE_SIZE; y++) {
    for (let x = 0; x < SPRITE_SIZE; x++) {
      writePixel({ ...rows[y][x], ...{ x: Math.floor(coords.x) + x, y: Math.floor(coords.y) + y } });
    }
  }

  return done();
}

export function validateColor(color: Color) {
  return [
    color.r > 0,
    color.r <= 255,
    color.g > 0,
    color.g <= 255,
    color.b > 0,
    color.b <= 255,
  ].some(Boolean);
}
