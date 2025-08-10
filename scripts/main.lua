player = {
    pos = {
        x = 0,
        y = 0
    },
    sprites = {[0] =lico.load(0), [1] = lico.load(1)},
    spriteIndex = 0
}

speed = 0.5
counter = 0;

function update()
    lico.resetCanvas()

    -- print(counter % 200)

    lico.writeLoadedSprite(player.sprites[player.spriteIndex], {
        x = player.pos.x,
        y = player.pos.y
    })

    player.pos.x = player.pos.x + lico.input().x * speed
    player.pos.y = player.pos.y + lico.input().y * speed

    counter = counter + 1

    player.spriteIndex = counter % 20 > 10 and 0 or 1
end

-- lico.setStart(start)
lico.setUpdate(update)
lico.startGame()
