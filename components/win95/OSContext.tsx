"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface OSContextType {
    registerCloseInterceptor: (id: string, interceptor: () => Promise<boolean>) => void;
    unregisterCloseInterceptor: (id: string) => void;
    closeInterceptors: Record<string, () => Promise<boolean>>;
    registerSaveHandler: (id: string, handler: () => void) => void;
    unregisterSaveHandler: (id: string) => void;
    saveHandlers: Record<string, () => void>;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
    const [closeInterceptors, setCloseInterceptors] = useState<Record<string, () => Promise<boolean>>>({});
    const [saveHandlers, setSaveHandlers] = useState<Record<string, () => void>>({});

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

    return (
        <OSContext.Provider value={{
            registerCloseInterceptor,
            unregisterCloseInterceptor,
            closeInterceptors,
            registerSaveHandler,
            unregisterSaveHandler,
            saveHandlers
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
