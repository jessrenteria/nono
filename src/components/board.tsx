import React from 'react';

import { Box, Spacer, Text, useInput } from 'ink';
import Gradient from 'ink-gradient';

import { type PuzzleData } from '@/puzzle-data';

export type CellState =
  | 'empty'
  | 'crossed'
  | 'filled';

// The top left corner is (0, 0).
export type Point = {
  row: number;
  column: number;
};

export function getEmptyBoard(rows: number, columns: number): CellState[][] {
  return Array.from({ length: rows }, () => Array(columns).fill('empty'));
}

const focusTextColor = '#e486ae';
const focusBgColor = '#77a3d3';

export type BoardProps = {
  // An m x n nonogram puzzle.
  puzzle: PuzzleData;
  // An m x n tensor of the current cell states.
  board: CellState[][];
  // Focused cell.
  focus: Point;
  // Whether or not the board has been solved.
  isSolved: boolean;
};

export default function Board({ puzzle, board, focus, isSolved }: BoardProps) {
  const numRows = puzzle.numRows;
  const numColumns = puzzle.numColumns;

  const formatCellState = (state: CellState) => {
    switch (state) {
      case 'empty': return '  ';
      case 'crossed': return isSolved ? '  ' : '╳╳';
      case 'filled': return '██';
    }
  };

  const createDataRow = (left: string, rowIndex: number, junction: string,
    junction5: string, right: string) => {
    const states = board[rowIndex]!;
    let id = 0;
    let row = [<Text key={id++}>{left}</Text>];
    for (let c = 0; c < states.length; ++c) {
      let shouldHighlight = !isSolved && rowIndex === focus.row
        && c === focus.column;
      let backgroundColor = (shouldHighlight && states[c]! == 'empty')
        ? focusBgColor : '';
      row.push(
        <Text
          key={id++}
          backgroundColor={backgroundColor}
          color={shouldHighlight ? focusTextColor : undefined}>
          {formatCellState(states[c]!)}
        </Text>);
      if (c === states.length - 1) continue;
      row.push(
        <Text key={id++}>{(c + 1) % 5 === 0 ? junction5 : junction}</Text>);
    }
    row.push(<Text key={id++}>{right}</Text>);
    return <Text>{row}</Text>;
  }

  const createNonDataRow = (left: string, inner: string, junction: string,
    junction5: string, right: string) => {
    let row = [left];
    for (let i = 0; i < numColumns; ++i) {
      row.push(inner);
      if (i === numColumns - 1) continue;
      row.push((i + 1) % 5 === 0 ? junction5 : junction);
    }
    row.push(right);
    return row.join('');
  }

  let textRows = [];
  textRows.push(createNonDataRow('┏', '━━', '┯', '┳', '┓'));
  for (let i = 0; i < numRows; ++i) {
    textRows.push(createDataRow('┃', i, '│', '┃', '┃'));
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
      {isSolved
        ? <Gradient name="teen">
          {textRows.map((row, index) => <Text key={index}>{row}</Text>)}
        </Gradient>
        : textRows.map((row, index) => <Text key={index}>{row}</Text>)
      }
    </Box>
  );
}
