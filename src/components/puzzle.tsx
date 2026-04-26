import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useInput } from 'ink';

import { type Model } from '@/model';

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

    const createRow = (left: string, inner: string, junction: string,
      right: string) => {
      return [left, Array(numColumns).fill(inner).join(junction), right]
        .join('');
    }

    let textRows = [];
    textRows.push(createRow('┏', '━━', '┯', '┓'));
    for (let i = 0; i < numRows; ++i) {
      // TODO: Incorporate CellState.
      textRows.push(createRow('┃', '  ', '│', '┃'));
      if (i !== numRows - 1) {
        textRows.push(createRow('┠', '──', '┼', '┨'));
      }
    }
    textRows.push(createRow('┗', '━━', '┷', '┛'));

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
    board: [],
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
