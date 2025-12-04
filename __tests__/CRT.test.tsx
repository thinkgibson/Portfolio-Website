import React from 'react';
import { render, screen } from '@testing-library/react';
import CRT from '../src/components/CRT';

test('CRT renders children', () => {
  render(<CRT>hello</CRT>);
  expect(screen.getByText('hello')).toBeInTheDocument();
});
