import { canvas } from "./canvas";
import { panic } from "./error";

export const WIDTH = 128;
export const HEIGHT = 128;
export const SCALE = 4;

export function setupCanvas() {
  const canvasElement = canvas()
  if (canvasElement.isErrored) {
    return panic(canvasElement.error)
  }

  canvasElement.content.width = WIDTH * 4;
  canvasElement.content.height = HEIGHT * 4;
}