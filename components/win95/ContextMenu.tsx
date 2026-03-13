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
    testId?: string;
    anchorY?: 'top' | 'bottom';
}

export function ContextMenu({ x, y, items, onClose, testId = "context-menu", anchorY = 'top' }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuHeight, setMenuHeight] = React.useState(0);
    const [menuWidth, setMenuWidth] = React.useState(0);
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

    useIsomorphicLayoutEffect(() => {
        if (menuRef.current) {
            setMenuHeight(menuRef.current.offsetHeight);
            setMenuWidth(menuRef.current.offsetWidth);
        }
    }, [items]);

    useEffect(() => {
        const handleClickOutside = (event: PointerEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Ensure the menu doesn't go off screen, with at least 8px margin
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 800;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 600;

    const adjustedX = Math.max(8, Math.min(x, viewportWidth - (menuWidth || 320) - 8));

    // Calculate initial Y based on anchor
    let initialY = y;
    if (anchorY === 'bottom' && menuHeight > 0) {
        initialY -= menuHeight;
    }

    // Constrain Y within viewport
    const adjustedY = Math.max(8, Math.min(initialY, viewportHeight - (menuHeight || items.length * 40 + 20) - 8));

    return (
        <div
            className="fixed inset-0 z-[200] pointer-events-auto"
            onPointerDown={onClose}
        >
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.05 }}
                style={{ top: adjustedY, left: adjustedX }}
                className="absolute min-w-60 w-auto max-w-[calc(100vw-16px)] bg-win95-gray win95-beveled py-2 shadow-[4px_4px_10px_rgba(0,0,0,0.5)] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                data-testid={testId}
            >
                {items.map((item, index) => (
                    <button
                        key={index}
                        disabled={item.disabled}
                        className={`w-full text-left px-8 py-2 text-[18px] font-win95 flex items-center gap-4 ${item.disabled
                            ? "text-win95-gray-inactive cursor-default"
                            : "hover:bg-win95-blue-active hover:text-white"
                            }`}
                        onClick={() => {
                            item.action();
                            onClose();
                        }}
                        data-testid={`context-menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                        {item.label}
                    </button>
                ))}
            </motion.div>
        </div>
    );
}
