"use client";

import React, { useState, useEffect } from "react";
import { Win95Window } from "./Win95Window";
import { Taskbar } from "./Taskbar";
import { DesktopIcon } from "./DesktopIcon";
import { BootSequence } from "./BootSequence";
import { StartMenu } from "./StartMenu";
import { AnimatePresence } from "framer-motion";
import { OSProvider, useOS } from "./OSContext";
import { ContextMenu } from "./ContextMenu";


interface WindowState {
    id: string;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isActive: boolean;
    x: number;
    y: number;
    content: React.ReactNode;
    helpContent?: React.ReactNode;
    iconType: "folder" | "about" | "contact" | "projects" | "drive" | "notepad" | "calculator" | "paint";
    width?: number;
    height?: number;
    fullBleed?: boolean;
}

interface OSDesktopProps {
    windows: {
        id: string;
        title: string;
        iconType: "folder" | "about" | "contact" | "projects" | "drive" | "notepad" | "calculator" | "paint";
        content: React.ReactNode;
        helpContent?: React.ReactNode;
        fullBleed?: boolean;
    }[];
    skipBoot?: boolean;
    skipWelcome?: boolean;
}

import { useIsMobile } from "../../lib/hooks";

const TASKBAR_HEIGHT = 48;

export function OSDesktop(props: OSDesktopProps) {
    return (
        <OSProvider>
            <OSDesktopContent {...props} />
        </OSProvider>
    );
}

