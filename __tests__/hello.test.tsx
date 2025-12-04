import React from 'react';
import { render, screen } from '@testing-library/react';
import Hello from '../src/components/Hello';

test('renders greeting with provided name', () => {
  render(<Hello name="Test" />);
  expect(screen.getByText('Hello Test')).toBeInTheDocument();
});
