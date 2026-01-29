import { render, screen } from "@testing-library/react";
import { Livestreams } from "../../../components/win95/Livestreams";
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
        id: "2LZj2OO5s3c",
        title: "Local Chat",
        role: "Host",
        description: "Test description"
    },
    {
        id: "RC4beBStuv8",
        title: "Extra Life",
        role: "Producer",
        description: "Test description"
    }
];

describe("Livestreams Component", () => {
    it("renders the livestreams app container", () => {
        renderWithOS(<Livestreams videos={mockVideos} />);
        expect(screen.getByText("My Livestreams")).toBeInTheDocument();
    });

    it("renders the video list", () => {
        renderWithOS(<Livestreams videos={mockVideos} />);
        expect(screen.getByText("Local Chat")).toBeInTheDocument();
        expect(screen.getByText("Extra Life")).toBeInTheDocument();
    });

    it("renders iframes with correct src", () => {
        const { container } = renderWithOS(<Livestreams videos={mockVideos} />);
        const iframes = container.querySelectorAll("iframe");
        expect(iframes.length).toBe(2);
        expect(iframes[0].src).toContain("https://www.youtube.com/embed/2LZj2OO5s3c");
        expect(iframes[0].src).toContain("enablejsapi=1");
    });
});
