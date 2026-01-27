import React from "react";
import { render, screen } from "@testing-library/react";
import { DynamicIcon } from "../../../components/Icons/DynamicIcon";
import "@testing-library/jest-dom";

// Mock the icons config
jest.mock("../../../config/icons.json", () => ({
    "notepad": "custom-icon.png",
    "mycomputer": null
}), { virtual: true });

describe("DynamicIcon", () => {
    it("renders an img tag when a custom icon is configured", () => {
        render(<DynamicIcon iconType="notepad" size={32} />);

        const img = screen.getByRole("img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "/icons/custom-icon.png");
        expect(img).toHaveAttribute("width", "32");
    });

    it("renders the default SVG component when no custom icon is configured", () => {
        const { container } = render(<DynamicIcon iconType="mycomputer" size={32} />);

        // Should contain an SVG (MyComputerIcon)
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();

        // Should not contain the img tag from the custom logic
        const img = Screen.queryByRole ? screen.queryByRole("img") : null;
        // SVG might have role="img" too, so check src or tagName
        if (img) {
            expect(img).not.toHaveAttribute("src", expect.stringContaining("/icons/"));
        }
    });

    it("passes through props like className", () => {
        render(<DynamicIcon iconType="notepad" className="test-class" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("test-class");
    });
});
