class MazeGenerator {

  public static maze() {
    return new Maze([
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0],
      [1, 0, 1, 1, 1],
      [1, 0, 0, 1, 0],
      [1, 1, 0, 1, 1]
    ], { x: 0, y: 1 }, { x: 4, y: 2 })
  }


}