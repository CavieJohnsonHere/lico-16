import { HEIGHT, WIDTH } from "./setupCanvas";
import { type Color, type Coordinates, validateColor } from "./writeSprite";

export type Pixel = Coordinates & Color;

export function validatePixel(pixel: Pixel) {
  return [
    pixel.x > 0,
    pixel.x <= WIDTH,
    pixel.y > 0,
    pixel.y <= HEIGHT
  ].some(Boolean) && validateColor(pixel);
}
