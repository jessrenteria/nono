import React, { Suspense, useEffect, useState } from 'react';

import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import os from 'node:os';
import path from 'node:path';
import { useNavigate } from 'react-router';

import Puzzle from '@/components/puzzle';
import { type PuzzleData } from '@/puzzle-data';

const focusBgColor = '#77a3d3';

export default function Custom() {
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<PuzzleData | undefined>(undefined);
  const [fileReadFailed, setFileReadFailed] = useState<boolean>(false);

  useEffect(() => {
    async function fetch() {
      let data = await getCustomLevel();
      if (data === undefined) {
        setFileReadFailed(true);
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
      setPuzzle(data);
    }
    fetch();
  }, []);

  if (fileReadFailed) {
    return <Failed />;
  }

  return (
    puzzle
      ? <Puzzle puzzle={puzzle} />
      : <Loading />
  );
}

async function getCustomLevel(): Promise<PuzzleData | undefined> {
  const file = Bun.file(
    path.join(os.homedir(), '.nono', 'levels', 'custom', 'singleton.json'));
  return file.exists().then(
    (doesExist) => {
      return doesExist ? file.json() : Promise.resolve(undefined);
    },
    (err) => {
      return Promise.resolve(undefined);
    }
  );
}

function Loading() {
  return (
    <>
      <Text color={focusBgColor}><Spinner /></Text>
      <Text>Loading</Text>
    </>
  );
}

function Failed() {
  return (
    <Box flexDirection="column" borderStyle='round'>
      <Text>No custom levels saved.</Text>
      <Gradient name="teen"><Text>Create one first!</Text></Gradient>
      <Box gap={1}>
        <Text color={focusBgColor}><Spinner /></Text>
        <Text>Returning home...</Text>
      </Box>
    </Box>
  );
}
