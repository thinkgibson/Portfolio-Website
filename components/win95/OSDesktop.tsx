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
import { WallpaperSelector, WALLPAPERS, Wallpaper } from "./WallpaperSelector";


import { AppDefinition, IconType } from "../../lib/types";
import { Folder } from "./Folder";
import { useIsMobile, useLocalStorage } from "../../lib/hooks";

interface RuntimeWindow extends AppDefinition {
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isActive: boolean;
    // Overriding x/y from AppDefinition to be mandatory in runtime if open
    x: number;
    y: number;
}

interface OSDesktopProps {
    windows: AppDefinition[];
    skipBoot?: boolean;
    skipWelcome?: boolean;
}

const TASKBAR_HEIGHT = 48;
import { reloadPage } from "../../lib/navigation";


// Flatten all apps for OSProvider's availableApps
const getAllApps = (list: AppDefinition[]): { id: string, title: string, iconType: any }[] => {
    let apps: { id: string, title: string, iconType: any }[] = [];
    for (const item of list) {
        apps.push({ id: item.id, title: item.title, iconType: item.iconType });
        if (item.children) {
            apps = [...apps, ...getAllApps(item.children)];
        }
    }
    return apps;
};

export function OSDesktop({ windows: initialWindows, skipBoot: propSkipBoot, skipWelcome: propSkipWelcome }: OSDesktopProps) {
    const isMobile = useIsMobile();
    const [booting, setBooting] = useState(propSkipBoot !== undefined ? !propSkipBoot : process.env.NODE_ENV !== 'test');
    const [openWindows, setOpenWindows] = useState<RuntimeWindow[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [windowPositions, setWindowPositions] = useState<Record<string, { x: number, y: number, width?: number, height?: number }>>({});
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const [wallpaper, setWallpaper] = useLocalStorage<Wallpaper>("win95-wallpaper", WALLPAPERS[0]);
    const desktopRef = React.useRef<HTMLDivElement>(null);

    const handleOpenWindow = (id: string) => {
        setOpenWindows(prev => {
            const existing = prev.find(w => w.id === id);
            if (existing) {
                // If it exists, just activate it (and un-minimize)
                if (existing.isActive && !existing.isMinimized) {
                    return prev; // No change needed
                }
                setActiveWindowId(id); // Side effect: Set active ID (this is safe to call outside, or should be separate?)
                // Actually setActiveWindowId is separate state. We should sync them.
                // But specifically for openWindows array:
                return prev.map(w =>
                    w.id === id ? { ...w, isMinimized: false, isActive: true } : { ...w, isActive: false }
                );
            }

            // Window doesn't exist, create it.
            // Recursive find function (internal to callback or reused?)
            // We need 'initialWindows' which is available in closure (safe).
            const findWindowProps = (id: string, list: AppDefinition[]): AppDefinition | null => {
                for (const item of list) {
                    if (item.id === id) return item;
                    if (item.children) {
                        const found = findWindowProps(id, item.children);
                        if (found) return found;
                    }
                }
                return null;
            };

            const winDef = findWindowProps(id, initialWindows);
            if (!winDef) return prev;

            // Calculate position
            // NOTE: We used 'openWindows.length' before. Now we use 'prev.length'.
            let pos = windowPositions[id];

            if (isMobile) {
                pos = {
                    x: (typeof window !== 'undefined' ? window.innerWidth : 320) * 0.05, // fixed 5% margin
                    y: (typeof window !== 'undefined' ? window.innerHeight : 480) * 0.05
                };
            } else if (!pos) {
                const offset = prev.length * 30; // Use current prev.length
                pos = { x: 100 + offset, y: 50 + offset };

                // Save initial position side-effect (we can't do this easily in pure reducer)
                // We'll skip saving to windowPositions state for now as it's ephemeral, 
                // OR we accept that windowPositions might lag slightly for new windows.
                // But we need 'pos' for the new window object.
            }

            const newWin: RuntimeWindow = {
                ...winDef,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                isActive: true,
                x: pos.x,
                y: pos.y,
                width: pos.width,
                height: pos.height,
                content: winDef.children ? (
                    <Folder
                        id={winDef.id}
                        title={winDef.title}
                        items={winDef.children.map((child: any) => ({
                            id: child.id,
                            title: child.title || "",
                            iconType: child.iconType || "folder"
                        }))}
                        onItemClick={(childId) => handleOpenWindow(childId)}
                    />
                ) : winDef.content,
                helpContent: winDef.helpContent,
                iconType: winDef.iconType,
                fullBleed: winDef.fullBleed,
                lockAspectRatio: winDef.lockAspectRatio,
                minWidth: winDef.minWidth,
                minHeight: winDef.minHeight,
                canMaximize: winDef.canMaximize,
            };

            // Side effect: Active ID
            setTimeout(() => setActiveWindowId(id), 0);

            return prev.map(w => ({ ...w, isActive: false })).concat(newWin);
        });
    };

    const handleCloseWindow = (id: string) => {
        setOpenWindows(prev => prev.filter(w => w.id !== id));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    // Window positions are now ephemeral and not saved to localStorage per request
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('skipBoot') === 'true') {
                setBooting(false);
            }
        }
    }, [propSkipBoot]);

    // Nudge off-screen windows back into viewport on resize
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => {
            setOpenWindows(prev => prev.map(w => {
                if (w.isMaximized) return w;

                if (isMobile) {
                    const x = (window.innerWidth * 0.1) / 2;
                    const y = (window.innerHeight * 0.1) / 2;
                    return { ...w, x, y };
                }

                // Keep minimum visibility on right/bottom
                const maxX = window.innerWidth - 10;
                // Prevent window top from going into taskbar area (with 10px buffer)
                const maxY = window.innerHeight - TASKBAR_HEIGHT - 10;

                const newX = Math.max(-11, Math.min(w.x, maxX));
                const newY = Math.max(-11, Math.min(w.y, maxY));

                if (newX !== w.x || newY !== w.y) {
                    return { ...w, x: newX, y: newY };
                }
                return w;
            }));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

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
        setWindowPositions(prev => ({
            ...prev,
            [id]: { ...prev[id], width, height } // Update width/height, preserve x/y from prev[id] or let it be undefined if checking logic elsewhere
        }));
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

        const aboutWin: RuntimeWindow = {
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
            iconType: "about"
        };

        setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(aboutWin));
        setActiveWindowId(aboutId);
    };

    const handleOpenWallpaperSelector = () => {
        const id = "wallpaper-selector";
        const existing = openWindows.find(w => w.id === id);
        if (existing) {
            handleSetActive(id);
            return;
        }

        const selectorWin: RuntimeWindow = {
            id,
            title: "Display Properties",
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            isActive: true,
            x: 150,
            y: 100,
            width: 400,
            height: 450,
            iconType: "projects",
            content: (
                <WallpaperSelector
                    currentWallpaperId={wallpaper.id}
                    onApply={(newWallpaper) => {
                        setWallpaper(newWallpaper);
                        handleCloseWindow(id);
                    }}
                    onCancel={() => handleCloseWindow(id)}
                />
            )
        };

        setOpenWindows(prev => prev.map(w => ({ ...w, isActive: false })).concat(selectorWin));
        setActiveWindowId(id);
    };


    const handleMinimizeAllWindows = () => {
        setOpenWindows(prev => prev.map(w => ({ ...w, isMinimized: true, isActive: false })));
        setActiveWindowId(null);
    };

    const handleCloseAllWindows = () => {
        setOpenWindows([]);
        setActiveWindowId(null);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    // Flatten all apps for OSProvider's availableApps
    const availableApps = getAllApps(initialWindows);

    return (
        <OSProvider
            onOpenWindow={handleOpenWindow}
            onCloseWindow={handleCloseWindow}
            runningApps={openWindows.map(w => ({ id: w.id, title: w.title }))}
            availableApps={availableApps}
        >
            <OSDesktopView
                booting={booting}
                setBooting={setBooting}
                wallpaper={wallpaper}
                windowPositions={windowPositions}
                setWindowPositions={setWindowPositions}
                isStartMenuOpen={isStartMenuOpen}
                setIsStartMenuOpen={setIsStartMenuOpen}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                openWindows={openWindows}
                setOpenWindows={setOpenWindows}
                activeWindowId={activeWindowId}
                handleOpenWindow={handleOpenWindow}
                handleCloseWindow={handleCloseWindow}
                handleMinimizeWindow={handleMinimizeWindow}
                handleMaximizeWindow={handleMaximizeWindow}
                handleSetActive={handleSetActive}
                handleResizeWindow={handleResizeWindow}
                handleAbout={handleAbout}
                handleOpenWallpaperSelector={handleOpenWallpaperSelector}
                handleMinimizeAllWindows={handleMinimizeAllWindows}
                handleCloseAllWindows={handleCloseAllWindows}
                handleContextMenu={handleContextMenu}
                initialWindows={initialWindows}
                desktopRef={desktopRef}
                isMobile={isMobile}
                availableApps={initialWindows}
            />
        </OSProvider>
    );
}

