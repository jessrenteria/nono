import React, { useState } from 'react';

import { useParams } from 'react-router';

import Puzzle from '@/components/puzzle';
import { genPuzzle } from '@/generator/generator';
import { type PuzzleData } from '@/puzzle-data';

export default function Game() {
  let params = useParams();

  const [puzzle, setPuzzle] =
    useState<PuzzleData>(
      genPuzzle(Number(params.rows!), Number(params.columns!)));

  return <Puzzle puzzle={puzzle} />;
}
