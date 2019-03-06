// This sectin contains some game constants. It is not super interesting
let GAME_WIDTH = 700
let GAME_HEIGHT = 600

let ENEMY_WIDTH = 100
let ENEMY_HEIGHT = 100
let MAX_ENEMIES = 4
let MAX_COINS = 4
let FIRE_WIDTH = 75
let FIRE_HEIGHT = 75
let MAX_FIRE = 8

let PLAYER_WIDTH =  100
let PLAYER_HEIGHT = 100

let COIN_WIDTH =  50
let COIN_HEIGHT = 50

// These two constants keep us from using "magic numbers" in our code
let LEFT_ARROW_CODE = 37
let RIGHT_ARROW_CODE = 39
let UP_ARROW_CODE = 38
let DOWN_ARROW_CODE = 40
let fires = []
let coins = []
// These two constants allow us to DRY
let MOVE_LEFT = "left"
let MOVE_RIGHT = "right"
let MOVE_UP = 'up'
let MOVE_DOWN = 'down'
// Preload game images
let restart
let songGame = new Audio("gameSong.mp3");

let imageFilenames = ["tom.png", "bg.jpg", "jerry.png", "fire.png", "coin.jpg"]
let images = {}
let count = 0
let level = 0
let maindiv = document.querySelector("#app")

let h2 = document.createElement("h2")

h2.style.position = "absolute";
h2.style.left = "495px";
h2.style.zIndex = 1;
h2.style.top = "-15px";
h2.style.font = "bold 30px Impact"
h2.style.color = "white";
imageFilenames.forEach(function(imgName) {
  let img = document.createElement("img")
  img.src = "images/" + imgName
  images[imgName] = img
})
let enemyL = 0
let enemyT = 0
// This section is where you will be doing most of your coding

class Entity{
  render(ctx) {
    this.domElement.style.left = this.x + "px"
    this.domElement.style.top = this.y + "px"
  }
}

class Fire extends Entity{
  constructor(root, xPos, yPos) {
    super()
    this.root = root
    this.x = xPos
    this.y = yPos
    let img = document.createElement("img")
    img.src = "images/fire.png"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = 10
    img.style.width = "100px"
    img.style.height = "100px"
    root.appendChild(img)

    this.domElement = img
    // Each enemy should have a different speed
    this.speed =1
   
  }

  update(timeDiff) {
    this.y = this.y - 10 * this.speed
  }

  
  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }
}

class Enemy extends Entity{
  constructor(root, xPos) {
    super()
    this.root = root
    this.x = xPos
    this.y = -ENEMY_HEIGHT
    let img = document.createElement("img")
    img.src = "images/tom.png"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = 5
    img.style.width = "100px"
    img.style.height = "100px"
    root.appendChild(img)

    this.domElement = img
    // Each enemy should have a different speed
    this.speed = Math.random() / 2 + 0.25
   
  }

  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed
  }

  
  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }
}

class Coin extends Entity{

  constructor(root, xPos) {
    
    super()
    this.root = root
    this.x = xPos
    this.y = -COIN_HEIGHT
    let imgC = document.createElement("img")
    imgC.src = "images/coin.png"
    imgC.style.position = "absolute"
    imgC.style.left = this.x + "px"
    imgC.style.top = this.y + "px"
    imgC.style.zIndex = 5
    imgC.style.width = "50px"
    imgC.style.height = "50px"
    imgC.style.marginLeft = "10px" 
    root.appendChild(imgC)

    this.domElement = imgC
    // Each enemy should have a different speed
    this.speed = Math.random() / 2 + 0.25
   
  }

  update(timeDiff) {
    this.y = this.y + timeDiff * this.speed
  }

  
  destroy() {
    // When an enemy reaches the end of the screen, the corresponding DOM element should be destroyed
    this.root.removeChild(this.domElement)
  }
}

