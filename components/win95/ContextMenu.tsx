"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContextMenuItem {
    label: string;
    action: () => void;
    disabled?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Ensure the menu doesn't go off screen
    const adjustedX = typeof window !== "undefined" ? Math.min(x, window.innerWidth - 160) : x;
    const adjustedY = typeof window !== "undefined" ? Math.min(y, window.innerHeight - (items.length * 25 + 10)) : y;

    return (
        <div
            className="fixed inset-0 z-[200] pointer-events-none"
            onClick={onClose}
        >
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.05 }}
                style={{ top: adjustedY, left: adjustedX }}
                className="absolute w-40 bg-win95-gray win95-beveled py-1 shadow-[2px_2px_5px_rgba(0,0,0,0.5)] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                data-testid="context-menu"
            >
                {items.map((item, index) => (
                    <button
                        key={index}
                        disabled={item.disabled}
                        className={`w-full text-left px-4 py-1 text-[12px] font-win95 flex items-center gap-2 ${item.disabled
                                ? "text-win95-gray-inactive cursor-default"
                                : "hover:bg-win95-blue-active hover:text-white"
                            }`}
                        onClick={() => {
                            item.action();
                            onClose();
                        }}
                    >
                        {item.label}
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
