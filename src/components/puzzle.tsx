import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Spacer, Text, useInput } from 'ink';
import Gradient from 'ink-gradient';
import { useImmer } from 'use-immer';

import { type CellState, type Model, type Puzzle } from '@/model';

const focusTextColor = '#e486ae';
const focusBgColor = '#77a3d3';

// State for efficiently checking completion status.
type SolutionState = {
  // The total number of fills in the solution.
  solutionFills: number,
  // The number of true fills by the user (filled in the current board state and
  // the solution).
  trueFills: number,
  // The number of false fills by the user (filled in the current board state
  // but not the solution).
  falseFills: number,
};

type Props = {
  puzzle: Puzzle;
};

export default function Puzzle({ puzzle }: Props) {
  const navigate = useNavigate();
  const [model, updateModel] = useImmer<Model>(initModel(puzzle));
  const [solutionState, updateSolutionState] =
    useImmer<SolutionState>(initSolutionState(puzzle));

  const getFocusState = () => {
    return model.board[model.focus.row]![model.focus.column]!;
  };

  const getFocusSolution = () => {
    return model.puzzle.solution[model.focus.row]![model.focus.column]!;
  };

  const isSolved = solutionState.falseFills === 0 &&
    solutionState.trueFills === solutionState.solutionFills;

  useInput((input, key) => {
    if (key.return) {
      navigate('/');
      return;
    }

    // Short-circuit to prevent further input.
    if (isSolved) return;

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
      return;
    }
    if (key.downArrow || input === 'j') {
      updateModel((model) => {
        model.focus.row =
          wrappedIncrement(model.focus.row, model.puzzle.numRows);
      });
      return;
    }
    if (key.upArrow || input === 'k') {
      updateModel((model) => {
        model.focus.row =
          wrappedDecrement(model.focus.row, model.puzzle.numRows);
      });
      return;
    }
    if (key.rightArrow || input === 'l') {
      updateModel((model) => {
        model.focus.column =
          wrappedIncrement(model.focus.column, model.puzzle.numColumns);
      });
      return;
    }

    // Fill.
    if (input === 'f') {
      updateModel((model) => {
        const currentState = getFocusState();
        if (currentState === 'filled') {
          model.board[model.focus.row]![model.focus.column]! = 'empty';
          if (getFocusSolution()) {
            updateSolutionState((solutionState) => {
              --solutionState.trueFills;
            });
          } else {
            updateSolutionState((solutionState) => {
              --solutionState.falseFills;
            });
          }
          return;
        }
        model.board[model.focus.row]![model.focus.column]! = 'filled';
        if (getFocusSolution()) {
          updateSolutionState((solutionState) => {
            ++solutionState.trueFills;
          });
        } else {
          updateSolutionState((solutionState) => {
            ++solutionState.falseFills;
          });
        }
      });
      return;
    }

    // Cross.
    if (input === 'c') {
      updateModel((model) => {
        const currentState = getFocusState();
        if (currentState === 'crossed') {
          model.board[model.focus.row]![model.focus.column]! = 'empty';
          return;
        }
        model.board[model.focus.row]![model.focus.column]! = 'crossed';
        if (currentState === 'filled') {
          if (getFocusSolution()) {
            updateSolutionState((solutionState) => {
              --solutionState.trueFills;
            });
          } else {
            updateSolutionState((solutionState) => {
              --solutionState.falseFills;
            });
          }
        }
      });
      return;
    }

    // Clear.
    if (input === 's') {
      updateModel((model) => {
        model.board[model.focus.row]![model.focus.column]! = 'empty';
        const currentState = getFocusState();
        if (currentState === 'filled') {
          if (getFocusSolution()) {
            updateSolutionState((solutionState) => {
              --solutionState.trueFills;
            });
          } else {
            updateSolutionState((solutionState) => {
              --solutionState.falseFills;
            });
          }
        }
      });
      return;
    }
  });

  const ColumnConstraints = (constraints: number[], column: number) => {
    const shouldHighlight = !isSolved && column === model.focus.column;
    return (
      <Box width={3} flexDirection="column" alignItems="flex-end" key={column}>
        {constraints.map(
          (constraint, index) =>
            <Text
              key={index}
              color={shouldHighlight ? focusTextColor : undefined}
              bold={shouldHighlight}>
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
    const shouldHighlight = !isSolved && row === model.focus.row;
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
              color={shouldHighlight ? focusTextColor : undefined}
              bold={shouldHighlight}>
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
        case 'crossed': return isSolved ? '  ' : '╳╳';
        case 'filled': return '██';
      }
    };

    const createDataRow = (left: string, rowIndex: number, junction: string,
      junction5: string, right: string) => {
      const states = model.board[rowIndex]!;
      let id = 0;
      let row = [<Text key={id++}>{left}</Text>];
      for (let c = 0; c < states.length; ++c) {
        let shouldHighlight = !isSolved && rowIndex === model.focus.row
          && c === model.focus.column;
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

  const InfoSection = () => {
    return (
      <Box gap={1} borderStyle='round'>
        <Text>{model.puzzle.numRows} x {model.puzzle.numColumns}</Text>
        <Text>({model.puzzle.type})</Text>
        <Spacer />
        {isSolved && <Gradient name="teen"><Text>C L E A R !</Text></Gradient>}
        <Spacer />
        <Text>&lt;F&gt; to fill, &lt;C&gt; to cross, &lt;S&gt; to clear,</Text>
        <Text>&lt;Enter&gt; for main menu</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box>
        {SpacerSection()}
        {ColumnConstraintSection()}
      </Box>
      <Box>
        {RowConstraintSection()}
        {isSolved
          ? <Gradient name="teen">{BoardSection()}</Gradient>
          : BoardSection()
        }
      </Box>
      {InfoSection()}
    </Box>
  );
}

function countFills(solution: boolean[][]) {
  return solution.reduce(
    (acc, row) =>
      acc + row.reduce((acc, cell) => acc + (cell ? 1 : 0), 0),
    0);
}

function initSolutionState(puzzle: Puzzle) {
  return {
    solutionFills: countFills(puzzle.solution),
    trueFills: 0,
    falseFills: 0,
  };
}

function initModel(puzzle: Puzzle): Model {
  return {
    puzzle: puzzle,
    board: getEmptyBoard(puzzle.numRows, puzzle.numColumns),
    focus: { row: 0, column: 0 },
  };
}

function getEmptyBoard(rows: number, columns: number): CellState[][] {
  return Array.from({ length: rows }, () => Array(columns).fill('empty'));
}
