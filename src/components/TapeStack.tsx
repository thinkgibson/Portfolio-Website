import React from 'react';
import VHSTape from './VHSTape';

const tapes = [
  { title: 'Neon Nights', subtitle: 'Home Cut' },
  { title: 'Arcade High', subtitle: 'Demo Reel' },
  { title: 'Synthwave Sunday', subtitle: 'Mix' }
];

export default function TapeStack() {
  return (
    <div className="flex flex-col items-start">
      {tapes.map((t, i) => (
        <div key={i} className="mb-2 transform translate-x-[-10px]" style={{ zIndex: 10 - i }}>
          <VHSTape title={t.title} subtitle={t.subtitle} />
        </div>
      ))}
    </div>
  );
}
