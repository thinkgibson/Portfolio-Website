"use client";

import React from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useIsMobile } from "../../lib/hooks";
import { DynamicIcon } from "../Icons/DynamicIcon";

const TASKBAR_HEIGHT = 72;

interface Win95WindowProps {
    title: string;
    children: React.ReactNode;
    helpContent?: React.ReactNode;
    onClose?: () => void;
    onMinimize?: () => void;
    onMaximize?: () => void;
    onAbout?: () => void;
    onPositionChange?: (x: number, y: number) => void;
    isMaximized?: boolean;
    isActive?: boolean;
    iconType?: import("../../lib/types").IconType;
    x?: number;
    y?: number;
    width?: string | number;
    height?: string | number;
    dragConstraints?: React.RefObject<Element> | { left?: number; right?: number; top?: number; bottom?: number };
    onResize?: (width: number, height: number) => void;
    onSave?: () => void;
    fullBleed?: boolean;
    lockAspectRatio?: boolean;
    minWidth?: number;
    minHeight?: number;
    canMaximize?: boolean;
    onFocus?: () => void;
}

const TextHighlighter = ({ text, term }: { text: string, term: string }) => {
    if (!term.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase() ? (
                    <mark key={i} className="bg-win95-blue-active text-white px-0.5">{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const HighlightResults = ({ children, term }: { children: React.ReactNode, term: string }): JSX.Element => {
    if (!term.trim()) return <>{children}</>;

    const processNode = (node: React.ReactNode): React.ReactNode => {
        if (typeof node === "string") {
            return <TextHighlighter text={node} term={term} />;
        }
        if (React.isValidElement(node)) {
            // @ts-ignore - dangerouslySetInnerHTML is a special case
            if (node.props.dangerouslySetInnerHTML) {
                const html = node.props.dangerouslySetInnerHTML.__html;
                if (typeof html === 'string') {
                    const highlightedHtml = html.replace(
                        new RegExp(`(${term})`, "gi"),
                        '<mark class="bg-win95-blue-active text-white px-0.5">$1</mark>'
                    );
                    return React.cloneElement(node as React.ReactElement<any>, {
                        dangerouslySetInnerHTML: { __html: highlightedHtml }
                    });
                }
            }
            if (node.props.children) {
                return React.cloneElement(node as React.ReactElement<any>, {
                    children: React.Children.map(node.props.children, processNode)
                });
            }
        }
        return node;
    };

    return <>{React.Children.map(children, processNode)}</>;
};

const MinimizeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="6" height="2" fill="black" />
    </svg>
);

const MaximizeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="8" height="8" stroke="black" strokeWidth="1" />
        <rect x="2" y="2" width="6" height="1" fill="black" />
    </svg>
);

const RestoreIcon = () => (
    <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="0" width="7" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="4" y="1" width="5" height="1" fill="black" />
        <rect x="0" y="3" width="7" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="1" y="4" width="5" height="1" fill="black" />
    </svg>
);

const CloseIcon = () => (
    <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L9 9M9 1L1 9" stroke="black" strokeWidth="1.5" />
    </svg>
);

export function Win95Window({
    title,
    children,
    helpContent,
    onClose,
    onMinimize,
    onMaximize,
    onPositionChange,
    onResize,
    isMaximized = false,
    isActive = true,
    x = 100,
    y = 100,
    width: propWidth,
    height: propHeight,
    dragConstraints,
    onAbout,
    iconType = "folder",
    onSave,
    fullBleed = false,
    lockAspectRatio = false,
    minWidth = 200,
    minHeight = 250,
    canMaximize = true,
    onFocus,
}: Win95WindowProps) {
    const isMobile = useIsMobile();
    const dragControls = useDragControls();

    // Default dimensions based on device
    const width = propWidth || (isMobile ? "90%" : "min(600px, 90vw)");
    const height = propHeight || (isMobile ? "90%" : "auto");

    const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
    const [isSearching, setIsSearching] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isResizing, setIsResizing] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [measuredHeight, setMeasuredHeight] = React.useState(300);
    const windowRef = React.useRef<HTMLDivElement>(null);
    const [skipAnimations, setSkipAnimations] = React.useState(false);

    // Use a ref to track the last confirmed position to prevent snap-back jitter
    const confirmedPos = React.useRef({ x, y });

    // Store last seen props to distinguish between internal drag updates and external prop changes
    const lastProps = React.useRef({ x, y });

    // Motion values for stable dragging and reactive positioning
    const xMV = useMotionValue(x);
    const yMV = useMotionValue(y);

    // Update motion values only when props actually change from an external source
    React.useEffect(() => {
        if (x !== lastProps.current.x || y !== lastProps.current.y) {
            xMV.set(x);
            yMV.set(y);
            confirmedPos.current = { x, y };
            lastProps.current = { x, y };
        }
    }, [x, y, xMV, yMV]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('skipAnimations') === 'true') {
                setSkipAnimations(true);
            }
        }
    }, []);

    // Shared drag end logic to ensure clamping happens even if onDragEnd misses the event (Firefox issue)
    const handleDragEnd = React.useCallback(() => {
        const currentX = xMV.get();
        const currentY = yMV.get();

        let clampedX = currentX;
        let clampedY = currentY;

        if (typeof window !== 'undefined') {
            clampedX = Math.max(-11, Math.min(currentX, window.innerWidth - 10));
            clampedY = Math.max(-11, currentY);
            const maxY = window.innerHeight - TASKBAR_HEIGHT - 10;
            clampedY = Math.min(clampedY, maxY);
        }

        // Sync motion values back to clamped position
        xMV.set(clampedX);
        yMV.set(clampedY);
        confirmedPos.current = { x: clampedX, y: clampedY };

        if (onPositionChange) {
            onPositionChange(clampedX, clampedY);
        }
    }, [xMV, yMV, onPositionChange]);

    // Safety cleanup for isDragging to ensure animation re-enables
    React.useEffect(() => {
        if (!isDragging) return;

        // Try to catch end of drag if onDragEnd fails (Firefox issue)
        const handleGlobalUp = () => {
            handleDragEnd();
            setIsDragging(false);
        };

        window.addEventListener('pointerup', handleGlobalUp, { capture: true });
        return () => window.removeEventListener('pointerup', handleGlobalUp, { capture: true });
    }, [isDragging, handleDragEnd]);

    // Measure window dimensions for computing drag constraints
    React.useLayoutEffect(() => {
        if (!windowRef.current || isMaximized || isMobile) return;

        const updateHeight = () => {
            const rect = windowRef.current?.getBoundingClientRect();
            if (rect && rect.height > 0 && rect.height !== measuredHeight) {
                setMeasuredHeight(rect.height);
            }
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(windowRef.current);
        return () => observer.disconnect();
    }, [isMaximized, isMobile, measuredHeight]);

    // Track window size for constraints
    const [windowSize, setWindowSize] = React.useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 800,
        height: typeof window !== 'undefined' ? window.innerHeight : 600
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            setWindowSize({ width: newWidth, height: newHeight });

            // Clamp position on resize to ensure visibility
            if (onPositionChange) {
                const maxY = newHeight - TASKBAR_HEIGHT - 10;
                const clampedX = Math.max(-11, Math.min(x, newWidth - 10));
                const clampedY = Math.max(-11, Math.min(y, maxY));
                if (clampedX !== x || clampedY !== y) {
                    onPositionChange(clampedX, clampedY);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [x, y, onPositionChange]);

    // Strict constraints. 
    // Data shows framer-motion treats these as absolute bounds in this context (possibly due to xMV usage).
    const effectiveDragConstraints = React.useMemo(() => {
        if (typeof window === 'undefined') return { top: 0, left: 0, right: 0, bottom: 0 };
        return {
            left: -11,
            top: -11,
            right: windowSize.width - 10,
            bottom: windowSize.height - TASKBAR_HEIGHT - 10
        };
    }, [windowSize]);

    const toggleMenu = (menu: string) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const handleAction = (action: () => void) => {
        action();
        setActiveMenu(null);
    };

    const handleResizeStart = (e: React.PointerEvent) => {
        if (isMaximized || isMobile) return;
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const rect = windowRef.current?.getBoundingClientRect();
        const startWidth = rect?.width || (typeof width === 'number' ? width : parseFloat(width as string) || 300);
        const startHeight = rect?.height || (typeof height === 'number' ? height : parseFloat(height as string) || 200);

        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (moveEvent: PointerEvent) => {
            if (onResize) {
                const currentX = moveEvent.clientX ?? 0;
                const currentY = moveEvent.clientY ?? 0;
                let newWidth = Math.max(minWidth, startWidth + (currentX - startX));
                let newHeight = Math.max(minHeight, startHeight + (currentY - startY));

                if (lockAspectRatio) {
                    const aspectRatio = startWidth / startHeight;
                    newHeight = newWidth / aspectRatio;
                    if (newHeight < minHeight) {
                        newHeight = minHeight;
                        newWidth = newHeight * aspectRatio;
                    }
                    if (newWidth < minWidth) {
                        newWidth = minWidth;
                        newHeight = newWidth / aspectRatio;
                    }
                }
                onResize(newWidth, newHeight);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('pointermove', handleMouseMove);
            document.removeEventListener('pointerup', handleMouseUp);
        };

        document.addEventListener('pointermove', handleMouseMove);
        document.addEventListener('pointerup', handleMouseUp);
    };

    return (
        <motion.div
            ref={windowRef}
            key={`${title}-${isMaximized ? 'max' : 'normal'}`}
            drag={!isMaximized && !isMobile}
            dragMomentum={false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={effectiveDragConstraints}
            dragElastic={0}
            onDragStart={() => {
                // Already set in onPointerDown but kept for safety
                setIsDragging(true);
            }}
            onDragEnd={() => {
                handleDragEnd();
                setIsDragging(false);
            }}
            initial={isMaximized ? { x: 0, y: 0, scale: 1, opacity: 1 } : { x: isMobile ? (typeof window !== 'undefined' ? window.innerWidth * 0.05 : 0) : x, y: isMobile ? (typeof window !== 'undefined' ? window.innerHeight * 0.05 : 0) : y, scale: 0.95, opacity: 0 }}
            animate={isMaximized
                ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 40px)', scale: 1, opacity: 1 }
                : {
                    width: isMobile ? "90%" : width,
                    height: isMobile ? "90%" : height,
                    scale: 1,
                    opacity: 1
                }
            }
            transition={skipAnimations ? { duration: 0 } : {
                type: "spring",
                stiffness: 400,
                damping: 30
            }}
            className={`win95-beveled absolute flex flex-col pointer-events-auto select-none touch-none ${isActive ? "z-50" : "z-10"}`}
            style={{
                padding: '2px',
                x: isMaximized ? 0 : xMV,
                y: isMaximized ? 0 : yMV
            }}
            data-testid={`window-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
            {/* Titlebar */}
            <div
                onPointerDown={(e) => {
                    onFocus?.();
                    if (!isMaximized) {
                        // Start drag immediately. Note: isDragging is set in onDragStart
                        // so we don't cause a re-render exactly at the same time as start()
                        dragControls.start(e);
                    }
                }}
                onDoubleClick={() => canMaximize && onMaximize?.()}
                className={`window-titlebar h-12 flex items-center justify-between px-2 cursor-default select-none ${isActive ? "bg-win95-blue-active" : "bg-win95-gray-inactive"}`}
                data-testid="window-titlebar"
            >
                <div className="flex items-center gap-2 ml-0.5 overflow-hidden">
                    <div className="flex-shrink-0">
                        <DynamicIcon iconType={iconType || "folder"} size={36} />
                    </div>
                    <span className="text-white text-[20px] font-win95 font-bold whitespace-nowrap overflow-hidden text-ellipsis leading-none mt-1">
                        {title}
                    </span>
                </div>
                <div className="flex gap-1 pr-1" onPointerDown={(e) => e.stopPropagation()}>
                    <button
                        onClick={onMinimize}
                        className="win95-button w-9 h-9 !p-0 flex items-center justify-center"
                        data-testid="window-minimize"
                        title="Minimize"
                        aria-label="Minimize"
                    >
                        <MinimizeIcon />
                    </button>
                    {canMaximize && (
                        <button
                            onClick={onMaximize}
                            className="win95-button w-9 h-9 !p-0 flex items-center justify-center"
                            data-testid="window-maximize"
                            title={isMaximized ? "Restore" : "Maximize"}
                            aria-label={isMaximized ? "Restore" : "Maximize"}
                        >
                            {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="win95-button w-9 h-9 !p-0 ml-1 flex items-center justify-center"
                        data-testid="window-close"
                        title="Close"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>

            {/* Menu Bar */}
            <div className="bg-win95-gray px-1 py-0.5 border-b border-win95-gray-inactive text-[18px] font-win95 flex gap-3 select-none leading-none relative">
                <div className="relative">
                    <span
                        className={`px-1 cursor-default font-normal ${activeMenu === 'File' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
                        onClick={() => toggleMenu('File')}
                        data-testid="menu-file"
                    >
                        File
                    </span>
                    {activeMenu === 'File' && (
                        <div className="absolute top-full left-0 mt-0.5 w-32 bg-win95-gray win95-beveled z-[100] py-0.5">
                            <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => onMaximize?.())}>Maximize</div>
                            <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => onMinimize?.())}>Minimize</div>
                            {onSave && (
                                <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => onSave())}>Save</div>
                            )}
                            <div className="w-full h-[1px] bg-win95-gray-inactive my-0.5" />
                            <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => onClose?.())}>Close</div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <span
                        className={`px-1 cursor-default font-normal ${activeMenu === 'Search' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
                        onClick={() => toggleMenu('Search')}
                    >
                        Search
                    </span>
                    {activeMenu === 'Search' && (
                        <div className="absolute top-full left-0 mt-0.5 w-32 bg-win95-gray win95-beveled z-[100] py-0.5">
                            <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => setIsSearching(!isSearching))}>
                                {isSearching ? "Close Search" : "Open Search"}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <span
                        className={`px-1 cursor-default font-normal ${activeMenu === 'Help' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
                        onClick={() => toggleMenu('Help')}
                        data-testid="menu-help"
                    >
                        Help
                    </span>
                    {activeMenu === 'Help' && (
                        <div className="absolute top-full left-0 mt-0.5 w-32 bg-win95-gray win95-beveled z-[100] py-0.5">
                            <div className="px-3 py-1 hover:bg-win95-blue-active hover:text-white cursor-default" onClick={() => handleAction(() => onAbout?.())}>About...</div>
                        </div>
                    )}
                </div>

                {activeMenu && (
                    <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
                )}
            </div>

            {/* Search Box */}
            {isSearching && (
                <div className="bg-win95-gray px-2 py-1 border-b border-win95-gray-inactive flex items-center gap-2">
                    <span className="text-[18px] font-win95">Find:</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="win95-beveled-inset px-1 text-[18px] font-win95 flex-grow outline-none"
                        autoFocus
                    />
                    <button className="win95-button px-2 text-[15px] leading-none h-8" onClick={() => setIsSearching(false)}>X</button>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-grow relative flex flex-col min-h-0 ${fullBleed ? "" : "overflow-hidden win95-beveled-inset bg-white m-1 p-4 overflow-auto scrollbar-win95 min-h-[100px]"}`}>
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-transparent" />
                )}
                <HighlightResults term={searchTerm}>
                    {children}
                </HighlightResults>
            </div>

            {/* Resize Handle */}
            {!isMaximized && !isMobile && onResize && (
                <div
                    className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize z-50 flex items-end justify-end"
                    onPointerDown={handleResizeStart}
                >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 8L2 8L8 2L8 8Z" fill="#808080" />
                        <path d="M9 9L3 9L9 3L9 9Z" fill="white" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}

