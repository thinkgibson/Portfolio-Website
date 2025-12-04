"use client";

import React, { useRef, useState } from 'react';

type Props = {
  id: number;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  zIndex?: number;
  onMove: (id: number, x: number, y: number) => void;
  onDragStart?: (id: number) => void;
  onDrop?: (id: number, x: number, y: number) => void;
};

export default function VHSTape({ id, title, subtitle, x, y, zIndex = 1, onMove, onDragStart, onDrop }: Props) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, origX: 0, origY: 0, pointerId: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Shared drag helpers so we can support pointer events and a mouse fallback
  function startDrag(clientX: number, clientY: number, pointerId: number, capturePointer?: boolean) {
    const el = elRef.current;
    if (!el) return;
    dragState.current.dragging = true;
    dragState.current.pointerId = pointerId;
    dragState.current.startX = clientX;
    dragState.current.startY = clientY;
    dragState.current.origX = x;
    dragState.current.origY = y;
    setIsDragging(true);
    if (capturePointer && typeof el.setPointerCapture === 'function') {
      try {
        el.setPointerCapture(pointerId);
      } catch (err) {
        // ignore
      }
    }
    onDragStart?.(id);

    // For mouse fallback, attach window listeners so we get moves outside the element
    if (!capturePointer) {
      const onMouseMove = (ev: MouseEvent) => moveDrag(ev.clientX, ev.clientY, pointerId);
      const onMouseUp = (ev: MouseEvent) => {
        endDrag(ev.clientX, ev.clientY, pointerId, false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  function moveDrag(clientX: number, clientY: number, pointerId: number) {
    if (!dragState.current.dragging || pointerId !== dragState.current.pointerId) return;
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    const nextX = Math.round(dragState.current.origX + dx);
    const nextY = Math.round(dragState.current.origY + dy);
    onMove(id, nextX, nextY);
  }

  function endDrag(clientX: number, clientY: number, pointerId: number, releasePointer = true) {
    if (!dragState.current.dragging || pointerId !== dragState.current.pointerId) return;
    dragState.current.dragging = false;
    const el = elRef.current;
    if (releasePointer && el && typeof el.releasePointerCapture === 'function') {
      try {
        el.releasePointerCapture(pointerId);
      } catch (err) {
        // ignore
      }
    }
    setIsDragging(false);
    const dx = clientX - dragState.current.startX;
    const dy = clientY - dragState.current.startY;
    const finalX = Math.round(dragState.current.origX + dx);
    const finalY = Math.round(dragState.current.origY + dy);
    onDrop?.(id, finalX, finalY);
  }

  function handlePointerDown(e: React.PointerEvent) {
    e.preventDefault();
    startDrag(e.clientX, e.clientY, e.pointerId, true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    moveDrag(e.clientX, e.clientY, e.pointerId);
  }

  function handlePointerCancel(e: React.PointerEvent) {
    endDrag(e.clientX, e.clientY, e.pointerId, true);
  }

  function handlePointerUp(e: React.PointerEvent) {
    endDrag(e.clientX, e.clientY, e.pointerId, true);
  }

  // Mouse fallback for environments where pointer capture may be unreliable
  function handleMouseDown(e: React.MouseEvent) {
    // only respond to primary button
    if (e.button !== 0) return;
    e.preventDefault();
    // use a sentinel pointerId for mouse fallback
    startDrag(e.clientX, e.clientY, -1, false);
  }

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
      draggable={false}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate(${x}px, ${y}px) scale(${isDragging ? 1.06 : 1})`,
        zIndex,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 12px 30px rgba(2,6,23,0.45)' : undefined,
        transition: isDragging ? 'none' : 'transform 120ms ease, box-shadow 120ms ease',
        willChange: 'transform'
      }}
      className="absolute left-0 top-0 tape-item"
      aria-grabbed={isDragging}
    >
      <div className="flex items-center gap-3">
        <div className="w-[140px] h-[40px] bg-[#0f1724] rounded-md flex items-center justify-center border border-gray-700 shadow-inner">
          <div className="vhs-label text-black">
            <div className="font-bold text-[10px]">{title}</div>
            {subtitle && <div className="text-[9px] text-gray-700">{subtitle}</div>}
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-700 rounded-sm" />
      </div>
    </div>
  );
}
