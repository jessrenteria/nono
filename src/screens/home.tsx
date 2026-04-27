import React, { useState } from 'react';

import { Box, Text, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { useNavigate } from 'react-router';

export default function Home() {
  const [hasSelectedPlay, setHasSelectedPlay] = useState<boolean>(false);

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
      {hasSelectedPlay
        ? <PlayMenu />
        : <MainMenu onSelectedPlay={() => setHasSelectedPlay(true)} />}
    </Box>
  );
}

type MainMenuProps = {
  onSelectedPlay: () => void;
};

function MainMenu({ onSelectedPlay }: MainMenuProps) {
  const navigate = useNavigate();
  const { exit } = useApp();

  return (
    <SelectInput
      items={[
        {
          label: 'Play',
          value: 'play',
        },
        {
          label: 'About',
          value: 'about',
        },
        {
          label: 'Exit',
          value: 'exit',
        },
      ]}
      onSelect={({ label, value }) => {
        switch (value) {
          case 'play':
            onSelectedPlay();
            break;
          case 'about':
            navigate('/about');
            break;
          case 'exit':
            exit();
            break;
        }
      }}
    />
  );
}

function PlayMenu() {
  const navigate = useNavigate();

  return (
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
        switch (value) {
          case '5x5':
            navigate('/puzzle/random/5/5');
            break;
          case '10x10':
            navigate('/puzzle/random/10/10');
            break;
          case '20x20':
            navigate('/puzzle/random/20/20');
            break;
          case 'back':
            navigate('/');
            break;
        }
      }}
    />
  );
}
