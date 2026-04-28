import React, { useState } from 'react';

import { useParams } from 'react-router';

import Editor from '@/components/editor';

export default function Game() {
  let params = useParams();

  return (
    <Editor
      numRows={Number(params.rows!)}
      numColumns={Number(params.columns!)}
    />
  );
}
