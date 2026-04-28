import React, { useState } from 'react';

import { useParams } from 'react-router';

import Puzzle from '@/components/puzzle';
import { genPuzzle } from '@/generator/generator';
import { type PuzzleData } from '@/puzzle-data';

export default function Random() {
  let params = useParams();

  const [puzzle, setPuzzle] =
    useState<PuzzleData>(
      genPuzzle(Number(params.rows!), Number(params.columns!)));
  // Force remounts on board refreshes.
  const [key, setKey] = useState<number>(0);

  const newPuzzle = () => {
    setPuzzle(genPuzzle(Number(params.rows!), Number(params.columns!)));
    setKey(key + 1);
  };

  return <Puzzle key={key} puzzle={puzzle} onNewPuzzle={newPuzzle} />;
}
