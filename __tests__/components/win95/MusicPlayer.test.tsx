import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MusicPlayer } from "../../../components/win95/MusicPlayer";
import { OSProvider } from "../../../components/win95/OSContext";

// Mock fetch for soundConfig.json
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            tracks: [
                { title: "Test Track", file: "test.mp3" }
            ]
        }),
    })
) as jest.Mock;

describe("MusicPlayer", () => {
    const renderWithContext = () => {
        return render(
            <OSProvider>
                <MusicPlayer />
            </OSProvider>
        );
    };

    it("renders the player with no track selected initially", async () => {
        renderWithContext();
        expect(screen.getByText(/No Track Selected/i)).toBeInTheDocument();
        // Wait for fetch to resolve to avoid act() warning
        await screen.findAllByText("Test Track");
    });

    it("renders control buttons", async () => {
        renderWithContext();
        expect(screen.getByTitle(/Play/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Stop/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Previous/i)).toBeInTheDocument();
        expect(screen.getByTitle(/Next/i)).toBeInTheDocument();
        await screen.findAllByText("Test Track");
    });

    it("toggles play state when play button is clicked", async () => {
        renderWithContext();
        const playButton = screen.getByTitle(/Play/i);
        fireEvent.click(playButton);
        expect(screen.getByTitle(/Pause/i)).toBeInTheDocument();
        await screen.findAllByText("Test Track");
    });
});
