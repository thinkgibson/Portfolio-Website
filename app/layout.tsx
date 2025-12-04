import '../src/styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'Portfolio Website',
  description: 'Retro video landing'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
