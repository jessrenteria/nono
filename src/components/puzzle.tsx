import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useInput } from 'ink';
import { useImmer } from 'use-immer';

import { type CellState, type Model } from '@/model';

const focusTextColor = '#e486ae';
const focusBgColor = '#77a3d3';

type Props = {
  initModel: Model;
};

export default function Puzzle({ initModel }: Props) {
  const navigate = useNavigate();
  const [model, updateModel] = useImmer<Model>(initModel);

  useInput((input, key) => {
    const wrappedIncrement = (current: number, length: number) => {
      return (current + 1) % length;
    };

    const wrappedDecrement = (current: number, length: number) => {
      return (current + length - 1) % length;
    };

    if (key.leftArrow || input === 'h') {
      updateModel((model) => {
        model.focus.column =
          wrappedDecrement(model.focus.column, model.puzzle.numColumns);
      });
    }
    if (key.downArrow || input === 'j') {
      updateModel((model) => {
        model.focus.row =
          wrappedIncrement(model.focus.row, model.puzzle.numRows);
      });
    }
    if (key.upArrow || input === 'k') {
      updateModel((model) => {
        model.focus.row =
          wrappedDecrement(model.focus.row, model.puzzle.numRows);
      });
    }
    if (key.rightArrow || input === 'l') {
      updateModel((model) => {
        model.focus.column =
          wrappedIncrement(model.focus.column, model.puzzle.numColumns);
      });
    }
    if (key.return) {
      navigate('/');
    }
  });

  const ColumnConstraints = (constraints: number[], column: number) => {
    const isFocused = column === model.focus.column;
    return (
      <Box width={3} flexDirection="column" alignItems="flex-end" key={column}>
        {constraints.map(
          (constraint, index) =>
            <Text
              key={index}
              color={isFocused ? focusTextColor : ''}
              bold={isFocused}>
              {constraint}
            </Text>)}
      </Box>
    );
  };

  const ColumnConstraintSection = () => {
    return (
      <Box flexDirection="row" alignItems="flex-end">
        {model.puzzle.columnConstraints.map(ColumnConstraints)}
      </Box>
    );
  };

  const RowConstraints = (constraints: number[], row: number) => {
    const isFocused = row === model.focus.row;
    return (
      <Box
        height={2}
        gap={1}
        flexDirection="row"
        alignItems="flex-end"
        key={row}>
        {constraints.map(
          (constraint, index) =>
            <Text
              key={index}
              color={isFocused ? focusTextColor : ''}
              bold={isFocused}>
              {constraint}
            </Text>)}
      </Box>
    );
  };

  const RowConstraintSection = () => {
    return (
      <Box flexDirection="column" alignItems="flex-end">
        {model.puzzle.rowConstraints.map(RowConstraints)}
      </Box>
    );
  };

  const BoardSection = () => {
    const numRows = model.puzzle.numRows;
    const numColumns = model.puzzle.numColumns;

    const formatCellState = (state: CellState) => {
      switch (state) {
        case 'empty': return '  ';
        case 'crossed': return '╳╳';
        case 'filled': return '██';
      }
    };

    const createDataRow = (left: string, rowIndex: number, junction: string,
      junction5: string, right: string) => {
      const states = model.board[rowIndex]!;
      let id = 0;
      let row = [<Text key={id++}>{left}</Text>];
      for (let c = 0; c < states.length; ++c) {
        let isFocused = rowIndex === model.focus.row
          && c === model.focus.column;
        let backgroundColor = (isFocused && states[c]! == 'empty')
          ? focusBgColor : '';
        row.push(
          <Text
            key={id++}
            backgroundColor={backgroundColor}
            color={isFocused ? focusTextColor : ''}>
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
        {textRows.map((row, index) => <Text key={index}>{row}</Text>)}
      </Box>
    );
  }

  const SpacerSection = () => {
    const rowConstraints = model.puzzle.rowConstraints;
    const columnConstraints = model.puzzle.columnConstraints;

    const width = Math.max(...rowConstraints.map(
      row => row.length - 1 + row.reduce(
        (acc, constraint) => acc + constraint.toString().length, 0)));
    const height = Math.max(...columnConstraints.map(column => column.length));

    return <Box width={width} height={height} />
  }

  return (
    <Box flexDirection="column">
      <Box>
        {SpacerSection()}
        {ColumnConstraintSection()}
      </Box>
      <Box>
        {RowConstraintSection()}
        {BoardSection()}
      </Box>
    </Box>
  );
}
