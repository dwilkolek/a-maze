class MazeGenerator {

  private static _instance: MazeGenerator;

  private constructor() { }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new MazeGenerator();
    }
    return this._instance
  }

  public generate(size: { x: number, y: number }) {
    var x = size.x;
    var y = size.y;

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

    var result = this.optimizeWalls(cells);

    return result;
  }

  private optimizeWalls(cells: number[][][]) {
    var horizontalWalls: any[][] = [];

    var prepforVert = [];

    cells.forEach((row, rowI, rows) => {
      var nextRow = rows[rowI + 1];
      horizontalWalls[rowI] = [];
      var lastRowValue = null;
      var rowCache = 0;
      row.forEach((cell, cellI, cells) => {
        if (!nextRow) {
          return;
        }
        var horizontalWall = !!cell[2] || !!nextRow[cellI][0];
        if (lastRowValue === horizontalWall || lastRowValue === null) {
          if (lastRowValue == null) {
            lastRowValue = horizontalWall;
          }
          rowCache++;
        } else {
          horizontalWalls[rowI].push({ wall: lastRowValue, count: rowCache });
          lastRowValue = horizontalWall;
          rowCache = 1;
        }

      })
      if (rowCache > 0) {
        horizontalWalls[rowI].push({ wall: lastRowValue, count: rowCache });
      }
    });


    var verticalWallsTmp = [];
    for (var i = 0; i < cells.length; i++) {
      verticalWallsTmp[i] = [];
    }


    verticalWallsTmp = cells.map((row, rowI, rows) => {
      return row.map((cell, cellI, cells) => {
        var nextCell = cells[cellI + 1];
        var verticalWall = !!cell[1] || (nextCell ? !!nextCell[3] : false);
        return verticalWall
      })
    })

    var cols = []

    for (var r = 0; r < verticalWallsTmp.length; r++) {
      for (var c = 0; c < verticalWallsTmp[r].length; c++) {
        var value = verticalWallsTmp[r][c];
        if (!cols[c]) {
          cols[c] = [];
        }
        if (!cols[c][r]) {
          cols[c][r] = [];
        }
        cols[c][r] = value
      }
    }

    var verticalWalls = cols.map((col, colI, colA) => {
      var lastValue = null;
      var count = 0;
      var res = [];
      col.forEach((wall, wallI, wallA) => {
        if (lastValue == null) {
          lastValue = wall;
          count++;
        } else {
          if (wall !== lastValue) {
            res.push({ wall: lastValue, count: count });
            lastValue = wall;
            count = 1;
          } else {
            count++;
          }
        }
      })
      if (count > 0) {
        res.push({ wall: lastValue, count: count });
      }
      return res;
    })

    verticalWalls.pop();


    return { cols: verticalWalls, rows: horizontalWalls };
  }


}
