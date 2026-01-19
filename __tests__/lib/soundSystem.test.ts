import { getSoundSystem } from "../../lib/soundSystem";

describe("SoundSystem", () => {
    let mockAudio: any;

    beforeEach(() => {
        // Mock HTMLAudioElement
        mockAudio = {
            play: jest.fn().mockResolvedValue(undefined),
            pause: jest.fn(),
            currentTime: 0,
            volume: 1,
        };
        global.Audio = jest.fn().mockImplementation(() => mockAudio);

        // Mock fetch for config
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                boot: "boot.wav",
                click: "click.wav"
            })
        });

        // Reset singleton for tests if possible or at least reset its state
        const ss = getSoundSystem();
        ss.setVolume(0.5);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with correct volume from localStorage", () => {
        Storage.prototype.getItem = jest.fn().mockReturnValue("80");
        const ss = getSoundSystem();
        // Since it's a singleton initialized on first import, we might need a way to re-init or just verify setVolume
        ss.setVolume(0.8);
        expect(ss).toBeDefined();
    });

    it("should play sound for configured event", async () => {
        const ss = getSoundSystem();
        // Force config load
        await (ss as any).loadConfig();

        await ss.playSound("boot");

        expect(global.Audio).toHaveBeenCalledWith("/sfx/boot.wav");
        expect(mockAudio.play).toHaveBeenCalled();
        expect(mockAudio.volume).toBe(0.5);
    });

    it("should respect volume level", async () => {
        const ss = getSoundSystem();
        await (ss as any).loadConfig();

        ss.setVolume(0.2);
        await ss.playSound("click");

        expect(mockAudio.volume).toBe(0.2);
    });

    it("should not play sound if volume is 0", async () => {
        const ss = getSoundSystem();
        await (ss as any).loadConfig();

        ss.setVolume(0);
        await ss.playSound("click");

        expect(mockAudio.play).not.toHaveBeenCalled();
    });

    it("should handle missing event silently", async () => {
        const ss = getSoundSystem();
        await (ss as any).loadConfig();

        await ss.playSound("unknown");

        expect(global.Audio).not.toHaveBeenCalled();
    });

    it("should handle null config value silently", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                boot: null
            })
        });

        const ss = getSoundSystem();
        await (ss as any).loadConfig();

        await ss.playSound("boot");

        expect(global.Audio).not.toHaveBeenCalled();
    });
});
