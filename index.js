// ! TODO - need to troubleshoot the comments in red
// ! TODO - finish writing endGame function to reset everything and return score on alienIvasion 
// ! TODO - create function to deal 
// ! TODO - create bombHit function for collision detection of bomb and cannon 
// ! TODO - create laserStrike function to detect when laser strike on alien 


const elements = {
  startBtn: document.querySelector('#startBtn'),
  currentLivesDisplay: document.querySelector('#currentLivesDisplay'),
  currentScoreDisplay: document.querySelector('#currentScoreDisplay'),
}

// ? Grid where all the cells go
const grid = document.querySelector('.grid')
// ? Width of my row (number of cells in one row)
const width = 7
// ? Create an array of all my cells
const cells = []

// ? Global variables 
let lives = 3 
let score = 0 
let cannonPosition = 45
const currentLaserIndex = 0
let alienPosition  = 0
let direction = 1
let alienArmyId = 0 
let laserId = 0 
// let bombDropId  
// ? Added this to store the values of the shot down aliens so they won't be added again in the alienArmyId time
// ? interval 

// ? Loop width ** 2 times, creating a cell each time.
for (let index = 0; index < width ** 2; index++) {
  const div = document.createElement('div')
  grid.appendChild(div)
  div.innerHTML = index
  // ? Adding dynamically sized grids
  div.style.width = `${100 / width}%`
  div.style.height = `${100 / width}%`
  // ? push all cells to this new array of cells
  cells.push(div)
}

// ? Adding the laserCannon into the final row on tile 45 
cells[cannonPosition].classList.add('laserCannon')

// ? ADD FUNCTION FOR COLLISION DETECTION HERE TO BE USED IN MAIN SET INTERVAL 

// ? Add click event to the start button 
elements.startBtn.addEventListener('click', () => {
// ? Preventing multiple set intervals  
  if (alienArmyId !== 0) {
    return
  }
})

// ?? AI MOVEMENT
// ? Array of alien invaders
let alienArmy = [
  0, 1, 2, 3, 4,
  7, 8, 9, 10, 11,
  14, 15, 16, 17, 18
]
// ? Add array of aliens to the grid 
alienArmy.forEach(alien => {
  cells[alien].classList.add('alien')
})
alienArmyId = setInterval(() => {
  dropBomb()
  // ? Wall detection and alien formation movement
  const leftWall = alienArmy[0] % width === 0 
  const rightWall = alienArmy[alienArmy.length - 1] % width === width - 1
  
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
    const alienInvasion = alienArmy.some(alienId => alienId > 42) 
    if (alienInvasion) {
      clearInterval(alienArmyId)
    }
    // ? As above - removes alien from current position, moves back or forward one cell
    // ? and updates new position with alien
    // ? Deals with normal movement, i.e when moving R to L, or L to R
  } else { 
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      // console.log(cells[alienArmy[i]])
      cells[alienArmy[i]].classList.remove('alien')
    }
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      alienArmy[i] += direction
    }
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      cells[alienArmy[i]].classList.add('alien')
    }
  }
  
}, 1000)

// ? PLAYER CONTROLS

// ? CANNON MOVEMENT
document.addEventListener('keydown', (event) => {
  // ? Get the keyboard character typed from event.key
  const key = event.key

  // ? Moves cannon left -- but only if it's not on the left column! 
  if (key === 'a' && !(cannonPosition % width === 0)) {
    cells[cannonPosition].classList.remove('laserCannon')
    cannonPosition -= 1
    cells[cannonPosition].classList.add('laserCannon')
  // ? 'd' moves cannon right -- but only if it's not on the right column!
  } else if (key === 'd' && !(cannonPosition % width === width - 1)) {
    cells[cannonPosition].classList.remove('laserCannon')
    cannonPosition += 1
    cells[cannonPosition].classList.add('laserCannon')
  } else if (key === 'w') {
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
    cannonStrike()
    cells[randomBombDropIndex].classList.remove('bomb')
    if (randomBombDropIndex > cells.length - width) {
      clearInterval(bombDropId)
      return 
    }
    randomBombDropIndex += width 
    cells[randomBombDropIndex].classList.add('bomb')
  }, 500)
}

// ? Function that deals with what to do when cannon has been hit by bomb
function cannonStrike() {
  if (cells[cannonPosition].classList.contains('bomb')) {
    cells[cannonPosition].classList.remove('laserCannon')
    cells[cannonPosition].classList.remove('bomb')
    lives -= 1
    cannonPosition = 45
    cells[cannonPosition].classList.add('laserCannon')
    elements.currentLivesDisplay.innerHTML = (`${lives}`)
    if (lives === 0) {
      gameOver()
    } 
  }
}
   
// ? LASER FIRE INTERVAL
// ? Function which is INVOKED BY PRESSING 'W' key above
// ? tracks the laser from point of firing (cannon current Index) through to IMPACT or 
// ? END OF GRID 

// ? Set isShooting to false so that we can change it later once the function is invoked
let isShooting = false

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
        cells[currentLaserIndex].classList.remove('laser')
        cells[currentLaserIndex].classList.remove('alien')
        score += 20
        elements.currentScoreDisplay.innerHTML = (`${score}`)
        alienArmy = alienArmy.filter((alien) => {
          return alien !== currentLaserIndex
        })
        console.log(alienArmy)
        clearInterval(laserId)
        // ? when alien has been hit, the shot is over, 
        isShooting = false
      } 
    }, 300)
  }
}
   
// // ? Also needs to update score with 20 points
// score += 20
// elements.currentLivesDisplay.innerHTML = score 
  
// ? Function that resets the game if all lives lost
function gameOver() {
  lives = 3 
  score = 0
  cannonPosition = 45
  cells[cannonPosition].classList.add('laserCannon')
  alienPosition = 0
  alienArmyId = 0 
  clearInterval(alienArmyId)
  alert( `GAME OVER! Final score ${score}`)
}