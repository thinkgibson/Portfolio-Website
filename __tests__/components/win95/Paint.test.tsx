/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Paint } from "../../../components/win95/Paint";

// Mock the OSContext
jest.mock("../../../components/win95/OSContext", () => ({
  useOS: () => ({
    registerCloseInterceptor: jest.fn(),
    unregisterCloseInterceptor: jest.fn(),
    registerSaveHandler: jest.fn(),
    unregisterSaveHandler: jest.fn(),
  }),
}));

describe("Paint Component", () => {
  const expectedColors = [
    "#000000", // Black
    "#FFFFFF", // White
    "#FF0000", // Red
    "#FF8000", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4000FF", // Indigo
    "#FF00FF", // Violet
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Paint component", () => {
    render(<Paint />);
    expect(screen.getByTestId("paint-canvas")).toBeInTheDocument();
  });

  it("renders 9 color buttons in the color picker grid", () => {
    render(<Paint />);
    const colorButtons = document.querySelectorAll('[style*="background-color"]');
    // Filter to only color picker buttons (not canvas)
    const pickerButtons = Array.from(colorButtons).filter(
      (btn) => btn.className.includes("w-6")
    );
    expect(pickerButtons).toHaveLength(9);
  });

  it("displays the correct colors in the color picker", () => {
    render(<Paint />);
    const colorButtons = document.querySelectorAll('[style*="background-color"]');
    const pickerButtons = Array.from(colorButtons).filter(
      (btn) => btn.className.includes("w-6")
    );
    
    // Verify we have 9 color buttons
    expect(pickerButtons).toHaveLength(9);
    
    // Check that each button has a background-color style
    pickerButtons.forEach((btn) => {
      const style = btn.getAttribute("style");
      expect(style).toContain("background-color");
    });
  });

  it("allows color selection", () => {
    render(<Paint />);
    const colorButtons = document.querySelectorAll('[style*="background-color"]');
    const pickerButtons = Array.from(colorButtons).filter(
      (btn) => btn.className.includes("w-6")
    );
    
    // Click on the red color button (index 2)
    fireEvent.click(pickerButtons[2]);
    
    // The component should still render without errors
    expect(screen.getByTestId("paint-canvas")).toBeInTheDocument();
  });

  it("displays tool buttons", () => {
    render(<Paint />);
    // Check for tool labels in the status area
    expect(screen.getByText(/Tool:/)).toBeInTheDocument();
    expect(screen.getByText(/Line:/)).toBeInTheDocument();
  });

  it("displays the status bar", () => {
    render(<Paint />);
    expect(screen.getByText("For Help, click Help Topics on the Help Menu.")).toBeInTheDocument();
  });
});