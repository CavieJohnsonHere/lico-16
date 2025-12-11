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
  content: { palette: number; pixels: number[] };
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

export type Transform = Partial<{
  rotate: 45 | 90 | 180;
  flipX: boolean;
  flipY: boolean;
  usePallette: number | null;
}>;

export function writeLoadedSprite(
  loadedObject: LoadedObject,
  pos: { strValues: Coordinates },
  transformValues: { strValues: Transform } | {} = {}
) {
  if (loadedObject.type != "image") throw new Error(`Invalid type`);
  let pixels: number[] = [];

  const transform =
    "strValues" in transformValues ? transformValues.strValues : {};

  if (transform.rotate === 90) {
    for (let x = 0; x < 8; x++) {
      for (let y = 7; y >= 0; y--) {
        const newPixel = loadedObject.content.pixels[y * 8 + x];
        if (newPixel === undefined) throw new Error("Invalid pixel data");
        pixels.push(newPixel);
      }
    }
  } else if (transform.rotate === 180) {
    for (let i = loadedObject.content.pixels.length - 1; i >= 0; i--) {
      pixels.push(loadedObject.content.pixels[i] || 0);
    }
  } else if (transform.rotate === 45) {
    for (let i = 0; i < 64; i++) {
      const x = i % 8;
      const y = Math.floor(i / 8);
      const skewX = (x + y) % 8;
      const skewY = (y - x + 8) % 8;
      const sourceIdx = skewY * 8 + skewX;
      pixels.push(loadedObject.content.pixels[sourceIdx] || 0);
    }
  } else if (transform.rotate != undefined) {
    throw new Error("Invalid rotation value");
  } else {
    pixels = loadedObject.content.pixels;
  }

  if (transform.flipX) {
    pixels = pixels.map((_, i) => {
      const x = i % 8;
      const y = Math.floor(i / 8);
      return pixels[y * 8 + (7 - x)] || 0;
    });
  }

  if (transform.flipY) {
    pixels = pixels.map((_, i) => {
      const x = i % 8;
      const y = Math.floor(i / 8);
      return pixels[(7 - y) * 8 + x] || 0;
    });
  }

  writeSprite(
    transform.usePallette || loadedObject.content.palette,
    pixels,
    pos.strValues
  );
}

const references: Record<number, LoadedObject | undefined> = {};

type LoadedObjectReference = {
  get(): LoadedObject | undefined;
  unload(): void;
};

function logMemory() {
  const percentage = ((memoryUsage / MEMORY_SIZE) * 100).toFixed(2);

  console.log(
    `Memory usage: ${percentage}% ${Array(
      Math.max(10 - percentage.length, 0)
    ).join(" ")} ${Math.ceil(memoryUsage / 8)}B`
  );

  const memoryBar = document.querySelector<HTMLDivElement>("#memory > div");
  if (memoryBar)
    memoryBar.style.width = `${Math.min(
      (memoryUsage / MEMORY_SIZE) * 100,
      100
    )}%`;
}

function getLoadedObjectReference(
  loadedObject: LoadedObject,
  index: number,
  size: number
): luainjs.Table {
  references[index] = loadedObject;
  const thing = {} as LoadedObjectReference;

  thing.get = () => references[index];

  thing.unload = () => {
    references[index] = undefined;

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
    return getLoadedObjectReference(
      loadedObject as LoadedObject,
      index,
      loadedObjectMemoryUsage.content
    );
  }

  // Don't use error types with game context
  throw new Error(`Invalid type: ${loadedObject.type}`);
}
