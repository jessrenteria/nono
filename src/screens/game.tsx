import React from 'react';

import Puzzle from '@/components/puzzle';

import { type CellState } from '@/model';

export default function Game() {
  let mockModel = {
    puzzle: {
      solution: [],
      numRows: 5,
      numColumns: 5,
      rowConstraints: [[1, 2, 3], [4, 5], [6], [7, 8], [9]],
      columnConstraints: [[1, 2, 3], [4, 5], [6], [7, 8], [9]],
    },
    board: [
      ['empty', 'empty', 'empty', 'empty', 'crossed'],
      ['empty', 'filled', 'empty', 'crossed', 'empty'],
      ['empty', 'empty', 'filled', 'empty', 'empty'],
      ['empty', 'crossed', 'empty', 'filled', 'empty'],
      ['crossed', 'empty', 'empty', 'empty', 'filled'],
    ] as CellState[][],
    focus: { row: 0, column: 0 },
  };

  return (
    <Puzzle model={mockModel} />
  );
}
