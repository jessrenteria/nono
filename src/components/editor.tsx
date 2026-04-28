import React, { useState } from 'react';

import { Box, Spacer, Text, useInput } from 'ink';
import Gradient from 'ink-gradient';
import { useNavigate } from 'react-router';
import { useImmer } from 'use-immer';

import Board, {
  getEmptyBoard,
  type BoardProps,
  type CellState,
} from '@/components/board';
import { getColumnConstraints, getRowConstraints } from '@/generator/generator';
import { type PuzzleData } from '@/puzzle-data';

type Props = {
  numRows: number,
  numColumns: number,
  onWrite: (puzzle: PuzzleData) => void;
};

export default function PuzzleData({ numRows, numColumns, onWrite }: Props) {
  const navigate = useNavigate();
  const [boardProps, updateBoardProps] =
    useImmer<BoardProps>(initBoardProps(numRows, numColumns));
  const [justWritten, setJustWritten] = useState<boolean>(false);

  const getFocusState = () => {
    return boardProps.board[boardProps.focus.row]![boardProps.focus.column]!;
  };

  useInput((input, key) => {
    if (key.return) {
      navigate('/');
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
          wrappedIncrement(
            boardProps.focus.column, boardProps.puzzle.numColumns);
      });
      return;
    }

    // Fill.
    if (input === 'f') {
      updateBoardProps((boardProps) => {
        const currentState = getFocusState();
        if (currentState === 'filled') {
          boardProps.board[boardProps.focus.row]![boardProps.focus.column]! =
            'empty';
          return;
        }
        boardProps.board[boardProps.focus.row]![boardProps.focus.column]! =
          'filled';
      });
      return;
    }

    // Clear.
    if (input === 's') {
      updateBoardProps((boardProps) => {
        const currentState = getFocusState();
        boardProps.board[boardProps.focus.row]![boardProps.focus.column]! =
          'empty';
      });
      return;
    }

    // Save.
    if (input === 'w') {
      const solution: boolean[][] = getSolutionFromFills(boardProps.board);
      const puzzle: PuzzleData = {
        solution: solution,
        numRows: numRows,
        numColumns: numColumns,
        rowConstraints: getRowConstraints(solution),
        columnConstraints: getColumnConstraints(solution),
        type: 'custom',
      };
      onWrite(puzzle);
      setJustWritten(true);
      updateBoardProps((boardProps) => { boardProps.isSolved = true });
      setTimeout(
        () => {
          setJustWritten(false);
          updateBoardProps((boardProps) => { boardProps.isSolved = false });
        }, 2000);
      return;
    }
  });

  const Controls = () => {
    return (
      <>
        <Text>&lt;F&gt; to fill</Text>
        <Text>&lt;S&gt; to clear</Text>
        <Text>&lt;W&gt; to save</Text>
        <Text>&lt;Enter&gt; for main menu</Text>
      </>
    );
  }

  const InfoSection = () => {
    return (
      <Box gap={1} borderStyle='round'>
        <Text>
          {boardProps.puzzle.numRows} x {boardProps.puzzle.numColumns}
        </Text>
        <Text>({boardProps.puzzle.type})</Text>
        <Spacer />
        {justWritten
          ? <Gradient name="teen"><Text>LEVEL SAVED</Text></Gradient>
          : <Text>LEVEL EDITOR</Text>
        }
        <Spacer />
        {Controls()}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Board {...boardProps} />
      {InfoSection()}
    </Box>
  );
}

function initPuzzleData(numRows: number, numColumns: number): PuzzleData {
  return {
    numRows: numRows,
    numColumns: numColumns,
    solution: Array.from(
      { length: numRows }, () => Array(numColumns).fill(false)),
    rowConstraints: [],
    columnConstraints: [],
    type: 'custom',
  };
}

function initBoardProps(numRows: number, numColumns: number): BoardProps {
  return {
    puzzle: initPuzzleData(numRows, numColumns),
    board: getEmptyBoard(numRows, numColumns),
    focus: { row: 0, column: 0 },
    isSolved: false,
  };
}

function getSolutionFromFills(board: CellState[][]): boolean[][] {
  return board.map(row => row.map(cell => cell === 'filled'));
}
