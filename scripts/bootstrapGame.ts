import { parse } from "jsonc-parser";
import { addCodeStorageUsage, loadCartridge, logStorage } from "./cartridge";
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
}: {
  ensureSelectedFile: boolean;
  canvasElement: HTMLElement;
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

  const rawFiles = document.querySelector("input")?.files;

  if (!rawFiles) {
    document.body.innerHTML = `<h1>Something went wrong</h1>`;
    return;
  }

  const files = Array.from(rawFiles);

  const jsonFiles = files.filter(
    (file) => file.name.endsWith(".json") || file.name.endsWith(".jsonc")
  );
  const luaFiles = files.filter((file) => file.name.endsWith(".lua"));

  if (!jsonFiles[0] && ensureSelectedFile) {
    document.body.innerHTML += `<div id="no-cartridge-warning"><h1>No cartridge loaded</h1><div id="nogame-container"><button id="nogame">Continue without loading a cartridge</button><button id="loadcart">Load cartridge</button></div></div>`;

    document.querySelector("button#nogame")?.addEventListener("click", () => {
      document.body.querySelector("div#no-cartridge-warning")?.remove();
      bootstrapGame({ ensureSelectedFile: false, canvasElement });
    });

    document.querySelector("button#loadcart")?.addEventListener("click", () => {
      document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
      window.alert("Please select a cartridge file to load.");
      document.body.querySelector("div#no-cartridge-warning")?.remove();
      bootstrapGame({ ensureSelectedFile: false, canvasElement });
    });

    return;
  }

  let code = "";

  const codeFromFile = (await luaFiles[0]?.text()) || "";

  const codeError = loadCartridge(
    parse((await jsonFiles[0]?.text()) || "") || []
  );

  if (
    codeError.isErrored &&
    !(codeError.error == "No code in cartridge" && codeFromFile)
  ) {
    console.error("Error loading cartridge:", codeError.error);
    document.body.innerHTML = `<h1><span>Error loading cartridge:</span> ${codeError.error}</h1>`;
    return;
  } else if (codeFromFile) {
    code = codeFromFile;
    addCodeStorageUsage(code);
  } else if (codeError.isErrored) {
    document.body.innerHTML = `<h1><span>Error loading cartridge:</span> ${codeError.error}</h1>`;
    return;
  } else {
    code = codeError.content;
  }

  console.log("Cartridge loaded successfully");

  logStorage();

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

    env.parse(code).exec();
  } catch (e) {
    console.error("Error executing Lua script:", e);
    document.body.innerHTML = `<div><h1><span>Error executing Lua script:</span> ${e}</h1></div><button>Reload</button>`;
    document.querySelector("button")?.addEventListener("click", () => {
      window.location.reload();
    });
  }
}
