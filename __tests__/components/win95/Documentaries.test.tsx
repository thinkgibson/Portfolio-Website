import { render, screen, fireEvent } from "@testing-library/react";
import { Documentaries } from "../../../components/win95/Documentaries";
import { OSProvider } from "../../../components/win95/OSContext";

// Mock the OSContext
const mockSetVolume = jest.fn();
const mockPlaySound = jest.fn();

const renderWithOS = (ui: React.ReactNode) => {
    return render(
        <OSProvider>
            {ui}
        </OSProvider>
    );
};

const mockVideos = [
    {
        id: "ONw4XjhCiRg",
        title: "Morristown Bank Vault Documentary",
        role: "Producer",
        description: "Test description"
    },
    {
        id: "uRnMK2wzM20",
        title: "Iceland documentary",
        role: "Producer",
        description: "Test description"
    }
];

describe("Documentaries Component", () => {
    it("renders the documentaries app container", () => {
        renderWithOS(<Documentaries videos={mockVideos} />);
        // Check for the header text
        expect(screen.getByText("My Documentaries")).toBeInTheDocument();
    });

    it("renders the video list", () => {
        renderWithOS(<Documentaries videos={mockVideos} />);
        // Check for specific video titles
        expect(screen.getByText("Morristown Bank Vault Documentary")).toBeInTheDocument();
        expect(screen.getByText("Iceland documentary")).toBeInTheDocument();
    });

    it("renders iframes with correct src", () => {
        const { container } = renderWithOS(<Documentaries videos={mockVideos} />);
        const iframes = container.querySelectorAll("iframe");
        expect(iframes.length).toBe(2);
        expect(iframes[0].src).toContain("https://www.youtube.com/embed/ONw4XjhCiRg?enablejsapi=1");
    });
});