function OSDesktopView({
    booting, setBooting, wallpaper, windowPositions, setWindowPositions,
    isStartMenuOpen, setIsStartMenuOpen, contextMenu, setContextMenu,
    openWindows, setOpenWindows, activeWindowId,
    handleOpenWindow, handleCloseWindow, handleMinimizeWindow, handleMaximizeWindow,
    handleSetActive, handleResizeWindow, handleAbout, handleOpenWallpaperSelector,
    handleMinimizeAllWindows, handleCloseAllWindows, handleContextMenu,
    initialWindows, desktopRef, isMobile, availableApps
}: any) {
    const { playSound, closeWindow, saveHandlers } = useOS();

    const handleReboot = async () => {
        await playSound("shutdown");
        reloadPage();
    };


    const workAreaRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={desktopRef}
            className="relative w-screen h-screen overflow-hidden"
            style={{
                backgroundColor: wallpaper.type === 'color' ? wallpaper.value : '#008080',
                backgroundImage: wallpaper.type === 'image' ? `url(${wallpaper.value})` : 'none',
                backgroundSize: wallpaper.id === 'clouds' ? 'cover' : 'auto',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center'
            }}
            data-window-positions={JSON.stringify(windowPositions)}
            data-testid="desktop-container"
            data-wallpaper-id={wallpaper.id}
            onContextMenu={handleContextMenu}
            onClick={() => {
                if (isStartMenuOpen) setIsStartMenuOpen(false);
                if (contextMenu) setContextMenu(null);
            }}
        >
            {booting && <BootSequence onComplete={() => {
                setBooting(false);
                playSound("boot");
            }} />}

            {/* Constraint Area for Windows (excludes taskbar) */}
            <div ref={workAreaRef} className="absolute inset-0 bottom-[48px] pointer-events-none w-full" />

            {/* Desktop Icons */}
            <div className="p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,160px)] gap-4 w-fit h-[calc(100vh-48px)]">
                {initialWindows.map((win: any) => (
                    <DesktopIcon
                        key={win.id}
                        id={win.id}
                        label={win.title}
                        iconType={win.iconType}
                        onOpen={(id) => {
                            playSound("click");
                            handleOpenWindow(id);
                        }}
                    />
                ))}
            </div>

            {/* Start Menu */}
            <AnimatePresence>
                {isStartMenuOpen && (
                    <StartMenu
                        items={availableApps}
                        onItemClick={(id) => {
                            playSound("click");
                            handleOpenWindow(id);
                        }}
                        onReboot={handleReboot}
                        onClose={() => setIsStartMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Windows Container */}
            <div className="absolute inset-0 pointer-events-none">
                {openWindows.filter((w: any) => !w.isMinimized).map((win: any) => (
                    <Win95Window
                        key={win.id}
                        title={win.title}
                        iconType={win.iconType}
                        helpContent={win.helpContent}
                        onClose={() => {
                            playSound("click");
                            closeWindow(win.id);
                        }}
                        onFocus={() => handleSetActive(win.id)}
                        onSave={saveHandlers[win.id]}
                        fullBleed={win.fullBleed}
                        lockAspectRatio={win.lockAspectRatio}
                        minWidth={win.minWidth}
                        minHeight={win.minHeight}
                        canMaximize={win.canMaximize}
                        onMinimize={() => handleMinimizeWindow(win.id)}
                        onMaximize={() => handleMaximizeWindow(win.id)}
                        onAbout={() => handleAbout(win.id)}
                        onPositionChange={(newX: number, newY: number) => {
                            // Allow small portion off-screen (-11px tolerance)
                            const clampedX = Math.max(-11, Math.min(newX, (typeof window !== 'undefined' ? window.innerWidth : 800) - 10));
                            // Prevent window top from going into taskbar area (with 10px buffer)
                            const maxY = (typeof window !== 'undefined' ? window.innerHeight : 600) - TASKBAR_HEIGHT - 10;
                            const clampedY = Math.max(-11, Math.min(newY, maxY));

                            setWindowPositions((prev: any) => ({ ...prev, [win.id]: { ...prev[win.id], x: clampedX, y: clampedY } }));
                            setOpenWindows((prev: any) => prev.map((w: any) => w.id === win.id ? { ...w, x: clampedX, y: clampedY } : w));
                        }}
                        isMaximized={win.isMaximized}
                        isActive={win.isActive}
                        x={win.x}
                        y={win.y}
                        width={isMobile ? (typeof window !== 'undefined' ? window.innerWidth : 320) * 0.9 : (win.width || undefined)}
                        height={isMobile ? (typeof window !== 'undefined' ? window.innerHeight : 480) * 0.9 : (win.height || undefined)}

                        onResize={(w: number, h: number) => handleResizeWindow(win.id, w, h)}
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
                    openWindows={openWindows.map((w: any) => ({ id: w.id, title: w.title, isActive: w.isActive, iconType: w.iconType }))}
                    onWindowClick={(id: string) => {
                        playSound("click");
                        const win = openWindows.find((w: any) => w.id === id);
                        if (win?.isActive) {
                            handleMinimizeWindow(id);
                        } else {
                            handleOpenWindow(id);
                        }
                    }}
                    onStartClick={() => {
                        playSound("click");
                        setIsStartMenuOpen(!isStartMenuOpen);
                    }}
                    onMinimizeWindow={handleMinimizeWindow}
                    onCloseWindow={(id) => closeWindow(id)}
                    onMinimizeAllWindows={handleMinimizeAllWindows}
                    onCloseAllWindows={handleCloseAllWindows}
                />
            )}

            <AnimatePresence>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        testId="desktop-context-menu"
                        items={[
                            { label: "Change wallpaper", action: handleOpenWallpaperSelector },
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





