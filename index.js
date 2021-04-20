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
const lives = 3 
const score = 0 
let cannonPosition = 45
const currentLaserIndex = 0
const alienPosition  = 0
let direction = 1
// let alienArmyId = 0
let laserId 

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
const alienArmy = [
  0, 1, 2, 3, 4,
  7, 8, 9, 10, 11,
  14, 15, 16, 17, 18
]
// ? Add array of aliens to the grid 
alienArmy.forEach(alien => {
  cells[alien].classList.add('alien')
})
const alienArmyId = setInterval(() => {
 

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
    // ! of last row) or greater NOT WORKING BUT HAVE ASKED FOR HELP
    const alienInvasion = alienArmy.some(alienId => alienId > 42) 
    if (alienInvasion) {
      clearInterval(alienArmyId)
    }
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
  
}, 800)

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
    // ? Shoots cannon and then calls shootCannon function which will track laser trajectory
  } else if (key === 'w') {
    shootCannon()
  }
})

// ? LASER FIRE INTERVAL
// ? Function that tracks the laser from point of firing (cannon current Index) through to IMPACT or 
// ? END OF GRID 
function shootCannon() {
  // ? Sets the start index for laser to track through the 
  let currentLaserIndex = cannonPosition
  
  laserId = setInterval(() => {
    if (currentLaserIndex > width) {
      cells[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      cells[currentLaserIndex].classList.add('laser')
    } 
    // ! Collision detection alien and cannon which I'm using in the interim until I fix above 
    if (cells[cannonPosition].classList.contains('alien', 'cannon')) {
      console.log('GAME OVER!')
      clearInterval(alienArmyId)
    } else {
      cells[currentLaserIndex].classList.remove('laser')
      clearInterval(laserId)
    }
  }, 500)
 
}

// // ? Function that resets the game 
// function resetGame () {
//   lives = 3 
//   score = 0
//   cannonPosition = 45
//   alienPosition = 0 
//   intervalId = 0 
//   clearInterval(intervalId)
//   alert(`Final score ${score}`)
// }