const images = {}
const sounds = {}
const game = {
  width: 1200,
  height: 800
}
const player = {
  size: 50,
  x: game.width / 2,
  y: game.height - 60, 
  score: 0,
  speed: 6
}
const carModel = {
  width:80,
  length: 90
}
const lanes = [80, 190, 300, 420, 520, 640]
const laneIsOccupied = [false, false, false, false, false, false]
let cars = []

const generateCar = () => {
  const car = {}
  const laneIndex = Math.floor(6*Math.random())
  const isLaneOccupied = laneIsOccupied[laneIndex]
  if(isLaneOccupied) return
  laneIsOccupied[laneIndex] = true
  car.speed = 20 * Math.random() + 3
  car.laneIndex = laneIndex
  car.x = game.width + 1
  car.y = lanes[laneIndex]
  car.image = images[`car${Math.floor(3*Math.random())+1}`]
  cars.push(car)
  return car
}
setInterval( () => {
  generateCar()
}, 50)


const resetPlayerPosition = () => {
  player.x = game.width / 2
  player.y = game.height - 20
}

const movePlayer = () => {
  if(keyIsDown(UP_ARROW)) player.y -= player.speed
  if(keyIsDown(DOWN_ARROW)) player.y += player.speed
  if(keyIsDown(LEFT_ARROW)) player.x -= player.speed
  if(keyIsDown(RIGHT_ARROW)) player.x += player.speed
}

function setup() {
  createCanvas(1200, 800);
  sounds.background.loop()
}

const checkIfReachedEnd = () => {
  if(player.y < 10){
    console.log(player.y)
    player.score++
    sounds.points.play()
    resetPlayerPosition()
  }
    
}

const checkCollision = () => {
  cars.forEach(car => {
    const haveCollided = collideRectRect(car.x, car.y, carModel.length, carModel.width, player.x, player.y, player.size, player.size)
    if(haveCollided){
      player.score = 0
      sounds.collide.play()
      resetPlayerPosition()
    }
  })  
}

const moveCars = () => {
  cars.forEach((car, index) => {
    car.x -= car.speed
    const carIsNoLongerVisible = car.x < -50
    if(carIsNoLongerVisible){
      cars.splice(index, 1)
      laneIsOccupied[car.laneIndex] = false
    }
  })
}

const drawScoreboard = () => {
  fill(255)
  textSize(32)
  textAlign(CENTER)
  text(player.score, game.width - 50, 50)
}
function draw() {
  background(images.road);
  image(images.player, player.x, player.y, player.size, player.size)
  cars.forEach(car => {
    image(car.image, car.x, car.y, carModel.length, carModel.width)
  })
  drawScoreboard()
  movePlayer()
  moveCars()
  checkCollision()
  checkIfReachedEnd()

}

function preload(){
  images.road = loadImage('/images/road.png')
  images.player = loadImage('images/player.png')
  images.car1 = loadImage('/images/car1.png')
  images.car2 = loadImage('/images/car2.png')
  images.car3 = loadImage('/images/car3.png')
  sounds.background = loadSound('./sounds/background.mp3')
  sounds.points = loadSound('./sounds/points.wav')
  sounds.collide = loadSound('./sounds/collide.mp3')

}