import { type PuzzleData } from '@/puzzle-data';

export function genPuzzle(rows: number, columns: number): PuzzleData {
  const solution = genSolution(rows, columns);
  return {
    solution: solution,
    numRows: rows,
    numColumns: columns,
    rowConstraints: getRowConstraints(solution),
    columnConstraints: getColumnConstraints(solution),
    type: 'random',
  };
}

export function getRowConstraints(solution: boolean[][]): number[][] {
  return solution.map(getConstraints);
}

export function getColumnConstraints(solution: boolean[][]): number[][] {
  // TODO: Consider avoiding the transpose while minimizing code duplication
  // by using generators instead of arrays.
  return transposeMatrix(solution).map(getConstraints);
}

// Returns a uniform distribution of {true, false}.
function coinFlip() {
  return Math.random() >= 0.5;
}

function genSolution(numRows: number, numColumns: number): boolean[][] {
  let rows =[];
  for (let r = 0; r < numRows; ++r) {
    let row = [];
    for (let c = 0; c < numColumns; ++c) {
      row.push(coinFlip());
    }
    rows.push(row);
  }
  return rows;
}

function getConstraints(line: boolean[]): number[] {
  let constraints = [];

  let runLength = 0;
  for (let i = 0; i < line.length; ++i) {
    if (line[i]) {
      ++runLength;
      continue;
    }

    if (!line[i] && runLength > 0) {
      constraints.push(runLength);
      runLength = 0;
    }
  }
  if (runLength > 0) constraints.push(runLength);
  if (constraints.length === 0) constraints.push(0);

  return constraints;
}

// Transposes a dense m x n matrix into an n x m matrix.
function transposeMatrix<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0) return [];
  if (matrix[0]!.length === 0) return [];

  const numColumns = matrix.length;
  const numRows = matrix[0]!.length;
  let rows = [];
  for (let r = 0; r < numRows; ++r) {
    let row = [];
    for (let c = 0; c < numColumns; ++c) {
      row.push(matrix[c]![r]!);
    }
    rows.push(row);
  }
  return rows;
}
