import { canvas } from "./canvas";
import { SCALE } from "./setupCanvas";

export default function handleClick(event: PointerEvent): void {
  const canvasElement = canvas();
  if (canvasElement.isErrored) {
    return;
  }

  const rect = canvasElement.content.getBoundingClientRect();

  const mouseX = Math.floor((event.clientX - rect.left) / SCALE);
  const mousey = Math.floor((event.clientY - rect.top) / SCALE);
}
