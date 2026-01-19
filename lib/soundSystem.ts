"use client";

/**
 * Core sound system for playing audio events.
 * Handles configuration loading, audio caching, and volume management.
 */

interface SoundConfig {
    [key: string]: string | null;
}

class SoundSystem {
    private config: SoundConfig = {};
    private audioCache: Map<string, HTMLAudioElement> = new Map();
    private volume: number = 0.5; // Default 50%
    private initialized: boolean = false;

    constructor() {
        if (typeof window !== "undefined") {
            this.loadVolume();
            this.loadConfig();
        }
    }

    private async loadConfig() {
        try {
            const response = await fetch("/sfx/soundConfig.json");
            if (response.ok) {
                this.config = await response.json();
            }
        } catch (error) {
            console.warn("Failed to load sound config:", error);
        }
    }

    private loadVolume() {
        if (typeof window === "undefined") return;
        const savedVolume = localStorage.getItem("win95-volume");
        if (savedVolume) {
            this.volume = parseInt(savedVolume) / 100;
        }
    }

    /**
     * Updates the global volume level (0-1).
     * @param level Volume level between 0 and 1
     */
    public setVolume(level: number) {
        this.volume = Math.max(0, Math.min(1, level));
        // Update currently playing sounds if needed? 
        // For simple SFX, we usually just update future playbacks.
    }

    /**
     * Plays a sound mapped to the given event name.
     * @param eventName The name of the event (e.g., 'boot', 'click')
     */
    public async playSound(eventName: string) {
        if (typeof window === "undefined" || this.volume === 0) return;

        const soundFile = this.config[eventName];
        if (!soundFile) {
            // Silently skip if event not configured or null
            return;
        }

        try {
            const url = soundFile.startsWith("http") ? soundFile : `/sfx/${soundFile}`;
            let audio = this.audioCache.get(url);

            if (!audio) {
                audio = new Audio(url);
                this.audioCache.set(url, audio);
            }

            audio.volume = this.volume;
            // Reset to beginning if already playing
            audio.currentTime = 0;

            await audio.play();
        } catch (error) {
            // Standard browser autoplay policy or missing file error
            if (process.env.NODE_ENV !== 'production') {
                console.warn(`Sound playback failed for event "${eventName}":`, error);
            }
        }
    }

    public isInitialized() {
        return this.initialized;
    }
}

// Singleton instance
let soundSystemInstance: SoundSystem | null = null;

export function getSoundSystem() {
    if (typeof window === "undefined") {
        return {
            playSound: async () => { },
            setVolume: () => { },
            isInitialized: () => false
        } as any;
    }
    if (!soundSystemInstance) {
        soundSystemInstance = new SoundSystem();
    }
    return soundSystemInstance;
}
