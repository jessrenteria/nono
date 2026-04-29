import React, { useState } from 'react';

import { Box, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import { useNavigate } from 'react-router';

import { getLevelSet } from "@/levels";

// Enforce a static height across all submenus to prevent incremental rendering
// issues.
const menuHeight = 5;

type Menu =
  | 'home'
  | 'play'
  | 'create'
  | 'random'
  | 'levels';

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
      case 'levels':
        return <LevelsMenu setMenu={setMenu} />;
      default:
        return <MainMenu setMenu={setMenu} />;
    }
  })();

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
      <Box height={menuHeight}>
        {menuComponent}
      </Box>
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
      limit={menuHeight}
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
      limit={menuHeight}
      items={[
        {
          label: 'Random',
          value: 'random',
        },
        {
          label: 'Levels',
          value: 'levels',
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
          case 'levels':
            setMenu('levels');
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
      limit={menuHeight}
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

function LevelsMenu({ setMenu }: MenuProps) {
  const navigate = useNavigate();
  type Submenu = {
    type: string
    rows: number,
    columns: number,
  };
  const [submenu, setSubmenu] = useState<Submenu | undefined>(undefined);

  if (submenu === undefined) {
    return (
      <SelectInput
        limit={menuHeight}
        items={[
          {
            label: '5 x 5',
            value: '5x5',
          },
          {
            label: 'Back',
            value: 'back',
          },
        ]}
        onSelect={({ label, value }) => {
          switch (value) {
            case '5x5':
              setSubmenu({ type: '5x5', rows: 5, columns: 5 });
              break;
            case 'back':
              setMenu('play');
              break;
          }
        }}
      />
    );
  }

  const numItems =
    getLevelSet({ type: 'string', levelSet: submenu.type })?.length;

  let items = Array.from({ length: numItems! }, (_, i) => {
    return {
      label: (i + 1).toString(),
      value: i.toString(),
    }
  });
  items.push({ label: 'Back', value: 'back' });

  return (
    <SelectInput
      limit={menuHeight}
      items={items}
      onSelect={({ label, value }) => {
        switch (value) {
          case 'back':
            setMenu('play');
            break;
          default:
            navigate(
              '/puzzle/levels/' +
              [submenu.rows, submenu.columns, value].join('/'));
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
      limit={menuHeight}
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
