import { render, screen } from "@testing-library/react";
import { VideoGrid } from "../../../components/win95/VideoGrid";
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
        id: "ONw4XjhCiRg",
        title: "Test Video 1",
        role: "Producer",
        description: "Test description 1"
    },
    {
        id: "uRnMK2wzM20?t=10s",
        title: "Test Video 2",
        role: "Editor",
        description: "Test description 2"
    }
];

describe("VideoGrid Component", () => {
    it("renders the correct number of video cards", () => {
        renderWithOS(<VideoGrid videos={mockVideos} />);
        expect(screen.getByText("Test Video 1")).toBeInTheDocument();
        expect(screen.getByText("Test Video 2")).toBeInTheDocument();
    });

    it("renders video details correctly", () => {
        renderWithOS(<VideoGrid videos={mockVideos} />);
        expect(screen.getByText("Producer")).toBeInTheDocument();
        expect(screen.getByText("Editor")).toBeInTheDocument();
        expect(screen.getByText("Test description 1")).toBeInTheDocument();
        expect(screen.getByText("Test description 2")).toBeInTheDocument();
    });

    it("renders iframes with correct src handling query params", () => {
        const { container } = renderWithOS(<VideoGrid videos={mockVideos} />);
        const iframes = container.querySelectorAll("iframe");
        expect(iframes.length).toBe(2);

        // precise check for ID without query param
        expect(iframes[0].src).toContain("https://www.youtube.com/embed/ONw4XjhCiRg?enablejsapi=1");

        // check for ID with existing query param
        expect(iframes[1].src).toContain("https://www.youtube.com/embed/uRnMK2wzM20?t=10s&enablejsapi=1");
    });
});
