import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-950">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Retro Videos</h1>
        <p className="text-muted text-lg text-gray-300">A tiny demo — click through to the video scene.</p>
        <Link href="/video" className="inline-block px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-semibold">Video Page</Link>
      </div>
    </main>
  );
}
