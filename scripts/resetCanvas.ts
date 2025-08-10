import { canvas } from "./canvas";
import { WIDTH, HEIGHT, SCALE } from "./setupCanvas";

export default function resetCanvas() {
  const canvasElement = canvas();
  if (canvasElement.isErrored) {
    console.error(canvasElement.error);
    return;
  }

  const context = canvasElement.content.getContext("2d");
  if (!context) {
    console.error("Failed to get 2D context");
    return;
  }

  // Clear the canvas
  context.clearRect(0, 0, canvasElement.content.width, canvasElement.content.height);

  // Reset canvas dimensions
  canvasElement.content.width = WIDTH * SCALE;
  canvasElement.content.height = HEIGHT * SCALE;
}