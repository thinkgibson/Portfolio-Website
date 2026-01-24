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

describe("Documentaries Component", () => {
    it("renders the documentaries app container", () => {
        renderWithOS(<Documentaries />);
        // Check for the header text
        expect(screen.getByText("My Documentaries")).toBeInTheDocument();
        expect(screen.getByText("A collection of documentaries I've worked on.")).toBeInTheDocument();
    });

    it("renders the video list", () => {
        renderWithOS(<Documentaries />);
        // Check for specific video titles
        expect(screen.getByText("Morristown Bank Vault Documentary")).toBeInTheDocument();
        expect(screen.getByText("Iceland documentary")).toBeInTheDocument();
        expect(screen.getByText("Halo documentary")).toBeInTheDocument();
        expect(screen.getByText("The Making of Epitasis")).toBeInTheDocument();
        expect(screen.getByText("The Making of SkateBIRD")).toBeInTheDocument();
    });

    it("renders iframes with correct src", () => {
        const { container } = renderWithOS(<Documentaries />);
        const iframes = container.querySelectorAll("iframe");
        expect(iframes.length).toBe(5);
        expect(iframes[0].src).toContain("https://www.youtube.com/embed/ONw4XjhCiRg?enablejsapi=1");
    });
});
