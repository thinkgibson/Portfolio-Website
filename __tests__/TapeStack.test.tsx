import React from 'react';
import { render, screen } from '@testing-library/react';
import TapeStack from '../src/components/TapeStack';

test('TapeStack renders three tapes', () => {
  render(<TapeStack />);
  expect(screen.getByText('Neon Nights')).toBeInTheDocument();
  expect(screen.getByText('Arcade High')).toBeInTheDocument();
  expect(screen.getByText('Synthwave Sunday')).toBeInTheDocument();
});
