import ctx from "./canvas";
import { HEIGHT, SCALE, WIDTH } from "./setupCanvas";

export default function fillCanvas(r: number, g: number, b: number) {
  const context = ctx();

  if (context.isErrored) {
    throw new Error(context.error);
  }

  context.content.fillStyle = `rgb(${r}, ${g}, ${b})`;

  context.content.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);
}
