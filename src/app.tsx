import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';

import About from '@/screens/about';
import Custom from '@/screens/custom';
import Edit from '@/screens/edit';
import Home from '@/screens/home';
import Random from '@/screens/random';

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/puzzle/random/:rows/:columns" element={<Random />} />
        <Route path="/puzzle/custom" element={<Custom />} />
        <Route path="/edit/:rows/:columns" element={<Edit />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}
