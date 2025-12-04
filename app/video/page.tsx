import React from 'react';
import CRT from '../../src/components/CRT';
import TapeStack from '../../src/components/TapeStack';

export default function VideoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="scene w-full">
        <div className="backdrop" style={{ backgroundImage: "url('/assets/living-room.svg')" }} />
        <div className="backdrop-overlay" />
        <div className="scene-foreground max-w-5xl mx-auto px-4">
          <div className="tv-wrapper">
            <CRT>
              <div className="w-full h-full flex items-center justify-center text-lg text-white">VIDEO PREVIEW</div>
            </CRT>
          </div>
          <div className="tape-stack">
            <TapeStack />
          </div>
        </div>
      </section>
    </main>
  );
}
