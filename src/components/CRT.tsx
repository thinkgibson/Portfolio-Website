import React from 'react';

type Props = { children?: React.ReactNode };

export default function CRT({ children }: Props) {
  return (
    <div className="w-[420px] h-[300px] rounded-[18px] bg-[#111827] p-6 drop-shadow-2xl">
      <div className="bg-[#06121a] rounded-[8px] w-full h-full flex items-center justify-center overflow-hidden relative" style={{ boxShadow: 'inset 0 6px 30px rgba(0,0,0,0.8)' }}>
        {/* CRT frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="320" height="220" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="320" height="220" rx="18" fill="#0b1720" />
            <rect x="8" y="8" width="304" height="204" rx="12" fill="url(#screen)" />
            <defs>
              <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#07121b" stopOpacity="1" />
                <stop offset="1" stopColor="#0c2a34" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center text-sm text-gray-400">
        <div>VCR</div>
        <div className="text-xs">Power</div>
      </div>
    </div>
  );
}
