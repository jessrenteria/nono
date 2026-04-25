import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { render } from 'ink';

import Home from '@/screens/home';
import About from '@/screens/about';

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}

render(<App />);
