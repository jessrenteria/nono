import React, { useState } from 'react';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { useParams } from 'react-router';

import Editor from '@/components/editor';
import { type PuzzleData } from '@/puzzle-data';

export default function Game() {
  let params = useParams();

  const writePuzzle = (puzzle: PuzzleData) => {
    fs.mkdir(
      path.join(os.homedir(), '.nono'),
      { recursive: true },
      (err) => {
        if (err) throw err;
        Bun.write(
          path.join(
            os.homedir(), '.nono', 'levels', 'custom', 'singleton.json'),
          JSON.stringify(puzzle));
      });
  }

  return (
    <Editor
      numRows={Number(params.rows!)}
      numColumns={Number(params.columns!)}
      onWrite={writePuzzle}
    />
  );
}
