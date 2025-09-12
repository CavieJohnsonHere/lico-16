player = {
    pos = {
        x = 0,
        y = 0
    },
    sprites = {
        [0] = lico.load(0),
        [1] = lico.load(1)
    },
    spriteIndex = 0,
    speedY = 0
}

enemy = {
    pos = {
        x = 100,
        y = 0
    },
    sprites = {
        [0] = lico.load(2)
    },
    spriteIndex = 0,
    speedY = 0
}

music = lico.load(3)
speed = 0.5
gravity = 0.1
counter = 0

running = true

function start()
    lico.playLoadedSound(music.get(), 0)
end

function update()
    lico.resetCanvas()

    enemyShouldJump = math.random(20) == 1

    if enemy.pos.y > 120 and running then
        enemy.pos.y = 120
        enemy.speedY = enemyShouldJump and -4 or 0
    elseif running then
        enemy.speedY = enemy.speedY + gravity
        enemy.pos.y = enemy.pos.y + enemy.speedY
    end

    lico.writeLoadedSprite(player.sprites[player.spriteIndex].get(), {
        x = player.pos.x,
        y = player.pos.y
    })

    lico.writeLoadedSprite(enemy.sprites[enemy.spriteIndex].get(), {
        x = enemy.pos.x,
        y = enemy.pos.y
    })

    if running then
        player.pos.x = player.pos.x + lico.input().x * speed
    end

    if player.pos.y > 120 and running then
        -- Player is grounded
        player.pos.y = 120
        player.speedY = 0
        if lico.input().y < 0 then
            player.speedY = -2
        end
    elseif running then
        player.speedY = player.speedY + gravity
        player.pos.y = player.pos.y + player.speedY
    end

    if running then
        counter = counter + 1
    end

    player.spriteIndex = counter % 20 > 10 and 0 or 1

    if player.pos.x < enemy.pos.x + 4 and player.pos.x > enemy.pos.x - 4 and player.pos.y < enemy.pos.y + 4 and
        player.pos.y > enemy.pos.y - 4 and running then
        lico.stopSound(0)
        music.unload()

        running = false
    end

end

lico.setStart(start)
lico.setUpdate(update)
lico.startGame()
