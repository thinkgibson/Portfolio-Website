import React from 'react';

type Props = { title: string; subtitle?: string };

export default function VHSTape({ title, subtitle }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[140px] h-[40px] bg-[#0f1724] rounded-md flex items-center justify-center border border-gray-700 shadow-inner">
        <div className="vhs-label text-black">
          <div className="font-bold text-[10px]">{title}</div>
          {subtitle && <div className="text-[9px] text-gray-700">{subtitle}</div>}
        </div>
      </div>
      <div className="w-6 h-6 bg-gray-700 rounded-sm" />
    </div>
  );
}
