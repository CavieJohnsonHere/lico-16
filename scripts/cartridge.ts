import { done, fine, panic, type Error } from "./error";
import type { LoadedObject } from "./memory";

export let memory = [] as LoadedObject[];

export function getSizeOfLoadedObject(mem: LoadedObject[]): Error<number> {
  let size = 0;
  for (let i = 0; i < mem.length; i++) {
    const item = mem[i];
    // TODO: use our Error system instead
    if (!item) return panic("UNREACHABLE REACHED, THE WORLD WILL END");

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

  return fine(size);
}

export function loadCartridge(storage: LoadedObject[]): Error<void> {
  const size = getSizeOfLoadedObject(storage);

  if (size.isErrored) return panic(size.error);

  console.log(`Loaded cartridge with ${storage.length} items, using ${size} bits of memory.`);

  if (size.content > 4096) {
    return panic("Cartridge too large to fit in fictional memory.");
  }

  memory = storage

  return done();
}
