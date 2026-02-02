import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicIcon } from "../Icons/DynamicIcon";
import { AppDefinition } from "../../lib/types";
import { StartSubMenu } from "./StartSubMenu";
import { useIsMobile } from "../../lib/hooks";

interface StartMenuProps {
    items: AppDefinition[];
    onItemClick: (id: string) => void;
    onReboot: () => void;
    onClose: () => void;
}

export function StartMenu({ items, onItemClick, onReboot, onClose }: StartMenuProps) {
    const isMobile = useIsMobile();
    const [activeSubMenuId, setActiveSubMenuId] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        <div className="fixed bottom-12 left-0 z-[150] flex" onMouseLeave={handleMouseLeave}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="w-64 bg-win95-gray win95-beveled flex overflow-visible shadow-[2px_2px_10px_rgba(0,0,0,0.5)] win95-start-menu"
                data-testid="start-menu"
            >
                {/* Sidebar */}
                <div className="w-8 bg-win95-gray-dark relative flex-shrink-0">
                    <div className="absolute bottom-2 left-0 w-8 flex justify-center">
                        <span
                            className="text-win95-gray font-win95 font-bold text-lg origin-center -rotate-90 whitespace-nowrap"
                            style={{ fontSize: '20px', letterSpacing: '1px' }}
                        >
                            <span className="opacity-50">Windows</span>95
                        </span>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="flex-grow flex flex-col py-1 overflow-visible">
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
                                    data-testid={`start-menu-item-${item.id}`}
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
                                            depth={1}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}

                    <div className="my-2 border-t border-win95-gray-inactive border-b border-win95-light mx-1" />

                    <button
                        className="flex items-center gap-3 px-3 py-2 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0"
                        onClick={() => {
                            onReboot();
                            onClose();
                        }}
                    >
                        <div className="w-7 h-7 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-win95-dark flex items-center justify-center font-bold text-[10px]">R</div>
                        </div>
                        <span className="font-win95 text-[13px]">Reboot...</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
