// An m x n nonogram puzzle (rows x columns). The top left corner is (0, 0).
export type PuzzleData = {
  // m rows of n columns. False -> empty, true -> filled.
  solution: boolean[][];

  // The following properties are all uniquely defined by `solution`, but are
  // included to memoize their computation.

  // The number of rows === m.
  numRows: number;
  // The number of columns === n.
  numColumns: number;

  // A ragged tensor with m rows of varying length. Constraints are defined
  // left-to-right.
  rowConstraints: number[][];
  // A ragged tensor with n columns of varying length. Constraints are defined
  // top-to-bottom.
  columnConstraints: number[][];

  // Type of puzzle, or more specifically, how it was created.
  type: 'random';
};
