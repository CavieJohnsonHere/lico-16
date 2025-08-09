import { setCanvas } from "./canvas";
import { code, setStart, setUpdate, startGame } from "./game";
import handleClick from "./handleClick";
import handleInput from "./handleInput";
import { load, writeLoadedSprite } from "./memory";
import * as luainjs from "lua-in-js";
import { setupCanvas } from "./setupCanvas";
import writeSprite, { type Color } from "./writeSprite";

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
    document.removeEventListener(
      "click",
      handleClick as EventListenerOrEventListenerObject
    );
    document.removeEventListener("keydown", handleInput);

    const sprite: Color[] = [];

    writeSprite(sprite, { x: 50, y: 50 });
    document.addEventListener("keydown", handleInput);
    document.addEventListener(
      "click",
      handleClick as EventListenerOrEventListenerObject
    );

    const env = luainjs.createEnv();
    const lib = new luainjs.Table({
      setStart,
      setUpdate,
      load,
      writeLoadedSprite,
      startGame
    });
    env.loadLib("lico", lib);

    console.log(env.parse(`
      function start()
        print('hello')
        lico.writeLoadedSprite(lico.load(0), {x = 5, y = 5})
      end

      lico.setStart(start)
      lico.startGame()
      `).exec());
  });
}

document.addEventListener("DOMContentLoaded", main);
