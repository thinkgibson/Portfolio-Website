"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import VHSTape from './VHSTape';

const defaultTapes = [
  { title: 'Neon Nights', subtitle: 'Home Cut' },
  { title: 'Arcade High', subtitle: 'Demo Reel' },
  { title: 'Synthwave Sunday', subtitle: 'Mix' }
];

type TapeState = {
  id: number;
  title: string;
  subtitle?: string;
  x: number;
  y: number;
  z: number;
};

const STORAGE_KEY = 'portfolio:tapePositions:v1';

export default function TapeStack() {
  const initial = useMemo<TapeState[]>(() => {
    return defaultTapes.map((t, i) => ({ id: i, title: t.title, subtitle: t.subtitle, x: i * 18, y: i * 8, z: 10 - i }));
  }, []);

  const [tapes, setTapes] = useState<TapeState[]>(initial);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerW, setContainerW] = useState(0);
  const [containerH, setContainerH] = useState(0);
  const [tapeW, setTapeW] = useState(160);
  const [tapeH, setTapeH] = useState(48);
  const GRID = 10; // snap to 10px grid

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TapeState[];
        if (Array.isArray(parsed) && parsed.length === initial.length) {
          setTapes(parsed);
        }
      }
    } catch (err) {
      // ignore
    }
  }, [initial]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tapes));
    } catch (err) {
      // ignore
    }
  }, [tapes]);

  useEffect(() => {
    function measure() {
      const c = containerRef.current;
      if (!c) return;
      setContainerW(c.clientWidth);
      setContainerH(c.clientHeight);
      const sample = c.querySelector('.tape-item') as HTMLElement | null;
      if (sample) {
        const r = sample.getBoundingClientRect();
        setTapeW(Math.round(r.width));
        setTapeH(Math.round(r.height));
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  function clampCoords(x: number, y: number) {
    const maxX = Math.max(0, containerW - tapeW);
    const maxY = Math.max(0, containerH - tapeH);
    const cx = Math.min(Math.max(0, x), maxX);
    const cy = Math.min(Math.max(0, y), maxY);
    return { x: cx, y: cy };
  }

  function snapToGrid(v: number) {
    return Math.round(v / GRID) * GRID;
  }

  function handleMove(id: number, x: number, y: number) {
    const clamped = clampCoords(x, y);
    setTapes((prev) => prev.map((p) => (p.id === id ? { ...p, x: clamped.x, y: clamped.y } : p)));
  }

  function handleDrop(id: number, x: number, y: number) {
    const clamped = clampCoords(x, y);
    const snappedX = snapToGrid(clamped.x);
    const snappedY = snapToGrid(clamped.y);
    setTapes((prev) => prev.map((p) => (p.id === id ? { ...p, x: snappedX, y: snappedY } : p)));
  }

  function handleDragStart(id: number) {
    setTapes((prev) => {
      const maxZ = prev.reduce((m, p) => Math.max(m, p.z), 0);
      return prev.map((p) => (p.id === id ? { ...p, z: maxZ + 1 } : p));
    });
  }

  return (
    <div ref={containerRef} className="relative w-full h-48 touch-none">
      {tapes.map((t) => (
        <VHSTape
          key={t.id}
          id={t.id}
          title={t.title}
          subtitle={t.subtitle}
          x={t.x}
          y={t.y}
          zIndex={t.z}
          onMove={handleMove}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
}
