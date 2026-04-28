import React, { useEffect, useState } from 'react';

import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import { useNavigate, useParams } from 'react-router';
import { useImmer } from 'use-immer';

import levels5x5 from "@/data/levels/5x5.json";

import Puzzle from '@/components/puzzle';
import { type PuzzleData } from '@/puzzle-data';

const focusBgColor = '#77a3d3';

type LevelSelection = {
  rows: number,
  columns: number,
  index: number,
};

export default function Levels() {
  const navigate = useNavigate();
  let params = useParams();

  const [levelSelection, setLevelSelection] = useImmer<LevelSelection>({
    rows: Number(params.rows!),
    columns: Number(params.columns!),
    index: Number(params.index!),
  });
  const [hasFinishedLevels, setHasFinishedLevels] = useState<boolean>(false);

  const puzzle = getPuzzle(levelSelection);

  useEffect(() => {
    if (puzzle === undefined) {
      setTimeout(() => {
        navigate('/');
      }, 5000);
    }
  }, []);

  if (hasFinishedLevels) {
    return <EndOfLevels />;
  }

  const handleNewPuzzle = () => {
    const numPuzzles = getLevelList(levelSelection)!.length;
    if (levelSelection.index === numPuzzles - 1) {
      setHasFinishedLevels(true);
      setTimeout(() => {
        navigate('/');
      }, 5000);
      return;
    }
    setLevelSelection((levelSelection) => { ++levelSelection.index; });
  }

  return puzzle
    ? <Puzzle
      key={levelSelection.index}
      puzzle={puzzle}
      onNewPuzzle={handleNewPuzzle}
    />
    : <Failed />;
}

function getLevelList(levelSelection: LevelSelection)
  : PuzzleData[] | undefined {
  if (levelSelection.rows === 5 && levelSelection.columns === 5) {
    return levels5x5.puzzles as PuzzleData[];
  }
  return undefined;
}

function getPuzzle(levelSelection: LevelSelection): PuzzleData | undefined {
  return getLevelList(levelSelection)?.at(levelSelection.index);
}

function EndOfLevels() {
  return (
    <Box flexDirection="column" borderStyle='round'>
      <Gradient name="teen">
        <Text>You reached the end of this level set!</Text>
      </Gradient>
      <Box gap={1}>
        <Text color={focusBgColor}><Spinner /></Text>
        <Text>Returning home...</Text>
      </Box>
    </Box>
  );
}

function Failed() {
  return (
    <Box flexDirection="column" borderStyle='round'>
      <Text>Invalid level.</Text>
      <Box gap={1}>
        <Text color={focusBgColor}><Spinner /></Text>
        <Text>Returning home...</Text>
      </Box>
    </Box>
  );
}
