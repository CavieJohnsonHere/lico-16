import { type Pixel } from "./pixel";
import ctx from "./canvas";
import { SCALE } from "./setupCanvas";

export default function writePixel(pixel: Pixel) {
  // Get the 2D context from the canvas

  if (pixel.a) return;

  const result = ctx();
  if (result.isErrored) return result;
  const context = result.content as CanvasRenderingContext2D;

  // Set the fill style to the pixel's color
  context.fillStyle = `rgb(${pixel.r},${pixel.g},${pixel.b})`;
  // Draw a 1x1 rectangle at the pixel's coordinates
  context.fillRect(pixel.x * SCALE, pixel.y * SCALE, SCALE, SCALE);
}