function OSDesktopContent({ windows: initialWindows, skipBoot: propSkipBoot, skipWelcome: propSkipWelcome }: OSDesktopProps) {
    const { closeInterceptors, saveHandlers } = useOS();
    const isMobile = useIsMobile();
    const [booting, setBooting] = useState(propSkipBoot !== undefined ? !propSkipBoot : process.env.NODE_ENV !== 'test');
    const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [windowPositions, setWindowPositions] = useState<Record<string, { x: number, y: number, width?: number, height?: number }>>({});
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const desktopRef = React.useRef<HTMLDivElement>(null);


    // Load window positions from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedPositions = localStorage.getItem('win95-window-positions');
            if (savedPositions) {
                try {
                    setWindowPositions(JSON.parse(savedPositions));
                } catch (e) {
                    console.error('Failed to parse window positions from localStorage', e);
                }
            }

            const params = new URLSearchParams(window.location.search);
            if (params.get('skipBoot') === 'true') {
                setBooting(false);
            }
        }
    }, []);

    // Save window positions to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Update windowPositions with current coordinates of open windows
            const updatedPositions = { ...windowPositions };
            let changed = false;

            openWindows.forEach(win => {
                if (win.x !== undefined && win.y !== undefined) {
                    const currentPos = updatedPositions[win.id];
                    if (!currentPos ||
                        currentPos.x !== win.x ||
                        currentPos.y !== win.y ||
                        currentPos.width !== win.width ||
                        currentPos.height !== win.height) {
                        updatedPositions[win.id] = {
                            x: win.x,
                            y: win.y,
                            width: win.width,
                            height: win.height
                        };
                        changed = true;
                    }
                }
            });

            if (changed) {
                setWindowPositions(updatedPositions);
            }

            if (Object.keys(updatedPositions).length > 0) {
                localStorage.setItem('win95-window-positions', JSON.stringify(updatedPositions));
            }
        }
    }, [windowPositions, openWindows]);


    // Nudge off-screen windows back into viewport on resize
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => {
            setOpenWindows(prev => prev.map(w => {
                if (w.isMaximized) return w;

                if (isMobile) {
                    // Center on mobile resize
                    const x = (window.innerWidth * 0.1) / 2; // 5% margin (90% width)
                    const y = (window.innerHeight * 0.1) / 2; // 5% margin (90% height)
                    return { ...w, x, y };
                }

                const maxX = window.innerWidth - 100;
                const maxY = window.innerHeight - TASKBAR_HEIGHT - 10;
                const newX = Math.max(0, Math.min(w.x, maxX));
                const newY = Math.max(0, Math.min(w.y, maxY));
                if (newX !== w.x || newY !== w.y) {
                    return { ...w, x: newX, y: newY };
                }
                return w;
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    // Effect to open Welcome window by default after boot or on load
    useEffect(() => {
        let skipWelcome = propSkipWelcome;
        if (typeof window !== 'undefined' && skipWelcome === undefined) {
            const params = new URLSearchParams(window.location.search);
            skipWelcome = params.get('skipWelcome') === 'true';
        }
        if (!booting && openWindows.length === 0 && !skipWelcome) {
            handleOpenWindow("welcome");
        }
    }, [booting, propSkipWelcome]);

    const handleOpenWindow = (id: string) => {
        const existing = openWindows.find(w => w.id === id);
        if (existing) {
            handleSetActive(id);
            if (existing.isMinimized) {
                setOpenWindows(prev => prev.map(w =>
                    w.id === id ? { ...w, isMinimized: false } : w
                ));
            }
        } else {
            const winDef = initialWindows.find(w => w.id === id);
            if (winDef) {
                // Use stored position or calculate new one
                let pos = windowPositions[id];

                // Fallback to localStorage if state is not yet loaded (e.g., initial mount)
                if (!pos && typeof window !== 'undefined') {
                    try {
                        const saved = localStorage.getItem('win95-window-positions');
                        if (saved) {
                            const parsed = JSON.parse(saved);
                            const normalizedId = id.toLowerCase();
                            if (parsed[normalizedId]) pos = parsed[normalizedId];
                        }
                    } catch (e) {
                        console.error('Failed to read from localStorage in handleOpenWindow', e);
                    }
                }

                if (isMobile) {
                    // Constant centering on mobile
                    pos = {
                        x: (window.innerWidth * 0.1) / 2,
                        y: (window.innerHeight * 0.1) / 2
                    };
                } else if (!pos) {
                    // Only calculate if we don't have a saved position
                    const margin = 20;
                    const offset = openWindows.length * 30;
                    pos = { x: 100 + offset, y: 50 + offset };
                }

                const newWin: WindowState = {
                    ...winDef,
                    isOpen: true,
                    isMinimized: false,
                    isMaximized: false,
                    isActive: true,
                    x: pos.x,
                    y: pos.y,
                    width: pos.width,
                    height: pos.height,
                    content: winDef.content,
                    helpContent: winDef.helpContent,
                    iconType: winDef.iconType, // Added iconType
                    fullBleed: winDef.fullBleed,
                };
                setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(newWin));
                setActiveWindowId(id);

                // Save initial position if not already saved (only for desktop)
                if (!isMobile && !windowPositions[id]) {
                    setWindowPositions(prev => ({ ...prev, [id]: pos }));
                }
            }
        }
    };

    const handleCloseWindow = async (id: string) => {
        const interceptor = closeInterceptors[id];
        if (interceptor) {
            const allowed = await interceptor();
            if (!allowed) return;
        }

        setOpenWindows(prev => prev.filter(w => w.id !== id));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    const handleMinimizeWindow = (id: string) => {
        setOpenWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMinimized: true, isActive: false } : w
        ));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    const handleMaximizeWindow = (id: string) => {
        setOpenWindows(prev => prev.map(w =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
        ));
        handleSetActive(id);
    };

    const handleSetActive = (id: string) => {
        setOpenWindows(prev => prev.map(w => ({
            ...w,
            isActive: w.id === id,
            isMinimized: w.id === id ? false : w.isMinimized
        })));
        setActiveWindowId(id);
    };

    const handleResizeWindow = (id: string, width: number, height: number) => {
        setOpenWindows(prev => prev.map(w =>
            w.id === id ? { ...w, width, height } : w
        ));
    };

    const handleAbout = (id: string) => {
        const currentWin = openWindows.find(w => w.id === id);
        if (!currentWin) return;

        const aboutId = `about-${id}`;
        const existing = openWindows.find(w => w.id === aboutId);

        if (existing) {
            handleSetActive(aboutId);
            return;
        }

        const aboutWin: WindowState = {
            id: aboutId,
            title: `About ${currentWin.title}`,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            isActive: true,
            x: currentWin.x + 40,
            y: currentWin.y + 40,
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-win95-gray-inactive pb-4">
                        <div className="w-12 h-12 bg-win95-gray win95-beveled flex items-center justify-center font-bold">
                            ?
                        </div>
                        <div>
                            <h2 className="text-[16px] font-bold leading-none">{currentWin.title}</h2>
                            <p className="text-[12px] opacity-70 mt-1">Version 1.0 (Windows 95)</p>
                        </div>
                    </div>
                    <div className="text-[12px] leading-normal font-win95 space-y-2">
                        <p className="font-bold">Purpose:</p>
                        {currentWin.helpContent || <p>This window provides information related to {currentWin.title.toLowerCase()}.</p>}
                    </div>
                    <div className="pt-4 flex justify-end">
                        <button
                            className="win95-button px-6 h-6 font-bold text-[12px]"
                            onClick={() => handleCloseWindow(aboutId)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            ),
            iconType: "about" // Default iconType for about windows
        };

        setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(aboutWin));
        setActiveWindowId(aboutId);
    };

    const handleReboot = () => {
        setOpenWindows([]);
        setActiveWindowId(null);
        setIsStartMenuOpen(false);
        setBooting(true);
    };

    const handleMinimizeAllWindows = () => {
        setOpenWindows(prev => prev.map(w => ({ ...w, isMinimized: true, isActive: false })));
        setActiveWindowId(null);
    };

    const handleCloseAllWindows = async () => {
        // We filter out windows that have close interceptors for now to avoid multiple prompts
        // In a real OS, it might prompt for each one, but for simplicity we'll just close what we can
        const windowsToClose = openWindows.filter(w => !closeInterceptors[w.id]);
        setOpenWindows(prev => prev.filter(w => closeInterceptors[w.id]));
        if (activeWindowId && windowsToClose.find(w => w.id === activeWindowId)) {
            setActiveWindowId(null);
        }

        // Handle windows with interceptors (optional: could just try to close them all)
        for (const win of openWindows.filter(w => closeInterceptors[w.id])) {
            handleCloseWindow(win.id);
        }
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };


    return (
        <div
            ref={desktopRef}
            className="relative w-screen h-screen overflow-hidden bg-win95-teal"
            data-window-positions={JSON.stringify(windowPositions)}
            data-testid="desktop-container"
            onContextMenu={handleContextMenu}
            onClick={() => {
                if (isStartMenuOpen) setIsStartMenuOpen(false);
                if (contextMenu) setContextMenu(null);
            }}
        >


            {booting && <BootSequence onComplete={() => setBooting(false)} />}

            {/* Desktop Icons */}
            <div className="p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,160px)] gap-4 w-fit h-[calc(100vh-48px)]">
                {initialWindows.map((win, i) => (
                    <DesktopIcon
                        key={win.id}
                        id={win.id}
                        label={win.title}
                        iconType={win.iconType}
                        onOpen={handleOpenWindow}
                    />
                ))}
            </div>

            {/* Start Menu */}
            <AnimatePresence>
                {isStartMenuOpen && (
                    <StartMenu
                        items={initialWindows.map(w => ({ id: w.id, title: w.title, iconType: w.iconType }))}
                        onItemClick={handleOpenWindow}
                        onReboot={handleReboot}
                        onClose={() => setIsStartMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Windows Container */}
            <div className="absolute inset-0 pointer-events-none">
                {openWindows.filter(w => !w.isMinimized).map((win, i) => (
                    <Win95Window
                        key={win.id}
                        title={win.title}
                        iconType={win.iconType}
                        helpContent={win.helpContent}
                        onClose={() => handleCloseWindow(win.id)}
                        onSave={saveHandlers[win.id]}
                        fullBleed={win.fullBleed}
                        onMinimize={() => handleMinimizeWindow(win.id)}
                        onMaximize={() => handleMaximizeWindow(win.id)}
                        onAbout={() => handleAbout(win.id)}
                        onPositionChange={(newX, newY) => {
                            // Clamp to ensure at least some of the window stays on screen
                            // Top-left: -10px margin as per test expectation
                            // Bottom-right: Ensure titlebar is still reachable (e.g., viewport - 100px)
                            const clampedX = Math.max(-10, Math.min(newX, typeof window !== 'undefined' ? window.innerWidth - 100 : newX));
                            const clampedY = Math.max(-10, Math.min(newY, typeof window !== 'undefined' ? window.innerHeight - TASKBAR_HEIGHT : newY));

                            setWindowPositions(prev => ({ ...prev, [win.id]: { x: clampedX, y: clampedY } }));
                            setOpenWindows(prev => prev.map(w => w.id === win.id ? { ...w, x: clampedX, y: clampedY } : w));
                        }}
                        isMaximized={win.isMaximized}
                        isActive={win.isActive}
                        x={win.x}
                        y={win.y}
                        width={isMobile ? window.innerWidth * 0.9 : (win.width || undefined)}
                        height={isMobile ? window.innerHeight * 0.9 : (win.height || undefined)}
                        dragConstraints={desktopRef}
                        onResize={(w, h) => handleResizeWindow(win.id, w, h)}
                    >
                        <div className="flex-1 flex flex-col min-h-0" onPointerDown={() => handleSetActive(win.id)}>
                            {win.content}
                        </div>
                    </Win95Window>
                ))}
            </div>

            {/* Taskbar */}
            {!booting && (
                <Taskbar
                    openWindows={openWindows.map(w => ({ id: w.id, title: w.title, isActive: w.isActive, iconType: w.iconType }))}
                    onWindowClick={(id) => {
                        const win = openWindows.find(w => w.id === id);
                        if (win?.isActive) {
                            handleMinimizeWindow(id);
                        } else {
                            handleOpenWindow(id);
                        }
                    }}
                    onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                />
            )}

            <AnimatePresence>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        items={[
                            { label: "Change wallpaper", action: () => { }, disabled: true },
                            { label: "Close all windows", action: handleCloseAllWindows },
                            { label: "Minimize all windows", action: handleMinimizeAllWindows },
                            { label: "System reboot", action: handleReboot }
                        ]}
                    />
                )}
            </AnimatePresence>
        </div>

    );
}



