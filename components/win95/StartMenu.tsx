import React, { useState, useRef, useEffect } from "react";
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

    // Ensure component re-renders when isMobile changes
    useEffect(() => {
        // This effect ensures the component properly reacts to isMobile changes
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
        <div className="fixed bottom-12 left-0 z-[150] flex" onMouseLeave={handleMouseLeave}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className={`${isMobile ? 'w-64' : 'w-[384px]'} bg-win95-gray win95-beveled flex overflow-visible shadow-[2px_2px_10px_rgba(0,0,0,0.5)] win95-start-menu`}
                data-testid="start-menu"
            >
                {/* Sidebar */}
                <div className={`${isMobile ? 'w-8' : 'w-12'} bg-win95-gray-dark relative flex-shrink-0 flex flex-col items-center justify-start pt-4 overflow-hidden`}>
                    <span
                        className="text-win95-gray-darker font-win95 font-bold whitespace-nowrap"
                        style={{
                            fontSize: isMobile ? '16px' : '24px',
                            letterSpacing: isMobile ? '1px' : '2px',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                        }}
                    >
                        <span className="opacity-70">Portfolio</span> OS
                    </span>
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
                                    <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
                                        <div className="flex-shrink-0">
                                            <DynamicIcon iconType={item.iconType} size={isMobile ? 28 : 42} />
                                        </div>
                                        <span className={`font-win95 ${isMobile ? 'text-[13px]' : 'text-[20px]'}`}>{item.title}</span>
                                    </div>
                                    {hasChildren && (
                                        <span className={isMobile ? "text-[10px]" : "text-[15px]"}>▶</span>
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
                        className={`flex items-center ${isMobile ? 'gap-3 py-2' : 'gap-4 py-2'} px-3 hover:bg-win95-blue-active hover:text-white text-left group transition-colors duration-0`}
                        onClick={() => {
                            onReboot();
                            onClose();
                        }}
                    >
                        <div className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} flex items-center justify-center`}>
                            <div className={`${isMobile ? 'w-5 h-5 border-2 text-[10px]' : 'w-7 h-7 border-[2px] text-[15px]'} border-win95-dark flex items-center justify-center font-bold`}>R</div>
                        </div>
                        <span className={`font-win95 ${isMobile ? 'text-[13px]' : 'text-[20px]'}`}>Reboot...</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