class Player extends Entity {
  constructor(root) {
    super()
    this.root = root
    this.x = 2 * PLAYER_WIDTH
    this.y = GAME_HEIGHT - PLAYER_HEIGHT 
    //console.log(this.x,this.y)
    
    let img = document.createElement("img")
    img.src = "images/jerry.png"
    img.style.position = "absolute"
    img.style.left = this.x + "px"
    img.style.top = this.y + "px"
    img.style.zIndex = "10"
    img.style.width = "100px"
    img.style.height = "100px"

    root.appendChild(img)

    this.domElement = img
  }

  // This method is called by the game engine when left/right arrows are pressed
  move(direction) {
    if (direction === MOVE_LEFT && this.x > 0) {
      this.x = this.x - PLAYER_WIDTH
    } else if (direction === MOVE_RIGHT && this.x < GAME_WIDTH - PLAYER_WIDTH) {
      this.x = this.x + PLAYER_WIDTH
    }else if (direction === MOVE_UP && this.y > 0) {
        this.y = this.y - PLAYER_HEIGHT
      } else if (direction === MOVE_DOWN && this.y < GAME_HEIGHT - PLAYER_HEIGHT) {
        this.y = this.y + PLAYER_HEIGHT
      }
  }

  shoot(){
    
      let fire = new Fire(this.root, this.x, this.y)
     
      fires.push(fire)
      
    
  }

}

class Text {
  constructor(root, xPos, yPos) {
    this.root = root

    let span = document.createElement("span")
    span.style.position = "absolute"
    span.style.left = xPos
    span.style.top = yPos
    span.style.zIndex = 10
    span.style.font = "bold 30px Impact"
    span.style.color = "white"
    root.appendChild(span)
    this.domElement = span
  }

  // This method is called by the game engine when left/right arrows are pressed
  update(txt) {
    this.domElement.innerText = txt
  }
}

/*
This section is a tiny game engine.
This engine will use your Enemy and Player classes to create the behavior of the game.
*/
class Engine {
  constructor(element) {
   
    this.root = element
    
    // Setup the player
    this.player = new Player(this.root)
    this.info = new Text(this.root, 5, 30)
    
    // Setup enemies, making sure there are always three
    this.setupEnemies()
    this.setupCoins()
    // Put a white div at the bottom so that enemies seem like they dissappear
    let whiteBox = document.createElement("div")
    whiteBox.style.zIndex = 100
    whiteBox.style.position = "absolute"
    whiteBox.style.top = GAME_HEIGHT + "px"
    whiteBox.style.height = ENEMY_HEIGHT + "px"
    whiteBox.style.width = GAME_WIDTH + "px"
    whiteBox.style.background = "#fff"
    this.root.append(whiteBox)

    let bg = document.createElement("img")
    bg.src = "images/bg.jpg"
    bg.style.position = "absolute"
    bg.style.height = GAME_HEIGHT + "px"
    bg.style.width = GAME_WIDTH + "px"
    this.root.append(bg)

    // Since gameLoop will be called out of context, bind it once here.
    this.gameLoop = this.gameLoop.bind(this)
    this.restGame = this.restGame.bind(this)
    //this.shoot = this.shoot.bind(this)
  }

  

  restGame(){
    
      
      this.enemies.forEach((enemy) => {
        
          enemy.destroy()
          
        
      })
      
      this.enemies = []
      this.score = 0
      this.lastFrame = Date.now()
      count = 0
      level = 0
      this.root.removeChild(document.querySelector("#rest"))
      this.gameLoop()
      songGame.play()
    
  }
  /*
     The game allows for 5 horizontal slots where an enemy can be present.
     At any point in time there can be at most MAX_ENEMIES enemies otherwise the game would be impossible
     */
  setupEnemies() {
    if (!this.enemies) {
      this.enemies = []
    }

    while (
      this.enemies.filter(function() {
        return true
      }).length < MAX_ENEMIES
    ) {
      this.addEnemy()
    }
  }

