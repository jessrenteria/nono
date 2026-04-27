import React, { useState } from 'react';

import { useParams } from 'react-router';

import PuzzleComponent from '@/components/puzzle';
import { genPuzzle } from '@/generator/generator';
import { type Puzzle } from '@/model';

export default function Game() {
  let params = useParams();

  const [puzzle, setPuzzle] =
    useState<Puzzle>(genPuzzle(Number(params.rows!), Number(params.columns!)));

  return <PuzzleComponent puzzle={puzzle} />;
}
