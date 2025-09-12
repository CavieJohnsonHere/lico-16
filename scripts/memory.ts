import { getSizeOfLoadedObject, storage } from "./cartridge";
import { MEMORY_SIZE } from "./constants";
import type { Sound } from "./playSound";
import writeSprite, { type Color, type Coordinates } from "./writeSprite";
import * as luainjs from "lua-in-js";

let memoryUsage = 0;

export function addCodeMemoryUsage(code: string) {
  if ((code.length % 8) % 1 != 0) memoryUsage += code.length * 1 + 8;
  else memoryUsage += code.length * 1 + 4;
}

type LoadedAsset = {
  type: "image";
  content: Color[];
};

// the code doesn't exist in memory, it's existence in memory is implied. It may be added later as extentions you could load to get around the bit limit but for now you have to use you imagination
// they do exist in storage, however.
type LoadedCode = {
  type: "code";
  content: string;
};

export type LoadedSound = {
  type: "sound";
  content: Sound[];
};

export type LoadedObject = LoadedAsset | LoadedSound | LoadedCode;
export type LoadedType = "image" | "code" | "sound";

export function writeLoadedSprite(
  loadedObject: LoadedObject,
  pos: { strValues: Coordinates }
) {
  if (loadedObject.type != "image") throw new Error(`Invalid type`);

  writeSprite(loadedObject.content, pos.strValues);
}

const refrences: Record<number, LoadedObject | undefined> = {};

type LoadedObjectRefrence = {
  get(): LoadedObject | undefined;
  unload(): void;
};

function logMemory() {
  const percentage = ((memoryUsage / MEMORY_SIZE) * 100).toFixed(2);

  console.log(`Memory usage: ${percentage}% ${Array(Math.max(10 - percentage.length, 0)).join(" ")} ${Math.ceil(memoryUsage/8)}B`);
  
  const memoryBar = document.querySelector<HTMLDivElement>("#memory > div");
  if (memoryBar) memoryBar.style.width = `${Math.min((memoryUsage / MEMORY_SIZE) * 100, 100)}%`;
}

function getLoadedObjectRefrence(
  loadedObject: LoadedObject,
  index: number,
  size: number
): luainjs.Table {
  refrences[index] = loadedObject;
  const thing = {} as LoadedObjectRefrence;

  thing.get = () => refrences[index];

  thing.unload = () => {
    refrences[index] = undefined;

    memoryUsage -= size;
    if (memoryUsage < 0) memoryUsage = 0;
    logMemory();
  };

  return new luainjs.Table(thing);
}

export function load(index: number): luainjs.Table {
  const loadedObject = storage[index];
  if (!loadedObject)
    throw new Error(`Loaded object out of range, loaded: ${index}`);

  const loadedObjectMemoryUsage = getSizeOfLoadedObject([loadedObject]);
  if (loadedObjectMemoryUsage.isErrored)
    throw new Error(loadedObjectMemoryUsage.error);

  memoryUsage += loadedObjectMemoryUsage.content;
  if (memoryUsage > MEMORY_SIZE) throw new Error("Out of fictional memory");

  logMemory();

  if ((loadedObject.type as LoadedType) == loadedObject.type) {
    return getLoadedObjectRefrence(
      loadedObject as LoadedObject,
      index,
      loadedObjectMemoryUsage.content
    );
  }

  // Don't use error types with game context
  throw new Error(`Invalid type: ${loadedObject.type}`);
}
