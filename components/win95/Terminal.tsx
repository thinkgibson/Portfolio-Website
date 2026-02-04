"use client";

import React, { useState, useEffect, useRef } from "react";
import { useOS } from "./OSContext";

interface TerminalProps { }

export function Terminal({ }: TerminalProps) {
    const { openWindow, closeWindow, runningApps, availableApps } = useOS();
    const [history, setHistory] = useState<string[]>([
        "Portfolio OS [Version 1.0]",
        "(c) 2026. All rights reserved.",
        "",
        "Type 'help' for available commands."
    ]);
    const [input, setInput] = useState("");
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        setHistory(prev => [...prev, `C:\\> ${trimmedCmd}`]);
        setCommandHistory(prev => [trimmedCmd, ...prev]);
        setHistoryIndex(-1);
        setInput("");

        const parts = trimmedCmd.split(" ");
        const action = parts[PartIndex.Action].toLowerCase();
        const args = parts.slice(1);

        switch (action) {
            case "help":
                setHistory(prev => [...prev,
                    "Available commands:",
                    "  open <app>  - Open an application (e.g., open notepad)",
                    "  list        - Show running applications",
                    "  close <app> - Close an application",
                    "  restart     - Restart the system",
                    "  help        - Show this help message",
                    "  clear       - Clear the screen"
                ]);
                break;
            case "list":
                if (runningApps.length === 0) {
                    setHistory(prev => [...prev, "No applications currently running."]);
                } else {
                    setHistory(prev => [...prev, "Running applications:", ...runningApps.map(app => `  - ${app.id} (${app.title})`)]);
                }
                break;
            case "open":
                if (args.length === 0) {
                    setHistory(prev => [...prev, "Usage: open <app_id>", "Available apps: " + availableApps.map(a => a.id).join(", ")]);
                } else {
                    const appId = args[0].toLowerCase();
                    const app = availableApps.find(a => a.id.toLowerCase() === appId);
                    if (app) {
                        openWindow(app.id);
                        setHistory(prev => [...prev, `Opening ${app.title}...`]);
                    } else {
                        setHistory(prev => [...prev, `Error: Application '${appId}' not found.`]);
                    }
                }
                break;
            case "close":
                if (args.length === 0) {
                    setHistory(prev => [...prev, "Usage: close <app_id>"]);
                } else {
                    const appId = args[0].toLowerCase();
                    const app = runningApps.find(a => a.id.toLowerCase() === appId);
                    if (app) {
                        closeWindow(app.id);
                        setHistory(prev => [...prev, `Closing ${app.title}...`]);
                    } else {
                        setHistory(prev => [...prev, `Error: Application '${appId}' is not running.`]);
                    }
                }
                break;
            case "restart":
                setHistory(prev => [...prev, "Restarting system..."]);
                setTimeout(() => window.location.reload(), 1000);
                break;
            case "clear":
                setHistory([]);
                break;
            default:
                setHistory(prev => [...prev, `'${action}' is not recognized as an internal or external command.`, "Type 'help' for assistance."]);
        }
    };

    enum PartIndex {
        Action = 0
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Form handles Enter via onSubmit
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
    };

    return (
        <div
            className="flex-grow flex flex-col bg-black text-white font-win95-mono p-2 overflow-auto scrollbar-win95 custom-terminal"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="flex-grow">
                {history.map((line, i) => (
                    <div key={i} className="min-h-[1.2em] whitespace-pre-wrap">{line}</div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-1">
                <span className="shrink-0 text-[#00FF00]">C:\&gt;</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none text-white font-win95-mono flex-grow p-0 caret-[#00FF00]"
                    data-testid="terminal-input"
                    autoFocus
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="ml-2 px-2 bg-gray-700 text-white hover:bg-gray-600 text-xs border border-gray-500"
                    data-testid="terminal-run-button"
                >
                    Run
                </button>
            </form>

            <style jsx>{`
                .custom-terminal {
                    font-smooth: never;
                    -webkit-font-smoothing: none;
                }
                .custom-terminal input {
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
}
