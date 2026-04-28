import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';

import About from '@/screens/about';
import Edit from '@/screens/edit';
import Game from '@/screens/game';
import Home from '@/screens/home';

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/puzzle/random/:rows/:columns" element={<Game />} />
        <Route path="/edit/:rows/:columns" element={<Edit />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}
