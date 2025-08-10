export const keysPressed = new Map<string, boolean>();

export function handleKeyDown(e: KeyboardEvent) {
  keysPressed.set(e.key, true);
}

export function handleKeyUp(e: KeyboardEvent) {
  keysPressed.set(e.key, false);
}
