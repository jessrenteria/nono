import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';

export default function Home() {
  const navigate = useNavigate();

  const { exit } = useApp();

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Gradient name="teen">
        <BigText text="nono" />
      </Gradient>
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
          if (value === 'play') {
            navigate('/puzzle');
          }
          if (value === 'about') {
            navigate('/about');
          }
          if (value === 'exit') {
            exit();
          }
        }}
      />
    </Box>
  );
}
