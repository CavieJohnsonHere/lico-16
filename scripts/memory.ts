import { memory } from "./cartridge";
import type { Sound } from "./playSound";
import writeSprite, { type Color, type Coordinates } from "./writeSprite";

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

  if ((loadedObject.type as LoadedType) == loadedObject.type) {
    return loadedObject as LoadedObject;
  }

  // Don't use error types with game context
  throw new Error(`Invalid type: ${loadedObject.type}`);
}
