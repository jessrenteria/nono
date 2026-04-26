import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { render } from 'ink';

import About from '@/screens/about';
import Game from '@/screens/game';
import Home from '@/screens/home';

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/puzzle" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}

render(<App />);
