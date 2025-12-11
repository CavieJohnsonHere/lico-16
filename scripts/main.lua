-- smb_lico16.lua
-- Compact Super-Mario style platformer for LICO-16
-- Assumes sprite indices provided in user's memory mapping:
-- 0: Mario standing (right)
-- 1: Mario jumping
-- 2: Mario running frame 1
-- 3: Mario running frame 2
-- 4: Goomba walking frame 1
-- 5: Goomba walking frame 2
-- 6: Brick block
-- 7: Question block
-- 8: Pipe (top)
-- 9: Ground/grass tile
-- 11: Coin static
-- 12: Coin spin frame
-- ---------- Config / Constants ----------
local TILE = 8
local GRAVITY = 0.5
local JUMP_V = -6
local MOVE_SPEED = 2.0
local MAX_FALL = 10
local ANIM_SPEED = 6 -- frames per animation step (lower == faster)

-- ---------- Game State ----------
local spriteRefs = {}
local levelTiles = {} -- list of tiles {x=,y=,type=,solid=,state=}
local enemies = {} -- list of enemies {x,y,w,h,vx,alive}
local coins = {} -- list of coins {x,y,alive,animFrame}
local mario = {
    x = 16,
    y = 96,
    w = 8,
    h = 8,
    vx = 0,
    vy = 0,
    isJumping = false,
    facingRight = true,
    animCounter = 0
}
local camera = {
    x = 0,
    y = 0
}
local frameCount = 0
local score = 0
local lives = 3

-- ---------- Helper functions ----------
local function loadSprites()
    -- load indices 0..12
    for i = 0, 13 do
        -- pcall to avoid fatal error if cartridge missing entries
        local ok, ref = pcall(function()
            return lico.load(i)
        end)
        if ok and ref then
            spriteRefs[i] = ref
        else
            spriteRefs[i] = nil
        end
    end
end

local function tileAt(x, y)
    -- Return tile object at world pixel coords x,y (tile aligned)
    for _, t in ipairs(levelTiles) do
        if x >= t.x and x < t.x + TILE and y >= t.y and y < t.y + TILE then
            return t
        end
    end
    return nil
end

local function rectsOverlap(aX, aY, aW, aH, bX, bY, bW, bH)
    return aX < bX + bW and aX + aW > bX and aY < bY + bH and aY + aH > bY
end

local function spawnCoin(x, y)
    table.insert(coins, {
        x = x,
        y = y,
        alive = true,
        animCounter = 0
    })
end

local function spawnGoomba(x, y)
    table.insert(enemies, {
        x = x,
        y = y,
        w = 8,
        h = 8,
        vx = -0.6,
        alive = true,
        animCounter = 0
    })
end

local function drawSpriteIndex(idx, worldX, worldY, flipX)
    if not spriteRefs[idx] then
        return
    end
    local sprite = spriteRefs[idx].get()
    if not sprite then
        return
    end
    local screenX = worldX - camera.x
    local screenY = worldY - camera.y
    if screenX >= -8 and screenX <= 128 and screenY >= -8 and screenY <= 128 then
        lico.writeLoadedSprite(sprite, {
            x = math.floor(screenX),
            y = math.floor(screenY)
        }, {
            flipX = flipX or false,
            flipY = false,
        })
    end
end

-- ---------- Level Creation ----------
local function createLevel()
    levelTiles = {}
    enemies = {}
    coins = {}

    -- ground across bottom
    for gx = 0, 120, TILE do
        table.insert(levelTiles, {
            x = gx,
            y = 120,
            type = 9,
            solid = true
        })
    end

    -- small platform
    for px = 32, 56, TILE do
        table.insert(levelTiles, {
            x = px,
            y = 96,
            type = 6,
            solid = true
        }) -- bricks as platform
    end

    -- question blocks row
    table.insert(levelTiles, {
        x = 72,
        y = 80,
        type = 7,
        solid = true,
        state = "question"
    })
    table.insert(levelTiles, {
        x = 88,
        y = 80,
        type = 7,
        solid = true,
        state = "question"
    })

    -- a pipe
    table.insert(levelTiles, {
        x = 112,
        y = 96,
        type = 8,
        solid = true
    })

    -- coins in the air
    spawnCoin(40, 72)
    spawnCoin(48, 72)
    spawnCoin(56, 72)

    -- a goomba
    spawnGoomba(64, 112)
