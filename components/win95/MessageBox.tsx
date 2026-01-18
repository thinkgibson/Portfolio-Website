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
            <div className="win95-beveled bg-win95-gray p-[2px] min-w-[300px] shadow-2xl">
                {/* Titlebar */}
                <div className="bg-win95-blue-active h-6 flex items-center justify-between px-1 select-none">
                    <span className="text-white text-[12px] font-bold font-win95">{title}</span>
                    <button
                        onClick={onClose || onCancel}
                        className="win95-button w-4 h-4 !p-0 flex items-center justify-center"
                    >
                        <X size={12} className="text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex gap-4 items-start">
                    <div className="flex-grow pt-1 text-[13px] font-win95 whitespace-pre-wrap">
                        {message}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-2 p-4 pt-2">
                    {buttons === "ok" && (
                        <button onClick={onConfirm} className="win95-button px-6 py-1 text-[13px]">OK</button>
                    )}
                    {(buttons === "yesno" || buttons === "yesnocancel") && (
                        <>
                            <button onClick={onConfirm} className="win95-button px-6 py-1 text-[13px]">Yes</button>
                            <button onClick={onCancel} className="win95-button px-6 py-1 text-[13px]">No</button>
                        </>
                    )}
                    {buttons === "yesnocancel" && (
                        <button onClick={onClose} className="win95-button px-6 py-1 text-[13px]">Cancel</button>
                    )}
                </div>
            </div>
        </div>
    );
}
