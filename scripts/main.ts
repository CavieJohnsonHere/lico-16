import { setCanvas } from "./canvas";
import { setStart, setUpdate, startGame } from "./game";
import handleClick from "./handleClick";
import { handleKeyDown, handleKeyUp, keysPressed } from "./handleInput";
import { load, writeLoadedSprite } from "./memory";
import * as luainjs from "lua-in-js";
import { setupCanvas } from "./setupCanvas";
import writeSprite, { type Color } from "./writeSprite";
import resetCanvas from "./resetCanvas";
import { playLoadedSound, stopSound } from "./playSound";
import { loadCartridge } from "./cartridge";
import {parse} from "jsonc-parser"

async function main() {
  const canvasElement = document.getElementById("canvas");

  const luaScriptFetch = await fetch("/lua");
  const luaScriptRes = await luaScriptFetch.text();

  if (!canvasElement) {
    console.error("Canvas was not found.");
    window.alert("Something went wrong...");
    return;
  }

  setCanvas(canvasElement as HTMLCanvasElement);
  setupCanvas();

  document.querySelector("#overlay")?.addEventListener("click", async () => {
    // Remove the overlay after the first click
    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.remove();
    }

    document.removeEventListener(
      "click",
      handleClick as EventListenerOrEventListenerObject
    );
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);

    const sprite: Color[] = [];

    writeSprite(sprite, { x: 50, y: 50 });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener(
      "click",
      handleClick as EventListenerOrEventListenerObject
    );

    const file = document.querySelector("input")?.files?.item(0);

    const error = loadCartridge(parse(await file?.text() || "") || []);

    if (error.isErrored) {
      console.error("Error loading cartridge:", error.error);
      document.body.innerHTML = `<h1>Error loading cartridge: ${error.error}</h1>`;
    }

    const env = luainjs.createEnv();
    const lib = new luainjs.Table({
      setStart,
      setUpdate,
      load,
      writeLoadedSprite,
      startGame,
      resetCanvas,
      playLoadedSound,
      stopSound,
      input: () =>
        new luainjs.Table({
          x: keysPressed.get("ArrowRight")
            ? 1
            : keysPressed.get("ArrowLeft")
            ? -1
            : 0,
          y: keysPressed.get("ArrowDown")
            ? 1
            : keysPressed.get("ArrowUp")
            ? -1
            : 0,
          keyX: keysPressed.get("x") || false,
          keyC: keysPressed.get("c") || false,
        }),
    });
    env.loadLib("lico", lib);

    env.parse(luaScriptRes).exec();
  });
}

document.addEventListener("DOMContentLoaded", main);
