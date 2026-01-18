"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface SaveDialogProps {
    defaultFilename?: string;
    onSave: (filename: string) => void;
    onCancel: () => void;
}

export function SaveDialog({
    defaultFilename = "document",
    onSave,
    onCancel
}: SaveDialogProps) {
    const [filename, setFilename] = useState(defaultFilename);

    const handleSave = () => {
        if (filename.trim()) {
            onSave(filename.trim());
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center z-[200] bg-black/10" data-testid="save-dialog">
            <div className="win95-beveled bg-win95-gray p-[2px] min-w-[350px] shadow-2xl">
                {/* Titlebar */}
                <div className="bg-win95-blue-active h-6 flex items-center justify-between px-1 select-none">
                    <span className="text-white text-[12px] font-bold font-win95">Save As</span>
                    <button
                        onClick={onCancel}
                        className="win95-button w-4 h-4 !p-0 flex items-center justify-center"
                    >
                        <X size={12} className="text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-win95">File name:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="win95-beveled-inset bg-white px-2 py-1 text-[13px] font-win95 flex-grow outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSave();
                                    if (e.key === 'Escape') onCancel();
                                }}
                            />
                            <span className="text-[13px] font-win95 self-center">.rtf</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-win95">Save as type:</label>
                        <div className="win95-beveled-inset bg-white px-2 py-1 text-[13px] font-win95 text-gray-500">
                            Rich Text Format (*.rtf)
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 p-4 pt-0">
                    <button
                        onClick={handleSave}
                        className="win95-button px-6 py-1 text-[13px]"
                    >
                        Download
                    </button>
                    <button
                        onClick={onCancel}
                        className="win95-button px-6 py-1 text-[13px]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
