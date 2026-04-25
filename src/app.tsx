import React from 'react';
import { Newline, Text } from 'ink';

type Props = {};

export default function App({ }: Props) {
  return (
    <Text>
      <Text color="#E34B74">
        ███╗   ██╗ ██████╗ ███╗   ██╗ ██████╗
      </Text>
      <Newline />
      <Text color="#E34BB3">
        ████╗  ██║██╔═══██╗████╗  ██║██╔═══██╗
      </Text>
      <Newline />
      <Text color="#924BE3">
        ██╔██╗ ██║██║   ██║██╔██╗ ██║██║   ██║
      </Text>
      <Newline />
      <Text color="#5F4BE3">
        ██║╚██╗██║██║   ██║██║╚██╗██║██║   ██║
      </Text>
      <Newline />
      <Text color="#4B71E3">
        ██║ ╚████║╚██████╔╝██║ ╚████║╚██████╔╝
      </Text>
      <Newline />
      <Text color="#4B9FE3">
        ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝
      </Text>
      <Newline />
    </Text>
  );
}
