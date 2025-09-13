import { COLOR_PALETTES } from "./constants";
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

function hexToRGBA(hex: string): {
  r: number;
  g: number;
  b: number;
  a: boolean;
} {
  if (!/^#([0-9A-Fa-f]{6}|00000000)$/.test(hex)) {
    throw new Error("Invalid hex color format");
  }

  if (hex === "#00000000") {
    return { r: 0, g: 0, b: 0, a: true };
  }

  // Extract RGB components for #RRGGBB format
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b, a: false };
}

export default function writeSprite(
  palette: number,
  spriteI: number[],
  coords: Coordinates
) {
  const sprite: Color[] = spriteI.map((v) => {
    if (
      COLOR_PALETTES[palette] == undefined ||
      COLOR_PALETTES[palette][v] == undefined
    )
      return { r: 0, b: 0, g: 0, a: true };
    return hexToRGBA(COLOR_PALETTES[palette][v]);
  });
  
  if (!validateSprite(sprite)) return panic("Invalid sprite");

  const rows: Color[][] = [];
  for (let i = 0; i < SPRITE_SIZE; i++) {
    rows.push(sprite.slice(i * SPRITE_SIZE, (i + 1) * SPRITE_SIZE));
  }

  for (let y = 0; y < SPRITE_SIZE; y++) {
    for (let x = 0; x < SPRITE_SIZE; x++) {
      writePixel({
        ...rows[y][x],
        ...{ x: Math.floor(coords.x) + x, y: Math.floor(coords.y) + y },
      });
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
