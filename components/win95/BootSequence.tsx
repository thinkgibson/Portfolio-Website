"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { replaceBootVariables } from "../../lib/utils";

export function BootSequence({ bootContent = [], onComplete }: { bootContent?: string[], onComplete: () => void }) {
    const [lines, setLines] = useState<string[]>([]);
    const [isBooted, setIsBooted] = useState(false);
    const [userData, setUserData] = useState({
        browser: "Detected",
        os: "Detected",
        viewport: "Detected",
        ip: "Detecting...",
        date: new Date().toLocaleDateString(),
    });

    const userDataRef = React.useRef(userData);
    useEffect(() => {
        userDataRef.current = userData;
    }, [userData]);

    useEffect(() => {
        // Detect browser and OS
        const ua = window.navigator.userAgent;
        let browser = "Unknown Browser";
        let os = "Unknown OS";

        if (ua.indexOf("Chrome") > -1) browser = "Chrome";
        else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
        else if (ua.indexOf("Safari") > -1) browser = "Safari";
        else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1) browser = "Internet Explorer";

        if (ua.indexOf("Win") > -1) os = "Windows";
        else if (ua.indexOf("Mac") > -1) os = "MacOS";
        else if (ua.indexOf("Linux") > -1) os = "Linux";
        else if (ua.indexOf("Android") > -1) os = "Android";
        else if (ua.indexOf("like Mac") > -1) os = "iOS";

        setUserData(prev => ({
            ...prev,
            browser,
            os,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            date: new Date().toLocaleString(),
        }));

        // Fetch IP with timeout
        const fetchIP = async () => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            try {
                const response = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
                const data = await response.json();
                setUserData(prev => ({ ...prev, ip: data.ip }));
            } catch (error) {
                console.error("Failed to fetch IP:", error);
                setUserData(prev => ({ ...prev, ip: "Detected" }));
            } finally {
                clearTimeout(timeoutId);
            }
        };

        fetchIP();
    }, []);

    useEffect(() => {
        // Safe access to bootContent
        const safeBootContent = Array.isArray(bootContent) ? bootContent : [];
        const messages = safeBootContent.length > 0 ? safeBootContent : [
            "BIOS Version 2.0.4.1",
            "Copyright (C) 1995 AMI",
            "CPU: Antigravity i486DX4 1000MHz",
            "Memory Test: 16384K OK",
            "",
            "Searching for Boot Record from IDE-0..OK",
            "Loading Windows 95...",
            "",
            "Starting MS-DOS...",
            "C:\\>SET PATH=C:\\WINDOWS;C:\\WINDOWS\\COMMAND",
            "C:\\>WINDOWS.EXE",
        ];

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < messages.length) {
                const rawMessage = messages[currentLine];
                if (typeof rawMessage === 'string') {
                    const processedMessage = replaceBootVariables(rawMessage, userDataRef.current);
                    setLines(prev => [...prev, processedMessage]);
                }
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
    }, [bootContent]); // Only restart if bootContent changes

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
                            <p key={i} className="min-h-[1.5rem]">{line}</p>
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
