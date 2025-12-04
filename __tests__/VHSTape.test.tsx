import React from 'react';
import { render, screen } from '@testing-library/react';
import VHSTape from '../src/components/VHSTape';

test('VHSTape shows title and subtitle', () => {
  render(<VHSTape title="Test Title" subtitle="Sub" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('Sub')).toBeInTheDocument();
});