  setupCoins() {
    if (!coins) {
      coins = []
    }

    while (
      coins.filter(function() {
        return true
      }).length < MAX_COINS
    ) {
      this.addCoin()
    }
  }

  



  // This method finds a random spot where there is no enemy, and puts one in there

  addEnemy() {
    let enemySpots = GAME_WIDTH / ENEMY_WIDTH

    let enemySpot = undefined
    // Keep looping until we find a free enemy spot at random
    while (enemySpot === undefined || this.enemies[enemySpot]) {
      
      enemySpot = Math.floor(Math.random() * enemySpots)
      
    }

    this.enemies[enemySpot] = new Enemy(this.root, enemySpot * ENEMY_WIDTH)
    
  }

  addCoin() {
    let coinSpots = GAME_WIDTH / COIN_WIDTH

    let coinSpot = undefined
    // Keep looping until we find a free enemy spot at random
    while (coinSpot === undefined || coins[coinSpot]) {
      
      coinSpot = Math.floor(Math.random() * coinSpots)
      
    }

    coins[coinSpot] = new Coin(this.root, coinSpot * COIN_WIDTH)
    
  }

  // This method kicks off the game
  start() {
    
    
    songGame.play()
    songGame.volume = 0.3;
    this.score = 0
    this.lastFrame = Date.now()
    let keydownHandler = function(e) {
      if (e.keyCode === LEFT_ARROW_CODE) {
        this.player.move(MOVE_LEFT)
      } else if (e.keyCode === RIGHT_ARROW_CODE) {
        this.player.move(MOVE_RIGHT)
      }else if (e.keyCode === UP_ARROW_CODE) {
        this.player.move(MOVE_UP)
      } else if (e.keyCode === DOWN_ARROW_CODE) {
          console.log(this.player.move(MOVE_DOWN))
        this.player.move(MOVE_DOWN)
      }else if(e.keyCode === 32){
        this.player.shoot()
        
      }
    }
    keydownHandler = keydownHandler.bind(this)
    // Listen for keyboard left/right and update the player
    document.addEventListener("keydown", keydownHandler)

    this.gameLoop()
  }

  gameLoop() {
    // Check how long it's been since last frame
    let currentFrame = Date.now()
    let timeDiff = currentFrame - this.lastFrame

    // Increase the score!
    this.score += timeDiff

    // Call update on all enemies
    this.enemies.forEach(function(enemy) {
      enemy.update(timeDiff)
    
    })
    // Call update on all coins
    coins.forEach(function(coin) {
      coin.update(timeDiff)
    
    })

    fires.forEach(function(fire) {
      fire.update(timeDiff)
    
    })

    // Draw everything!
    //this.ctx.drawImage(images["stars.png"], 0, 0); // draw the star bg
    let renderEnemy = function(enemy) {
      enemy.render(this.ctx)
    }
    renderEnemy = renderEnemy.bind(this)
    this.enemies.forEach(renderEnemy) // draw the enemies

    let renderCoin = function(coin) {
      coin.render(this.ctx)
    }
    renderCoin = renderCoin.bind(this)
    coins.forEach(renderCoin) // draw the enemies

    let renderFire = function(fire) {
      fire.render(this.ctx)
    }
    renderFire =renderFire.bind(this)
    fires.forEach(renderEnemy) // draw the enemies


    this.player.render(this.ctx) // draw the player
  
    // Check if any enemies should die
    this.enemies.forEach((enemy, enemyIdx) => {
      if (enemy.y > GAME_HEIGHT) {
        this.enemies[enemyIdx].destroy()
        delete this.enemies[enemyIdx]
      }
    })
    this.setupEnemies()
// Check if any coins should die
    coins.forEach((coin, coinIdx) => {
      if (coin.y > GAME_HEIGHT) {
        coins[coinIdx].destroy()
        delete coins[coinIdx]
      }
    })
    this.setupCoins()
     // Check if any fires should die
     fires.forEach((fire, fireIdx) => {
      
      if (fire.y > GAME_HEIGHT) {
        fires[fireIdx].destroy()
        delete fires[fireIdx]
      }
    })
    this.isEnemyKilled()
    this.isCoinWin()

    // Check if player is dead
    //console.log(this.isPlayerDead())
    if (this.isPlayerDead()) {
        songGame.pause()
        let restart = document.createElement('button')
        restart.id="rest"
        restart.innerText = "Restart"
       
        restart.style.width = "109px"
        restart.style.height = "109px"
        restart.style.position = "absolute"
        restart.style.top = "250px"
        restart.style.left = "320px"
        restart.style.borderRadius = "50%"
        restart.style.backgroundColor = "green"
        restart.style.fontSize = "xx-large"
        this.root.appendChild(restart)
        restart.addEventListener('click',this.restGame)
        
        let haha = new Audio("laugh.wav");
        haha.play()
        //console.log(this.root)
       
        // If they are dead, then it's game over!
        this.info.update(this.score + " GAME OVER")
        
        

    } else {
      // If player is not dead, then draw the score
      this.info.update(this.score)

      // Set the time marker and redraw
      this.lastFrame = Date.now()
      setTimeout(this.gameLoop, 20)
    }
  }

