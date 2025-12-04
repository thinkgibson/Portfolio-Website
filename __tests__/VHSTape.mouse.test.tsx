import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VHSTape from '../src/components/VHSTape';

describe('VHSTape mouse drag fallback', () => {
  test('calls onMove while mouse is held down and moved', () => {
    const onMove = jest.fn();
    const onDragStart = jest.fn();
    const onDrop = jest.fn();

    const { container } = render(
      <div style={{ width: 400, height: 200 }}>
        <VHSTape id={0} title="Test" x={0} y={0} zIndex={1} onMove={onMove} onDragStart={onDragStart} onDrop={onDrop} />
      </div>
    );

    const tape = container.querySelector('.tape-item') as HTMLElement;
    expect(tape).toBeTruthy();

    // Simulate mouse down on the tape
    fireEvent.mouseDown(tape, { button: 0, clientX: 10, clientY: 10 });

    // Move the mouse while holding down
    fireEvent.mouseMove(window, { clientX: 50, clientY: 30 });

    // onMove should have been called to update position
    expect(onMove).toHaveBeenCalled();

    // Release the mouse
    fireEvent.mouseUp(window, { clientX: 50, clientY: 30 });

    expect(onDrop).toHaveBeenCalled();
  });
});
