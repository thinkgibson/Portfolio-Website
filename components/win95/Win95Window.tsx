"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import { useIsMobile } from "../../lib/hooks";
import { FolderIcon, UserIcon, InboxIcon, ProgramsIcon, MyComputerIcon, NotepadIcon, CalculatorIcon, PaintIcon, TerminalIcon } from "./icons";

const TASKBAR_HEIGHT = 48;

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
    iconType?: "folder" | "about" | "contact" | "projects" | "drive" | "notepad" | "calculator" | "paint" | "terminal";
    x?: number;
    y?: number;
    width?: string | number;
    height?: string | number;
    dragConstraints?: React.RefObject<Element> | { left?: number; right?: number; top?: number; bottom?: number };
    onResize?: (width: number, height: number) => void;
    onSave?: () => void;
    fullBleed?: boolean;
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
                    // This is a bit hacky but for search highlighting in small portfolio sites
                    // we can do a simple replacement. Proper HTML parsing would be better but overkill.
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
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="8" height="3" fill="black" />
    </svg>
);

const MaximizeIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer border */}
        <rect x="1" y="1" width="10" height="10" stroke="black" strokeWidth="1" />
        {/* Inner white/empty area is mostly empty, just a border */}
        <rect x="2" y="3" width="8" height="2" fill="#000080" />
    </svg>
);

// Actually, let's keep the icon simple to match the original primitive style but centered
// The original was viewBox 0 0 8 8 which is hard to center in 16px container if not scaled perfectly
// Let's use 12x12 aligned to pixel grid

const MaximizeIconUpdated = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1.5" y="1.5" width="9" height="9" stroke="black" strokeWidth="1" />
        <rect x="2.5" y="2.5" width="7" height="1" fill="black" />
    </svg>
);
// Wait, the original code used rects for pixel perfection. Let's stick to rects but in 12x12 space.

const MaximizeIconFixed = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="9" height="9" stroke="black" strokeWidth="1" />
        <rect x="2" y="2" width="7" height="1" fill="black" />
    </svg>
);

const RestoreIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="1" width="8" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="4" y="2" width="6" height="1" fill="black" />
        <rect x="1" y="4" width="8" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="2" y="5" width="6" height="1" fill="black" />
    </svg>
);

const CloseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2l8 8m0-8l-8 8" stroke="black" strokeWidth="1.5" />
    </svg>
);

// Re-defining with precise pixel paths for authenticity
const MinimizeIconFinal = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="6" height="2" fill="black" />
    </svg>
);

const MaximizeIconFinal = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="8" height="8" stroke="black" strokeWidth="1" />
        <rect x="2" y="2" width="6" height="1" fill="black" />
    </svg>
);

const RestoreIconFinal = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="0" width="7" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="4" y="1" width="5" height="1" fill="black" />
        <rect x="0" y="3" width="7" height="7" fill="white" stroke="black" strokeWidth="1" />
        <rect x="1" y="4" width="5" height="1" fill="black" />
    </svg>
);

