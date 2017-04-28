export interface Maze {
  cols: {wall: boolean, count: number}[][];
  rows: {wall: boolean, count: number}[][];
}