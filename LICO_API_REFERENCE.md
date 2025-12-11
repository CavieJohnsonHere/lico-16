# LICO-16 Complete API Reference

A comprehensive guide to the LICO-16 fantasy console API, including all available functions, data structures, and usage examples.

---

## Table of Contents

1. [Overview](#overview)
2. [Core API Functions](#core-api-functions)
3. [Canvas Operations](#canvas-operations)
4. [Sprite & Graphics](#sprite--graphics)
5. [Input Handling](#input-handling)
6. [Audio System](#audio-system)
7. [Game Loop](#game-loop)
8. [Data Structures](#data-structures)
9. [Constants](#constants)
10. [Error Handling](#error-handling)
11. [Memory Management](#memory-management)
12. [Complete Examples](#complete-examples)

---

## Overview

LICO-16 is a fantasy console that runs Lua scripts and provides a complete API for creating retro-style games and applications. The console features:

- **Output**: 128x128 pixel display, scaled 4x for viewing
- **Color Palettes**: 15 colors per palette (plus 1 transparent color = 16 total)
- **Sprites**: 8x8 pixel art assets stored in cartridges
- **Audio**: Comprehensive audio feature that are limited to promote creativity
- **Input**: Arrow keys, X key, and C key (similar to PICO-8)
- **Storage**: Cartridge-based asset loading system

All LICO-16 functions are accessed through the global `lico` object in Lua.

---

## Core API Functions

### `lico.setStart(function)`

Sets the initialization function that runs once when the game starts.

**Parameters:**

- `function`: A Lua function with no parameters

**Returns:** None

**Example:**

```lua
function init()
  print("Game started!")
  lico.resetCanvas()
end

lico.setStart(init)
```

**Use Cases:**

- Load sprites
- Initialize game state
- Set up level data
- Configure starting conditions

---

### `lico.setUpdate(function)`

Sets the update function that runs every frame (~60 FPS).

**Parameters:**

- `function`: A Lua function with no parameters

**Returns:** None

**Example:**

```lua
function update()
  local input = lico.input()
  if input.x == 1 then
    -- Move right
  end
end

lico.setUpdate(update)
```

**Use Cases:**

- Handle player input
- Update game logic
- Move entities
- Detect collisions
- Render to screen

---

### `lico.startGame()`

Begins the game loop, calling the update function every frame.

**Parameters:** None

**Returns:** None

**Notes:**

- Must be called after `setStart` and `setUpdate` are defined
- Runs asynchronously, meaning that the rest of the code will run.
- Continues calling `setUpdate` until page reload
- Targets 60 FPS with ~16.67ms per frame

**Example:**

```lua
lico.setStart(init)
lico.setUpdate(update)
lico.startGame()
```

---

## Canvas Operations

### `lico.resetCanvas()`

Clears the entire canvas to black and resets dimensions.

**Parameters:** None

**Returns:** None

**Details:**

- Clears all drawn sprites and pixels
- Canvas is 128x128 pixels
- Displayed at 4x scale (512x512 on screen)
- Typically Called at the start of each frame

**Example:**

```lua
function update()
  lico.resetCanvas()
  -- Draw new frame here
  lico.writeLoadedSprite(spriteRefs[0].get(), {x = 50, y = 50})
end
```

---

### `lico.fillCanvas(r, g, b)`

Fills the entire canvas with a solid color.

**Parameters:**

- `r`: Red value (0-255)
- `g`: Green value (0-255)
- `b`: Blue value (0-255)

**Returns:** None

**Details:**

- No transparency
- Typically called after `clearCanvas()`
- No memory usage

**Example:**

```lua
function update()
  lico.resetCanvas()
  lico.fillCanvas(255, 50, 50)
end
```

---

## Sprite & Graphics

### `lico.load(index)`

Loads a sprite or sound asset from the cartridge.

**Parameters:**

- `index`: Integer index of the asset in your cartridge

**Returns:** A Lua table with the following methods:

- `.get()`: Returns the loaded asset object
- `.unload()`: Removes the asset from memory

**Details:**

- Assets are stored in the cartridge JSON file
- Each loaded asset consumes fictional memory
- Call this in the `setStart` function
- Maximum ~500 sprites per typical cartridge
- Throws error if index is out of range or memory exceeded
- Use `.unload()` to free up memory when asset is no longer needed

**Example:**

```lua
function init()
  spriteRefs = {}
  for i = 0, 12 do
    spriteRefs[i] = lico.load(i)
  end
end
```

**Memory Management Example:**

```lua
local sprite = lico.load(5)

-- Use sprite
lico.writeLoadedSprite(sprite.get(), {x = 50, y = 50})

-- Later, when done with sprite, free memory
sprite.unload()
-- sprite.get() will now return nil
```

---

### `lico.writeLoadedSprite(sprite, position)`

Draws a loaded sprite to the canvas at the specified position.

**Parameters:**

- `sprite`: A loaded sprite object (returned from `.get()`)
- `position`: Table with structure `{x = number, y = number}`

**Returns:** None

**Details:**

- Draws 8x8 pixel sprites
- Position is in pixels (0-127 for both X and Y)
- Pixels outside canvas are clipped
- Transparent pixels (color 0) are not drawn

**Example:**

```lua
local marioSprite = spriteRefs[0].get()
lico.writeLoadedSprite(marioSprite, {x = 50, y = 75})
```

---

## Input Handling

### `lico.input()`

Returns the current input state.

**Parameters:** None

**Returns:** A Lua table with the following structure:

```lua
{
  x = -1|0|1,    -- Horizontal input (-1 left, 0 none, 1 right)
  y = -1|0|1,    -- Vertical input (-1 up, 0 none, 1 down)
  keyX = bool,   -- X key state (jump)
  keyC = bool    -- C key state (action)
}
```

**Keyboard Mapping:**

- `x`: Arrow Left (-1), Arrow Right (1)
- `y`: Arrow Up (-1), Arrow Down (1)
- `keyX`: X key (mapped to "x" in browser)
- `keyC`: C key (mapped to "c" in browser)

**Details:**

- Called every frame in update function
- Returns instantaneous state (no buffering)
- Keys are case-insensitive
- Multiple keys can be pressed simultaneously

**Example:**

```lua
function update()
  local input = lico.input()

  if input.x == 1 then
    mario.x = mario.x + 2  -- Move right
  elseif input.x == -1 then
    mario.x = mario.x - 2  -- Move left
  end

  if input.keyX == true then
    mario.velocityY = -8   -- Jump
  end
end
```

---

## Audio System

### `lico.playLoadedSound(loadedSound, id)`

Plays a sound loaded from the cartridge.

**Parameters:**

- `loadedSound`: A loaded sound object from `lico.load()`
- `id`: Unique sound ID (number)

**Returns:** Async function (returns promise)

**Details:**

- Plays sounds sequentially if they have multiple notes
- Uses Web Audio API for synthesis
- Supports 4 waveform types: Pulse (A), Square (B), Triangle (C), Sawtooth (D)
- Note range: -15 to 15 semitones from C5
- Wait for promise to complete before playing again with same ID

**Example:**

```lua
local jumpSound = lico.load(13)
lico.playLoadedSound(jumpSound.get(), 0)
```

---

### `lico.stopSound(id)`

Stops a currently playing sound by ID.

**Parameters:**

- `id`: The sound ID to stop

**Returns:** None

**Example:**

```lua
lico.stopSound(0)  -- Stop the jump sound
```

---

## Game Loop

### Game Loop Flow

```
1. lico.setStart() is called
   ↓
2. init() function executes (load sprites, set up state)
   ↓
3. lico.startGame() initiates the loop
   ↓
4. Every ~16.67ms (60 FPS):
   - update() function executes
   - Handle input
   - Update logic
   - Render (resetCanvas + writeLoadedSprite)
   ↓
5. Loop continues until page reload
```

### Timing

- **Target FPS**: 60 frames per second
- **Frame Duration**: ~16.67 milliseconds

---

## Data Storage Structures

### Sprite Object (Loaded)

```lua
{
  type = "image",
  content = {
    palette = 0,           -- Palette index (0-2)
    pixels = {number, ...} -- 64 palette indices (8x8)
  }
}
```

### Sound Object (Loaded)

```lua
{
  type = "sound",
  content = {
    {
      type = "A"|"B"|"C"|"D",  -- Waveform type
      note = -15..15,           -- Semitone offset from C5
      volume = 0|0.25|0.3|0.5|0.75|0.85|0.9|1,
      length = 0|1|100|350|500|700|750|1400  -- Duration in ms
    },
    -- More sound notes...
  }
}
```

### Input State

```lua
{
  x = -1|0|1,      -- Horizontal direction
  y = -1|0|1,      -- Vertical direction
  keyX = boolean,  -- X key (jump)
  keyC = boolean   -- C key (action)
}
```

### Position/Coordinates

```lua
{
  x = number,  -- X pixel coordinate (0-127)
  y = number   -- Y pixel coordinate (0-127)
}
```

### Color (RGBA)

```lua
{
  r = 0-255,   -- Red channel
  g = 0-255,   -- Green channel
  b = 0-255,   -- Blue channel
  a = bool     -- Alpha/transparency
}
```

---

## Constants

### Canvas Dimensions

- **Width**: 128 pixels
- **Height**: 128 pixels
- **Display Scale**: 4x (512x512 on screen)
- **Sprite Size**: 8x8 pixels

### Memory Limits

- **Total Storage**: 128 MB (2^27 bits)
- **Runtime Memory**: 1 MB (2^20 bits)
- **Max Cartridge Items**: ~13 sprites (varies with image data)

### Sprite Memory Calculation

```
Image: palette_index (4 bits) + type (4 bits) + (pixels × 4 bits) = total bits
Sound: type (2 bits) + note (5 bits) + volume (3 bits) + length (6 bits) × note_count
```

## Error Handling

### Memory Errors

```lua
-- Thrown when:
-- 1. Loading exceeds STORAGE_SIZE
-- 2. Runtime memory exceeds MEMORY_SIZE
-- 3. Invalid cartridge format

-- Caught via Lua error handling:
if not pcall(function() lico.load(999) end) then
  print("Failed to load sprite")
end
```

### Cartridge Errors

```lua
-- Common errors:
-- "Cartridge too large to fit in fictional memory"
-- "No code in cartridge"
-- "UNREACHABLE REACHED" - Internal error

-- Cartridge loading happens before game starts
```

### Invalid Input

```lua
-- lico.input() always returns valid table
-- Safe to call multiple times
-- No error states for input
```

---

## Memory Management

### Asset Loading

```lua
function init()
  -- Load sprites during init (one-time cost)
  spriteRefs = {}
  for i = 0, 12 do
    spriteRefs[i] = lico.load(i)
  end

  -- Store references for use in update()
end

function update()
  -- Use already-loaded sprites (no additional memory cost)
  lico.writeLoadedSprite(spriteRefs[0].get(), {x = 50, y = 50})
end
```

### Asset Unloading

```lua
-- Load an asset
local sprite = lico.load(5)

-- Use it in game
lico.writeLoadedSprite(sprite.get(), {x = 50, y = 50})

-- When done, free memory
sprite.unload()

-- Now sprite.get() returns nil and memory is freed
```

### Memory Display

The game shows real-time memory usage:

- **Storage Bar** (top right): Cartridge size vs 128MB limit
- **Memory Bar** (below storage): Runtime memory vs 1MB limit

### Optimization Tips

1. **Load sprites once in `setStart`**, not in `update`
2. **Reuse sprite references** across frames
3. **Unload sprites when no longer needed** using `.unload()` to free memory
4. **Minimize cartridge size** by using efficient sprite compression
5. **Avoid creating new tables** every frame if possible

---

## Complete Examples

### Example 1: Simple Animation Loop

```lua
local sprite = {}

function init()
  sprite = lico.load(0)
  lico.resetCanvas()
end

function update()
  lico.resetCanvas()
  lico.writeLoadedSprite(sprite.get(), {x = 60, y = 60})
end

lico.setStart(init)
lico.setUpdate(update)
lico.startGame()
```

### Example 2: Player Movement

```lua
local spriteRefs = {}
local player = {x = 64, y = 64, speed = 2}

function init()
  -- Load sprites
  for i = 0, 3 do
    spriteRefs[i] = lico.load(i)
  end
end

function update()
  local input = lico.input()

  -- Handle input
  if input.x == 1 then
    player.x = player.x + player.speed
  elseif input.x == -1 then
    player.x = player.x - player.speed
  end

  if input.y == 1 then
    player.y = player.y + player.speed
  elseif input.y == -1 then
    player.y = player.y - player.speed
  end

  -- Clamp to canvas
  if player.x < 0 then player.x = 0 end
  if player.x > 120 then player.x = 120 end
  if player.y < 0 then player.y = 0 end
  if player.y > 120 then player.y = 120 end

  -- Draw
  lico.resetCanvas()
  lico.writeLoadedSprite(spriteRefs[0].get(), {x = player.x, y = player.y})
end

lico.setStart(init)
lico.setUpdate(update)
lico.startGame()
```

### Example 4: Sound Playback

```lua
local soundRefs = {}

function init()
  -- Load sound asset
  soundRefs.jump = lico.load(13)
end

function update()
  local input = lico.input()

  if input.keyX == true then
    -- Play jump sound
    lico.playLoadedSound(soundRefs.jump.get(), 0)
  end

  if input.keyC == true then
    -- Stop sound
    lico.stopSound(0)
  end
end

lico.setStart(init)
lico.setUpdate(update)
lico.startGame()
```

---

## Debugging

### Console Output

```lua
print("Debug message")  -- Visible in browser console
```

### Error Handling

```lua
if pcall(function()
  -- Risky code
end) then
  print("Success")
else
  print("Error occurred")
end
```

### Memory Monitoring

- Check the "Memory" and "Storage" bars in top-right corner
- View memory/storage percentage in browser console
- Monitor for memory-related errors during asset loading

---

## Advanced Topics

### Custom Collision Detection

```lua
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2)
  return x1 < x2 + w2 and x1 + w1 > x2 and
         y1 < y2 + h2 and y1 + h1 > y2
end
```

### State Machines

```lua
local mario = {state = "idle"}

function updateMario()
  if mario.state == "idle" then
    -- Handle idle state
  elseif mario.state == "running" then
    -- Handle running state
  elseif mario.state == "jumping" then
    -- Handle jumping state
  end
end
```

### Sprite Animation

```lua
local animation = {frame = 0, speed = 0.1}

function updateAnimation()
  animation.frame = (animation.frame + animation.speed) % 4
  local frameIndex = math.floor(animation.frame)
  return frameIndex
end
```

### Camera/Viewport

```lua
local camera = {x = 0, y = 0}

function drawWithCamera(sprite, worldX, worldY)
  local screenX = worldX - camera.x
  local screenY = worldY - camera.y

  if screenX >= -8 and screenX <= 128 and
     screenY >= -8 and screenY <= 128 then
    lico.writeLoadedSprite(sprite.get(), {x = screenX, y = screenY})
  end
end

function updateCamera()
  camera.x = player.x - 64  -- Center on player
  camera.y = player.y - 64

  -- Clamp camera
  if camera.x < 0 then camera.x = 0 end
  if camera.y < 0 then camera.y = 0 end
end
```

---

## API Summary Table

| Function                   | Parameters  | Returns | Purpose                                            |
| -------------------------- | ----------- | ------- | -------------------------------------------------- |
| `lico.setStart()`          | function    | void    | Set init function                                  |
| `lico.setUpdate()`         | function    | void    | Set update function                                |
| `lico.startGame()`         | -           | void    | Start game loop                                    |
| `lico.resetCanvas()`       | -           | void    | Clear screen                                       |
| `lico.fillCanvas()`        | r, g, b     | void    | Fill screen with color                             |
| `lico.load()`              | index       | table   | Load asset (with `.get()` and `.unload()` methods) |
| `.get()`                   | -           | object  | Retrieve loaded asset                              |
| `.unload()`                | -           | void    | Remove asset from memory                           |
| `lico.writeLoadedSprite()` | sprite, pos | void    | Draw sprite                                        |
| `lico.input()`             | -           | table   | Get input state                                    |
| `lico.playLoadedSound()`   | sound, id   | promise | Play sound                                         |
| `lico.stopSound()`         | id          | void    | Stop sound                                         |

---

## Limitations & Constraints

### Hardware Constraints

- **Display**: 128x128 pixels (fixed)
- **Sprite Size**: 8x8 pixels (fixed)
- **Colors**: 15 per palette (fixed)
- **Palettes**: 3 total (fixed)
- **Storage**: 128MB total
- **Memory**: 1MB at runtime

### Technical Constraints

- **FPS**: 60 (fixed)
- **Language**: Lua only
- **Platform**: Web browsers with Web Audio API

### Game Design Constraints

- Think in 8x8 pixel increments
- Limited animation frames per sprite
- Plan cartridge size carefully
- Optimize for 60 FPS consistently
