import bootstrapGame from "./bootstrapGame";
import { setCanvas } from "./canvas";
import { setupCanvas } from "./setupCanvas";

async function main() {
  const canvasElement = document.getElementById("canvas");

  if (!canvasElement) {
    console.error("Canvas was not found.");
    window.alert("Something went wrong...");
    return;
  }

  setCanvas(canvasElement as HTMLCanvasElement);
  setupCanvas();

  document
    .querySelector("#overlay")
    ?.addEventListener("click", () =>
      bootstrapGame({ ensureSelectedFile: true, canvasElement })
    );
}

document.addEventListener("DOMContentLoaded", main);
