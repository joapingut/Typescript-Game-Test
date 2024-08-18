const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

interface Display {
    ctx : CanvasRenderingContext2D
    width : number
    height : number
}

interface Controls {
    rightPressed : boolean
    leftPressed : boolean
    upPressed : boolean
    downPressed : boolean
}

interface Entity {
    posX : number
    posY : number
}

interface Player extends Entity {

}

interface Game {
    controls : Controls
    display : Display
    player : Player
}

function createDisplay () : Display {
    const canvas = document.getElementById("main")
    if (canvas === null || !(canvas instanceof HTMLCanvasElement)) throw "No se ha podido recuperar el canvas"
    
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    
    const ctx = canvas.getContext("2d")
    if (ctx === null) throw "No se puede recuperar el contexto"

    return {ctx, width: CANVAS_WIDTH, height: CANVAS_HEIGHT}
}

function createControls() : Controls {
    const controls = {rightPressed: false, leftPressed: false, upPressed: false, downPressed: false}
    document.addEventListener("keydown", (event : KeyboardEvent) => {
        if (event.code === "ArrowRight") {
            controls.rightPressed = true
        } else if (event.code === "ArrowLeft") {
            controls.leftPressed = true
        }
        if (event.code === "ArrowDown") {
            controls.downPressed = true
        } else if (event.code === "ArrowUp") {
            controls.upPressed = true
        }
    }, false)
    document.addEventListener("keyup", (event : KeyboardEvent) => {
        if (event.code === "ArrowRight") {
            controls.rightPressed = false
        } else if (event.code === "ArrowLeft") {
            controls.leftPressed = false
        }
        if (event.code === "ArrowDown") {
            controls.downPressed = false
        } else if (event.code === "ArrowUp") {
            controls.upPressed = false
        }
    }, false)
    return controls
}

function initGame () : Game {
    const display = createDisplay()
    const controls = createControls()
    return {display, controls, player : {posX: 10, posY: 10}}
}

function printText (game : Game, x : number, y : number, text : string) {
    game.display.ctx.save()
    game.display.ctx.font = '25px Arial'
    game.display.ctx.fillStyle = 'black'
    game.display.ctx.fillText(text, x, y)
    game.display.ctx.restore()
}

function printRect (game : Game, x : number, y : number, w : number, h : number) {
    game.display.ctx.save()
    game.display.ctx.fillStyle = "red"
    game.display.ctx.fillRect(x, y, w, h)
    game.display.ctx.restore()
}

function logic(game : Game) {
    if (game.controls.rightPressed) {
        game.player.posX += 5;
    } else if (game.controls.leftPressed) {
        game.player.posX -= 5;
    }
    if (game.controls.downPressed) {
        game.player.posY += 5;
    } else if (game.controls.upPressed) {
        game.player.posY -= 5;
    }
}

function render(game : Game) {
    game.display.ctx.reset()
    printRect(game, game.player.posX, game.player.posY, 10, 10)
}

(() => {
    console.log("HOLA")
    const game = initGame()
    let oldTimeStamp : number = 0
    const gameLoop = (timeStamp : number) => {
        // Calculate the number of seconds passed since the last frame
        const secondsPassed = (timeStamp - oldTimeStamp) / 1000
        oldTimeStamp = timeStamp
        // Perform the drawing operation
        logic(game)
        render(game)
    
        // Calculate fps
        const fps = Math.round(1 / secondsPassed)
        printText(game, 10, 30, "FPS: " + fps)

        // The loop function has reached it's end. Keep requesting new frames
        window.requestAnimationFrame(gameLoop)
    }

    window.requestAnimationFrame(gameLoop)
})()