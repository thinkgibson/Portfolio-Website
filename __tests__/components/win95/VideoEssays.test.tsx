import { render, screen } from "@testing-library/react";
import { VideoEssays } from "../../../components/win95/VideoEssays";
import { OSProvider } from "../../../components/win95/OSContext";

const renderWithOS = (ui: React.ReactNode) => {
    return render(
        <OSProvider>
            {ui}
        </OSProvider>
    );
};

const mockVideos = [
    {
        id: "QQ1D4H8CTPM",
        title: "Play This: VTOL VR",
        role: "Writer, Camera Operator, & Editor",
        description: "Test description"
    },
    {
        id: "Y3LEXRBtCiQ",
        title: "Stardew Valley Board Game Review",
        role: "Writer, Camera Operator, & Editor",
        description: "Test description"
    }
];

describe("VideoEssays Component", () => {
    it("renders the video essays app container", () => {
        renderWithOS(<VideoEssays videos={mockVideos} />);
        // Check for the header text
        expect(screen.getByText("Video Essays")).toBeInTheDocument();
    });

    it("renders the video list", () => {
        renderWithOS(<VideoEssays videos={mockVideos} />);
        // Check for specific video titles
        expect(screen.getByText("Play This: VTOL VR")).toBeInTheDocument();
        expect(screen.getByText("Stardew Valley Board Game Review")).toBeInTheDocument();
    });

    it("renders iframes with correct src", () => {
        const { container } = renderWithOS(<VideoEssays videos={mockVideos} />);
        const iframes = container.querySelectorAll("iframe");
        expect(iframes.length).toBe(2);
        expect(iframes[0].src).toContain("https://www.youtube.com/embed/QQ1D4H8CTPM?enablejsapi=1");
    });
});