  isPlayerDead() {
    // TODO: fix this function!
    let playerdead = false
    this.enemies.forEach((enemy) =>{
      if(enemy.y <= this.player.y + 90 && enemy.y >= this.player.y - 90 && enemy.x === this.player.x){
        playerdead = true
      }
      
    })
    
    return playerdead
  }

  isCoinWin() {
    // TODO: fix this function!
   
    coins.forEach((coin, coinIdx) =>{
      if(coin.y >= this.player.y - 35 && coin.y <= this.player.y + 85 && coin.x >= this.player.x - 20 && coin.x <= this.player.x + 50){
        
        let winSound = new Audio("win.mp3")
        winSound.play()
        coins[coinIdx].destroy()
        delete coins[coinIdx]
        count ++
        if(count === 10){
          level ++
        }
        if(count === 20){
          level ++
        }
       
        h2.innerText =count+" Coins / level: " + level
        maindiv.appendChild(h2)
      }
      
    })
    
  }


  isEnemyKilled() {
    // TODO: fix this function!
    let enemyKilled = false
    fires.forEach((fire, fireIdx) =>{
      this.enemies.forEach((enemy, enmIdx) =>{
        if(fire.y <= enemy.y + 90 && fire.y >= enemy.y - 90 && fire.x === enemy.x){
          //let d= document.querySelector('body')
          let aw = new Audio("awww.wav");
          aw.play()
          enemyKilled = true
          fires[fireIdx].destroy()
          delete fires[fireIdx]
          this.enemies[enmIdx].destroy()
        delete this.enemies[enmIdx]
        }
      })
    })
   return enemyKilled
  }

 
  
}

let body = document.querySelector('body')
let begin = document.createElement("img")
begin.src = "images/begin.jpg"
begin.style.width = "700px"
begin.style.height = "600px"
begin.style.zIndex = -1
body.appendChild(begin)





let buttonStart = document.createElement('button')
buttonStart.innerText = "Start!"
//buttonStart.width = ""
buttonStart.style.width = "100px"
buttonStart.style.height = "100px"
buttonStart.style.position = "absolute"
buttonStart.style.top = "250px"
buttonStart.style.left = "320px"
buttonStart.style.borderRadius = "50%"
buttonStart.style.backgroundColor = "green"
buttonStart.style.fontSize = "xx-large"


// let gameEngine = new Engine(document.getElementById("app"))
// gameEngine.start()

body.appendChild(buttonStart)

buttonStart.addEventListener('click',function(){
  let gameEngine = new Engine(document.getElementById("app"))
  gameEngine.start()
  body.removeChild(buttonStart)
  
})


