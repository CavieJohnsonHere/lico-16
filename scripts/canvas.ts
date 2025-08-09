import { fine, panic } from "./error";

let canvasElement: HTMLCanvasElement | null = null;

export function setCanvas(canvas: HTMLCanvasElement) {
  canvasElement = canvas;
}

export default function ctx() {
  if (!canvasElement) return panic("canvas is null");
  const ctx = canvasElement.getContext("2d");
  if (!ctx)
    return panic("canvas does not have a context");
  return fine(ctx);
}

export function canvas() {
  if (!canvasElement) return panic("canvas is null");
  return fine(canvasElement);
}
