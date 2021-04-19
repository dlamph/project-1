// ? Grid where all the cells go
const grid = document.querySelector('.grid')
// ? Width of my row (number of cells in one row)
const width = 7
// ? Create an array of all my cells
const cells = []
const start = document.querySelector('#start')
// ? Initial value of laserCannon
let cannonPosition = 45
// // ? Initial value of alien
// let alienPosition  = 0
// ? Initial Score 
const currentLivesDisplay = document.querySelector('#currentLivesDisplay')
// ? Set direction, to determine which way the aliens move
let direction = 1


// ? Global variables 
const lives = 3 
const score = 0 
let intervalId = 0 

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

// // ? Adding the aliens to starting position on tile 0
// cells[alienPosition].classList.add('alien')

// ? ADD FUNCTION FOR COLLISION DETECTION HERE TO BE USED IN MAIN SET INTERVAL 


// ? Add click event to the start button 
start.addEventListener('click', () => {
// ? Preventing multiple set intervals  
  if (intervalId !== 0) {
    return
  }
})

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
intervalId = setInterval(() => {

  const leftWall = alienArmy[0] % width === 0 
  const rightWall = alienArmy[alienArmy.length - 1] % width === width - 1
  // ? Wall detection 
  if ((leftWall && direction === -1) || (rightWall && direction === 1)) {
    // ? Needs to move down one row and reverse direction 
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      console.log(cells[alienArmy[i]])
      cells[alienArmy[i]].classList.remove('alien')
    }
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      alienArmy[i] += width
    }
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      cells[alienArmy[i]].classList.add('alien')
    } 
    if (direction === 1) {
      direction = -1
    } else if (direction === -1) {
      direction = 1
    }
  } else { 
    for (let i = 0; i <= alienArmy.length - 1; i++) {
      console.log(cells[alienArmy[i]])
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



// // ? FUNCTION TO MOVE ALIENS
// intervalId = setInterval(() => {
//   // ! Checking lives
//   if (cells[laserCannon].classList.contains('bomb')) {
//     lives -= 1
//   } if (lives === 0) {
//     // ? If no lives, reset game
//     resetGame()
//     // ? Don't proceed beyond this point
//     return
//   }
// })
// // ! Updating the position of the aliens
// if (aliens % width === 0)
// cells[aliens].classList.remove(aliens)

// ? Moving cannon based on the keystrokes
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
  }
})


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