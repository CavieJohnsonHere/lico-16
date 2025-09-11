import { getSizeOfLoadedObject, storage } from "./cartridge";
import { MEMORY_SIZE } from "./constants";
import type { Sound } from "./playSound";
import writeSprite, { type Color, type Coordinates } from "./writeSprite";

let memoryUsage = 0;

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

const refrences: Record<number, LoadedObject | undefined> = {};
type LoadedObjectRefrence = {
  (): LoadedObject | undefined;
  unload(): void;
};

function getLoadedObjectRefrence(
  loadedObject: LoadedObject,
  index: number,
  size: number
): LoadedObjectRefrence {
  refrences[index] = loadedObject;
  const thing = {} as any;

  thing.get = () => refrences[index];

  thing.unload = () => {
    refrences[index] = undefined;

    memoryUsage -= size;
    if (memoryUsage < 0) memoryUsage = 0;
    console.log(
      `Fictional memory usage: ${((memoryUsage / MEMORY_SIZE) * 100).toFixed(
        2
      )}% ==== ${memoryUsage}`
    );
  };

  return thing;
}

export function load(index: number): LoadedObjectRefrence {
  const loadedObject = storage[index];
  if (!loadedObject) throw new Error(`Loaded object out of range, loaded: ${index}`);

  const loadedObjectMemoryUsage = getSizeOfLoadedObject([loadedObject]);
  if (loadedObjectMemoryUsage.isErrored)
    throw new Error(loadedObjectMemoryUsage.error);

  memoryUsage += loadedObjectMemoryUsage.content;
  if (memoryUsage > MEMORY_SIZE) throw new Error("Out of fictional memory");

  console.log(
    `Fictional memory usage: ${((memoryUsage / MEMORY_SIZE) * 100).toFixed(
      2
    )}% ==== ${memoryUsage}`
  );

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
