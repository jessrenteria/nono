import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Text, useInput } from 'ink';

import NonoTitleText from '@/components/nono-title-text';

export default function Home() {
  const navigate = useNavigate();

  useInput((input, key) => {
    if (key.return) {
      navigate('/about');
    }
  });

  return (
    <Box margin={2} gap={1} flexDirection={"column"}>
      <NonoTitleText />
      <Text>Home. Press Enter to go to About.</Text>
    </Box>
  );
}
