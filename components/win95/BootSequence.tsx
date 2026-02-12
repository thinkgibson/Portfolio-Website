"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [isBooted, setIsBooted] = useState(false);

    const bootMessages = [
        "BIOS Version 2.0.4.1",
        "Copyright (C) 1995 AMI",
        "CPU: Antigravity i486DX4 100MHz",
        "Memory Test: 16384K OK",
        "",
        "Searching for Boot Record from IDE-0..OK",
        "Loading Windows 95...",
        "",
        "Starting MS-DOS...",
        "C:\>SET PATH=C:\WINDOWS;C:\WINDOWS\COMMAND",
        "C:\>WINDOWS.EXE",
    ];

    useEffect(() => {
        const messages = [...bootMessages];
        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < messages.length) {
                const message = messages[currentLine];
                setLines(prev => [...prev, message]);
                currentLine++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsBooted(true);
                    setTimeout(onComplete, 1000);
                }, 1000);
            }
        }, 300);

        return () => clearInterval(interval);
    }, []); // Run once on mount

    return (
        <AnimatePresence>
            {!isBooted && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 bg-black text-white p-10 font-mono text-lg z-[1000] overflow-hidden select-none"
                    onClick={onComplete} // Allow skip
                >
                    <div className="max-w-3xl mx-auto space-y-1">
                        {lines.map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-2 h-4 bg-white align-middle ml-1"
                        />
                    </div>
                    <div className="absolute bottom-10 right-10 text-gray-500 text-xs italic">
                        Click anywhere to skip
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
