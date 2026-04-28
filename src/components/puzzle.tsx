import React from 'react';

import { Box, Spacer, Text, useInput } from 'ink';
import Gradient from 'ink-gradient';
import { useImmer } from 'use-immer';
import { useNavigate } from 'react-router';
import { useStopwatch } from 'react-timer-hook';

import Board, {
  getEmptyBoard,
  type BoardProps,
  type CellState,
  type Point,
} from '@/components/board';
import { type PuzzleData } from '@/puzzle-data';

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
  puzzle: PuzzleData;
  onNewPuzzle: () => void;
};

export default function PuzzleData({ puzzle, onNewPuzzle }: Props) {
  const navigate = useNavigate();
  const [boardProps, updateBoardProps] = useImmer<BoardProps>(initBoardProps(puzzle));
  const [solutionState, updateSolutionState] =
    useImmer<SolutionState>(initSolutionState(puzzle));
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });

  const getFocusState = () => {
    return boardProps.board[boardProps.focus.row]![boardProps.focus.column]!;
  };

  const getFocusSolution = () => {
    return boardProps.puzzle.solution[boardProps.focus.row]![boardProps.focus.column]!;
  };

  // Find a cleaner way of handling isSolved toggle-triggered updates.
  // This should ideally just update the boardProps in the same pass.
  const isSolved = solutionState.falseFills === 0 &&
    solutionState.trueFills === solutionState.solutionFills;

  if (isSolved && isRunning) {
    pause();
  }

  if (isSolved && !boardProps.isSolved) {
    updateBoardProps((boardProps) => { boardProps.isSolved = true; });
  }

  useInput((input, key) => {
    if (key.return) {
      navigate('/');
      return;
    }

    if (isSolved) {
      if (input === 'n') onNewPuzzle();
      return;
    }

    const wrappedIncrement = (current: number, length: number) => {
      return (current + 1) % length;
    };

    const wrappedDecrement = (current: number, length: number) => {
      return (current + length - 1) % length;
    };

    if (key.leftArrow || input === 'h') {
      updateBoardProps((boardProps) => {
        boardProps.focus.column =
          wrappedDecrement(boardProps.focus.column, boardProps.puzzle.numColumns);
      });
      return;
    }
    if (key.downArrow || input === 'j') {
      updateBoardProps((boardProps) => {
        boardProps.focus.row =
          wrappedIncrement(boardProps.focus.row, boardProps.puzzle.numRows);
      });
      return;
    }
    if (key.upArrow || input === 'k') {
      updateBoardProps((boardProps) => {
        boardProps.focus.row =
          wrappedDecrement(boardProps.focus.row, boardProps.puzzle.numRows);
      });
      return;
    }
    if (key.rightArrow || input === 'l') {
      updateBoardProps((boardProps) => {
        boardProps.focus.column =
          wrappedIncrement(boardProps.focus.column, boardProps.puzzle.numColumns);
      });
      return;
    }

    // Fill.
    if (input === 'f') {
      updateBoardProps((boardProps) => {
        const currentState = getFocusState();
        if (currentState === 'filled') {
          boardProps.board[boardProps.focus.row]![boardProps.focus.column]! = 'empty';
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
        boardProps.board[boardProps.focus.row]![boardProps.focus.column]! = 'filled';
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
      updateBoardProps((boardProps) => {
        const currentState = getFocusState();
        if (currentState === 'crossed') {
          boardProps.board[boardProps.focus.row]![boardProps.focus.column]! = 'empty';
          return;
        }
        boardProps.board[boardProps.focus.row]![boardProps.focus.column]! = 'crossed';
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
      updateBoardProps((boardProps) => {
        const currentState = getFocusState();
        boardProps.board[boardProps.focus.row]![boardProps.focus.column]! = 'empty';
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
    const shouldHighlight = !isSolved && column === boardProps.focus.column;
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
        {boardProps.puzzle.columnConstraints.map(ColumnConstraints)}
      </Box>
    );
  };

  const RowConstraints = (constraints: number[], row: number) => {
    const shouldHighlight = !isSolved && row === boardProps.focus.row;
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
        {boardProps.puzzle.rowConstraints.map(RowConstraints)}
      </Box>
    );
  };

  const BoardSection = () => {
    const numRows = boardProps.puzzle.numRows;
    const numColumns = boardProps.puzzle.numColumns;

    const formatCellState = (state: CellState) => {
      switch (state) {
        case 'empty': return '  ';
        case 'crossed': return isSolved ? '  ' : '╳╳';
        case 'filled': return '██';
      }
    };

    const createDataRow = (left: string, rowIndex: number, junction: string,
      junction5: string, right: string) => {
      const states = boardProps.board[rowIndex]!;
      let id = 0;
      let row = [<Text key={id++}>{left}</Text>];
      for (let c = 0; c < states.length; ++c) {
        let shouldHighlight = !isSolved && rowIndex === boardProps.focus.row
          && c === boardProps.focus.column;
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
    const rowConstraints = boardProps.puzzle.rowConstraints;
    const columnConstraints = boardProps.puzzle.columnConstraints;

    const width = Math.max(...rowConstraints.map(
      row => row.length - 1 + row.reduce(
        (acc, constraint) => acc + constraint.toString().length, 0)));
    const height = Math.max(...columnConstraints.map(column => column.length));

    return <Box width={width} height={height} />
  }

  const Controls = () => {
    if (isSolved) {
      return (
        <>
          <Text>&lt;N&gt; to refresh board</Text>
          <Text>&lt;Enter&gt; for main menu</Text>
        </>
      );
    }

    return (
      <>
        <Text>&lt;F&gt; to fill</Text>
        <Text>&lt;C&gt; to cross</Text>
        <Text>&lt;S&gt; to clear</Text>
        <Text>&lt;Enter&gt; for main menu</Text>
      </>
    );
  }

  const InfoSection = () => {
    return (
      <Box gap={1} borderStyle='round'>
        <Text>{boardProps.puzzle.numRows} x {boardProps.puzzle.numColumns}</Text>
        <Text>({boardProps.puzzle.type})</Text>
        <Text>{formatTime(hours, minutes, seconds)}</Text>
        <Spacer />
        {isSolved && <Gradient name="teen"><Text>C L E A R !</Text></Gradient>}
        <Spacer />
        {Controls()}
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
        <Board {...boardProps} />
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

function initSolutionState(puzzle: PuzzleData) {
  return {
    solutionFills: countFills(puzzle.solution),
    trueFills: 0,
    falseFills: 0,
  };
}

// Initialize empty BoardProps for the given puzzle.
function initBoardProps(puzzle: PuzzleData): BoardProps {
  return {
    puzzle: puzzle,
    board: getEmptyBoard(puzzle.numRows, puzzle.numColumns),
    focus: { row: 0, column: 0 },
    isSolved: false,
  };
}

function padTo2(n: number) {
  let s = n.toString();
  return s.length == 1 ? '0' + s : s;
}

function formatTime(hours: number, minutes: number, seconds: number): string {
  return padTo2(hours) + ':' + padTo2(minutes) + ':' + padTo2(seconds);
}