end

-- ---------- Collision ----------
local function resolveCollisions()
    -- horizontal movement: attempt to move then check collisions with solid tiles
    mario.x = mario.x + mario.vx
    -- clamp to world bounds (0..128-TILE)
    if mario.x < 0 then
        mario.x = 0
    end
    if mario.x > 128 - mario.w then
        mario.x = 128 - mario.w
    end

    -- check horizontal collision against tiles
    for _, t in ipairs(levelTiles) do
        if t.solid then
            if rectsOverlap(mario.x, mario.y, mario.w, mario.h, t.x, t.y, TILE, TILE) then
                -- collided horizontally, push back depending on vx
                if mario.vx > 0 then
                    mario.x = t.x - mario.w
                elseif mario.vx < 0 then
                    mario.x = t.x + TILE
                end
                mario.vx = 0
            end
        end
    end

    -- vertical movement
    mario.y = mario.y + mario.vy

    -- collisions with tiles from vertical movement
    for _, t in ipairs(levelTiles) do
        if t.solid then
            if rectsOverlap(mario.x, mario.y, mario.w, mario.h, t.x, t.y, TILE, TILE) then
                -- if Mario moving down (landing)
                if mario.vy > 0 then
                    -- land on top
                    mario.y = t.y - mario.h
                    mario.vy = 0
                    mario.isJumping = false
                elseif mario.vy < 0 then
                    -- hit from below -> possible block hit
                    mario.y = t.y + TILE
                    mario.vy = 0
                    -- block hit logic: if it's a question block and state = question -> spawn coin & mark used
                    if t.type == 7 and t.state == "question" then
                        t.state = "used" -- we will still draw same tile unless you replace with a used sprite; for simplicity mark state used
                        -- spawn a coin above block
                        spawnCoin(t.x, t.y - 8)
                        score = score + 10
                    end
                end
            end
        end
    end

    -- collision with coins
    for _, c in ipairs(coins) do
        if c.alive and rectsOverlap(mario.x, mario.y, mario.w, mario.h, c.x, c.y, 8, 8) then
            c.alive = false
            score = score + 100
        end
    end

    -- collisions with enemies
    for _, e in ipairs(enemies) do
        if e.alive then
            if rectsOverlap(mario.x, mario.y, mario.w, mario.h, e.x, e.y, e.w, e.h) then
                -- If Mario is falling onto enemy -> stomp
                if mario.vy > 0 and (mario.y + mario.h - mario.vy) <= e.y + 2 then
                    -- stomped
                    e.alive = false
                    mario.vy = -4 -- bounce
                    score = score + 200
                else
                    -- otherwise hit by enemy: lose life and reset position
                    lives = lives - 1
                    -- simple respawn
                    mario.x = 16
                    mario.y = 96
                    mario.vx = 0
                    mario.vy = 0
                    mario.isJumping = false
                end
            end
        end
    end
end

-- ---------- Camera ----------
local function updateCamera()
    camera.x = mario.x - 64 + mario.w / 2
    camera.y = 0 -- keep vertical fixed for simplicity
    if camera.x < 0 then
        camera.x = 0
    end
    if camera.x > 128 - 128 then
        camera.x = 128 - 128
    end -- world width is 128
end

-- ---------- Game Loop Functions ----------
local function init()
    lico.resetCanvas()
    loadSprites()
    createLevel()
    -- initial camera
    updateCamera()

    lico.playLoadedSound(spriteRefs[13].get())
end

