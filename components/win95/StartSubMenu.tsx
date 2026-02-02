"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicIcon } from "../Icons/DynamicIcon";
import { AppDefinition } from "../../lib/types";
import { useIsMobile } from "../../lib/hooks";

interface StartSubMenuProps {
    items: AppDefinition[];
    onItemClick: (id: string) => void;
    onClose: () => void;
    depth: number;
}

export function StartSubMenu({ items, onItemClick, onClose, depth }: StartSubMenuProps) {
    const isMobile = useIsMobile();
    const [activeSubMenuId, setActiveSubMenuId] = useState<string | null>(null);
    const [offsetY, setOffsetY] = useState(0);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!menuRef.current || isMobile) return;

        const rect = menuRef.current.getBoundingClientRect();
        const threshold = window.innerHeight - 24; // Middle of 48px taskbar

        if (rect.bottom > threshold) {
            setOffsetY(threshold - rect.bottom);
        }
    }, [isMobile]);

    const handleMouseEnter = (id: string, hasChildren: boolean) => {
        if (isMobile) return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        if (hasChildren) {
            hoverTimeoutRef.current = setTimeout(() => {
                setActiveSubMenuId(id);
            }, 200);
        } else {
            setActiveSubMenuId(null);
        }
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveSubMenuId(null);
        }, 300);
    };

    const handleItemClick = (item: AppDefinition) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

        if (item.children && item.children.length > 0) {
            // Toggling submenu for both mobile and desktop on click
            setActiveSubMenuId(activeSubMenuId === item.id ? null : item.id);
        } else {
            onItemClick(item.id);
            onClose();
        }
    };

    return (
        <motion.div
            ref={menuRef}
            initial={{ x: depth === 1 ? -10 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute left-full top-0 ml-[-2px] w-64 bg-win95-gray win95-beveled flex flex-col py-1 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] z-[151]"
            style={{ top: offsetY !== 0 ? `${offsetY}px` : 0 }}
            onMouseLeave={handleMouseLeave}
            data-testid={`start-submenu-depth-${depth}`}
        >
            {items.map((item) => {
                const hasChildren = !!(item.children && item.children.length > 0);
                return (
                    <div
                        key={item.id}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.id, hasChildren)}
                    >
                        <button
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0 ${activeSubMenuId === item.id ? 'bg-win95-blue-active text-white' : ''}`}
                            data-testid={`start-submenu-item-${item.id}`}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                    <DynamicIcon iconType={item.iconType} size={28} />
                                </div>
                                <span className="font-win95 text-[13px]">{item.title}</span>
                            </div>
                            {hasChildren && (
                                <span className="text-[10px]">▶</span>
                            )}
                        </button>

                        <AnimatePresence>
                            {activeSubMenuId === item.id && hasChildren && (
                                <StartSubMenu
                                    items={item.children!}
                                    onItemClick={onItemClick}
                                    onClose={onClose}
                                    depth={depth + 1}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </motion.div>
    );
}
