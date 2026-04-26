import React from 'react';

import { useNavigate } from 'react-router';
import { Box, Newline, Text, useInput } from 'ink';

export default function About() {
  const navigate = useNavigate();

  useInput((input, key) => {
    if (key.return) {
      navigate('/');
    }
  });

  return (
    <Box margin={2} gap={1} flexDirection="column">
      <Text>Developed by @jessrenteria.</Text>
      <Text>
        Because there can never be enough Picross.
        I mean...nonograms.
      </Text>
      <Text>Repo: https://github.com/jessrenteria/nono</Text>
      <Text>Press Enter to return.</Text>
    </Box>
  );
}
