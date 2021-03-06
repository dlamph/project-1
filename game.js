const elements = {
  startBtn: document.querySelector('#startBtn'),
  currentLivesDisplay: document.querySelector('#currentLivesDisplay'),
  currentScoreDisplay: document.querySelector('#currentScoreDisplay'),
  gameDisplay: document.querySelector('#gameDisplay'),
  audioPlayer: document.querySelector('audio'),
}

// ? Grid where all the cells go
const grid = document.querySelector('.grid')
// ? Width of my row (number of cells in one row)
const width = 9
// ? Create an array of all my cells
const cells = []

// ? Global variables 
let lives = 3 
let score = 0 
let cannonPosition = 76
// const currentLaserIndex = 0
// const alienPosition  = 0
let direction = 1
let alienArmyId = 0 
let laserId = 0 
let bombDropArray = [] 
let gamePlaying = false
// ? Set isShooting to false so that we can change it later once the function is invoked
let isShooting = false

// ? Added this to store the values of the shot down aliens so they won't be added again in the alienArmyId time
// ? interval 

// ? Loop width ** 2 times, creating a cell each time.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  // div.innerHTML = index
  // ? Adding dynamically sized grids
  div.style.width = `${100 / width}%`
  div.style.height = `${100 / width}%`
  // ? push all cells to this new array of cells
  cells.push(div)
}

// ? Adding the laserCannon into the final row on tile 45 
cells[cannonPosition].classList.add('laserCannon')

//TO FIGURE OUT HOW TO PREVENT THIS FROM DISPLAYING INSTEAD OF WIN/LOSE FINAL SCORES
// elements.gameDisplay.style.display = 'block'
// elements.gameDisplay.innerHTML = 'Welcome to Space Invaders <br> <br> <br> Use the Arrow Keys to guide your Spaceship <br> <br> and Fire with Space <br> <br> Press Space to Begin!'