local function updateAnimation()
    mario.animCounter = mario.animCounter + 1
    frameCount = frameCount + 1
end

local function updateEnemies()
    for _, e in ipairs(enemies) do
        if e.alive then
            e.x = e.x + e.vx
            -- clamp enemies to world bounds
            if e.x < 0 or e.x > 128 - e.w then
                e.vx = -e.vx
                e.x = math.max(0, math.min(e.x, 128 - e.w))
            end
            -- simple tile collisions for enemies: reverse on tile edge or pipe hit
            -- reverse if standing would fall (edge) or hits solid tile horizontally
            local below = tileAt(e.x, e.y + e.h + 1)
            if not below or not below.solid then
                e.vx = -e.vx
            end
            -- horizontal collision with solid tiles
            for _, t in ipairs(levelTiles) do
                if t.solid and rectsOverlap(e.x, e.y, e.w, e.h, t.x, t.y, TILE, TILE) then
                    -- only handle horizontal collision (simple)
                    if e.vx > 0 then
                        e.x = t.x - e.w
                    else
                        e.x = t.x + TILE
                    end
                    e.vx = -e.vx
                end
            end
        end
    end
end

local function drawWorld()
    -- draw tiles
    for _, t in ipairs(levelTiles) do
        -- question block: if used, draw brick (or same), here we keep same sprite but skip spawn logic next time
        if t.type == 7 then
            -- If used, show brick sprite (index 6) for visual feedback
            if t.state == "used" then
                drawSpriteIndex(6, t.x, t.y)
            else
                drawSpriteIndex(7, t.x, t.y)
            end
        else
            drawSpriteIndex(t.type, t.x, t.y)
        end
    end

    -- draw coins
    for _, c in ipairs(coins) do
        if c.alive then
            -- simple spinning: alternate between 11 and 12 based on animCounter
            local idx = 11
            if math.floor(frameCount / ANIM_SPEED) % 2 == 0 then
                idx = 12
            else
                idx = 11
            end
            drawSpriteIndex(idx, c.x, c.y)
        end
    end

    -- draw enemies
    for _, e in ipairs(enemies) do
        if e.alive then
            local idx = (math.floor(frameCount / ANIM_SPEED) % 2 == 0) and 4 or 5
            drawSpriteIndex(idx, e.x, e.y)
        end
    end

    -- draw mario with appropriate sprite
    local spriteIndex = 0
    if mario.isJumping then
        spriteIndex = 1
    else
        if mario.vx == 0 then
            spriteIndex = 0
        else
            spriteIndex = (math.floor(frameCount / ANIM_SPEED) % 2 == 0) and 2 or 3
        end
    end
    drawSpriteIndex(spriteIndex, mario.x, mario.y, not mario.facingRight)
end

function update()
    local input = lico.input()

    -- handle left/right
    if input.x == 1 then
        mario.vx = MOVE_SPEED
        mario.facingRight = true
    elseif input.x == -1 then
        mario.vx = -MOVE_SPEED
        mario.facingRight = false
    else
        mario.vx = 0
    end

    -- handle jump (X) - only when not already jumping
    if input.keyX == true and not mario.isJumping then
        mario.vy = JUMP_V
        mario.isJumping = true
    end

    -- apply gravity
    mario.vy = mario.vy + GRAVITY
    if mario.vy > MAX_FALL then
        mario.vy = MAX_FALL
    end

    -- update animations and entities
    updateAnimation()
    updateEnemies()

    -- resolve collisions (moves mario and resolves)
    resolveCollisions()

    -- update camera
    updateCamera()

    -- render
    lico.resetCanvas()
    drawWorld()

    -- optional: display score and lives via console (LICO-16 lacks text draw API here)
    -- using print will appear in browser console
    if frameCount % 60 == 0 then
        print("Score:", score, "Lives:", lives)
    end
end

-- ---------- Start ----------
lico.setStart(init)
lico.setUpdate(update)
lico.startGame()