const CloseIconFinal = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const [measuredHeight, setMeasuredHeight] = React.useState(300);
    const windowRef = React.useRef<HTMLDivElement>(null);

    // Measure window dimensions for computing drag constraints
    React.useEffect(() => {
        if (windowRef.current && !isMaximized && !isMobile) {
            const rect = windowRef.current.getBoundingClientRect();
            if (rect.height > 0 && rect.height !== measuredHeight) {
                setMeasuredHeight(rect.height);
            }
        }
    });

    // Compute drag constraints to prevent window bottom from going below taskbar
    const computedDragConstraints = React.useMemo(() => {
        if (typeof window === 'undefined' || isMobile || isMaximized) {
            return undefined;
        }
        return {
            left: -10,
            top: -10,
            right: window.innerWidth - 100,
            bottom: window.innerHeight - TASKBAR_HEIGHT - measuredHeight,
        };
    }, [isMobile, isMaximized, measuredHeight]);

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

        // Use actual computed dimensions to avoid snapping from "min(600px)" to "300px"
        const rect = windowRef.current?.getBoundingClientRect();
        const startWidth = rect?.width || (typeof width === 'number' ? width : parseFloat(width as string) || 300);
        const startHeight = rect?.height || (typeof height === 'number' ? height : parseFloat(height as string) || 200);

        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (moveEvent: PointerEvent) => {
            if (onResize) {
                const newWidth = Math.max(200, startWidth + (moveEvent.clientX - startX));
                const newHeight = Math.max(250, startHeight + (moveEvent.clientY - startY));
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
            layout
            drag={!isMaximized && !isMobile}
            dragMomentum={false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={computedDragConstraints}
            dragElastic={0}
            onDragEnd={(_, info) => {
                if (onPositionChange) {
                    const newX = x + info.offset.x;
                    let newY = y + info.offset.y;

                    // Ensure the window's bottom edge doesn't go below the taskbar
                    if (typeof window !== 'undefined') {
                        const maxY = window.innerHeight - TASKBAR_HEIGHT - measuredHeight;
                        newY = Math.min(newY, maxY);
                    }

                    onPositionChange(newX, newY);
                }
            }}
            initial={isMaximized ? { x: 0, y: 0, scale: 1, opacity: 1 } : { x: isMobile ? (typeof window !== 'undefined' ? window.innerWidth * 0.05 : 0) : x, y: isMobile ? (typeof window !== 'undefined' ? window.innerHeight * 0.05 : 0) : y, scale: 0.95, opacity: 0 }}
            animate={isMaximized
                ? { x: 0, y: 0, width: '100vw', height: 'calc(100vh - 40px)', scale: 1, opacity: 1 }
                : {
                    x: isMobile ? (typeof window !== 'undefined' ? window.innerWidth * 0.05 : 0) : x,
                    y: isMobile ? (typeof window !== 'undefined' ? window.innerHeight * 0.05 : 0) : y,
                    width: isMobile ? "90%" : width,
                    height: isMobile ? "90%" : height,
                    scale: 1,
                    opacity: 1
                }
            }
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                layout: { duration: isResizing ? 0 : 0.2 }
            }}
            className={`win95-beveled absolute flex flex-col pointer-events-auto ${isActive ? "z-50" : "z-10"}`}
            style={{ padding: '2px' }}
            data-testid={`window-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
            {/* Titlebar */}
            <div
                onPointerDown={(e) => !isMaximized && dragControls.start(e)}
                onDoubleClick={onMaximize}
                className={`window-titlebar h-8 flex items-center justify-between px-1 cursor-default select-none ${isActive ? "bg-win95-blue-active" : "bg-win95-gray-inactive"}`}
                data-testid="window-titlebar"
            >
                <div className="flex items-center gap-2 ml-0.5 overflow-hidden">
                    <div className="flex-shrink-0">
                        {iconType === "about" && <UserIcon size={24} />}
                        {iconType === "contact" && <InboxIcon size={24} />}
                        {iconType === "projects" && <ProgramsIcon size={24} />}
                        {iconType === "drive" && <MyComputerIcon size={24} />}
                        {iconType === "notepad" && <NotepadIcon size={24} />}
                        {iconType === "calculator" && <CalculatorIcon size={24} />}
                        {iconType === "paint" && <PaintIcon size={24} />}
                        {iconType === "terminal" && <TerminalIcon size={24} />}
                        {iconType === "folder" && <FolderIcon size={24} />}
                    </div>
                    <span className="text-white text-[13px] font-win95 font-bold whitespace-nowrap overflow-hidden text-ellipsis leading-none mt-0.5">
                        {title}
                    </span>
                </div>
                <div className="flex gap-1 pr-1">
                    <button
                        onClick={onMinimize}
                        className="win95-button w-6 h-6 !p-0 flex items-center justify-center"
                        data-testid="window-minimize"
                        title="Minimize"
                        aria-label="Minimize"
                    >
                        <MinimizeIcon />
                    </button>
                    <button
                        onClick={onMaximize}
                        className="win95-button w-6 h-6 !p-0 flex items-center justify-center"
                        data-testid="window-maximize"
                        title={isMaximized ? "Restore" : "Maximize"}
                        aria-label={isMaximized ? "Restore" : "Maximize"}
                    >
                        {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}
                    </button>
                    <button
                        onClick={onClose}
                        className="win95-button w-6 h-6 !p-0 ml-1 flex items-center justify-center"
                        data-testid="window-close"
                        title="Close"
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>

            {/* Menu Bar (Optional - for authenticity) */}
            <div className="bg-win95-gray px-1 py-0.5 border-b border-win95-gray-inactive text-[12px] font-win95 flex gap-3 select-none leading-none relative">
                <div className="relative">
                    <span
                        className={`px-1 cursor-default ${activeMenu === 'File' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
                        onClick={() => toggleMenu('File')}
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
                        className={`px-1 cursor-default ${activeMenu === 'Search' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
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
                        className={`px-1 cursor-default ${activeMenu === 'Help' ? 'win95-beveled-inset bg-win95-gray' : 'hover:win95-beveled'}`}
                        onClick={() => toggleMenu('Help')}
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
                    <span className="text-[12px] font-win95">Find:</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="win95-beveled-inset px-1 text-[12px] font-win95 flex-grow outline-none"
                        autoFocus
                    />
                    <button className="win95-button px-2 text-[10px] leading-none h-4" onClick={() => setIsSearching(false)}>X</button>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-grow relative flex flex-col min-h-0 ${fullBleed ? "" : "overflow-hidden win95-beveled-inset bg-white m-1 p-4 overflow-auto scrollbar-win95 min-h-[100px]"}`}>
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
