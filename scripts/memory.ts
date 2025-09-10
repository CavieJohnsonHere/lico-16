import type { Sound } from "./playSound";
import writeSprite, { type Color, type Coordinates } from "./writeSprite";

const memory: LoadedObject[] = [
  {
    type: "image",
    content: [
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 39,
        g: 255,
        b: 241,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
    ],
  },
  {
    type: "image",
    content: [
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 106,
        g: 106,
        b: 106,
        a: false,
      },
      {
        r: 106,
        g: 106,
        b: 106,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 39,
        g: 255,
        b: 241,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 180,
        b: 180,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 106,
        g: 106,
        b: 106,
        a: false,
      },
      {
        r: 106,
        g: 106,
        b: 106,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
      {
        r: 255,
        g: 255,
        b: 255,
        a: true,
      },
    ],
  },
  {
    type: "image",
    content: [
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 255,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: false,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
      {
        r: 0,
        g: 0,
        b: 0,
        a: true,
      },
    ],
  },
  {
    type: "sound",
    content: [
      // Line 1: "Happy birthday to you"
      { type: "B", note: -5, volume: 0.9, length: 350 }, // G4
      { type: "B", note: -5, volume: 0.9, length: 350 }, // G4
      { type: "B", note: -3, volume: 0.9, length: 700 }, // A4
      { type: "B", note: -5, volume: 0.9, length: 700 }, // G4
      { type: "B", note: 0, volume: 0.9, length: 700 }, // C5
      { type: "B", note: -1, volume: 0.9, length: 1400 }, // B4

      // Line 2: "Happy birthday to you" (second phrase)
      { type: "B", note: -5, volume: 0.9, length: 350 }, // G4
      { type: "B", note: -5, volume: 0.9, length: 350 }, // G4
      { type: "B", note: -3, volume: 0.9, length: 700 }, // A4
      { type: "B", note: -5, volume: 0.9, length: 700 }, // G4
      { type: "B", note: 2, volume: 0.9, length: 700 }, // D5
      { type: "B", note: 0, volume: 0.9, length: 1400 }, // C5

      // Line 3: "Happy birthday dear [Name]"
      { type: "C", note: -5, volume: 0.85, length: 350 }, // G4
      { type: "C", note: -5, volume: 0.85, length: 350 }, // G4
      { type: "C", note: 7, volume: 0.85, length: 700 }, // G5 (higher)
      { type: "C", note: 4, volume: 0.85, length: 700 }, // E5
      { type: "C", note: 0, volume: 0.85, length: 700 }, // C5
      { type: "C", note: -1, volume: 0.85, length: 700 }, // B4
      { type: "C", note: -3, volume: 0.85, length: 1400 }, // A4

      // Line 4: "Happy birthday to you" (final)
      { type: "B", note: 5, volume: 0.9, length: 350 }, // F5
      { type: "B", note: 5, volume: 0.9, length: 350 }, // F5
      { type: "B", note: 4, volume: 0.9, length: 700 }, // E5
      { type: "B", note: 0, volume: 0.9, length: 700 }, // C5
      { type: "B", note: 2, volume: 0.9, length: 700 }, // D5
      { type: "B", note: 0, volume: 0.9, length: 1400 }, // C5 (end)
    ],
  },
];

function getSizeOfLoadedObject(mem: LoadedObject[]): number {
  let size = 0;
  for (let i = 0; i < mem.length; i++) {
    const item = mem[i];
    // TODO: use our Error system instead
    if (!item) throw new Error("UNREACHABLE REACHED, THE WORLD WILL END");

    if (item.type == "image") {
      // We assume 4 bits per pixel, later it will be index-based so we can have 14 colors in each pallette (one is always transparent)
      // We also assume 8 bits for metadata including 4 for the data type ("image") leaving 4 for the pallette, allowing us to get 15 pallettes.
      if ((item.content.length % 8) % 1 != 0)
        size += item.content.length * 4 + 8;
      else size += item.content.length * 4 + 12;
    }

    if (item.type == "sound") {
      // We assume 16 bits per sound note (2 for type, 5 for note, 3 for volume, and 6 fpr length), and 8 bits for metadata including 4 for the data type ("sound") leaving 4 for future use.
      if ((item.content.length % 8) % 1 != 0)
        size += item.content.length * 4 + 8;
      else size += item.content.length * 4 + 4;
    }

    if (item.type == "code") {
      // We assume 8 bits per character, and 8 bits for metadata including 4 for the data type ("code") leaving 4 for future use.
      if ((item.content.length % 8) % 1 != 0)
        size += item.content.length * 1 + 8;
      else size += item.content.length * 1 + 4;
    }
  }

  return size;
}

type LoadedType = "image";

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

type LoadedObject = LoadedAsset | LoadedCode | LoadedSound;

export function load(index: number): LoadedObject {
  const loadedObject = memory[index];

  if (!loadedObject) throw new Error("Loaded object out of range");

  if ((loadedObject.type as LoadedType) == loadedObject.type) {
    return loadedObject as LoadedObject;
  }

  // Don't use error types with game context
  throw new Error(`Invalid type: ${loadedObject.type}`);
}

export function writeLoadedSprite(
  loadedObject: LoadedObject,
  pos: { strValues: Coordinates }
) {
  if (loadedObject.type != "image") throw new Error(`Invalid type`);

  writeSprite(loadedObject.content, pos.strValues);
}
