import { setCanvas } from "./canvas";
import handleClick from "./handleClick";
import handleInput from "./handleInput";
import { setupCanvas } from "./setupCanvas";
import writePixel from "./writePixel";
import writeSprite, { Color, SPRITE_SIZE } from "./writeSprite";

function main() {
  const canvasElement = document.getElementById("canvas");

  if (!canvasElement) {
    console.error("Canvas was not found.");
    window.alert("Something went wrong...");
    return;
  }

  setCanvas(canvasElement as HTMLCanvasElement);
  setupCanvas();

  document.addEventListener("click", () => {
    document.removeEventListener("click", handleClick);
    document.removeEventListener("keydown", handleInput);

    const sprite: Color[] = [];
    
    writeSprite(sprite, { x: 50, y: 50 });
    document.addEventListener("keydown", handleInput);
    document.addEventListener("click", handleClick);
  });
}

document.addEventListener("DOMContentLoaded", main);