// ? Add click event to the start button 
elements.startBtn.addEventListener('click', () => {
  if (resetGame) {
    window.location.reload()
  }
  elements.gameDisplay.style.display = 'none'
  cells.forEach(cell => {
    cell.classList.remove('alien')
    cell.classList.remove('bomb')
    cell.classList.remove('laserCannon')
  })
  gamePlaying = true
  elements.currentLivesDisplay.innerHTML = (`${lives}`)
  elements.currentScoreDisplay.innerHTML = (`${score}`)
  cells[cannonPosition].classList.add('laserCannon')
  console.log(alienArmyId)
  // ? Preventing multiple set intervals  
  if (alienArmyId !== 0) {
    return
  }

  // ?? AI MOVEMENT
  // ? Array of alien invaders
  let alienArmy = [
    0, 1, 2, 3, 4, 5, 6,
    9, 10, 11, 12, 13, 14, 15, 
    18, 19, 20, 21, 22, 23, 24
  ]
  // ? Add array of aliens to the grid 
  alienArmy.forEach(alien => {
    cells[alien].classList.add('alien')
  })
  alienArmyId = setInterval(() => {
    dropBomb()
    // ? Wall detection and alien formation movement
    const leftWall = alienArmy.some(alienId => alienId % width === 0) 
    const rightWall = alienArmy.some(alienId => alienId % width === width - 1)
  
    if ((leftWall && direction === -1) || (rightWall && direction === 1)) {
    
      // ? Needs to move down one row and reverse direction 
      // ? Removes the alien from current position
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        cells[alienArmy[i]].classList.remove('alien')
      } 
      // ? Moves back or forward one index depending on direction 
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        alienArmy[i] += width
      }
      // ? Adds the alien to the updated position
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        cells[alienArmy[i]].classList.add('alien')
      } 
      // ? Performs check on current direction of travel and reverses it
      if (direction === 1) {
        direction = -1
      } else if (direction === -1) {
        direction = 1
      }
      // ! Checking whether alien army have reached the planet level, i.e. on tile 42(first tile) 
      // ! of last row) 
      const alienInvasion = alienArmy.some(alienId => alienId > 71) 
      if (alienInvasion) {
        gameOver()
      }
    // ? As above - removes alien from current position, moves back or forward one cell
    // ? and updates new position with alien
    // ? Deals with normal movement, i.e when moving R to L, or L to R
    } else { 
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        cells[alienArmy[i]].classList.remove('alien')
      }
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        alienArmy[i] += direction
      }
      for (let i = 0; i <= alienArmy.length - 1; i++) {
        cells[alienArmy[i]].classList.add('alien')
      }
    }
  
  }, 800)

  // ? PLAYER CONTROLS

  // ? CANNON MOVEMENT
  document.addEventListener('keydown', (event) => {
  // ? Get the keyboard character typed from event.key
    const key = event.key

    // ? Moves cannon left -- but only if it's not on the left column! 
    if (key === 'ArrowLeft' && !(cannonPosition % width === 0)) {
      cells[cannonPosition].classList.remove('laserCannon')
      cannonPosition -= 1
      cells[cannonPosition].classList.add('laserCannon')
      // ? 'd' moves cannon right -- but only if it's not on the right column!
    } else if (key === 'ArrowRight' && !(cannonPosition % width === width - 1)) {
      cells[cannonPosition].classList.remove('laserCannon')
      cannonPosition += 1
      cells[cannonPosition].classList.add('laserCannon')
    } else if (key === ' ' && gamePlaying === true) {
      // BUG: space bar preventDefault does not work after the game is over as gamePlaying
      // is no longer true
      event.preventDefault()
      elements.audioPlayer.src = './sounds/shoot.wav'
      elements.audioPlayer.volume = 0.30
      elements.audioPlayer.play()
      shootCannon()
    }
  })

  // ? BOMB DROP INTERVAL
  // ? Function that works much like the laser fire, tracks from point of dropping (randomAlienIndex) 
  // ? to edge of grid OR impact with cannon

  function dropBomb() {
  // ? Gets a random index from alienArmy array to initiate bomb drop 
    let randomBombDropIndex = alienArmy[Math.floor(Math.random() * alienArmy.length)]

    const bombDropId = setInterval(() => {
      // ? Invoke the cannonStrike function here to check during the time interval
      cannonStrike(bombDropId)
      if (randomBombDropIndex > cells.length - width) {
        cells[randomBombDropIndex].classList.remove('bomb')
        clearInterval(bombDropId)
        return 
      } 
      cells[randomBombDropIndex].classList.remove('bomb')
      randomBombDropIndex += width 
      cells[randomBombDropIndex].classList.add('bomb')
    }, 800)
    // ? adds bombDropIds to the bombDropArray. Includes all bombs that have been dropped
    bombDropArray.push(bombDropId)
  }

  // ? Function that deals with what to do when cannon has been hit by bomb
  function cannonStrike(bombDropId) {
    if (cells[cannonPosition].classList.contains('bomb')) {
      elements.audioPlayer.src = './sounds/lifeLost.wav'
      elements.audioPlayer.volume = 0.50
      elements.audioPlayer.play()
      cells[cannonPosition].classList.remove('laserCannon')
      cells[cannonPosition].classList.remove('bomb')
      lives -= 1
      cannonPosition = 76
      cells[cannonPosition].classList.add('laserCannon')
      elements.currentLivesDisplay.innerHTML = (`${lives}`)
      if (lives === 0) {
        gameOver()
      } 
      bombDropArray = bombDropArray.filter(bombId => bombId !== bombDropId)
    }
  }
   
  // ? LASER FIRE INTERVAL
  // ? Function which is INVOKED BY PRESSING spacebar
  // ? tracks the laser from point of firing (cannon current Index) through to IMPACT or 
  // ? END OF GRID 

  function shootCannon() {

    if (isShooting === false) {
    // ? When we start shooting then the function runs
      isShooting = true 
  
      // ? Sets the start index for laser to track through the grid 
      let currentLaserIndex = cannonPosition
  
      laserId = setInterval(() => {
        // ? Handles movement of laser whilst still within grid and not colliding with an alien 
        if (currentLaserIndex > width && !cells[currentLaserIndex].classList.contains('alien')) {
          cells[currentLaserIndex].classList.remove('laser')
          currentLaserIndex -= width
          cells[currentLaserIndex].classList.add('laser')
          // ? COLLISION DETECTION
          // ? Below else statement reflects when it has hit an alien, removes image of laser and alien
          // ? then creates a filtered array of the aliens that have been hit and clears interval
        } else {
          elements.audioPlayer.src = './sounds/invaderkilled.wav'
          elements.audioPlayer.volume = 0.50
          elements.audioPlayer.play()
          cells[currentLaserIndex].classList.remove('laser')
          cells[currentLaserIndex].classList.remove('alien')
          score += 20
          elements.currentScoreDisplay.innerHTML = `${score}`
          alienArmy = alienArmy.filter((alien) => {
            return alien !== currentLaserIndex
          })
          // ? Determines whether the player has won by shooting down all aliens
          if (alienArmy.length === 0) {
            elements.audioPlayer.src = './sounds/youWin.wav'
            elements.audioPlayer.volume = 1.0
            elements.audioPlayer.play()
            gameWin()
          }
          clearInterval(laserId)
          // ? when alien has been hit, the shot is over, 
          isShooting = false
        } 
      }, 50)
    }
  }
})  

let resetGame = false

// ? Function that resets the game if player Wins
function  gameWin () {
  resetGame = true
  gamePlaying = false
  clearInterval(laserId)
  clearInterval(alienArmyId)
  bombDropArray.forEach(bombId => clearInterval(bombId))
  elements.gameDisplay.style.display = 'block'
  elements.gameDisplay.innerHTML = `YOU WIN! <br> <br> Final score = ${score} <br> <br> Press START to play again`
}

// ? Function that resets the game if all lives lost, or aliens invade planet (arrive at last row)

function gameOver() {
  elements.audioPlayer.src = './sounds/lifeLost.wav'
  elements.audioPlayer.volume = 0.80
  elements.audioPlayer.play()
  resetGame = true
  gamePlaying = false
  clearInterval(laserId)
  clearInterval(alienArmyId)
  bombDropArray.forEach(bombId => clearInterval(bombId))
  elements.gameDisplay.style.display = 'block'
  elements.gameDisplay.innerHTML = `Game Over! <br> <br> Final Score = ${score} <br> <br> Press start to play again`
}