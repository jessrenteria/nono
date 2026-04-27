import React, { useState } from 'react';

import { Box, Text, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { useNavigate } from 'react-router';

import PuzzleComponent from '@/components/puzzle';
import { genPuzzle } from '@/generator/generator';
import { type CellState, type Puzzle } from '@/model';

export default function Game() {
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<Puzzle | undefined>(undefined);

  if (puzzle !== undefined) {
    return <PuzzleComponent puzzle={puzzle!} />;
  }

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
      <SelectInput
        items={[
          {
            label: '5 x 5',
            value: '5x5',
          },
          {
            label: '10 x 10',
            value: '10x10',
          },
          {
            label: '20 x 20',
            value: '20x20',
          },
          {
            label: 'Back',
            value: 'back',
          },
        ]}
        onSelect={({ label, value }) => {
          if (value === '5x5') {
            setPuzzle(genPuzzle(5, 5));
            return
          }
          if (value === '10x10') {
            setPuzzle(genPuzzle(10, 10));
          }
          if (value === '20x20') {
            setPuzzle(genPuzzle(20, 20));
          }
          if (value === 'back') {
            navigate('/');
          }
        }}
      />
    </Box>
  );
}
