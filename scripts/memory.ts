import { getSizeOfLoadedObject, memory } from "./cartridge";
import { MEMORY_SIZE } from "./constants";
import type { Sound } from "./playSound";
import writeSprite, { type Color, type Coordinates } from "./writeSprite";

let ramUsage = 0;

type LoadedAsset = {
  type: "image";
  content: Color[];
};

type LoadedCode = {
  type: "code";
  content: string;
};

export type LoadedSound = {
  type: "sound";
  content: Sound[];
};

export type LoadedObject = LoadedAsset | LoadedCode | LoadedSound;
export type LoadedType = "image" | "code" | "sound";

export function writeLoadedSprite(
  loadedObject: LoadedObject,
  pos: { strValues: Coordinates }
) {
  if (loadedObject.type != "image") throw new Error(`Invalid type`);

  writeSprite(loadedObject.content, pos.strValues);
}

export function load(index: number): LoadedObject {
  const loadedObject = memory[index];
  if (!loadedObject) throw new Error("Loaded object out of range");

  const loadedObjectRAMUsage = getSizeOfLoadedObject([loadedObject]);
  if (loadedObjectRAMUsage.isErrored)
    throw new Error(loadedObjectRAMUsage.error);

  ramUsage += loadedObjectRAMUsage.content;
  if (ramUsage > MEMORY_SIZE) throw new Error("Out of fictional memory");

  console.log(
    `Fictional memory usage: ${((ramUsage / MEMORY_SIZE) * 100).toFixed(
      2
    )}% ==== ${ramUsage}`
  );

  if ((loadedObject.type as LoadedType) == loadedObject.type) {
    return loadedObject as LoadedObject;
  }

  // Don't use error types with game context
  throw new Error(`Invalid type: ${loadedObject.type}`);
}
