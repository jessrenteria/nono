import React, { Suspense, useEffect, useState } from 'react';

import { Text } from 'ink';
import Spinner from 'ink-spinner';
import os from 'node:os';
import path from 'node:path';

import Puzzle from '@/components/puzzle';
import { type PuzzleData } from '@/puzzle-data';

const focusBgColor = '#77a3d3';

export default function Custom() {
  const [puzzle, setPuzzle] = useState<PuzzleData | undefined>(undefined);
  useEffect(() => {
    async function fetch() {
      let data = await getCustomLevel();
      setPuzzle(data);
    }
    fetch();
  }, []);
  return (
    <>
      {puzzle
        ? <Puzzle puzzle={puzzle} />
        : <Loading />
      }
    </>
  );
}

async function getCustomLevel(): Promise<PuzzleData> {
  return Bun.file(
    path.join(os.homedir(), '.nono', 'levels', 'custom', 'singleton.json')
  ).json();
}

function Loading() {
  return (
    <>
      <Text color={focusBgColor}><Spinner /></Text>
      <Text>Loading</Text>
    </>
  );
}
