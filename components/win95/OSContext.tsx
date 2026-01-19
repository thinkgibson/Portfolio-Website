"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "../../lib/hooks";

interface OSContextType {
    registerCloseInterceptor: (id: string, interceptor: () => Promise<boolean>) => void;
    unregisterCloseInterceptor: (id: string) => void;
    closeInterceptors: Record<string, () => Promise<boolean>>;
    registerSaveHandler: (id: string, handler: () => void) => void;
    unregisterSaveHandler: (id: string) => void;
    saveHandlers: Record<string, () => void>;
    volume: number;
    setVolume: (v: number | ((prev: number) => number)) => void;
    playSound: (eventName: string) => Promise<void>;
    // Window Management
    openWindow: (id: string) => void;
    closeWindow: (id: string) => void | Promise<void>;
    runningApps: { id: string, title: string }[];
    availableApps: { id: string, title: string }[];
}

const OSContext = createContext<OSContextType | undefined>(undefined);

interface OSProviderProps {
    children: React.ReactNode;
    onOpenWindow?: (id: string) => void;
    onCloseWindow?: (id: string) => void;
    runningApps?: { id: string, title: string }[];
    availableApps?: { id: string, title: string }[];
}

export function OSProvider({
    children,
    onOpenWindow = () => { },
    onCloseWindow = () => { },
    runningApps = [],
    availableApps = []
}: OSProviderProps) {
    const [closeInterceptors, setCloseInterceptors] = useState<Record<string, () => Promise<boolean>>>({});
    const [saveHandlers, setSaveHandlers] = useState<Record<string, () => void>>({});
    const [volume, setVolume] = useLocalStorage<number>("win95-volume", 50);

    const playSound = useCallback(async (eventName: string) => {
        const { getSoundSystem } = await import("../../lib/soundSystem");
        const ss = getSoundSystem();
        ss.setVolume(volume / 100);
        await ss.playSound(eventName);
    }, [volume]);

    const registerCloseInterceptor = useCallback((id: string, interceptor: () => Promise<boolean>) => {
        setCloseInterceptors(prev => ({ ...prev, [id]: interceptor }));
    }, []);

    const unregisterCloseInterceptor = useCallback((id: string) => {
        setCloseInterceptors(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const registerSaveHandler = useCallback((id: string, handler: () => void) => {
        setSaveHandlers(prev => ({ ...prev, [id]: handler }));
    }, []);

    const unregisterSaveHandler = useCallback((id: string) => {
        setSaveHandlers(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }, []);

    const openWindow = useCallback((id: string) => {
        onOpenWindow(id);
    }, [onOpenWindow]);

    const closeWindow = useCallback(async (id: string) => {
        const interceptor = closeInterceptors[id];
        if (interceptor) {
            const allowed = await interceptor();
            if (!allowed) return;
        }
        onCloseWindow(id);
    }, [closeInterceptors, onCloseWindow]);

    return (
        <OSContext.Provider value={{
            registerCloseInterceptor,
            unregisterCloseInterceptor,
            closeInterceptors,
            registerSaveHandler,
            unregisterSaveHandler,
            saveHandlers,
            volume,
            setVolume,
            playSound,
            openWindow,
            closeWindow,
            runningApps,
            availableApps
        }}>
            {children}
        </OSContext.Provider>
    );
}

export function useOS() {
    const context = useContext(OSContext);
    if (!context) {
        throw new Error("useOS must be used within an OSProvider");
    }
    return context;
}
