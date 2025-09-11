import { parse } from "jsonc-parser";
import { loadCartridge } from "./cartridge";
import { startGame, setStart, setUpdate } from "./game";
import handleClick from "./handleClick";
import { handleKeyDown, handleKeyUp, keysPressed } from "./handleInput";
import { load, writeLoadedSprite } from "./memory";
import { playLoadedSound, stopSound } from "./playSound";
import resetCanvas from "./resetCanvas";
import writeSprite, { type Color } from "./writeSprite";
import * as luainjs from "lua-in-js";

export default async function bootstrapGame({
  ensureSelectedFile,
  canvasElement,
  luaScriptRes,
}: {
  ensureSelectedFile: boolean;
  canvasElement: HTMLElement;
  luaScriptRes: string;
}) {
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

  if (!file && ensureSelectedFile) {
    console.error("No file selected.");
    document.body.innerHTML += `<div id="no-cartridge-warning"><h1>No cartridge loaded</h1><button id="nogame">Continue without loading a cartridge</button></div>`;
    document.querySelector("button#nogame")?.addEventListener("click", () => {
      document.body.querySelector("div#no-cartridge-warning")?.remove();
      bootstrapGame({ ensureSelectedFile: false, canvasElement, luaScriptRes });
    });
    return;
  }

  const error = loadCartridge(parse((await file?.text()) || "") || []);

  if (error.isErrored) {
    console.error("Error loading cartridge:", error.error);
    document.body.innerHTML = `<h1>Error loading cartridge: ${error.error}</h1>`;
    return;
  }

  console.log("Cartridge loaded successfully");

  const env = luainjs.createEnv();
  try {
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
  } catch (e) {
    console.error("Error executing Lua script:", e);
    document.body.innerHTML = `<h1><span>Error executing Lua script:</span> ${e}</h1>`;
  }
}
