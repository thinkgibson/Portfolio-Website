import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TapeStack from '../src/components/TapeStack';

describe('Tape drag-and-drop (unit)', () => {
  beforeEach(() => {
    localStorage.removeItem('portfolio:tapePositions:v1');
  });

  test('dragging a tape updates its transform and persists to localStorage', async () => {
    const { getByText } = render(<TapeStack />);

    const titleEl = getByText('Neon Nights');

    // Find the ancestor element that carries the transform style
    let el = titleEl as HTMLElement;
    while (el && el.style && el.style.transform === '') {
      if (!el.parentElement) break;
      el = el.parentElement as HTMLElement;
    }

    expect(el).toBeInstanceOf(HTMLElement);

    // Simulate pointer drag: start at (0,0) -> move to (50,30)
    await act(async () => {
      fireEvent.pointerDown(el, { pointerId: 1, clientX: 0, clientY: 0 });
      fireEvent.pointerMove(el, { pointerId: 1, clientX: 50, clientY: 30 });
      fireEvent.pointerUp(el, { pointerId: 1, clientX: 50, clientY: 30 });
    });

    // The element should have a translate transform applied (numbers may vary in jsdom)
    expect(el.style.transform).toMatch(/translate\(/);

    // localStorage should have the updated position array
    const raw = localStorage.getItem('portfolio:tapePositions:v1');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(Array.isArray(parsed)).toBe(true);
  });
});
