import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { Select } from '@inkjs/ui';

export default function Home() {
  const navigate = useNavigate();

  const { exit } = useApp();

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
      <Select
        options={[
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
        onChange={(newValue) => {
          if (newValue === 'play') {
            navigate('/puzzle');
          }
          if (newValue === 'about') {
            navigate('/about');
          }
          if (newValue === 'exit') {
            exit();
          }
        }}
      />
    </Box>
  );
}
