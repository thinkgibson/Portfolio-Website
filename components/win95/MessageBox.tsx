"use client";

import React from "react";
import { X } from "lucide-react";

interface MessageBoxProps {
    title: string;
    message: string;
    type?: "info" | "warning" | "error" | "question";
    onConfirm?: () => void; // Yes / OK
    onCancel?: () => void;  // No / Cancel
    onClose?: () => void;   // X button
    buttons?: "ok" | "yesno" | "yesnocancel";
}

export function MessageBox({
    title,
    message,
    onConfirm,
    onCancel,
    onClose,
    buttons = "ok"
}: MessageBoxProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/10">
            <div className="win95-beveled bg-win95-gray p-[4px] min-w-[450px] shadow-2xl">
                {/* Titlebar */}
                <div className="bg-win95-blue-active h-9 flex items-center justify-between px-2 select-none">
                    <span className="text-white text-[18px] font-bold font-win95">{title}</span>
                    <button
                        onClick={onClose || onCancel}
                        className="win95-button w-8 h-8 !p-0 flex items-center justify-center"
                    >
                        <X size={18} className="text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex gap-8 items-start">
                    <div className="flex-grow pt-2 text-[20px] font-win95 whitespace-pre-wrap">
                        {message}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-4 p-8 pt-4">
                    {buttons === "ok" && (
                        <button onClick={onConfirm} className="win95-button px-12 py-2 text-[20px]">OK</button>
                    )}
                    {(buttons === "yesno" || buttons === "yesnocancel") && (
                        <>
                            <button onClick={onConfirm} className="win95-button px-12 py-2 text-[20px]">Yes</button>
                            <button onClick={onCancel} className="win95-button px-12 py-2 text-[20px]">No</button>
                        </>
                    )}
                    {buttons === "yesnocancel" && (
                        <button onClick={onClose} className="win95-button px-12 py-2 text-[20px]">Cancel</button>
                    )}
                </div>
            </div>
        </div>
    );
}
