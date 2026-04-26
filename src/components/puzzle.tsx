import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useInput } from 'ink';

import { type CellState, type Model } from '@/model';

type Props = {
  model?: Model;
};

export default function Puzzle({ model }: Props) {
  const navigate = useNavigate();

  useInput((input, key) => {
    if (key.return) {
      navigate('/');
    }
  });

  const ColumnConstraints = (constraints: number[], index: number) => {
    return (
      <Box width={3} flexDirection="column" alignItems="flex-end" key={index}>
        {constraints.map(
          (constraint, index) => <Text key={index}>{constraint}</Text>)}
      </Box>
    );
  };

  const ColumnConstraintSection = (constraints: number[][]) => {
    return (
      <Box flexDirection="row" alignItems="flex-end">
        {constraints.map(ColumnConstraints)}
      </Box>
    );
  };

  const RowConstraints = (constraints: number[], index: number) => {
    return (
      <Box
        height={2}
        gap={1}
        flexDirection="row"
        alignItems="flex-end"
        key={index}>
        {constraints.map(
          (constraint, index) => <Text key={index}>{constraint}</Text>)}
      </Box>
    );
  };

  const RowConstraintSection = (constraints: number[][]) => {
    return (
      <Box flexDirection="column" alignItems="flex-end">
        {constraints.map(RowConstraints)}
      </Box>
    );
  };

  const BoardSection = (model: Model) => {
    const numRows = model.puzzle.numRows;
    const numColumns = model.puzzle.numColumns;

    const formatCellState = (state: CellState) => {
      switch (state) {
        case 'empty': return '  ';
        case 'crossed': return '❭❬';
        case 'filled': return '██';
      }
    };

    const createRow = (left: string, inners: string[], junction: string,
      junction5: string, right: string) => {
      let row = [left];
      for (let i = 0; i < inners.length; ++i) {
        row.push(inners[i]!);
        if (i === inners.length - 1) continue;
        row.push((i + 1) % 5 === 0 ? junction5 : junction);
      }
      row.push(right);
      return row.join('');
    }

    const createNonDataRow = (left: string, inner: string, junction: string,
      junction5: string, right: string) => {
      return createRow(left, Array(numColumns).fill(inner), junction, junction5,
        right);
    }

    let textRows = [];
    textRows.push(createNonDataRow('┏', '━━', '┯', '┳', '┓'));
    for (let i = 0; i < numRows; ++i) {
      textRows.push(createRow(
        '┃', model.board[i]!.map(formatCellState), '│', '┃', '┃'));
      if (i === numRows - 1) continue;
      if ((i + 1) % 5 === 0) {
        textRows.push(createNonDataRow('┣', '━━', '┿', '╋', '┫'));
      } else {
        textRows.push(createNonDataRow('┠', '──', '┼', '╂', '┨'));
      }
    }
    textRows.push(createNonDataRow('┗', '━━', '┷', '┻', '┛'));

    return (
      <Box flexDirection="column">
        <Text>{textRows.join('\n')}</Text>
      </Box>
    );
  }

  const SpacerSection = (model: Model) => {
    const rowConstraints = model.puzzle.rowConstraints;
    const columnConstraints = model.puzzle.columnConstraints;

    const width = Math.max(...rowConstraints.map(
      row => row.length - 1 + row.reduce(
        (acc, constraint) => acc + constraint.toString().length, 0)));
    const height = Math.max(...columnConstraints.map(column => column.length));

    return <Box width={width} height={height} />
  }

  let mockModel = {
    puzzle: {
      solution: [],
      numRows: 5,
      numColumns: 5,
      rowConstraints: [[1, 2, 3], [4, 5], [6], [7, 8], [9]],
      columnConstraints: [[1, 2, 3], [4, 5], [6], [7, 8], [9]],
    },
    board: [
      ['filled', 'empty', 'empty', 'empty', 'crossed'],
      ['empty', 'filled', 'empty', 'crossed', 'empty'],
      ['empty', 'empty', 'filled', 'empty', 'empty'],
      ['empty', 'crossed', 'empty', 'filled', 'empty'],
      ['crossed', 'empty', 'empty', 'empty', 'filled'],
    ] as CellState[][],
    focus: { row: 0, column: 0 },
  };

  return (
    <Box flexDirection="column">
      <Box>
        {SpacerSection(mockModel)}
        {ColumnConstraintSection(mockModel.puzzle.columnConstraints)}
      </Box>
      <Box>
        {RowConstraintSection(mockModel.puzzle.rowConstraints)}
        {BoardSection(mockModel)}
      </Box>
    </Box>
  );
}
