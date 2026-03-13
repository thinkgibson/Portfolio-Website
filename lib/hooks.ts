import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}

export function useIsMobile() {
    return useMediaQuery("(max-width: 639px)");
}

export function useIsTablet() {
    return useMediaQuery("(max-width: 1024px)");
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const item = window.localStorage.getItem(key);
                if (item) {
                    setStoredValue(JSON.parse(item));
                }
                setIsLoaded(true);
            } catch (error) {
                console.error(error);
                setIsLoaded(true);
            }
        }
    }, [key]);

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export function useLongPress(callback: (e: any) => void, ms = 500) {
    const [startLongPress, setStartLongPress] = useState(false);
    const [event, setEvent] = useState<any>(null);

    useEffect(() => {
        let timer: any;
        if (startLongPress) {
            timer = setTimeout(() => {
                callback(event);
                setStartLongPress(false);
            }, ms);
        } else {
            clearTimeout(timer);
        }
        return () => clearTimeout(timer);
    }, [callback, ms, startLongPress, event]);

    return {
        onPointerDown: (e: any) => {
            setEvent(e);
            setStartLongPress(true);
        },
        onPointerUp: () => setStartLongPress(false),
        onPointerLeave: () => setStartLongPress(false),
    };
}
