import React, { useState } from 'react';

import { Box, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { useNavigate } from 'react-router';

type Menu =
  | 'home'
  | 'play'
  | 'create'
  | 'random';

export default function Home() {
  const [menu, setMenu] = useState<Menu>('home');

  const menuComponent = (() => {
    switch (menu) {
      case 'play':
        return <PlayMenu setMenu={setMenu} />;
      case 'create':
        return <CreateMenu setMenu={setMenu} />;
      case 'random':
        return <RandomMenu setMenu={setMenu} />;
      default:
        return <MainMenu setMenu={setMenu} />;
    }
  })();

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
      {menuComponent}
    </Box>
  );
}

type MenuProps = {
  setMenu: (menu: Menu) => void;
}

function MainMenu({ setMenu }: MenuProps) {
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
          label: 'Create',
          value: 'create',
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
            setMenu('play');
            break;
          case 'create':
            setMenu('create');
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

function PlayMenu({ setMenu }: MenuProps) {
  const navigate = useNavigate();

  return (
    <SelectInput
      items={[
        {
          label: 'Random',
          value: 'random',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
        {
          label: 'Back',
          value: 'back',
        },
      ]}
      onSelect={({ label, value }) => {
        switch (value) {
          case 'random':
            setMenu('random');
            break;
          case 'custom':
            navigate('/puzzle/custom');
            break;
          case 'back':
            setMenu('home');
            break;
        }
      }}
    />
  );
}

function RandomMenu({ setMenu }: MenuProps) {
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
          label: '15 x 15',
          value: '15x15',
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
          case '15x15':
            navigate('/puzzle/random/15/15');
            break;
          case '20x20':
            navigate('/puzzle/random/20/20');
            break;
          case 'back':
            setMenu('play');
            break;
        }
      }}
    />
  );
}

function CreateMenu({ setMenu }: MenuProps) {
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
          label: '15 x 15',
          value: '15x15',
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
            navigate('/edit/5/5');
            break;
          case '10x10':
            navigate('/edit/10/10');
            break;
          case '15x15':
            navigate('/edit/15/15');
            break;
          case '20x20':
            navigate('/edit/20/20');
            break;
          case 'back':
            setMenu('home');
            break;
        }
      }}
    />
  );
}
