class MazeGenerator {

  private static _instance: MazeGenerator;

  private constructor() { }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MazeGenerator();
    }
    return this._instance
  }

  public maze() {

    // return new Maze([
    //   [1, 0, 1, 0, 1],
    //   [1, 0, 1, 0, 0],
    //   [1, 0, 1, 1, 1],
    //   [1, 0, 0, 1, 0],
    //   [1, 1, 0, 1, 1]
    // ], { x: 0, y: 1 }, { x: 4, y: 2 })
  }

  public f(size: {x: number, y: number}) {
    var x = size.x;
    var y = size.y;
    // function newMaze(x, y) {

    // Establish variables and starting grid
    var totalCells = x * y;
    var cells = new Array();
    var unvis = new Array();
    for (var i = 0; i < y; i++) {
      cells[i] = new Array();
      unvis[i] = new Array();
      for (var j = 0; j < x; j++) {
        cells[i][j] = [0, 0, 0, 0];
        unvis[i][j] = true;
      }
    }

    // Set a random position to start from
    var currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    var path = [currentCell];
    unvis[currentCell[0]][currentCell[1]] = false;
    var visited = 1;

    // Loop through all available cell positions
    while (visited < totalCells) {
      // Determine neighboring cells
      var pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
      [currentCell[0], currentCell[1] + 1, 1, 3],
      [currentCell[0] + 1, currentCell[1], 2, 0],
      [currentCell[0], currentCell[1] - 1, 3, 1]];
      var neighbors = new Array();

      // Determine if each neighboring cell is in game grid, and whether it has already been checked
      for (var l = 0; l < 4; l++) {
        if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
      }

      // If at least one active neighboring cell has been found
      if (neighbors.length) {
        // Choose one of the neighbors at random
        var next = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Remove the wall between the current cell and the chosen neighboring cell
        cells[currentCell[0]][currentCell[1]][next[2]] = 1;
        cells[next[0]][next[1]][next[3]] = 1;

        // Mark the neighbor as visited, and set it as the current cell
        unvis[next[0]][next[1]] = false;
        visited++;
        currentCell = [next[0], next[1]];
        path.push(currentCell);
      }
      // Otherwise go back up a step and keep going
      else {
        currentCell = path.pop();
      }
    }
    return cells;
  }
  // }

}





// init = function () {
//   offset = pathWidth / 2 + outerWall
//   map = []
//   canvas = document.querySelector('canvas')
//   ctx = canvas.getContext('2d')
//   canvas.width = outerWall * 2 + width * (pathWidth + wall) - wall
//   canvas.height = outerWall * 2 + height * (pathWidth + wall) - wall
//   ctx.fillStyle = wallColor
//   ctx.fillRect(0, 0, canvas.width, canvas.height)
//   random = randomGen(seed)
//   ctx.strokeStyle = pathColor
//   ctx.lineCap = 'square'
//   ctx.lineWidth = pathWidth
//   ctx.beginPath()
//   for (var i = 0; i < height * 2; i++) {
//     map[i] = []
//     for (var j = 0; j < width * 2; j++) {
//       map[i][j] = false
//     }
//   }
//   map[y * 2][x * 2] = true
//   route = [[x, y]]
//   ctx.moveTo(x * (pathWidth + wall) + offset,
//     y * (pathWidth + wall) + offset)
// }
// init()

// inputWidth = document.getElementById('width')
// inputHeight = document.getElementById('height')
// inputPathWidth = document.getElementById('pathwidth')
// inputWallWidth = document.getElementById('wallwidth')
// inputOuterWidth = document.getElementById('outerwidth')
// inputPathColor = document.getElementById('pathcolor')
// inputWallColor = document.getElementById('wallcolor')
// inputSeed = document.getElementById('seed')
// buttonRandomSeed = document.getElementById('randomseed')

// settings = {
//   display: function () {
//     inputWidth.value = width
//     inputHeight.value = height
//     inputPathWidth.value = pathWidth
//     inputWallWidth.value = wall
//     inputOuterWidth.value = outerWall
//     inputPathColor.value = pathColor
//     inputWallColor.value = wallColor
//     inputSeed.value = seed
//   },
//   check: function () {
//     if (inputWidth.value != width ||
//       inputHeight.value != height ||
//       inputPathWidth.value != pathWidth ||
//       inputWallWidth.value != wall ||
//       inputOuterWidth.value != outerWall ||
//       inputPathColor.value != pathColor ||
//       inputWallColor.value != wallColor ||
//       inputSeed.value != seed) {
//       settings.update()
//     }
//   },
//   update: function () {
//     clearTimeout(timer)
//     width = parseFloat(inputWidth.value)
//     height = parseFloat(inputHeight.value)
//     pathWidth = parseFloat(inputPathWidth.value)
//     wall = parseFloat(inputWallWidth.value)
//     outerWall = parseFloat(inputOuterWidth.value)
//     pathColor = inputPathColor.value
//     wallColor = inputWallColor.value
//     seed = parseFloat(inputSeed.value)
//     x = width / 2 | 0
//     y = height / 2 | 0
//     init()
//     loop()
//   }
// }

// buttonRandomSeed.addEventListener('click', function () {
//   inputSeed.value = Math.random() * 100000 | 0
// })


// settings.display()
// loop()
// setInterval(settings.check, 400)