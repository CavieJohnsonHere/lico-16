import { STORAGE_SIZE } from "./constants";
import { done, fine, panic, type Error } from "./error";
import type { LoadedObject } from "./memory";

export let storage = [] as LoadedObject[];
let arbitraryCodeStorageUsage = 0;

export function getSizeOfLoadedObject(mem: LoadedObject[]): Error<number> {
  let size = 0;
  for (let item of mem) {
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
  }

  return fine(size);
}

export function loadCartridge(cartridge: LoadedObject[]): Error<string> {
  const size = getSizeOfLoadedObject(cartridge);

  if (size.isErrored) return panic(size.error);

  console.log(
    `Loaded cartridge with ${cartridge.length} items, using ${size.content} bits of memory.`
  );

  if (size.content > STORAGE_SIZE)
    return panic("Cartridge too large to fit in fictional memory.");

  storage = cartridge;

  for (let storageItem of storage) {
    if (storageItem.type == "code") return fine(storageItem.content);
  }

  return panic("No code in cartridge");
}

export function addCodeStorageUsage(code: string): Error<void> {
  const size = getSizeOfLoadedObject(storage);

  if (size.isErrored) return panic(size.error);

  let newSize = size.content;

  if ((code.length % 8) % 1 != 0) newSize += code.length * 1 + 8;
  else newSize += code.length * 1 + 4;

  if (newSize > STORAGE_SIZE)
    return panic("Cartridge too large to fit in fictional memory.");

  arbitraryCodeStorageUsage += newSize - size.content;

  return done();
}

export function logStorage() {
  const size = getSizeOfLoadedObject(storage);

  if (size.isErrored) return;

  const storageBar = document.querySelector<HTMLDivElement>("#storage > div");
  if (storageBar) storageBar.style.width = `${Math.min((size.content / STORAGE_SIZE) * 100, 100)}%`;
}
